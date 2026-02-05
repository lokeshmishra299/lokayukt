<?php

namespace App\Http\Controllers\api\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmployeesController extends Controller
{
     public function index(){
        //  $topics = Topics::get();
        // // dd($topics->toArray());
        // return ApiResponse::generateResponse('success','Topics fetch successfully',$topics);
     }

     public function fetch_topics(){

        $topics = Topics::get();
        // dd($topics->toArray());
        return ApiResponse::generateResponse('success','Topics fetch successfully',$topics);
    }
    public function fetch_fileType(){

        $fileType = EmployeeFiles::get();
        // dd($fileType->toArray());
        return ApiResponse::generateResponse('success','Topics fetch successfully',$fileType);
    }

      public function uploadFiles(Request $request)
{
    $added_by = Auth::user()->id;

    // Validation for multiple files
    $validation = Validator::make($request->all(), [

        // 'complain_id' => 'required|numeric',
        'type'        => 'required|string',
        'title'       => 'required|string',

        // Multiple file validation
        'file'        => 'required|array',
        'file.*'      => 'file|mimes:jpg,jpeg,png,pdf|max:2048',

    ], [

        // 'complain_id.required' => 'Complaint Id is required.',
        'type.required'        => 'Complaint description is required.',
        'title.required'       => 'Letter Subject is Required.',
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

            $compDoc = new ComplainDocuments();
            $compDoc->complain_id = $request->complain_id;
            $compDoc->added_by   = $added_by;
            $compDoc->type       = $request->type;
            $compDoc->title      = $request->title;
            $compDoc->file       = $fileName;

            $compDoc->save();

            $uploadedFiles[] = $compDoc;
        }

        return response()->json([
            'status'  => true,
            'message' => 'Documents uploaded successfully.',
            'data'    => $uploadedFiles
        ], 201);
    }

    return response()->json([
        'status' => false,
        'message' => 'No files found.'
    ], 400);
}
}
