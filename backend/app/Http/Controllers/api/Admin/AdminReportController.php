<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AdminReportController extends Controller
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
                $q->where('complaints.application_no', 'like', "%{$search}%")
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
        'dd.district_code'
    )
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
                    DB::raw("SUM(CASE WHEN cm.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved"),
                    DB::raw("SUM(CASE WHEN cm.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending"),
                      DB::raw("SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) as total_rejected")
                )->first();
            
           

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }
        public function viewComplaint($id)
  {
//        $complainDetails = DB::table('complaints as cm')
//     ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
//     // ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
//     // ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
//     // ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
//     // ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
//     ->select(
//         'cm.*',
//         'dd.district_name',
//         // 'dp.name as department_name',
//         // 'ds.name as designation_name',
//         // 'ct.name as complaintype_name',
//         // 'sub.name as subject_name'
//     )
//     ->where('cm.id', $id)
//     ->first();
        // if($complainDetails->file){
        //     $path = Storage::url('app/public/letters/' . $complainDetails->file);  
        //     $complainDetails->filepath = $path;
        // }
     
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

    public function getFilePreview($id){
        $cmp = Complaint::findOrFail($id);
        $path = Storage::url('letters/' . $cmp->file); 
        $cmp->filepath = $path;
           return response()->json([
               'status' => true,
               'message' => 'File Fetch successfully',
               'data' => $cmp->filepath,
           ]);

    }

         public function allComplainsDashboard(){
       
           $query = DB::table('complaints');
          $complainDetails = $query->count();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsDashboardPending(){
       
           $query = DB::table('complaints')
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
            ->groupBy('departments.id', 'departments.name')
             
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
        DB::raw("SUM(CASE WHEN cm.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved"),
        DB::raw("SUM(CASE WHEN cm.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending")
    )
  
    ->groupBy('month')
    // ->having('total_applications', '>', 0)
    ->orderBy('cm.name')
    ->limit(10)
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
          DB::raw('ROUND(AVG(DATEDIFF(NOW(), cm.created_at)), 1) as avg_days')
         
        // DB::raw("SUM(CASE WHEN cm.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved"),
        // DB::raw("SUM(CASE WHEN cm.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending")
    )
  
    ->groupBy('complaintype.id', 'complaintype.name')
    // ->having('total_applications', '>', 0)
    // ->orderBy('cm.name')
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
        DB::raw("ROUND(
            (SUM(CASE WHEN cm.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) / 
             COUNT(cm.id)) * 100, 2
        ) as approved_percentage"),

        DB::raw("ROUND(
            (SUM(CASE WHEN cm.status = 'In Progress' THEN 1 ELSE 0 END) / 
             COUNT(cm.id)) * 100, 2
        ) as pending_percentage"),

        DB::raw("ROUND(
            (SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) / 
             COUNT(cm.id)) * 100, 2
        ) as rejected_percentage")
    )
    ->first();
    return response()->json([
        'status' => true,
        'message' => 'Records Fetch successfully',
        'data' => $complainDetails,
    ]);

    }
   
}
