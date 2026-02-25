<?php

namespace App\Http\Controllers\api\Operator;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ComplainType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OperatorComplaintsControllerOld extends Controller
{
    public function addComplaint(Request $request)
    {
        // dd($request->all());
        // $user = $request->user()->id;
        $added_by = Auth::user();
        // dd($added_by);
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'mobile' => 'required|digits:10,15',
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

        if(isset($request->complaint_id)){
            $compUpdate = Complaint::findOrFail($request->complaint_id);
            
                $compUpdate->name = $request->name;
                $compUpdate->complain_no = $compUpdateNo ?? null;
                $compUpdate->mobile = $request->mobile;
                $compUpdate->address = $request->address;
                $compUpdate->district_id = $request->district_id;
                $compUpdate->email = $request->email;
                $compUpdate->amount = $request->amount;
                $compUpdate->challan_no = $request->challan_no;
                $compUpdate->dob = $request->dob;
                $compUpdate->fee_exempted = $request->fee_exempted ? 1 : 0;
                $compUpdate->department_id = $request->department;
                $compUpdate->officer_name = $request->officer_name;
                $compUpdate->designation_id = $request->designation;
                $compUpdate->category = $request->category;
                $compUpdate->added_by = $added_by;
                $compUpdate->subject_id = $request->subject;
                $compUpdate->complaintype_id = $request->nature;
                $compUpdate->description = $request->description;
                $compUpdate->title = $request->title;
                
                $file = 'letter_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
                $filePath = $request->file('file')->storeAs('letters', $file, 'public');
                $compUpdate->file = $file;
            //     if(){
            //         $compUpdate->in_draft = 1;
            //    }
                $compUpdate->save();
                $year = date('Y');
                if($request->nature){
                $com_type = ComplainType::find($request->nature);
                $str = strtoupper(substr($com_type->name, 0, 3));

                }
        
                $complaintNo = 'UP'.$year.$str.str_pad($compUpdate->id,8, '0',STR_PAD_LEFT);
                $compUpdate->where('id',$compUpdate->id)->update(['complain_no' => $complaintNo]);
            

                return response()->json([
                    'status' => true,
                    'message' => 'Complaint Update successfully.',
                    'data' => $compUpdate
                ], 201);
        }else{
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
            'message' => 'Complaint registered successfully.',
            'data' => $complaint
        ], 201);
        }
     
      
    }

    public function checkduplicateStoreComplain(Request $request)
    {
        // DB::beginTransaction();

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
                $existdescriptions = $existingComplaint->description ? $existingComplaint->description: '';
                
                // Add new description entry with timestamp
                // $descriptions[] = [
                //     'text' => $request->description,
                //     'added_at' => now()->toDateTimeString(),
                // ];

                // Save back as JSON
                // $existingComplaint->description = $request->description;
                // $existingComplaint->save();

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
            $complaint->description = $request->description;
                

            $complaint->save();

            // DB::commit();
            return response()->json([
                'message' => 'Complaint created successfully.',
                'complaint' => $complaint
            ], 201);

        } catch (\Exception $e) {
            // DB::rollBack();
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
                'email' => 'required',
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
                'file' =>  'file|mimes:jpg,jpeg,png,pdf|max:2048',
            ], [
                'name.required' => 'Name is required.',
                'mobile.required' => 'Mobile number is required.',
                'mobile.digits_between' => 'Mobile number must be between 10 to 15 digits.',
                'address.required' => 'Address is required.',
                'district_id.required' => 'District is required.',
                'district_id.exists' => 'District does not exist.',
                'email.required' => 'Email is required.',
                // 'email.email' => 'Please enter a valid email address.',
                // 'email.unique' => 'This email is already registered.',
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
            // $complaint->complain_no = $complaintNo ?? null;
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
            
            if($request->hasFile('file')){
                    $file = 'letter_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
            $filePath = $request->file('file')->storeAs('letters', $file, 'public');
            $complaint->file = $file;
            }

            
            
            $complaint->save(); // ✅ Insert into DB

            // MP2024ALG001
            $year = date('Y');
            if($request->nature){
            $com_type = ComplainType::find($request->nature);
            $str = strtoupper(substr($com_type->name, 0, 3));

            }
    
            // $complaintNo = 'UP'.$year.$str.str_pad($complaint->id,8, '0',STR_PAD_LEFT);
            // $complaint->where('id',$complaint->id)->update(['complain_no' => $complaintNo]);
        

            return response()->json([
                'status' => true,
                'message' => 'Complaint update successfully.',
                'data' => $complaint
            ], 201);
    }

    public function checkDuplicate(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'title' => 'required|string',
            // 'mobile' => 'required|digits_between:10,15',
            // 'district_id' => 'required|exists:district_master,district_code',
            // 'email' => 'required',
        ], [
            'name.required' => 'Name is required.',
            'title.required' => 'Letter Subject is Required',
            // 'mobile.required' => 'Mobile number is required.',
            // 'mobile.digits_between' => 'Mobile number must be between 10 to 15 digits.',
            // 'district_id.required' => 'District is required.',
            // 'district_id.exists' => 'District does not exist.',
            // 'email.required' => 'Email is required.',

        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

                $existingComplaint = Complaint::where('title', 'LIKE', "%{$request->title}%")
        ->where('name', 'LIKE', "%{$request->name}%")
        ->first();
            // dd($existingComplaint);
            if ($existingComplaint) {
                // Decode existing description (JSON) into array
                // $existdescriptions = $existingComplaint->description ? $existingComplaint->description: '';
                $percent = null;
                if($request->name == $existingComplaint->name){
                    $percent+=50;
                }elseif($request->title == $existingComplaint->title){
                    $percent+=50;
                }
                $existingComplaint->match = $percent;
                // Add new description entry with timestamp
                // $descriptions[] = [
                //     'text' => $request->description,
                //     'added_at' => now()->toDateTimeString(),
                // ];

                // Save back as JSON
                // $existingComplaint->description = $request->description;
                // $existingComplaint->save();

       
                return response()->json([
                    'message' => 'Duplicate found. Description merged into existing complaint.',
                    'complaint' => $existingComplaint
                ], 200);
            }

        // $complaints = Complaint::all();
        // $duplicates = [];
        // $checked = [];
       
   
        // foreach ($request->all() as $k =>$complaint) {
        //     //   dd($k);
        //     foreach ($complaints as $key => $other) {
        //         // dd($complaint,$other->name);
        //         if ($k == $other->name) {
        //             $matchCount = 0;
        //             $totalFields = 0;

        //             // Fields to compare
        //             $fields = ['name', 'mobile', 'email', 'subject', 'district_id','title'];

        //             foreach ($fields as $field) {
        //                 $totalFields++;
        //                 if (!empty($complaint->$field) && $complaint->$field == $other->$field) {
        //                     $matchCount++;
        //                 }
        //             }

        //             $percentage = ($totalFields > 0) ? ($matchCount / $totalFields) * 100 : 0;

        //             if ($percentage >= 50) {
        //                 $duplicates[] = [
        //                     'complaint_id'   => $complaint->id,
        //                     'name'           => $complaint->name,
        //                     'subject'        => $complaint->subject,
        //                     'district_id'    => $complaint->district_id,

        //                     'duplicate_with' => $other->id,
        //                     'dup_name'       => $other->e,
        //                     'dup_subject'    => $other->subject,
        //                     'dup_district_id'=> $other->district_id,

        //                     'match_percentage' => round($percentage, 2)
        //                 ];

        //                 // Mark pair as checked
        //                 $checked[] = [$complaint->id, $other->id];
        //             }
        //         }
        //     }
        // }

        // return response()->json([
        //     'status' => 'success',
        //     'message' => 'Duplicate check completed',
        //     'duplicates' => $duplicates
        // ]);


    }

    public function approvedByRo(Request $request,$id){
         $userId = Auth::user()->id;
        if(isset($id) && $request->isMethod('post')){

            $apc = Complaint::findOrFail($id);
                $apc->form_status = 1;
                $apc->approved_rejected_by_ro = 1;
                $apc->approved_by_ro_id =  $userId;
                $apc->save();
    
              return response()->json([
                'status' => 'success',
                'message' => 'Approved Successfully',
                'data' => $apc
                
            ]);
        }else{
             return response()->json([
                'status' => 'failed',
                'message' => 'Please Check Id'
                
            ]);
        }
        
    }

    public function allComplainsDashboard(){
       
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
                ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
                ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
                ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                    'dp.name as department_name',
                    'ds.name as designation_name',
                    'ct.name as complaintype_name',
                    'sub.name as subject_name'
                )
                ->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainspending(){
       
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
                ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
                ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
                ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                    'dp.name as department_name',
                    'ds.name as designation_name',
                    'ct.name as complaintype_name',
                    'sub.name as subject_name'
                )
                ->where('form_status',0)
                ->where('approved_rejected_by_ro',0)
                ->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsapproved(){
       
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
                ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
                ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
                ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                    'dp.name as department_name',
                    'ds.name as designation_name',
                    'ct.name as complaintype_name',
                    'sub.name as subject_name'
                )
                ->where('form_status',1)
                ->where('approved_rejected_by_ro',1)
                ->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }


    //  public function forwardbyRo(Request $request,$complainId){
    //     $userrole = Auth::user();
    //     dd($userrole);
    //     //  $validation = Validator::make($request->all(), [
    //     //     'approved_by_ro' => 'required|exists:users,id',
    //     //     'forward_to' => 'required|exists:users,id',
         
          
    //     // ], [
    //     //     'forward_by.required' => 'Forward by Supervisor is required.',
    //     //     'forward_by.exists' => 'Forward by Supervisor does not exist.',
    //     //     'forward_to.required' => 'Forward to Dealing Assistant is required.',
    //     //     'forward_to.exists' => 'Forward to Dealing Assistant does not exist.',
           
    //     // ]);

    //     // if ($validation->fails()) {
    //     //     return response()->json([
    //     //         'status' => false,
    //     //         'errors' => $validation->errors()
    //     //     ], 422);
    //     // }

    //     $cmp =  Complaint::findOrFail($complainId);
    //     $cmp->approved_by_ro = $request->approved_by_ro;
    //     // $cmp->approved_by_ro_role = $request->;
    //     $cmp->form_status = 1;
    //     $cmp->save();

    //      return response()->json([
    //             'status' => true,
    //             'message' => 'Forwarded Successfully',
    //             'data' => $cmp
    //         ], 200);

    // }
}
