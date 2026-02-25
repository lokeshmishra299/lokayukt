<?php

namespace App\Http\Controllers\api\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ComplaintAction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SupervisorReportController extends Controller
{
      public function complainReports()
    {

        $user_id = Auth::user()->id;
        // if (empty($user_id)) {
        //    return response()->json([
        //         'status' => false,
        //         'errors' => 'User id not found'
        //     ], 422);
        // }

      
        $role_id = 'all';
        // $districtId = $district_id = auth()->user()->district_id ? auth()->user()->district_id : '';
        //dd($roleid);
        $districtId = request()->query('district') ?? null;
        $search = request()->query('search') ?? null;
        // $complaintype = request()->query('complaintype') ?? null;
        // $department = request()->query('department') ?? null;
        // $subject = request()->query('subject') ?? null;
        // $designation = request()->query('designation') ?? null;
        $roleid = request()->query('des') ?? 'all';
        $status = request()->query('status') ?? '';
       
        $districtData = DB::table('district_master_new')->orderBy('district_name')->get();
                   $userSubrole = Auth::user()->subrole->name; 
         if($userSubrole){
            //             $records = DB::table('complaints')
            //     ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
            //     ->leftJoin('district_master_new as dd', 'complaints.district_id', '=', 'dd.district_code')
            //     ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
            //     ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
            //     ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
            //     ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
            //    ->leftJoin('complaint_actions as ca', 'complaints.id', '=', 'ca.complaint_id')
            //     ->select(
            //         'complaints.id',
            //         'complaints.complain_no',
            //         'complaints.name',
            //         // 'complaints.status',
            //         'complaints.created_at',
            //         'dd.district_name as district_name',
            //         'dd.district_code as district_id',
            //         'ds.name as designation_name',
            //         'ca.target_date as target_date',
            //         'ca.status',
            //         // 'ca.forward_by_ds_js as forward_by_ds_js',
            //         'ca.forward_by_sec as forward_by_sec',
            //         // 'ca.forward_by_cio_io as forward_by_cio_io',

            //         // Concatenate multiple related fields
            //         DB::raw("GROUP_CONCAT(DISTINCT dp.name SEPARATOR ', ') as department_name"),
            //         DB::raw("GROUP_CONCAT(DISTINCT ds.name SEPARATOR ', ') as designation_name"),
            //         DB::raw("GROUP_CONCAT(DISTINCT ct.name SEPARATOR ', ') as complaintype_name"),
            //         DB::raw("GROUP_CONCAT(DISTINCT sub.name SEPARATOR ', ') as subject_name")
            //     );

    //         $subQuery = '
    //             SELECT MAX(ca2.id)
    //             FROM complaint_actions AS ca2
    //             WHERE ca2.complaint_id = ca1.complaint_id
    //         ';


    // if ($userSubrole == 'sec') {
    //     $subQuery .= " AND ca2.forward_to_sec = :user_id";
    // } elseif ($userSubrole == 'cio_io') {
    //     $subQuery .= " AND ca2.forward_to_cio_io = :user_id";
    // }
    //         $latestActionSubquery = DB::table('complaint_actions as ca1')
    // ->select('ca1.*')
    // // ->select('ca1.complaint_id', 'ca1.status', 'ca1.target_date', 'ca1.forward_by_sec','ca1.forward_by_ds_js','ca1.forward_by_cio_io','ca1.type')
    // ->whereRaw( $subQuery);
            $latestActionSubquery = DB::table('complaint_actions as ca1')
    ->select('ca1.*')
    // ->select('ca1.complaint_id', 'ca1.status', 'ca1.target_date', 'ca1.forward_by_sec','ca1.forward_by_ds_js','ca1.forward_by_cio_io','ca1.type')
    ->whereRaw('ca1.id = (
        SELECT MAX(ca2.id)
        FROM complaint_actions as ca2
        WHERE ca2.complaint_id = ca1.complaint_id
    )');

    // dd($latestActionSubquery);

$records = DB::table('complaints')
    ->leftJoinSub($latestActionSubquery, 'ca', function($join) {
        $join->on('complaints.id', '=', 'ca.complaint_id');
    })
    ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
    ->leftJoin('district_master_new as dd', 'complaints.district_id', '=', 'dd.district_code')
    ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
    ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
    ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
    ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
    ->select(
        'complaints.id',
        'complaints.complain_no',
        'complaints.name',
        'complaints.status',
        'complaints.created_at',
        'dd.district_name as district_name',
        'dd.district_code as district_id',
        DB::raw("GROUP_CONCAT(DISTINCT dp.name SEPARATOR ', ') as department_name"),
        DB::raw("GROUP_CONCAT(DISTINCT ds.name SEPARATOR ', ') as designation_name"),
        DB::raw("GROUP_CONCAT(DISTINCT ct.name SEPARATOR ', ') as complaintype_name"),
        DB::raw("GROUP_CONCAT(DISTINCT sub.name SEPARATOR ', ') as subject_name"),

        // Latest complaint action fields
        'ca.status as ca_status',
        'ca.target_date',
        'ca.forward_by_ds_js',
        'ca.forward_by_sec',
        'ca.forward_to_sec',
        'ca.forward_by_cio_io',
        'ca.forward_to_cio_io',
     );


                    if (!empty($districtId)) {
                        $records->where('complaints.district_id', $districtId);
                    }

            
                    if (!empty($status)) {
                
                        $records->where('complaints.status', $status);
                    }
                    
                    if (!empty($search)) {
                        $records->where(function ($q) use ($search) {
                            $q->where('complaints.application_no', 'like', "%{$search}%")
                            ->orWhere('complaints.name', 'like', "%{$search}%")
                            ->orWhere('complaints.mobile', 'like', "%{$search}%");
                        });
                    }
                      switch ($userSubrole) {
                        case "so-us":
                              $records->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_ds_js', 0);
                    //         $records->where('form_status', 1)
                    // ->where('approved_rejected_by_ro', 1)
                    // ->where('approved_rejected_by_so_us', 0);
                    // ->whereNot('approved_rejected_by_ds_js', 1);
                                // ->where('approved_rejected_by_ro', 1);
                                //   ->where('approved_by_ro', 1);
                            // $records->where('complaints.added_by', $user);
                            break;

                        case "ds-js":
                        $records
                        // ->where('form_status', 1)
                        //         ->where('approved_rejected_by_ro', 1)
                                ->where('ca.type', 2)
                                ->where('ca.status', ['Verified','Forwarded'])
                                ->where('ca.forward_to_ds_js',$user_id)
                                ->orWhere('ca.forward_by_ds_js',$user_id);
                                // ->whereOr('approved_rejected_by_so', 1);
                                //   ->where('forward_so', 1)
                                //   ->whereOr('forward_to_uplokayukt', 1);
                            break;

                        case "sec":
                        //   $records->where('ca.forward_by_sec',$user_id);
                        // $records->groupBy('target_date','forward_by_sec','ca.status');    
                        $records->where('ca.type', 2)
                                ->whereIn('ca.status', ['Verified','Forwarded'])
                                 ->where('ca.forward_to_sec',$user_id)
                                 ->orWhere('ca.forward_by_sec',$user_id);
                                // ->where('form_status', 1)
                                // // ->where('approved_rejected_by_ro', 1)
                                // ->where('forward_to_lokayukt', 1)
                                // ->whereOr('forward_to_uplokayukt', 1);
                            break;

                        case "cio-io":
                             $records->where('ca.type', 2)
                                ->where('ca.status', ['Investigation Report','Forwarded'])
                                 ->where('ca.forward_to_cio_io',$user_id)
                                 ->OrWhere('ca.forward_by_cio_io',$user_id);
                        // $records
                        // ->where('ca.type', 2)
                        //         ->where('ca.status', ['Verified','Forwarded'])
                        // ->where('ca.forward_to_cio_io',$user_id)
                        //          ->OrWhere('ca.forward_by_cio_io',$user_id);
                        // ->where('ca.type', 2)
                        //         ->where('ca.status', 'Report Requested')
                        //         ->whereNotNull('ca.forward_to_cio_io')
                        //          ->where('ca.forward_to_cio_io',$user_id);
                        // ->where('form_status', 1)
                        //         // ->where('approved_rejected_by_ro', 1)
                        //         ->where('forward_to_lokayukt', 1)
                        //         ->whereOr('forward_to_uplokayukt', 1);
                            break;

                        case "dea-assis":
                        $records->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                   ->where('approved_rejected_by_so_us', 1)
                    ->orWhere('approved_rejected_by_ds_js', 1)
                    ->whereNotNull('forward_to_d_a');
                            break;

                        default:
                            return response()->json([
                                'status' => false,
                                'message' => 'Invalid subrole',
                                'data' => [],
                            ], 400);
                    }

                    $records = $records
                    ->groupBy(
                    'complaints.id',
                    'complaints.name',
                    'dd.district_name',
                    'complaints.complain_no',
                    'complaints.created_at',
                    'complaints.status',
                    'dd.district_code',
                    'ds.name',
                    'forward_by_ds_js',
                    'forward_by_sec',
                    'forward_to_sec',
                    'forward_by_cio_io',
                    'forward_to_cio_io',
                )
                // ->toSql();
                ->get();
                // dd($records);
        //         select `complaints`.`id`, `complaints`.`complain_no`, `complaints`.`name`, `complaints`.`status`, `complaints`.`created_at`, `dd`.`district_name` as `district_name`, `dd`.`district_code` as `district_id`, GROUP_CONCAT(DISTINCT dp.name SEPARATOR ', ') as department_name, GROUP_CONCAT(DISTINCT ds.name SEPARATOR ', ') as designation_name, GROUP_CONCAT(DISTINCT ct.name SEPARATOR ', ') as complaintype_name, GROUP_CONCAT(DISTINCT sub.name SEPARATOR ', ') as subject_name, `ca`.`status` as `ca_status`, `ca`.`target_date`, `ca`.`forward_by_ds_js`, `ca`.`forward_by_sec`, `ca`.`forward_to_sec`, `ca`.`forward_by_cio_io`, `ca`.`forward_to_cio_io` from `complaints` left join (select `ca1`.* from `complaint_actions` as `ca1` where ca1.id = (
    //     SELECT MAX(ca2.id)
    //     FROM complaint_actions as ca2
    //     WHERE ca2.complaint_id = ca1.complaint_id
    // )) as `ca` on `complaints`.`id` = `ca`.`complaint_id` left join `complaints_details` as `cd` on `complaints`.`id` = `cd`.`complain_id` left join `district_master_new` as `dd` on `complaints`.`district_id` = `dd`.`district_code` left join `departments` as `dp` on `cd`.`department_id` = `dp`.`id` left join `designations` as `ds` on `cd`.`designation_id` = `ds`.`id` left join `complaintype` as `ct` on `cd`.`complaintype_id` = `ct`.`id` left join `subjects` as `sub` on `cd`.`subject_id` = `sub`.`id` where `ca`.`type` = 2 and `ca`.`status` IN ('Investigation Report','Forwarded') and `ca`.`forward_to_cio_io` = 228 or `ca`.`forward_by_cio_io` = 228 group by `complaints`.`id`, `complaints`.`name`, `dd`.`district_name`, `complaints`.`complain_no`, `complaints`.`created_at`, `complaints`.`status`, `dd`.`district_code`, `ds`.`name`, `forward_by_ds_js`, `forward_by_sec`, `forward_to_sec`, `forward_by_cio_io`, `forward_to_cio_io`;
        if(!$records->isEmpty()){
            
            return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $records,
               'user' => $user_id
           ]);
        }else{
            return response()->json([
               'status' => false,
               'message' => 'No Records Found',
           ]);
        }
    }
      
    }

        public function viewComplaint($id)
  {
    //    $complainDetails = DB::table('complaints as cm')
    //    ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
    // ->leftJoin('district_master_new as dd', 'cm.district_id', '=', 'dd.district_code')
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
    ->leftJoin('district_master_new as dd', 'cm.district_id', '=', 'dd.district_code')
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
    
    public function progress_report(){
        
//         $user_id  = Auth::user()->id;
//          $userSubrole = Auth::user()->subrole->name; 
//   if($userSubrole){


//       $records = DB::table('complaints')
//             ->join('complaint_actions as ca', DB::raw("complaints.id"), '=', DB::raw("ca.complaint_id"))
            
//             ->select(
//                 // 'complaints.*',
//                 'ca.*',
//                 'complaints.complain_no',
//                 'complaints.name',
//                 'complaints.approved_rejected_by_ro',
//                 'complaints.approved_rejected_by_so_us',
//                 'complaints.approved_rejected_by_ds_js',
//                 'complaints.approved_rejected_by_d_a',
//                 'complaints.approved_rejected_by_lokayukt',
   
//             )->where('in_draft','0')
//                 ->where('ca.status','<>', "Report Requested");
           
          
//           $ca = DB::table('complaint_actions')
//                                 ->where('forward_to_sec', $user_id)
//                                 ->OrderBy('id','desc')
//                                 ->first();
           

//                 switch ($userSubrole) {
//                         case "so-us":
                             
//                             break;

//                         case "ds-js":
                     
                      
//                             break;

//                         case "sec":
                             
//                                   $records->where('ca.complaint_id',$ca->complaint_id);
//                             break;

//                         case "cio-io":
                            
//                              break;

//                         case "dea-assis":
                      
//                             break;

//                         default:
//                             return response()->json([
//                                 'status' => false,
//                                 'message' => 'Invalid subrole',
//                                 'data' => [],
//                             ], 400);
//                     }

//           $records->orderBy('complaints.id','desc')
//                 ->get();

$user_id  = Auth::user()->id;
$userSubrole = Auth::user()->subrole->name;

if ($userSubrole) {

    $records = DB::table('complaints')
        ->join('complaint_actions as ca', 'complaints.id', '=', 'ca.complaint_id')
        ->select(
            'ca.*',
            'complaints.complain_no',
            'complaints.name',
            'complaints.approved_rejected_by_ro',
            'complaints.approved_rejected_by_so_us',
            'complaints.approved_rejected_by_ds_js',
            'complaints.approved_rejected_by_d_a',
            'complaints.approved_rejected_by_lokayukt'
        )
        ->where('in_draft', '0')
        ->where('ca.status', '<>', 'Report Requested');

    // Get latest complaint action assigned to this user
    $cadsjs = DB::table('complaint_actions')
        ->where('forward_to_ds_js', $user_id)
        ->orderBy('id', 'desc')
       ->pluck('complaint_id')->toArray();
    $ca = DB::table('complaint_actions')
        ->where('forward_to_sec', $user_id)
        ->orderBy('id', 'desc')
        ->pluck('complaint_id')->toArray();
        // dd($ca );
    $cacio = DB::table('complaint_actions')
        ->where('forward_to_cio_io', $user_id)
        ->orderBy('id', 'desc')
       ->pluck('complaint_id')->toArray();

    switch ($userSubrole) {
        case "so-us":
            // Add condition(s) for so-us here if needed
            break;

        case "ds-js":
            // Add condition(s) for ds-js here if needed
              if ($cadsjs) { // check to prevent null error
                $records->whereIn('ca.complaint_id', $cadsjs);
            }
            break;

        case "sec":
            if ($ca) { // check to prevent null error
                $records->whereIn('ca.complaint_id', $ca);
            }
            break;

        case "cio-io":
               if ($cacio) { // check to prevent null error
                $records->whereIn('ca.complaint_id', $cacio);
            }
            // Add condition(s) for cio-io here if needed
            break;

        case "dea-assis":
            // Add condition(s) for dea-assis here if needed
            break;

        default:
            return response()->json([
                'status' => false,
                'message' => 'Invalid subrole',
                'data' => [],
            ], 400);
    }

    // Execute and return data
    $records = $records->orderBy('complaints.id', 'desc')->get();

    return response()->json([
        'status' => true,
        'message' => 'Records fetched successfully',
        'data' => $records,
    ]);



  }
     
    
             
            //   return response()->json([
            //     'status' => true,
            //     'message' => 'Records Fetch successfully',
            //     'data' => $records,
            //     // 'subrole' => $userSubroleRole
            // ]);
            // dd($records);
    }
    
     public function current_report(){
       $userSubrole = Auth::user()->subrole->name;

       if($userSubrole){
//            $latestActions = DB::table('complaint_actions as ca1')
//                 ->select('ca1.*')
//                 //  ->where('ca1.type', 1)
//                 ->join(DB::raw("(SELECT complaint_id, MAX(id) AS max_id
//                         FROM complaint_actions
//                         GROUP BY complaint_id
//                     ) as ca2"),
//                     function ($join) {
//                         $join->on('ca1.id', '=', 'ca2.max_id');
//                     }
//                 );
//                 // ->toSql();
//                 // dd($latestActions);

//  $records = DB::table('complaints')
//     ->joinSub($latestActions, 'ca', function ($join) {
//         $join->on('complaints.id', '=', 'ca.complaint_id');
//     })
//     ->leftJoin('users as u', 'ca.forward_by_ro', '=', 'u.id')
//     ->leftJoin('users as so_us', 'ca.forward_by_so_us', '=', 'so_us.id')
//     ->leftJoin('users as ds_js', 'ca.forward_by_ds_js', '=', 'ds_js.id')
//     ->leftJoin('users as sec', 'ca.forward_by_sec', '=', 'sec.id')
//     ->leftJoin('users as secto', 'ca.forward_to_sec', '=', 'secto.id')
//     ->leftJoin('users as cio', 'ca.forward_by_cio_io', '=', 'cio.id')
//     ->leftJoin('users as cioto', 'ca.forward_to_cio_io', '=', 'cioto.id')
//     ->leftJoin('users as d_a', 'ca.forward_by_d_a', '=', 'd_a.id')
//     ->leftJoin('sub_roles as srole', 'u.sub_role_id', '=', 'srole.id')
//     ->select(
//         'complaints.*',
//         'complaints.name',
//         'complaints.complain_no',
//         'complaints.status as current_status',
//         'ca.*',
//         'u.name as ro_name',
//         'so_us.name as so_name',
//         'ds_js.name as ds_name',
//         'sec.name as sec_name',
//         'secto.name as sec_to_name',
//         'cio.name as cio_name',
//         'cioto.name as cio_to_name',
//         'd_a.name as da_name',
//         'srole.name as subrole_name',
//         DB::raw('DATEDIFF(NOW(), complaints.created_at) as days')
//     );
 

//          switch ($userSubrole) {
//             case "so-us":
//                 // Add condition(s) for so-us here if needed
//                 break;

//             case "ds-js":
//                 // Add condition(s) for ds-js here if needed
              
//                 break;

//             case "sec":
             
//                 break;

//             case "cio-io":
               
//                 // Add condition(s) for cio-io here if needed
//                 break;

//             case "dea-assis":
//                 // Add condition(s) for dea-assis here if needed
//                 break;

//             default:
//                 return response()->json([
//                     'status' => false,
//                     'message' => 'Invalid subrole',
//                     'data' => [],
//                 ], 400);
//         }

//            $records->where('in_draft', '0')
//             ->orderBy('complaints.id', 'desc')
//             // ->whereNotNull('target_date')
//             // ->toSql();
//             ->get();
//        }
     
//             //    dd($records);
//               return response()->json([
//                 'status' => true,
//                 'message' => 'Records Fetch successfully',
//                 'data' => $records,
//             ]);
        //  ------------------------------------------------------------
        $user_id = Auth::user()->id;
$userSubrole = Auth::user()->subrole->name;

if ($userSubrole) {

    // Step 1: Subquery to get the latest action per complaint
    $latestActions = DB::table('complaint_actions as ca1')
        ->select('ca1.*')
        ->join(
            DB::raw("(SELECT complaint_id, MAX(id) AS max_id
                      FROM complaint_actions
                      GROUP BY complaint_id) as ca2"),
            function ($join) {
                $join->on('ca1.id', '=', 'ca2.max_id');
            }
        );

    // Step 2: Main query with joins
    $records = DB::table('complaints')
        ->joinSub($latestActions, 'ca', function ($join) {
            $join->on('complaints.id', '=', 'ca.complaint_id');
        })
        ->leftJoin('users as u', 'ca.forward_by_ro', '=', 'u.id')
        ->leftJoin('users as so_us', 'ca.forward_by_so_us', '=', 'so_us.id')
        ->leftJoin('users as ds_js', 'ca.forward_by_ds_js', '=', 'ds_js.id')
        ->leftJoin('users as sec', 'ca.forward_by_sec', '=', 'sec.id')
        ->leftJoin('users as secto', 'ca.forward_to_sec', '=', 'secto.id')
        ->leftJoin('users as cio', 'ca.forward_by_cio_io', '=', 'cio.id')
        ->leftJoin('users as cioto', 'ca.forward_to_cio_io', '=', 'cioto.id')
        ->leftJoin('users as d_a', 'ca.forward_by_d_a', '=', 'd_a.id')
        ->leftJoin('sub_roles as srole', 'u.sub_role_id', '=', 'srole.id')
        ->select(
            'complaints.*',
            'complaints.name',
            'complaints.complain_no',
            'complaints.status as current_status',
            'ca.*',
            'u.name as ro_name',
            'so_us.name as so_name',
            'ds_js.name as ds_name',
            'sec.name as sec_name',
            'secto.name as sec_to_name',
            'cio.name as cio_name',
            'cioto.name as cio_to_name',
            'd_a.name as da_name',
            'srole.name as subrole_name',
            DB::raw('DATEDIFF(NOW(), complaints.created_at) as days')
        )
        ->where('complaints.in_draft', '=', '0');
        
     $cadsjs = DB::table('complaint_actions')
        ->where('forward_to_ds_js', $user_id)
        ->orderBy('id', 'desc')
        ->pluck('complaint_id')->toArray();
    $casec = DB::table('complaint_actions')
        ->where('forward_to_sec', $user_id)
        ->orderBy('id', 'desc')
        ->pluck('complaint_id')->toArray();
      
    $cacio = DB::table('complaint_actions')
        ->where('forward_to_cio_io', $user_id)
        ->orderBy('id', 'desc')
        ->pluck('complaint_id')->toArray();

    // Step 3: Subrole-specific conditions
    switch ($userSubrole) {
        case "so-us":
            // $records->where('ca.forward_to_so_us', $user_id);
            break;

        case "ds-js":
               if ($cadsjs) { // check to prevent null error
                $records->whereIn('ca.complaint_id', $cadsjs);
            }
            break;

        case "sec":
            if ($casec) { // check to prevent null error
                $records->whereIn('ca.complaint_id', $casec);
            }
            // $records->where('ca.forward_to_sec', $user_id);
            break;

        case "cio-io":
             if ($cacio) { // check to prevent null error
                $records->whereIn('ca.complaint_id', $cacio);
            }
            break;

        case "dea-assis":
            // $records->where('ca.forward_to_d_a', $user_id);
            break;

        default:
            return response()->json([
                'status' => false,
                'message' => 'Invalid subrole',
                'data' => [],
            ], 400);
    }

    // Step 4: Final ordering + execution
    $records = $records
        ->orderBy('complaints.id', 'desc')
        ->get();

    // Step 5: Return response
    return response()->json([
        'status' => true,
        'message' => 'Records fetched successfully',
        'data' => $records,
    ]);
}

    }
}

    //  public function current_report(){
    //     // $userSubroleRole = Auth::user()->subrole->name;
        
    //      $records = DB::table('complaints')
    //         // ->leftJoin('district_master_new as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
    //         // ->leftJoin('departments as dp', DB::raw("complaints.department_id"), '=', DB::raw("dp.id"))
    //         // ->leftJoin('designations as ds', DB::raw("complaints.designation_id"), '=', DB::raw("ds.id"))
    //         // ->leftJoin('complaintype as ct', DB::raw("complaints.complaintype_id"), '=', DB::raw("ct.id"))
    //         // ->leftJoin('subjects as sub', DB::raw("complaints.department_id"), '=', DB::raw("sub.id"))
    //         ->leftJoin('users as u', DB::raw("complaints.added_by"), '=', DB::raw("u.id"))
    //         ->leftJoin('sub_roles as srole', DB::raw("u.sub_role_id"), '=', DB::raw("srole.id"))
    //         ->leftJoin('complaint_actions as ca', DB::raw("complaints.id"), '=', DB::raw("ca.complaint_id"))
            
    //         ->select(
    //             'complaints.*',
    //             'u.id as user_id',
    //             'srole.name as subrole_name',
    //             'ca.*',
    //             DB::raw('DATEDIFF(NOW(), ca.target_date) as days')
    //             // 'dd.district_name as district_name',
    //             // 'dp.name as department_name',
    //             // 'ds.name as designation_name',
    //             // 'ct.name as complaintype_name',
    //             // 'sub.name as subject_name',
    //         )
    //         // ->groupBy('complaints.id','u.id','srole.name')
    //         ->where('approved_rejected_by_ro', 1)
    //         ->get();
    //         //    dd($records);
    //           return response()->json([
    //             'status' => true,
    //             'message' => 'Records Fetch successfully',
    //             'data' => $records,
    //         ]);
         
    // }

    public function analytics(){
        $stats = DB::table('complaints')
    ->leftJoin('complaint_actions as ca', 'complaints.id', '=', 'ca.complaint_id')
    ->selectRaw('
        AVG(DATEDIFF(IFNULL(ca.created_at, NOW()), complaints.created_at)) as avg_processing_time,
        SUM(CASE WHEN complaints.form_status = "1" THEN 1 ELSE 0 END) as files_in_transit,
        SUM(CASE WHEN ca.target_date < NOW()  THEN 1 ELSE 0 END) as overdue_files
    ')
    ->where('approved_rejected_by_ro', 1)
    ->first();
              return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' =>  $stats,
            ]);
    }
    
    
    // public function forwardReporttbySo(Request $request,$complainId){
    //     //    dd(Auth::user()->getUserByRoles);
 
    //     $userId = Auth::user()->id;
    //     // $usersubrole = Auth::user()->subrole->name;
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
    //         $user = User::with('role')->where('id',$request->forward_to)->get();
    //         // dd($user[0]->role->name);
    //         $roleFwd = $user[0]->role->name;
    //         // dd($roleFwd);
    //          $cmp =  Complaint::findOrFail($complainId);
    //          $cmpAct =  ComplaintAction::where('complaint_id',$complainId)->first();
    
    //         if($cmp){
    //              $cmp->report_status = "Forwarded";
    //              $cmp->save();
    //             if($cmpAct){

    //             $cmpAct->complaint_id = $complainId;
    //             $cmpAct->forward_by_so_us = $userId;
    //             // $cmpAct->report_status = "Forwarded";
    //             if($roleFwd == "lok-ayukt"){
    //                 $cmpAct->forward_to_lokayukt = $request->forward_to;
    //                 $cmpAct->status_lokayukt = 1;
    //             }elseif($roleFwd =="up-lok-ayukt"){
    //                 $cmpAct->forward_to_uplokayukt = $request->forward_to;
    //                 $cmpAct->status_uplokayukt = 1;
    //             }
    //             // $cmpAct->forward_to = $request->forward_to; //add supervisor user_id 
                
    //             //
    //             $remark ='Remark By Section Officer / Under Secretary';
    //             $remark.='\n';
    //             $remark.= $request->remark;
    //             $remark.='\n';
    //             $cmpAct->remarks = $remark;
    //             $cmpAct->save();
    //               return response()->json([
    //                 'status' => true,
    //                 'message' => 'Forwarded Update Successfully',
    //                 'data' => $cmp
    //             ], 200);
    //             }
    //             $cmpAction =new ComplaintAction();
    //             $cmpAction->complaint_id = $complainId;
    //             $cmpAction->forward_by_so_us = $userId;
    //             if($roleFwd == "lok-ayukt"){
    //                 $cmpAction->forward_to_lokayukt = $request->forward_to;
    //                 $cmpAction->status_lokayukt = 1;
    //             }elseif($roleFwd =="up-lok-ayukt"){
    //                 $cmpAction->forward_to_uplokayukt = $request->forward_to;
    //                 $cmpAction->status_uplokayukt = 1;
    //             }
    //             // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
    //             // $cmpAction->action_type = "Forwarded";
    //             $remark ='Remark By Section Officer / Under Secretary';
    //             $remark.='\n';
    //             $remark.= $request->remark;
    //             $remark.='\n';
    //             $cmpAction->remarks = $remark;
    //             $cmpAction->save();
    //               return response()->json([
    //                 'status' => true,
    //                 'message' => 'Forwarded Successfully',
    //                 'data' => $cmp
    //             ], 200);
    //         }
    //         // $cmp->forward_by = $request->forward_by;
    //         // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //         // $cmp->sup_status = 1;
    //         // $cmp->save();
    
           
    //     }else{
            
    //          return response()->json([
    //                 'status' => false,
    //                 'message' => 'Please check Id'
    //             ], 401);
    //     }

    // }

    public function forwardReporttbyds(Request $request,$complainId){
        //    dd(Auth::user()->getUserByRoles);
 
        $userId = Auth::user()->id;
        // $usersubrole = Auth::user()->subrole->name;
        // dd($request->all());
        

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to' => 'required|exists:users,id',
            'target_date' => 'required|date',
            'remark' => 'required',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to.required' => 'Forward to user is required.',
            'forward_to.exists' => 'Forward to user does not exist.',
            // 'remark.required' => 'Remark is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post')){
            $user = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            $roleFwd = $user[0]->role->name;
            // dd($roleFwd);
             $cmp =  Complaint::findOrFail($complainId);
            //  $cmpAct =  ComplaintAction::where('complaint_id',$complainId)->first();
    
            if($cmp){
                  $cmp->report_status = "Forwarded";
                 $cmp->save();
                // if($cmpAct){

                // $cmpAct->complaint_id = $complainId;
                // $cmpAct->forward_by_ds_js = $userId;
                // if($roleFwd == "lok-ayukt"){
                //     $cmpAct->forward_to_lokayukt = $request->forward_to;
                //     $cmpAct->status_lokayukt = 1;
                // }elseif($roleFwd =="up-lok-ayukt"){
                //     $cmpAct->forward_to_uplokayukt = $request->forward_to;
                //     $cmpAct->status_uplokayukt = 1;
                // }
                // // $cmpAct->forward_to = $request->forward_to; //add supervisor user_id 
                
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remark;
                // $remark.='\n';
                // $cmpAct->remarks = $remark;
                // $cmpAct->save();
                //   return response()->json([
                //     'status' => true,
                //     'message' => 'Forwarded Update Successfully',
                //     'data' => $cmp
                // ], 200);
                // }

                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->forward_by_ds_js = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAction->forward_to_lokayukt = $request->forward_to;
                    $cmpAction->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAction->forward_to_uplokayukt = $request->forward_to;
                    $cmpAction->status_uplokayukt = 1;
                }
                // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
                
                $cmpAction->remarks = $request->remark;
                $cmpAction->target_date = $request->target_date;
                $cmpAction->type = "2";
                $cmpAction->status = "Forwarded";
                $cmpAction->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Successfully',
                    'data' => $cmp
                ], 200);
            }
            // $cmp->forward_by = $request->forward_by;
            // $cmp->forward_to_d_a = $request->forward_to_d_a;
            // $cmp->sup_status = 1;
            // $cmp->save();
    
           
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

     public function forwardReporttbysec(Request $request,$complainId){
        //    dd(Auth::user()->getUserByRoles);
 
        $userId = Auth::user()->id;
        // $usersubrole = Auth::user()->subrole->name;
        // dd($usersubrole);
        

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to' => 'required|exists:users,id',
            'target_date' => 'required|date',
            'remark' => 'required',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to.required' => 'Forward to user is required.',
            'forward_to.exists' => 'Forward to user does not exist.',
            // 'remark.required' => 'Remark is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post')){
            $user = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            $roleFwd = $user[0]->role->name;
            // dd($roleFwd);
             $cmp =  Complaint::findOrFail($complainId);
             $cmpAct =  ComplaintAction::where('complaint_id',$complainId)->first();
    
          if($cmp){
                  $cmp->report_status = "Forwarded";
                 $cmp->save();
                // if($cmpAct){

                // $cmpAct->complaint_id = $complainId;
                // $cmpAct->forward_by_ds_js = $userId;
                // if($roleFwd == "lok-ayukt"){
                //     $cmpAct->forward_to_lokayukt = $request->forward_to;
                //     $cmpAct->status_lokayukt = 1;
                // }elseif($roleFwd =="up-lok-ayukt"){
                //     $cmpAct->forward_to_uplokayukt = $request->forward_to;
                //     $cmpAct->status_uplokayukt = 1;
                // }
                // // $cmpAct->forward_to = $request->forward_to; //add supervisor user_id 
                
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remark;
                // $remark.='\n';
                // $cmpAct->remarks = $remark;
                // $cmpAct->save();
                //   return response()->json([
                //     'status' => true,
                //     'message' => 'Forwarded Update Successfully',
                //     'data' => $cmp
                // ], 200);
                // }

                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->forward_by_sec = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAction->forward_to_lokayukt = $request->forward_to;
                    $cmpAction->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAction->forward_to_uplokayukt = $request->forward_to;
                    $cmpAction->status_uplokayukt = 1;
                }
                // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
                
                $cmpAction->remarks = $request->remark;
                 $cmpAction->target_date = $request->target_date;
                $cmpAction->type = "2";
                $cmpAction->status = "Forwarded";
                $cmpAction->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Successfully',
                    'data' => $cmp
                ], 200);
            }  
           
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

    public function forwardReporttbycio(Request $request,$complainId){
        
        $userId = Auth::user()->id;
 

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to' => 'required|exists:users,id',
            'target_date' => 'required|date',
            // 'remark' => 'required',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to.required' => 'Forward to user is required.',
            'forward_to.exists' => 'Forward to user does not exist.',
            // 'remark.required' => 'Remark is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post')){
            $user = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            $roleFwd = $user[0]->role->name;
            // dd($roleFwd);
             $cmp =  Complaint::findOrFail($complainId);
             $cmpAct =  ComplaintAction::where('complaint_id',$complainId)->first();
    
          if($cmp){
                  $cmp->report_status = "Forwarded";
                 $cmp->save();
       
                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->forward_by_cio_io = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAction->forward_to_lokayukt = $request->forward_to;
                    $cmpAction->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAction->forward_to_uplokayukt = $request->forward_to;
                    $cmpAction->status_uplokayukt = 1;
                }
                // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
                
                $cmpAction->remarks = $request->remark;
                 $cmpAction->target_date = $request->target_date;
                $cmpAction->type = "2";
                $cmpAction->status = "Forwarded";
                $cmpAction->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Successfully',
                    'data' => $cmp
                ], 200);
            }
            // $cmp->forward_by = $request->forward_by;
            // $cmp->forward_to_d_a = $request->forward_to_d_a;
            // $cmp->sup_status = 1;
            // $cmp->save();
    
           
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

     public function forwardReporttbyda(Request $request,$complainId){
        //    dd(Auth::user()->getUserByRoles);
 
        $userId = Auth::user()->id;
        // $usersubrole = Auth::user()->subrole->name;
        // dd($usersubrole);
        

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to' => 'required|exists:users,id',
            // 'remark' => 'required',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to.required' => 'Forward to user is required.',
            'forward_to.exists' => 'Forward to user does not exist.',
            // 'remark.required' => 'Remark is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post')){
            $user = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            $roleFwd = $user[0]->role->name;
            // dd($roleFwd);
             $cmp =  Complaint::findOrFail($complainId);
             $cmpAct =  ComplaintAction::where('complaint_id',$complainId)->first();
    
            if($cmp){
                  $cmp->report_status = "Forwarded";
                 $cmp->save();
                if($cmpAct){

                $cmpAct->complaint_id = $complainId;
                $cmpAct->forward_by_d_a = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAct->forward_to_lokayukt = $request->forward_to;
                    $cmpAct->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAct->forward_to_uplokayukt = $request->forward_to;
                    $cmpAct->status_uplokayukt = 1;
                }
                // $cmpAct->forward_to = $request->forward_to; //add supervisor user_id 
                
               
                $remark ='Remark By Dealing Assistant';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAct->remarks = $remark;
                $cmpAct->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Update Successfully',
                    'data' => $cmp
                ], 200);
                }
                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->forward_by_d_a = $userId;   
                if($roleFwd == "lok-ayukt"){
                    $cmpAction->forward_to_lokayukt = $request->forward_to;
                    $cmpAction->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAction->forward_to_uplokayukt = $request->forward_to;
                    $cmpAction->status_uplokayukt = 1;
                }
                // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
       
                $remark ='Remark By Dealing Assistant';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAction->remarks = $remark;
                $cmpAction->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Successfully',
                    'data' => $cmp
                ], 200);
            }
            // $cmp->forward_by = $request->forward_by;
            // $cmp->forward_to_d_a = $request->forward_to_d_a;
            // $cmp->sup_status = 1;
            // $cmp->save();
    
           
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

        public function allComplains(){

        //    $query = DB::table('complaints');
        //   $complainDetails = $query->count();
        // dd($deadpersondetails);

       $complainDetails =  DB::table('complaints as cm')
                ->select(
                    DB::raw('COUNT(cm.id) as total_complaints'),
                    DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '1'  THEN 1 ELSE 0 END) as total_approved"),
                    DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '0' THEN 1 ELSE 0 END) as total_pending"),
                    DB::raw("SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) as total_rejected")
                )
                ->where('cm.approved_rejected_by_ro', '1')
                ->where('cm.approved_rejected_by_ds_js', '0')
                 ->where('in_draft','0')
                ->first();
            
           

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

        public function complainDistrictWise()
    {
       
        $complainCounts = Complaint::select('district_master_new.district_name', DB::raw('count(*) as complain_count'))
            ->join('district_master_new', 'complaints.district_id', '=', 'district_master_new.district_code')
            ->groupBy('district_master_new.district_code', 'district_master_new.district_name')
             ->where('approved_rejected_by_ro', '1')
                ->where('approved_rejected_by_ds_js', '0')
            // ->where('approved_rejected_by_ds_js', '0')
            // ->where('approved_rejected_by_d_a', '0')
            ->where('in_draft','0')
            ->limit(5)
            //  ->having('complain_count', '>', 0)
            ->pluck('complain_count', 'district_master_new.district_name');
       return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainCounts,
           ]);
    }

      public function complainDepartmentWise()
    {
       
        $complainCounts = Complaint::select('departments.name', DB::raw('count(*) as complain_count'))
        ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')    
        ->leftJoin('departments', 'cd.department_id', '=', 'departments.id')
            ->groupBy('departments.id', 'departments.name','department_id')
             ->where('approved_rejected_by_ro', '1')
                ->where('approved_rejected_by_ds_js', '0')
            ->where('in_draft','0')  
            ->pluck('complain_count', 'departments.name');
       return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainCounts,
           ]);
    }


        public function getMontlyTrends(){
        // $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // for ($j = 1; $j <= 12; $j++) {      
        // $months[] = date('M', mktime(0, 0, 0, $j, 10));
        // }
         $complaintData = DB::table('complaints as cm')
    ->select(
    
        DB::raw('MONTH(created_at) as month, COUNT(*) as count'),
        DB::raw('COUNT(cm.id) as total_complaints'),
        DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '1' THEN 1 ELSE 0 END) as total_approved"),
        DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '0' THEN 1 ELSE 0 END) as total_pending")
    )
  
    ->groupBy('month')
    // ->having('total_applications', '>', 0)
    ->orderBy('cm.name')
    ->limit(10)
     ->where('approved_rejected_by_ro', '1')
    ->where('approved_rejected_by_ds_js', '0')
     ->where('in_draft','0')
    ->get();
    $complaintData = $complaintData->map(function ($item) {
        if($item->total_complaints){
   return [
                'month' => date('F', mktime(0, 0, 0, $item->month, 10)),
                'year' => now()->year,
                // 'total_complaints' => $item->total_complaints,
                'approved' => $item->total_approved,
                'pending' => $item->total_pending,
            ];
        }
         
        })->toArray();

           return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' =>  $complaintData,
        ]);

    }

     public function complainComplaintypeWise()
    {
       
    //     $complainCounts = Complaint::select('complaintype.name', DB::raw('count(*) as complain_count'))
    //         ->join('complaintype', 'complaints.complaintype_id', '=', 'complaintype.id')
    //         ->groupBy('complaintype.id', 'complaintype.name')
             
    //         ->pluck('complain_count', 'complaintype.name');
    //    return response()->json([
    //            'status' => true,
    //            'message' => 'Records Fetch successfully',
    //            'data' => $complainCounts,
    //        ]);

        $complaintData = DB::table('complaints as cm')
        ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
         ->leftjoin('complaintype', 'cd.complaintype_id', '=', 'complaintype.id')
    ->select(
    
        'complaintype.name',
        //  DB::raw('count(*) as complain_count'),
        //  DB::raw('count(cm.id) as total_count'),
          DB::raw('ROUND(AVG(DATEDIFF(NOW(), cd.created_at)), 1) as avg_days')
         
        // DB::raw("SUM(CASE WHEN cm.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved"),
        // DB::raw("SUM(CASE WHEN cm.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending")
    )
  
    ->groupBy('complaintype.id', 'complaintype.name')
    // ->having('total_applications', '>', 0)
    // ->orderBy('cm.name')
     ->where('approved_rejected_by_ro', '1')
    ->where('approved_rejected_by_ds_js', '0')
     ->where('in_draft','0')
    ->limit(10)
    ->get();
//     $complaintData = $complaintData->map(function ($item) {
//         if($item->total_complaints){
//    return [
//                 'month' => date('F', mktime(0, 0, 0, $item->month, 10)),
//                 'year' => now()->year,
//                 // 'total_complaints' => $item->total_complaints,
//                 'approved' => $item->total_approved,
//                 'pending' => $item->total_pending,
//             ];
//         }
         
//         })->toArray();   

           return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' =>  $complaintData,
        ]);
    }

    public function complianceReport(){
         $complainDetails = DB::table('complaints as cm')
    ->select(
        DB::raw('COUNT(cm.id) as total_complaints'),

        // Counts
        // DB::raw("SUM(CASE WHEN cm.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved"),
        // DB::raw("SUM(CASE WHEN cm.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending"),
        // DB::raw("SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) as total_rejected"),

        // Percentages
        // DB::raw("ROUND(
        //     (SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '1' THEN 1 ELSE 0 END) / 
        //      COUNT(cm.id)) * 100, 2
        // ) as approved_percentage"),

        // DB::raw("ROUND(
        //     (SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '0' THEN 1 ELSE 0 END) / 
        //      COUNT(cm.id)) * 100, 2
        // ) as pending_percentage"),

        // DB::raw("ROUND(
        //     (SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) / 
        //      COUNT(cm.id)) * 100, 2
        // ) as rejected_percentage")
          DB::raw("
            ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) BETWEEN 1 AND 10 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as approved_percentage
        "),
           DB::raw("
            ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) BETWEEN 10 AND 20 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as pending_percentage
        "),
        DB::raw("
            ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) > 20 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as rejected_percentage
        ")
    )
     ->where('in_draft','0')
           ->where('approved_rejected_by_ro', '1')
    ->where('approved_rejected_by_ds_js', '0')
    ->first();
    return response()->json([
        'status' => true,
        'message' => 'Records Fetch successfully',
        'data' => $complainDetails,
    ]);

    }
}
