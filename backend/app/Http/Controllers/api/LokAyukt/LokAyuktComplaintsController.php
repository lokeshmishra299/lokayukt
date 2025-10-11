<?php

namespace App\Http\Controllers\api\LokAyukt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\ComplaintAction;
use App\Models\SubRole;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


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
                  ->where('approved_rejected_by_ro', 1)
                    ->where(function($q){
                            $q->where('approved_rejected_by_so_us',1)
                            ->Orwhere('approved_rejected_by_ds_js', 1);               
                         })
                    ->where('approved_rejected_by_d_a', 1);
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

            //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
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
                        $apcAction->forward_by_lokayukt = $user;

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
            ->where('approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_d_a',1)
                        ->where('approved_rejected_by_lokayukt',1)
                         ->where(function($q){
                            $q->where('approved_rejected_by_so_us',1)
                            ->Orwhere('approved_rejected_by_ds_js', 1);               
                         });
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
