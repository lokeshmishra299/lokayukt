<?php

namespace App\Http\Controllers\api\Operator;

use App\Http\Controllers\Controller;
use App\Models\ComplainDetails;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OperatorReportController extends Controller
{
      public function complainReports()
    {
        // $user_id = Auth::id();
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
       
        $districtData = DB::table('district_master')->orderBy('district_name')->get();
        // $departments = DB::table('departments')
        //     ->select('name', 'name_hi')
        //     ->orderBy('name')
        //     ->get();
        // $designations = DB::table('designations')
        //    ->select('name', 'name_hi')
        //     ->orderBy('name')
        //     ->get();
        // $complaintypes = DB::table('complaintype')
        //      ->select('name', 'name_hi')
        //     ->orderBy('name')
        //     ->get();
        // $subjects = DB::table('subjects')
        //      ->select('name', 'name_hi')
        //     ->orderBy('name')
        //     ->get();
        // $records = DB::table('complaints')
        // ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
        //     ->leftJoin('district_master as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
        //     ->leftJoin('departments as dp', DB::raw("cd.department_id"), '=', DB::raw("dp.id"))
        //     ->leftJoin('designations as ds', DB::raw("cd.designation_id"), '=', DB::raw("ds.id"))
        //     ->leftJoin('complaintype as ct', DB::raw("cd.complaintype_id"), '=', DB::raw("ct.id"))
        //     ->leftJoin('subjects as sub', DB::raw("cd.department_id"), '=', DB::raw("sub.id"))
            
        //     ->select(
        //         'complaints.*',
        //         'dd.district_name as district_name',
        //         'dp.name as department_name',
        //         'ds.name as designation_name',
        //         'ct.name as complaintype_name',
        //         'sub.name as subject_name',
        //         // 'cd.*'
        //     );
        $records = DB::table('complaints')
    ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
    ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
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
        'ds.name as designation_name',

        // Concatenate multiple related fields
        DB::raw("GROUP_CONCAT(DISTINCT dp.name SEPARATOR ', ') as department_name"),
        DB::raw("GROUP_CONCAT(DISTINCT ds.name SEPARATOR ', ') as designation_name"),
        DB::raw("GROUP_CONCAT(DISTINCT ct.name SEPARATOR ', ') as complaintype_name"),
        DB::raw("GROUP_CONCAT(DISTINCT sub.name SEPARATOR ', ') as subject_name")
    );
 

        if (!empty($districtId)) {
            $records->where('complaints.district_id', $districtId);
        }

   
        if (!empty($status)) {
      
            $records->where('complaints.status', $status);
        }
        
        if (!empty($search)) {
            $records->where(function ($q) use ($search) {
                $q->where('complaints.complain_no', 'like', "%{$search}%")
                ->orWhere('complaints.name', 'like', "%{$search}%")
                ->orWhere('complaints.mobile', 'like', "%{$search}%");
            });
        }
        // if ($departments) {
        //     $records->where('complaints.department_id', $department);
        // }
        // if ($designations) {
        //     $records->where('complaints.designation_id', $designation);
        // }
        // if ($complaintypes) {
        //     $records->where('complaints.complaintype_id', $complaintype);
        // }
        // if ($subjects) {
        //     $records->where('complaints.subject_id', $subject);
        // }
        // if (!empty($roleid) && $roleid == '7') {
        //     $records->where('complaints.approved_rejected_by_ri', $status);
        //     $records->where('complaints.approved_rejected_by_naibtahsildar', 0);
        //     $records->where('complaints.approved_rejected_by_tahsildar', 0);
        //     $records->where('complaints.approved_rejected_by_sdm', 0);
        //     $records->where('complaints.approved_rejected_by_adm', 0);
        // }
        // if (!empty($roleid) && $roleid == '8') {
        //     $records->where('complaints.approved_rejected_by_ri', 1);
        //     $records->where('complaints.approved_rejected_by_naibtahsildar', $status);
        //     $records->where('complaints.approved_rejected_by_tahsildar', 0);
        //     $records->where('complaints.approved_rejected_by_sdm', 0);
        //     $records->where('complaints.approved_rejected_by_adm', 0);
        // }
        // if (!empty($roleid) && $roleid == '9') {
        //     $records->where('complaints.approved_rejected_by_ri', 1);
        //     $records->where('complaints.approved_rejected_by_naibtahsildar', 1);
        //     $records->where('complaints.approved_rejected_by_tahsildar', $status);
        //     $records->where('complaints.approved_rejected_by_sdm', 0);
        //     $records->where('complaints.approved_rejected_by_adm', 0);
        // }
        // if (!empty($roleid) && $roleid == '10') {
        //     $records->where('complaints.approved_rejected_by_ri', 1);
        //     $records->where('complaints.approved_rejected_by_naibtahsildar', 1);
        //     $records->where('complaints.approved_rejected_by_tahsildar', 1);
        //     $records->where('complaints.approved_rejected_by_sdm', $status);
        //     $records->where('complaints.approved_rejected_by_adm', 0);
        // }
        // if (!empty($roleid) && $roleid == '11') {
        //     $records->where('complaints.approved_rejected_by_ri', 1);
        //     $records->where('complaints.approved_rejected_by_naibtahsildar', 1);
        //     $records->where('complaints.approved_rejected_by_tahsildar', 1);
        //     $records->where('complaints.approved_rejected_by_sdm', 1);
        //     $records->where('complaints.approved_rejected_by_adm', $status);
        // }
        // dd($records->toSql());
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
    )
     ->where('in_draft','0')
        ->get();
        // return json_encode($records->toSql());
        // $records = $records->paginate(50);
        // $roles = Role::whereNotIn('id', [5, 6])->get();
        // dd($roles);
        // dd($districtData);
        if($records){
            
            return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $records,
           ]);
        }else{
            return response()->json([
               'status' => false,
               'message' => 'No Records Found',
           ]);
        }
      
    }

       public function allComplains(){

        //    $query = DB::table('complaints');
        //   $complainDetails = $query->count();
        // dd($deadpersondetails);

       $complainDetails =  DB::table('complaints as cm')
                ->select(
                    DB::raw('COUNT(cm.id) as total_complaints'),
                    DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1'  THEN 1 ELSE 0 END) as total_approved"),
                    DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '0' THEN 1 ELSE 0 END) as total_pending"),
                    DB::raw("SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) as total_rejected")
                )
                 ->where('in_draft','0')
                ->first();
            
           

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
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
         public function viewDraft($id)
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
    ->where('cm.in_draft', '1')
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

        public function getFilePreview($id){
        $cmp = Complaint::findOrFail($id);
        $cmpDetail = ComplainDetails::where('complain_id',$cmp->id)->get();
        foreach($cmpDetail as $c){

            $path[] = Storage::url('letters/' . $c->file); 
            $cmp->filepath = $path;
        }
           return response()->json([
               'status' => true,
               'message' => 'File Fetch successfully',
               'data' => $cmp->filepath,
           ]);

    }

         public function allComplainsDashboard(){
       
           $query = DB::table('complaints');
          $complainDetails = $query
           ->where('in_draft','0')
          ->count();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsDashboardPending(){
       
           $query = DB::table('complaints')
            ->where('in_draft','0')
           ->where('status','In Progress');
          $complainDetails = $query->count();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsDashboardApproved(){
               $query = DB::table('complaints')
                ->where('in_draft','0')
           ->where('status','Disposed - Accepted');
          $complainDetails = $query->count();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsDashboardRejected(){
              $query = DB::table('complaints')
               ->where('in_draft','0')
           ->where('status','Rejected');
          $complainDetails = $query->count();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

    public function complainDistrictWise()
    {
       
        $complainCounts = Complaint::select('district_master.district_name', DB::raw('count(*) as complain_count'))
            ->join('district_master', 'complaints.district_id', '=', 'district_master.district_code')
            ->groupBy('district_master.district_code', 'district_master.district_name')
            ->where('in_draft','0')
            ->limit(5)
            //  ->having('complain_count', '>', 0)
            ->pluck('complain_count', 'district_master.district_name');
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
        DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1' THEN 1 ELSE 0 END) as total_approved"),
        DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '0' THEN 1 ELSE 0 END) as total_pending")
    )
  
    ->groupBy('month')
    // ->having('total_applications', '>', 0)
    ->orderBy('cm.name')
    ->limit(10)
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
    //      $complainDetails = DB::table('complaints as cm')
    // ->select(
    //     DB::raw('COUNT(cm.id) as total_complaints'),

    //     // Counts
    //     // DB::raw("SUM(CASE WHEN cm.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved"),
    //     // DB::raw("SUM(CASE WHEN cm.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending"),
    //     // DB::raw("SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) as total_rejected"),

    //     // Percentages
    //     // DB::raw("ROUND(
    //     //     (SUM(CASE WHEN cm.approved_rejected_by_ro = '1' THEN 1 ELSE 0 END) / 
    //     //      COUNT(cm.id)) * 100, 2
    //     // ) as approved_percentage"),

    //     // DB::raw("ROUND(
    //     //     (SUM(CASE WHEN cm.approved_rejected_by_ro = '0' THEN 1 ELSE 0 END) / 
    //     //      COUNT(cm.id)) * 100, 2
    //     // ) as pending_percentage"),

    //     // DB::raw("ROUND(
    //     //     (SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) / 
    //     //      COUNT(cm.id)) * 100, 2
    //     // ) as rejected_percentage")
    //       DB::raw("
    //         ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) BETWEEN 1 AND 10 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as approved_percentage
    //     "),
    //        DB::raw("
    //         ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) BETWEEN 10 AND 20 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as pending_percentage
    //     "),
    //     DB::raw("
    //         ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) > 20 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as rejected_percentage
    //     ")
    // )
    //  ->where('approved_rejected_by_ro','1')
    //  ->where('in_draft','0')
    // ->first();
    $complainDetails = DB::table('complaints as cm')
    ->select(
        DB::raw('COUNT(cm.id) as total_complaints'),

        // Within Target: Complaints created within the last 10 days
        DB::raw("
            ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) BETWEEN 0 AND 10 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as approved_percentage
        "),

        // Delayed: Complaints between 11 to 20 days old
        DB::raw("
            ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) BETWEEN 11 AND 20 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as pending_percentage
        "),

        // Critical Delay: Complaints older than 20 days
        DB::raw("
            ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) > 20 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as rejected_percentage
        ")
    )
    ->where('approved_rejected_by_ro', '1')
    ->where('in_draft', '0')
    ->first();

    return response()->json([
        'status' => true,
        'message' => 'Records Fetch successfully',
        'data' => $complainDetails,
    ]);

    }
   
    // public function progress_report(){
    //     // $userSubroleRole = Auth::user()->subrole->name;
        
    //      $records = DB::table('complaints')
    //     //   ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
    //         // ->leftJoin('district_master as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
    //         // ->leftJoin('departments as dp', DB::raw("complaints.department_id"), '=', DB::raw("dp.id"))
    //         // ->leftJoin('designations as ds', DB::raw("complaints.designation_id"), '=', DB::raw("ds.id"))
    //         // ->leftJoin('complaintype as ct', DB::raw("complaints.complaintype_id"), '=', DB::raw("ct.id"))
    //         // ->leftJoin('subjects as sub', DB::raw("complaints.department_id"), '=', DB::raw("sub.id"))
    //         // ->leftJoin('users as u', DB::raw("complaints.added_by"), '=', DB::raw("u.id"))
    //         // ->leftJoin('sub_roles as srole', DB::raw("u.sub_role_id"), '=', DB::raw("srole.id"))
    //         // ->leftJoin('complaint_actions as ca', DB::raw("complaints.id"), '=', DB::raw("ca.complaint_id"))
            
    //         ->select(
    //             'complaints.*',
    //             // 'u.id as user_id',
    //             // 'srole.name as subrole_name',
    //             // 'ca.*',
    //             // 'cd.*'
    //             // 'dd.district_name as district_name',
    //             // 'dp.name as department_name',
    //             // 'ds.name as designation_name',
    //             // 'ct.name as complaintype_name',
    //             // 'sub.name as subject_name',
    //         )
    //         // ->groupBy('complaints.id','u.id','srole.name')
    //         ->get();
    //           return response()->json([
    //             'status' => true,
    //             'message' => 'Records Fetch successfully',
    //             'data' => $records,
    //         ]);
    //         // dd($records);
    // }

        public function progress_report(){
        // $userSubroleRole = Auth::user()->subrole->name;
        
         $records = DB::table('complaints')
        //   ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
            // ->leftJoin('district_master as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
            // ->leftJoin('departments as dp', DB::raw("complaints.department_id"), '=', DB::raw("dp.id"))
            // ->leftJoin('designations as ds', DB::raw("complaints.designation_id"), '=', DB::raw("ds.id"))
            // ->leftJoin('complaintype as ct', DB::raw("complaints.complaintype_id"), '=', DB::raw("ct.id"))
            // ->leftJoin('subjects as sub', DB::raw("complaints.department_id"), '=', DB::raw("sub.id"))
            // ->leftJoin('users as u', DB::raw("complaints.added_by"), '=', DB::raw("u.id"))
            // ->leftJoin('sub_roles as srole', DB::raw("u.sub_role_id"), '=', DB::raw("srole.id"))
            ->join('complaint_actions as ca', DB::raw("complaints.id"), '=', DB::raw("ca.complaint_id"))
            
            ->select(
                // 'complaints.*',
                'ca.*',
                'complaints.complain_no',
                'complaints.name',
                'complaints.approved_rejected_by_ro',
                'complaints.approved_rejected_by_so_us',
                'complaints.approved_rejected_by_ds_js',
                'complaints.approved_rejected_by_d_a',
                'complaints.approved_rejected_by_lokayukt',
                // 'u.id as user_id',
                // 'srole.name as subrole_name',
                
                // 'cd.*'
                // 'dd.district_name as district_name',
                // 'dp.name as department_name',
                // 'ds.name as designation_name',
                // 'ct.name as complaintype_name',
                // 'sub.name as subject_name',
            )
            // ->groupBy('complaints.id','u.id','srole.name')
             ->where('in_draft','0')
             ->where('ca.status','<>', "Report Requested")
            //  ->where('ca.type', 1)
            ->orderBy('complaints.id','desc')
            ->get();
              return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' => $records,
            ]);
            // dd($records);
    }


     public function current_report(){
        // $userSubroleRole = Auth::user()->subrole->name;
        
        //  $records = DB::table('complaints')
        // //  ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
        //     // ->leftJoin('district_master as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
        //     // ->leftJoin('departments as dp', DB::raw("complaints.department_id"), '=', DB::raw("dp.id"))
        //     // ->leftJoin('designations as ds', DB::raw("complaints.designation_id"), '=', DB::raw("ds.id"))
        //     // ->leftJoin('complaintype as ct', DB::raw("complaints.complaintype_id"), '=', DB::raw("ct.id"))
        //     // ->leftJoin('subjects as sub', DB::raw("complaints.department_id"), '=', DB::raw("sub.id"))
        //     ->join('complaint_actions as ca', DB::raw("complaints.id"), '=', DB::raw("ca.complaint_id"))
        //     ->leftJoin('users as u', DB::raw("ca.forward_by_ro"), '=', DB::raw("u.id"))
        //     ->leftJoin('users as so_us', DB::raw("ca.forward_by_so_us"), '=', DB::raw("so_us.id"))
        //     ->leftJoin('users as ds_js', DB::raw("ca.forward_by_ds_js"), '=', DB::raw("ds_js.id"))
        //     ->leftJoin('users as sec', DB::raw("ca.forward_by_sec"), '=', DB::raw("sec.id"))
        //     ->leftJoin('users as d_a', DB::raw("ca.forward_by_d_a"), '=', DB::raw("d_a.id"))
        //     ->leftJoin('sub_roles as srole', DB::raw("u.sub_role_id"), '=', DB::raw("srole.id"))
            
        //     ->select(
        //         'complaints.*',
        //         'complaints.name',
        //         'complaints.complain_no',
        //         'ca.*',
        //         // 'u.id as user_id',
        //         'u.name as ro_name',
        //         'so_us.name as so_name',
        //         'ds_js.name as ds_name',
        //         'sec.name as sec_name',
        //         'd_a.name as da_name',
        //         'srole.name as subrole_name',
        //         // 'ca.*',
        //         // 'cd.*',
        //         DB::raw('DATEDIFF(NOW(), ca.target_date) as days')
        //         // 'dd.district_name as district_name',
        //         // 'dp.name as department_name',
        //         // 'ds.name as designation_name',
        //         // 'ct.name as complaintype_name',
        //         // 'sub.name as subject_name',
        //     )
        //      ->where('in_draft','0')
        //     ->orderBy('complaints.id','desc')
        //     // ->groupBy('complaints.id','u.id','srole.name')
        //     ->get();
        $latestActions = DB::table('complaint_actions as ca1')
    ->select('ca1.*')
    //  ->where('ca1.type', 1)
    ->join(DB::raw("(SELECT complaint_id, MAX(id) AS max_id
            FROM complaint_actions
            GROUP BY complaint_id
        ) as ca2"),
        function ($join) {
            $join->on('ca1.id', '=', 'ca2.max_id');
        }
    );
    // ->toSql();
    // dd($latestActions);

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
    ->where('in_draft', '0')
    ->orderBy('complaints.id', 'desc')
    // ->whereNotNull('target_date')
    // ->toSql();
    ->get();

            //    dd($records);
              return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' => $records,
            ]);
         
    }

    public function analytics(){
    //     $stats = DB::table('complaints')
    // ->leftJoin('complaint_actions as ca', 'complaints.id', '=', 'ca.complaint_id')
    // ->selectRaw('
    //     AVG(DATEDIFF(IFNULL(ca.created_at, NOW()), complaints.created_at)) as avg_processing_time,
    //     SUM(CASE WHEN complaints.form_status = "1" AND approved_rejected_by_ro ="1" THEN 1 ELSE 0 END) as files_in_transit,
    //     SUM(CASE WHEN ca.target_date < NOW()  THEN 1 ELSE 0 END) as overdue_files
    // ')
    //  ->where('in_draft','0')
    // ->first();
    $stats = DB::table('complaints')
    ->selectRaw('
        AVG(DATEDIFF(NOW(), complaints.created_at)) as avg_processing_time,
        SUM(CASE WHEN complaints.form_status = "1" AND approved_rejected_by_ro = "1" THEN 1 ELSE 0 END) as files_in_transit,
        SUM(CASE WHEN DATEDIFF(NOW(), complaints.created_at) > 20 THEN 1 ELSE 0 END) as overdue_files
    ')
    ->where('in_draft', '0')
    ->first();
    // $stats = DB::table('complaints as c')
    // // Join: when status became "in progress"
    // ->join(DB::raw('(
    //     SELECT complaint_id, MIN(created_at) as in_progress_at
    //     FROM complaint_actions
    //     WHERE status = "in progress"
    //     GROUP BY complaint_id
    // ) as in_progress'), 'c.id', '=', 'in_progress.complaint_id')

    // // Join: when status became "disposed Approval"
    // ->join(DB::raw('(
    //     SELECT complaint_id, MAX(created_at) as disposed_at
    //     FROM complaint_actions
    //     WHERE status = "disposed Approval"
    //     GROUP BY complaint_id
    // ) as disposed'), 'c.id', '=', 'disposed.complaint_id')

    // // Select overall stats
    // ->selectRaw('
    //     AVG(DATEDIFF(NOW(), c.created_at)) as avg_processing_time,
    //     SUM(CASE WHEN c.form_status = "1" AND approved_rejected_by_ro = "1" THEN 1 ELSE 0 END) as files_in_transit,
    //     SUM(CASE WHEN DATEDIFF(NOW(), c.created_at) > 20 THEN 1 ELSE 0 END) as overdue_files,
    //     AVG(DATEDIFF(disposed.disposed_at, in_progress.in_progress_at)) as status_processing_time
    // ')
    // ->where('c.in_draft', '0')
    // ->first();

              return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' =>  $stats,
            ]);
    }

}
