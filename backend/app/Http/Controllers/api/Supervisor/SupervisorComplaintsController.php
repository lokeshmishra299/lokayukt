<?php

namespace App\Http\Controllers\api\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ComplaintAction;
use App\Models\SubRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SupervisorComplaintsController extends Controller
{
    public function allComplains(){
        $user = Auth::user()->id;
        // dd($user);
      $userSubrole = Auth::user()->subrole->name; 
   
    if ($userSubrole) {
    $query = DB::table('complaints')
        //  ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
        ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
        // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
        // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
        // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
        // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
        ->leftJoin('complaint_actions as rep', 'complaints.id', '=', 'rep.complaint_id')
        ->select(
            'complaints.*',
            'dd.district_name as district_name',
            // 'dp.name as department_name',
            // 'ds.name as designation_name',
            // 'ct.name as complaintype_name',
            // 'sub.name as subject_name',
            // // 'rep.*',
            // 'rep.forward_by_so_us as forward_so',
            // 'rep.forward_to_ds_js as forward_ds',
            // 'rep.forward_to_sec as forward_sec',
            // 'rep.forward_to_cio_io as forward_cio',
            // 'rep.forward_to_lokayukt as forward_lokayukt',
            // 'rep.forward_to_uplokayukt as forward_uplokayukt',
            // 'rep.forward_by_so_us as by_so',
            // 'rep.forward_by_ds_js as by_ds',
            // 'rep.forward_by_sec as by_sec',
            // 'rep.forward_by_cio_io as by_cio',
            // 'rep.forward_by_lokayukt as by_lokayukt',
            // 'rep.forward_by_uplokayukt as by_uplokayukt',
            //  'cd.department_id',
            //  'cd.officer_name',
            //   'cd.designation_id',
            //    'cd.designation_id',
            //    'cd.category',
            //     'cd.title',
            //     'cd.file',
            //     'cd.subject_id',
            //     'cd.complaintype_id',
            //     'cd.description',
            

        );
//     $query = DB::table('complaints')
//     ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
//     ->select(
//         'complaints.*',
//         'dd.district_name as district_name'
//     )
//     // ->where('complaints.id', $id)
//     ->first();

// $query->details = DB::table('complaints_details as cd')
//     ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
//     ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
//     ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
//     ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
//     ->select(
//         'cd.*',
//         'dp.name as department_name',
//         'ds.name as designation_name',
//         'ct.name as complaintype_name',
//         'sub.name as subject_name'
//     );
        // ->where('form_status', 1)
        // ->where('approved_by_ro', 1);

    switch ($userSubrole) {
        case "so-us":
            $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_ds_js', 0);
                //   ->where('approved_by_ro', 1);
            // $query->where('complaints.added_by', $user);
            break;

        case "ds-js":
          $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_so_us', 0);
                //   ->where('forward_so', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "sec":
        //    $query->where('form_status', 1)
        //           ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
                // $query->groupBy('rep.target_date');    
                        $query->where('rep.type', 2)
                                ->where('rep.status', 'Verified')
                                ->whereNotNull('rep.forward_to_sec')
                                 ->where('rep.forward_to_sec',$user);
                //  $query->where('rep.type', 2)
                //                 ->where('rep.status', 'Report Requested')
                //                 ->whereNotNull('rep.forward_to_sec')
                //                  ->where('rep.forward_to_sec',$user);
            break;

        case "cio-io":
             $query->where('rep.type', 2)
                                ->where('rep.status', 'Investigation Report')
                                ->whereNotNull('rep.forward_to_cio_io')
                                 ->where('rep.forward_to_cio_io',$user);
        //    $query->where('form_status', 1)
        //           ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "dea-assis":
          $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                   ->where(function($q){
                            $q->where('approved_rejected_by_so_us',1)
                            ->Orwhere('approved_rejected_by_ds_js', 1);               
                         });
                    // ->whereNotNull('forward_to_d_a');
            break;

        default:
            return response()->json([
                'status' => false,
                'message' => 'Invalid subrole',
                'data' => [],
            ], 400);
    }

    $records = $query->get();

    return response()->json([
        'status' => true,
        'message' => 'Records fetched successfully',
        'data' => $records,
    ]);
}

}
       public function viewComplaint($id)
  {
    //    $complainDetails = DB::table('complaints as cm')
    //    ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
    // ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
    // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
    // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
    // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
    // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
    // ->select(
    //     'cm.*',
    //     'dd.district_name',
    //     'dp.name as department_name',
    //     'ds.name as designation_name',
    //     'ct.name as complaintype_name',
    //     'sub.name as subject_name',
    //     // 'cd.*'
    // )
    // ->where('cm.id', $id)
    // ->first();

    $complainDetails = DB::table('complaints as cm')
    ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
    ->select(
        'cm.*',
        'dd.district_name'
    )
    ->where('cm.id', $id)
    ->first();

$complainDetails->details = DB::table('complaints_details as cd')
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
                    $apcAction->type = '1';
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

    public function forwardComplaintbyds(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        // dd($usersubrole);
   

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to_d_a' => 'required|exists:users,id',
            'remarks' => 'required',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to_d_a.required' => 'Forward to user is required.',
            'forward_to_d_a.exists' => 'Forward to user does not exist.',
            'remarks.required' => 'Remark is required.',
           
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
                $cmp->approved_rejected_by_ds_js = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){
                        $apcAction = new ComplaintAction();
                        $apcAction->complaint_id = $complainId;
                        $apcAction->forward_by_ds_js = $user;
                        $apcAction->forward_to_d_a = $request->forward_to_d_a;
                        $apcAction->status = 'Forwarded';
                        $apcAction->type = '1';
                        $apcAction->remarks = $request->remarks;
                        $apcAction->save();
                    }
                
                // $cmpAction =new ComplaintAction();
                // $cmpAction->complaint_id = $complainId;
                // $cmpAction->forward_by_ds_js = $user;
                // $cmpAction->forward_to_d_a = $request->forward_to_d_a; //add supervisor user_id 
                // $cmpAction->status_ds_js = 1;
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

      public function forwardComplaintbyda(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        // dd($usersubrole);
   

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

             $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_d_a = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){
                        $apcAction = new ComplaintAction();
                        $apcAction->complaint_id = $complainId;
                        $apcAction->forward_by_d_a = $user;

                         if($roleFwd === "lok-ayukt"){
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            }elseif($roleFwd === "up-lok-ayukt"){
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }

                        $apcAction->status = 'Forwarded';
                          $apcAction->type = '1';
                        $apcAction->remarks = $request->remark;
                        $apcAction->save();
                    }
                
                // $cmpAction =new ComplaintAction();
                // $cmpAction->complaint_id = $complainId;
                // $cmpAction->forward_by_ds_js = $user;
                // $cmpAction->forward_to_d_a = $request->forward_to_d_a; //add supervisor user_id 
                // $cmpAction->status_ds_js = 1;
                // $cmpAction->action_type = "Forwarded";
                // $cmpAction->remarks = $request->remarks;
                // $cmpAction->save();
            }
            //

            // if($cmp){
            //     $cmp->approved_rejected_by_d_a = 1;
            //     // $cmp->forward_to_d_a = $request->forward_to_d_a;
            //     if($roleFwd == "lok-ayukt"){
            //         $cmp->forward_to_lokayukt = $request->forward_to;
            //     }elseif($roleFwd =="up-lok-ayukt"){
            //         $cmp->forward_to_uplokayukt = $request->forward_to;
            //     }
            //     $remark ='Remark By Dealing Assistant';
            //     $remark.='\n';
            //     $remark.= $request->remarks;
            //     $remark.='\n';
            //     $cmp->remark = $remark;
            //     $cmp->save();
            //     // $cmpAction =new ComplaintAction();
            //     // $cmpAction->complaint_id = $complainId;
            //     // $cmpAction->forward_by_ds_js = $user;
            //     // $cmpAction->forward_to_d_a = $request->forward_to_d_a; //add supervisor user_id 
            //     // $cmpAction->status_ds_js = 1;
            //     // $cmpAction->action_type = "Forwarded";
            //     // $cmpAction->remarks = $request->remarks;
            //     // $cmpAction->save();
            // }
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
    
      public function forwardComplaintbylokayukt(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        // dd($usersubrole);
   

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

             $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_d_a = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){
                        $apcAction = new ComplaintAction();
                        $apcAction->complaint_id = $complainId;
                        $apcAction->forward_by_d_a = $user;
                        $apcAction->forward_to_uplokayukt = $request->forward_to;
                        $apcAction->status = 'Forwarded';
                        $apcAction->type = '1';
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
    

    public function allComplainspending(){

        $userSubrole = Auth::user()->subrole->name; 
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
                
    switch ($userSubrole) {
        case "so-us":
            $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_so_us', 0)
                  ->whereNot('approved_rejected_by_ds_js', 1);
                  
                //   ->where('approved_by_ro', 1);
            // $complainDetails->where('complaints.added_by', $user);
            break;

        case "ds-js":
          $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_so_us', 0)
                  ->where('approved_rejected_by_ds_js', 0);
                //   ->where('forward_so', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "sec":
           $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "cio-io":
           $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "dea-assis":
          $complainDetails->where('form_status', 1)
            ->where('approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_d_a',0)
                         ->where(function($q){
                            $q->where('approved_rejected_by_so_us',1)
                            ->Orwhere('approved_rejected_by_ds_js', 1);               
                         });
            break;

        default:
            return response()->json([
                'status' => false,
                'message' => 'Invalid subrole',
                'data' => [],
            ], 400);
    }
    $complainDetails = $complainDetails->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsapproved(){
       $userSubrole = Auth::user()->subrole->name; 
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

                
    switch ($userSubrole) {
        case "so-us":
            $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_so_us', 1);
               
                //   ->where('approved_by_ro', 1);
            // $complainDetails->where('complaints.added_by', $user);
            break;

        case "ds-js":
          $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_so_us', 0)
                //   ->whereOr('approved_rejected_by_so_us', 1)
                  ->where('approved_rejected_by_ds_js', 1);
                //   ->where('forward_so', 1)
                //   ->whereOr('forward_to_uplokayukt', 1); 
            break;

        case "sec":
           $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "cio-io":
           $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "dea-assis":
          $complainDetails->where('form_status', 1)
            ->where('approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_d_a',1)
                         ->where(function($q){
                            $q->where('approved_rejected_by_so_us',1)
                            ->Orwhere('approved_rejected_by_ds_js', 1);               
                         });
                       
                   
            break;

        default:
            return response()->json([
                'status' => false,
                'message' => 'Invalid subrole',
                'data' => [],
            ], 400);
    }
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

}
