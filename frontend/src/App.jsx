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
import Reporting from './components/Operator/Reporting';




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
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import RoAroEmployUserManagement from './components/Supervisor/ro-aro/Employ/UserManagement';
import RoAroEmployAddFiles from './components/Supervisor/ro-aro/Employ/AddFiles';
import RoAroEmployViewFiles from './components/Supervisor/ro-aro/Employ/ViewFiles';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';

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
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import DsEmployUserManagement from './components/Supervisor/ds/Employ/UserManagement';
import DsEmployAddFiles from './components/Supervisor/ds/Employ/AddFiles';
import DsEmployViewFiles from './components/Supervisor/ds/Employ/ViewFiles';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';

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
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import JsEmployUserManagement from './components/Supervisor/js/Employ/UserManagement';
import JsEmployAddFiles from './components/Supervisor/js/Employ/AddFiles';
import JsEmployViewFiles from './components/Supervisor/js/Employ/ViewFiles';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';

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
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import UsEmployUserManagement from './components/Supervisor/us/Employ/UserManagement';
import UsEmployAddFiles from './components/Supervisor/us/Employ/AddFiles';
import UsEmployViewFiles from './components/Supervisor/us/Employ/ViewFiles';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';


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
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import AroEmployUserManagement from './components/Supervisor/ro/Employ/UserManagement';
import AroEmployAddFiles from './components/Supervisor/ro/Employ/AddFiles';
import AroEmployViewFiles from './components/Supervisor/ro/Employ/ViewFiles';
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


// Employ
import SecEmployLayout from './components/Supervisor/sec/Employ/Layout';
import SecEmployDashboard from './components/Supervisor/sec/Employ/Dashboard';
import SecEmployComplaints from './components/Supervisor/sec/Employ/Complaints';
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import SecEmployUserManagement from './components/Supervisor/sec/Employ/UserManagement';
import SecEmployAddFiles from './components/Supervisor/sec/Employ/AddFiles';
import SecEmployViewFiles from './components/Supervisor/sec/Employ/ViewFiles';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';


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
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import CioEmployUserManagement from './components/Supervisor/cio-io/Employ/UserManagement';
import CioEmployAddFiles from './components/Supervisor/cio-io/Employ/AddFiles';
import CioEmployViewFiles from './components/Supervisor/cio-io/Employ/ViewFiles';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';



// Supervisor 
// SubRole -> io
import SupervisorLayoutio from './components/Supervisor/io/Layout';
import SupervisorDashboardio from './components/Supervisor/io/Dashboard';
import SupervisorComplaintsio from './components/Supervisor/io/Complaints';
import SupervisorProgressRegisterio from './components/Supervisor/io/ProgressRegister';
import SupervisorSearchReportsio from './components/Supervisor/io/SearchReports';
import SupervisorViewComplaintsio from './components/Supervisor/io/ViewComplaints';
// import SupervisorPendingComplaintsio from './components/Supervisors/io-io/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsio from './components/Supervisor/io/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsio from './components/Supervisor/io/Pending-complaints/ViewPendingComplaints';
// import SupervisorViewPendingComplaintsio from './components/Supervisor/io-io/Pending-complaints/ViewPendingComplaints';

import SupervisorApprovedComplaintsio from './components/Supervisor/io/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintsio from './components/Supervisor/io/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintsio from './components/Supervisor/io/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsio from './components/Supervisor/io/All-complaints/AllComplaits';
import SupervisorViewAllComplaintio from './components/Supervisor/io/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsio from './components/Supervisor/io/All-complaints/EditAllComplaints';

import EmployUserDashboardio from "./components/./Supervisor/io/EmployUserDashboard"

// Employ
import ioEmployLayout from './components/Supervisor/io/Employ/Layout';
import ioEmployDashboard from './components/Supervisor/io/Employ/Dashboard';
import ioEmployComplaints from './components/Supervisor/io/Employ/Complaints';
// import EmployProgressRegister from './components/Employ/ProgressRegister';
// import EmploySearchReports from './components/Employ/SearchReports';
import ioEmployUserManagement from './components/Supervisor/io/Employ/UserManagement';
import ioEmployAddFiles from './components/Supervisor/io/Employ/AddFiles';
import ioEmployViewFiles from './components/Supervisor/io/Employ/ViewFiles';
// import EmployMasterData from './components/Employ/MasterData';
// import EmployAddUserManagement from './components/Employ/AddUserManagement';
// import EmployEditUserManagment from './components/Employ/EditUserManagment';
// import EmployViewComplaints from './components/Employ/ViewComplaints';
// import EmployEditComplaint from './components/Employ/EditComplaint';
// import EmployFileAdministrator from './components/Employ/FileAdministrator';





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


        </Route>
      )}


      {/* {role === 'emp ' && (
       
      )} */}
      {/*  Operator Routes */}
      {role === 'operator' && (
        <>  


      <Route path="/employee" element={<OperatorEmployLayout />}>
          <Route path="dashboard" element={<OperatorEmployDashboard />} />
          <Route path="complaints" element={<OperatorEmployComplaints />} />
          <Route path="add-files" element={<OperatorEmployAddFiles />} />
          <Route path="view-files" element={<OperatorEmployViewFiles />} />
          <Route path="user-management" element={<OperatorEmployUserManagement />} />
       
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

         {role === 'supervisor' && subrole === 'ds' && (
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



          {/** ARO */}
         {role === 'supervisor' && subrole === 'ro' && (
          <>


          
            <Route path="/employee" element={<AroEmployLayout />}>
          <Route path="dashboard" element={<AroEmployDashboard />} />
          <Route path="complaints" element={<AroEmployComplaints />} />
          <Route path="add-files" element={<AroEmployAddFiles />} />
          <Route path="view-files" element={<AroEmployViewFiles />} />
          <Route path="user-management" element={<AroEmployUserManagement />} />
       
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


      
          <Route path="/employee" element={<ioEmployLayout />}>
          <Route path="dashboard" element={<ioEmployDashboard />} />
          <Route path="complaints" element={<ioEmployComplaints />} />
          <Route path="add-files" element={<ioEmployAddFiles />} />
          <Route path="view-files" element={<ioEmployViewFiles />} />
          <Route path="user-management" element={<ioEmployUserManagement />} />
       
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
