<?php

namespace App\Http\Controllers\api\LokAyukt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\ComplaintAction;
use App\Models\ComplainDocuments;
use App\Models\ComplaintNotes;
use App\Models\SubRole;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;


class LokAyuktComplaintsController extends Controller
{
      public function allComplains(){
        $user = Auth::user()->id;
        // dd($user);
    $query = DB::table('complaints')
        //  ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
        ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
        // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
        // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
        // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
        // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
        // ->leftJoin('complaint_actions as rep', 'complaints.id', '=', 'rep.complaint_id')
        ->select(
            'complaints.*',
            'dd.district_name as district_name',

        );


     $query->where('form_status', 1)
                //   ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_rk', 1);
                    // ->where(function($q){
                    //         $q->where('approved_rejected_by_so_us',1)
                    //         ->Orwhere('approved_rejected_by_ds_js', 1);               
                    //      })
                    // ->where('approved_rejected_by_d_a', 1);
                    // ->whereNotNull('forward_to_d_a');

    $records = $query->get();

    return response()->json([
        'status' => true,
        'message' => 'Records fetched successfully',
        'data' => $records,
    ]);

}
    public function viewComplaint($id)
  {
  
  $complainDetails = DB::table('complaints as cm')
    // ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
    ->leftJoin('district_master as ddn', 'cm.correspondence_district', '=', 'ddn.district_code')
    ->leftJoin('complaint_actions as ca', DB::raw("cm.id"), '=', DB::raw("ca.complaint_id"))
    // ->leftJoin('complainants as cpt', DB::raw("cm.id"), '=', DB::raw("cpt.	complaint_id "))
 

    ->join('complainants as cpt', function ($join) {
        $join->on('cm.id', '=', 'cpt.complaint_id')
             ->where('cpt.is_main', 1);
    })

    // MAIN RESPONDENT ONLY
    ->join('respondents as r', function ($join) {
        $join->on('cm.id', '=', 'r.complaint_id')
             ->where('r.is_main', 1);
    })
        ->leftJoin('district_master as dmc', 'cpt.permanent_district', '=', 'dmc.district_code')
    ->leftJoin('district_master as rmc', 'r.respondent_district', '=', 'rmc.district_code')
    // ->leftJoin('respondents as r', DB::raw("cm.id"), '=', DB::raw("r.complaint_id"))
    ->select(
        'cm.*',
        // 'dd.district_name',
        'ca.remarks as ca_remark',
        'ca.subject as ca_subject',
        'ca.status as ca_status',
        // 'cpt.complainant_name as comp_name',
        // 'cpt.father_name as comp_fname',
        // 'cpt.occupation as comp_occupation',
        // 'cpt.is_public_servant as comp_public_servant',
         'cpt.complainant_name as main_complainant_name',
        'cpt.father_name as main_complainant_father',
             'rmc.district_name as main_complainant_district',
        'dmc.district_name as main_respondant_district',
        // main respondent
        'r.respondent_name as main_respondent_name',
        'r.designation as main_respondent_designation',
         'ddn.district_name as correspondence_district',

        // 'r.*',
        // 'r.respondent_name as r_name',
        // 'r.designation as r_desig',
        // 'r.current_address as r_address',
    )
    ->where('cm.id', $id)
    ->first();
     $complainDetails->complainants =  DB::table('complainants')
     ->leftJoin('district_master as ddn', 'complainants.permanent_district', '=', 'ddn.district_code')
    ->select('complainants.*','ddn.district_name')
     ->where('complaint_id', $id)
    ->get();
     $complainDetails->respondant =  DB::table('respondents')
      ->leftJoin('district_master as r', 'respondents.respondent_district', '=', 'r.district_code')
    ->select('respondents.*','r.district_name')
    ->where('complaint_id', $id)
    ->get();
     $complainDetails->support =  DB::table('complaint_supporting')
    ->where('complaint_id', $id)
    ->get();
     $complainDetails->witness =  DB::table('complaint_witness')
    ->where('complaint_id', $id)
    ->get();
      $complainDetails->actions =  DB::table('complaint_actions')
    ->where('complaint_id', $id)
     ->where(function($q){
                            $q->where('status','Verified')
                            ->Orwhere('status', 'Forwarded');               
                         })
    ->get();

           

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
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

//     public function getUsers(){
     
//         $usersByRole = User::with('role')
//          ->whereNotNull('role_id')
//         ->get()
//         ->groupBy(fn ($user) => $user->role->name);
        

//          if(!empty($usersByRole['lok-ayukt'])){

//            return response()->json($usersByRole['lok-ayukt']);
//         }else{

//             return response()->json(["message"=>"Data Not Found"]);
//         }
//         // dd($usersByRole['lok-ayukt']);
//    }

   public function getUsers(){
     
        $usersByRole = User::with('role')
         ->whereNotNull('role_id')
        ->get()
        ->groupBy(fn ($user) => $user->role->name);
        

         if(!empty($usersByRole['lok-ayukt'])){
            $data[] =  $usersByRole['lok-ayukt'];
            $data[] =  $usersByRole['up-lok-ayukt'];

           return response()->json($data);
        }else{

            return response()->json(["message"=>"Data Not Found"]);
        }
        // dd($usersByRole['lok-ayukt']);
   }


   public function getUpLokayuktUsers(){
    $usersByRole = User::with('role')
     ->whereNotNull('role_id')
        ->get()
        ->groupBy(fn ($user) => $user->role->name);
        if(!empty($usersByRole['up-lok-ayukt'])){

            return response()->json($usersByRole['up-lok-ayukt']);
        }else{

            return response()->json(["message"=>"Data Not Found"]);
        }
       
   }
   public function getDealingAssistantUsers(){
    // $usersBySubRole = User::with('role','subrole')
    //     ->get()
    //     ->groupBy(fn ($user) => $user->subrole->name);
    $usersBySubRole = User::with('role', 'subrole')
    ->whereNotNull('sub_role_id') // only users with subrole
    ->get()
    ->groupBy(fn ($user) => $user->subrole->name);
        // dd($usersBySubRole);
         if(!empty($usersBySubRole['dea-assis'])){

            return response()->json($usersBySubRole['dea-assis']);
        }else{

            return response()->json(["message"=>"Data Not Found"]);
        }
   }

   public function getSubROleUsers(){
     
        $users = User::with('subrole')
         ->whereNotNull('sub_role_id')
        ->get();
        $users = $users->map(function ($item) {
        if($item->subrole){
          return [
                'id' => $item->id,
                'name' => ucfirst($item->name),
                'subrole_name' => $item->subrole->label,
               
            ];
        }
         
        })->toArray();
        // dd($users);
        // ->groupBy(fn ($user) => $user->role->name);
        

         if($users){

           return response()->json($users);
        }else{

            return response()->json(["message"=>"Data Not Found"]);
        }
        // dd($usersByRole['lok-ayukt']);
   }
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

    public function disposeComplaints(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        // dd($usersubrole);
   

        $validation = Validator::make($request->all(), [
            // 'forward_by_so_us' => 'required|exists:users,id',
          
            'remark' => 'required|string|max:500',
         
          
        ], [
            'remark.required' => 'Remark is required.',
           
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
                $cmp->status = "Disposed - Accepted";
               
                if($cmp->save()){
                    $apcAction = new ComplaintAction();
                    $apcAction->complaint_id = $complainId;
                    $apcAction->status = 'Final Decision';
                    $apcAction->remarks = $request->remark;
                    $apcAction->save();
                }
              
            }
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


    // public function forwardComplaintbylokayukt(Request $request,$complainId){
    //     //    dd($request->all());
    //     $user = Auth::user()->id;
    //     // dd($usersubrole);
   

    //     $validation = Validator::make($request->all(), [
    //         // 'forward_by_ds_js' => 'required|exists:users,id',
    //         'forward_to' => 'required|exists:users,id',
    //         'remark' => 'required',
         
          
    //     ], [
    //         // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
    //         // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
    //         'forward_to.required' => 'Forward to user is required.',
    //         'forward_to.exists' => 'Forward to user does not exist.',
    //         'remark.required' => 'Remark is required.',
           
    //     ]);

    //     if ($validation->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'errors' => $validation->errors()
    //         ], 422);
    //     }
    //     if(isset($complainId) && $request->isMethod('post')){

    //         //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
    //         // dd($user[0]->role->name);
    //         // $roleFwd = $userRole[0]->role->name;

              
    //         $cmp =  Complaint::findOrFail($complainId);
    //         // dd($cmp);

    //            if($cmp){
    //             $cmp->approved_rejected_by_d_a = 1;
    //             // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //             // $remark ='Remark By Deputy Secretary / Joint Secretary';
    //             // $remark.='\n';
    //             // $remark.= $request->remarks;
    //             // $remark.='\n';
    //             // $cmp->remark = $remark;
                
    //                 if($cmp->save()){
    //                     $apcAction = new ComplaintAction();
    //                     $apcAction->complaint_id = $complainId;
    //                     $apcAction->forward_by_lokayukt = $user;

    //                     $apcAction->forward_to_uplokayukt = $request->forward_to;
                       
    //                     $apcAction->status = 'Forwarded';
    //                     $apcAction->type = '1';
    //                     $apcAction->remarks = $request->remark;
    //                     $apcAction->save();
    //                 }
                
    //             }
    //          return response()->json([
    //                 'status' => true,
    //                 'message' => 'Forwarded Successfully',
    //                 'data' => $cmp
    //             ], 200);
    //     }else{
            
    //          return response()->json([
    //                 'status' => false,
    //                 'message' => 'Please check Id'
    //             ], 401);
    //     }

    // }

    // public function forwardComplaintbylokayukt(Request $request,$complainId){
     
    //     $user = Auth::user()->id;
    //     // dd($usersubrole);
   

    //     $validation = Validator::make($request->all(), [
    //         // 'forward_by_ds_js' => 'required|exists:users,id',
    //         'forward_to' => 'required|exists:users,id',
    //         'remark' => 'required',
         
          
    //     ], [
    //         // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
    //         // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
    //         'forward_to.required' => 'Forward to user is required.',
    //         'forward_to.exists' => 'Forward to user does not exist.',
    //         'remark.required' => 'Remark is required.',
           
    //     ]);

    //     if ($validation->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'errors' => $validation->errors()
    //         ], 422);
    //     }
    //     if(isset($complainId) && $request->isMethod('post')){

    //         //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
    //         // dd($user[0]->role->name);
    //         // $roleFwd = $userRole[0]->role->name;

              
    //         $cmp =  Complaint::findOrFail($complainId);
    //         // dd($cmp);

    //            if($cmp){
    //             $cmp->approved_rejected_by_d_a = 1;
    //             // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //             // $remark ='Remark By Deputy Secretary / Joint Secretary';
    //             // $remark.='\n';
    //             // $remark.= $request->remarks;
    //             // $remark.='\n';
    //             // $cmp->remark = $remark;
                
    //                 if($cmp->save()){
    //                     $apcAction = new ComplaintAction();
    //                     $apcAction->complaint_id = $complainId;
    //                     $apcAction->forward_by_lokayukt = $user;

    //                     $apcAction->forward_to_uplokayukt = $request->forward_to;
                       
    //                     $apcAction->status = 'Forwarded';
    //                     $apcAction->type = '1';
    //                     $apcAction->remarks = $request->remark;
    //                     $apcAction->save();
    //                 }
                
    //             }
    //          return response()->json([
    //                 'status' => true,
    //                 'message' => 'Forwarded Successfully',
    //                 'data' => $cmp
    //             ], 200);
    //     }else{
            
    //          return response()->json([
    //                 'status' => false,
    //                 'message' => 'Please check Id'
    //             ], 401);
    //     }

    // }

//     public function forwardComplaintbylokayukt(Request $request,$complainId){
//     //    dd($request->all());
//        $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
//             // dd($user[0]->subrole->name);
//         $subroleFwd = $user[0]->subrole->name;
//     $userId = Auth::user()->id;
//     // dd($usersubrole);


//     $validation = Validator::make($request->all(), [
//         // 'forward_by_ds_js' => 'required|exists:users,id',
//         'forward_to' => 'required|exists:users,id',
//         'remark' => 'required',
     
      
//     ], [
//         // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
//         // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
//         'forward_to.required' => 'Forward to user is required.',
//         'forward_to.exists' => 'Forward to user does not exist.',
//         'remark.required' => 'Remark is required.',
       
//     ]);

//     if ($validation->fails()) {
//         return response()->json([
//             'status' => false,
//             'errors' => $validation->errors()
//         ], 422);
//     }
//     if(isset($complainId) && $request->isMethod('post')){

//         //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
//         // dd($user[0]->role->name);
//         // $roleFwd = $userRole[0]->role->name;

          
//         $cmp =  Complaint::findOrFail($complainId);
//         // dd($cmp);

//            if($cmp){
//             // $cmp->approved_rejected_by_d_a = 1;
//             // $cmp->forward_to_d_a = $request->forward_to_d_a;
//             // $remark ='Remark By Deputy Secretary / Joint Secretary';
//             // $remark.='\n';
//             // $remark.= $request->remarks;
//             // $remark.='\n';
//             // $cmp->remark = $remark;
            
//                 if($cmp->save()){
//                     $apcAction = new ComplaintAction();
//                     $apcAction->complaint_id = $complainId;
//                     $apcAction->forward_by_lokayukt = $userId;

//                      $apcAction = new ComplaintAction();
//                         $apcAction->complaint_id = $complainId;
//                         $apcAction->forward_by_lokayukt = $userId;

//                           if($subroleFwd === "ds-js"){
//                                 $apcAction->forward_to_ds_js = $request->forward_to;
                              
//                           }elseif($subroleFwd ==="sec"){
//                                 $apcAction->forward_to_sec = $request->forward_to;
                 
//                         }elseif($subroleFwd ==="cio-io"){

//                                 $apcAction->forward_to_cio_io = $request->forward_to;
                                
//                         }elseif($subroleFwd ==="so-us"){

//                                 $apcAction->forward_to_so_us = $request->forward_to;
                                
//                         }   
//                     // $apcAction->forward_to_uplokayukt = $request->forward_to;
                   
//                     $apcAction->status = 'Forwarded';
//                     $apcAction->type = '1';
//                     $apcAction->remarks = $request->remark;
//                     $apcAction->save();
//                 }
            
//             }
//          return response()->json([
//                 'status' => true,
//                 'message' => 'Forwarded Successfully',
//                 'data' => $cmp
//             ], 200);
//     }else{
        
//          return response()->json([
//                 'status' => false,
//                 'message' => 'Please check Id'
//             ], 401);
//     }

// }
    
 public function forwardComplaintbyLokayukt(Request $request,$complainId){
        //    dd($request->all());
        // $user = Auth::user()->id;
        // dd($usersubrole);

        $userRole = User::with('role')->where('id',$request->forward_to)->get();

        
            $roleFwd = $userRole[0]->role->name ?? null;
        // dd($roleFwd);
        
          $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
            $subroleFwd = '';
            
            $subroleFwd = $user[0]->subrole->name ?? null;

        
 

        $userId = Auth::user()->id;
   

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to' => 'required|exists:users,id',
            'remark' => 'required',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to.required' => 'Forward to user is required.',
            'forward_to.exists' => 'Forward to user does not exist.',
            'remark.required' => 'Remark is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post')){

            //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_lokayukt = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){

                         $apcAction = new ComplaintAction();
                        //     $apcAction->complaint_id = $complainId;
                        //     $apcAction->forward_by_lokayukt = $userId;

                             

                        
                        //     if($roleFwd === "lok-ayukt" || $roleFwd === "up-lok-ayukt"){
                        //             if($roleFwd === "lok-ayukt"){
                        //             $apcAction->forward_to_lokayukt = $request->forward_to;
                        //         }elseif($roleFwd === "up-lok-ayukt"){
                        //             $apcAction->forward_to_uplokayukt = $request->forward_to;
                        //         }
                        //     }else if($roleFwd === "supervisor"){
                        //             if($subroleFwd === "ds-js"){
                        //             $apcAction->forward_to_ds_js = $request->forward_to;
                                
                        //     }elseif($subroleFwd ==="sec"){
                        //             $apcAction->forward_to_sec = $request->forward_to;
                    
                        //     }elseif($subroleFwd ==="cio-io"){

                        //             $apcAction->forward_to_cio_io = $request->forward_to;
                                    
                        //     }elseif($subroleFwd ==="so-us"){

                        //             $apcAction->forward_to_so_us = $request->forward_to;
                                    
                        //     }
                        //     }
                          
  
                        // // $apcAction->forward_to_uplokayukt = $request->forward_to;
                    
                        // $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
                        // $apcAction->remarks = $request->remark;
                        // $apcAction->save();

                        $apcAction = new ComplaintAction();
                        $apcAction->complaint_id = $complainId;
                        $apcAction->forward_by_lokayukt = $userId;

                        if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt'])) {

                            if ($roleFwd === 'lok-ayukt') {
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            } else {
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }

                        } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                case 'ds-js':
                                    $apcAction->forward_to_ds_js = $request->forward_to;
                                    break;

                                case 'sec':
                                    $apcAction->forward_to_sec = $request->forward_to;
                                    break;

                                case 'cio-io':
                                    $apcAction->forward_to_cio_io = $request->forward_to;
                                    break;

                                case 'so-us':
                                    $apcAction->forward_to_so_us = $request->forward_to;
                                    break;
                            }
                        }

                        $apcAction->status = 'Forwarded';
                        $apcAction->type = '1';
                        $apcAction->remarks = $request->remark;
                        $apcAction->save();


                        // $apcAction = new ComplaintAction();
                        // $apcAction->complaint_id = $complainId;
                        // $apcAction->forward_by_ps = $userId;

                        // $apcAction->forward_to_lokayukt = $request->forward_to;
                       
                        // $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
                        // $apcAction->remarks = $request->remark;
                        // $apcAction->save();
                    }
                
                }
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

    public function allComplainspending(){

        // $userSubrole = Auth::user()->subrole->name; 
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                // ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
                // ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
                // ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
                // ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                     'dd.district_name as district_name',
                    // 'dd.district_name',
                    // 'dp.name as department_name',
                    // 'ds.name as designation_name',
                    // 'ct.name as complaintype_name',
                    // 'sub.name as subject_name'
                );
                // ->where('form_status',1)
                // ->where('approved_rejected_by_ro',1)
                // ->where('approved_rejected_by_so_us',0)
                // ->get();
                
    $complainDetails->where('form_status', 1)
        ->where('approved_rejected_by_ro', 1)
                    ->where(function($q){
                            $q->where('approved_rejected_by_so_us',1)
                            ->Orwhere('approved_rejected_by_ds_js', 1);               
                         })
                    ->where('approved_rejected_by_d_a', 1)
                    ->where('approved_rejected_by_lokayukt', 0);
    $complainDetails = $complainDetails->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsapproved(){
    //    $userSubrole = Auth::user()->subrole->name; 
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                // ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
                // ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
                // ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
                // ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                     'dd.district_name as district_name',
                    // 'dp.name as department_name',
                    // 'ds.name as designation_name',
                    // 'ct.name as complaintype_name',
                    // 'sub.name as subject_name'
                );

                
     $complainDetails->where('form_status', 1)
            // ->where('approved_rejected_by_ro', 1)
            //             ->where('approved_rejected_by_d_a',1)
                        ->where('approved_rejected_by_lokayukt',1);
            //              ->where(function($q){
            //                 $q->where('approved_rejected_by_so_us',1)
            //                 ->Orwhere('approved_rejected_by_ds_js', 1);               
                        //  });
    $complainDetails = $complainDetails
                      
                        // ->toSql();
                      ->get();

                // ->where('form_status',1)
                // ->where('approved_rejected_by_ro',1)
                // ->where('approved_rejected_by_so_us',1)
                // ->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

      public function uploadDocument(Request $request)
    {
        
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

    public function getUploadDoc(Request $request,$id){
        if($request->isMethod('get')){
            $complain = ComplainDocuments::where('complain_id',$id)->get();

           return response()->json([
                    'status' => true,
                    'message' => 'Document Fetch successfully.',
                    'data' => $complain
                ], 200);
        }
       
    }

    public function getNotes(Request $request,$id){
        if($request->isMethod('get')){
            $Notes = ComplaintNotes::where('complaint_id',$id)->get();

           return response()->json([
                    'status' => true,
                    'message' => 'Notes Fetch successfully.',
                    'data' => $Notes
                ], 200);
        }
       
    }

     public function addNotes(Request $request)
    {
       
        // $user = $request->user()->id;
        $added_by = Auth::user()->id;
    
        $validation = Validator::make($request->all(), [
            
            'complaint_id' => 'required|numeric',
            // 'type' => 'required|string',
            // 'title' => 'required|string',
            'description' => 'required|string',
            'd_id' => 'required',
            // 'forward_by' => 'required',
            // 'forward_to' => 'required',
            'range_from' => 'required',
            'range_two' => 'required',
            
        ], [
            'complaint_id.required' => 'Complaint Id is required.',
            // 'type.required' => 'Complaint description is required.',
            // 'title.required' => 'Letter Subject is Required',
            'description.required' => 'Description is Required',
            'd_id.required' => 'Document is Required',
            'range_from.required' => 'Range From is Required',
            'range_two.required' => 'Range too is Required',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        if(isset($request->complaint_id)){    
                $compDoc = new ComplaintNotes();
                $compDoc->complaint_id = $request->complaint_id;
                $compDoc->added_by = $added_by;
                // $compDoc->type = $request->type;
                // $compDoc->title = $request->title;
                $compDoc->description = $request->description;
                $compDoc->forward_by = $added_by;
                $compDoc->forward_to = $request->forward_to;
                $compDoc->d_id = $request->d_id;
                $compDoc->range_from = $request->range_from;
                $compDoc->range_two = $request->range_two;
                $compDoc->save();
              
                return response()->json([
                    'status' => true,
                    'message' => 'Document Added successfully.',
                    'data' => $compDoc
                ], 201);
        }

    }
     public function getFilePreview($id){
        $cmp = Complaint::findOrFail($id);
        $cmpDetail = ComplainDocuments::where('complain_id',$cmp->id)->get();
        foreach($cmpDetail as $c){

            $path[] = Storage::url($c->file);

            $cmp->filepath = $path;
        }
           return response()->json([
               'status' => true,
               'message' => 'File Fetch successfully',
               'data' => $cmp->filepath,
           ]);

    }

     public function returnComplainByLokayukt(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        // dd($usersubrole);
   

        // $validation = Validator::make($request->all(), [
        //     // 'forward_by_so_us' => 'required|exists:users,id',
        //     'forward_to_d_a' => 'required|exists:users,id',
        //     // 'remark' => 'required',
         
          
        // ], [
        //     // 'forward_by_so_us.required' => 'Forward by Supervisor is required.',
        //     // 'forward_by_so_us.exists' => 'Forward by user does not exist.',
        //     'forward_to_d_a.required' => 'Forward to user is required.',
        //     'forward_to_d_a.exists' => 'Forward to user does not exist.',
        //     // 'remark.required' => 'Remark is required.',
           
        // ]);

        // if ($validation->fails()) {
        //     return response()->json([
        //         'status' => false,
        //         'errors' => $validation->errors()
        //     ], 422);
        // }
        if(isset($complainId) && $request->isMethod('post')){

             $cmp =  Complaint::findOrFail($complainId);
             
            if($cmp){
                $cmp->approved_rejected_by_rk = 0;
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
                    $apcAction->status = 'Return';
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
                    'message' => 'Return Successfully',
                    'data' => $cmp
                ], 200);
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

    public function pullBackByLokayukt(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
       
        if(isset($complainId) && $request->isMethod('post')){

             $cmp =  Complaint::findOrFail($complainId);
             
            if($cmp){
                $cmp->approved_rejected_by_rk = 0;
                $cmp->save(); 
            }
          
             return response()->json([
                    'status' => true,
                    'message' => 'Pull Back Successfully',
                    'data' => $cmp
                ], 200);
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

    public function approvedFeeByLokayukt(Request $request, $complaint_id){

        // dd($complaint_id);
         $validation = Validator::make($request->all(), [
            'fee_exempted' => 'required|string',
            'remarks' => 'required|string',
        
        ], [
            'fee_exempted.required' => 'Fees is required.',
            'remarks.required' => 'Remarks is Required',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        

        if(isset($complaint_id)){
            
             $cmp = Complaint::find($complaint_id);
             if($cmp == null){
                return response()->json([
                'status' => false,
                'errors' => 'Please Check Complaint Id'
            ], 422);
             }
           $cmp->fee_exempted  = $request->fee_exempted;
           $cmp->fee_approved_by_lokayukt  = 1;
     
            if($cmp->save()){
            
                    
                $apcAction = new ComplaintAction();
                                $apcAction->complaint_id = $complaint_id;
                                $apcAction->status = 'Fees Approved';
                                $apcAction->remarks = $request->remarks;
                                $apcAction->save();
            }
            return response()->json([
                    'status' => true,
                    'message' => 'Fee Added successfully.'
                ], 201);

        }
   
    
    }

        public function approvedByLokayukt(Request $request,$id){
         $userId = Auth::user()->id;

           $validation = Validator::make($request->all(), [
            'forward_to' => 'required',
        
        ], [
            'forward_to.required' => 'Uplokayukt is required.',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        
        if(isset($id) && $request->isMethod('post')){

                $apc = Complaint::findOrFail($id);
                $apc->form_status = 1;
                $apc->approved_rejected_by_lokayukt = 1;
                // $apc->approved_by_ro_id =  $userId;
                
                if($apc->save()){
                     $apcAction = new ComplaintAction();
                    $apcAction->complaint_id = $id;
                    // $apcAction->status = 'Forwarded';
                    // $apcAction->remarks = "Sent complain to Uplokayukt";
                    $apcAction->forward_by_lokayukt = $userId;
                    $apcAction->forward_to_uplokayukt = $request->forward_to;
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
}
