<?php

namespace App\Http\Controllers\api\Supervisor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class SupervisorDashboardController extends Controller
{
       public function index(Request $request, $d)
    {
        //  $user_district_code = Auth::user()->district_id ?? null;
        // $addedBy = Auth::user()->id ?? null;
         $userSubrole = Auth::user()->subrole->name; 


        $year = now()->year;
        $date = Carbon::parse($d);
        // dd($date);
        $query = DB::table('complaints as cmp');
            // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
            // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
            // ->where('cmp.approved_rejected_by_ro', 1)
            // ->whereIn('cmp.approved_rejected_by_naibtahsildar', [0, 1, 2])
            // ->where('cmp.form_status', 1)
            // ->where('cmp.district_id', $user_district_code)
           

         
        $queryDay = DB::table('complaints as cmp')
            // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
            // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
            ->select('cmp.*');
            // ->where('cmp.status', 'In Progress')
            
        

         $query1 = DB::table('complaints as cmp')
            // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
            ->select(DB::raw('COUNT(cmp.id) as total_complains'),DB::raw('AVG(DATEDIFF(now(), created_at)) as avg_days'));
            // ->where('cmp.approved_rejected_by_ri', 1)
            // ->whereIn('cmp.approved_rejected_by_naibtahsildar', [0, 1, 2])
            // ->where('cmp.status', 2)
            // ->where('cmp.district_id', $user_district_code)
          
        

           $query2 = DB::table('complaints as cmp');
        
           
       

        $query3 = DB::table('complaints as cmp')
                    ->where('cmp.status','Under Investigation')
                     ->where('cmp.form_status', 1)
                      ->where('cmp.approved_rejected_by_ro', 1)
                       ->whereYear('cmp.created_at', $date->year)
                     ->whereMonth('cmp.created_at', $date->month)
                    ->orderByDesc('cmp.id');
              

                    $query4 = DB::table('complaints as cmp');
                   
               

                $avgPendingDays = DB::table('complaints as cmp')
                    // ->where('cmp.status', 'In Progress')
                    ->whereYear('cmp.created_at', $date->year)
                    ->whereMonth('cmp.created_at', $date->month)
                    ->selectRaw('Round(AVG(DATEDIFF(NOW(), cmp.created_at)),1) as avg_days');          

    switch ($userSubrole) {
        case "so-us":
            $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_ds_js', 0);
            $query1->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_so_us', 0)
                  ->whereNot('approved_rejected_by_ds_js', 1);
             $query2->where('cmp.form_status', 1)
            ->where('cmp.approved_rejected_by_ro', 1)
            ->where('cmp.approved_rejected_by_so_us', 1);
            // ->where('cmp.approved_rejected_by_ds_js', 0)
            // ->where('cmp.approved_rejected_by_d_a', 0);
            // ->where('approved_rejected_by_ds_js', 0);
                        // ->where('approved_rejected_by_d_a',1)
                        //  ->where(function($q){
                        //     $q->where('cmp.approved_rejected_by_so_us',1)
                        //     ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                        //  });

            // $queryDay->where('');
            // $query3->where('');
            $query4 =  $query4->where('cmp.form_status', 1)
                     ->where('cmp.approved_rejected_by_ro', 1);
                        // ->where('approved_rejected_by_d_a',0)
                        //  ->where(function($q){
                        //     $q->where('cmp.approved_rejected_by_so_us',1)
                        //     ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                        //  });
            $avgPendingDays = $avgPendingDays->where('cmp.form_status', 1)
            ->where('cmp.approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_so_us',0);
                        //  ->where(function($q){
                        //     $q->where('cmp.approved_rejected_by_so_us',1)
                        //     ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                        //  });
            $queryDay = $queryDay->where('cmp.form_status', 1)
                     ->where('cmp.approved_rejected_by_ro', 1)
                     ->where('cmp.approved_rejected_by_so_us', 1);
                        // ->where('approved_rejected_by_d_a',0)
                        //  ->where(function($q){
                        //     $q->where('cmp.approved_rejected_by_so_us',1)
                        //     ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                        //  });
                //   ->where('approved_by_ro', 1);
            // $query->where('complaints.added_by', $user);
            // $queryDay->where('');
            // $query3->where('');
            // $query4->where('');
            // $avgPendingDays
            break;

        case "ds-js":
        //   $query->where('cmp.form_status', 1)
        //           ->where('cmp.approved_rejected_by_ro', 1)
        //           ->where('cmp.approved_rejected_by_ds_js', 0);

                   $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_ds_js', 0);
            $query1->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_ds_js', 0)
                  ->whereNot('approved_rejected_by_so_us', 1);
             $query2->where('cmp.form_status', 1)
            ->where('cmp.approved_rejected_by_ro', 1)
            ->where('cmp.approved_rejected_by_so_us', 0)
            ->where('cmp.approved_rejected_by_ds_js', 1)
            ->where('cmp.approved_rejected_by_d_a', 0);
            // ->where('approved_rejected_by_ds_js', 0);
                        // ->where('approved_rejected_by_d_a',1)
                        //  ->where(function($q){
                        //     $q->where('cmp.approved_rejected_by_so_us',1)
                        //     ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                        //  });

            // $queryDay->where('');
            // $query3->where('');
            $query4 =  $query4->where('cmp.form_status', 1)
                     ->where('cmp.approved_rejected_by_ro', 1);
                        // ->where('approved_rejected_by_d_a',0)
                        //  ->where(function($q){
                        //     $q->where('cmp.approved_rejected_by_so_us',1)
                        //     ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                        //  });
            $avgPendingDays = $avgPendingDays->where('cmp.form_status', 1)
            ->where('cmp.approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_so_us',0);
                        //  ->where(function($q){
                        //     $q->where('cmp.approved_rejected_by_so_us',1)
                        //     ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                        //  });
            $queryDay = $queryDay->where('cmp.form_status', 1)
                     ->where('cmp.approved_rejected_by_ro', 1)
                     ->where('cmp.approved_rejected_by_so_us', 1);
            // $query1->where('');
            // $query2->where('');
            // $queryDay->where('');
            // $query3->where('');
            // $query4->where('');
            // $avgPendingDays
                //   ->where('forward_so', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "sec":
           $query->where('cmp.form_status', 1)
                  ->where('cmp.approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
              // $query1->where('');
            // $query2->where('');
            // $queryDay->where('');
            // $query3->where('');
            // $query4->where('');
            // $avgPendingDays
            break;

        case "cio-io":
           $query->where('cmp.form_status', 1)
                  ->where('cmp.approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
           // $query1->where('');
            // $query2->where('');
            // $queryDay->where('');
            // $query3->where('');
            // $query4->where('');
            // $avgPendingDays
            break;

        case "dea-assis":
          $query->where('cmp.form_status', 1)
                  ->where('cmp.approved_rejected_by_ro', 1)
                    ->where(function($q){
                            $q->where('approved_rejected_by_so_us',1)
                            ->Orwhere('approved_rejected_by_ds_js', 1);               
                         });
                    // ->whereNotNull('cmp.forward_to_d_a');
            $query1->where('cmp.form_status', 1)
            ->where('cmp.approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_d_a',0)
                         ->where(function($q){
                            $q->where('cmp.approved_rejected_by_so_us',1)
                            ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                         });
            $query2->where('cmp.form_status', 1)
            ->where('cmp.approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_d_a',1)
                         ->where(function($q){
                            $q->where('cmp.approved_rejected_by_so_us',1)
                            ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                         });

            // $queryDay->where('');
            // $query3->where('');
            $query4 =  $query4->where('cmp.form_status', 1)
                     ->where('cmp.approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_d_a',0)
                         ->where(function($q){
                            $q->where('cmp.approved_rejected_by_so_us',1)
                            ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                         });
            $avgPendingDays = $avgPendingDays->where('cmp.form_status', 1)
            ->where('cmp.approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_d_a',0)
                         ->where(function($q){
                            $q->where('cmp.approved_rejected_by_so_us',1)
                            ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                         });
            $queryDay = $queryDay->where('cmp.form_status', 1)
                     ->where('cmp.approved_rejected_by_ro', 1)
                        ->where('approved_rejected_by_d_a',0)
                         ->where(function($q){
                            $q->where('cmp.approved_rejected_by_so_us',1)
                            ->Orwhere('cmp.approved_rejected_by_ds_js', 1);               
                         });
            break;

        default:
            return response()->json([
                'status' => false,
                'message' => 'Invalid subrole',
                'data' => [],
            ], 400);
    }
          $query=$query->whereYear('cmp.created_at', $date->year)
            ->whereMonth('cmp.created_at', $date->month)
            ->orderByDesc('cmp.id');
            $queryDay = $queryDay->where('cmp.form_status', 1)
              ->where('cmp.approved_rejected_by_ro', 1)
           ->whereDate('cmp.created_at', now()->toDateString()) // ✅ only today
            ->groupBy(DB::raw('DATE(cmp.created_at)'))
            // ->whereIn('cmp.approved_rejected_by_naibtahsildar', [0, 1, 2])
            // ->where('cmp.status', 2)
            // ->where('cmp.district_id', $user_district_code)
            ->orderByDesc('cmp.id');
            $query1 = $query1->where('cmp.form_status', 1)
              ->where('cmp.approved_rejected_by_ro', 1)
             ->whereYear('cmp.created_at', $date->year)
            ->whereMonth('cmp.created_at', $date->month)
            ->groupBy(groups: 'cmp.status')
            ->orderByDesc('cmp.id');
            $query2=$query2->whereYear('cmp.created_at', $date->year)
            ->whereMonth('cmp.created_at', $date->month)
            ->orderByDesc('cmp.id');
             $query4 = $query4->where('cmp.status','Rejected')
                     ->where('cmp.form_status', 1)
                      ->where('cmp.approved_rejected_by_ro', 1)
                       ->whereYear('cmp.created_at', $date->year)
                  ->whereMonth('cmp.created_at', $date->month)
                    ->orderByDesc('cmp.id');
    
         $totalcomplains = $query->count();
          $todaycomplains = $queryDay->count();
           $pendingcomplains = $query1->count();
           $approvedcomplains = $query2->count();
        //    $approvedcomplains = $query2->toSql();
           $underinvestigationcomplains = $query3->count();
            $rejectedcomplains = $query4->count();
            // $rejectedcomplains = $query4->toSql();
            $avgPendingDays = $avgPendingDays->value('avg_days');
     $dataDashboard = array(
           'totalcomplains'=> $totalcomplains,
           'pendingcomplains'=> $pendingcomplains,
          'approvedcomplains'=> $approvedcomplains,
           'rejectedcomplains'=> $rejectedcomplains,
           'todaycomplains'=> $todaycomplains,
           'underinvestigationcomplains'=> $underinvestigationcomplains,
          'avgPendingDays'=>  $avgPendingDays);

            return response()->json([
                'status' => true,
                'dataDashboard' => $dataDashboard,
            ]);
        
    } 

    public function getDepartmentwisData(){
            $departmentdata = DB::table('departments as dm')
    ->leftJoin('complaints as hd', 'hd.department_id', '=', 'dm.id')
    ->select(
        'dm.id as department_id',
        'dm.name as department_name',
        DB::raw('COUNT(hd.id) as total_complains'),
        DB::raw("SUM(CASE WHEN hd.status = 'approved' THEN 1 ELSE 0 END) as total_approved_complains")
    )
    ->groupBy('dm.id', 'dm.name')
    ->having('total_complains', '>', 0)
    ->orderBy('dm.name')
    // ->limit(10)
    ->get();
    $departmentdata = $departmentdata->map(function ($item) {
        if($item->total_complains){
   return [
                'department_id' => $item->department_id,
                'department_name' => $item->department_name,
                'total_complains' => $item->total_complains,
                // 'total_approved_complains' => $item->total_approved_complains,
            ];
        }
         
        })->toArray();
    }

     public function getRolewisData(){
       
        $departmentdata = DB::table('sub_roles as rl')
            ->leftJoin('users as u', 'u.sub_role_id', '=', 'rl.id')
            ->leftJoin('complaints as hd', 'hd.added_by', '=', 'u.id')
            // ->leftJoin('roles as r', 'r.id', '=', 'u.role_id')
            ->select(
                // 'u.name',
                // 'r.name',
                // 'sr.name',
                'rl.id as sub_role_id',
                'rl.name as sub_role_name',
                DB::raw('COUNT(hd.id) as total_complains'),
                DB::raw("SUM(CASE WHEN hd.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending_complains"),
                DB::raw("SUM(CASE WHEN hd.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved_complains"),
               
            )
            ->groupBy('rl.id', 'rl.name')
            ->having('total_complains', '>', 0)
            ->orderBy('rl.name')
            // ->limit(10)
            ->get();

         return response()->json([
             'data' => $departmentdata
               
         
        ]);
    }


      public function gestatusDistribution(){
            $departmentdata = DB::table('complaints as hd')
    // ->leftJoin('complaints as hd', 'hd.department_id', '=', 'dm.id')
    ->select(
        DB::raw('COUNT(hd.id) as total_complains'),
        DB::raw("SUM(CASE WHEN hd.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved_complains"),//for pending average
        DB::raw("SUM(CASE WHEN hd.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending_complains"),//for approved average
        DB::raw("SUM(CASE WHEN hd.status = 'Rejected' THEN 1 ELSE 0 END) as total_rejected_complains"),//for rejected average
        DB::raw("SUM(CASE WHEN hd.status = 'Under Investigation' THEN 1 ELSE 0 END) as total_investigation_complains"),//for rejected average
        DB::raw("ROUND(SUM(CASE WHEN hd.status = 'In Progress' THEN 1 ELSE 0 END) * 100.0 / COUNT(hd.id), 2) as pending_percentage"),
        DB::raw("ROUND(SUM(CASE WHEN hd.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) * 100.0 / COUNT(hd.id), 2) as approved_percentage"),
        DB::raw("ROUND(SUM(CASE WHEN hd.status = 'Rejected' THEN 1 ELSE 0 END) * 100.0 / COUNT(hd.id), 2) as rejected_percentage"),
        DB::raw("ROUND(SUM(CASE WHEN hd.status = 'Under Investigation' THEN 1 ELSE 0 END) * 100.0 / COUNT(hd.id), 2) as investigation_percentage")      
    )->first();
    // ->groupBy('hd.status')
    // ->having('total_complains', '>', 0)
    // ->orderBy('hd.id')
    // // ->limit(10)
    // ->get();
//     $departmentdata = $departmentdata->map(function ($item) {
//         if($item->total_complains){
//    return [
              
//                 'total_complains' => $item->total_complains,
//                 'total_approved_complains' => $item->total_approved_complains,
//                 'total_pending_complains' => $item->total_pending_complains,
//                 'total_rejected_complains' => $item->total_rejected_complains,
//                 'pending_percentage' => $item->pending_percentage,
//                 'approved_percentage' => $item->approved_percentage,
//                 'rejected_percentage' => $item->rejected_percentage,
//                 // 'avg_days_pending' => $item->avg_days_pending,
//             ];
//         }
         
//         })->toArray();

         return response()->json([
            'data' =>$departmentdata,
         
        ]);
    }
      public function getDistrictGraph(){
        //  $user_district_code = Auth::user()->district_id ?? null;
            $year = now()->year;
         $total = DB::table('complaints')
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', $year)
            // ->where('status', 2)
            // ->where('district_id', $user_district_code)
            // ->where('added_by', $addedBy)
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();

        $pending = DB::table('complaints')
            ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
            ->whereYear('updated_at', $year)
            // ->where('application_status', 'pending')
             ->where('status', 'In Progress')
            // ->where('district_id', $user_district_code)
            // ->where('added_by', $addedBy)
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();
        $approved = DB::table('complaints')
            ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
            ->whereYear('updated_at', $year)
            // ->where('application_status', 'approved')
             ->where('status', 'Disposed - Accepted')
            // ->where('district_id', $user_district_code)
            // ->where('added_by', $addedBy)
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();
        $rejected = DB::table('complaints')
            ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
            ->whereYear('updated_at', $year)
            // ->where('application_status', 'rejected')
             ->where('status', 'Rejected')
            // ->where('district_id', $user_district_code)
            // ->where('added_by', $addedBy)
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();

            // dd($approved);

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $pendingData = [];
        $approvedData = [];
        $rejecteddData = [];
        $totalData = [];

        for ($i = 1; $i <= 12; $i++) {
            $pendingData[] = $pending[$i] ?? 0;
            $totalData[]=$total[$i] ?? 0;
            $approvedData[] = $approved[$i] ?? 0;
            $rejecteddData[]= $rejected[$i] ?? 0;
        }

        return response()->json([
            'pending' =>$pendingData,
            'approved' =>$approvedData,
            'rejected' =>$rejecteddData,
            'total' =>$totalData,
        ]);

    }

      public function getWeeklyGraph(){
        //  $user_district_code = Auth::user()->district_id ?? null;
        //     $year = now()->year;
        //     $month = now()->month;
        //  $total = DB::table('complaints')
        //     ->selectRaw('WEEK(created_at) as week, COUNT(*) as count')
        //     ->whereYear('created_at', $year)
        //     ->whereMonth('created_at', $month)
        //     // ->where('status', 2)
        //     // ->where('district_id', $user_district_code)
        //     // ->where('added_by', $addedBy)
        //     ->groupBy('week')
        //     ->pluck('count', 'week')->toArray();
        //     // dd($total);

        // $pending = DB::table('complaints')
        //      ->selectRaw('WEEK(created_at) as week, COUNT(*) as count')
        //     ->whereYear('created_at', $year)
        //     ->whereMonth('created_at', $month)
        //     // ->where('application_status', 'pending')
        //      ->where('status', 'In Progress')
        //     // ->where('district_id', $user_district_code)
        //     // ->where('added_by', $addedBy)
        //      ->groupBy('week')
        //     ->pluck('count', 'week')->toArray();
        // $approved = DB::table('complaints')
        //      ->selectRaw('WEEK(created_at) as week, COUNT(*) as count')
        //     ->whereYear('created_at', $year)
        //     ->whereMonth('created_at', $month)
        //     // ->where('application_status', 'approved')
        //      ->where('status', 'Disposed - Accepted')
        //     // ->where('district_id', $user_district_code)
        //     // ->where('added_by', $addedBy)
        //      ->groupBy('week')
        //     ->pluck('count', 'week')->toArray();
        // $rejected = DB::table('complaints')
        //      ->selectRaw('WEEK(created_at) as week, COUNT(*) as count')
        //     ->whereYear('created_at', $year)
        //     ->whereMonth('created_at', $month)
        //     // ->where('application_status', 'rejected')
        //      ->where('status', 'Rejected')
        //     // ->where('district_id', $user_district_code)
        //     // ->where('added_by', $addedBy)
        //      ->groupBy('week')
        //     ->pluck('count', 'week')->toArray();

        //     // dd($approved);

        // $months = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // $pendingData = [];
        // $approvedData = [];
        // $rejecteddData = [];
        // $totalData = [];

        // for ($i = 1; $i <= 7; $i++) {
        //     $pendingData[] = $pending[$i] ?? 0;
        //     $totalData[]=$total[$i] ?? 0;
        //     $approvedData[] = $approved[$i] ?? 0;
        //     $rejecteddData[]= $rejected[$i] ?? 0;
        // }

        // return response()->json([
        //     'pending' =>$pendingData,
        //     'approved' =>$approvedData,
        //     'rejected' =>$rejecteddData,
        //     'total' =>$totalData,
        // ]);

  $year = now()->year;
    $month = now()->month;

    // total complaints by day (last 7 days)
    $total = DB::table('complaints')
        ->selectRaw('DATE(created_at) as day, COUNT(*) as count')
        ->whereYear('created_at', $year)
        ->whereMonth('created_at', $month)
        ->whereBetween('created_at', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
        ->groupBy('day')
        ->pluck('count', 'day')
        ->toArray();

    // pending complaints
    $pending = DB::table('complaints')
        ->selectRaw('DATE(created_at) as day, COUNT(*) as count')
        ->whereYear('created_at', $year)
        ->whereMonth('created_at', $month)
        ->where('status', 'In Progress')
        ->whereBetween('created_at', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
        ->groupBy('day')
        ->pluck('count', 'day')
        ->toArray();

    // approved complaints
    $approved = DB::table('complaints')
        ->selectRaw('DATE(created_at) as day, COUNT(*) as count')
        ->whereYear('created_at', $year)
        ->whereMonth('created_at', $month)
        ->where('status', 'Disposed - Accepted')
        ->whereBetween('created_at', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
        ->groupBy('day')
        ->pluck('count', 'day')
        ->toArray();

    // rejected complaints
    $uI= DB::table('complaints')
        ->selectRaw('DATE(created_at) as day, COUNT(*) as count')
        ->whereYear('created_at', $year)
        ->whereMonth('created_at', $month)
        ->where('status', 'Under Investigation')
        ->whereBetween('created_at', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
        ->groupBy('day')
        ->pluck('count', 'day')
        ->toArray();

    // build arrays for last 7 days
    $pendingData = [];
    $approvedData = [];
    $uIData = [];
    $totalData   = [];
    $labels      = [];

    for ($i = 6; $i >= 0; $i--) {
        $date = now()->subDays($i);
        $day  = $date->toDateString();   // YYYY-MM-DD
        $labels[]      = $date->format('D');  // Mon, Tue, Wed
        $pendingData[] = $pending[$day] ?? 0;
        $approvedData[]= $approved[$day] ?? 0;
        $uIData[]= $rejected[$day] ?? 0;
        $totalData[]   = $total[$day] ?? 0;
    }

    return response()->json([
        'labels'   => $labels,      // last 7 days (YYYY-MM-DD)
        'progress'  => $pendingData,
        'disposed' => $approvedData,
        'ui' => $uIData,
        'total'    => $totalData,
    ]);



    }

     public function getdistrictWiseCompanyTypeGraph(){
        //  $user_district_code = Auth::user()->district_id ?? null;
        //  $user_tehsil_code = Auth::user()->tehsil_id ?? null;
        //  $user_block_code = Auth::user()->block_id ?? null;

    //     //  dd($user_district_code,$user_tehsil_code,$user_block_code);
            // $blockdata = DB::table('block_master as bm')
    // ->leftJoin('complaints as hd', 'hd.block_id', '=', 'bm.block_code')
    // // ->leftJoin('district_master as dm', 'hd.district_id', '=', 'dm.dist_code')
    // // ->leftJoin('tehsil_master as tm', 'hd.tahsil_id', '=', 'dm.tehsil_code')
    // ->select(
    //     'bm.block_code as block_id',
    //     'bm.block_name',
    //     'hd.*',
    //     // DB::raw('COUNT(hd.id) as total_applications'),
    //     // DB::raw("SUM(CASE WHEN hd.application_status = 'approved' THEN 1 ELSE 0 END) as total_approved_applications")
    // )
    // ->groupBy('bm.block_code', 'bm.block_name')
    // // ->having('total_applications', '>', 0)
    // // ->orderBy('bm.block_name')
    // // ->limit(10)
    // ->get();
$blockdata = DB::table('district_master as dm')
    ->leftJoin('complaints as hd', 'hd.district_id', '=', 'dm.district_code') // use inner join to exclude empty blocks
     ->leftJoin('complaints_details as cd', 'hd.id', '=', 'cd.complain_id')
    ->select(
        'dm.district_code as district_id',
        'dm.district_name',
        DB::raw("count(hd.id) as total_complains"),
        DB::raw("SUM(CASE WHEN cd.complaintype_id = '1' THEN 1 ELSE 0 END) as allegations"),
        DB::raw("SUM(CASE WHEN cd.complaintype_id = '2' THEN 1 ELSE 0 END) as grievances")
    )
    ->groupBy('dm.district_code', 'dm.district_name')
    ->having('total_complains', '>', 0)
    // ->limit(5)
    // ->where('block_id',$user_dist_code)
    // ->orderBy('bm.block_name', 'asc')
    ->get();
    // $housingDetails = DB::table('complaints')
    // ->whereIn('block_id', $blockdata->pluck('block_id'))
    // ->get();
    // dd($blockdata);
    $blockdata = $blockdata->map(function ($item) {
        if($item->total_complains){
   return [
                'district_id' => $item->district_id,
                'district_name' => $item->district_name,
                'total_complains' => $item->total_complains,
                'allegations' => $item->allegations,
                'grievances' => $item->grievances,
            ];
        }
         
        })->toArray();

        $blockNameData = [];
        $totalAppData = [];
        $approveAppData = [];
        $pendingAppData = [];
        for($i = 0 ;$i < count($blockdata); $i++){
                $blockNameData[] = $blockdata[$i]['district_name'] ?? 0;
                $totalAppData[] = $blockdata[$i]['total_complains'] ?? 0;
                $approveAppData[] = $blockdata[$i]['allegations'] ?? 0;
                $pendingAppData[] = $blockdata[$i]['grievances'] ?? 0;
        }

        return response()->json([
            'district' => $blockNameData,
            'total' => $totalAppData,
            'allegations' => $approveAppData,
            'grievances' => $pendingAppData
        ]);
        // dd($approveAppData,$totalAppData,$distNameData,$pendingAppData);

    }

}
