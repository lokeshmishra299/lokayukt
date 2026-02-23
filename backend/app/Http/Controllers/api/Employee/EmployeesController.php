<?php

namespace App\Http\Controllers\api\Employee;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\ComplainActionPersonalFile;
use App\Models\EmployeeFilePermission;
use Illuminate\Http\Request;
use App\Models\EmployeeFiles;
use App\Models\EmployeeUploadFiles;
use App\Models\User;
use Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class EmployeesController extends Controller
{
    public function index()
    {
        // dd("lok0");
        $user = Auth::user()->id;
        $empfiles = EmployeeUploadFiles::where('added_by', $user)
        ->where('type', 'Letter')
        ->get();
        // dd($empfiles->toArray());
        return ApiResponse::generateResponse('success', 'Records fetch successfully', $empfiles);
    }


     public function fileDetails($id)
    {
        // dd("lok0");
        // $user = Auth::user()->id;
        $empfiles = EmployeeUploadFiles::where('id',$id)
        // ->where('type', 'Letter')
        ->get();
        // dd($empfiles->toArray());
        return ApiResponse::generateResponse('success', 'Records fetch successfully', $empfiles);
    }


     public function viewPersonalFile()
    {
        // dd("lok0");
        $user = Auth::user()->id;
        $empfiles = EmployeeUploadFiles::where('added_by', $user)
        ->where('type', 'Personal File')
        ->get();
        // dd($empfiles->toArray());
        return ApiResponse::generateResponse('success', 'Records fetch successfully', $empfiles);
    }

    public function fetch_topics()
    {

        $topics = Topics::get();
        // dd($topics->toArray());
        return ApiResponse::generateResponse('success', 'Topics fetch successfully', $topics);
    }
    public function fetch_fileType()
    {

        $fileType = EmployeeFiles::get();
        // dd($fileType->toArray());
        return ApiResponse::generateResponse('success', 'Files fetch successfully', $fileType);
    }

    public function uploadFiles(Request $request)
    {
        $added_by = Auth::user()->id;

        // Validation for multiple files
        $validation = Validator::make($request->all(), [

            // 'complain_id' => 'required|numeric',
            'title'       => 'required|string',
            'type'        => 'required|string',

            // Multiple file validation
            'file'        => 'required|array',
            'file.*'      => 'file|mimes:jpg,jpeg,png,pdf|max:2048',

        ], [

            // 'complain_id.required' => 'Complaint Id is required.',
            'title.required'       => 'Letter Subject is Required.',
            'type.required'        => 'Complaint description is required.',
            'file.required'        => 'At least one file is required.',
            'file.array'           => 'Invalid file format.',
            'file.*.mimes'         => 'Only JPG, PNG and PDF files are allowed.',
            'file.*.max'           => 'Each file must be less than 2MB.',

        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        if ($request->hasFile('file')) {

            $uploadedFiles = [];

            foreach ($request->file('file') as $uploadedFile) {

                $fileName = 'doc_' . uniqid() . '.' . $uploadedFile->getClientOriginalExtension();

                $filePath = $uploadedFile->storeAs('employeeFiles', $fileName, 'public');

                $compDoc = new EmployeeUploadFiles();
                $compDoc->added_by   = $added_by;
                $compDoc->type       = "Letter";
                $compDoc->title      = $request->title;
                $compDoc->file       = $fileName;

                $compDoc->save();

                $uploadedFiles[] = $compDoc;
            }

            return response()->json([
                'status'  => true,
                'message' => 'Files uploaded successfully.',
                'data'    => $uploadedFiles
            ], 201);
        }

        return response()->json([
            'status' => false,
            'message' => 'No files found.'
        ], 400);
    }



    public function uploadPrivateFiles(Request $request)
{
    $user = Auth::user();
    $added_by = $user->id;

    $validation = Validator::make($request->all(), [
        'title'  => 'required|string',
        'type'   => 'required|string',
        'file'   => 'required|array',
        'file.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
    ]);

    if ($validation->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validation->errors()
        ], 422);
    }

    $uploadedFiles = [];

    foreach ($request->file('file') as $uploadedFile) {

        $fileName = 'doc_' . uniqid() . '.' . $uploadedFile->getClientOriginalExtension();
        $uploadedFile->storeAs('employeeFiles', $fileName, 'public');

        $file = EmployeeUploadFiles::create([
            'added_by' => $added_by,
            'type'     => "Personal File",
            'title'    => $request->title,
            'file'     => $fileName,
            'permission_user_id' => $added_by,
            'is_forward' => 0
        ]);

        ComplainActionPersonalFile::create([
            'file_id'      => $file->id,
            'subject'      => $request->title,
            'remarks'      => 'File Uploaded',
            'action_date'  => now(),
            'type'         => 1,
            'status'       => 'Verified',
            'uploaded_by_admin' => $added_by
        ]);

        $uploadedFiles[] = $file;
    }

    return response()->json([
        'status'  => true,
        'message' => 'Files uploaded successfully with tracking.',
        'data'    => $uploadedFiles
    ], 201);
}



public function privateFilesPermissionById($id)
{

    $users = User::where('users.role_id', 3) 
        ->leftJoin('employee_file_permissions as p', function($join) use ($id){
            $join->on('users.id', '=', 'p.user_id')
                 ->where('p.file_id', $id);
        })
        ->select(
            'users.id',
            'users.name',
            'users.role_id',
            DB::raw('IFNULL(p.can_view,0) as can_view'),
            DB::raw('IFNULL(p.can_edit,0) as can_edit')
        )
        ->get();

    return response()->json([
        'status' => true,
        'message' => 'File permission list fetched successfully',
        'data' => $users
    ]);
}



    public function getFilePreview($id)
    {

        $cmpDetail = EmployeeUploadFiles::findOrFail($id);

        // Correct path
        $path = Storage::url('employeeFiles/' . $cmpDetail->file);

        $cmpDetail->filepath = $path;

        return response()->json([
            'status' => true,
            'message' => 'File Fetch successfully',
            'data' => $path,
        ]);
    }



    public function giveFilePermission(Request $request)
{
    $request->validate([
        'file_id' => 'required|integer|exists:employee_files,id',
        'permissions' => 'required|array',
        'permissions.*.user_id' => 'required|integer|exists:users,id',
        'permissions.*.view' => 'required|boolean',
        'permissions.*.edit' => 'required|boolean',
    ]);

    $adminId = Auth::id();

    foreach($request->permissions as $perm){

        EmployeeFilePermission::updateOrCreate(
            [
                'file_id' => $request->file_id,
                'user_id' => $perm['user_id']
            ],
            [
                'can_view' => $perm['view'],
                'can_edit' => $perm['edit'],
                'given_by' => $adminId
            ]
        );
    }

    return response()->json([
        'status' => true,
        'message' => 'Permissions assigned successfully'
    ]);
}

 public function personalFileList()
{
    $userId = auth()->id();

    $files = EmployeeUploadFiles::whereHas('permissions', function($q) use ($userId){
            $q->where('user_id', $userId)
              ->where('can_view', 1);
        })
        ->get();

    return ApiResponse::generateResponse(
        'success',
        'Employee personal files fetched successfully',
        $files,
        200
    );
}
  public function personalFileListById($id)
{
    $userId = auth()->id();

    $file = EmployeeUploadFiles::where('id', $id)
        ->where(function($q) use ($userId) {
            $q->where('added_by', $userId)
              ->orWhereHas('permissions', function($p) use ($userId){
                    $p->where('user_id', $userId)
                      ->where('can_view', 1);
              });
        })
        ->with(['permissions' => function($q) use ($userId){
            $q->where('user_id', $userId);
        }])
        ->first();

    if (!$file) {
        return ApiResponse::generateResponse(
            'error',
            'File not found or you do not have permission to view it',
            null,
            404
        );
    }

    // Default permissions
    $canView = 0;
    $canEdit = 0;

    if ($file->added_by == $userId) {
        // Admin uploader full rights
        $canView = 1;
        $canEdit = 1;
    } elseif ($file->permissions->first()) {
        $canView = $file->permissions->first()->can_view;
        $canEdit = $file->permissions->first()->can_edit;
    }

    $file->can_view = $canView;
    $file->can_edit = $canEdit;

    return ApiResponse::generateResponse(
        'success',
        'Employee personal file details fetched successfully',
        $file,
        200
    );
}

    public function sendPersonalFile(Request $request)
    {
        $request->validate([
            'file_id' => 'required|exists:employee_files,id',
            'to_user_id' => 'required|exists:users,id',
            'action_date' => 'nullable|date',
            'remark' => 'nullable|string'
        ]);

        // Step 1: File uthao
        $file = EmployeeUploadFiles::find($request->file_id);
        if (!$file) {
            return response()->json([
                'status' => false,
                'message' => 'File not found'
            ], 404);
        }

        $fromUserId = $file->permission_user_id ?? $file->added_by;

        $toUser = User::with(['role', 'subrole'])->find($request->to_user_id);
        if (!$toUser) {
            return response()->json([
                'status' => false,
                'message' => 'Recipient user not found'
            ], 404);
        }

        $data = [
            'file_id' => $file->id,
            'subject' => $file->title ?? null,
            'remarks' => $request->remark,
            'action_date' => $request->action_date ?? now(),
            'type' => 1,
            'status' => 'Forwarded',
        ];

        if ($toUser->role->name == 'supervisor') {
            $data['forward_to_rk'] = $toUser->id;
            $data['forward_by_rk'] = $fromUserId;
        } elseif ($toUser->subrole->name == 'cio-io') {
            $data['forward_to_cio_io'] = $toUser->id;
            $data['forward_by_cio_io'] = $fromUserId;
        } elseif ($toUser->role->name == 'ro') {
            $data['forward_to_ro'] = $toUser->id;
            $data['forward_by_ro'] = $fromUserId;
        } elseif ($toUser->subrole->name == 'ds') {
            $data['forward_to_ds'] = $toUser->id;
            $data['forward_by_ds'] = $fromUserId;
        }

        $history = ComplainActionPersonalFile::create($data);

        $file->permission_user_id = $toUser->id;
        $file->is_forward = 1;
        $file->save();

        return response()->json([
            'status' => true,
            'message' => 'File forwarded successfully',
            'data' => [
                'history' => $history,
                'to_user' => [
                    'id' => $toUser->id,
                    'name' => $toUser->name,
                    'role' => $toUser->role->name ?? null,
                    'subrole' => $toUser->subrole->name ?? null
                ]
            ]
        ]);
    }
}
