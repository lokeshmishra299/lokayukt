// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'

// Admin
import AdminLayout from './components/Admin/Layout';
import AdminDashboard from './components/Admin/Dashboard';
import AdminComplaints from './components/Admin/Complaints';
import AdminProgressRegister from './components/Admin/ProgressRegister';
import AdminViewLeaveFiels from './components/Admin/ViewLeaveFiels';
import AdminSearchReports from './components/Admin/SearchReports';
import AdminUserManagement from './components/Admin/UserManagement';
import AdminMasterData from './components/Admin/MasterData';
import AdminAddUserManagement from './components/Admin/AddUserManagement';
import AdminEditUserManagment from './components/Admin/EditUserManagment';
import AdminViewComplaints from './components/Admin/ViewComplaints';
import AdminEditComplaint from './components/Admin/EditComplaint';
import AdminFileAdministrator from './components/Admin/FileAdministrator';
import AdminEmploymentManagement from './components/Admin/EmploymentManagement';
import AdminAddEmploymentManagement from './components/Admin/AddEmploymentManagement';
import AdminEditEmploymentManagement from './components/Admin/EditEmploymentManagement';
import AdminAllLeaveFiels from './components/Admin/AllLeaveFiels';
import AdminAllPersonalFile from './components/Admin/PersonalFiles/AllPersonalFile';
import AdminViewPersonalFile from './components/Admin/PersonalFiles/ViewPersonalFile';
import AdminAddPersonalFile from './components/Admin/PersonalFiles/AddPersonalFiles';
import AdminAllPermission from './components/Admin/PersonalFiles/AllPermission';










// Operator
import OperatorLayout from './components/Operator/Layout';
import OperatorDashboard from './components/Operator/Dashboard';
import OperatorComplaints from './components/Operator/Complaints';
import OperatorProgressRegister from './components/Operator/ProgressRegister';
import OperatorSearchReports from './components/Operator/SearchReports';
import OperatorViewComplaints from './components/Operator/ViewComplaints';
import OperatorEditComplaints from './components/Operator/EditComplaints';
import OperatorAllComplaits from './components/Operator/All-complaints/AllComplaits';
import OperatorViewAllComplaint from './components/Operator/All-complaints/ViewAllComplaint';
import OperatorAllComplaintsEdit from './components/Operator/All-complaints/EditAllComplaints';
import OperatorApprovedComplaints from './components/Operator/Approved-complaints/ApprovedComplaints';
import OperatorViewApprovedComplaints from './components/Operator/Approved-complaints/ViewApprovedComplaints';
import OperatorEditApprovedCoplaints from './components/Operator/Approved-complaints/EditApprovedCoplaints';
import OperatorPendingComplaints from './components/Operator/Pending-complaints/PendingComplaints/';
import OperatorViewPendingComplaint from './components/Operator/Pending-complaints/ViewPendingComplaint';
import OperatorEditPendingComplaints from './components/Operator/Pending-complaints/EditPendingComplaints';
import OperatorEmployUserDashboard from './components/Operator/EmployUserDashboard';

// Employ
import OperatorEmployLayout from './components/Operator/Employ/Layout';
import OperatorEmployDashboard from './components/Operator/Employ/Dashboard';
import OperatorEmployComplaints from './components/Operator/Employ/Complaints';
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import OperatorEmployUserManagement from './components/Operator/Employ/UserManagement';
import OperatorEmployAddFiles from './components/Operator/Employ/AddFiles';
import OperatorEmployViewFiles from './components/Operator/Employ/ViewFiles';
import OperatorEmployViewPersonalFile from './components/Operator/Employ/ViewPersonalFiles';



import OperatorViewPersonalFiles from './components/Operator/Employ/PersonalFiles/ViewPersonalFiles';
import OperatorAddPersonalFiles from "./components/Operator/Employ/PersonalFiles//AddpersonalFiles"
import OperatorPersonalFileById from './components/Operator/Employ/PersonalFiles/PersonalFileById';

import OperatorPendingFiles from './components/Operator/Employ/PendingFiles/PendingFiles';
import OperatorPendingFileBYId from './components/Operator/Employ/PendingFiles/PendingFileBYId';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';

import AllDraft from './components/Operator/Draft/AllDraft';
import ViewDraft from './components/Operator/Draft/ViewDraft';
import EditDraft from './components/Operator/Draft/EditDraft';
import RcLog from './components/Operator/RcLog';
import Reporting from './components/Operator/Reporting/Reporting';




// Supervisor 
// SubRole -> so-us
// import SupervisorLayout from './components/Supervisor/so-us/Layout';
// import SupervisorDashboard from './components/Supervisor/so-us/Dashboard';
// import SupervisorComplaints from './components/Supervisor/so-us/Complaints';
// import SupervisorProgressRegister from './components/Supervisor/so-us/ProgressRegister';
// import SupervisorSearchReports from './components/Supervisor/so-us/SearchReports';
// import SupervisorViewComplaints from './components/Supervisor/so-us/ViewComplaints';
// import SupervisorPendingComplaints from './components/Supervisor/so-us/Pending-complaints/PendingComplaints';
// import SupervisorEditPendingComplaints from './components/Supervisor/so-us/Pending-complaints/EditPendingComplaints';
// import SupervisorViewPendingComplaints from './components/Supervisor/so-us/Pending-complaints/ViewPendingComplaints';

// import SupervisorApprovedComplaints from './components/Supervisor/so-us/Approved-complaints/ApprovedComplaints';
// import SupervisorViewApprovedComplaints from './components/Supervisor/so-us/Approved-complaints/ViewApprovedComplaints';
// import SupervisorEditApprovedComplaints from './components/Supervisor/so-us/Approved-complaints/EditApprovedComplaints';

// import SupervisorAllComplaits from './components/Supervisor/so-us/All-complaints/AllComplaits';
// import SupervisorViewAllComplaint from './components/Supervisor/so-us/All-complaints/ViewwAllComplaint';
// import SupervisorEditComplaints from './components/Supervisor/so-us/All-complaints/EditAllComplaints';

// // Supervisor 
// // SubRole -> ds-js
// import SupervisorLayoutds from './components/Supervisor/ds-js/Layout';
// import SupervisorDashboardds from './components/Supervisor/ds-js/Dashboard';
// import SupervisorComplaintsds from './components/Supervisor/ds-js/Complaints';
// import SupervisorProgressRegisterds from './components/Supervisor/ds-js/ProgressRegister';
// import SupervisorSearchReportsds from './components/Supervisor/ds-js/SearchReports';
// import SupervisorViewComplaintsds from './components/Supervisor/ds-js/ViewComplaints';
// import SupervisorPendingComplaintsds from './components/Supervisor/ds-js/Pending-complaints/PendingComplaints';
// import SupervisorEditPendingComplaintsds from './components/Supervisor/ds-js/Pending-complaints/EditPendingComplaints';
// import SupervisorViewPendingComplaintsds from './components/Supervisor/ds-js/Pending-complaints/ViewPendingComplaints';


// import SupervisorApprovedComplaintsds from './components/Supervisor/ds-js/Approved-complaints/ApprovedComplaints';
// import SupervisorViewApprovedComplaintds from './components/Supervisor/ds-js/Approved-complaints/ViewApprovedComplaints';
// import SupervisorEditApprovedComplaintds from './components/Supervisor/ds-js/Approved-complaints/EditApprovedComplaints';

// import SupervisorAllComplaitsds from './components/Supervisor/ds-js/All-complaints/AllComplaits';
// import SupervisorViewAllComplaintds from './components/Supervisor/ds-js/All-complaints/ViewwAllComplaint';
// import SupervisorEditComplaintsds from './components/Supervisor/ds-js/All-complaints/EditAllComplaints';

// RO/ARO
//----------

import SupervisorLayoutro from './components/Supervisor/ro-aro/Layout';
import SupervisorDashboardro from './components/Supervisor/ro-aro/Dashboard';
import SupervisorComplaintsro from './components/Supervisor/ro-aro/Complaints';
import SupervisorProgressRegisterro from './components/Supervisor/ro-aro/ProgressRegister';
import SupervisorSearchReportsro from './components/Supervisor/ro-aro/SearchReports';
import SupervisorViewComplaintsro from './components/Supervisor/ro-aro/ViewComplaints';
import SupervisorPendingComplaintsro from './components/Supervisor/ro-aro/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsro from './components/Supervisor/ro-aro/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsro from './components/Supervisor/ro-aro/Pending-complaints/ViewPendingComplaints';


import SupervisorApprovedComplaintsro from './components/Supervisor/ro-aro/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintro from './components/Supervisor/ro-aro/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintro from './components/Supervisor/ro-aro/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsro from './components/Supervisor/ro-aro/All-complaints/AllComplaits';
import SupervisorViewAllComplaintro from './components/Supervisor/ro-aro/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsro from './components/Supervisor/ro-aro/All-complaints/EditAllComplaints';


import EmployUserDashboardroaro from "./components/./Supervisor/ro-aro/EmployUserDashboard"


// Employ
import RoAroEmployLayout from './components/Supervisor/ro-aro/Employ/Layout';
import RoAroEmployDashboard from './components/Supervisor/ro-aro/Employ/Dashboard';
import RoAroEmployComplaints from './components/Supervisor/ro-aro/Employ/Complaints';

import RoAroEmployUserManagement from './components/Supervisor/ro-aro/Employ/UserManagement';
import RoAroEmployAddFiles from './components/Supervisor/ro-aro/Employ/ViewLeaveFiels/AddFiles';
import RoAroEmployViewFiles from './components/Supervisor/ro-aro/Employ/ViewLeaveFiels/ViewFiles';
import RoAroViewFielsById from './components/Supervisor/ro-aro/Employ/ViewLeaveFiels/ViewFielsById';


import RoAroViewPersonalFiles from './components/Supervisor/ro-aro/Employ/PersonalFiles/ViewPersonalFiles';
import RoAroAddPersonalFiles from "./components/Supervisor/ro-aro/Employ/PersonalFiles//AddpersonalFiles"
import RoAroPersonalFileById from './components/Supervisor/ro-aro/Employ/PersonalFiles/PersonalFileById';

import RoAroPendingFiles from './components/Supervisor/ro-aro/Employ/PendingFiles/PendingFiles';
import RoAroPendingFileBYId from './components/Supervisor/ro-aro/Employ/PendingFiles/PendingFileBYId';

// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';

// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';




// So
//----------

import SupervisorLayoutso from './components/Supervisor/so/Layout';
import SupervisorDashboardso from './components/Supervisor/so/Dashboard';
import SupervisorComplaintsso from './components/Supervisor/so/Complaints';
import SupervisorProgressRegisterso from './components/Supervisor/so/ProgressRegister';
import SupervisorSearchReportsso from './components/Supervisor/so/SearchReports';
import SupervisorViewComplaintsso from './components/Supervisor/so/ViewComplaints';
import SupervisorPendingComplaintsso from './components/Supervisor/so/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsso from './components/Supervisor/so/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsso from './components/Supervisor/so/Pending-complaints/ViewPendingComplaints';


import SupervisorApprovedComplaintsso from './components/Supervisor/so/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintso from './components/Supervisor/so/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintso from './components/Supervisor/so/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsso from './components/Supervisor/so/All-complaints/AllComplaits';
import SupervisorViewAllComplaintso from './components/Supervisor/so/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsso from './components/Supervisor/so/All-complaints/EditAllComplaints';


import EmployUserDashboardso from "./components/Supervisor/so/EmployUserDashboard"


// Employ
import SoEmployLayout from './components/Supervisor/so/Employ/Layout';
import SoEmployDashboard from './components/Supervisor/so/Employ/Dashboard';
import SoEmployComplaints from './components/Supervisor/so/Employ/Complaints';

import SoEmployUserManagement from './components/Supervisor/so/Employ/UserManagement';
import SoEmployAddFiles from './components/Supervisor/so/Employ/ViewLeaveFiels/AddFiles';
import SoEmployViewFiles from './components/Supervisor/so/Employ/ViewLeaveFiels/ViewFiles';
import SoViewFielsById from './components/Supervisor/so/Employ/ViewLeaveFiels/ViewFielsById';


import SoViewPersonalFiles from './components/Supervisor/so/Employ/PersonalFiles/ViewPersonalFiles';
import SoAddPersonalFiles from "./components/Supervisor/so/Employ/PersonalFiles//AddpersonalFiles"
import SoPersonalFileById from './components/Supervisor/so/Employ/PersonalFiles/PersonalFileById';

import SoPendingFiles from './components/Supervisor/so/Employ/PendingFiles/PendingFiles';
import SoPendingFileBYId from './components/Supervisor/so/Employ/PendingFiles/PendingFileBYId';





// PRO
//----------

import SupervisorLayoutpro from './components/Supervisor/pro/Layout';
import SupervisorDashboardpro from './components/Supervisor/pro/Dashboard';
import SupervisorComplaintspro from './components/Supervisor/pro/Complaints';
import SupervisorProgressRegisterpro from './components/Supervisor/pro/ProgressRegister';
import SupervisorSearchReportspro from './components/Supervisor/pro/SearchReports';
import SupervisorViewComplaintspro from './components/Supervisor/pro/ViewComplaints';
import SupervisorPendingComplaintspro from './components/Supervisor/pro/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintspro from './components/Supervisor/pro/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintspro from './components/Supervisor/pro/Pending-complaints/ViewPendingComplaints';


import SupervisorApprovedComplaintspro from './components/Supervisor/pro/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintpro from './components/Supervisor/pro/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintpro from './components/Supervisor/pro/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitspro from './components/Supervisor/pro/All-complaints/AllComplaits';
import SupervisorViewAllComplaintpro from './components/Supervisor/pro/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintspro from './components/Supervisor/pro/All-complaints/EditAllComplaints';


import EmployUserDashboardpro from "./components/Supervisor/pro/EmployUserDashboard"


// Employ
import ProEmployLayout from './components/Supervisor/pro/Employ/Layout';
import ProEmployDashboard from './components/Supervisor/pro/Employ/Dashboard';
import ProEmployComplaints from './components/Supervisor/pro/Employ/Complaints';

import ProEmployUserManagement from './components/Supervisor/pro/Employ/UserManagement';
import ProEmployAddFiles from './components/Supervisor/pro/Employ/ViewLeaveFiels/AddFiles';
import ProEmployViewFiles from './components/Supervisor/pro/Employ/ViewLeaveFiels/ViewFiles';
import ProViewFielsById from './components/Supervisor/pro/Employ/ViewLeaveFiels/ViewFielsById';


import ProViewPersonalFiles from './components/Supervisor/pro/Employ/PersonalFiles/ViewPersonalFiles';
import ProAddPersonalFiles from "./components/Supervisor/pro/Employ/PersonalFiles//AddpersonalFiles"
import ProPersonalFileById from './components/Supervisor/pro/Employ/PersonalFiles/PersonalFileById';

import ProPendingFiles from './components/Supervisor/pro/Employ/PendingFiles/PendingFiles';
import ProPendingFileBYId from './components/Supervisor/pro/Employ/PendingFiles/PendingFileBYId';








// DS

import SupervisorLayoutds from './components/Supervisor/ds/Layout';
import SupervisorDashboardds from './components/Supervisor/ds/Dashboard';
import SupervisorComplaintsds from './components/Supervisor/ds/Complaints';
import SupervisorProgressRegisterds from './components/Supervisor/ds/ProgressRegister';
import SupervisorSearchReportsds from './components/Supervisor/ds/SearchReports';
import SupervisorViewComplaintsds from './components/Supervisor/ds/ViewComplaints';
import SupervisorPendingComplaintsds from './components/Supervisor/ds/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsds from './components/Supervisor/ds/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsds from './components/Supervisor/ds/Pending-complaints/ViewPendingComplaints';


import SupervisorApprovedComplaintsds from './components/Supervisor/ds/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintds from './components/Supervisor/ds/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintds from './components/Supervisor/ds/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsds from './components/Supervisor/ds/All-complaints/AllComplaits';
import SupervisorViewAllComplaintds from './components/Supervisor/ds/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsds from './components/Supervisor/ds/All-complaints/EditAllComplaints';


import EmployUserDashboardds from "./components/./Supervisor/ds/EmployUserDashboard"

// Employ
import DsEmployLayout from './components/Supervisor/ds/Employ/Layout';
import DsEmployDashboard from './components/Supervisor/ds/Employ/Dashboard';
import DsEmployComplaints from './components/Supervisor/ds/Employ/Complaints';

import DsEmployUserManagement from './components/Supervisor/ds/Employ/UserManagement';
import DsEmployAddFiles from './components/Supervisor/ds/Employ/ViewLeaveFiels/AddFiles';
import DsEmployViewFiles from './components/Supervisor/ds/Employ/ViewLeaveFiels/ViewFiles';
import DsViewFielsById from './components/Supervisor/ds/Employ/ViewLeaveFiels/ViewFielsById';


import DsViewPersonalFiles from './components/Supervisor/ds/Employ/PersonalFiles/ViewPersonalFiles';
import DsAddPersonalFiles from "./components/Supervisor/ds/Employ/PersonalFiles//AddpersonalFiles"
import DsPersonalFileById from './components/Supervisor/ds/Employ/PersonalFiles/PersonalFileById';

import DsPendingFiles from './components/Supervisor/ds/Employ/PendingFiles/PendingFiles';
import DsPendingFileBYId from './components/Supervisor/ds/Employ/PendingFiles/PendingFileBYId';

// JS

import SupervisorLayoutjs from './components/Supervisor/js/Layout';
import SupervisorDashboardjs from './components/Supervisor/js/Dashboard';
import SupervisorComplaintsjs from './components/Supervisor/js/Complaints';
import SupervisorProgressRegisterjs from './components/Supervisor/js/ProgressRegister';
import SupervisorSearchReportsjs from './components/Supervisor/js/SearchReports';
import SupervisorViewComplaintsjs from './components/Supervisor/js/ViewComplaints';
import SupervisorPendingComplaintsjs from './components/Supervisor/js/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsjs from './components/Supervisor/js/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsjs from './components/Supervisor/js/Pending-complaints/ViewPendingComplaints';


import SupervisorApprovedComplaintsjs from './components/Supervisor/js/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintjs from './components/Supervisor/js/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintjs from './components/Supervisor/js/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsjs from './components/Supervisor/js/All-complaints/AllComplaits';
import SupervisorViewAllComplaintjs from './components/Supervisor/js/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsjs from './components/Supervisor/js/All-complaints/EditAllComplaints';


import EmployUserDashboardjs from "./components/./Supervisor/js/EmployUserDashboard"

// Employ
import JsEmployLayout from './components/Supervisor/js/Employ/Layout';
import JsEmployDashboard from './components/Supervisor/js/Employ/Dashboard';
import JsEmployComplaints from './components/Supervisor/js/Employ/Complaints';

import JsEmployUserManagement from './components/Supervisor/js/Employ/UserManagement';
import JsEmployAddFiles from './components/Supervisor/js/Employ/ViewLeaveFiels/AddFiles';
import JsEmployViewFiles from './components/Supervisor/js/Employ/ViewLeaveFiels/ViewFiles';
import JsViewFielsById from './components/Supervisor/js/Employ/ViewLeaveFiels/ViewFielsById';


import JsViewPersonalFiles from './components/Supervisor/js/Employ/PersonalFiles/ViewPersonalFiles';
import JsAddPersonalFiles from "./components/Supervisor/js/Employ/PersonalFiles//AddpersonalFiles"
import JsPersonalFileById from './components/Supervisor/js/Employ/PersonalFiles/PersonalFileById';

import JsPendingFiles from './components/Supervisor/js/Employ/PendingFiles/PendingFiles';
import JsPendingFileBYId from './components/Supervisor/js/Employ/PendingFiles/PendingFileBYId';

// US

import SupervisorLayoutus from './components/Supervisor/us/Layout';
import SupervisorDashboardus from './components/Supervisor/us/Dashboard';
import SupervisorComplaintsus from './components/Supervisor/us/Complaints';
import SupervisorProgressRegisterus from './components/Supervisor/us/ProgressRegister';
import SupervisorSearchReportsus from './components/Supervisor/us/SearchReports';
import SupervisorViewComplaintsus from './components/Supervisor/us/ViewComplaints';
import SupervisorPendingComplaintsus from './components/Supervisor/us/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsus from './components/Supervisor/us/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsus from './components/Supervisor/us/Pending-complaints/ViewPendingComplaints';


import SupervisorApprovedComplaintsus from './components/Supervisor/us/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintus from './components/Supervisor/us/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintus from './components/Supervisor/us/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsus from './components/Supervisor/us/All-complaints/AllComplaits';
import SupervisorViewAllComplaintus from './components/Supervisor/us/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsus from './components/Supervisor/us/All-complaints/EditAllComplaints';

import EmployUserDashboardus from "./components/./Supervisor/us/EmployUserDashboard"

// Employ
import UsEmployLayout from './components/Supervisor/us/Employ/Layout';
import UsEmployDashboard from './components/Supervisor/us/Employ/Dashboard';
import UsEmployComplaints from './components/Supervisor/us/Employ/Complaints';

import UsEmployUserManagement from './components/Supervisor/us/Employ/UserManagement';
import UsEmployAddFiles from './components/Supervisor/us/Employ/ViewLeaveFiels/AddFiles';
import UsEmployViewFiles from './components/Supervisor/us/Employ/ViewLeaveFiels/ViewFiles';
import UsViewFielsById from './components/Supervisor/us/Employ/ViewLeaveFiels/ViewFielsById';


import UsViewPersonalFiles from './components/Supervisor/us/Employ/PersonalFiles/ViewPersonalFiles';
import UsAddPersonalFiles from "./components/Supervisor/us/Employ/PersonalFiles//AddpersonalFiles"
import UsPersonalFileById from './components/Supervisor/us/Employ/PersonalFiles/PersonalFileById';

import UsPendingFiles from './components/Supervisor/us/Employ/PendingFiles/PendingFiles';
import UsPendingFileBYId from './components/Supervisor/us/Employ/PendingFiles/PendingFileBYId';


// ARO
//----------

import SupervisorLayoutaro from './components/Supervisor/ro/Layout';
import SupervisorDashboardaro from './components/Supervisor/ro/Dashboard';
import SupervisorComplaintsaro from './components/Supervisor/ro/Complaints';
import SupervisorProgressRegisteraro from './components/Supervisor/ro/ProgressRegister';
import SupervisorSearchReportsaro from './components/Supervisor/ro/SearchReports';
import SupervisorViewComplaintsaro from './components/Supervisor/ro/ViewComplaints';
import SupervisorPendingComplaintsaro from './components/Supervisor/ro/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsaro from './components/Supervisor/ro/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsaro from './components/Supervisor/ro/Pending-complaints/ViewPendingComplaints';


import SupervisorApprovedComplaintsaro from './components/Supervisor/ro/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintaro from './components/Supervisor/ro/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintaro from './components/Supervisor/ro/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsaro from './components/Supervisor/ro/All-complaints/AllComplaits';
import SupervisorViewAllComplaintaro from './components/Supervisor/ro/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsaro from './components/Supervisor/ro/All-complaints/EditAllComplaints';

import EmployUserDashboardaro from "./components/./Supervisor/ro/EmployUserDashboard"



// Employ
import AroEmployLayout from './components/Supervisor/ro/Employ/Layout';
import AroEmployDashboard from './components/Supervisor/ro/Employ/Dashboard';
import AroEmployComplaints from './components/Supervisor/ro/Employ/Complaints';

import AroEmployUserManagement from './components/Supervisor/ro/Employ/UserManagement';
import AroEmployAddFiles from './components/Supervisor/ro/Employ/ViewLeaveFiels/AddFiles';
import AroEmployViewFiles from './components/Supervisor/ro/Employ/ViewLeaveFiels/ViewFiles';
import AroViewFielsById from './components/Supervisor/ro/Employ/ViewLeaveFiels/ViewFielsById';


import AroViewPersonalFiles from './components/Supervisor/ro/Employ/PersonalFiles/ViewPersonalFiles';
import AroAddPersonalFiles from "./components/Supervisor/ro/Employ/PersonalFiles//AddpersonalFiles"
import AroPersonalFileById from './components/Supervisor/ro/Employ/PersonalFiles/PersonalFileById';

import AroPendingFiles from './components/Supervisor/ro/Employ/PendingFiles/PendingFiles';
import AroPendingFileBYId from './components/Supervisor/ro/Employ/PendingFiles/PendingFileBYId';

// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';

// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';





// Supervisor 
// SubRole -> sec
import SupervisorLayoutsec from './components/Supervisor/sec/Layout';
import SupervisorDashboardsec from './components/Supervisor/sec/Dashboard';
import SupervisorComplaintssec from './components/Supervisor/sec/Complaints';
import SupervisorProgressRegistersec from './components/Supervisor/sec/ProgressRegister';
import SupervisorSearchReportssec from './components/Supervisor/sec/SearchReports';
import SupervisorViewComplaintssec from './components/Supervisor/sec/ViewComplaints';
import SupervisorPendingComplaintssec from './components/Supervisor/sec/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintssec from './components/Supervisor/sec/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintssec from './components/Supervisor/sec/Pending-complaints/ViewPendingComplaints';

import SupervisorApprovedComplaintssec from './components/Supervisor/sec/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintssec from './components/Supervisor/sec/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintssec from './components/Supervisor/sec/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitssec from './components/Supervisor/sec/All-complaints/AllComplaits';
import SupervisorViewAllComplaintsec from './components/Supervisor/sec/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintssec from './components/Supervisor/sec/All-complaints/EditAllComplaints';

// import EmployUserDashboardsec from "./components/./Supervisor/sec/EmployUserDashboard"
import EmployUserDashboardsec from "./components/Supervisor/sec/EmployUserDashboard"


// // Employ
// import SecEmployLayout from './components/Supervisor/sec/Employ/Layout';
// import SecEmployDashboard from './components/Supervisor/sec/Employ/Dashboard';
// import SecEmployComplaints from './components/Supervisor/sec/Employ/Complaints';
// // import EmployProgressRegister from './components/Employ/ProgressRegister';
// // import EmploySearchReports from './components/Employ/SearchReports';
// import SecEmployUserManagement from './components/Supervisor/sec/Employ/UserManagement';
// import SecEmployAddFiles from './components/Supervisor/sec/Employ/AddFiles';
// import SecEmployViewFiles from './components/Supervisor/sec/Employ/ViewFiles';
// // import EmployMasterData from './components/Employ/MasterData';
// // import EmployAddUserManagement from './components/Employ/AddUserManagement';
// // import EmployEditUserManagment from './components/Employ/EditUserManagment';
// // import EmployViewComplaints from './components/Employ/ViewComplaints';
// // import EmployEditComplaint from './components/Employ/EditComplaint';
// // import EmployFileAdministrator from './components/Employ/FileAdministrator';


// Employ
import SecEmployLayout from './components/Supervisor/sec/Employ/Layout';
import SecEmployDashboard from './components/Supervisor/sec/Employ/Dashboard';
import SecEmployComplaints from './components/Supervisor/sec/Employ/Complaints';

import SecEmployUserManagement from './components/Supervisor/sec/Employ/UserManagement';
import SecEmployAddFiles from './components/Supervisor/sec/Employ/ViewLeaveFiels/AddFiles';
import SecEmployViewFiles from './components/Supervisor/sec/Employ/ViewLeaveFiels/ViewFiles';
import SecViewFielsById from './components/Supervisor/sec/Employ/ViewLeaveFiels/ViewFielsById';


import SecViewPersonalFiles from './components/Supervisor/sec/Employ/PersonalFiles/ViewPersonalFiles';
import SecAddPersonalFiles from "./components/Supervisor/sec/Employ/PersonalFiles//AddpersonalFiles"
import SecPersonalFileById from './components/Supervisor/sec/Employ/PersonalFiles/PersonalFileById';

import SecPendingFiles from './components/Supervisor/sec/Employ/PendingFiles/PendingFiles';
import SecPendingFileBYId from './components/Supervisor/sec/Employ/PendingFiles/PendingFileBYId';




// Supervisor 
// SubRole -> cio - io
import SupervisorLayoutcio from './components/Supervisor/cio-io/Layout';
import SupervisorDashboardcio from './components/Supervisor/cio-io/Dashboard';
import SupervisorComplaintscio from './components/Supervisor/cio-io/Complaints';
import SupervisorProgressRegistercio from './components/Supervisor/cio-io/ProgressRegister';
import SupervisorSearchReportscio from './components/Supervisor/cio-io/SearchReports';
import SupervisorViewComplaintscio from './components/Supervisor/cio-io/ViewComplaints';
// import SupervisorPendingComplaintscio from './components/Supervisors/cio-io/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintscio from './components/Supervisor/cio-io/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintscio from './components/Supervisor/cio-io/Pending-complaints/ViewPendingComplaints';
// import SupervisorViewPendingComplaintscio from './components/Supervisor/cio-io/Pending-complaints/ViewPendingComplaints';

import SupervisorApprovedComplaintscio from './components/Supervisor/cio-io/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintscio from './components/Supervisor/cio-io/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintscio from './components/Supervisor/cio-io/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitscio from './components/Supervisor/cio-io/All-complaints/AllComplaits';
import SupervisorViewAllComplaintcio from './components/Supervisor/cio-io/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintscio from './components/Supervisor/cio-io/All-complaints/EditAllComplaints';

import EmployUserDashboardcio from "./components/./Supervisor/cio-io/EmployUserDashboard"


// Employ
import CioEmployLayout from './components/Supervisor/cio-io/Employ/Layout';
import CioEmployDashboard from './components/Supervisor/cio-io/Employ/Dashboard';
import CioEmployComplaints from './components/Supervisor/cio-io/Employ/Complaints';

import CioEmployUserManagement from './components/Supervisor/cio-io/Employ/UserManagement';
import CioEmployAddFiles from './components/Supervisor/cio-io/Employ/ViewLeaveFiels/AddFiles';
import CioEmployViewFiles from './components/Supervisor/cio-io/Employ/ViewLeaveFiels/ViewFiles';
import CioViewFielsById from './components/Supervisor/cio-io/Employ/ViewLeaveFiels/ViewFielsById';


import CioViewPersonalFiles from './components/Supervisor/cio-io/Employ/PersonalFiles/ViewPersonalFiles';
import CioAddPersonalFiles from "./components/Supervisor/cio-io/Employ/PersonalFiles//AddpersonalFiles"
import CioPersonalFileById from './components/Supervisor/cio-io/Employ/PersonalFiles/PersonalFileById';

import CioPendingFiles from './components/Supervisor/cio-io/Employ/PendingFiles/PendingFiles';
import CioPendingFileBYId from './components/Supervisor/cio-io/Employ/PendingFiles/PendingFileBYId';




// Supervisor 
// SubRole -> io
import SupervisorLayoutio from './components/Supervisor/ioo/Layout';
import SupervisorDashboardio from './components/Supervisor/ioo/Dashboard';
import SupervisorComplaintsio from './components/Supervisor/ioo/Complaints';
import SupervisorProgressRegisterio from './components/Supervisor/ioo/ProgressRegister';
import SupervisorSearchReportsio from './components/Supervisor/ioo/SearchReports';
import SupervisorViewComplaintsio from './components/Supervisor/ioo/ViewComplaints';
// import SupervisorPendingComplaintsio from './components/Supervisors/io-io/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsio from './components/Supervisor/ioo/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsio from './components/Supervisor/ioo/Pending-complaints/ViewPendingComplaints';
// import SupervisorViewPendingComplaintsio from './components/Supervisor/io-io/Pending-complaints/ViewPendingComplaints';

import SupervisorApprovedComplaintsio from './components/Supervisor/ioo/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintsio from './components/Supervisor/ioo/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintsio from './components/Supervisor/ioo/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsio from './components/Supervisor/ioo/All-complaints/AllComplaits';
import SupervisorViewAllComplaintio from './components/Supervisor/ioo/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsio from './components/Supervisor/ioo/All-complaints/EditAllComplaints';

import EmployUserDashboardio from "./components/./Supervisor/ioo/EmployUserDashboard"



// Employ
import IoEmployLayout from './components/Supervisor/ioo/Employ/Layout';
import IoEmployDashboard from './components/Supervisor/ioo/Employ/Dashboard';
import IoEmployComplaints from './components/Supervisor/ioo/Employ/Complaints';

import IoEmployUserManagement from './components/Supervisor/ioo/Employ/UserManagement';
import IoEmployAddFiles from './components/Supervisor/ioo/Employ/ViewLeaveFiels/AddFiles';
import IoEmployViewFiles from './components/Supervisor/ioo/Employ/ViewLeaveFiels/ViewFiles';
import IoViewFielsById from './components/Supervisor/ioo/Employ/ViewLeaveFiels/ViewFielsById';


import IoViewPersonalFiles from './components/Supervisor/ioo/Employ/PersonalFiles/ViewPersonalFiles';
import IoAddPersonalFiles from "./components/Supervisor/ioo/Employ/PersonalFiles//AddpersonalFiles"
import IoPersonalFileById from './components/Supervisor/ioo/Employ/PersonalFiles/PersonalFileById';

import IoPendingFiles from './components/Supervisor/ioo/Employ/PendingFiles/PendingFiles';
import IoPendingFileBYId from './components/Supervisor/ioo/Employ/PendingFiles/PendingFileBYId';






// Supervisor 
// SubRole -> dea-assis
import SupervisorLayoutdea from './components/Supervisor/dea-assis/Layout';
import SupervisorDashboarddea from './components/Supervisor/dea-assis/Dashboard';
import SupervisorComplaintsdea from './components/Supervisor/dea-assis/Complaints';
import SupervisorProgressRegisterdea from './components/Supervisor/dea-assis/ProgressRegister';
import SupervisorSearchReportsdea from './components/Supervisor/dea-assis/SearchReports';
import SupervisorViewComplaintsdea from './components/Supervisor/dea-assis/ViewComplaints';
import SupervisorPendingComplaintsdea from './components/Supervisor/dea-assis/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsdea from './components/Supervisor/dea-assis/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsdea from './components/Supervisor/dea-assis/Pending-complaints/ViewPendingComplaints';

import SupervisorApprovedComplaintsdea from './components/Supervisor/dea-assis/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintsdea from './components/Supervisor/dea-assis/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintsdea from './components/Supervisor/dea-assis/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsdea from './components/Supervisor/dea-assis/All-complaints/AllComplaits';
import SupervisorViewAllComplaintdea from './components/Supervisor/dea-assis/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsdea from './components/Supervisor/dea-assis/All-complaints/EditAllComplaints';

//Lok-ayukt
import LokayuktLayout from './components/LokAyukta/Layout';
import LokayuktDashboard from './components/LokAyukta/Dashboard';
import LokayuktComplaints from './components/LokAyukta/Complaints';
import LokayuktProgressRegister from './components/LokAyukta/ProgressRegister';
import LokayuktSearchReports from './components/LokAyukta/SearchReports';
import LokayuktViewComplait from './components/LokAyukta/ViewComplaints';
import LokayuktAllComplaits from './components/LokAyukta/All-complaints/AllComplaits';
import LokayuktViewAllComplaint from './components/LokAyukta/All-complaints/ViewwAllComplaint';
import LokayuktPendingComplaints from './components/LokAyukta/Pending-complaints/PendingComplaints';
import LokayuktViewPendingComplaints from './components/LokAyukta/Pending-complaints/ViewPendingComplaints';
import LokayuktApprovedComplaints from './components/LokAyukta/Approved-complaints/ApprovedComplaints';
import LokayuktViewApprovedComplaint from './components/LokAyukta/Approved-complaints/ViewApprovedComplaints';

// import LokayuktUserManagement from './components/LokAyukta/UserManagement';
import LokayuktUserManagement from './components/LokAyukta/UserManagement';
import LokayuktAddUserManagement from './components/LokAyukta/AddUserManagement';
import LokayuktEditUserManagement from './components/LokAyukta/EditUserManagment';
import LokayuktMasterData from './components/LokAyukta/MasterData';



// import PsLayout from './components/PersonalSecretary/Layout';
// import PsDashboard from './components/PersonalSecretary/Dashboard';
// import PsComplaints from './components/PersonalSecretary/Complaints';
// import PsProgressRegister from './components/PersonalSecretary/ProgressRegister';
// import PsSearchReports from './components/PersonalSecretary/SearchReports';
// import PsViewComplait from './components/PersonalSecretary/ViewComplaints';
// import PsAllComplaits from './components/PersonalSecretary/All-complaints/AllComplaits';
// import PsViewAllComplaint from './components/PersonalSecretary/All-complaints/ViewwAllComplaint';
// import PsPendingComplaints from './components/PersonalSecretary/Pending-complaints/PendingComplaints';
// import PsViewPendingComplaints from './components/PersonalSecretary/Pending-complaints/ViewPendingComplaints';
// import PsApprovedComplaints from './components/PersonalSecretary/Approved-complaints/ApprovedComplaints';
// import PsViewApprovedComplaint from './components/PersonalSecretary/Approved-complaints/ViewApprovedComplaints';

// import LokayuktUserManagement from './components/PersonalSecretary/UserManagement';
// import PsUserManagement from './components/PersonalSecretary/UserManagement';
// import PddUserManagement from './components/PersonalSecretary/AddUserManagement';
// import LokayuktEditUserManagement from './components/PersonalSecretary/EditUserManagment';
// import LokayuktMasterData from './components/PersonalSecretary/MasterData';

//UpLok-ayukt
import UpLokayuktLayout from './components/UPLokAyukta/Layout';
import UpLokayuktDashboard from './components/UPLokAyukta/Dashboard';
import UpLokayuktComplaints from './components/UPLokAyukta/Complaints';
import UpLokayuktProgressRegister from './components/UPLokAyukta/ProgressRegister';
import UpLokayuktSearchReports from './components/UPLokAyukta/SearchReports';
import UpLokayuktViewComplait from './components/UPLokAyukta/ViewComplaints';
import UpLokayuktAllComplaits from './components/UPLokAyukta/All-complaints/AllComplaits';
import UpLokayuktViewAllComplaint from './components/UPLokAyukta/All-complaints/ViewwAllComplaint';
import UpLokayuktPendingComplaints from './components/UPLokAyukta/Pending-complaints/PendingComplaints';
import UpLokayuktViewPendingComplaints from './components/UPLokAyukta/Pending-complaints/ViewPendingComplaints';
import UpLokayuktApprovedComplaints from './components/UPLokAyukta/Approved-complaints/ApprovedComplaints';
import UpLokayuktViewApprovedComplaint from './components/UPLokAyukta/Approved-complaints/ViewApprovedComplaints';


import Login from './components/Login';
import LokayuktReporting from './components/LokAyukta/Reporting';



// PS Route
import Layout from "./components/Ps/Layout";
import Dashboard from "./components/Ps/Dashboard";
import Complaints from './components/Ps/Complaints';
import AllComplaints from './components/Ps/All-complaints/AllComplaits';
import ViewAllComplaint from './components/Ps/All-complaints/ViewAllComplaint';
import PendingComplaints from './components/Ps/Pending-complaints/PendingComplaints';
import ViewPendingComplaint from './components/Ps/Pending-complaints/ViewPendingComplaint';
import ApprovedComplaints from './components/Ps/Approved-complaints/ApprovedComplaints';
import ViewApprovedComplaints from './components/Ps/Approved-complaints/ViewApprovedComplaints';
import ScaneLetter from './components/LokAyukta/ScaneLetter';
import EmployeeUserDashboard from './components/Ps/EmployUserDashboard';

// Employ
import PsEmployLayout from './components/Ps/Employ/Layout';
import PsEmployDashboard from './components/Ps/Employ/Dashboard';
import PsEmployComplaints from './components/Ps/Employ/Complaints';
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import PsEmployUserManagement from './components/Ps/Employ/UserManagement';
import PsEmployAddFiles from './components/Ps/Employ/AddFiles';
import PsEmployViewFiles from './components/Ps/Employ/ViewFiles';




  import PsViewPersonalFiles from './components/Ps/Employ/PersonalFiles/ViewPersonalFiles';
import PsAddPersonalFiles from "./components/Ps/Employ/PersonalFiles//AddpersonalFiles"
import PsPersonalFileById from './components/Ps/Employ/PersonalFiles/PersonalFileById';

import PsPendingFiles from './components/Ps/Employ/PendingFiles/PendingFiles';
import PsPendingFileBYId from './components/Ps/Employ/PendingFiles/PendingFileBYId';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';



// Aps


// APS Route
import ApsLayout from "./components/Aps/Layout";
import ApsDashboard from "./components/Aps/Dashboard";
import ApsComplaints from './components/Aps/Complaints';
import ApsAllComplaints from './components/Aps/All-complaints/AllComplaits';
import ApsViewAllComplaint from './components/Aps/All-complaints/ViewAllComplaint';
import ApsPendingComplaints from './components/Aps/Pending-complaints/PendingComplaints';
import ApsViewPendingComplaint from './components/Aps/Pending-complaints/ViewPendingComplaint';
import ApsApprovedComplaints from './components/Aps/Approved-complaints/ApprovedComplaints';
import ApsViewApprovedComplaints from './components/Aps/Approved-complaints/ViewApprovedComplaints';
import ApsScaneLetter from './components/LokAyukta/ScaneLetter';
import ApsEmployeeUserDashboard from './components/Aps/EmployUserDashboard';

// Employ
import ApsEmployLayout from './components/Aps/Employ/Layout';
import ApsEmployDashboard from './components/Aps/Employ/Dashboard';
import ApsEmployComplaints from './components/Aps/Employ/Complaints';
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import ApsEmployUserManagement from './components/Aps/Employ/UserManagement';
import ApsEmployAddFiles from './components/Aps/Employ/AddFiles';
import ApsEmployViewFiles from './components/Aps/Employ/ViewFiles';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';








// Dispatch
import DispatchLayout from './components/Dispatch/Layout';
import DispatchDashboard from './components/Dispatch/Dashboard';
import DispatchComplaints from './components/Dispatch/Complaints';
import DispatchProgressRegister from './components/Dispatch/ProgressRegister';
import DispatchSearchReports from './components/Dispatch/SearchReports';
import DispatchViewComplait from './components/Dispatch/ViewComplaints';
import DispatchAllComplaits from './components/Dispatch/All-complaints/AllComplaits';
import DispatchViewAllComplaint from './components/Dispatch/All-complaints/ViewwAllComplaint';
import DispatchPendingComplaints from './components/Dispatch/Pending-complaints/PendingComplaints';
import DispatchViewPendingComplaints from './components/Dispatch/Pending-complaints/ViewPendingComplaints';
import DispatchApprovedComplaints from './components/Dispatch/Approved-complaints/ApprovedComplaints';
import DispatchViewApprovedComplaint from './components/Dispatch/Approved-complaints/ViewApprovedComplaints';
import DispatchReporting from "./components/Dispatch/Reporting"
import DispatchScaneLetter from "./components/Dispatch/ScaneLetter"

// import LokayuktUserManagement from './components/LokAyukta/UserManagement';
import DispatchUserManagement from './components/Dispatch/UserManagement';



import EmployeeUserDashboarddsp from './components/Dispatch/EmployUserDashboard';

// Employ
import DspEmployLayout from './components/Dispatch/Employ/Layout';
import DspEmployDashboard from './components/Dispatch/Employ/Dashboard';
import DspEmployComplaints from './components/Dispatch/Employ/Complaints';
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import DspEmployUserManagement from './components/Dispatch/Employ/UserManagement';
import DspEmployAddFiles from './components/Dispatch/Employ/AddFiles';
import DspEmployViewFiles from './components/Dispatch/Employ/ViewFiles';


// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';






// import DispatchAddUserManagement from './components/Dispatch/AddUserManagement';
// import LokayuktEditUserManagement from './components/LokAyukta/EditUserManagment';
// import LokayuktMasterData from './components/LokAyukta/MasterData';



// Employ Modules steno|assistant-clerk|computer-assistant |car-driver| jamadar|office|farrash|sweeper|gardener|cook|watchman|peon
  import EmployLayout from "./components/Employ/Layout"
  import EmployDashboard from "./components/Employ/Dashboard"
  import EmployComplaints from "./components/Employ/Complaints"
  import EmployAddFiles from "./components/Employ/AddFiles"
  import EmployViewFiles from "./components/Employ/ViewFiles"
  import EmployUserManagement from "./components/Employ/EditUserManagment"



  import EmployViewPersonalFiles from './components/Employ/PersonalFiles/ViewPersonalFiles';
import EmployAddPersonalFiles from "./components/Employ/PersonalFiles//AddpersonalFiles"
import EmployPersonalFileById from './components/Employ/PersonalFiles/PersonalFileById';

import EmployPendingFiles from './components/Employ/PendingFiles/PendingFiles';
import EmployPendingFileBYId from './components/Employ/PendingFiles/PendingFileBYId';
  // import EmployViewPersonalFile from "./components/Employ/"



// TanStack 
const queryClient = new QueryClient();

function App() {
  const role = localStorage.getItem("role");
  const subrole = localStorage.getItem("subrole")

  return (
      <QueryClientProvider client={queryClient}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/*  Admin Routes */}
      {role === 'admin' && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="search-reports/view/:id" element={<AdminViewComplaints />} />
          <Route path="search-reports/edit/:id" element={<AdminEditComplaint />} />
          <Route path="progress-register" element={<AdminProgressRegister />} />
          <Route path="search-reports" element={<AdminSearchReports />} />
          <Route path="user-management" element={<AdminUserManagement />} />
          <Route path="user-management/add" element={<AdminAddUserManagement />} />
          <Route path="user-management/edit/:id" element={<AdminEditUserManagment />} />
          <Route path="master-data" element={<AdminMasterData />} />
          <Route path="file-administrator" element={<AdminFileAdministrator />} />
          <Route path="employment-management" element={<AdminEmploymentManagement />} />
          <Route path="employment-management/:id" element={<AdminViewLeaveFiels />} />
          <Route path="employment-management/add" element={<AdminAddEmploymentManagement />} />
          <Route path="employment-management/edit/:id" element={<AdminEditEmploymentManagement />} />
          <Route path="all-leaves-files" element={<AdminAllLeaveFiels />} />
          <Route path="all-personal-file" element={<AdminAllPersonalFile />} />
          <Route path="all-personal-file/:id" element={<AdminViewPersonalFile />} />
          <Route path="add-personal-file" element={<AdminAddPersonalFile />} />
          <Route path="all-personal-file/permissions/:id" element={<AdminAllPermission />} />


        </Route>
      )}


 {(
  role === 'emp' ||
  role === 'jamadar' ||
  role === 'office' ||
  role === 'farrash' ||
  role === 'sweeper' ||
  role === 'gardener' ||
  role === 'cook' ||
  role === 'watchman' ||
  role === 'peon' ||
  role === 'steno' ||
  role === 'assistant-clerk' ||
  role === 'computer-assistant' ||
  role === 'orderly/jamadar' ||
  role === 'car-driver'
) && (
  <Route path="/employee" element={<EmployLayout />}>
    <Route path="dashboard" element={<EmployDashboard />} />
    <Route path="complaints" element={<EmployComplaints />} />
    <Route path="add-files" element={<EmployAddFiles />} />
    <Route path="view-files" element={<EmployViewFiles />} />
    <Route path="user-management" element={<EmployUserManagement />} />



    
                <Route path="view-personal-files" element={<EmployViewPersonalFiles />} />
          <Route path="add-personal-files" element={<EmployAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<EmployPersonalFileById />} />
          <Route path="view-pending-files" element={<EmployPendingFiles />} />
          <Route path="view-pending-files/:id" element={<EmployPendingFileBYId />} />
  </Route>
)}
      {/*  Operator Routes */}
      {role === 'operator' && (
        <>  


      <Route path="/employee" element={<OperatorEmployLayout />}>
          <Route path="dashboard" element={<OperatorEmployDashboard />} />
          <Route path="complaints" element={<OperatorEmployComplaints />} />
          <Route path="add-files" element={<OperatorEmployAddFiles />} />
          <Route path="view-files" element={<OperatorEmployViewFiles />} />
          <Route path="user-management" element={<OperatorEmployUserManagement />} />
          <Route path="view-personal-files" element={<OperatorEmployViewPersonalFile />} />




                <Route path="view-personal-files" element={<OperatorViewPersonalFiles />} />
          <Route path="add-personal-files" element={<OperatorAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<OperatorPersonalFileById />} />
          <Route path="view-pending-files" element={<OperatorPendingFiles />} />
          <Route path="view-pending-files/:id" element={<OperatorPendingFileBYId />} />
       
        </Route>
          <Route path="main-dashboard" element={<OperatorEmployUserDashboard />} />


        <Route path="/operator" element={<OperatorLayout />}>
          <Route path="dashboard" element={<OperatorDashboard />} />
          <Route path="complaints" element={<OperatorComplaints />} />
          <Route path="progress-register" element={<OperatorProgressRegister />} />
          <Route path="search-reports" element={<OperatorSearchReports />} />
          <Route path="search-reports/view/:id" element={<OperatorViewComplaints />} />
             <Route path="search-reports/edit/:id" element={<OperatorEditComplaints />} />
             <Route path="approved-complaints/edit/:id" element={<OperatorEditApprovedCoplaints />} />
             <Route path="pending-complaints/edit/:id" element={<OperatorEditPendingComplaints />} />
             <Route path="all-complaints/edit/:id" element={<OperatorAllComplaintsEdit />} />
             <Route path="all-complaints" element={<OperatorAllComplaits />} />
            <Route path="all-complaints/view/:id" element={<OperatorViewAllComplaint />} />
            <Route path="pending-complaints/view/:id" element={<OperatorViewPendingComplaint />} />
            <Route path="approved-complaints/view/:id" element={<OperatorViewApprovedComplaints />} />
             <Route path="pending-complaints" element={<OperatorPendingComplaints />} />
             <Route path="approved-complaints" element={<OperatorApprovedComplaints />} />
             <Route path="draft" element={<AllDraft />} />
             <Route path="draft/view/:id" element={<ViewDraft />} />
             <Route path="draft/edit/:id" element={<EditDraft />} />
             <Route path="rc-log" element={<RcLog />} />
             <Route path="reporting" element={<Reporting />} />

             {/* <Route path="/operator/complaints/Cheekdublicate" element={<Cheekdublicate />} /> */}

        </Route>
        </>
      )}
      
       {/* Supervisor  Routes */}
       {/* so-us */}
      {/* {role === 'supervisor' && subrole === 'so-us' &&(
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="complaints" element={<SupervisorComplaints />} />
          <Route path="progress-register" element={<SupervisorProgressRegister />} />
          <Route path="search-reports" element={<SupervisorSearchReports />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaints />} />
          

          <Route path="all-complaints" element={<SupervisorAllComplaits />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaint />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaints />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaints />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaints />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaints />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaints />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaints />} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaints />} /> 
        </Route>
      )} */}


       {/* Supervisor  Routes */}
       {/* ds-js */}

         {role === 'supervisor' && subrole === 'dsss' && (
        <Route path="/supervisor" element={<SupervisorLayoutro />}>
          <Route path="dashboard" element={<SupervisorDashboardro />} />
          <Route path="complaints" element={<SupervisorComplaintsro />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterro />} />
          <Route path="search-reports" element={<SupervisorSearchReportsro />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsro />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsro />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintro />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsro />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsro />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsro />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsro />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsro />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintro/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintro />} /> 
        </Route>
      )}

      {/* DS */}
      {role === 'supervisor' && subrole === 'ds' && (

        <>

                 <Route path="/employee" element={<DsEmployLayout />}>
          <Route path="dashboard" element={<DsEmployDashboard />} />
          <Route path="complaints" element={<DsEmployComplaints />} />
          <Route path="add-files" element={<DsEmployAddFiles />} />
          <Route path="view-files" element={<DsEmployViewFiles />} />
          <Route path="user-management" element={<DsEmployUserManagement />} />



            <Route path="view-files/:id" element={<DsViewFielsById />} />

            <Route path="view-personal-files" element={<DsViewPersonalFiles />} />
          <Route path="add-personal-files" element={<DsAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<DsPersonalFileById />} />
          <Route path="view-pending-files" element={<DsPendingFiles />} />
          <Route path="view-pending-files/:id" element={<DsPendingFileBYId />} />
       
        </Route>
          <Route path="main-dashboard" element={<EmployUserDashboardds />} />

        <Route path="/supervisor" element={<SupervisorLayoutds />}>
          <Route path="dashboard" element={<SupervisorDashboardds />} />
          <Route path="complaints" element={<SupervisorComplaintsds />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterds />} />
          <Route path="search-reports" element={<SupervisorSearchReportsds />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsds />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsds />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintds />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsds />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsds />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsds />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsds />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsds />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintds/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintds />} /> 
        </Route>
        </>
      )}



        {/* JS */}
      {role === 'supervisor' && subrole === 'js' && (
        <>

        
               <Route path="/employee" element={<JsEmployLayout />}>
          <Route path="dashboard" element={<JsEmployDashboard />} />
          <Route path="complaints" element={<JsEmployComplaints />} />
          <Route path="add-files" element={<JsEmployAddFiles />} />
          <Route path="view-files" element={<JsEmployViewFiles />} />
          <Route path="user-management" element={<JsEmployUserManagement />} />



            <Route path="view-files/:id" element={<JsViewFielsById />} />

            <Route path="view-personal-files" element={<JsViewPersonalFiles />} />
          <Route path="add-personal-files" element={<JsAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<JsPersonalFileById />} />
          <Route path="view-pending-files" element={<JsPendingFiles />} />
          <Route path="view-pending-files/:id" element={<JsPendingFileBYId />} />
       
        </Route>
          <Route path="main-dashboard" element={<EmployUserDashboardjs />} />

        <Route path="/supervisor" element={<SupervisorLayoutjs />}>
          <Route path="dashboard" element={<SupervisorDashboardjs />} />
          <Route path="complaints" element={<SupervisorComplaintsjs />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterjs />} />
          <Route path="search-reports" element={<SupervisorSearchReportsjs />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsjs />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsjs />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintjs />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsjs />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsjs />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsjs />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsjs />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsjs />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintjs/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintjs />} /> 
        </Route>
        </>
      )}


        {/* US */}
      {role === 'supervisor' && subrole === 'us' && (

        <>

        
             <Route path="/employee" element={<UsEmployLayout />}>
          <Route path="dashboard" element={<UsEmployDashboard />} />
          <Route path="complaints" element={<UsEmployComplaints />} />
          <Route path="add-files" element={<UsEmployAddFiles />} />
          <Route path="view-files" element={<UsEmployViewFiles />} />
          <Route path="user-management" element={<UsEmployUserManagement />} />



            <Route path="view-files/:id" element={<UsViewFielsById />} />

            <Route path="view-personal-files" element={<UsViewPersonalFiles />} />
          <Route path="add-personal-files" element={<UsAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<UsPersonalFileById />} />
          <Route path="view-pending-files" element={<UsPendingFiles />} />
          <Route path="view-pending-files/:id" element={<UsPendingFileBYId />} />
       
        </Route>

          <Route path="main-dashboard" element={<EmployUserDashboardus />} />


        <Route path="/supervisor" element={<SupervisorLayoutus />}>
          <Route path="dashboard" element={<SupervisorDashboardus />} />
          <Route path="complaints" element={<SupervisorComplaintsus />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterus />} />
          <Route path="search-reports" element={<SupervisorSearchReportsus />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsus />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsus />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintus />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsus />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsus />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsus />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsus />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsus />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintus/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintus />} /> 
        </Route>
        </>
      )}


         {/* US No */}
      {role === 'supervisor' && subrole === 'us' && (
        <Route path="/supervisor" element={<SupervisorLayoutjs />}>
          <Route path="dashboard" element={<SupervisorDashboardjs />} />
          <Route path="complaints" element={<SupervisorComplaintsjs />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterjs />} />
          <Route path="search-reports" element={<SupervisorSearchReportsjs />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsjs />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsjs />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintjs />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsjs />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsjs />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsjs />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsjs />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsjs />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintjs/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintjs />} /> 
        </Route>
      )}

      {/** RO/ARO */}
         {role === 'supervisor' && subrole === 'ro-aro' && (
          <>

            <Route path="/employee" element={<RoAroEmployLayout />}>
          <Route path="dashboard" element={<RoAroEmployDashboard />} />
          <Route path="complaints" element={<RoAroEmployComplaints />} />
          <Route path="add-files" element={<RoAroEmployAddFiles />} />
          <Route path="view-files" element={<RoAroEmployViewFiles />} />
          <Route path="user-management" element={<RoAroEmployUserManagement />} />
          <Route path="view-files/:id" element={<RoAroViewFielsById />} />
          <Route path="view-personal-files" element={<RoAroViewPersonalFiles />} />
          <Route path="add-personal-files" element={<RoAroAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<RoAroPersonalFileById />} />
          <Route path="view-pending-files" element={<RoAroPendingFiles />} />
          <Route path="view-pending-files/:id" element={<RoAroPendingFileBYId />} />



       
        </Route>

          <Route path="main-dashboard" element={<EmployUserDashboardroaro />} />


        <Route path="/supervisor" element={<SupervisorLayoutro />}>
          <Route path="dashboard" element={<SupervisorDashboardro />} />
          <Route path="complaints" element={<SupervisorComplaintsro />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterro />} />
          <Route path="search-reports" element={<SupervisorSearchReportsro />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsro />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsro />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintro />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsro />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsro />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsro />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsro />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsro />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintro/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintro />} /> 
        </Route>
          </>
      )}




         {role === 'supervisor' && subrole === 'so' && (
          <>

            <Route path="/employee" element={<SoEmployLayout />}>
          <Route path="dashboard" element={<SoEmployDashboard />} />
          <Route path="complaints" element={<SoEmployComplaints />} />
          <Route path="add-files" element={<SoEmployAddFiles />} />
          <Route path="view-files" element={<SoEmployViewFiles />} />
          <Route path="user-management" element={<SoEmployUserManagement />} />
          <Route path="view-files/:id" element={<SoViewFielsById />} />
          <Route path="view-personal-files" element={<SoViewPersonalFiles />} />
          <Route path="add-personal-files" element={<SoAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<SoPersonalFileById />} />
          <Route path="view-pending-files" element={<SoPendingFiles />} />
          <Route path="view-pending-files/:id" element={<SoPendingFileBYId />} />



       
        </Route>

          <Route path="main-dashboard" element={<EmployUserDashboardso />} />


        <Route path="/supervisor" element={<SupervisorLayoutso />}>
          <Route path="dashboard" element={<SupervisorDashboardso  />} />
          <Route path="complaints" element={<SupervisorComplaintsso />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterso />} />
          <Route path="search-reports" element={<SupervisorSearchReportsso />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsso />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsso />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintso />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsso />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsso />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsso />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsso />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsso />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintso/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintso />} /> 
        </Route>
          </>
      )}


          {role === 'supervisor' && subrole === 'pro' && (
          <>

            <Route path="/employee" element={<ProEmployLayout />}>
          <Route path="dashboard" element={<ProEmployDashboard />} />
          <Route path="complaints" element={<ProEmployComplaints />} />
          <Route path="add-files" element={<ProEmployAddFiles />} />
          <Route path="view-files" element={<ProEmployViewFiles />} />
          <Route path="user-management" element={<ProEmployUserManagement />} />
          <Route path="view-files/:id" element={<ProViewFielsById />} />
          <Route path="view-personal-files" element={<ProViewPersonalFiles />} />
          <Route path="add-personal-files" element={<ProAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<ProPersonalFileById />} />
          <Route path="view-pending-files" element={<ProPendingFiles />} />
          <Route path="view-pending-files/:id" element={<ProPendingFileBYId />} />



       
        </Route>

          <Route path="main-dashboard" element={<EmployUserDashboardpro />} />


        <Route path="/supervisor" element={<SupervisorLayoutpro />}>
          <Route path="dashboard" element={<SupervisorDashboardpro  />} />
          <Route path="complaints" element={<SupervisorComplaintspro />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterpro />} />
          <Route path="search-reports" element={<SupervisorSearchReportspro />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintspro />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitspro />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintpro />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintspro />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintspro />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintspro />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintspro />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintspro />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintpro/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintpro />} /> 
        </Route>
          </>
      )}



          {/** ARO */}
         {role === 'supervisor' && subrole === 'ro' && (
          <>


          
            <Route path="/employee" element={<AroEmployLayout />}>
          <Route path="dashboard" element={<AroEmployDashboard />} />
          <Route path="complaints" element={<AroEmployComplaints />} />
          <Route path="add-files" element={<AroEmployAddFiles />} />
          <Route path="view-files" element={<AroEmployViewFiles />} />
          <Route path="user-management" element={<AroEmployUserManagement />} />


            <Route path="view-files/:id" element={<AroViewFielsById />} />
            <Route path="view-personal-files" element={<AroViewPersonalFiles />} />
          <Route path="add-personal-files" element={<AroAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<AroPersonalFileById />} />
          <Route path="view-pending-files" element={<AroPendingFiles />} />
          <Route path="view-pending-files/:id" element={<AroPendingFileBYId />} />

          
       
        </Route>

          <Route path="main-dashboard" element={<EmployUserDashboardaro />} />



        <Route path="/supervisor" element={<SupervisorLayoutaro />}>
          <Route path="dashboard" element={<SupervisorDashboardaro />} />
          <Route path="complaints" element={<SupervisorComplaintsaro />} />
          <Route path="progress-register" element={<SupervisorProgressRegisteraro />} />
          <Route path="search-reports" element={<SupervisorSearchReportsaro />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsaro />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsaro />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintaro />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsaro />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsaro />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsaro />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsaro />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsaro />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintaro/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintaro />} /> 
        </Route>
          </>
      )}


   {/* Supervisor  Routes */}
       {/* sec */}
       {role === 'supervisor' && subrole === 'sec' && (
        <>


               <Route path="/employee" element={<SecEmployLayout />}>
          <Route path="dashboard" element={<SecEmployDashboard />} />
          <Route path="complaints" element={<SecEmployComplaints />} />
          <Route path="add-files" element={<SecEmployAddFiles />} />
          <Route path="view-files" element={<SecEmployViewFiles />} />
          <Route path="user-management" element={<SecEmployUserManagement />} />



            <Route path="view-files/:id" element={<SecViewFielsById />} />

            <Route path="view-personal-files" element={<SecViewPersonalFiles />} />
          <Route path="add-personal-files" element={<SecAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<SecPersonalFileById />} />
          <Route path="view-pending-files" element={<SecPendingFiles />} />
          <Route path="view-pending-files/:id" element={<SecPendingFileBYId />} />
       
        </Route>
          <Route path="main-dashboard" element={<EmployUserDashboardsec />} />


        <Route path="/supervisor" element={<SupervisorLayoutsec />}>
          <Route path="dashboard" element={<SupervisorDashboardsec />} />
          <Route path="complaints" element={<SupervisorComplaintssec />} />
          <Route path="progress-register" element={<SupervisorProgressRegistersec />} />
          <Route path="search-reports" element={<SupervisorSearchReportssec />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintssec />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitssec />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintsec />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintssec />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintssec />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintssec />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintssec />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintssec />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintssec />} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintssec />} /> 
        </Route>
        </>
      )}


   {/* Supervisor  Routes */}
       {/*cio-io*/}
      
     {role === 'supervisor' && subrole === 'cio-io' && (

      
      <>

          <Route path="/employee" element={<CioEmployLayout />}>
          <Route path="dashboard" element={<CioEmployDashboard />} />
          <Route path="complaints" element={<CioEmployComplaints />} />
          <Route path="add-files" element={<CioEmployAddFiles />} />
          <Route path="view-files" element={<CioEmployViewFiles />} />
          <Route path="user-management" element={<CioEmployUserManagement />} />


            <Route path="view-files/:id" element={<CioViewFielsById />} />

            <Route path="view-personal-files" element={<CioViewPersonalFiles />} />
          <Route path="add-personal-files" element={<CioAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<CioPersonalFileById />} />
          <Route path="view-pending-files" element={<CioPendingFiles />} />
          <Route path="view-pending-files/:id" element={<CioPendingFileBYId />} />
       
        </Route>

          <Route path="main-dashboard" element={<EmployUserDashboardcio />} />


        <Route path="/supervisor" element={<SupervisorLayoutcio />}>
          <Route path="dashboard" element={<SupervisorDashboardcio />} />
          <Route path="complaints" element={<SupervisorComplaintscio />} />
          <Route path="progress-register" element={<SupervisorProgressRegistercio />} />
          <Route path="search-reports" element={<SupervisorSearchReportscio />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintscio />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitscio />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintcio />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintscio />} />

          {/* <Route path="pending-complaints" element={<SupervisorPendingComplaintscio />} /> */}
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintscio />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintscio />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintscio />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintscio />} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintscio/>} /> 
        </Route>
      </>
      )} 


          {/*io*/}
      
     {role === 'supervisor' && subrole === 'io' && (
      <>


      

            <Route path="/employee" element={<IoEmployLayout />}>
          <Route path="dashboard" element={<IoEmployDashboard />} />
          <Route path="complaints" element={<IoEmployComplaints />} />
          <Route path="add-files" element={<IoEmployAddFiles />} />
          <Route path="view-files" element={<IoEmployViewFiles />} />
          <Route path="user-management" element={<IoEmployUserManagement />} />


            <Route path="view-files/:id" element={<IoViewFielsById />} />

            <Route path="view-personal-files" element={<IoViewPersonalFiles />} />
          <Route path="add-personal-files" element={<IoAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<IoPersonalFileById />} />
          <Route path="view-pending-files" element={<IoPendingFiles />} />
          <Route path="view-pending-files/:id" element={<IoPendingFileBYId />} />
       
        </Route>

          <Route path="main-dashboard" element={<EmployUserDashboardio />} />

        <Route path="/supervisor" element={<SupervisorLayoutio />}>
          <Route path="dashboard" element={<SupervisorDashboardio />} />
          <Route path="complaints" element={<SupervisorComplaintsio />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterio />} />
          <Route path="search-reports" element={<SupervisorSearchReportsio />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsio />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsio />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintio />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsio />} />

          {/* <Route path="pending-complaints" element={<SupervisorPendingComplaintsio />} /> */}
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsio />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsio />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsio />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintsio />} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintsio/>} /> 
        </Route>
      </>
      )}


   {/* Supervisor  Routes */}
       {/* dea-assis*/}
    
     {role === 'supervisor' && subrole === 'dea-assis' && (
        <Route path="/supervisor" element={<SupervisorLayoutdea />}>
          <Route path="dashboard" element={<SupervisorDashboarddea />} />
          <Route path="complaints" element={<SupervisorComplaintsdea />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterdea />} />
          <Route path="search-reports" element={<SupervisorSearchReportsdea />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsdea />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsdea />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintdea />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsdea />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsdea />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsdea />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsdea />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsdea />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintsdea />} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintsdea />} /> 
        </Route>
      )} 

        {/* Lok-ayukt  Routes */}
      {role === 'lok-ayukt' && (
        <Route path="/lokayukt" element={<LokayuktLayout />}>
           <Route path="dashboard" element={<LokayuktDashboard />} />
          <Route path="complaints" element={<LokayuktComplaints />} />
          <Route path="progress-register" element={<LokayuktProgressRegister />} />
          <Route path="search-reports" element={<LokayuktSearchReports />} />
          <Route path="search-reports/view/:id" element={<LokayuktViewComplait />} />

          <Route path="all-complaints" element={<LokayuktAllComplaits />} />
          <Route path="all-complaints/view/:id" element={<LokayuktViewAllComplaint />} />
          {/* <Route path="all-complaints/edit/:id" element={<LokayuktEditComplaints />} /> */}

          <Route path="pending-complaints" element={<LokayuktPendingComplaints />} />
          <Route path="pending-complaints/view/:id" element={<LokayuktViewPendingComplaints />} />
          {/* <Route path="pending-complaints/edit/:id" element={<LokayuktEditPendingComplaints />} /> */}

          <Route path="approved-complaints" element={<LokayuktApprovedComplaints />} />   
          <Route path="approved-complaints/view/:id" element={<LokayuktViewApprovedComplaint/>} />
          {/* <Route path="approved-complaints/edit/:id" element={<LokayuktEditApprovedComplaint />} /> */}


                   <Route path="user-management" element={<LokayuktUserManagement />} />
                    <Route path="user-management/add" element={<LokayuktAddUserManagement />} />
                    <Route path="user-management/edit/:id" element={<LokayuktEditUserManagement />} />
                    <Route path="master-data" element={<LokayuktMasterData />} />
                    <Route path="reporting" element={<LokayuktReporting />} />       
                    <Route path="scane-letter" element={<ScaneLetter />} />       


         
        </Route>
      )}

      
      {role === 'ps' && (
        <>


         <Route path="/employee" element={<PsEmployLayout />}>
          <Route path="dashboard" element={<PsEmployDashboard />} />
          <Route path="complaints" element={<PsEmployComplaints />} />
          <Route path="add-files" element={<PsEmployAddFiles />} />
          <Route path="view-files" element={<PsEmployViewFiles />} />
          <Route path="user-management" element={<PsEmployUserManagement />} />



                  <Route path="view-personal-files" element={<PsViewPersonalFiles />} />
          <Route path="add-personal-files" element={<PsAddPersonalFiles />} />
          <Route path="view-personal-files/:id" element={<PsPersonalFileById />} />
          <Route path="view-pending-files" element={<PsPendingFiles />} />
          <Route path="view-pending-files/:id" element={<PsPendingFileBYId />} />
       
        </Route>
           <Route path="main-dashboard" element={<EmployeeUserDashboard />} />
        <Route path="/ps" element={<Layout />}>

       

           <Route path="dashboard" element={<Dashboard/>} />
          <Route path="complaints" element={<Complaints />} />
          {/* <Route path="progress-register" element={<pro />} />
          <Route path="search-reports" element={<PsSearchReports />} />
          <Route path="search-reports/view/:id" element={<PsViewComplait />} /> */}

          <Route path="all-complaints" element={<AllComplaints />} />
          <Route path="all-complaints/view/:id" element={<ViewAllComplaint />} />
        

          <Route path="pending-complaints" element={<PendingComplaints />} />
          <Route path="pending-complaints/view/:id" element={<ViewPendingComplaint />} />
          

          <Route path="approved-complaints" element={<ApprovedComplaints />} />   
          <Route path="approved-complaints/view/:id" element={<ViewApprovedComplaints/>} />
    


              
                    {/* <Route path="master-data" element={<PsMasterData />} />
                    <Route path="reporting" element={<PsReporting />} /> */}
         
        </Route>
        </>
      )}


       {role === 'aps' && (
        <>


         <Route path="/employee" element={<ApsEmployLayout />}>
          <Route path="dashboard" element={<ApsEmployDashboard />} />
          <Route path="complaints" element={<ApsEmployComplaints />} />
          <Route path="add-files" element={<ApsEmployAddFiles />} />
          <Route path="view-files" element={<ApsEmployViewFiles />} />
          <Route path="user-management" element={<ApsEmployUserManagement />} />
       
        </Route>
           <Route path="main-dashboard" element={<ApsEmployeeUserDashboard />} />
        <Route path="/aps" element={<ApsLayout />}>

       

           <Route path="dashboard" element={<ApsDashboard/>} />
          <Route path="complaints" element={<ApsComplaints />} />
          {/* <Route path="progress-register" element={<pro />} />
          <Route path="search-reports" element={<PsSearchReports />} />
          <Route path="search-reports/view/:id" element={<PsViewComplait />} /> */}

          <Route path="all-complaints" element={<ApsAllComplaints />} />
          <Route path="all-complaints/view/:id" element={<ApsViewAllComplaint />} />
        

          <Route path="pending-complaints" element={<ApsPendingComplaints />} />
          <Route path="pending-complaints/view/:id" element={<ApsViewPendingComplaint />} />
          

          <Route path="approved-complaints" element={<ApsApprovedComplaints />} />   
          <Route path="approved-complaints/view/:id" element={<ApsViewApprovedComplaints/>} />
    


              
                    {/* <Route path="master-data" element={<PsMasterData />} />
                    <Route path="reporting" element={<PsReporting />} /> */}
         
        </Route>
        </>
      )}

         {/* UPLok-ayukt  Routes */}
      {role === 'up-lok-ayukt' && (
        <Route path="/uplokayukt" element={<UpLokayuktLayout />}>
           <Route path="dashboard" element={<UpLokayuktDashboard />} />
          <Route path="complaints" element={<UpLokayuktComplaints />} />
          <Route path="progress-register" element={<UpLokayuktProgressRegister />} />
          <Route path="search-reports" element={<UpLokayuktSearchReports />} />
          <Route path="search-reports/view/:id" element={<UpLokayuktViewComplait />} />

          <Route path="all-complaints" element={<UpLokayuktAllComplaits />} />
          <Route path="all-complaints/view/:id" element={<UpLokayuktViewAllComplaint />} />
          {/* <Route path="all-complaints/edit/:id" element={<LokayuktEditComplaints />} /> */}

          <Route path="pending-complaints" element={<UpLokayuktPendingComplaints />} />
          <Route path="pending-complaints/view/:id" element={<UpLokayuktViewPendingComplaints />} />
          {/* <Route path="pending-complaints/edit/:id" element={<LokayuktEditPendingComplaints />} /> */}

          <Route path="approved-complaints" element={<UpLokayuktApprovedComplaints />} />   
          <Route path="approved-complaints/view/:id" element={<UpLokayuktViewApprovedComplaint/>} />
          {/* <Route path="approved-complaints/edit/:id" element={<LokayuktEditApprovedComplaint />} /> */}
         
        </Route>
      )}




      {/* Dispatch */}

        {role === 'dispatch' && (

          <>

             <Route path="/employee" element={<DspEmployLayout />}>
          <Route path="dashboard" element={<DspEmployDashboard />} />
          <Route path="complaints" element={<DspEmployComplaints />} />
          <Route path="add-files" element={<DspEmployAddFiles />} />
          <Route path="view-files" element={<DspEmployViewFiles />} />
          <Route path="user-management" element={<DspEmployUserManagement />} />
       
        </Route>

           <Route path="main-dashboard" element={<EmployeeUserDashboarddsp />} />


        <Route path="/dispatch" element={<DispatchLayout />}>
           <Route path="dashboard" element={<DispatchDashboard />} />
          <Route path="complaints" element={<DispatchComplaints />} />
          <Route path="progress-register" element={<DispatchProgressRegister />} />
          <Route path="search-reports" element={<DispatchSearchReports />} />
          <Route path="search-reports/view/:id" element={<DispatchViewComplait />} />

          <Route path="all-complaints" element={<DispatchAllComplaits />} />
          <Route path="all-complaints/view/:id" element={<DispatchViewAllComplaint />} />
          {/* <Route path="all-complaints/edit/:id" element={<DispatchEditComplaints />} /> */}

          <Route path="pending-complaints" element={<DispatchPendingComplaints />} />
          <Route path="pending-complaints/view/:id" element={<DispatchViewPendingComplaints />} />
          {/* <Route path="pending-complaints/edit/:id" element={<DispatchEditPendingComplaints />} /> */}

          <Route path="approved-complaints" element={<DispatchApprovedComplaints />} />   
          <Route path="approved-complaints/view/:id" element={<DispatchViewApprovedComplaint/>} />
          {/* <Route path="approved-complaints/edit/:id" element={<DispatchEditApprovedComplaint />} /> */}


                   {/* <Route path="user-management" element={<DispatchUserManagement />} /> */}
                    {/* <Route path="user-management/add" element={<DispatchAddUserManagement />} /> */}
                    {/* <Route path="user-management/edit/:id" element={<DispatchEditUserManagement />} /> */}
                    {/* <Route path="master-data" element={<DispatchMasterData />} /> */}
                    <Route path="reporting" element={<DispatchReporting />} />       
                    <Route path="scane-letter" element={<DispatchScaneLetter />} />       


         
        </Route>
          </>
      )}






    </Routes>
    </QueryClientProvider>
  );
}

export default App;
