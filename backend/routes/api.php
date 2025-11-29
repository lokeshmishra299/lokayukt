<?php

use App\Http\Controllers\api\Admin\AdminDashboardController;
use App\Http\Controllers\api\Admin\AdminReportController;
// use App\Http\Controllers\api\Admin\AdminDashboardController;
// use App\Http\Controllers\api\Admin\OperatorReportController;

use App\Http\Controllers\api\LokAyukt\LokAyuktCommonController;
use App\Http\Controllers\api\LokAyukt\LokAyuktComplaintsController;
use App\Http\Controllers\api\LokAyukt\LokAyuktReportController;
use App\Http\Controllers\api\UpLokAyukt\UpLokAyuktComplaintsController;
use App\Http\Controllers\api\UpLokAyukt\UpLokAyuktReportController;
use App\Http\Controllers\api\Operator\OperatorDashboardController;
use App\Http\Controllers\api\Operator\OperatorReportController;
// use App\Http\Controllers\api\Admin\OperatorReportController;
use App\Http\Controllers\api\CommonController;
use App\Http\Controllers\api\ComplaintsController;
use App\Http\Controllers\api\LoginController;
use App\Http\Controllers\api\Operator\OperatorCommonController;
use App\Http\Controllers\api\Operator\OperatorComplaintsController;
// use App\Http\Controllers\api\OperatorCommonController;
// use App\Http\Controllers\api\OperatorComplaintsController;
use App\Http\Controllers\api\Supervisor\LokAyuktDashboardController;
use App\Http\Controllers\api\Supervisor\SupervisorCommonController;
use App\Http\Controllers\api\Supervisor\SupervisorComplaintsController;
use App\Http\Controllers\api\Supervisor\SupervisorDashboardController;
use App\Http\Controllers\api\Supervisor\SupervisorReportController;
use App\Http\Controllers\api\UpLokAyukt\UpLokAyuktDashboardController;
use App\Http\Controllers\api\UpLokAyukt\UpLokAyuktCommonController;
use App\Http\Controllers\api\UserManagement;
use Illuminate\Support\Facades\Route;
// use App\Http\Middleware\AuthMiddleware;

Route::post('/login',[LoginController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout', [LoginController::class, 'logout']);
   
     
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        
        Route::get('/get-roles', [CommonController::class, 'getRoles']);
        Route::get('/get-sub-roles/{roleId}', [CommonController::class, 'getSubroles']);

        // Route::prefix('admin')->group(function () {
        
        Route::get('/all-district',[CommonController::class,'fetch_district']);

        Route::post('/complaints',[ComplaintsController::class,'complaint_register']);
        Route::post('/all-complaints',[ComplaintsController::class,'allComplainsDashboard']);
        Route::post('/all-pending-complaints',[ComplaintsController::class,'allComplainsDashboardPending']);
        Route::post('/all-approved-complaints',[ComplaintsController::class,'allComplainsDashboardApproved']);
        Route::post('/all-rejected-complaints',[ComplaintsController::class,'allComplainsDashboardRejected']);

        Route::get('/check-duplicate',[ComplaintsController::class,'checkDuplicate']);

        Route::get('/progress-register',[ComplaintsController::class,'progress_report']);

        //USER-MANAGEMENT

        Route::post('/add-user',[UserManagement::class,'user_management']);
        Route::get('/users',[UserManagement::class,'index']);
        Route::get('/edit-users/{id}',[UserManagement::class,'editUser']);
        Route::post('/update-users/{id}',[UserManagement::class,'updateUser']);
        Route::post('/delete-users/{id}',[UserManagement::class,'deleteUser']);
        Route::post('/change-status/{id}',[UserManagement::class,'changeStatus']);

        /**
         * District
         */
        Route::get('/district',[CommonController::class,'fetch_district']);
        Route::post('/add-district',[CommonController::class,'addDistrict']);
        Route::post('/edit-district/{id}',[CommonController::class,'editDistrict']);
        Route::post('/delete-district/{id}',[CommonController::class,'removeDistrict']);
        /**
         * Designation
         */
        Route::get('/department',[CommonController::class,'fetch_department']);
        Route::post('/add-department',[CommonController::class,'addDepartment']);
        Route::post('/edit-department/{id}',[CommonController::class,'editDepartment']);
        Route::post('/delete-department/{id}',[CommonController::class,'removeDepartment']);


        /**
         * Designation
         */
        Route::get('/designation',[CommonController::class,'fetch_designation']);
        Route::post('/add-designation',[CommonController::class,'addDesignation']);
        Route::post('/edit-designation/{id}',[CommonController::class,'editDesignation']);
        Route::post('/delete-designation/{id}',[CommonController::class,'removeDesignation']);

        /**
         * Subject
         */
        Route::get('/subjects',[CommonController::class,'fetch_subject']);
        Route::post('/add-subject',[CommonController::class,'addSubject']);
        Route::post('/edit-subject/{id}',[CommonController::class,'editSubject']);
        Route::post('/delete-subject/{id}',[CommonController::class,'removeSubject']);

        /**
         * Complain Type
         */
        Route::get('/complainstype',[CommonController::class,'fetch_complainstype']);
        Route::post('/add-complainstype',[CommonController::class,'addComplainType']);
        Route::post('/edit-complainstype/{id}',[CommonController::class,'editComplainType']);
        Route::post('/delete-complainstype/{id}',[CommonController::class,'removeComplainstype']);

        /**
         * Rejection Reason
         */
        Route::get('/rejections',[CommonController::class,'fetch_rejection']);
        Route::post('/add-rejection',[CommonController::class,'addRejection']);
        Route::post('/edit-rejection/{id}',[CommonController::class,'editRejection']);
        Route::post('/delete-rejection/{id}',[CommonController::class,'removeRejection']);



        Route::get('/complain-report',[AdminReportController::class,'complainReports']);
        Route::get('/all-complains',[AdminReportController::class,'allComplains']);
         Route::get('/view-complaint/{id}',[AdminReportController::class,'viewComplaint']);
         Route::get('/getFilePreview/{id}',[AdminReportController::class,'getFilePreview']);
        Route::get('/detail-by-complaintype',[AdminReportController::class,'complainComplaintypeWise']);




        Route::get('/district-wise-complaint',[AdminReportController::class,'complainDistrictWise']);
        Route::get('/department-wise-complaint',[AdminReportController::class,'complainDepartmentWise']);
        Route::get('/montly-trends',[AdminReportController::class,'getMontlyTrends']);
        Route::get('/compliance-report',[AdminReportController::class,'complianceReport']);
        
        // Daishboard
        Route::get('/dashboard/{date}',[AdminDashboardController::class,'index']);
        Route::get('/montly-complaint',[AdminDashboardController::class,'getDistrictGraph']);
        Route::get('/getWeeklyGraph',[AdminDashboardController::class,'getWeeklyGraph']);
        Route::get('/district-wise-company-type',[AdminDashboardController::class,'getdistrictWiseCompanyTypeGraph']);
        Route::get('/role-wise-reports',[AdminDashboardController::class,'getRolewisData']);

        Route::get('/status-distribution',[AdminDashboardController::class,'gestatusDistribution']);
        Route::get('/get-compliance',[AdminDashboardController::class,'complianceDashboard']);
        Route::get('/get-all-active-users',[AdminDashboardController::class,'allActiveUsers']);
        Route::get('/get-all-department-count',[AdminDashboardController::class,'allDepartmentCount']);
        Route::get('/get-performance-dashboard',[AdminDashboardController::class,'performanceDashboad']);
      
      
         // });

    });

  /**
   * Operator
   */  

   Route::middleware('role:operator:entry-operator|review-operator')->prefix('operator')->group(function () {
        
        // Route::prefix('admin')->group(function () {
        
        Route::get('/all-district',[OperatorCommonController::class,'fetch_district']);
        Route::get('/department',[OperatorCommonController::class,'fetch_department']);
        Route::get('/designation',[OperatorCommonController::class,'fetch_designation']);
        Route::get('/subjects',[OperatorCommonController::class,'fetch_subject']);
        Route::get('/rejections',[OperatorCommonController::class,'fetch_rejection']);
        Route::get('/complainstype',[OperatorCommonController::class,'fetch_complainstype']);
        Route::post('/add-complaint',[OperatorComplaintsController::class,'addComplaint']);
        Route::get('/all-complaints',[OperatorComplaintsController::class,'allComplainsDashboard']);
        Route::get('/all-draft',[OperatorComplaintsController::class,'allDraft']);
        Route::get('/all-pending-complaints',[OperatorComplaintsController::class,'allComplainspending']);
        Route::get('/all-approved-complaints',[OperatorComplaintsController::class,'allComplainsapproved']);
        // Route::post('/all-rejected-complaints',[OperatorComplaintsController::class,'allComplainsDashboardRejected']);
        Route::get('/view-complaint/{id}',[OperatorReportController::class,'viewComplaint']);
        Route::get('/view-draft/{id}',[OperatorReportController::class,'viewDraft']);
        Route::get('/get-file-preview/{id}',[OperatorReportController::class,'getFilePreview']);
        Route::get('/edit-complaint/{id}',[OperatorComplaintsController::class,'editComplain']);
        Route::post('/update-complaint/{id}',[OperatorComplaintsController::class,'updateComplain']);
        Route::get('/edit-draft/{id}',[OperatorComplaintsController::class,'editDraft']);
        Route::post('/update-draft/{id}',[OperatorComplaintsController::class,'updateDraft']);
        Route::post('/check-duplicate',[OperatorComplaintsController::class,'checkDuplicate']);
        // Route::post('/check-duplicate-store',[OperatorComplaintsController::class,'checkduplicateStoreComplain']);
        Route::post('/approved-by-ro/{complainId}',[OperatorComplaintsController::class,'approvedByRo']);
        Route::get('get-section-officers',[OperatorComplaintsController::class,'getSectionOfficers']);

        Route::get('/progress-register',[OperatorReportController::class,'progress_report']);
        Route::get('/current-report',[OperatorReportController::class,'current_report']);
        Route::get('/analytic-report',[OperatorReportController::class,'analytics']);
        Route::get('/complain-report',[OperatorReportController::class,'complainReports']);
        Route::get('/all-complains',[OperatorReportController::class,'allComplains']);

        Route::get('/detail-by-complaintype',[OperatorReportController::class,'complainComplaintypeWise']);
        Route::get('/district-wise-complaint',[OperatorReportController::class,'complainDistrictWise']);
        Route::get('/department-wise-complaint',[OperatorReportController::class,'complainDepartmentWise']);
        Route::get('/montly-trends',[OperatorReportController::class,'getMontlyTrends']);
        Route::get('/compliance-report',[OperatorReportController::class,'complianceReport']);

        // // Daishboard
        Route::get('/dashboard/{date}',[OperatorDashboardController::class,'index']);
        Route::get('/montly-complaint',[OperatorDashboardController::class,'getDistrictGraph']);
        Route::get('/district-wise-company-type',[OperatorDashboardController::class,'getdistrictWiseCompanyTypeGraph']);
        Route::get('/status-distribution',[OperatorDashboardController::class,'gestatusDistribution']);
        Route::get('/status-distribution',action: [OperatorDashboardController::class,'gestatusDistribution']);

    });

    Route::middleware('role:supervisor:so-us|ds-js|sec|cio-io|dea-assis')->prefix('supervisor')->group(function () {
        
        Route::get('/all-district',[SupervisorCommonController::class,'fetch_district']);
        Route::get('/all-complaints',[SupervisorComplaintsController::class,'allComplains']);
        Route::get('/all-pending-complaints',[SupervisorComplaintsController::class,'allComplainspending']);
        Route::get('/all-approved-complaints',[SupervisorComplaintsController::class,'allComplainsapproved']);
        Route::get('/view-complaint/{id}',[SupervisorComplaintsController::class,'viewComplaint']);
        Route::post('/forward-by-so/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbySO']);
        Route::post('/forward-by-ds-js/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbyds']);
        Route::post('/forward-by-da/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbyda']);
        Route::post('/forward-by-lokayukt/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbylokayukt']);
        Route::post('/forward-report-by-so/{complainId}',[SupervisorReportController::class,'forwardReporttbySo']);
        Route::post('/forward-report-by-ds/{complainId}',[SupervisorReportController::class,'forwardReporttbyds']);
        Route::post('/forward-report-by-sec/{complainId}',[SupervisorReportController::class,'forwardReporttbysec']);
        Route::post('/forward-report-by-cio/{complainId}',[SupervisorReportController::class,'forwardReporttbycio']);
        Route::post('/forward-report-by-da/{complainId}',[SupervisorReportController::class,'forwardReporttbyda']);
        /**
         * Forward Report By Subroles
         */
        Route::post('/forward-report-by-sec{complainId}',[SupervisorReportController::class,'forwardReporttbysec']);
        Route::post('/forward-report-by-cio/{complainId}',[SupervisorReportController::class,'forwardReporttbycio']);
        Route::post('/forward-report-by-da/{complainId}',[SupervisorReportController::class,'forwardReporttbyda']);
       
        Route::get('/get-lokayukt',[SupervisorComplaintsController::class,'getLokayuktUsers']);
        Route::get('/get-uplokayukt',[SupervisorComplaintsController::class,'getUpLokayuktUsers']);
        Route::get('/get-dealing-assistant',[SupervisorComplaintsController::class,'getDealingAssistantUsers']);
        Route::get('/progress-register',[SupervisorReportController::class,'progress_report']);
        Route::get('/complain-report',[SupervisorReportController::class,'complainReports']);
        Route::get('/current-report',[SupervisorReportController::class,'current_report']);
        Route::get('/analytic-report',[SupervisorReportController::class,'analytics']);
        // Route::get('/detail-by-complaintype',[SupervisorReportController::class,'complainComplaintypeWise']);
         Route::get('/all-complains',[SupervisorReportController::class,'allComplains']);
        Route::get('/district-wise-complaint',[SupervisorReportController::class,'complainDistrictWise']);
        Route::get('/department-wise-complaint',[SupervisorReportController::class,'complainDepartmentWise']);
        Route::get('/montly-trends',[SupervisorReportController::class,'getMontlyTrends']);
        Route::get('/compliance-report',[SupervisorReportController::class,'complianceReport']);

        // // Daishboard
        Route::get('/dashboard/{date}',[SupervisorDashboardController::class,'index']);
        Route::get('/montly-complaint',[SupervisorDashboardController::class,'getDistrictGraph']);
        Route::get('/district-wise-company-type',[SupervisorDashboardController::class,'getdistrictWiseCompanyTypeGraph']);
        Route::get('/status-distribution',[SupervisorDashboardController::class,'gestatusDistribution']);
        // Route::get('/status-distribution',action: [SupervisorDashboardController::class,'gestatusDistribution']);
        
    });

    Route::middleware('role:lok-ayukt')->prefix('lokayukt')->group(function () {
        
        Route::get('/all-district',[LokAyuktCommonController::class,'fetch_district']);
        Route::get('/all-complaints',[LokAyuktComplaintsController::class,'allComplains']);
        Route::get('/all-pending-complaints',[LokAyuktComplaintsController::class,'allComplainspending']);
        Route::get('/all-approved-complaints',[LokAyuktComplaintsController::class,'allComplainsapproved']);
        Route::get('/view-complaint/{id}',[LokAyuktComplaintsController::class,'viewComplaint']);
        Route::post('/forward-by-so/{complainId}',[LokAyuktComplaintsController::class,'forwardComplaintbySO']);
        Route::post('/dispose-complain/{complainId}',[LokAyuktComplaintsController::class,'disposeComplaints']);
        Route::get('/get-users',[LokAyuktComplaintsController::class,'getSubROleUsers']);
        // Route::post('/forward-by-ds-js/{complainId}',[LokAyuktComplaintsController::class,'forwardComplaintbyds']);
        // Route::post('/forward-by-da/{complainId}',[LokAyuktComplaintsController::class,'forwardComplaintbyda']);
        Route::post('/request-report/{complainId}',[LokAyuktReportController::class,'requestReport']);
        Route::get('/request-list/{complainId}',[LokAyuktReportController::class,'requestReportList']);
                Route::get('/request-list-cio/{complainId}',[LokAyuktReportController::class,'requestinvestigationReport']);
        /*
         * Forward Report By Subroles
         */
        Route::post('/forward-report-by-sec{complainId}',[LokAyuktReportController::class,'forwardReporttbysec']);
        Route::post('/forward-report-by-cio/{complainId}',[LokAyuktReportController::class,'forwardReporttbycio']);
        Route::post('/forward-report-by-da/{complainId}',[LokAyuktReportController::class,'forwardReporttbyda']);
       
        Route::get('/get-lokayukt',[LokAyuktComplaintsController::class,'getLokayuktUsers']);
        Route::get('/get-uplokayukt',[LokAyuktComplaintsController::class,'getUpLokayuktUsers']);
        Route::get('/get-dealing-assistant',[LokAyuktComplaintsController::class,'getDealingAssistantUsers']);
        Route::get('/progress-register',[LokAyuktReportController::class,'progress_report']);
        Route::get('/complain-report',[LokAyuktReportController::class,'complainReports']);
        Route::get('/current-report',[LokAyuktReportController::class,'current_report']);
        Route::get('/analytic-report',[LokAyuktReportController::class,'analytics']);
        // Route::get('/detail-by-complaintype',[LokAyuktReportController::class,'complainComplaintypeWise']);
         Route::get('/all-complains',[LokAyuktReportController::class,'allComplains']);
        Route::get('/district-wise-complaint',[LokAyuktReportController::class,'complainDistrictWise']);
        Route::get('/department-wise-complaint',[LokAyuktReportController::class,'complainDepartmentWise']);
        Route::get('/montly-trends',[LokAyuktReportController::class,'getMontlyTrends']);
        Route::get('/compliance-report',[LokAyuktReportController::class,'complianceReport']);

        // // Daishboard
        Route::get('/dashboard/{date}',[LokAyuktDashboardController::class,'index']);
        Route::get('/montly-complaint',[LokAyuktDashboardController::class,'getDistrictGraph']);
        Route::get('/district-wise-company-type',[LokAyuktDashboardController::class,'getdistrictWiseCompanyTypeGraph']);
        Route::get('/status-distribution',[LokAyuktDashboardController::class,'gestatusDistribution']);
        // Route::get('/status-distribution',action: [SupervisorDashboardController::class,'gestatusDistribution']);
    });

       Route::middleware('role:up-lok-ayukt')->prefix('uplokayukt')->group(function () {
        
        Route::get('/all-district',[UpLokAyuktCommonController::class,'fetch_district']);
        Route::get('/all-complaints',[UpLokAyuktComplaintsController::class,'allComplains']);
        Route::get('/all-pending-complaints',[UpLokAyuktComplaintsController::class,'allComplainspending']);
        Route::get('/all-approved-complaints',[UpLokAyuktComplaintsController::class,'allComplainsapproved']);
        Route::get('/view-complaint/{id}',[UpLokAyuktComplaintsController::class,'viewComplaint']);
        Route::post('/forward-by-so/{complainId}',[UpLokAyuktComplaintsController::class,'forwardComplaintbySO']);
         Route::post('/dispose-complain/{complainId}',[UpLokAyuktComplaintsController::class,'disposeComplaints']);
        Route::get('/get-users',[UpLokAyuktComplaintsController::class,'getSubROleUsers']);
        // Route::post('/forward-by-ds-js/{complainId}',[UpLokAyuktComplaintsController::class,'forwardComplaintbyds']);
        // Route::post('/forward-by-da/{complainId}',[UpLokAyuktComplaintsController::class,'forwardComplaintbyda']);
        Route::post('/request-report/{complainId}',[UpLokAyuktReportController::class,'requestReport']);
        Route::get('/request-list/{complainId}',[UpLokAyuktReportController::class,'requestReportList']);
        Route::get('/request-list-cio/{complainId}',[UpLokAyuktReportController::class,'requestinvestigationReport']);
        
        /*
         * Forward Report By Subroles
         */
        Route::post('/forward-report-by-sec{complainId}',[UpLokAyuktReportController::class,'forwardReporttbysec']);
        Route::post('/forward-report-by-cio/{complainId}',[UpLokAyuktReportController::class,'forwardReporttbycio']);
        Route::post('/forward-report-by-da/{complainId}',[UpLokAyuktReportController::class,'forwardReporttbyda']);
       
        Route::get('/get-lokayukt',[UpLokAyuktComplaintsController::class,'getLokayuktUsers']);
        Route::get('/get-uplokayukt',[UpLokAyuktComplaintsController::class,'getUpLokayuktUsers']);
        Route::get('/get-dealing-assistant',[UpLokAyuktComplaintsController::class,'getDealingAssistantUsers']);
        Route::get('/progress-register',[UpLokAyuktReportController::class,'progress_report']);
        Route::get('/complain-report',[UpLokAyuktReportController::class,'complainReports']);
        Route::get('/current-report',[UpLokAyuktReportController::class,'current_report']);
        Route::get('/analytic-report',[UpLokAyuktReportController::class,'analytics']);
        // Route::get('/detail-by-complaintype',[UpLokAyuktReportController::class,'complainComplaintypeWise']);
         Route::get('/all-complains',[UpLokAyuktReportController::class,'allComplains']);
        Route::get('/district-wise-complaint',[UpLokAyuktReportController::class,'complainDistrictWise']);
        Route::get('/department-wise-complaint',[UpLokAyuktReportController::class,'complainDepartmentWise']);
        Route::get('/montly-trends',[UpLokAyuktReportController::class,'getMontlyTrends']);
        Route::get('/compliance-report',[UpLokAyuktReportController::class,'complianceReport']);

        // // Daishboard
        Route::get('/dashboard/{date}',[UpLokAyuktDashboardController::class,'index']);
        Route::get('/montly-complaint',[UpLokAyuktDashboardController::class,'getDistrictGraph']);
        Route::get('/district-wise-company-type',[UpLokAyuktDashboardController::class,'getdistrictWiseCompanyTypeGraph']);
        Route::get('/status-distribution',[UpLokAyuktDashboardController::class,'gestatusDistribution']);
        // Route::get('/status-distribution',action: [SupervisorDashboardController::class,'gestatusDistribution']);
    });

    

});


