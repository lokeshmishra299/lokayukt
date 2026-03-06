<?php

namespace App\Http\Controllers\api\PS;

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


class PSComplaintsController extends Controller
{
      public function allComplains(){
        $user = Auth::user()->id;
        $parentId = null;
        $parentId = Auth::user()->parent_user_id;
        // dd($parentId);
        $userParentData = User::with('role')->where('id',$parentId)->get();
        $roleParent = $userParentData[0]->role->name;
        // dd($roleParent);
           $userParentSubrole = Auth::user()->userParentRole ?? '';  


    $query = DB::table('complaints')
    ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
    ->leftJoin('complainants as cmlan', function ($join) {
                    $join->on('complaints.id', '=', 'cmlan.complaint_id')
                        ->where('cmlan.is_main', 1);
                })
                    ->leftJoin('respondents as resp', function ($join) {
                    $join->on('complaints.id', '=', 'resp.complaint_id')
                        ->where('resp.is_main', 1);
                })
    ->leftJoin('district_master as dd1', 'cmlan.permanent_district', '=', 'dd1.district_code');

    // 🔥 Join only latest action
    if($roleParent === 'up-lok-ayukt' || $roleParent === 'supervisor'){
            $query->join(DB::raw('
        (SELECT complaint_id, MAX(id) as max_id 
         FROM complaint_actions 
         GROUP BY complaint_id) as latest_rep
    '), 'complaints.id', '=', 'latest_rep.complaint_id')

    ->join('complaint_actions as rep', 'rep.id', '=', 'latest_rep.max_id');

    }
    // else{
    //     $query->join('complaint_actions as rep', 'rep.id', '=', 'complaints.id');
    // }

    $query->select(
        'complaints.id',
        'complaints.complain_no',
        'complaints.complaint_description',
        'complaints.cause_date',
        'complaints.category',
        'complaints.fee_exempted',
        'complaints.approved_rejected_by_rk',
        'complaints.approved_rejected_by_ps',
        'complaints.approved_rejected_by_lokayukt',
        'complaints.created_at',
        'complaints.updated_at',
        'complaints.status',

        'dd.district_name',
        'dd1.district_name as dist_new'
    );
if($roleParent === 'lok-ayukt'){
    //   $query->whereNotExists(function ($q) {
    //     $q->select(DB::raw(1))
    //       ->from('complaint_actions as rep')
    //       ->whereColumn('rep.complaint_id', 'complaints.id')
    //       ->where(function ($q2) {
    //           $q2->whereNotNull('rep.forward_by_ps')
    //              ->orWhere('rep.forward_by_lokayukt', '<>', 0);
    //       });
    // });

//     $psId = auth()->id(); // current PS id

// $query->where('complaints.approved_rejected_by_ps','0')
// ->where(function ($mainQuery) use ($psId) {

//     // ✅ Existing functionality
//     $mainQuery->whereNotExists(function ($q) {
//         $q->select(DB::raw(1))
//           ->from('complaint_actions as rep')
//           ->whereColumn('rep.complaint_id', 'complaints.id')
//           ->where(function ($q2) {
//               $q2->whereNotNull('rep.forward_by_ps')
//                  ->orWhere('rep.forward_by_lokayukt', '<>', 0);
//           });
//     })

//     // ✅ OR → jo current PS ko assign ho wo bhi show
//     ->orWhereExists(function ($q) use ($psId) {
//         $q->select(DB::raw(1))
//           ->from('complaint_actions as rep')
//           ->whereColumn('rep.complaint_id', 'complaints.id')
//           ->where('rep.forward_to_ps', $psId);
//     });

// });
$psId = auth()->id();

$query->where(function ($q) use ($psId) {

    $q->whereExists(function ($sub) use ($psId) {
        $sub->select(DB::raw(1))
            ->from('complaint_actions as rep')
            ->whereColumn('rep.complaint_id', 'complaints.id')
            ->where('rep.forward_to_ps', $psId);
    })

    ->orWhere(function ($inner) {
        $inner->where('complaints.approved_rejected_by_rk', 1)
              ->whereNull('complaints.approved_rejected_by_ps');
    });

})
//update this code
->whereNotExists(function ($sub) use ($psId) {
    $sub->select(DB::raw(1))
        ->from('complaint_actions as rep')
        ->whereColumn('rep.complaint_id', 'complaints.id')
        ->where('rep.id', function ($q) {
            $q->select(DB::raw('MAX(id)'))
              ->from('complaint_actions')
              ->whereColumn('complaint_id', 'complaints.id');
        })
        ->where('rep.forward_by_ps', $psId);
})

// ->whereNotExists(function ($sub) use ($psId) {
//     $sub->select(DB::raw(1))
//         ->from('complaint_actions as rep')
//         ->whereColumn('rep.complaint_id', 'complaints.id')
//         ->where('rep.forward_by_ps', $psId);
// })   
    ->where('complaints.approved_rejected_by_lokayukt', '<>', 1);

}elseif($roleParent === 'up-lok-ayukt'){
    // $query->where('complaints.approved_rejected_by_rk', 1)
    //       ->where('complaints.approved_rejected_by_lokayukt', 1);
     $query->where('complaints.approved_rejected_by_rk', 1)
     ->where('complaints.approved_rejected_by_lokayukt', 1)
          ->whereNotNull('rep.forward_to_ps')
          ->where('rep.forward_to_ps', $user);

}elseif($roleParent === "supervisor" && $userParentSubrole->sub_role_id == 14){

    $query->where('rep.status', 'Forwarded')
          ->whereNotNull('rep.forward_to_sec')
          ->where('rep.forward_to_sec', $parentId);
}
$records = $query->orderBy('complaints.updated_at','DESC')->get();


     if ($roleParent === 'lok-ayukt') {
             $todayCount = DB::table('complaints')
                    ->where('in_draft', 0)
                    ->whereDate('created_at', today())
                     ->distinct('complaints.id')
                    ->count();

             
                $older7DaysCount = DB::table('complaints')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('created_at', '<', now()->subDays(7))
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 0)
                    ->where('created_at', '<', now()->subDays(7))
                     ->distinct('complaints.id')
                    ->count();
              
                $feePending = DB::table('complaints')
                    ->where('approved_rejected_by_rk', 1)
                    ->where('in_draft', 0)
                    ->where('fee_exempted', 0)
                     ->distinct('complaints.id')
                    ->count();           
     }elseif($roleParent === 'up-lok-ayukt'){
         $todayCount = DB::table('complaints')
             ->join('complaint_actions as rep','complaints.id', '=', 'rep.complaint_id')
                    ->where('in_draft', 0)
                    ->whereDate('rep.created_at', today())
                     ->distinct('complaints.id')
                     ->where('rep.forward_to_uplokayukt', $parentId)
                    ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->join('complaint_actions as rep','complaints.id', '=', 'rep.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('rep.created_at', '<', now()->subDays(7))
                    ->where('rep.forward_to_uplokayukt', $parentId)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->join('complaint_actions as rep','complaints.id', '=', 'rep.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 0)
                    ->where('rep.created_at', '<', now()->subDays(7))
                    ->where('rep.forward_to_uplokayukt', $parentId)
                     ->distinct('complaints.id')
                    ->count();
              
                $feePending = DB::table('complaints')
                ->join('complaint_actions as rep','complaints.id', '=', 'rep.complaint_id')
                    ->where('approved_rejected_by_rk', 1)
                    ->where('rep.forward_to_uplokayukt', $parentId)
                    ->where('in_draft', 0)
                    ->where('fee_exempted', 0)
                     ->distinct('complaints.id')
                    ->count();
     }elseif($roleParent ==="supervisor" && $userParentSubrole->sub_role_id == 14){
         $todayCount = DB::table('complaints')
             ->join('complaint_actions as rep','complaints.id', '=', 'rep.complaint_id')
                    ->where('in_draft', 0)
                    ->whereDate('rep.created_at', today())
                     ->distinct('complaints.id')
                     ->where('rep.forward_to_sec', $parentId)
                    ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->join('complaint_actions as rep','complaints.id', '=', 'rep.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('rep.created_at', '<', now()->subDays(7))
                    ->where('rep.forward_to_sec', $parentId)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->join('complaint_actions as rep','complaints.id', '=', 'rep.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 0)
                    ->where('rep.created_at', '<', now()->subDays(7))
                    ->where('rep.forward_to_sec', $parentId)
                     ->distinct('complaints.id')
                    ->count();
              
                $feePending = DB::table('complaints')
                ->join('complaint_actions as rep','complaints.id', '=', 'rep.complaint_id')
                    ->where('approved_rejected_by_rk', 1)
                    ->where('rep.forward_to_sec', $parentId)
                    ->where('in_draft', 0)
                    ->where('fee_exempted', 0)
                     ->distinct('complaints.id')
                    ->count();
     }
       
     


    return response()->json([
        'status' => true,
        'message' => 'Records fetched successfully',
        'data' => $records,
        'todayCount' => $todayCount,
        'older7DaysCount' => $older7DaysCount,
        'older7DaysDueCount' => $older7DaysDueCount,
        'feePending' => $feePending,
        'roleParent' => $roleParent,
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

//     $complainDetails = DB::table('complaints as cm')
//     ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
//     ->select(
//         'cm.*',
//         'dd.district_name'
//     )
//     ->where('cm.id', $id)
//     ->first();

// $complainDetails->details = DB::table('complaints_details as cd')
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
//     )
//     ->where('cd.complain_id', $id)
//     ->get();
             $complainDetails = DB::table('complaints as cm')
    ->leftJoin('users as u', 'cm.assign_to_ps', '=', 'u.id')
    ->leftJoin('district_master as ddn', 'cm.correspondence_district', '=', 'ddn.district_code')
    ->leftJoin('complaint_actions as ca', DB::raw("cm.id"), '=', DB::raw("ca.complaint_id"))
    

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
    // ->leftJoin('complainants as cpt', DB::raw("cm.id"), '=', DB::raw("cpt.	complaint_id "))
    // ->leftJoin('respondents as r', DB::raw("cm.id"), '=', DB::raw("r.complaint_id"))
    ->select(
        'cm.*',
        // 'dd.district_name',
        'ca.remarks as ca_remark',
        'ca.subject as ca_subject',
        'ca.status as ca_status',
        'cpt.complainant_name as main_complainant_name',
        'cpt.father_name as main_complainant_father',

        // main respondent
        'r.respondent_name as main_respondent_name',
        'r.designation as main_respondent_designation',
         'ddn.district_name as correspondence_district',
            'dmc.district_name as main_complainant_district',
        'rmc.district_name as main_respondant_district',
        'u.name as ps_assign_name',
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
    //   $complainDetails->actions =  DB::table('complaint_actions')
    // ->where('complaint_id', $id)
    // ->where('status','Forwarded')
    //  ->orderBy('id','desc')
    // //  ->where(function($q){
    // //                         $q->where('status','Forwarded');
                                     
    // //                      })
    // ->get();
        $actions = DB::table('complaint_actions')
    ->where('complaint_id', $id)
    ->orderBy('id', 'desc')
    ->get();

$userIds = [];

/* Sab forward_* fields se IDs collect karo */
foreach ($actions as $row) {

    foreach ($row as $key => $value) {

        if (
            str_starts_with($key, 'forward_') &&
            is_numeric($value)
        ) {
            $userIds[] = $value;
        }
    }
}

$userIds = array_unique($userIds);

/* Users ka data lao */
$users = DB::table('users')
    ->whereIn('id', $userIds)
    ->pluck('name', 'id'); // id => name


/* IDs ko name me convert karo */
foreach ($actions as $row) {

    foreach ($row as $key => $value) {

        if (
            str_starts_with($key, 'forward_') &&
            is_numeric($value)
        ) {
            $row->{$key . '_name'} = $users[$value] ?? null;
        }
    }
}

/* Final assign */
$complainDetails->actions = $actions;

           

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
//             $data[] =  $usersByRole['lok-ayukt'];
//             $data[] =  $usersByRole['up-lok-ayukt'];

//            return response()->json($data);
//         }else{

//             return response()->json(["message"=>"Data Not Found"]);
//         }
//         // dd($usersByRole['lok-ayukt']);
//    }

public function getUsers()
{
    $userId = Auth::user()->id;
    $usersByRole = User::with('role','subRole')
        ->whereHas('role') // ensures role exists
        ->where('id','<>',$userId)
        ->get()
        ->groupBy(function ($user) {
            return $user->role->name;
        });

    if (!empty($usersByRole['lok-ayukt'])) {

        $data = [];
        $data[] = $usersByRole['lok-ayukt'] ?? [];
        $data[] = $usersByRole['up-lok-ayukt'] ?? [];
        $data[] = $usersByRole['ps'] ?? [];
        $data[] = $usersByRole['supervisor'] ?? [];

        return response()->json($data);
    } else {
        return response()->json(["message" => "Data Not Found"]);
    }
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
     $userId = Auth::user()->id;
         $userParent = Auth::user()->parent_user_id;
     
        $users = User::with('subrole')
        //  ->whereNotNull('sub_role_id')
         ->where('parent_user_id',$userParent)
          ->where('id','<>',$userId)
        ->get();

             return response()->json($users);
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


    public function forwardComplaintbyPS(Request $request,$complainId){
        //    dd($request->all());
        // $user = Auth::user()->id;
        // dd($usersubrole);
         $parentId = null;
        $parentId = Auth::user()->parent_user_id;
        // dd($parentId);
        $userParentData = User::with('role')->where('id',$parentId)->get();
        $roleParent = $userParentData[0]->role->name;

        $userRole = User::with('role')->where('id',$request->forward_to)->get();

        
            $roleFwd = $userRole[0]->role->name;

            // dd($roleFwd);
            
          $user = User::with('role','subrole')->where('id',$request->forward_to)->get();

            $subroleFwd = $user[0]->subrole->name ?? '';

        
        // dd($roleFwd,$subroleFwd);
      

        $userId = Auth::user()->id;
        $userOtp = Auth::user()->otp;
   

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to' => 'required|exists:users,id',
            'otp' => 'required|numeric',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to.required' => 'Forward to user is required.',
            'forward_to.exists' => 'Forward to user does not exist.',
            'otp.required' => 'OTP is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post') && $request->filled('otp')){
            if($request->otp === $userOtp){
                  //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_ps = 1;  


                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                    if($roleParent ==="up-lok-ayukt"){
                         $cmp->assign_to_ps = null;           
                    }

                    if($cmp->save()){

                         $apcAction = new ComplaintAction();
                            $apcAction->complaint_id = $complainId;
                            $apcAction->forward_by_ps = $userId;
                            $apcAction->assigned_date = $request->assigned_date;
                            $apcAction->target_date = $request->target_date;
                           
                            if($request->sent_through_rk == 1){
                                $apcAction->sent_through_rk = 1;
                            }

                         
                        
                            if($roleFwd === "lok-ayukt" || $roleFwd === "up-lok-ayukt"){
                                    if($roleFwd === "lok-ayukt"){
                                    $apcAction->forward_to_lokayukt = $request->forward_to;
                                    $cmp->approved_rejected_by_lokayukt = 0;
                                    $cmp->save();
                                }elseif($roleFwd === "up-lok-ayukt"){
                                    $apcAction->forward_to_uplokayukt = $request->forward_to;
                                }
                            }elseif($roleFwd === "supervisor"){
                                if($subroleFwd !=null){
                                     if($subroleFwd === "ds"){
                                    $apcAction->forward_to_ds = $request->forward_to;
                                
                                    }elseif($subroleFwd ==="js"){
                                            $apcAction->forward_to_js = $request->forward_to;
                            
                                    }elseif($subroleFwd ==="us"){
                                            $apcAction->forward_to_us = $request->forward_to;
                            
                                    }elseif($subroleFwd ==="sec"){
                                            $apcAction->forward_to_sec = $request->forward_to;
                            
                                    }elseif($subroleFwd ==="cio-io"){

                                            $apcAction->forward_to_cio_io = $request->forward_to;
                                            $cmp->status = "Under investigation";
                                    }elseif($subroleFwd ==="io"){

                                            $apcAction->forward_to_io = $request->forward_to;
                                            $cmp->status = "Under investigation";
                                    }elseif($subroleFwd ==="so-us"){

                                            $apcAction->forward_to_so_us = $request->forward_to;
                                            
                                    }elseif($subroleFwd === "ro-aro"){

                                            $apcAction->forward_to_ro_aro = $request->forward_to;
                                            if($cmp->approved_rejected_by_ro_aro == 1){
                                                $cmp->approved_rejected_by_ro_aro = 0;
                                                $cmp->save();
                                            }
                                    }elseif($subroleFwd === "ro"){

                                            $apcAction->forward_to_ro = $request->forward_to;
                                            if($cmp->approved_rejected_by_ro == 1){
                                                $cmp->approved_rejected_by_ro = 0;
                                                $cmp->save();
                                            }
                                    }
                                }
                                   
                            }
                          
  
                        // $apcAction->forward_to_uplokayukt = $request->forward_to;
                    
                        $apcAction->status = 'Forwarded';
                        $apcAction->type = '1';
                        $apcAction->remarks = $request->remark;
                        $apcAction->save();
                        $cmp->save();

                    }
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

    
    //  public function forwardComplaintbylokayukt(Request $request,$complainId){
    //     //    dd($request->all());
    //     $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
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

    //         if($cmp){
    //             $cmp->approved_rejected_by_ = 1;
    //             // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //             // $remark ='Remark By Deputy Secretary / Joint Secretary';
    //             // $remark.='\n';
    //             // $remark.= $request->remarks;
    //             // $remark.='\n';
    //             // $cmp->remark = $remark;
                
    //                 if($cmp->save()){
    //                     // $apcAction = new ComplaintAction();
    //                     // $apcAction->complaint_id = $complainId;
    //                     // $apcAction->forward_by_lokayukt = $userId;

    //                     $apcAction = new ComplaintAction();
    //                         $apcAction->complaint_id = $complainId;
    //                         $apcAction->forward_by_lokayukt = $userId;

    //                         if($subroleFwd === "ds-js"){
    //                                 $apcAction->forward_to_ds_js = $request->forward_to;
                                
    //                         }elseif($subroleFwd ==="sec"){
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
    //         return response()->json([
    //                 'status' => true,
    //                 'message' => 'Forwarded Successfully',
    //                 'data' => $cmp
    //             ], 200);
    //     }else{
            
    //         return response()->json([
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

    //                                                        = $request->forward_to;
                       
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
       $userId = Auth::user()->id; 
       $parentId = null;
        $parentId = Auth::user()->parent_user_id;
        // dd($parentId);
        $userParentData = User::with('role')->where('id',$parentId)->get();
        $roleParent = $userParentData[0]->role->name;
         $userParentSubrole = Auth::user()->userParentRole ?? '';  
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                 ->leftJoin('complainants as cmlan', function ($join) {
                    $join->on('cm.id', '=', 'cmlan.complaint_id')
                        ->where('cmlan.is_main', 1);
                })
                    ->leftJoin('respondents as resp', function ($join) {
                    $join->on('cm.id', '=', 'resp.complaint_id')
                        ->where('resp.is_main', 1);
                })
                ->leftJoin('district_master as dd1', 'cmlan.permanent_district', '=', 'dd1.district_code')
                ->join('complaint_actions as rep', function ($join) use ($parentId, $roleParent,$userId,$userParentSubrole) {
        $join->on('cm.id', '=', 'rep.complaint_id')
             ->where(function ($q) use ($parentId, $roleParent,$userId,$userParentSubrole) {

                 if ($roleParent === 'lok-ayukt') {
                    $q->where('cm.approved_rejected_by_ps','1')
                      ->where('rep.forward_by_ps', $userId);
                    //  $q->where('rep.forward_to_lokayukt', $parentId);      
                 } elseif ($roleParent === 'up-lok-ayukt') {
                    //  $q->where('rep.forward_to_uplokayukt', $parentId);
                     $q->where('rep.forward_by_ps', $userId);
                 } elseif ($roleParent === 'supervisor' && $userParentSubrole->sub_role_id == 14) {
                     $q->where('rep.status', 'Forwarded')
                        ->where('cm.approved_rejected_by_sec','1')
                        ->whereNotNull('rep.forward_to_sec')
                        ->where('rep.forward_to_sec', $parentId);
                    //  $q->where('rep.forward_to_sec', $parentId);
                 } else {
                     // 🔥 fallback (safe)
                     $q->where('rep.forward_to_lokayukt', $parentId)
                       ->orWhere('rep.forward_to_uplokayukt', $parentId);
                 }

             });
    })
                // ->join('complaint_actions as rep', 'rep.complaint_id', '=', 'cm.id')
                // ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
                // ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
                // ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
                // ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                     'dd.district_name as district_name',
                       'dd1.district_name as dist_new',
                         'cmlan.complainant_name as complainantName',
                      'resp.respondent_name as respondentName',
                    // 'dp.name as department_name',
                    // 'ds.name as designation_name',
                    // 'ct.name as complaintype_name',
                    // 'sub.name as subject_name'
                );

                
     $complainDetails->where('form_status', 1);
     if($roleParent === 'lok-ayukt'){
           $complainDetails->where('approved_rejected_by_lokayukt', 0);
     }else{
            $complainDetails->where('approved_rejected_by_lokayukt', 1);
     }
            // ->where('approved_rejected_by_ro', 1)
            //             ->where('approved_rejected_by_d_a',1)
                        // ->where('approved_rejected_by_lokayukt', 1);
            //              ->where(function($q){
            //                 $q->where('approved_rejected_by_so_us',1)
            //                 ->Orwhere('approved_rejected_by_ds_js', 1);               
                        //  });
    $complainDetails = $complainDetails
                      
                        // ->toSql();
                        // ->where('approved_rejected_by_ps', 1 )
                        ->distinct('cm.id')
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


    //  public function allComplainsapproved(){
    //     $user = Auth::user()->id;
    // //    $userSubrole = Auth::user()->subrole->name; 
    //    $parentId = null;
    //     $parentId = Auth::user()->parent_user_id;
    //     // dd($parentId);
    //     $userParentData = User::with('role')->where('id',$parentId)->get();
    //     $roleParent = $userParentData[0]->role->name;
    //        $complainDetails = DB::table('complaints as cm')
    //             ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
    // //             ->join('complaint_actions as rep', function ($join) use ($parentId, $roleParent) {
    // //     $join->on('cm.id', '=', 'rep.complaint_id')
    // //          ->where(function ($q) use ($parentId, $roleParent) {

    // //              if ($roleParent === 'lok-ayukt') {
    // //                 //  $q->where('rep.forward_to_lokayukt', $parentId);      
    // //              } elseif ($roleParent === 'up-lok-ayukt') {
    // //                  $q->where('rep.forward_to_uplokayukt', $parentId);
    // //              } else {
    // //                  // 🔥 fallback (safe)
    // //                  $q->where('rep.forward_to_lokayukt', $parentId)
    // //                    ->orWhere('rep.forward_to_uplokayukt', $parentId);
    // //              }

    // //          });
    // // })
    //             ->join('complaint_actions as rep', 'rep.complaint_id', '=', 'cm.id')
    //             // ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
    //             // ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
    //             // ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
    //             // ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
    //             ->select(
    //                 'cm.*',
    //                 'dd.district_name',
    //                  'dd.district_name as district_name',
    //                 // 'dp.name as department_name',
    //                 // 'ds.name as designation_name',
    //                 // 'ct.name as complaintype_name',
    //                 // 'sub.name as subject_name'
    //             );

                
    //  $complainDetails
    //         // ->where('form_status', 1)
    //         ->where('approved_rejected_by_rk', 1)
    //         ->where('cm.approved_rejected_by_lokayukt', 1)
    //         ->where('rep.forward_by_ps', $user);
    //         //             ->where('approved_rejected_by_d_a',1)
    //                     // ->where('approved_rejected_by_lokayukt', 1);
    //         //              ->where(function($q){
    //         //                 $q->where('approved_rejected_by_so_us',1)
    //         //                 ->Orwhere('approved_rejected_by_ds_js', 1);               
    //                     //  });
    // $complainDetails = $complainDetails
                      
    //                     // ->toSql();
    //                     ->where('approved_rejected_by_ps', 1 )
    //                     ->distinct('cm.id')
    //                   ->get();

    //             // ->where('form_status',1)
    //             // ->where('approved_rejected_by_ro',1)
    //             // ->where('approved_rejected_by_so_us',1)
    //             // ->get();
    //     // dd($deadpersondetails);

    //       return response()->json([
    //            'status' => true,
    //            'message' => 'Records Fetch successfully',
    //            'data' => $complainDetails,
    //        ]);
    // }

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
            // $Notes = ComplaintNotes::where('complaint_id',$id)
            // ->get();

            $Notes = ComplaintNotes::where('complaint_id', $id)
            ->leftJoin('users', 'complaints_notes.forward_by', '=', 'users.id') // Left Join with users table
            ->select('complaints_notes.*', 'users.name as forwarded_by_name', 'users.email as forwarded_by_email') // You can select any fields you want
            ->orderBy('id','desc')
            ->get();

   
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
            // 'd_id' => 'required',
            // 'forward_by' => 'required',
            // 'forward_to' => 'required',
            // 'range_from' => 'required',
            // 'range_two' => 'required',
            
        ], [
            'complaint_id.required' => 'Complaint Id is required.',
            // 'type.required' => 'Complaint description is required.',
            // 'title.required' => 'Letter Subject is Required',
            'description.required' => 'Description is Required',
            // 'd_id.required' => 'Document is Required',
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

    public function returnComplainByPs(Request $request,$complainId){
        //    dd($request->all(),$complainId);
        $user = Auth::user()->id;
        // dd($usersubrole);
   

        $validation = Validator::make($request->all(), [
            // 'forward_by_so_us' => 'required|exists:users,id',
            // 'forward_to_d_a' => 'required|exists:users,id',
            'remark' => 'required',
         
          
        ], [
            // 'forward_by_so_us.required' => 'Forward by Supervisor is required.',
            // 'forward_by_so_us.exists' => 'Forward by user does not exist.',
            // 'forward_to_d_a.required' => 'Forward to user is required.',
            // 'forward_to_d_a.exists' => 'Forward to user does not exist.',
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
            //  dd($cmp);
            if($cmp){
                $cmp->approved_rejected_by_rk = 0;
                $cmp->status = 'Return';
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
                     $apcAction->forward_by_lokayukt = $user;
                    $apcAction->status = 'Return';
                    $apcAction->remarks = $request->remark;
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

    public function pullBackByPs(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
       
        if(isset($complainId) && $request->isMethod('post')){

             $cmp =  Complaint::findOrFail($complainId);
             
            if($cmp){
                $cmp->approved_rejected_by_rk = 0;
                $cmp->status = 'Pull Back';
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
    public function assignToPs(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        $userName = Auth::user()->name;
       
        if(isset($complainId) && $request->isMethod('post')){

             $cmp =  Complaint::findOrFail($complainId);
             
            if($cmp){
                $cmp->assign_to_ps = $user;
                $cmp->save(); 
            }
          
             return response()->json([
                    'status' => true,
                    'message' => "Assign.' '$userName' '.successfully",
                    'data' => $cmp
                ], 200);
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

      public function approvedFeeByPS(Request $request, $complaint_id){
        $parent_user_id = Auth::user()->parent_user_id;
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
            $cmp->remark  = $request->remarks;
            $cmp->save();
            // if($cmp->save()){
            
                    
            //     $apcAction = new ComplaintAction();
            //                     $apcAction->complaint_id = $complaint_id;
            //                     $apcAction->status = 'Fees Approved';
            //                     $apcAction->remarks = $request->remarks;
            //                     $apcAction->save();
            // }
            return response()->json([
                    'status' => true,
                    'message' => 'Fee Added successfully.'
                ], 201);

        }
   
    
    }

          public function approvedByupLokayukt(Request $request,$id){
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

     public function rejectComplaintByPs(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
       
        if(isset($complainId) && $request->isMethod('post')){

             $cmp =  Complaint::findOrFail($complainId);
             
            if($cmp){
                $cmp->status = 'Rejected';
                $cmp->save(); 
            }
          
             return response()->json([
                    'status' => true,
                    'message' => 'Reject Complaint Successfully',
                    'data' => $cmp
                ], 200);
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }
}
