<?php

namespace App\Http\Controllers\api\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ComplaintAction;
use App\Models\SubRole;
use App\Models\User;
use App\Models\ComplaintNotes;
use App\Models\ComplainDocuments;
use App\Models\Drafts;
use App\Models\EmployeeComplainNotes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class SupervisorComplaintsController extends Controller
{
    public function allComplains(){
        $user = Auth::user()->id;
        // dd($user);
      $userSubrole = Auth::user()->subrole->name; 
    
        $parentId = null;
        $parentId = Auth::user()->parent_user_id;
        // dd($parentId);
        if($parentId){

            $userParentData = User::with('role')->where('id',$parentId)->get();
            $roleParent = $userParentData[0]->role->name ?? '';
        }
        // dd($roleParent);
           $userParentSubrole = Auth::user()->userParentRole ?? '';  

    if ($userSubrole) {
    $query = DB::table('complaints')
        //  ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
        ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
        ->leftJoin('complainants as cmlan', function ($join) {
                    $join->on('complaints.id', '=', 'cmlan.complaint_id')
                        ->where('cmlan.is_main', 1);
                })
                    ->leftJoin('respondents as resp', function ($join) {
                    $join->on('complaints.id', '=', 'resp.complaint_id')
                        ->where('resp.is_main', 1);
                })
                ->leftJoin('district_master as dd1', 'cmlan.permanent_district', '=', 'dd1.district_code')
        // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
        // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
        // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
        // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
        ->leftJoin('complaint_actions as rep', 'complaints.id', '=', 'rep.complaint_id')
        ->select(
            'complaints.*',
            'dd.district_name as district_name',
             'dd1.district_name as dist_new',
              'cmlan.complainant_name as complainantName',
                      'resp.respondent_name as respondentName',
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

    switch ($userSubrole) {
         case "ro":
            if($roleParent == "lok-ayukt"){
                   $query->where(function ($q) use ($user) {
                      $q->where('form_status', 1)
                      ->where('approved_rejected_by_rk', 1)
                      ->where('approved_rejected_by_ro', 0)
                      ->where('rep.forward_to_ro', $user);
                  });
            }else{
                
                $query->where(function ($q) use ($user) {
                      $q->where('form_status', 1)
                      ->where('approved_rejected_by_rk', 1)
                      ->where('approved_rejected_by_ro', 0)
                      ->where('rep.forward_to_ro', $user)
                      ->where('rep.forward_to_uplokayukt', '<>', 0);
                  })
                  ->orWhere(function ($q) use ($parentId) {
                      $q->where('approved_rejected_by_rk', 1)
                       ->where('approved_rejected_by_ro', 0)
                      ->where('complaints.approved_rejected_by_lokayukt', 1)
                      ->where('rep.forward_to_uplokayukt', $parentId);
                  });
            }
        //   $query->where('form_status', 1)
        //           ->where('approved_rejected_by_rk', 1)
        //           ->where('approved_rejected_by_ro', 0)
        //           ->where('rep.forward_to_ro', $user)
        //           ->whereOr('rep.forward_to_uplokayukt','<>',0);
                //   ->where('forward_so', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);

                 $todayCount = DB::table('complaints')
                              ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                                ->where('in_draft', 0)
                                ->whereDate('repN.created_at', today())
                                 ->where('repN.forward_to_ro', $user)
                                 ->distinct('complaints.id')
                                ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('repN.created_at', '<', now()->subDays(7))
                    ->where('complaints.approved_rejected_by_rk', 1)
                    ->where('complaints.approved_rejected_by_ro', 0)
                     ->where('repN.forward_to_ro', $user)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                ->where('complaints.in_draft', 0)
                ->where('complaints.approved_rejected_by_rk', 1)
                ->where('complaints.approved_rejected_by_ro', 0)
                ->where('repN.created_at', '<', now()->subDays(7))   // <-- FIX
                ->where('repN.forward_to_ro', $user)
                ->distinct('complaints.id')
                ->count();
              
                $feePending = DB::table('complaints')
                    ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('fee_exempted', 0)
                    ->where('repN.forward_to_ro', $user)
                    ->distinct('complaints.id')
                    ->count();
            break;
        case "ro-aro":
        //   $query->where('form_status', 1)
        //           ->where('approved_rejected_by_rk', 1)
        //           ->where('approved_rejected_by_ro_aro', 0)
        //           ->where('rep.forward_to_ro_aro', $user)
        //           ->whereOr('rep.forward_to_uplokayukt','<>',0);
                  $query->where(function ($q) use ($user) {
                    $q->where('form_status', 1)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('approved_rejected_by_ro_aro', 0)
                    ->where('rep.forward_to_ro_aro', $user)
                    ->where('rep.forward_to_uplokayukt', '<>', 0);
                })
                ->orWhere(function ($q) use ($parentId) {
                    $q->where('approved_rejected_by_rk', 1)
                     ->where('approved_rejected_by_ro_aro', 0)
                    ->where('complaints.approved_rejected_by_lokayukt', 1)
                    ->where('rep.forward_to_uplokayukt', $parentId);
                });

                //   ->where('forward_so', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);

                 $todayCount = DB::table('complaints')
                              ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                                ->where('in_draft', 0)
                                ->whereDate('repN.created_at', today())
                                 ->where('repN.forward_to_ro_aro', $user)
                                 ->distinct('complaints.id')
                                ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('repN.created_at', '<', now()->subDays(7))
                    ->where('complaints.approved_rejected_by_rk', 1)
                    ->where('complaints.approved_rejected_by_ro_aro', 0)
                     ->where('repN.forward_to_ro_aro', $user)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                ->where('complaints.in_draft', 0)
                ->where('complaints.approved_rejected_by_rk', 1)
                ->where('complaints.approved_rejected_by_ro_aro', 0)
                ->where('repN.created_at', '<', now()->subDays(7))   // <-- FIX
                ->where('repN.forward_to_ro_aro', $user)
                ->distinct('complaints.id')
                ->count();
              
                $feePending = DB::table('complaints')
                    ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('fee_exempted', 0)
                    ->where('repN.forward_to_ro_aro', $user)
                    ->distinct('complaints.id')
                    ->count();
            break;

        case "sec":
        //    $query->where('form_status', 1)
        //           ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
                // $query->groupBy('rep.target_date');    
                        $query->where('approved_rejected_by_sec', 0)
                        ->where('rep.status', 'Forwarded')
                                ->whereNotNull('rep.forward_to_sec')
                                 ->where('rep.forward_to_sec',$user);
                //  $query->where('rep.type', 2)
                //                 ->where('rep.status', 'Report Requested')
                //                 ->whereNotNull('rep.forward_to_sec')
                //                  ->where('rep.forward_to_sec',$user);

                 $todayCount = DB::table('complaints')
                              ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                                ->where('in_draft', 0)
                                ->whereDate('repN.created_at', today())
                                 ->where('repN.forward_to_sec', $user)
                                 ->distinct('complaints.id')
                                ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('repN.created_at', '<', now()->subDays(7))
                    ->where('complaints.approved_rejected_by_rk', 1)
                    ->where('complaints.approved_rejected_by_sec', 0)
                     ->where('repN.forward_to_sec', $user)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                ->where('complaints.in_draft', 0)
                ->where('complaints.approved_rejected_by_rk', 1)
                ->where('complaints.approved_rejected_by_sec', 0)
                ->where('repN.created_at', '<', now()->subDays(7))   // <-- FIX
                ->where('repN.forward_to_sec', $user)
                ->distinct('complaints.id')
                ->count();
              
                $feePending = DB::table('complaints')
                    ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('fee_exempted', 0)
                    ->where('repN.forward_to_sec', $user)
                    ->distinct('complaints.id')
                    ->count();
            break;

              case "ds":
                //    $query->where('form_status', 1)
                //           ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
                // $query->groupBy('rep.target_date');    
                        $query->where('approved_rejected_by_ds', 0)
                        ->where('rep.status', 'Forwarded')
                                ->whereNotNull('rep.forward_to_ds')
                                 ->where('rep.forward_to_ds',$user);
                //  $query->where('rep.type', 2)
                //                 ->where('rep.status', 'Report Requested')
                //                 ->whereNotNull('rep.forward_to_ds')
                //                  ->where('rep.forward_to_ds',$user);

                 $todayCount = DB::table('complaints')
                              ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                                ->where('in_draft', 0)
                                ->whereDate('repN.created_at', today())
                                 ->where('repN.forward_to_ds', $user)
                                 ->distinct('complaints.id')
                                ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('repN.created_at', '<', now()->subDays(7))
                    ->where('complaints.approved_rejected_by_rk', 1)
                    ->where('complaints.approved_rejected_by_ds', 0)
                     ->where('repN.forward_to_ds', $user)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                ->where('complaints.in_draft', 0)
                ->where('complaints.approved_rejected_by_rk', 1)
                ->where('complaints.approved_rejected_by_ds', 0)
                ->where('repN.created_at', '<', now()->subDays(7))   // <-- FIX
                ->where('repN.forward_to_ds', $user)
                ->distinct('complaints.id')
                ->count();
              
                $feePending = DB::table('complaints')
                    ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('fee_exempted', 0)
                    ->where('repN.forward_to_ds', $user)
                    ->distinct('complaints.id')
                    ->count();
            break;
         case "js":
                //    $query->where('form_status', 1)
                //           ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
                // $query->groupBy('rep.target_date');    
                        $query->where('approved_rejected_by_ds', 0)
                        ->where('rep.status', 'Forwarded')
                                ->whereNotNull('rep.forward_to_ds')
                                 ->where('rep.forward_to_ds',$user);
                //  $query->where('rep.type', 2)
                //                 ->where('rep.status', 'Report Requested')
                //                 ->whereNotNull('rep.forward_to_ds')
                //                  ->where('rep.forward_to_ds',$user);

                 $todayCount = DB::table('complaints')
                              ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                                ->where('in_draft', 0)
                                ->whereDate('repN.created_at', today())
                                 ->where('repN.forward_to_ds', $user)
                                 ->distinct('complaints.id')
                                ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('repN.created_at', '<', now()->subDays(7))
                    ->where('complaints.approved_rejected_by_rk', 1)
                    ->where('complaints.approved_rejected_by_ds', 0)
                     ->where('repN.forward_to_ds', $user)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                ->where('complaints.in_draft', 0)
                ->where('complaints.approved_rejected_by_rk', 1)
                ->where('complaints.approved_rejected_by_ds', 0)
                ->where('repN.created_at', '<', now()->subDays(7))   // <-- FIX
                ->where('repN.forward_to_ds', $user)
                ->distinct('complaints.id')
                ->count();
              
                $feePending = DB::table('complaints')
                    ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('fee_exempted', 0)
                    ->where('repN.forward_to_ds', $user)
                    ->distinct('complaints.id')
                    ->count();
            break;
            case "us":
                //    $query->where('form_status', 1)
                //           ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
                // $query->groupBy('rep.target_date');    
                        $query->where('approved_rejected_by_us', 0)
                        ->where('rep.status', 'Forwarded')
                                ->whereNotNull('rep.forward_to_us')
                                 ->where('rep.forward_to_us',$user);
                //  $query->where('rep.type', 2)
                //                 ->where('rep.status', 'Report Requested')
                //                 ->whereNotNull('rep.forward_to_us')
                //                  ->where('rep.forward_to_us',$user);

                 $todayCount = DB::table('complaints')
                              ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                                ->where('in_draft', 0)
                                ->whereDate('repN.created_at', today())
                                 ->where('repN.forward_to_us', $user)
                                 ->distinct('complaints.id')
                                ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('repN.created_at', '<', now()->subDays(7))
                    ->where('complaints.approved_rejected_by_rk', 1)
                    ->where('complaints.approved_rejected_by_us', 0)
                     ->where('repN.forward_to_us', $user)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                ->where('complaints.in_draft', 0)
                ->where('complaints.approved_rejected_by_rk', 1)
                ->where('complaints.approved_rejected_by_us', 0)
                ->where('repN.created_at', '<', now()->subDays(7))   // <-- FIX
                ->where('repN.forward_to_us', $user)
                ->distinct('complaints.id')
                ->count();
              
                $feePending = DB::table('complaints')
                    ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('fee_exempted', 0)
                    ->where('repN.forward_to_us', $user)
                    ->distinct('complaints.id')
                    ->count();
            break;


        case "cio-io":
             $query->where('complaints.approved_rejected_by_cio_io','0')
                 ->where('rep.forward_to_cio_io',$user);
                //   $query->where(function ($q) use ($user) {
                //     $q->where('form_status', 1)
                //     ->where('approved_rejected_by_rk', 1)
                //     ->where('approved_rejected_by_cio_io', 0)
                //     ->where('rep.forward_to_cio_io', $user);
                //     // ->where('rep.forward_to_uplokayukt', '<>', 0);
                // })
                // ->orWhere(function ($q) use ($parentId) {
                //     $q->where('approved_rejected_by_rk', 1)
                //      ->where('approved_rejected_by_cio_io', 0)
                //     ->where('complaints.approved_rejected_by_lokayukt', 1);
                //     // ->where('rep.forward_to_uplokayukt', $parentId);
                // });
        //    $query->where('form_status', 1)
        //           ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
             $todayCount = DB::table('complaints')
                              ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                                ->where('in_draft', 0)
                                ->whereDate('repN.created_at', today())
                                 ->where('repN.forward_to_cio_io', $user)
                                 ->distinct('complaints.id')
                                ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('repN.created_at', '<', now()->subDays(7))
                    ->where('complaints.approved_rejected_by_rk', 1)
                    ->where('complaints.approved_rejected_by_cio_io', 0)
                     ->where('repN.forward_to_cio_io', $user)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                ->where('complaints.in_draft', 0)
                ->where('complaints.approved_rejected_by_rk', 1)
                ->where('complaints.approved_rejected_by_cio_io', 0)
                ->where('repN.created_at', '<', now()->subDays(7))   // <-- FIX
                ->where('repN.forward_to_cio_io', $user)
                ->distinct('complaints.id')
                ->count();
              
                $feePending = DB::table('complaints')
                    ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('fee_exempted', 0)
                    ->where('repN.forward_to_cio_io', $user)
                    ->distinct('complaints.id')
                    ->count();

            break;

               case "io":
             $query->where('complaints.approved_rejected_by_io','0')
                 ->where('rep.forward_to_io',$user);
        //    $query->where('form_status', 1)
        //           ->where('approved_rejected_by_ro', 1);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
             $todayCount = DB::table('complaints')
                              ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                                ->where('in_draft', 0)
                                ->whereDate('repN.created_at', today())
                                 ->where('repN.forward_to_io', $user)
                                 ->distinct('complaints.id')
                                ->count();

             
                $older7DaysCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('repN.created_at', '<', now()->subDays(7))
                    ->where('complaints.approved_rejected_by_rk', 1)
                    ->where('complaints.approved_rejected_by_io', 0)
                     ->where('repN.forward_to_io', $user)
                     ->distinct('complaints.id')
                    ->count();

                $older7DaysDueCount = DB::table('complaints')
                ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                ->where('complaints.in_draft', 0)
                ->where('complaints.approved_rejected_by_rk', 1)
                ->where('complaints.approved_rejected_by_io', 0)
                ->where('repN.created_at', '<', now()->subDays(7))   // <-- FIX
                ->where('repN.forward_to_io', $user)
                ->distinct('complaints.id')
                ->count();
              
                $feePending = DB::table('complaints')
                    ->leftJoin('complaint_actions as repN', 'complaints.id', '=', 'repN.complaint_id')
                    ->where('in_draft', 0)
                    ->where('approved_rejected_by_rk', 1)
                    ->where('fee_exempted', 0)
                    ->where('repN.forward_to_io', $user)
                    ->distinct('complaints.id')
                    ->count();

            break;

        // case "dea-assis":
        //   $query->where('form_status', 1)
        //           ->where('approved_rejected_by_ro', 1)
        //            ->where(function($q){
        //                     $q->where('approved_rejected_by_so_us',1)
        //                     ->Orwhere('approved_rejected_by_ds_js', 1);               
        //                  });
        //             // ->whereNotNull('forward_to_d_a');
        //     break;

        default:
            return response()->json([
                'status' => false,
                'message' => 'Invalid subrole',
                'data' => [],
            ], 400);
    }

    $records = $query->distinct('complaints.id')->orderBy('complaints.updated_at', 'DESC')->get();

               


    return response()->json([
        'status' => true,
        'message' => 'Records fetched successfully',
        'data' => $records,
         'todayCount' => $todayCount,
        'older7DaysCount' => $older7DaysCount,
        'older7DaysDueCount' => $older7DaysDueCount,
        'feePending' => $feePending,
    ]);
}

}
//        public function viewComplaint($id)
//   {
//     //    $complainDetails = DB::table('complaints as cm')
//     //    ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
//     // ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
//     // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
//     // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
//     // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
//     // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
//     // ->select(
//     //     'cm.*',
//     //     'dd.district_name',
//     //     'dp.name as department_name',
//     //     'ds.name as designation_name',
//     //     'ct.name as complaintype_name',
//     //     'sub.name as subject_name',
//     //     // 'cd.*'
//     // )
//     // ->where('cm.id', $id)
//     // ->first();

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
           

//           return response()->json([
//                'status' => true,
//                'message' => 'Records Fetch successfully',
//                'data' => $complainDetails,
//            ]);
//     }

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
             'dmc.district_name as main_complainant_district',
        'rmc.district_name as main_respondant_district',
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
    //   $complainDetails->actions =  DB::table('complaint_actions')
    // ->where('complaint_id', $id)
    //  ->where(function($q){
    //                         $q->where('status','Verified')
    //                         ->Orwhere('status', 'Forwarded');               
    //                      }) ->orderBy('id','desc')
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
  
   public function getUserWithPs(){
     
      $usersByRole = User::with('role')
            ->whereNotNull('role_id')
            ->get()
            ->groupBy(fn ($user) => $user->role->name);

        // lok-ayukt + ps users merge
        $users = collect()
            ->merge($usersByRole['lok-ayukt'] ?? collect())
            ->merge($usersByRole['ps'] ?? collect());

        if ($users->isNotEmpty()) {
            return response()->json($users->values());
        }

        return response()->json([
            "message" => "Data Not Found"
        ]);
        // dd($usersByRole['lok-ayukt']);
   }
//    public function getUpLokayuktUsers(){
//     $usersByRole = User::with('role')
//      ->whereNotNull('role_id')
//         ->get()
//         ->groupBy(fn ($user) => $user->role->name);
//         if(!empty($usersByRole['up-lok-ayukt'])){

//             return response()->json($usersByRole['up-lok-ayukt']);
//         }else{

//             return response()->json(["message"=>"Data Not Found"]);
//         }
       
//    }
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

    // public function forwardComplaintbyds(Request $request,$complainId){
    //     //    dd($request->all());
    //     $user = Auth::user()->id;
    //     // dd($usersubrole);
   

    //     $validation = Validator::make($request->all(), [
    //         // 'forward_by_ds_js' => 'required|exists:users,id',
    //         'forward_to' => 'required|exists:users,id',
    //         'remarks' => 'required',
         
          
    //     ], [
    //         // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
    //         // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
    //         'forward_to.required' => 'Forward to user is required.',
    //         'forward_to.exists' => 'Forward to user does not exist.',
    //         'remarks.required' => 'Remark is required.',
           
    //     ]);

    //     if ($validation->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'errors' => $validation->errors()
    //         ], 422);
    //     }
    //     if(isset($complainId) && $request->isMethod('post')){

    //          $cmp =  Complaint::findOrFail($complainId);

    //         if($cmp){
    //             $cmp->approved_rejected_by_ds = 1;
    //             // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //             // $remark ='Remark By Deputy Secretary / Joint Secretary';
    //             // $remark.='\n';
    //             // $remark.= $request->remarks;
    //             // $remark.='\n';
    //             // $cmp->remark = $remark;
                
    //                 if($cmp->save()){
    //                     $apcAction = new ComplaintAction();
    //                     $apcAction->complaint_id = $complainId;
    //                     $apcAction->forward_by_ds_js = $user;
    //                     $apcAction->forward_to_d_a = $request->forward_to_d_a;
    //                     $apcAction->status = 'Forwarded';
    //                     $apcAction->type = '1';
    //                     $apcAction->remarks = $request->remarks;
    //                     $apcAction->save();
    //                 }
                
    //             // $cmpAction =new ComplaintAction();
    //             // $cmpAction->complaint_id = $complainId;
    //             // $cmpAction->forward_by_ds_js = $user;
    //             // $cmpAction->forward_to_d_a = $request->forward_to_d_a; //add supervisor user_id 
    //             // $cmpAction->status_ds_js = 1;
    //             // $cmpAction->action_type = "Forwarded";
    //             // $cmpAction->remarks = $request->remarks;
    //             // $cmpAction->save();
    //         }
    //         // $cmp->forward_by = $request->forward_by;
    //         // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //         // $cmp->sup_status = 1;
    //         // $cmp->save();
    
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
    // public function forwardComplaintbyroaro(Request $request,$complainId){
    //     //    dd($request->all());
    //     $user = Auth::user()->id;
    //     // dd($usersubrole);
   

    //     $validation = Validator::make($request->all(), [
    //         // 'forward_by_ds_js' => 'required|exists:users,id',
    //         'forward_to_d_a' => 'required|exists:users,id',
    //         'remarks' => 'required',
         
          
    //     ], [
    //         // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
    //         // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
    //         'forward_to_d_a.required' => 'Forward to user is required.',
    //         'forward_to_d_a.exists' => 'Forward to user does not exist.',
    //         'remarks.required' => 'Remark is required.',
           
    //     ]);

    //     if ($validation->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'errors' => $validation->errors()
    //         ], 422);
    //     }
    //     if(isset($complainId) && $request->isMethod('post')){

    //          $cmp =  Complaint::findOrFail($complainId);

    //         if($cmp){
    //             $cmp->approved_rejected_by_ds_js = 1;
    //             // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //             // $remark ='Remark By Deputy Secretary / Joint Secretary';
    //             // $remark.='\n';
    //             // $remark.= $request->remarks;
    //             // $remark.='\n';
    //             // $cmp->remark = $remark;
                
    //                 if($cmp->save()){
    //                     $apcAction = new ComplaintAction();
    //                     $apcAction->complaint_id = $complainId;
    //                     $apcAction->forward_by_ds_js = $user;
    //                     $apcAction->forward_to_d_a = $request->forward_to_d_a;
    //                     $apcAction->status = 'Forwarded';
    //                     $apcAction->type = '1';
    //                     $apcAction->remarks = $request->remarks;
    //                     $apcAction->save();
    //                 }
                
    //             // $cmpAction =new ComplaintAction();
    //             // $cmpAction->complaint_id = $complainId;
    //             // $cmpAction->forward_by_ds_js = $user;
    //             // $cmpAction->forward_to_d_a = $request->forward_to_d_a; //add supervisor user_id 
    //             // $cmpAction->status_ds_js = 1;
    //             // $cmpAction->action_type = "Forwarded";
    //             // $cmpAction->remarks = $request->remarks;
    //             // $cmpAction->save();
    //         }
    //         // $cmp->forward_by = $request->forward_by;
    //         // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //         // $cmp->sup_status = 1;
    //         // $cmp->save();
    
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
    
    //   public function forwardComplaintbylokayukt(Request $request,$complainId){
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

    //          $userRole = User::with('role')->where('id',$request->forward_to)->get();
    //         // dd($user[0]->role->name);
    //         $roleFwd = $userRole[0]->role->name;

              
    //         $cmp =  Complaint::findOrFail($complainId);
    //         // dd($cmp);

    //            if($cmp){
    //             $cmp->approved_rejected_by_ro_aro = 1;
    //             // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //             // $remark ='Remark By Deputy Secretary / Joint Secretary';
    //             // $remark.='\n';
    //             // $remark.= $request->remarks;
    //             // $remark.='\n';
    //             // $cmp->remark = $remark;
                
    //                 if($cmp->save()){
    //                     $apcAction = new ComplaintAction();
    //                     $apcAction->complaint_id = $complainId;
    //                     $apcAction->forward_to_ro_aro = $user;
    //                     // $apcAction->forward_to_uplokayukt = $request->forward_to;
    //                     $apcAction->status = 'Forwarded';
    //                     $apcAction->type = '1';
    //                     $apcAction->remarks = $request->remark;
    //                     $apcAction->save();
    //                 }
                
    //         }
     
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

     public function forwardComplaintbyRoAro(Request $request,$complainId){
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

            //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_ro_aro = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){

                         $apcAction = new ComplaintAction();
                            $apcAction->target_date = $request->target_date;
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
                        $apcAction->forward_by_ro_aro = $userId;
                        // $apcAction->approved_rejected_by_ro_aro = $userId;

                        if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                            if ($roleFwd === 'lok-ayukt') {
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            } else if($roleFwd === 'up-lok-ayukt') {
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }else{
                                 $apcAction->forward_to_ps = $request->forward_to;
                            }

                        } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                 case 'ds':
                                    $apcAction->forward_to_ds = $request->forward_to;
                                    break;
                                case 'js':
                                    $apcAction->forward_to_js = $request->forward_to;
                                    break;
                                case 'us':
                                    $apcAction->forward_to_us = $request->forward_to;
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
                               
                                    case 'ro-aro':
                                    $apcAction->forward_to_ro_aro = $request->forward_to;
                                    break;
                                    case 'ro':
                                    $apcAction->forward_to_ro = $request->forward_to;
                                    break;
                            }
                        }

                        if($request->sent_through_rk == 1){
                             $apcAction->sent_through_rk = 1;
                             $apcAction->sent_through_rk_id = $cmp->added_by;
                        }

                        $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
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
     public function forwardComplaintbyds(Request $request,$complainId){
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

            //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_ro_aro = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){

                         $apcAction = new ComplaintAction();
                            $apcAction->target_date = $request->target_date;
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
                        $apcAction->forward_by_ds = $userId;
                        // $apcAction->approved_rejected_by_ro_aro = $userId;

                        if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                            if ($roleFwd === 'lok-ayukt') {
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            } else if($roleFwd === 'up-lok-ayukt') {
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }else{
                                 $apcAction->forward_to_ps = $request->forward_to;
                            }

                        } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                 case 'ds':
                                    $apcAction->forward_to_ds = $request->forward_to;
                                    break;
                                case 'js':
                                    $apcAction->forward_to_js = $request->forward_to;
                                    break;
                                case 'us':
                                    $apcAction->forward_to_us = $request->forward_to;
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
                               
                                    case 'ro-aro':
                                    $apcAction->forward_to_ro_aro = $request->forward_to;
                                    break;
                                    case 'ro':
                                    $apcAction->forward_to_ro = $request->forward_to;
                                    break;
                            }
                        }

                        if($request->sent_through_rk == 1){
                             $apcAction->sent_through_rk = 1;
                             $apcAction->sent_through_rk_id = $cmp->added_by;
                        }

                        $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
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
     public function forwardComplaintbyjs(Request $request,$complainId){
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

            //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_js = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){

                         $apcAction = new ComplaintAction();
                            $apcAction->target_date = $request->target_date;
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
                        $apcAction->forward_by_js = $userId;
                        // $apcAction->approved_rejected_by_ro_aro = $userId;

                        if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                            if ($roleFwd === 'lok-ayukt') {
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            } else if($roleFwd === 'up-lok-ayukt') {
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }else{
                                 $apcAction->forward_to_ps = $request->forward_to;
                            }

                        } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                 case 'ds':
                                    $apcAction->forward_to_ds = $request->forward_to;
                                    break;
                                case 'js':
                                    $apcAction->forward_to_js = $request->forward_to;
                                    break;
                                case 'us':
                                    $apcAction->forward_to_us = $request->forward_to;
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
                               
                                    case 'ro-aro':
                                    $apcAction->forward_to_ro_aro = $request->forward_to;
                                    break;
                                    case 'ro':
                                    $apcAction->forward_to_ro = $request->forward_to;
                                    break;
                            }
                        }

                        if($request->sent_through_rk == 1){
                             $apcAction->sent_through_rk = 1;
                             $apcAction->sent_through_rk_id = $cmp->added_by;
                        }

                        $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
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
     public function forwardComplaintbyus(Request $request,$complainId){
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

            //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_us = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){

                         $apcAction = new ComplaintAction();
                            $apcAction->target_date = $request->target_date;
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
                        $apcAction->forward_by_us = $userId;
                        // $apcAction->approved_rejected_by_ro_aro = $userId;

                        if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                            if ($roleFwd === 'lok-ayukt') {
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            } else if($roleFwd === 'up-lok-ayukt') {
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }else{
                                 $apcAction->forward_to_ps = $request->forward_to;
                            }

                        } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                 case 'ds':
                                    $apcAction->forward_to_ds = $request->forward_to;
                                    break;
                                case 'js':
                                    $apcAction->forward_to_js = $request->forward_to;
                                    break;
                                case 'us':
                                    $apcAction->forward_to_us = $request->forward_to;
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
                               
                                    case 'ro-aro':
                                    $apcAction->forward_to_ro_aro = $request->forward_to;
                                    break;
                                    case 'ro':
                                    $apcAction->forward_to_ro = $request->forward_to;
                                    break;
                            }
                        }

                        if($request->sent_through_rk == 1){
                             $apcAction->sent_through_rk = 1;
                             $apcAction->sent_through_rk_id = $cmp->added_by;
                        }

                        $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
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
     public function forwardComplaintbyRo(Request $request,$complainId){
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

            //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_ro = 1;
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){

                         $apcAction = new ComplaintAction();
                            $apcAction->target_date = $request->target_date;
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
                        $apcAction->forward_by_ro = $userId;
                        // $apcAction->approved_rejected_by_ro_aro = $userId;

                        if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                            if ($roleFwd === 'lok-ayukt') {
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            } else if($roleFwd === 'up-lok-ayukt') {
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }else{
                                 $apcAction->forward_to_ps = $request->forward_to;
                                 $cmp->approved_rejected_by_ps = NULL;
                                 $cmp->save();
                            }

                        } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                 case 'ds':
                                    $apcAction->forward_to_ds = $request->forward_to;
                                    break;
                                case 'js':
                                    $apcAction->forward_to_js = $request->forward_to;
                                    break;
                                case 'us':
                                    $apcAction->forward_to_us = $request->forward_to;
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
                               
                                    case 'ro-aro':
                                    $apcAction->forward_to_ro_aro = $request->forward_to;
                                    break;
                                    case 'ro':
                                    $apcAction->forward_to_ro = $request->forward_to;
                                    break;
                            }
                        }

                        if($request->sent_through_rk == 1){
                             $apcAction->sent_through_rk = 1;
                             $apcAction->sent_through_rk_id = $cmp->added_by;
                        }

                        $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
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
     public function forwardComplaintbySec(Request $request,$complainId){
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

            //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_sec= 1;
                
                // $cmp->forward_to_d_a = $request->forward_to_d_a;
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){

                        //  $apcAction = new ComplaintAction();
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
                        $apcAction->forward_by_sec = $userId;
                         $apcAction->target_date = $request->target_date;
                        // $apcAction->approved_rejected_by_ro_aro = $userId;

                        if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','dispatch'])) {

                            if ($roleFwd === 'lok-ayukt') {
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            }elseif($roleFwd === 'dispatch'){
                                 $apcAction->forward_to_dispatch = $request->forward_to;

                            } else {
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }

                        } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                case 'ds':
                                    $apcAction->forward_to_ds = $request->forward_to;
                                    break;
                                case 'js':
                                    $apcAction->forward_to_js = $request->forward_to;
                                    break;
                                case 'us':
                                    $apcAction->forward_to_us = $request->forward_to;
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
                               
                                    case 'ro-aro':
                                    $apcAction->forward_to_ro_aro = $request->forward_to;
                                    break;
                            }
                        }

                        if($request->sent_through_rk == 1){
                             $apcAction->sent_through_rk = 1;
                             $apcAction->sent_through_rk_id = $cmp->added_by;
                        }

                        $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
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
     public function forwardComplaintbyCio(Request $request,$complainId){
        //    dd($request->all());
        // $user = Auth::user()->id;
        // dd($complainId);

        $userRole = User::with('role')->where('id',$request->forward_to)->get();

        
            $roleFwd = $userRole[0]->role->name ?? null;
        // dd($roleFwd);
        
          $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
            $subroleFwd = '';
            
            $subroleFwd = $user[0]->subrole->name ?? '';

       
 

        $userId = Auth::user()->id;
   

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

            //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            // $roleFwd = $userRole[0]->role->name;

              
            $cmp =  Complaint::findOrFail($complainId);
            // dd($cmp);

               if($cmp){
                $cmp->approved_rejected_by_cio_io= 1;
                $cmp->status = "Final Report";
               
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){

                    

                        $apcAction = new ComplaintAction();
                        $apcAction->complaint_id = $complainId;
                        $apcAction->forward_by_cio_io = $userId;
                        $apcAction->target_date = $request->target_date;;
                        // $apcAction->approved_rejected_by_ro_aro = $userId;

                        if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                            if ($roleFwd === 'lok-ayukt') {
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            } elseif($roleFwd === 'ps'){
                                 $apcAction->forward_to_ps = $request->forward_to;
                                 $cmp->approved_rejected_by_ps = 0;
                                 $cmp->save();
                            }else {
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }

                        } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                               

                                case 'sec':
                                    $apcAction->forward_to_sec = $request->forward_to;
                                    break;

                                case 'cio-io':
                                    $apcAction->forward_to_cio_io = $request->forward_to;
                                    break;

                              
                            }
                        }

                        if($request->sent_through_rk == 1){
                             $apcAction->sent_through_rk = 1;
                             $apcAction->sent_through_rk_id = $cmp->added_by;
                        }

                        $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
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
     public function forwardComplaintbyio(Request $request,$complainId){
        //    dd($request->all());
        // $user = Auth::user()->id;
        // dd($complainId);

        $userRole = User::with('role')->where('id',$request->forward_to)->get();

        
            $roleFwd = $userRole[0]->role->name ?? null;
        // dd($roleFwd);
        
          $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
            $subroleFwd = '';
            
            $subroleFwd = $user[0]->subrole->name ?? '';

       
 

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
                $cmp->approved_rejected_by_io= 1;
                $cmp->status = "Final Report";
                // $remark ='Remark By Deputy Secretary / Joint Secretary';
                // $remark.='\n';
                // $remark.= $request->remarks;
                // $remark.='\n';
                // $cmp->remark = $remark;
                
                    if($cmp->save()){

                    

                        $apcAction = new ComplaintAction();
                        $apcAction->complaint_id = $complainId;
                        $apcAction->forward_by_io = $userId;
                        // $apcAction->approved_rejected_by_ro_aro = $userId;

                        if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                            if ($roleFwd === 'lok-ayukt') {
                                $apcAction->forward_to_lokayukt = $request->forward_to;
                            } elseif($roleFwd === 'ps'){
                                 $apcAction->forward_to_ps = $request->forward_to;
                            }else {
                                $apcAction->forward_to_uplokayukt = $request->forward_to;
                            }

                        } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                               

                                case 'sec':
                                    $apcAction->forward_to_sec = $request->forward_to;
                                    break;

                                case 'cio-io':
                                    $apcAction->forward_to_cio_io = $request->forward_to;
                                    break;
                              
                                    case 'io':
                                    $apcAction->forward_to_io = $request->forward_to;
                                    break;

                              
                            }
                        }

                        if($request->sent_through_rk == 1){
                             $apcAction->sent_through_rk = 1;
                             $apcAction->sent_through_rk_id = $cmp->added_by;
                        }

                        $apcAction->status = 'Forwarded';
                        // $apcAction->type = '1';
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
          $user = Auth::user()->id;
       $userSubrole = Auth::user()->subrole->name; 
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                ->leftJoin('complaint_actions as rep', 'cm.id', '=', 'rep.complaint_id')
                 ->leftJoin('complainants as cmlan', function ($join) {
                    $join->on('cm.id', '=', 'cmlan.complaint_id')
                        ->where('cmlan.is_main', 1);
                })
                    ->leftJoin('respondents as resp', function ($join) {
                    $join->on('cm.id', '=', 'resp.complaint_id')
                        ->where('resp.is_main', 1);
                })
                ->leftJoin('district_master as dd1', 'cmlan.permanent_district', '=', 'dd1.district_code')
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

                
    switch ($userSubrole) {
        case "so-us":
            $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_rk', 1)
                  ->where('approved_rejected_by_so_us', 1);
               
                //   ->where('approved_by_ro', 1);
            // $complainDetails->where('complaints.added_by', $user);
            break;

        case "ds-js":
          $complainDetails->where('form_status', 1)
                  ->where('approved_rejected_by_rk', 1)
                  ->where('approved_rejected_by_so_us', 0)
                //   ->whereOr('approved_rejected_by_so_us', 1)
                  ->where('approved_rejected_by_ds_js', 1);
                //   ->where('forward_so', 1)
                //   ->whereOr('forward_to_uplokayukt', 1); 
            break;

        case "sec":
           $complainDetails->where('rep.status', 'Forwarded')
                                // ->whereNotNull('rep.forward_to_sec')
                                // ->where('approved_rejected_by_rk', 1)
                                 ->where('approved_rejected_by_sec', 1)
                                ->where('cm.approved_rejected_by_sec', 1)
                                 ->where('rep.forward_by_sec',$user);
                //    ->where('forward_to_lokayukt', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;
       case "ro-aro":
          $complainDetails
          ->where('approved_rejected_by_ro_aro', 1)
          ->where('rep.status','Forwarded')
          ->where('rep.forward_by_ro_aro', $user);
                //   ->where('approved_rejected_by_rk', 1)
                //   ->where('cm.approved_rejected_by_ro_aro', 1)
           
            break;

        case "cio-io":
           $complainDetails->where('rep.status', 'Forwarded')
                  ->where('approved_rejected_by_rk', 1)
                  ->where('approved_rejected_by_cio_io', 1)
                  ->where('rep.forward_by_cio_io', $user); 
               
            break;

             case "ro":
          $complainDetails
          ->where('approved_rejected_by_ro', 1)
          ->where('rep.status','Forwarded')
          ->where('rep.forward_by_ro', $user);
                //   ->where('approved_rejected_by_rk', 1)
                //   ->where('cm.approved_rejected_by_ro_aro', 1)
           
            break;

        case "io":
           $complainDetails->where('rep.status', 'Forwarded')
                  ->where('approved_rejected_by_rk', 1)
                  ->where('approved_rejected_by_io', 1)
                  ->where('rep.forward_by_io', $user); 
               
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

     public function getUploadDoc(Request $request,$id){
        if($request->isMethod('get')){
            $complain = ComplainDocuments::where('complain_id',$id)->where('type','<>','Draft Letter')->get();

           return response()->json([
                    'status' => true,
                    'message' => 'Document Fetch successfully.',
                    'data' => $complain
                ], 200);
        }
       
    }
     public function getUploadDocAndDraft(Request $request,$id){
        if($request->isMethod('get')){
            $complain = ComplainDocuments::where('complain_id',$id)->get();

           return response()->json([
                    'status' => true,
                    'message' => 'Document Fetch successfully.',
                    'data' => $complain
                ], 200);
        }
       
    }

      public function getDraftLetter(Request $request,$id){
        if($request->isMethod('get')){
            $complain = ComplainDocuments::where('complain_id',$id)->where('type','Draft Letter')->get();

           return response()->json([
                    'status' => true,
                    'message' => 'Draft Fetch successfully.',
                    'data' => $complain
                ], 200);
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
    // $usersByRole = User::with('role')
    //  ->whereNotNull('role_id')
    //     ->get()
    //     ->groupBy(fn ($user) => $user->role->name);
    //     if(!empty($usersByRole['up-lok-ayukt'])){

    //         return response()->json($usersByRole['up-lok-ayukt']);
    //     }else{

    //         return response()->json(["message"=>"Data Not Found"]);
    //     }

        
     $usersByRole = User::with('role')
            ->whereNotNull('role_id')
            ->get()
            ->groupBy(fn ($user) => $user->role->name);

        // lok-ayukt + ps users merge
        $users = collect()
            ->merge($usersByRole['up-lok-ayukt'] ?? collect())
            ->merge($usersByRole['dispatch'] ?? collect())
            ->merge($usersByRole['ps'] ?? collect());

        if ($users->isNotEmpty()) {
            return response()->json($users->values());
        }

        return response()->json([
            "message" => "Data Not Found"
        ]);
       
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


    public function addNotesEmployee(Request $request)
    {
       
        // $user = $request->user()->id;
        $added_by = Auth::user()->id;
    
        $validation = Validator::make($request->all(), [
            
            'employee_file_id' => 'required|numeric',
            // 'type' => 'required|string',
            // 'title' => 'required|string',
            'description' => 'required|string',
            // 'd_id' => 'required',
            // 'forward_by' => 'required',
            // 'forward_to' => 'required',
            // 'range_from' => 'required',
            // 'range_two' => 'required',
            
        ], [
            'employee_file_id.required' => 'Complaint Id is required.',
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

        if(isset($request->employee_file_id)){    
                $compDoc = new EmployeeComplainNotes();
                $compDoc->employee_file_id = $request->employee_file_id;
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

     public function createDraft(Request $request)
    {
        // dd($request->file);
       
        // $user = $request->user()->id;
        $added_by = Auth::user()->id;
    
        $validation = Validator::make($request->all(), [
            
            'complaint_id' => 'required|numeric',
            'title' => 'required|string',
            'sent_to_person_info' => 'required|string',
            'draft_note' => 'required|string',
             'file' =>  'required|file|mimes:jpg,jpeg,png,pdf',
            
        ], [
            'complaint_id.required' => 'Complaint Id is required.',
            'title.required' => 'Title is required',
            'sent_to_person_info.required' => 'From Draft Info is required',
            'draft_note.required' => 'Description is required',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        if(isset($request->complaint_id)){    
                $compDoc = new Drafts();
                $compDoc->complaint_id = $request->complaint_id;
                $compDoc->draft_note = $request->draft_note;
                // $file = 'doc_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
                // $filePath = $request->file('file')->storeAs('Document', $file, 'public');
                // $compDoc->file = $file;
                
                $compDoc->status = '1';

             
                $compDoc->save();
                $compDocument = new ComplainDocuments(); 
                $compDocument->complain_id = $request->complaint_id;
                $compDocument->added_by = $added_by;
                $compDocument->title = $request->title;
                $compDocument->type = "Draft Letter";
                // $compDocument->title = $request->title;     
                $file = 'doc_' . uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
                $filePath = $request->file('file')->storeAs('Document', $file, 'public');
                $compDocument->file = $file;
                
                $compDocument->save();
              
                return response()->json([
                    'status' => true,
                    'message' => 'Draft Added successfully.',
                    'data' => $compDoc
                ], 201);
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
    public function editNotes(Request $request,$id){
        if($request->isMethod('post')){
            // $Notes = ComplaintNotes::where('complaint_id',$id)
            // ->get();

            $Notes = ComplaintNotes::find($id);
            

   
           return response()->json([
                    'status' => true,
                    'message' => 'Notes Fetch successfully.',
                    'data' => $Notes
                ], 200);
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

    public function assignToRoAro(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        $userName = Auth::user()->name;
       
        if(isset($complainId) && $request->isMethod('post')){

             $cmp =  Complaint::findOrFail($complainId);
             
            if($cmp){
                $cmp->assign_to_ro_aro = $user; 
                $cmp->save(); 
            }
          
             return response()->json([
                    'status' => true,
                    'message' => "Assign".' '.$userName.' '."successfully",
                    'data' => $cmp
                ], 200);
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }
    public function assignToRo(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        $userName = Auth::user()->name;
       
        if(isset($complainId) && $request->isMethod('post')){

             $cmp =  Complaint::findOrFail($complainId);
             
            if($cmp){
                $cmp->assign_to_ro = $user; 
                $cmp->save(); 
            }
          
             return response()->json([
                    'status' => true,
                    'message' => "Assign".' '.$userName.' '."successfully",
                    'data' => $cmp
                ], 200);
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

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
     public function uploadDraftLetter(Request $request)
    {
        // dd($request->complain_id);
        // $user = $request->user()->id;
        $added_by = Auth::user()->id;
    
        $validation = Validator::make($request->all(), [
            
            'complain_id' => 'required|numeric',
            'type' => 'required|string',
            'title' => 'required|string',
            'file' =>  'required|file|mimes:jpg,jpeg,png,pdf|max:5048',
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
     public function editDraftLetter(Request $request,$id)
    {
        // dd($request->complain_id);
        // $user = $request->user()->id;
        $added_by = Auth::user()->id;
    
 

        if(isset($id)){    
                $compDoc =ComplainDocuments::find($id);
             
                return response()->json([
                    'status' => true,
                    'message' => 'Document Update successfully.',
                    'data' => $compDoc
                ], 200);
        }

    }
     public function updateDraftLetter(Request $request,$id)
    {
        // dd($request->complain_id);
        // $user = $request->user()->id;
        $added_by = Auth::user()->id;
    
        $validation = Validator::make($request->all(), [
            
            'complain_id' => 'required|numeric',
            'type' => 'required|string',
            'title' => 'required|string',
            'file' =>  'required|file|mimes:jpg,jpeg,png,pdf|max:5048',
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

        if(isset($id)){    
                $compDoc =ComplainDocuments::find($id);
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
                    'message' => 'Document Update successfully.',
                    'data' => $compDoc
                ], 201);
        }

    }

}
