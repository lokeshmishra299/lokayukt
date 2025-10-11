<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ComplainType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ComplaintsController extends Controller
{
    public function complaint_register(Request $request)
    {
        // dd($request->all());
        // $user = $request->user()->id;
        $added_by = Auth::user()->id;
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'mobile' => 'required|digits_between:10,15',
            'address' => 'required|string|max:255',
            'district_id' => 'required|exists:district_master,district_code',
            'email' => 'required|email|unique:complaints,email',
            'dob' => 'nullable|date',
            // 'fee_exempted' => 'required|boolean',
            'department' => 'required',
            'officer_name' => 'required|string|max:255',
            'designation' => 'required',
            'category' => 'required',
            'subject' => 'required',
            'nature' => 'required',
            'description' => 'required|string',
            'title' => 'required|string',
            'file' =>  'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ], [
            'name.required' => 'Name is required.',
            'mobile.required' => 'Mobile number is required.',
            'mobile.digits_between' => 'Mobile number must be between 10 to 15 digits.',
            'address.required' => 'Address is required.',
            'district_id.required' => 'District is required.',
            'district_id.exists' => 'District does not exist.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already registered.',
            'dob.date' => 'Date of Birth must be a valid date.',
            // 'fee_exempted.required' => 'Please specify if fee is exempted or not.',
            'department.required' => 'Department is required.',
            'officer_name.required' => 'Officer name is required.',
            'designation.required' => 'Designation is required.',
            'category.required' => 'Category is required.',
            'subject.required' => 'Subject is required.',
            'nature.required' => 'Nature of complaint is required.',
            'description.required' => 'Complaint description is required.',
            'title.required' => 'Letter Subject is Required',
            'file.required' => 'File is Required',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

     
        $complaint = new Complaint();
        $complaint->name = $request->name;
        $complaint->complain_no = $complaintNo ?? null;
        $complaint->mobile = $request->mobile;
        $complaint->address = $request->address;
        $complaint->district_id = $request->district_id;
        $complaint->email = $request->email;
        $complaint->amount = $request->amount;
        $complaint->challan_no = $request->challan_no;
        $complaint->dob = $request->dob;
        $complaint->fee_exempted = $request->fee_exempted ? 1 : 0;
        $complaint->department_id = $request->department;
        $complaint->officer_name = $request->officer_name;
        $complaint->designation_id = $request->designation;
        $complaint->category = $request->category;
        // $complaint->added_by = $added_by;
        $complaint->subject_id = $request->subject;
        $complaint->complaintype_id = $request->nature;
        $complaint->description = $request->description;
        $complaint->title = $request->title;
        
        $file = 'letter_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
        $filePath = $request->file('file')->storeAs('letters', $file, 'public');
        $complaint->file = $file;
        
        $complaint->save(); // ✅ Insert into DB

           // MP2024ALG001
        $year = date('Y');
        if($request->nature){
         $com_type = ComplainType::find($request->nature);
         $str = strtoupper(substr($com_type->name, 0, 3));

        }
   
        $complaintNo = 'UP'.$year.$str.str_pad($complaint->id,8, '0',STR_PAD_LEFT);
        $complaint->where('id',$complaint->id)->update(['complain_no' => $complaintNo]);
       

        return response()->json([
            'status' => true,
            'message' => 'Complaint registered successfully.',
            'data' => $complaint
        ], 201);
    }

    public function checkduplicateStoreComplain(Request $request)
    {
        DB::beginTransaction();

        try {
            // Find duplicate complaint by title + name
            // $existingComplaint = Complaint::where('title', $request->title)
            //     ->where('name', $request->name)
            //     ->first();
            $existingComplaint = Complaint::where('title', 'LIKE', "%{$request->title}%")
        ->where('name', 'LIKE', "%{$request->name}%")
        ->first();

            if ($existingComplaint) {
                // Decode existing description (JSON) into array
                $descriptions = $existingComplaint->description ? json_decode($existingComplaint->description, true) : [];

                // Add new description entry with timestamp
                $descriptions[] = [
                    'text' => $request->description,
                    'added_at' => now()->toDateTimeString(),
                ];

                // Save back as JSON
                $existingComplaint->description = json_encode($descriptions);
                $existingComplaint->save();

                DB::commit();
                return response()->json([
                    'message' => 'Duplicate found. Description merged into existing complaint.',
                    'complaint' => $existingComplaint
                ], 200);
            }

            // Otherwise, create a new complaint with description as JSON array
            $complaint = new Complaint();
            $complaint->name = $request->name;
            $complaint->complain_no = $complaintNo ?? null;
            $complaint->mobile = $request->mobile;
            $complaint->address = $request->address;
            $complaint->district_id = $request->district_id;
            $complaint->email = $request->email;
            $complaint->amount = $request->amount;
            $complaint->challan_no = $request->challan_no;
            $complaint->dob = $request->dob;
            $complaint->fee_exempted = $request->fee_exempted;
            $complaint->department_id = $request->department;
            $complaint->officer_name = $request->officer_name;
            $complaint->designation_id = $request->designation;
            $complaint->category = $request->category;
            $complaint->subject_id = $request->subject;
            $complaint->complaintype_id = $request->nature;
            $complaint->title = $request->title;

            // Store description as JSON array
            $complaint->description = json_encode([[
                'text' => $request->description,
                'added_at' => now()->toDateTimeString(),
            ]]);

            $complaint->save();

            DB::commit();
            return response()->json([
                'message' => 'Complaint created successfully.',
                'complaint' => $complaint
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function editComplain($id){
        $cmpedit = Complaint::findOrFail($id);

        return response()->json([
                'status' => true,
                'message' => 'Complaint fetch successfully.',
                'data' => $cmpedit
            ], 200);
    }

    public function updateComplain(Request $request,$id){
        $added_by = Auth::user()->id;
            $validation = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'mobile' => 'required|digits_between:10,15',
                'address' => 'required|string|max:255',
                'district_id' => 'required|exists:district_master,district_code',
                'email' => 'required|email|unique:complaints,email',
                'dob' => 'nullable|date',
                'fee_exempted' => 'required|boolean',
                'department' => 'required',
                'officer_name' => 'required|string|max:255',
                'designation' => 'required',
                'category' => 'required',
                'subject' => 'required',
                'nature' => 'required',
                'description' => 'required|string',
                'title' => 'required|string',
                'file' =>  'file|mimes:jpg,jpeg,png,pdf|max:2048',
            ], [
                'name.required' => 'Name is required.',
                'mobile.required' => 'Mobile number is required.',
                'mobile.digits_between' => 'Mobile number must be between 10 to 15 digits.',
                'address.required' => 'Address is required.',
                'district_id.required' => 'District is required.',
                'district_id.exists' => 'District does not exist.',
                'email.required' => 'Email is required.',
                'email.email' => 'Please enter a valid email address.',
                'email.unique' => 'This email is already registered.',
                'dob.date' => 'Date of Birth must be a valid date.',
                'fee_exempted.required' => 'Please specify if fee is exempted or not.',
                'department.required' => 'Department is required.',
                'officer_name.required' => 'Officer name is required.',
                'designation.required' => 'Designation is required.',
                'category.required' => 'Category is required.',
                'subject.required' => 'Subject is required.',
                'nature.required' => 'Nature of complaint is required.',
                'description.required' => 'Complaint description is required.',
                'title.required' => 'Letter Subject is Required',
                // 'file.required' => 'File is Required',
            ]);

            if ($validation->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validation->errors()
                ], 422);
            }

        
            $complaint = Complaint::findOrFail($id);
            $complaint->name = $request->name;
            $complaint->complain_no = $complaintNo ?? null;
            $complaint->mobile = $request->mobile;
            $complaint->address = $request->address;
            $complaint->district_id = $request->district_id;
            $complaint->email = $request->email;
            $complaint->amount = $request->amount;
            $complaint->challan_no = $request->challan_no;
            $complaint->dob = $request->dob;
            $complaint->fee_exempted = $request->fee_exempted;
            $complaint->department_id = $request->department;
            $complaint->officer_name = $request->officer_name;
            $complaint->designation_id = $request->designation;
            $complaint->category = $request->category;
            $complaint->added_by = $added_by;
            $complaint->subject_id = $request->subject;
            $complaint->complaintype_id = $request->nature;
            $complaint->description = $request->description;
            $complaint->title = $request->title;
            
            $file = 'letter_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
            $filePath = $request->file('file')->storeAs('letters', $file, 'public');
            $complaint->file = $file;
            
            $complaint->save(); // ✅ Insert into DB

            // MP2024ALG001
            $year = date('Y');
            if($request->nature){
            $com_type = ComplainType::find($request->nature);
            $str = strtoupper(substr($com_type->name, 0, 3));

            }
    
            $complaintNo = 'UP'.$year.$str.str_pad($complaint->id,8, '0',STR_PAD_LEFT);
            $complaint->where('id',$complaint->id)->update(['complain_no' => $complaintNo]);
        

            return response()->json([
                'status' => true,
                'message' => 'Complaint update successfully.',
                'data' => $complaint
            ], 201);
    }

    public function checkDuplicate()
    {
        $complaints = Complaint::all();
        $duplicates = [];
        $checked = [];

        foreach ($complaints as $complaint) {
            foreach ($complaints as $other) {
                if ($complaint->id !== $other->id && !in_array([$other->id, $complaint->id], $checked)) {
                    $matchCount = 0;
                    $totalFields = 0;

                    // Fields to compare
                    $fields = ['name', 'mobile', 'email', 'subject', 'district_id'];

                    foreach ($fields as $field) {
                        $totalFields++;
                        if (!empty($complaint->$field) && $complaint->$field == $other->$field) {
                            $matchCount++;
                        }
                    }

                    $percentage = ($totalFields > 0) ? ($matchCount / $totalFields) * 100 : 0;

                    if ($percentage >= 50) {
                        $duplicates[] = [
                            'complaint_id'   => $complaint->id,
                            'name'           => $complaint->name,
                            'subject'        => $complaint->subject,
                            'district_id'    => $complaint->district_id,

                            'duplicate_with' => $other->id,
                            'dup_name'       => $other->name,
                            'dup_subject'    => $other->subject,
                            'dup_district_id'=> $other->district_id,

                            'match_percentage' => round($percentage, 2)
                        ];

                        // Mark pair as checked
                        $checked[] = [$complaint->id, $other->id];
                    }
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Duplicate check completed',
            'duplicates' => $duplicates
        ]);
    }

}
