<?php

use App\Http\Controllers\api\Admin\AdminDashboardController;
use App\Http\Controllers\api\Admin\AdminReportController;
// use App\Http\Controllers\api\Admin\AdminDashboardController;
// use App\Http\Controllers\api\Admin\OperatorReportController;
use App\Http\Controllers\api\Employee\EmployeesController;

use App\Http\Controllers\api\LokAyukt\LokAyuktCommonController;
use App\Http\Controllers\api\LokAyukt\LokAyuktComplaintsController;
use App\Http\Controllers\api\LokAyukt\LokAyuktReportController;
use App\Http\Controllers\api\UpLokAyukt\UpLokAyuktComplaintsController;
use App\Http\Controllers\api\UpLokAyukt\UpLokAyuktReportController;
use App\Http\Controllers\api\Operator\OperatorDashboardController;
use App\Http\Controllers\api\Operator\OperatorReportController;
use App\Http\Controllers\api\PS\PSComplaintsController;
use App\Http\Controllers\api\PS\PSReportController;
use App\Http\Controllers\api\PS\PSCommonController;
use App\Http\Controllers\api\PS\PSDashboardController;
use App\Http\Controllers\api\CommonController;
use App\Http\Controllers\api\ComplaintsController;
use App\Http\Controllers\api\LoginController;
use App\Http\Controllers\api\Operator\OperatorCommonController;
use App\Http\Controllers\api\Operator\OperatorComplaintsController;
// use App\Http\Controllers\api\OperatorCommonController;
// use App\Http\Controllers\api\OperatorComplaintsController;
use App\Http\Controllers\api\LokAyukt\LokAyuktDashboardController;
use App\Http\Controllers\api\Supervisor\SupervisorCommonController;
use App\Http\Controllers\api\Supervisor\SupervisorComplaintsController;
use App\Http\Controllers\api\Supervisor\SupervisorDashboardController;
use App\Http\Controllers\api\Supervisor\SupervisorReportController;
use App\Http\Controllers\api\UpLokAyukt\UpLokAyuktDashboardController;
use App\Http\Controllers\api\UpLokAyukt\UpLokAyuktCommonController;
use App\Http\Controllers\api\Dispatch\DispatchComplaintsController;
use App\Http\Controllers\api\Dispatch\DispatchDashboardController;

use App\Http\Controllers\api\UserManagement;
use Illuminate\Support\Facades\Route;
// use App\Http\Middleware\AuthMiddleware;

Route::post('/login',[LoginController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout', [LoginController::class, 'logout']);
   
       
     
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        
        Route::get('/get-roles', [CommonController::class, 'getRoles']);
        Route::get('/get-sub-roles/{roleId}', [CommonController::class, 'getSubroles']);
        Route::get('/get-leave-details', [CommonController::class, 'fetchLeavesDetails']);
        Route::get('/get-leave-personal-details', [CommonController::class, 'fetchLeavesPersonalDetails']);

        Route::get('/get-roles-supervisor', [CommonController::class, 'getRolesSupervisors']);

        Route::post('/access-files-permission',[CommonController::class,'accessFilePermission']);



        // Route::prefix('admin')->group(function () {
        
        Route::get('/all-district',[CommonController::class,'fetch_district']);

        Route::post('/complaints',[ComplaintsController::class,'complaint_register']);
        Route::post('/all-complaints',[ComplaintsController::class,'allComplainsDashboard']);
        Route::post('/all-pending-complaints',[ComplaintsController::class,'allComplainsDashboardPending']);
        Route::post('/all-approved-complaints',[ComplaintsController::class,'allComplainsDashboardApproved']);
        Route::post('/all-rejected-complaints',[ComplaintsController::class,'allComplainsDashboardRejected']);

        Route::get('/check-duplicate',[ComplaintsController::class,'checkDuplicate']);

        Route::get('/progress-register',[ComplaintsController::class,'progress_report']);
        
        Route::get('/get-lokayukt-uplokayukt',[ComplaintsController::class,'getUsers']);
        //USER-MANAGEMENT

        Route::post('/add-user',[UserManagement::class,'user_management']);
        Route::get('/users',[UserManagement::class,'index']);
        Route::get('/edit-users/{id}',[UserManagement::class,'editUser']);
        Route::post('/update-users/{id}',[UserManagement::class,'updateUser']);
        Route::post('/delete-users/{id}',[UserManagement::class,'deleteUser']);
        Route::post('/change-status/{id}',[UserManagement::class,'changeStatus']);
       
        Route::post('/add-employee',[UserManagement::class,'employee_management']);
        Route::get('/employees',[UserManagement::class,'allEmployees']);
        Route::get('/edit-employee/{id}',[UserManagement::class,'editEmployee']);
        Route::post('/update-employee/{id}',[UserManagement::class,'updateEmployee']);
        Route::post('/delete-employee/{id}',[UserManagement::class,'deleteEmployee']);
        // Route::post('/change-status/{id}',[UserManagement::class,'changeStatus']);
       



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
        Route::get('/download-backup',[AdminReportController::class,'backupZip']);
        
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
      
         Route::get('/topics',[CommonController::class,'fetch_topics']);
        Route::post('/add-topic',[CommonController::class,'addTopic']);
        Route::post('/edit-topic/{id}',[CommonController::class,'editTopic']);
        Route::post('/delete-topic/{id}',[CommonController::class,'removeTopic']);
        
        Route::get('/filetypes',[CommonController::class,'fetch_fileType']);
        Route::post('/add-filetype',[CommonController::class,'addFileType']);
        Route::post('/edit-filetype/{id}',[CommonController::class,'editFileType']);
        Route::post('/delete-filetype/{id}',[CommonController::class,'removeFileType']);
      
        Route::get('/budgets',[CommonController::class,'fetch_budget']);
        Route::post('/add-budget',[CommonController::class,'addBudget']);
        Route::post('/edit-budget/{id}',[CommonController::class,'editBudget']);
        Route::post('/delete-budget/{id}',[CommonController::class,'removeBudget']);
        Route::get('/get-employee-files/{id}',[CommonController::class,'getEmployeeFiles']);
        Route::get('/get-file-pdf/{id}',[CommonController::class,'getFilePreview']);
        Route::get('/change-employee-status/{id}',[CommonController::class,'approveRejectedEmployee']);
      
         // });

    });

  /**
   * Operator
   */  

   Route::middleware('role:operator:record-keeper|review-operator')->prefix('operator')->group(function () {
        
        // Route::prefix('admin')->group(function () {
        Route::get('/all-files',[EmployeesController::class,'index']);
        Route::get('/all-files/{id}',[EmployeesController::class,'fileDetails']);

        Route::get('/all-personal-files',[EmployeesController::class,'viewPersonalFile']);

        Route::get('/topics',[EmployeesController::class,'fetch_topics']);
        Route::get('/filetypes',[EmployeesController::class,'fetch_fileType']);
        Route::post('/upload-file',[EmployeesController::class,'uploadFiles']);

        Route::post('/upload-private-file',[EmployeesController::class,'uploadPrivateFiles']);

        Route::get('/get-file-preview/{id}',[EmployeesController::class,'getFilePreview']);  


        Route::get('/all-district',[OperatorCommonController::class,'fetch_district']);
        Route::get('/department',[OperatorCommonController::class,'fetch_department']);
        Route::get('/designation',[OperatorCommonController::class,'fetch_designation']);
        Route::get('/subjects',[OperatorCommonController::class,'fetch_subject']);
        Route::get('/categories',[OperatorCommonController::class,'fetch_Category']);
        Route::get('/rejections',[OperatorCommonController::class,'fetch_rejection']);
        Route::get('/complainstype',[OperatorCommonController::class,'fetch_complainstype']);
        Route::post('/add-complaint',[OperatorComplaintsController::class,'store']);
        Route::post('/save-draft-complaint',[OperatorComplaintsController::class,'saveAsDraft']);
        Route::post('/sent-draft-to-inbox',[OperatorComplaintsController::class,'sentToInboxDraft']);
        Route::post('/upload-document',[OperatorComplaintsController::class,'uploadDocument']);
        Route::get('/get-document/{id}',[OperatorComplaintsController::class,'getUploadDoc']);
        Route::post('/forward-physical',[OperatorComplaintsController::class,'makedforwardbyRk']);
        Route::post('/received-physical',[OperatorComplaintsController::class,'makedreceivedbyRk']);
        Route::get('/get-lokayukt',[OperatorComplaintsController::class,'getLokayuktUsers']);
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
        Route::get('/get-users',[OperatorComplaintsController::class,'getSubROleUsers']);
        Route::get('/get-movement-history',[OperatorComplaintsController::class,'allRCmovement']);
        Route::get('/role-dahboard',[OperatorComplaintsController::class,'rolesDashboard']);

        Route::get('/progress-register',[OperatorReportController::class,'progress_report']);
        Route::get('/current-report',[OperatorReportController::class,'current_report']);
        Route::get('/analytic-report',[OperatorReportController::class,'analytics']);
        Route::get('/complain-report',[OperatorReportController::class,'complainReports']);
        Route::get('/all-complains',[OperatorReportController::class,'allComplains']);
        Route::get('/search-by-field',[OperatorReportController::class,'search']);

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
        Route::get('/categories',[CommonController::class,'fetch_Category']);
    });

    Route::middleware('role:supervisor:ds|js|us|ro-aro|ro|sec|cio-io|io')->prefix('supervisor')->group(function () {
           Route::get('/all-files',[EmployeesController::class,'index']);
        Route::get('/all-files/{id}',[EmployeesController::class,'fileDetails']);
          Route::get('/all-personal-files',[EmployeesController::class,'viewPersonalFile']);

        Route::get('/topics',[EmployeesController::class,'fetch_topics']);
        Route::get('/filetypes',[EmployeesController::class,'fetch_fileType']);
        Route::post('/upload-file',[EmployeesController::class,'uploadFiles']);
        Route::post('/upload-private-file',[EmployeesController::class,'uploadPrivateFiles']);

        Route::get('/get-file-preview/{id}',[EmployeesController::class,'getFilePreview']); 
        

        //NEW-KRISHNA
        
        Route::get('/get-roles-supervisors', [CommonController::class, 'getRolesSupervisors']);
        Route::get('/personal-file-list',[EmployeesController::class,'personalFileList']);
        Route::get('/personal-file-list/{id}',[EmployeesController::class,'personalFileListById']);

        Route::post('/personal-file-send',[EmployeesController::class, 'sendPersonalFile']);

        //

        Route::get('/all-district',[SupervisorCommonController::class,'fetch_district']);
        Route::get('/all-complaints',[SupervisorComplaintsController::class,'allComplains']);
        Route::get('/all-pending-complaints',[SupervisorComplaintsController::class,'allComplainspending']);
        Route::get('/all-approved-complaints',[SupervisorComplaintsController::class,'allComplainsapproved']);
        Route::get('/view-complaint/{id}',[SupervisorComplaintsController::class,'viewComplaint']);
        Route::get('/get-document/{id}',[SupervisorComplaintsController::class,'getUploadDoc']);
        Route::get('/get-documentdraft/{id}',[SupervisorComplaintsController::class,'getUploadDocAndDraft']);
        Route::get('/get-draft-letter/{id}',[SupervisorComplaintsController::class,'getDraftLetter']);
        Route::get('/get-file-preview/{id}',[SupervisorComplaintsController::class,'getFilePreview']);
        Route::post('/add-notes',[SupervisorComplaintsController::class,'addNotes']);
        Route::post('/create-draft',[SupervisorComplaintsController::class,'createDraft']);
        Route::get('/edit-draft-letter/{id}',[SupervisorComplaintsController::class,'editDraftLetter']);
        Route::post('/update-draft-letter/{id}',[SupervisorComplaintsController::class,'updateDraftLetter']);
         
        Route::get('/get-notes/{id}',[SupervisorComplaintsController::class,'getNotes']);
        Route::post('assign-by-ro-aro/{complainId}',[SupervisorComplaintsController::class,'assignToRoAro']);
        Route::post('/upload-document',[SupervisorComplaintsController::class,'uploadDocument']);
        Route::post('/upload-draft-letter',[SupervisorComplaintsController::class,'uploadDraftLetter']);
        Route::post('/forward-by-so/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbySO']);
        Route::post('/forward-by-ds-js/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbyds']);
        Route::post('/forward-by-da/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbyda']);
        Route::post('/forward-by-ro-aro/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbyRoAro']);
        Route::post('/forward-by-ro/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbyRo']);
        Route::post('/forward-by-sec/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbySec']);
        Route::post('/forward-by-cio/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbyCio']);
        Route::post('/forward-by-io/{complainId}',[SupervisorComplaintsController::class,'forwardComplaintbyio']);
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
        Route::get('/get-users',[SupervisorComplaintsController::class,'getSubROleUsers']);
        Route::get('/get-uplokayukt',[SupervisorComplaintsController::class,'getUpLokayuktUsers']);
        Route::get('/get-user-with-ps',[SupervisorComplaintsController::class,'getUserWithPs']);
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
        Route::get('/get-document/{id}',[LokAyuktComplaintsController::class,'getUploadDoc']);
        Route::get('/get-notes/{id}',[LokAyuktComplaintsController::class,'getNotes']);
        Route::post('/add-notes',[LokAyuktComplaintsController::class,'addNotes']);
        Route::get('/get-file-preview/{id}',[LokAyuktComplaintsController::class,'getFilePreview']);
        Route::get('/return-complain-by-lokayukt/{id}',[LokAyuktComplaintsController::class,'returnComplainByLokayukt']);
        Route::post('/pull-back-by-lokayukt/{id}',[LokAyuktComplaintsController::class,'pullBackByLokayukt']);
        Route::post('/reject-complaint-by-lokayukt/{id}',[LokAyuktComplaintsController::class,'rejectComplaintByLokayukt']);
        Route::post('/fee-exempted/{complaint_id}',[LokAyuktComplaintsController::class,'approvedFeeByLokayukt']);
        Route::post('/forward-to-uplokayukt/{complaint_id}',[LokAyuktComplaintsController::class,'approvedByLokayukt']);
        Route::post('/add-dispatch',[LokAyuktComplaintsController::class,'addDispachLeters']);
        Route::get('/all-complain-ids',[LokAyuktComplaintsController::class,'allComplainsId']);
        Route::get('/all-dispatch-letters',[LokAyuktComplaintsController::class,'allDispatchLetters']);
         Route::post('/upload-document',[LokAyuktComplaintsController::class,'uploadDocument']);
         Route::post('/released-by-lokayukt/{id}',[LokAyuktComplaintsController::class,'releasekByLokayukt']);
       
       
        // Route::post('/forward-by-ds-js/{complainId}',[LokAyuktComplaintsController::class,'forwardComplaintbyds']);
        // Route::post('/forward-by-da/{complainId}',[LokAyuktComplaintsController::class,'forwardComplaintbyda']);
        Route::post('/forward-by-lokayukt/{complainId}',[LokAyuktComplaintsController::class,'forwardComplaintbylokayukt']);
        Route::post('/request-report/{complainId}',[LokAyuktReportController::class,'requestReport']);
        Route::get('/request-list/{complainId}',[LokAyuktReportController::class,'requestReportList']);
        Route::get('/request-list-cio/{complainId}',[LokAyuktReportController::class,'requestinvestigationReport']);
          Route::get('/over-all-status',[LokAyuktReportController::class,'complaintPercentages']);
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
        Route::get('/dist-wise-compliant',[LokAyuktReportController::class,'complaintDistWise']);
          Route::get('/department-wise-report',[LokAyuktReportController::class,'departmentwise']);
        Route::get('/enrolment-date-wise',[LokAyuktReportController::class,'enrolmentDateWise']);
        Route::get('/dispatch-report',[LokAyuktReportController::class,'allDispatchLettersReport']);
        // // Daishboard
        Route::get('/dashboard/{date}',[LokAyuktDashboardController::class,'index']);
        Route::get('/montly-complaint',[LokAyuktDashboardController::class,'getDistrictGraph']);
        Route::get('/district-wise-company-type',[LokAyuktDashboardController::class,'getdistrictWiseCompanyTypeGraph']);
        Route::get('/status-distribution',[LokAyuktDashboardController::class,'gestatusDistribution']);
        // Route::get('/status-distribution',action: [SupervisorDashboardController::class,'gestatusDistribution']);
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
         * Category
         */
        Route::get('/categories',[CommonController::class,'fetch_Category']);
        Route::post('/add-category',[CommonController::class,'addCategory']);
        Route::post('/edit-category/{id}',[CommonController::class,'editCategory']);
        Route::post('/delete-category/{id}',[CommonController::class,'removeCategory']);

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
  
    });

     Route::middleware('role:ps')->prefix('ps')->group(function () {
           Route::get('/all-files',[EmployeesController::class,'index']);
                   Route::get('/all-files/{id}',[EmployeesController::class,'fileDetails']);

        Route::get('/all-personal-files',[EmployeesController::class,'viewPersonalFile']);

        Route::get('/topics',[EmployeesController::class,'fetch_topics']);
        Route::get('/filetypes',[EmployeesController::class,'fetch_fileType']);
        Route::post('/upload-file',[EmployeesController::class,'uploadFiles']);
        Route::post('/upload-private-file',[EmployeesController::class,'uploadPrivateFiles']);

        Route::get('/get-file-preview/{id}',[EmployeesController::class,'getFilePreview']);  

        Route::get('/all-district',[PSCommonController::class,'fetch_district']);
        Route::get('/all-complaints',[PSComplaintsController::class,'allComplains']);
        Route::get('/all-pending-complaints',[PSComplaintsController::class,'allComplainspending']);
        Route::get('/all-approved-complaints',[PSComplaintsController::class,'allComplainsapproved']);
        Route::get('/view-complaint/{id}',[PSComplaintsController::class,'viewComplaint']);
        Route::post('/forward-by-so/{complainId}',[PSComplaintsController::class,'forwardComplaintbySO']);
        Route::post('/dispose-complain/{complainId}',[PSComplaintsController::class,'disposeComplaints']);
         Route::get('/get-lokayukt-uplokayukt',[PSComplaintsController::class,'getUsers']);
        Route::get('/get-users',[PSComplaintsController::class,'getSubROleUsers']);
        Route::get('/get-document/{id}',[PSComplaintsController::class,'getUploadDoc']);
         Route::post('/upload-document',[PSComplaintsController::class,'uploadDocument']);
        Route::get('/get-notes/{id}',[PSComplaintsController::class,'getNotes']);
        Route::post('/add-notes',[PSComplaintsController::class,'addNotes']);
        Route::get('/get-file-preview/{id}',[PSComplaintsController::class,'getFilePreview']);
         Route::post('/return-complain-by-ps/{complainId}',[PSComplaintsController::class,'returnComplainByPs']);
        Route::post('/pull-back-by-ps/{complainId}',[PSComplaintsController::class,'pullBackByPs']);
        Route::post('forward-complain-by-ps/{complainId}',[PSComplaintsController::class,'forwardComplaintbyPS']);
        Route::post('assign-by-ps/{complainId}',[PSComplaintsController::class,'assignToPs']);
        Route::post('/fee-exempted/{complaint_id}',[PSComplaintsController::class,'approvedFeeByPS']);
        Route::post('/forward-to-uplokayukt/{complaint_id}',[PSComplaintsController::class,'approvedByupLokayukt']);
        Route::post('/reject-complaint-by-ps/{id}',[PSComplaintsController::class,'rejectComplaintByPs']);
        // Route::post('/forward-by-ds-js/{complainId}',[PSComplaintsController::class,'forwardComplaintbyds']);
        // Route::post('/forward-by-da/{complainId}',[PSComplaintsController::class,'forwardComplaintbyda']);
        Route::post('/forward-by-ps/{complainId}',[PSComplaintsController::class,'forwardComplaintbyPS']);
        Route::post('/request-report/{complainId}',[PSReportController::class,'requestReport']);
        Route::get('/request-list/{complainId}',[PSReportController::class,'requestReportList']);
                Route::get('/request-list-cio/{complainId}',[PSReportController::class,'requestinvestigationReport']);
        /*
         * Forward Report By Subroles
         */
        Route::post('/forward-report-by-sec{complainId}',[PSReportController::class,'forwardReporttbysec']);
        Route::post('/forward-report-by-cio/{complainId}',[PSReportController::class,'forwardReporttbycio']);
        Route::post('/forward-report-by-da/{complainId}',[PSReportController::class,'forwardReporttbyda']);
       
        Route::get('/get-lokayukt',[PSComplaintsController::class,'getLokayuktUsers']);
        Route::get('/get-uplokayukt',[PSComplaintsController::class,'getUpLokayuktUsers']);
        Route::get('/get-dealing-assistant',[PSComplaintsController::class,'getDealingAssistantUsers']);
        Route::get('/progress-register',[PSReportController::class,'progress_report']);
        Route::get('/complain-report',[PSReportController::class,'complainReports']);
        Route::get('/current-report',[PSReportController::class,'current_report']);
        Route::get('/analytic-report',[PSReportController::class,'analytics']);
        // Route::get('/detail-by-complaintype',[LokAyuktReportController::class,'complainComplaintypeWise']);
         Route::get('/all-complains',[PSReportController::class,'allComplains']);
        Route::get('/district-wise-complaint',[PSReportController::class,'complainDistrictWise']);
        Route::get('/department-wise-complaint',[PSReportController::class,'complainDepartmentWise']);
        Route::get('/montly-trends',[PSReportController::class,'getMontlyTrends']);
        Route::get('/compliance-report',[PSReportController::class,'complianceReport']);

        // // Daishboard
        Route::get('/dashboard/{date}',[PSDashboardController::class,'index']);
        Route::get('/montly-complaint',[PSDashboardController::class,'getDistrictGraph']);
        Route::get('/district-wise-company-type',[PSDashboardController::class,'getdistrictWiseCompanyTypeGraph']);
        Route::get('/status-distribution',[PSDashboardController::class,'gestatusDistribution']);
        // Route::get('/status-distribution',action: [SupervisorDashboardController::class,'gestatusDistribution']);
       
    });

      Route::middleware('role:dispatch')->prefix('dispatch')->group(function () {
        
        Route::get('/all-district',[DispatchCommonController::class,'fetch_district']);
        Route::get('/all-complaints',[DispatchComplaintsController::class,'allComplains']);
        Route::get('/all-pending-complaints',[DispatchComplaintsController::class,'allComplainspending']);
        Route::get('/all-approved-complaints',[DispatchComplaintsController::class,'allComplainsapproved']);
        Route::get('/view-complaint/{id}',[DispatchComplaintsController::class,'viewComplaint']);
        Route::post('/forward-by-so/{complainId}',[DispatchComplaintsController::class,'forwardComplaintbySO']);
        Route::post('/dispose-complain/{complainId}',[DispatchComplaintsController::class,'disposeComplaints']);
        Route::get('/get-lokayukt-uplokayukt',[DispatchComplaintsController::class,'getUsers']);
        Route::get('/get-users',[DispatchComplaintsController::class,'getSubROleUsers']);
        Route::get('/get-document/{id}',[DispatchComplaintsController::class,'getUploadDoc']);
        Route::get('/get-notes/{id}',[DispatchComplaintsController::class,'getNotes']);
        Route::post('/add-notes',[DispatchComplaintsController::class,'addNotes']);
        Route::get('/get-file-preview/{id}',[DispatchComplaintsController::class,'getFilePreview']);
         Route::post('/return-complain-by-ps/{complainId}',[DispatchComplaintsController::class,'returnComplainByPs']);
        Route::post('/pull-back-by-ps/{complainId}',[DispatchComplaintsController::class,'pullBackByPs']);
        Route::post('forward-complain-by-ps/{complainId}',[DispatchComplaintsController::class,'forwardComplaintbyPS']);
        Route::post('assign-by-ps/{complainId}',[DispatchComplaintsController::class,'assignToPs']);
          Route::post('/add-dispatch',[DispatchComplaintsController::class,'addDispachLeters']);
        Route::get('/all-complain-ids',[DispatchComplaintsController::class,'allComplainsId']);
        Route::get('/all-dispatch-letters',[DispatchComplaintsController::class,'allDispatchLetters']);
      
        
        // Route::post('/forward-by-ds-js/{complainId}',[PSComplaintsController::class,'forwardComplaintbyds']);
        // Route::post('/forward-by-da/{complainId}',[PSComplaintsController::class,'forwardComplaintbyda']);
        Route::post('/forward-by-ps/{complainId}',[DispatchComplaintsController::class,'forwardComplaintbyPS']);
        Route::post('/request-report/{complainId}',[DispatchReportController::class,'requestReport']);
        Route::get('/request-list/{complainId}',[DispatchReportController::class,'requestReportList']);
                Route::get('/request-list-cio/{complainId}',[DispatchReportController::class,'requestinvestigationReport']);
        /*
         * Forward Report By Subroles
         */
        Route::post('/forward-report-by-sec{complainId}',[DispatchReportController::class,'forwardReporttbysec']);
        Route::post('/forward-report-by-cio/{complainId}',[DispatchReportController::class,'forwardReporttbycio']);
        Route::post('/forward-report-by-da/{complainId}',[DispatchReportController::class,'forwardReporttbyda']);
       
        Route::get('/get-lokayukt',[DispatchComplaintsController::class,'getLokayuktUsers']);
        Route::get('/get-uplokayukt',[DispatchComplaintsController::class,'getUpLokayuktUsers']);
        Route::get('/get-dealing-assistant',[DispatchComplaintsController::class,'getDealingAssistantUsers']);
        Route::get('/progress-register',[DispatchReportController::class,'progress_report']);
        Route::get('/complain-report',[DispatchReportController::class,'complainReports']);
        Route::get('/current-report',[DispatchReportController::class,'current_report']);
        Route::get('/analytic-report',[DispatchReportController::class,'analytics']);
        // Route::get('/detail-by-complaintype',[LokAyuktReportController::class,'complainComplaintypeWise']);
         Route::get('/all-complains',[DispatchReportController::class,'allComplains']);
        Route::get('/district-wise-complaint',[DispatchReportController::class,'complainDistrictWise']);
        Route::get('/department-wise-complaint',[DispatchReportController::class,'complainDepartmentWise']);
        Route::get('/montly-trends',[DispatchReportController::class,'getMontlyTrends']);
        Route::get('/compliance-report',[DispatchReportController::class,'complianceReport']);

        // // Daishboard
        Route::get('/dashboard/{date}',[DispatchDashboardController::class,'index']);
        Route::get('/montly-complaint',[DispatchDashboardController::class,'getDistrictGraph']);
        Route::get('/district-wise-company-type',[DispatchDashboardController::class,'getdistrictWiseCompanyTypeGraph']);
        Route::get('/status-distribution',[DispatchDashboardController::class,'gestatusDistribution']);
        // Route::get('/status-distribution',action: [SupervisorDashboardController::class,'gestatusDistribution']);
       
    });

    Route::middleware('role:steno|assistant-clerk|computer-assistant
|car-driver|jamadar|orderly/jamadar|office|farrash|sweeper|gardener|cook|watchman|peon')->prefix('employee')->group(function () {
       
        Route::get('/all-files',[EmployeesController::class,'index']);
                Route::get('/all-files/{id}',[EmployeesController::class,'fileDetails']);

         Route::get('/all-personal-files',[EmployeesController::class,'viewPersonalFile']);

        Route::get('/topics',[EmployeesController::class,'fetch_topics']);
        Route::get('/filetypes',[EmployeesController::class,'fetch_fileType']);
        Route::post('/upload-file',[EmployeesController::class,'uploadFiles']);
        Route::post('/upload-private-file',[EmployeesController::class,'uploadPrivateFiles']);
        Route::get('/get-file-preview/{id}',[EmployeesController::class,'getFilePreview']);
       
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
         Route::get('/get-notes/{id}',[UpLokAyuktComplaintsController::class,'getNotes']);
          Route::get('/get-document/{id}',[UpLokAyuktComplaintsController::class,'getUploadDoc']);
           Route::post('/return-complain-by-uplokayukt/{id}',[UpLokAyuktComplaintsController::class,'returnComplainByUpLokayukt']);
          Route::post('/forward-by-uplokayukt/{complainId}',[UpLokAyuktComplaintsController::class,'forwardComplaintbyUplokayukt']);
         Route::post('/upload-document',[UpLokAyuktComplaintsController::class,'uploadDocument']);
          Route::get('/get-file-preview/{id}',[UpLokAyuktComplaintsController::class,'getFilePreview']);
          Route::post('/add-notes',[UpLokAyuktComplaintsController::class,'addNotes']);
          Route::post('/pull-back-by-uplokayukt/{id}',[UpLokAyuktComplaintsController::class,'pullBackByupLokayukt']);
          Route::post('/reject-complaint-by-uplokayukt/{id}',[UpLokAyuktComplaintsController::class,'rejectComplaintByUpLokayukt']);
          Route::post('/fee-exempted/{complaint_id}',[UpLokAyuktComplaintsController::class,'approvedFeeByUpLokayukt']);
          Route::post('/released-by-uplokayukt/{id}',[UpLokAyuktComplaintsController::class,'releasekByUpLokayukt']);
         
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
  
    });

    

});


