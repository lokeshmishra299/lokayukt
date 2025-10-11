<?php

namespace App\Http\Controllers\api\LokAyukt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LokayuktController extends Controller
{
   public function allComplains(){
      $userSubrole = Auth::user()->subrole->id; 
      $records = DB::table('complaints')
            ->leftJoin('district_master as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
            ->leftJoin('departments as dp', DB::raw("complaints.department_id"), '=', DB::raw("dp.id"))
            ->leftJoin('designations as ds', DB::raw("complaints.designation_id"), '=', DB::raw("ds.id"))
            ->leftJoin('complaintype as ct', DB::raw("complaints.complaintype_id"), '=', DB::raw("ct.id"))
            ->leftJoin('subjects as sub', DB::raw("complaints.department_id"), '=', DB::raw("sub.id"))
            
            ->select(
                'complaints.*',
                'dd.district_name as district_name',
                'dp.name as department_name',
                'ds.name as designation_name',
                'ct.name as complaintype_name',
                'sub.name as subject_name',
            )
            ->where('form_status',1)
            ->where('approved_by_ro',1)
            ->get();
           

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $records,
           ]);
    }
     public function viewComplaint($id)
     {
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
        ->where('cm.id', $id)
        ->first();

            

            return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' => $complainDetails,
            ]);
    }
}
