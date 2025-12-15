<?php

namespace App\Http\Controllers\api\Operator;

use App\Http\Controllers\Controller;
use App\Models\ComplainDetails;
use App\Models\ComplainDocuments;
use App\Models\Complaint;
use App\Models\Category;
use App\Models\Complainant;
use App\Models\ComplaintAction;
use App\Models\ComplainType;
use App\Models\Respondent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoreComplaintRequest;
use App\Http\Requests\UpdateComplaintRequest;

class OperatorComplaintsController extends Controller
{

    public function store(StoreComplaintRequest $request)
{
    DB::beginTransaction();

    try {
        /*--------------------------------------------
        | 1. Upload Files
        |--------------------------------------------*/
        $authorizationDocument = $request->hasFile('authorization_document')
            ? $request->file('authorization_document')->store('Document', 'public')
            : null;

        $challanFile = $request->hasFile('challan_file')
            ? $request->file('challan_file')->store('Document', 'public')
            : null;

        $attached_documents = $request->hasFile('attached_documents')
            ? $request->file('attached_documents')->store('Document', 'public')
            : null;

        /*--------------------------------------------
        | 2. Create Main Complaint Entry
        |--------------------------------------------*/

        $complaintId = DB::table('complaints')->insertGetId([
            'relation_with_person'        => $request->relation_with_person,
            'authorization_document'      => $authorizationDocument,
            'correspondence_name'         => $request->correspondence_name,
            'correspondence_place'        => $request->correspondence_place,
            'correspondence_post_office'  => $request->correspondence_post_office,
            'correspondence_district'     => $request->correspondence_district,
            'cause_date'                  => $request->cause_date,
            'delay_reason'                => $request->delay_reason,
            'previously_submitted'        => $request->previously_submitted,
            'previously_submitted_details'=> $request->previously_submitted_details,
            'category'                    => $request->category,
            'challan_number'              => $request->challan_number,
            'challan_date'                => $request->challan_date,
            'challan_file'                => $challanFile,
            'attached_documents_description' => $request->attached_documents_description,
            'attached_documents'          => $attached_documents,
            'complaint_description'       => $request->complaint_description,
        ]);

        /*--------------------------------------------
        | 3. Generate Complaint No
        |--------------------------------------------*/
        $year = date('Y');
        $complaintNo = str_pad($complaintId, 6, '0', STR_PAD_LEFT) . '/' . $year;

        DB::table('complaints')->where('id', $complaintId)
            ->update(['complain_no' => $complaintNo]);

        /*--------------------------------------------
        | 4. Insert Multiple Complainants
        |--------------------------------------------*/
        if ($request->has('complainant_name')) {

            foreach ($request->complainant_name as $i => $name) {

                // SKIP EMPTY complainant rows
                if (!isset($name) || trim($name) === '') {
                    continue;
                }

                DB::table('complainants')->insert([
                    'complaint_id'          => $complaintId,
                    'complainant_name'      => trim($name),
                    'is_main'               => $request->is_main_c[$i] ?? '',
                    'father_name'           => $request->father_name[$i] ?? '',
                    'occupation'            => $request->occupation[$i] ?? '',
                    'is_public_servant'     => $request->is_public_servant[$i] ?? 'no',
                    'permanent_place'       => $request->permanent_place[$i] ?? '',
                    'permanent_post_office' => $request->permanent_post_office[$i] ?? '',
                    'permanent_district'    => $request->permanent_district[$i] ?? null,
                ]);
            }
        }

        /*--------------------------------------------
        | 5. Insert Supporters (Support_name)
        |--------------------------------------------*/
        if ($request->has('support_name')) {
            foreach ($request->support_name as $i => $support_name) {

                if (trim($support_name) === '') continue;

                DB::table('complaint_supporting')->insert([
                    'complaint_id'    => $complaintId,
                    'support_name'    => trim($support_name),
                    'support_address' => $request->support_address[$i] ?? '',
                ]);
            }
        }

        /*--------------------------------------------
        | 6. Insert Witnesses
        |--------------------------------------------*/
        if ($request->has('witness_name')) {
            foreach ($request->witness_name as $i => $witness_name) {

                if (trim($witness_name) === '') continue;

                DB::table('complaint_witness')->insert([
                    'complaint_id'     => $complaintId,
                    'witness_name'     => trim($witness_name),
                    'witness_address'  => $request->witness_address[$i] ?? '',
                ]);
            }
        }

        /*--------------------------------------------
        | 7. Insert Respondents
        |--------------------------------------------*/
        if ($request->has('respondent_name')) {
            foreach ($request->respondent_name as $i => $name) {

                if (trim($name) === '') continue;

                DB::table('respondents')->insert([
                    'complaint_id'        => $complaintId,
                    'respondent_name'     => trim($name),
                    'designation'         => $request->designation[$i] ?? '',
                    'officer_category'    => $request->officer_category[$i] ?? '',
                    'department_name'     => $request->department_name[$i] ?? '',
                    'current_address'     => $request->current_address[$i] ?? '',
                    'is_main'             => $request->is_main_r[$i] ?? '',
                    'respondent_district' => $request->respondent_district[$i] ?? null,
                ]);
            }
        }

        /*--------------------------------------------
        | 8. Insert Documents Table
        |--------------------------------------------*/
        if ($authorizationDocument) {
            DB::table('complaints_documents')->insert([
                'complain_id' => $complaintId,
                'file'        => $authorizationDocument
            ]);
        }

        if ($challanFile) {
            DB::table('complaints_documents')->insert([
                'complain_id' => $complaintId,
                'file'        => $challanFile
            ]);
        }

        if ($attached_documents) {
            DB::table('complaints_documents')->insert([
                'complain_id' => $complaintId,
                'file'        => $attached_documents
            ]);
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Complaint submitted successfully!',
            'complaint_id' => $complaintId
        ]);

    } catch (\Exception $e) {
        DB::rollback();

        return response()->json([
            'success' => false,
            'message' => 'Error occurred',
            'error' => $e->getMessage()
        ], 500);
    }
}


    //  public function store(StoreComplaintRequest $request)
    // {
    //     // dd($request->all());
    //     DB::beginTransaction();

    //     try {
    //         /*--------------------------------------------
    //         | 1. Upload Files
    //         |--------------------------------------------*/

    //         $authorizationDocument = null;
    //         if ($request->hasFile('authorization_document')) {
    //             $authorizationDocument = $request->file('authorization_document')
    //                 ->store('Document', 'public');
    //         }

    //         $challanFile = null;
    //         if ($request->hasFile('challan_file')) {
    //             $challanFile = $request->file('challan_file')
    //                 ->store('Document', 'public');
    //         }
    //         $attached_documents = null;
    //         if ($request->hasFile('attached_documents')) {
    //             $attached_documents = $request->file('attached_documents')
    //                 ->store('Document', 'public');
    //         }

    //         /*--------------------------------------------
    //         | 2. Create Main Complaint Entry
    //         |--------------------------------------------*/


    //         $complaint = Complaint::create([
    //             'relation_with_person'        => $request->relation_with_person,
    //             'authorization_document'      => $authorizationDocument,

    //             // Permanent Address
    //             // 'permanent_name'              => $request->permanent_name,

    //             // Correspondence Address
    //             'correspondence_name'         => $request->correspondence_name,
    //             'correspondence_place'        => $request->correspondence_place,
    //             'correspondence_post_office'  => $request->correspondence_post_office,
    //             'correspondence_district'     => $request->correspondence_district,

    //             // Section 6
    //             'cause_date'                   => $request->cause_date,
    //             'delay_reason'                 => $request->delay_reason,
    //             'previously_submitted'         => $request->previously_submitted,
    //             'previously_submitted_details' => $request->previously_submitted_details,

    //             // Section 7
    //             'category'                     => $request->category,

    //             // Section 8 Challan
    //             'challan_number'               => $request->challan_number,
    //             'challan_date'                 => $request->challan_date,
    //             'challan_file'                 => $challanFile,

    //             // Section 9, 10, 11, 12
    //             // 'supporting_affidavit_list'    => $request->supporting_affidavit_list,
    //             // 'other_witnesses'              => $request->other_witnesses,
    //             'attached_documents'           => $request->attached_documents,
    //             'complaint_description'        => $request->complaint_description,
    //         ]);

    //            $year = date('Y');
              
              
    //             $str = strtoupper(substr('AllGRV', 0, 3));
    //             // 'UP'.$year.$str.
                
    //          $complaintNo = str_pad($complaint->id,6, '0',STR_PAD_LEFT).'/'.$year;
    //     $complaint->where('id',$complaint->id)->update(['complain_no' => $complaintNo]);

    //         /*--------------------------------------------
    //         | 3. Add Multiple Complainants (Parivadi)
    //         |--------------------------------------------*/

    //         // if ($request->has('complainant_name')) {
    //         //     foreach ($request->complainant_name as $i => $name) {

    //         //         // Skip empty rows
    //         //         if (empty($name)) continue;

    //         //         Complainant::create([
    //         //             'complaint_id'  => $complaint->id,
    //         //             'complainant_name' =>$request->complainant_name[$i] ?? null,
    //         //             'father_name'      => $request->father_name[$i] ?? null,
    //         //             'occupation'       => $request->occupation[$i] ?? null,
    //         //             'is_public_servant'=> $request->is_public_servant[$i] ?? null,
    //         //             'permanent_place' => $request->permanent_place[$i] ?? null,
    //         //             'permanent_post_office' => $request->permanent_post_office[$i] ?? null,
    //         //             'permanent_district' => $request->permanent_district[$i] ?? null,
    //         //         ]);
    //         //     }
    //         // }
    //         if ($request->has('complainant_name')) {
    //             foreach ($request->complainant_name as $i => $name) {

    //                 // skip empty complainant rows
    //                if (!isset($name) && empty($name)) {
    //                     continue;
    //                 }

    //                 Complainant::create([
    //                     'complaint_id'          => $complaint->id,
    //                     'complainant_name'      => $name,
    //                     'father_name'           => $request->father_name[$i] ?? null,
    //                     'occupation'            => $request->occupation[$i] ?? null,
    //                     'is_public_servant'     => $request->is_public_servant[$i] ?? null,
    //                     'permanent_place'       => $request->permanent_place[$i] ?? null,
    //                     'permanent_post_office' => $request->permanent_post_office[$i] ?? null,
    //                     'permanent_district'    => $request->permanent_district[$i] ?? null,
    //                 ]);
    //             }
    //         }

    //         if ($request->has('support_name')) {
    //             foreach ($request->support_name as $i => $support_name) {

    //                 // Skip empty rows
    //                 if (empty($support_name)) continue;

    //                 Complainant::create([
    //                     'complaint_id'  => $complaint->id,
    //                     'support_name' => $request->support_name[$i] ?? null,
    //                     'support_address' => $request->support_address[$i] ?? null,
                        
    //                 ]);
    //             }
    //         }
    //         if ($request->has('witness_name')) {
    //             foreach ($request->witness_name as $i => $witness_name) {

    //                 // Skip empty rows
    //                 if (empty($witness_name)) continue;

    //                 Complainant::create([
    //                     'complaint_id'  => $complaint->id,
    //                     'witness_name' => $request->witness_name[$i] ?? null,
    //                     'witness_address' => $request->witness_address[$i] ?? null,
                        
    //                 ]);
    //             }
    //         }

    //         /*--------------------------------------------
    //         | 4. Add Multiple Respondents (Prativadi)
    //         |--------------------------------------------*/

    //         if ($request->has('respondent_name')) {
    //             foreach ($request->respondent_name as $i => $name) {

    //                 // Skip empty rows
    //                 if (empty($name)) continue;

    //                 Respondent::create([
    //                     'complaint_id'   => $complaint->id,
    //                     'respondent_name' => $name,
    //                     'designation'     => $request->designation[$i] ?? null,
    //                     'officer_category'     => $request->officer_category[$i] ?? null,
    //                     'department_name'     => $request->department_name[$i] ?? null,
    //                     'current_address' => $request->current_address[$i] ?? null,
    //                     'respondent_district' => $request->respondent_district[$i] ?? null,
    //                 ]);
    //             }
    //         }

    //       ComplainDocuments::create([
    //             'complain_id' => $complaint->id,
    //             'file'         => $authorizationDocument
    //         ]);

    //         ComplainDocuments::create([
    //             'complain_id' => $complaint->id,
    //             'file'         => $challanFile
    //         ]);
    //         ComplainDocuments::create([
    //             'complain_id' => $complaint->id,
    //             'file'         => $attached_documents
    //         ]);
    //            // $complaintNo = 'UP'.$year.$str.str_pad($cmpDetailsUpdate->id,8, '0',STR_PAD_LEFT);
    // //             // $cmpDetailsUpdate->where('id',$cmpDetailsUpdate->id)->update(['complain_no' => $complaintNo]);
    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Complaint submitted successfully!',
    //             'complaint_id' => $complaint->id
    //         ]);

    //     } catch (\Exception $e) {

    //         DB::rollback();

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error occurred',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    public function edit($id)
    {
        $complaint = Complaint::with(['complainants', 'respondents'])->findOrFail($id);

        return view('complaints.edit', compact('complaint'));
    }

    public function update(UpdateComplaintRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $complaint = Complaint::findOrFail($id);


            if ($request->hasFile('authorization_document')) {
                $path = $request->file('authorization_document')->store('authorization_documents', 'public');
                $complaint->authorization_document = $path;
            }

            if ($request->hasFile('challan_file')) {
                $path = $request->file('challan_file')->store('challan_files', 'public');
                $complaint->challan_file = $path;
            }

            /* -----------------------------------------
            | 2. Update Complaint Main Fields
            ----------------------------------------- */

            $complaint->update([
                'relation_with_person'        => $request->relation_with_person,
                'permanent_name'              => $request->permanent_name,
                'permanent_place'             => $request->permanent_place,
                'permanent_post_office'       => $request->permanent_post_office,
                'permanent_district'          => $request->permanent_district,

                'correspondence_name'         => $request->correspondence_name,
                'correspondence_place'        => $request->correspondence_place,
                'correspondence_post_office'  => $request->correspondence_post_office,
                'correspondence_district'     => $request->correspondence_district,

                'cause_date'                  => $request->cause_date,
                'delay_reason'                => $request->delay_reason,
                'previously_submitted'        => $request->previously_submitted,
                'previously_submitted_details'=> $request->previously_submitted_details,

                'category'                    => $request->category,
                'challan_number'              => $request->challan_number,
                'challan_date'                => $request->challan_date,

                'supporting_affidavit_list'   => $request->supporting_affidavit_list,
                'other_witnesses'             => $request->other_witnesses,
                'attached_documents'          => $request->attached_documents,
                'complaint_description'       => $request->complaint_description,
            ]);

            /* -----------------------------------------
            | 3. Update Complainants
            ----------------------------------------- */

            $existingComplainantIds = $complaint->complainants->pluck('id')->toArray();
            $submittedComplainantIds = $request->complainant_id ?? [];

            // DELETE removed complainants
            $toDelete = array_diff($existingComplainantIds, $submittedComplainantIds);
            Complainant::whereIn('id', $toDelete)->delete();

            foreach ($request->complainant_name as $i => $name) {

                if (!empty($request->complainant_id[$i])) {
                    // UPDATE existing row
                    Complainant::where('id', $request->complainant_id[$i])
                        ->update([
                            'complainant_name' => $name,
                            'father_name'      => $request->father_name[$i] ?? null,
                            'occupation'       => $request->occupation[$i] ?? null,
                            'is_public_servant'=> $request->is_public_servant[$i] ?? null,
                        ]);
                } else {
                    // CREATE new row
                    Complainant::create([
                        'complaint_id'     => $complaint->id,
                        'complainant_name' => $name,
                        'father_name'      => $request->father_name[$i] ?? null,
                        'occupation'       => $request->occupation[$i] ?? null,
                        'is_public_servant'=> $request->is_public_servant[$i] ?? null,
                    ]);
                }
            }

            /* -----------------------------------------
            | 4. Update Respondents
            ----------------------------------------- */

            $existingRespondentIds = $complaint->respondents->pluck('id')->toArray();
            $submittedRespondentIds = $request->respondent_id ?? [];

            $toDelete = array_diff($existingRespondentIds, $submittedRespondentIds);
            Respondent::whereIn('id', $toDelete)->delete();

            foreach ($request->respondent_name as $i => $name) {

                if (!empty($request->respondent_id[$i])) {
                    Respondent::where('id', $request->respondent_id[$i])
                        ->update([
                            'respondent_name' => $name,
                            'designation'     => $request->designation[$i] ?? null,
                            'current_address' => $request->current_address[$i] ?? null,
                        ]);
                } else {
                    Respondent::create([
                        'complaint_id'    => $complaint->id,
                        'respondent_name' => $name,
                        'designation'     => $request->designation[$i] ?? null,
                        'current_address' => $request->current_address[$i] ?? null,
                    ]);
                }
            }

            DB::commit();

            return back()->with('success', 'Complaint updated successfully.');

        } catch (\Exception $e) {

            DB::rollback();

            return back()->with('error', $e->getMessage());
        }
    }


    // public function addComplaint(Request $request)
    // {
    //     // dd($request->all());
    //     // $user = $request->user()->id;
    //     $added_by = Auth::user()->id;
    
    //     $validation = Validator::make($request->all(), [
    //         'name' => 'required|string|max:255',
    //         'mobile' => 'required|digits_between:10,15',
    //         'address' => 'required|string|max:255',
    //         'district_id' => 'required|exists:district_master,district_code',
    //         'email' => 'required|email',
    //         // 'email' => 'required|email|unique:complaints,email',
    //         'dob' => 'nullable|date',
    //         // 'fee_exempted' => 'required|boolean',
    //         'department' => 'required',
    //         'officer_name' => 'required|string|max:255',
    //         'designation' => 'required',
    //         'category' => 'required',
    //         'subject' => 'required',
    //         'nature' => 'required',
    //         'description' => 'required|string',
    //         'title' => 'required|string',
    //         'file' =>  'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
    //     ], [
    //         'name.required' => 'Name is required.',
    //         'mobile.required' => 'Mobile number is required.',
    //         'mobile.digits_between' => 'Mobile number must be between 10 to 15 digits.',
    //         'address.required' => 'Address is required.',
    //         'district_id.required' => 'District is required.',
    //         'district_id.exists' => 'District does not exist.',
    //         'email.required' => 'Email is required.',
    //         'email.email' => 'Please enter a valid email address.',
    //         'email.unique' => 'This email is already registered.',
    //         'dob.date' => 'Date must be a valid date.',
    //         // 'fee_exempted.required' => 'Please specify if fee is exempted or not.',
    //         'department.required' => 'Department is required.',
    //         'officer_name.required' => 'Officer name is required.',
    //         'designation.required' => 'Designation is required.',
    //         'category.required' => 'Category is required.',
    //         'subject.required' => 'Subject is required.',
    //         'nature.required' => 'Nature of complaint is required.',
    //         'description.required' => 'Complaint description is required.',
    //         'title.required' => 'Letter Subject is Required',
    //         'file.required' => 'File is Required',
    //     ]);

    //     if ($validation->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'errors' => $validation->errors()
    //         ], 422);
    //     }

    //     if(isset($request->complaint_id)){
    //         // $compUpdate = Complaint::findOrFail($request->complaint_id);
            
    //             // $compUpdate->name = $request->name;
    //             // $compUpdate->complain_no = $compUpdateNo ?? null;
    //             // $compUpdate->mobile = $request->mobile;
    //             // $compUpdate->address = $request->address;
    //             // $compUpdate->district_id = $request->district_id;
    //             // $compUpdate->email = $request->email;
    //             // $compUpdate->amount = $request->amount;
    //             // $compUpdate->challan_no = $request->challan_no;
    //             // $compUpdate->dob = $request->dob;
    //             // $compUpdate->fee_exempted = $request->fee_exempted ? 1 : 0;
    //             // $compUpdate->save();
                
    //             $cmpDetailsUpdate = new ComplainDetails();

    //             $cmpDetailsUpdate->complain_id = $request->complaint_id;
    //             $cmpDetailsUpdate->department_id = $request->department;
    //             $cmpDetailsUpdate->officer_name = $request->officer_name;
    //             $cmpDetailsUpdate->designation_id = $request->designation;
    //             $cmpDetailsUpdate->category = $request->category;
    //             // $cmpDetailsUpdate->added_by = $added_by;
    //             $cmpDetailsUpdate->subject_id = $request->subject;
    //             $cmpDetailsUpdate->complaintype_id = $request->nature;
    //             $cmpDetailsUpdate->description = $request->description;
    //             $cmpDetailsUpdate->title = $request->title;
                
    //             $file = 'letter_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
    //             $filePath = $request->file('file')->storeAs('letters', $file, 'public');
    //             $cmpDetailsUpdate->file = $file;
                
    //             $cmpDetailsUpdate->save();
    //             // $year = date('Y');
    //             // if($request->nature){
    //             // $com_type = ComplainType::find($request->nature);
    //             // $str = strtoupper(substr($com_type->name, 0, 3));

    //             // }
        
    //             // $complaintNo = 'UP'.$year.$str.str_pad($cmpDetailsUpdate->id,8, '0',STR_PAD_LEFT);
    //             // $cmpDetailsUpdate->where('id',$cmpDetailsUpdate->id)->update(['complain_no' => $complaintNo]);
            

    //             return response()->json([
    //                 'status' => true,
    //                 'message' => 'Complaint Update successfully.',
    //                 'data' => $cmpDetailsUpdate
    //             ], 201);
    //     }else{
    //           $complaint = new Complaint();
    //     $complaint->name = $request->name;
    //     $complaint->complain_no = $complaintNo ?? null;
    //     $complaint->mobile = $request->mobile;
    //     $complaint->address = $request->address;
    //     $complaint->district_id = $request->district_id;
    //     $complaint->email = $request->email;
    //     $complaint->amount = $request->amount;
    //     $complaint->added_by = $added_by;
    //     $complaint->challan_no = $request->challan_no;
    //     $complaint->dob = $request->dob;
    //     $complaint->fee_exempted = $request->fee_exempted ? 1 : 0;
        
    //     if($request->action == "1"){
    //         $complaint->in_draft = 1;
    //     }

    //     if($complaint->save()){

    //          $year = date('Y');
    //     if($request->nature){
    //      $com_type = ComplainType::find($request->nature);
    //      $str = strtoupper(substr($com_type->name, 0, 3));

    //     }
   
    //     $complaintNo = 'UP'.$year.$str.str_pad($complaint->id,8, '0',STR_PAD_LEFT);
    //     $complaint->where('id',$complaint->id)->update(['complain_no' => $complaintNo]);

    //     $cmpDetails = new ComplainDetails();
    //     $cmpDetails->complain_id = $complaint->id;
    //     $cmpDetails->department_id = $request->department;
    //     $cmpDetails->officer_name = $request->officer_name;
    //     $cmpDetails->designation_id = $request->designation;
    //     $cmpDetails->category = $request->category;
    //     $cmpDetails->added_by = $added_by;
    //     $cmpDetails->subject_id = $request->subject;
    //     $cmpDetails->complaintype_id = $request->nature;
    //     $cmpDetails->description = $request->description;
    //     $cmpDetails->title = $request->title;
        
    //     $file = 'letter_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
    //     $filePath = $request->file('file')->storeAs('letters', $file, 'public');
    //     $cmpDetails->file = $file;
    //     $cmpDetails->save();
        
    //     }

    //        // MP2024ALG001
    //       if($request->action == "1"){
    //             return response()->json([
    //             'status' => true,
    //             'message' => 'Save Draft successfully.',
    //             'data' => $complaint,
    //             // 'added_by' =>$added_by
    //         ], 201);
    //       }

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Complaint registered successfully.',
    //         'data' => $complaint,
    //         // 'added_by' =>$added_by
    //     ], 201);
    //     }   
    // }

    public function uploadDocument(Request $request)
    {
        // dd($request->complain_id);
        // $user = $request->user()->id;
        $added_by = Auth::user()->id;
    
        $validation = Validator::make($request->all(), [
            
            'complain_id' => 'required|numeric',
            'type' => 'required|string',
            'title' => 'required|string',
            'file' =>  'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ], [
            'complain_id.required' => 'Complaint Id is required.',
            'type.required' => 'Complaint description is required.',
            'title.required' => 'Letter Subject is Required',
            'file.required' => 'File is Required',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        if(isset($request->complain_id)){    
                $compDoc = new ComplainDocuments();
                $compDoc->complain_id = $request->complain_id;
                $compDoc->added_by = $added_by;
                $compDoc->type = $request->type;
                $compDoc->title = $request->title;     
                $file = 'doc_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
                $filePath = $request->file('file')->storeAs('Document', $file, 'public');
                $compDoc->file = $file;
                
                $compDoc->save();
              
                return response()->json([
                    'status' => true,
                    'message' => 'Document Added successfully.',
                    'data' => $compDoc
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
        // $cmpedit = Complaint::findOrFail($id);

          $cmpedit = DB::table('complaints as cm')
            ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
            ->select(
                'cm.*',
                'dd.district_name'
            )
            ->where('cm.id', $id)
            ->first();

            $cmpedit->details = DB::table('complaints_details as cd')
                ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
                ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
                ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
                ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
                ->select(
                    'cd.*',
                    'dp.name as department_name',
                    'ds.name as designation_name',
                    'ct.name as complaintype_name',
                    'sub.name as subject_name'
                )
                ->where('cd.complain_id', $id)
                ->get();

        return response()->json([
                'status' => true,
                'message' => 'Complaint fetch successfully.',
                'data' => $cmpedit
            ], 200);
    }

     public function editDraft($id){
        // $cmpedit = Complaint::findOrFail($id);

          $cmpedit = DB::table('complaints as cm')
            ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
            ->select(
                'cm.*',
                'dd.district_name'
            )
            ->where('cm.in_draft', '1')
            ->where('cm.id', $id)
            ->first();

            $cmpedit->details = DB::table('complaints_details as cd')
                ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
                ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
                ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
                ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
                ->select(
                    'cd.*',
                    'dp.name as department_name',
                    'ds.name as designation_name',
                    'ct.name as complaintype_name',
                    'sub.name as subject_name'
                )
                ->where('cd.complain_id', $id)
                ->get();

        return response()->json([
                'status' => true,
                'message' => 'Complaint fetch successfully.',
                'data' => $cmpedit
            ], 200);
    }



    // public function updateComplain(Request $request,$id){
    //     $added_by = Auth::user()->id;
    //         $validation = Validator::make($request->all(), [
    //             'name' => 'required|string|max:255',
    //             'mobile' => 'required|digits_between:10,15',
    //             'address' => 'required|string|max:255',
    //             'district_id' => 'required|exists:district_master,district_code',
    //             'email' => 'required',
    //             'dob' => 'nullable|date',
    //             // 'fee_exempted' => 'required|boolean',
    //             'department' => 'required',
    //             'officer_name' => 'required|string|max:255',
    //             'designation' => 'required',
    //             'category' => 'required',
    //             'subject' => 'required',
    //             'nature' => 'required',
    //             'description' => 'required|string',
    //             'title' => 'required|string',
    //             'file' =>  'file|mimes:jpg,jpeg,png,pdf|max:2048',
    //         ], [
    //             'name.required' => 'Name is required.',
    //             'mobile.required' => 'Mobile number is required.',
    //             'mobile.digits_between' => 'Mobile number must be between 10 to 15 digits.',
    //             'address.required' => 'Address is required.',
    //             'district_id.required' => 'District is required.',
    //             'district_id.exists' => 'District does not exist.',
    //             'email.required' => 'Email is required.',
    //             // 'email.email' => 'Please enter a valid email address.',
    //             // 'email.unique' => 'This email is already registered.',
    //             'dob.date' => 'Date of Birth must be a valid date.',
    //             'fee_exempted.required' => 'Please specify if fee is exempted or not.',
    //             'department.required' => 'Department is required.',
    //             'officer_name.required' => 'Officer name is required.',
    //             'designation.required' => 'Designation is required.',
    //             'category.required' => 'Category is required.',
    //             'subject.required' => 'Subject is required.',
    //             'nature.required' => 'Nature of complaint is required.',
    //             'description.required' => 'Complaint description is required.',
    //             'title.required' => 'Letter Subject is Required',
    //             // 'file.required' => 'File is Required',
    //         ]);

    //         if ($validation->fails()) {
    //             return response()->json([
    //                 'status' => false,
    //                 'errors' => $validation->errors()
    //             ], 422);
    //         }

        
    //         $complaint = Complaint::findOrFail($id);
    //         $complaint->name = $request->name;
    //         // $complaint->complain_no = $complaintNo ?? null;
    //         $complaint->mobile = $request->mobile;
    //         $complaint->address = $request->address;
    //         $complaint->district_id = $request->district_id;
    //         $complaint->email = $request->email;
    //         $complaint->amount = $request->amount;
    //         $complaint->challan_no = $request->challan_no;
    //         $complaint->dob = $request->dob;
    //         $complaint->fee_exempted = $request->fee_exempted;

    //         $complaint->department_id = $request->department;
    //         $complaint->officer_name = $request->officer_name;
    //         $complaint->designation_id = $request->designation;
    //         $complaint->category = $request->category;
    //         $complaint->added_by = $added_by;
    //         $complaint->subject_id = $request->subject;
    //         $complaint->complaintype_id = $request->nature;
    //         $complaint->description = $request->description;
    //         $complaint->title = $request->title;
            
    //         if($request->hasFile('file')){
    //                 $file = 'letter_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
    //         $filePath = $request->file('file')->storeAs('letters', $file, 'public');
    //         $complaint->file = $file;
    //         }

            
            
    //         $complaint->save(); // ✅ Insert into DB

    //         // MP2024ALG001
    //         $year = date('Y');
    //         if($request->nature){
    //         $com_type = ComplainType::find($request->nature);
    //         $str = strtoupper(substr($com_type->name, 0, 3));

    //         }
    
    //         // $complaintNo = 'UP'.$year.$str.str_pad($complaint->id,8, '0',STR_PAD_LEFT);
    //         // $complaint->where('id',$complaint->id)->update(['complain_no' => $complaintNo]);
        

    //         return response()->json([
    //             'status' => true,
    //             'message' => 'Complaint update successfully.',
    //             'data' => $complaint
    //         ], 201);
    // }

     public function updateComplain(Request $request,$id){
        // dd($request->all());
        $added_by = Auth::user()->id;
            $validation = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'mobile' => 'required|digits_between:10,15',
                'address' => 'required|string|max:255',
                'district_id' => 'required|exists:district_master,district_code',
                'email' => 'required',
                'dob' => 'nullable|date',
                // 'fee_exempted' => 'required|boolean',
                // 'department' => 'required',
                 'department'   => 'required|array',
                 'department.*' => 'required|integer|exists:departments,id',

                  'designation'   => 'required|array',
                 'designation.*' => 'required|integer|exists:designations,id',
                  'category'   => 'required|array',
                 'category.*' => 'required|string|max:255',
                  'subject'   => 'required|array',
                 'subject.*' => 'required|integer|exists:subjects,id',
                  'nature'   => 'required|array',
                 'nature.*' => 'required|integer|exists:complaintype,id',
                  'description'   => 'required|array',
                 'description.*' => 'required|string|max:255',
                  'title'   => 'required|array',
                 'title.*' => 'required|string|max:255',
                  'file'   => 'array',
                 'file.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
                'officer_name' => 'required|array',
               
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
                'department.array' => 'Department must be an array.',
                'department.*.required' => 'Each department is required.',
               
                'officer_name.required' => 'Officer name is required.',
               
                'designation.required' => 'designation is required.',
                'designation.array' => 'designation must be an array.',
                'designation.*.required' => 'Each designation is required.',
               
                'category.required' => 'category is required.',
                'category.array' => 'category must be an array.',
                'category.*.required' => 'Each category is required.',
               
                'subject.required' => 'subject is required.',
                'subject.array' => 'subject must be an array.',
                'subject.*.required' => 'Each subject is required.',
               
                'nature.required' => 'nature is required.',
                'nature.array' => 'nature must be an array.',
                'nature.*.required' => 'Each nature is required.',
               
                'description.required' => 'description is required.',
                'description.array' => 'description must be an array.',
                'description.*.required' => 'Each description is required.',
               
                'title.required' => 'title is required.',
                'title.array' => 'title must be an array.',
                'title.*.required' => 'Each title is required.',
                'file.required' => 'file is required.',
                'file.array' => 'file must be an array.',
                // 'file.*.required' => 'Each file is required.',
                // 'department.required' => 'Department is required.',
                
                // 'designation.required' => 'Designation is required.',
                // 'category.required' => 'Category is required.',
                // 'subject.required' => 'Subject is required.',
                // 'nature.required' => 'Nature of complaint is required.',
                // 'description.required' => 'Complaint description is required.',
                // 'title.required' => 'Letter Subject is Required',
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
            $complaint->save(); // ✅ Insert into DB

            // $data = [];
            foreach ($request->department as $i => $departName) {
                
                $data[] = [
                    'id' => $request->complaint_details_id[$i], 
                    'department_id' => $request->department[$i], 
                    'officer_name' => $request->officer_name[$i], 
                    'designation_id' => $request->designation[$i],  
                    'category' => $request->category[$i], 
                    'added_by' => $added_by, 
                    'subject_id' => $request->subject[$i], 
                    'complaintype_id' => $request->nature[$i], 
                    'description' => $request->description[$i], 
                    'title' => $request->title[$i], 
                     
                ];

                  $filePath = null;
              
                if($request->hasFile("files.$i")){
                    $file = $request->file("files.$i");
                    $filename = 'letter_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $filePath = $file->storeAs('letters', $filename, 'public');
                }
                // dd($request->hasFile("files.$i"), $filePath);
                
                if (!empty($filePath)) {
                    $data[$i]['file'] = $filename;
                }

            }
            // dd($data);
          
            
              $dataList = $data;
            //   dd($dataList);
                
             
               foreach($dataList as $key => $value){
                // dd($value['id']);
                
            
                     DB::table('complaints_details')
                         ->where('id', $value['id'])
                         ->update($value);
                   
                }
               

            // MP2024ALG001
            // $year = date('Y');
            // if($request->nature){
            // $com_type = ComplainType::find($request->nature);
            // $str = strtoupper(substr($com_type->name, 0, 3));

            // }
    
            // $complaintNo = 'UP'.$year.$str.str_pad($complaint->id,8, '0',STR_PAD_LEFT);
            // $complaint->where('id',$complaint->id)->update(['complain_no' => $complaintNo]);
        

            return response()->json([
                'status' => true,
                'message' => 'Complaint update successfully.',
                'data' => $complaint,
                // 'dataList' => $dataList
            ], 201);
    }

      public function updateDraft(Request $request,$id){
        // dd($request->all());
        $added_by = Auth::user()->id;
            $validation = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'mobile' => 'required|digits_between:10,15',
                'address' => 'required|string|max:255',
                'district_id' => 'required|exists:district_master,district_code',
                'email' => 'required',
                'dob' => 'nullable|date',
                // 'fee_exempted' => 'required|boolean',
                // 'department' => 'required',
                 'department'   => 'required|array',
                 'department.*' => 'required|integer|exists:departments,id',

                  'designation'   => 'required|array',
                 'designation.*' => 'required|integer|exists:designations,id',
                  'category'   => 'required|array',
                 'category.*' => 'required|string|max:255',
                  'subject'   => 'required|array',
                 'subject.*' => 'required|integer|exists:subjects,id',
                  'nature'   => 'required|array',
                 'nature.*' => 'required|integer|exists:complaintype,id',
                  'description'   => 'required|array',
                 'description.*' => 'required|string|max:255',
                  'title'   => 'required|array',
                 'title.*' => 'required|string|max:255',
                  'file'   => 'array',
                 'file.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
                'officer_name' => 'required|array',
               
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
                'department.array' => 'Department must be an array.',
                'department.*.required' => 'Each department is required.',
               
                'officer_name.required' => 'Officer name is required.',
               
                'designation.required' => 'designation is required.',
                'designation.array' => 'designation must be an array.',
                'designation.*.required' => 'Each designation is required.',
               
                'category.required' => 'category is required.',
                'category.array' => 'category must be an array.',
                'category.*.required' => 'Each category is required.',
               
                'subject.required' => 'subject is required.',
                'subject.array' => 'subject must be an array.',
                'subject.*.required' => 'Each subject is required.',
               
                'nature.required' => 'nature is required.',
                'nature.array' => 'nature must be an array.',
                'nature.*.required' => 'Each nature is required.',
               
                'description.required' => 'description is required.',
                'description.array' => 'description must be an array.',
                'description.*.required' => 'Each description is required.',
               
                'title.required' => 'title is required.',
                'title.array' => 'title must be an array.',
                'title.*.required' => 'Each title is required.',
                'file.required' => 'file is required.',
                'file.array' => 'file must be an array.',
                // 'file.*.required' => 'Each file is required.',
                // 'department.required' => 'Department is required.',
                
                // 'designation.required' => 'Designation is required.',
                // 'category.required' => 'Category is required.',
                // 'subject.required' => 'Subject is required.',
                // 'nature.required' => 'Nature of complaint is required.',
                // 'description.required' => 'Complaint description is required.',
                // 'title.required' => 'Letter Subject is Required',
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
            $complaint->in_draft = '0';
            $complaint->save(); // ✅ Insert into DB

            // $data = [];
            foreach ($request->department as $i => $departName) {
                
                $data[] = [
                    'id' => $request->complaint_details_id[$i], 
                    'department_id' => $request->department[$i], 
                    'officer_name' => $request->officer_name[$i], 
                    'designation_id' => $request->designation[$i],  
                    'category' => $request->category[$i], 
                    'added_by' => $added_by, 
                    'subject_id' => $request->subject[$i], 
                    'complaintype_id' => $request->nature[$i], 
                    'description' => $request->description[$i], 
                    'title' => $request->title[$i], 
                     
                ];

                  $filePath = null;
              
                if($request->hasFile("files.$i")){
                    $file = $request->file("files.$i");
                    $filename = 'letter_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $filePath = $file->storeAs('letters', $filename, 'public');
                }
                // dd($request->hasFile("files.$i"), $filePath);
                
                if (!empty($filePath)) {
                    $data[$i]['file'] = $filename;
                }

            }
            // dd($data);
          
            
              $dataList = $data;
            //   dd($dataList);
                
             
               foreach($dataList as $key => $value){
                // dd($value['id']);
                
            
                     DB::table('complaints_details')
                         ->where('id', $value['id'])
                         ->update($value);
                   
                }
               

            // MP2024ALG001
            // $year = date('Y');
            // if($request->nature){
            // $com_type = ComplainType::find($request->nature);
            // $str = strtoupper(substr($com_type->name, 0, 3));

            // }
    
            // $complaintNo = 'UP'.$year.$str.str_pad($complaint->id,8, '0',STR_PAD_LEFT);
            // $complaint->where('id',$complaint->id)->update(['complain_no' => $complaintNo]);
        

            return response()->json([
                'status' => true,
                'message' => 'Complaint Register successfully.',
                'data' => $complaint,
                // 'dataList' => $dataList
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

        //         $existingComplaint = Complaint::where('title', 'LIKE', "%{$request->title}%")
        // ->where('name', 'LIKE', "%{$request->name}%")
        // ->first();
        $existingComplaint = Complaint::query()
            ->join('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
            ->where('complaints.name', 'LIKE', "%{$request->name}%")
            ->where('cd.title', 'LIKE', "%{$request->title}%")
            ->select('complaints.*', 'cd.title') // select what you need
            ->first();
            // dd($existingComplaint);
            if ($existingComplaint) {
                // Decode existing description (JSON) into array
                // $existdescriptions = $existingComplaint->description ? $existingComplaint->description: '';
                  $percent = null;
                // if($request->name == $existingComplaint->name){
                //     $percent+=50;
                // }elseif($request->title == $existingComplaint->title){
                //     $percent+=50;
                // }
                // $existingComplaint->match = $percent;
                if($request->name === $existingComplaint->name && $request->title === $existingComplaint->title){
                    $percent+=100;
                }else{
                    $percent= 0;
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
                $apc->approved_rejected_by_rk = 1;
                $apc->approved_by_ro_id =  $userId;
                
                if($apc->save()){
                     $apcAction = new ComplaintAction();
                    $apcAction->complaint_id = $id;
                    $apcAction->status = 'Verified';
                    $apcAction->remarks = "File received";
                    $apcAction->forward_by_rk = $userId;
                    $apcAction->save();
                }
           
    
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
                ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
                // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
                // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
                // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                    // 'dp.name as department_name',
                    // 'ds.name as designation_name',
                    // 'ct.name as complaintype_name',
                    // 'sub.name as subject_name',
                    // 'cd.department_id',
                    // 'cd.officer_name',
                    // 'cd.designation_id',
                    // 'cd.designation_id',
                    // 'cd.category',
                    // 'cd.title',
                    // 'cd.file',
                    // 'cd.subject_id',
                    // 'cd.complaintype_id',
                    'cd.description',
                  
                )
                 ->where('in_draft','0')
                 ->distinct('cm.id')
                ->get();

                 $todayCount = DB::table('complaints')
                    ->where('in_draft', 0)
                    ->whereDate('created_at', today())
                    ->count();

             
                $older7DaysCount = DB::table('complaints')
                    ->where('in_draft', 0)
                    ->where('created_at', '<', now()->subDays(7))
                    ->count();


        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
                'todayCount' => $todayCount,
                'older7DaysCount' => $older7DaysCount
           ]);
   
    }
      public function allDraft(){
       
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
                // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
                // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
                // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                    // 'dp.name as department_name',
                    // 'ds.name as designation_name',
                    // 'ct.name as complaintype_name',
                    // 'sub.name as subject_name',
                    // 'cd.department_id',
                    // 'cd.officer_name',
                    // 'cd.designation_id',
                    // 'cd.designation_id',
                    // 'cd.category',
                    // 'cd.title',
                    // 'cd.file',
                    // 'cd.subject_id',
                    // 'cd.complaintype_id',
                    'cd.description',
                  
                )
                ->where('in_draft','1')
                 ->distinct('cm.id')
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
            // ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
                // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
                // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
                // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                    // 'dp.name as department_name',
                    // 'ds.name as designation_name',
                    // 'ct.name as complaintype_name',
                    // 'sub.name as subject_name',
                    // 'cd.*'
                )
                ->where('form_status',0)
                ->where('approved_rejected_by_ro',0)
                 ->where('in_draft','0')
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
            ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
                // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
                // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
                // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                    'cd.description',

                    // 'dp.name as department_name',
                    // 'ds.name as designation_name',
                    // 'ct.name as complaintype_name',
                    // 'sub.name as subject_name',
                    // 'cd.*'
                )
                ->where('form_status',1)
                ->where('approved_rejected_by_rk',1)
                ->where('approved_rejected_by_ps',1)
                //  ->where('in_draft','0')
                  ->distinct('cm.id')
                ->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

      public function getSectionOfficers(){
     
        $usersBySubRole = User::with('role','subrole')
         ->whereNotNull('sub_role_id')
        ->get()
        ->groupBy(fn ($user) => $user->subrole->name);
        

         if(!empty($usersBySubRole['so-us'])){

           return response()->json($usersBySubRole['so-us']);
        }else{

            return response()->json(["message"=>"Data Not Found"]);
        }
        // dd($usersBySubRole);
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

      public function forwardComplaintbySO(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        // dd($usersubrole);
   

        $validation = Validator::make($request->all(), [
            // 'forward_by_so_us' => 'required|exists:users,id',
            'forward_to_d_a' => 'required|exists:users,id',
            // 'remark' => 'required',
         
          
        ], [
            // 'forward_by_so_us.required' => 'Forward by Supervisor is required.',
            // 'forward_by_so_us.exists' => 'Forward by user does not exist.',
            'forward_to_d_a.required' => 'Forward to user is required.',
            'forward_to_d_a.exists' => 'Forward to user does not exist.',
            // 'remark.required' => 'Remark is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post')){

             $cmp =  Complaint::findOrFail($complainId);
             
            if($cmp){
                $cmp->approved_rejected_by_so_us = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Section Officer / Under Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                // $cmp->save();

               
                if($cmp->save()){
                    $apcAction = new ComplaintAction();
                    $apcAction->complaint_id = $complainId;
                    $apcAction->forward_by_so_us = $user;
                    $apcAction->forward_to_d_a = $request->forward_to_d_a;
                    $apcAction->status = 'Forwarded';
                    $apcAction->remarks = $request->remarks;
                    $apcAction->save();
                }
                // $cmpAction =new ComplaintAction();
                // $cmpAction->complaint_id = $complainId;
                // $cmpAction->forward_by_so_us = $user;
                // $cmpAction->forward_to_d_a = $request->forward_to_d_a; //add supervisor user_id 
                // $cmpAction->status_so_us = 1;
                // $cmpAction->action_type = "Forwarded";
                // $cmpAction->remarks = $request->remarks;
                // $cmpAction->save();
            }
            // $cmp->forward_by = $request->forward_by;
            // $cmp->forward_to_d_a = $request->forward_to_d_a;
            // $cmp->sup_status = 1;
            // $cmp->save();
    
             return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Successfully',
                    'data' => $cmp
                ], 200);
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

    public function makedreceivedbyRk(Request $request){
         $user = Auth::user()->id;
        if($request->isMethod('post')){

               $validation = Validator::make($request->all(), [
                'complaint_id' => 'required',
                'remark' => 'required',
                ], [
                    'complaint_id.required' => 'Complaint Id is required.',
                    'remark.required' => 'Remark is required.',
                ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
           
           $cmp = Complaint::findOrFail($request->complaint_id);
          $cmp->received_phsical = 1;
          
           if($cmp->save()){
              $apcAction = new ComplaintAction();
                    $apcAction->complaint_id = $request->complaint_id;
                    $apcAction->forward_to_rk = $user;
                    $apcAction->subject = 'File Received';
                    $apcAction->remarks = $request->remark;
                    $apcAction->status = 'Received';
                    $apcAction->save();
           }
       
           
            return response()->json([
                'status' => true,
                'message' => 'Forwarded Successfully',
                'data' => $cmp
            ], 200); 
        }
    }
    public function makedforwardbyRk(Request $request){
           $user = Auth::user()->id;
        if($request->isMethod('post')){
           
             $validation = Validator::make($request->all(), [
                'complaint_id' => 'required',
                'forward_to' => 'required',
                'remark' => 'required',
                ], [
                    'forward_to.required' => 'Forward To is required.',
                    'remark.required' => 'Remark is required.',
                ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
           $cmp = Complaint::findOrFail($request->complaint_id);
          $cmp->forward_physical = 1;
          
           if($cmp->save()){
              $apcAction = new ComplaintAction();
                    $apcAction->complaint_id = $request->complaint_id;
                    $apcAction->forward_by_rk = $user;
                    $apcAction->forward_to_lokayukt = $request->forward_to;
                    $apcAction->remarks = $request->remark;
                    $apcAction->status = 'Forwarded';
                    $apcAction->save();
           }
            return response()->json([
                'status' => true,
                'message' => 'Forwarded Successfully',
                'data' => $cmp
            ], 200); 
        }
    }

       public function getLokayuktUsers(){
     
        $usersByRole = User::with('role')
         ->whereNotNull('role_id')
        ->get()
        ->groupBy(fn ($user) => $user->role->name);
        

         if(!empty($usersByRole['lok-ayukt'])){

           return response()->json($usersByRole['lok-ayukt']);
        }else{

            return response()->json(["message"=>"Data Not Found"]);
        }
        // dd($usersByRole['lok-ayukt']);
   }
}
