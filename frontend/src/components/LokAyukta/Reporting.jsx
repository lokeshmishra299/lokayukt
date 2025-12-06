import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaFileAlt,
  FaClock,
  FaPaperPlane,
  FaChartPie,
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaSearch,
} from "react-icons/fa";

const Reporting = () => {
  const [activeTab, setActiveTab] = useState("enrollment");

  // Mock Data
  const enrollmentData = [
    {
      id: 1,
      complaintNo: "CMP/2024/01001",
      caseNo: "LOK/2024/0001",
      date: "10/11/2024",
      district: "Meerut",
      dept: "UPSRTC",
      complainant: "Geeta Rawat",
      nature: "Both",
      status: "With Lokayukta",
    },
    {
      id: 2,
      complaintNo: "CMP/2025/01002",
      caseNo: "LOK/2025/0002",
      date: "10/02/2025",
      district: "Kanpur Nagar",
      dept: "Health Department",
      complainant: "Vinod Chauhan",
      nature: "Allegation",
      status: "With Lokayukta",
    },
    {
      id: 3,
      complaintNo: "CMP/2024/01003",
      caseNo: "LOK/2024/0003",
      date: "04/09/2024",
      district: "Bareilly",
      dept: "Housing Department",
      complainant: "Anita Srivastava",
      nature: "Grievance",
      status: "With Lokayukta",
    },
  ];

  const districtData = [
    { name: "Agra", hindi: "आगरा", total: 6, pending: 5, disposed: 1 },
    { name: "Aligarh", hindi: "अलीगढ़", total: 4, pending: 4, disposed: 0 },
    { name: "Ambedkar Nagar", hindi: "अंबेडकर नगर", total: 2, pending: 2, disposed: 0 },
  ];

  const departmentData = [
    { name: "Food and Civil Supply", type: "State Dept", total: 9, pending: 9, disposed: 0 },
    { name: "Health Department", type: "State Dept", total: 7, pending: 7, disposed: 0 },
    { name: "Nagar Nigam", type: "Local Body", total: 7, pending: 5, disposed: 2 },
  ];

  const natureData = [
    { name: "Allegation", hindi: "आरोप", total: 67, pending: 63, disposed: 4 },
    { name: "Grievance", hindi: "शिकायत", total: 79, pending: 72, disposed: 7 },
    { name: "Both", hindi: "दोनों", total: 74, pending: 66, disposed: 8 },
    { name: "Grand Total", hindi: "", total: 220, pending: 201, disposed: 19, isTotal: true },
  ];

  const overallStats = {
    total: 1250,
    disposed: 450,
    pending: 800,
    rejection: 15,
  };

  const statusBreakdown = [
    { status: "Pending with Dept", count: 320, color: "text-orange-600", bg: "bg-orange-100" },
    { status: "Under Investigation", count: 180, color: "text-blue-600", bg: "bg-blue-100" },
    { status: "Final Report Submitted", count: 150, color: "text-purple-600", bg: "bg-purple-100" },
    { status: "Disposed (Merit)", count: 200, color: "text-green-600", bg: "bg-green-100" },
    { status: "Disposed (Default)", count: 250, color: "text-green-700", bg: "bg-green-200" },
    { status: "Rejected", count: 150, color: "text-red-600", bg: "bg-red-100" },
  ];

  const tabs = [
    { id: "enrollment", label: "Enrollment Date-wise", icon: <FaCalendarAlt /> },
    { id: "district", label: "District-wise", icon: <FaMapMarkerAlt /> },
    { id: "department", label: "Department-wise", icon: <FaBuilding /> },
    { id: "nature", label: "Nature-wise", icon: <FaFileAlt /> },
    { id: "pendency", label: "Investigation Pendency", icon: <FaClock /> },
    { id: "dispatch", label: "Dispatch Register", icon: <FaPaperPlane /> },
    { id: "overall", label: "Overall Status", icon: <FaChartPie /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-20 md:pb-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          Reports / <span className="text-gray-600 font-semibold">रिपोर्टस</span>
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">Generate and export case reports</p>
      </div>

      {/* Tabs Navigation - Scrollable on Mobile */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 mb-6 pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 flex-shrink-0 ${
              activeTab === tab.id
                ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50/50 rounded-t-lg"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-h-[500px]">
        
        {/* 1. Enrollment Date-wise View */}
        {activeTab === "enrollment" && (
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-6">
              Enrollment Date-wise List / पंजीकरण तिथि अनुसार सूची
            </h2>
            
            {/* Filters - Stack on mobile, Row on desktop */}
            <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3 md:gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
                <input type="date" className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5" defaultValue="2024-01-01" />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
                <input type="date" className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5" defaultValue="2025-06-12" />
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FaFilePdf className="text-red-500" /> PDF
                </button>
                <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FaFileExcel className="text-green-600" /> Excel
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">78 case(s) found</p>

            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 whitespace-nowrap">S.No</th>
                      <th className="px-6 py-3 whitespace-nowrap">Complaint No.</th>
                      <th className="px-6 py-3 whitespace-nowrap">Case No.</th>
                      <th className="px-6 py-3 whitespace-nowrap">Enrollment Date</th>
                      <th className="px-6 py-3 whitespace-nowrap">District</th>
                      <th className="px-6 py-3 whitespace-nowrap">Department</th>
                      <th className="px-6 py-3 whitespace-nowrap">Complainant</th>
                      <th className="px-6 py-3 whitespace-nowrap">Nature</th>
                      <th className="px-6 py-3 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollmentData.map((row) => (
                      <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{row.id}</td>
                        <td className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap hover:underline cursor-pointer">{row.complaintNo}</td>
                        <td className="px-6 py-4 text-blue-600 whitespace-nowrap hover:underline cursor-pointer">{row.caseNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.district}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.dept}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.complainant}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 rounded-full bg-gray-100 text-xs border border-gray-200">{row.nature}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">{row.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. District-wise View */}
        {activeTab === "district" && (
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
              District-wise List / जिलेवार सूची
            </h2>
            
            <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3 md:gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
               <div className="w-full sm:flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-500 mb-1">District / जिला</label>
                <select className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option>All Districts</option>
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
                <input type="date" className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5" defaultValue="2024-01-01" />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
                <input type="date" className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5" defaultValue="2025-06-12" />
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FaFilePdf className="text-red-500" /> PDF
                </button>
                <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FaFileExcel className="text-green-600" /> Excel
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-t-lg border-b border-blue-100 mb-0">
                <h3 className="text-sm font-semibold text-gray-700">District Summary / जिला सारांश</h3>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 whitespace-nowrap">District</th>
                    <th className="px-6 py-3 whitespace-nowrap">District (Hindi)</th>
                    <th className="px-6 py-3 text-right whitespace-nowrap">Total</th>
                    <th className="px-6 py-3 text-right text-orange-600 whitespace-nowrap">Pending</th>
                    <th className="px-6 py-3 text-right text-green-600 whitespace-nowrap">Disposed</th>
                  </tr>
                </thead>
                <tbody>
                  {districtData.map((row, idx) => (
                    <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.hindi}</td>
                      <td className="px-6 py-4 text-right font-semibold whitespace-nowrap">{row.total}</td>
                      <td className="px-6 py-4 text-right text-orange-600 font-medium whitespace-nowrap">{row.pending}</td>
                      <td className="px-6 py-4 text-right text-green-600 font-medium whitespace-nowrap">{row.disposed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Department-wise View */}
        {activeTab === "department" && (
           <div>
           <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
             Department-wise List / विभागवार सूची
           </h2>
           <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3 md:gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="w-full sm:flex-1 min-w-[200px]">
               <label className="block text-xs font-medium text-gray-500 mb-1">Department / विभाग</label>
               <select className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                 <option>All Departments</option>
               </select>
             </div>
             <div className="w-full sm:w-auto">
               <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
               <input type="date" className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5" defaultValue="2024-01-01" />
             </div>
             <div className="w-full sm:w-auto">
               <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
               <input type="date" className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5" defaultValue="2025-06-12" />
             </div>
             <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
               <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                 <FaFilePdf className="text-red-500" /> PDF
               </button>
               <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                 <FaFileExcel className="text-green-600" /> Excel
               </button>
             </div>
           </div>

           <div className="overflow-x-auto -mx-4 md:mx-0">
             <table className="w-full text-sm text-left text-gray-500">
               <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                 <tr>
                   <th className="px-6 py-3 whitespace-nowrap">Department</th>
                   <th className="px-6 py-3 whitespace-nowrap">Type</th>
                   <th className="px-6 py-3 text-right whitespace-nowrap">Total</th>
                   <th className="px-6 py-3 text-right text-orange-600 whitespace-nowrap">Pending</th>
                   <th className="px-6 py-3 text-right text-green-600 whitespace-nowrap">Disposed</th>
                 </tr>
               </thead>
               <tbody>
                 {departmentData.map((row, idx) => (
                   <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                     <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                     <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{row.type}</td>
                     <td className="px-6 py-4 text-right font-semibold whitespace-nowrap">{row.total}</td>
                     <td className="px-6 py-4 text-right text-orange-600 font-medium whitespace-nowrap">{row.pending}</td>
                     <td className="px-6 py-4 text-right text-green-600 font-medium whitespace-nowrap">{row.disposed}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
        )}

         {/* 4. Nature-wise View */}
         {activeTab === "nature" && (
           <div>
           <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
             Nature-wise List / प्रकृति अनुसार सूची
           </h2>
           <div className="flex justify-end gap-2 md:gap-4 mb-6">
             <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
               <FaFilePdf className="text-red-500" /> PDF
             </button>
             <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
               <FaFileExcel className="text-green-600" /> Excel
             </button>
           </div>

           <div className="overflow-x-auto -mx-4 md:mx-0">
             <table className="w-full text-sm text-left text-gray-500">
               <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                 <tr>
                   <th className="px-6 py-3 whitespace-nowrap">Nature</th>
                   <th className="px-6 py-3 whitespace-nowrap">प्रकृति</th>
                   <th className="px-6 py-3 text-right whitespace-nowrap">Total Cases</th>
                   <th className="px-6 py-3 text-right text-orange-600 whitespace-nowrap">Pending</th>
                   <th className="px-6 py-3 text-right text-green-600 whitespace-nowrap">Disposed</th>
                 </tr>
               </thead>
               <tbody>
                 {natureData.map((row, idx) => (
                   <tr key={idx} className={`border-b ${row.isTotal ? 'bg-gray-50 font-bold text-gray-900' : 'bg-white hover:bg-gray-50'}`}>
                     <td className="px-6 py-4 whitespace-nowrap">{row.name}</td>
                     <td className="px-6 py-4 whitespace-nowrap">{row.hindi}</td>
                     <td className="px-6 py-4 text-right whitespace-nowrap">{row.total}</td>
                     <td className={`px-6 py-4 text-right whitespace-nowrap ${!row.isTotal && 'text-orange-600'}`}>{row.pending}</td>
                     <td className={`px-6 py-4 text-right whitespace-nowrap ${!row.isTotal && 'text-green-600'}`}>{row.disposed}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
        )}

        {/* 5. Investigation Pendency View */}
        {activeTab === "pendency" && (
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-base md:text-lg font-semibold text-gray-800">
                        Investigation Pendency Report / जांच लंबितता रिपोर्ट
                    </h2>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            <FaFilePdf className="text-red-500" /> PDF
                        </button>
                        <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            <FaFileExcel className="text-green-600" /> Excel
                        </button>
                    </div>
                </div>
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                   <p>Report Preview Area</p>
                </div>
            </div>
        )}

        {/* 6. Dispatch Register View */}
        {activeTab === "dispatch" && (
            <div>
             <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaPaperPlane className="text-gray-600"/> Dispatch Register / प्रेषण रजिस्टर
            </h2>
            
            <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3 md:gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
                <input type="date" className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5" defaultValue="2024-01-01" />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
                <input type="date" className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5" defaultValue="2025-06-30" />
              </div>
               <button className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">
                <FaSearch /> Generate
              </button>
              
              <div className="w-full sm:w-auto sm:flex-1 flex flex-col sm:flex-row justify-end gap-2 mt-2 sm:mt-0">
                 <button className="justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FaPrint className="text-gray-600" /> Print
                </button>
                <button className="justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-800 border border-blue-800 rounded-lg hover:bg-blue-900">
                    <FaFileExcel /> Export Excel
                </button>
              </div>
            </div>

             <div className="overflow-x-auto -mx-4 md:mx-0">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 whitespace-nowrap">SL. No</th>
                            <th className="px-4 py-3 whitespace-nowrap">Dispatch No.</th>
                            <th className="px-4 py-3 whitespace-nowrap">Date</th>
                            <th className="px-4 py-3 whitespace-nowrap">Case Number</th>
                            <th className="px-4 py-3 whitespace-nowrap">Recipient</th>
                            <th className="px-4 py-3 whitespace-nowrap">Letter Type</th>
                            <th className="px-4 py-3 whitespace-nowrap">Mode</th>
                            <th className="px-4 py-3 whitespace-nowrap">Tracking No.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                                Showing 0 of 0 dispatch entries
                            </td>
                        </tr>
                    </tbody>
                 </table>
             </div>
            </div>
        )}

        {/* 7. Overall Status View */}
        {activeTab === "overall" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">
                Overall Complaint Status / कुल शिकायत स्थिति
              </h2>
              <button className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <FaPrint /> <span className="hidden sm:inline">Print Summary</span>
              </button>
            </div>

            {/* Status Summary Cards - 1 col mobile, 2 col tablet, 4 col desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-600 text-sm font-medium mb-1">Total Complaints</h3>
                <span className="text-3xl font-bold text-blue-700">{overallStats.total}</span>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-600 text-sm font-medium mb-1">Pending</h3>
                <span className="text-3xl font-bold text-orange-600">{overallStats.pending}</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-600 text-sm font-medium mb-1">Disposed</h3>
                <span className="text-3xl font-bold text-green-600">{overallStats.disposed}</span>
              </div>
               <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-600 text-sm font-medium mb-1">Rejections</h3>
                <span className="text-3xl font-bold text-red-600">{overallStats.rejection}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
                   <h3 className="font-semibold text-gray-700 text-sm md:text-base">Detailed Status Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-4 md:px-6 py-3 whitespace-nowrap">Status Category</th>
                                <th className="px-4 md:px-6 py-3 text-right whitespace-nowrap">Count</th>
                                <th className="px-4 md:px-6 py-3 text-right whitespace-nowrap">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {statusBreakdown.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${item.color.replace('text', 'bg')}`}></span>
                                            <span className="font-medium text-gray-700 whitespace-nowrap">{item.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right font-semibold text-gray-800 whitespace-nowrap">
                                        {item.count}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right text-gray-500 whitespace-nowrap">
                                        {((item.count / overallStats.total) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 font-bold border-t border-gray-200">
                                <td className="px-4 md:px-6 py-4">Grand Total</td>
                                <td className="px-4 md:px-6 py-4 text-right text-blue-700">{overallStats.total}</td>
                                <td className="px-4 md:px-6 py-4 text-right">100%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Reporting;
