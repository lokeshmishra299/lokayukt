import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useMemo, Children, useEffect } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
  FaPaperPlane,
  FaChartPie,
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaSpinner,
  FaEye, // ✅ Yahaan add karein
  FaTimes,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast";
import { useRef } from "react";


const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Reporting = () => {
  const [activeTab, setActiveTab] = useState("enrollment");
  const [isExporting, setIsExporting] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
const [pdfViewUrl, setPdfViewUrl] = useState(null);
const [loadingDoc, setLoadingDoc] = useState(null);
const overallPrintRef = useRef(null);


  const [enrollmentFilters, setEnrollmentFilters] = useState({
    fromDate: "",
    toDate: "",
  });
  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [dispatchFilters, setDispatchFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const getDistirct = async () => {
    const res = await api.get("/lokayukt/all-district");
    return res.data.data;
  };

  const { data: allDistrict } = useQuery({
    queryKey: ["all-district"],
    queryFn: getDistirct,
  });

  const enrolmentDateWise = async () => {
    const res = await api.get("/lokayukt/enrolment-date-wise");
    return res.data.data;
  };

  const { data: enrolmentDate, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrolment-date-wise"],
    queryFn: enrolmentDateWise,
  });

  const getDistictData = async () => {
    const res = await api.get("/lokayukt/dist-wise-compliant");
    return res.data.data;
  };

  const { data: districtViseData, isLoading: districtLoading } = useQuery({
    queryKey: ["dist-wise-compliant"],
    queryFn: getDistictData,
  });

  const departmentReport = async () => {
    const res = await api.get("/lokayukt/department-wise-report");
    console.log("department-wise-report", res.data.data);
    return res.data.data;
  };

  const { data: departmentData, isLoading: departmentLoading } = useQuery({
    queryKey: ["department-wise-report"],
    queryFn: departmentReport,
  });

  const dispatchReport = async () => {
    const res = await api.get("/lokayukt/dispatch-report");
    return res.data.data;
  };

  const { data: dispatcheData, isLoading: dispatchLoading } = useQuery({
    queryKey: ["dispatch-report"],
    queryFn: dispatchReport,
  });

  const getoverallStatus = async () => {
    const res = await api.get("/lokayukt/over-all-status");
    console.log("API response:", res.data); // ✅
    return res.data;
  };

  const { data: overallStatusData } = useQuery({
    queryKey: ["over-all-status"],
    queryFn: getoverallStatus,
  });

  // 2. Fetch All Dispatch Letters
  const getAllDispatchLetters = async () => {
    const res = await api.get("/lokayukt/all-dispatch-letters");
    return res.data;
  };

  const { data: dispatchLettersData, isLoading: isLettersLoading } = useQuery({
    queryKey: ["all-dispatch-letters"],
    queryFn: getAllDispatchLetters,
  });

  const lettersList = dispatchLettersData?.data || [];

  const formatDate = (dateString) => {
    if (!dateString) return "NA";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const getComplaintNo = (id) => {
    if (!id) return "NA";
    const found = complainList.find((c) => c.id == id);
    return found ? found.compNo : "NA";
  };

  const getAllComplainsID = async () => {
    const res = await api.get("/lokayukt/all-complain-ids");
    return res.data;
  };

  const { data: complainIdsData } = useQuery({
    queryKey: ["all-complain-ids"],
    queryFn: getAllComplainsID,
  });

  const complainList = complainIdsData?.data || [];

  // `makeFileUrl` function se pehle yeh function add karein
  const normalizePath = (filePath) => {
  if (!filePath) return "";
  let fp = filePath.replace(/^\//, "");
  fp = fp.replace("storage/", "storage/Document/");
  return fp;
};

const makeFileUrl = (filePath) => {
  const root = BASE_URL.replace("/api", "");
  const fixedPath = normalizePath(filePath);
  return `${root}/${fixedPath}`;
};


const handleViewPdf = async (filename, complaintId) => {
  try {
    setLoadingDoc(filename);
    setPdfViewUrl(null); // 🔴 RESET first

    const res = await api.get(
      `/lokayukt/get-file-preview/${complaintId}`
    );

    if (res.data.status && res.data.data?.length > 0) {
      // 🔴 filename unreliable hai → first file hi open karo
      const filePath = res.data.data[0];
      const url = makeFileUrl(filePath);
      setPdfViewUrl(url); // ✅ POPUP OPEN
    } else {
      toast.error("File not found");
    }
  } catch (e) {
    toast.error("PDF open nahi ho pa raha");
  } finally {
    setLoadingDoc(null);
  }
};




//  const handleViewPdf = async (filename) => {
//   try {
//     setLoadingDoc(filename);

//     const res = await api.get(`/lokayukt/get-file-preview/${complaint.id}`);

//     if (res.data.status && res.data.data.length > 0) {
//       const match = res.data.data.find((p) => p.includes(filename));
//       if (match) {
//         const url = makeFileUrl(match);
//         setPdfViewUrl(url); // ⭐ THIS LINE OPENS MODAL
//       }
//     }
//   } finally {
//     setLoadingDoc(null);
//   }
// };


  //   const getpercentage = async () => {
  //   const res = await api.get("/lokayukt/over-all-status");
  //   console.log("API percentsge:", res.data); // ✅
  //   return res.data.percentages;
  // };

  //   const { data: overallPercentage } = useQuery({
  //     queryKey: ["over-all-status"],
  //     queryFn: getpercentage,
  //   });


  const filteredEnrollmentData = useMemo(() => {
    if (!enrolmentDate) return [];
    return enrolmentDate.filter((item) => {
      if (!enrollmentFilters.fromDate && !enrollmentFilters.toDate) return true;
      const itemDate = new Date(item.created_at);
      const from = enrollmentFilters.fromDate
        ? new Date(enrollmentFilters.fromDate)
        : null;
      const to = enrollmentFilters.toDate
        ? new Date(enrollmentFilters.toDate)
        : null;

      if (from && itemDate < from) return false;
      if (to && itemDate > to) return false;
      return true;
    });
  }, [enrolmentDate, enrollmentFilters]);

  const filteredDistrictData = useMemo(() => {
    if (!districtViseData) return [];
    if (districtFilter === "All Districts") return districtViseData;
    return districtViseData.filter(
      (item) =>
        item.district_name === districtFilter ||
        item.district === districtFilter,
    );
  }, [districtViseData, districtFilter]);

  const filteredDepartmentData = useMemo(() => {
    if (!departmentData) return [];
    if (departmentFilter === "All Departments") return departmentData;
    return departmentData.filter(
      (item) => item.department === departmentFilter,
    );
  }, [departmentData, departmentFilter]);

  const filteredDispatchData = useMemo(() => {
    if (!dispatcheData) return [];
    return dispatcheData.filter((item) => {
      if (!dispatchFilters.fromDate && !dispatchFilters.toDate) return true;
      const itemDate = new Date(item.created_at);
      const from = dispatchFilters.fromDate
        ? new Date(dispatchFilters.fromDate)
        : null;
      const to = dispatchFilters.toDate
        ? new Date(dispatchFilters.toDate)
        : null;

      if (from && itemDate < from) return false;
      if (to && itemDate > to) return false;
      return true;
    });
  }, [dispatcheData, dispatchFilters]);

  // const prepareEnrollmentDataForExport = (data) => {
  //   return data.map((item, index) => ({
  //     "S.No": index + 1,
  //     "Complaint No.": item.complain_no || "N/A",
  //     // "Case No.": item.caseNo || "N/A",
  //     "Enrollment Date": item.created_at || "N/A",
  //     "District": item.district_name || "N/A",
  //     "Department": item.department_name || "N/A",
  //     "Complainant": item.complainant_name || "N/A",
  //     "Nature": item.category || "N/A",
  //     "Status": item.status || "N/A"
  //   }));
  // };

  const prepareEnrollmentDataForExport = (data) => {
    return data.map((item, index) => ({
      "S.No": index + 1,
      "Complaint No.": item.complain_no || "N/A",
      "Enrollment Date": item.created_at || "N/A",
      District: item.district_name || "N/A",
      Department: item.department_name || "N/A",
      Complainant: item.complainant_name || "N/A",
      Nature: item.category || "N/A",
      Status: item.status || "N/A",
    }));
  };

  const handleEnrollmentExport = async (type) => {
    const formattedData = prepareEnrollmentDataForExport(
      filteredEnrollmentData,
    );
    if (type === "excel") {
      await exportToExcel(formattedData, "Enrollment_Report");
    } else {
      await exportToPDF(formattedData, "Enrollment_Report");
    }
  };

  // const exportToExcel = async (data, fileName) => {
  //   if (!data || data.length === 0) {
  //     alert("No data to export");
  //     return;
  //   }

  //   setIsExporting(true);
  //   await new Promise(resolve => setTimeout(resolve, 300));

  //   try {
  //       const ws = XLSX.utils.json_to_sheet(data);
  //       const wb = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  //       XLSX.writeFile(wb, `${fileName}.xlsx`);
  //   } catch (error) {
  //       console.error("Excel export failed", error);
  //   } finally {
  //       setIsExporting(false);
  //   }
  // };

  const exportToExcel = async (data, fileName) => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    setExportingExcel(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (error) {
      console.error("Excel export failed", error);
    } finally {
      setExportingExcel(false);
    }
  };

  const exportToPDF = async (data, fileName) => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    setExportingPdf(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      let html = `<h2 style="text-align:center; font-family: sans-serif;">${fileName}</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse; width:100%; font-size:10px; font-family: sans-serif;">
          <thead style="background-color:#f0f0f0;">
            <tr>`;

      const keys = Object.keys(data[0]);
      keys.forEach((key) => {
        html += `<th style="padding:5px; text-align:left;">${key}</th>`;
      });

      html += `</tr></thead><tbody>`;

      data.forEach((row) => {
        html += `<tr>`;
        keys.forEach((key) => {
          html += `<td style="padding:5px;">${row[key]}</td>`;
        });
        html += `</tr>`;
      });

      html += `</tbody></table>`;

      const element = document.createElement("div");
      element.innerHTML = html;

      const opt = {
        margin: 10,
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF export failed", error);
    } finally {
      setExportingPdf(false);
    }
  };

  // const exportToPDF = async (data, fileName) => {
  //   if (!data || data.length === 0) {
  //     alert("No data to export");
  //     return;
  //   }

  //   setIsExporting(true);
  //   await new Promise(resolve => setTimeout(resolve, 300));

  //   try {
  //       let html = `<h2 style="text-align:center; font-family: sans-serif;">${fileName}</h2>
  //         <table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse; width:100%; font-size:10px; font-family: sans-serif;">
  //           <thead style="background-color:#f0f0f0;">
  //             <tr>`;

  //       const keys = Object.keys(data[0]);
  //       keys.forEach((key) => {
  //         html += `<th style="padding:5px; text-align:left;">${key}</th>`;
  //       });

  //       html += `</tr></thead><tbody>`;

  //       data.forEach((row) => {
  //         html += `<tr>`;
  //         keys.forEach((key) => {
  //           html += `<td style="padding:5px;">${row[key]}</td>`;
  //         });
  //         html += `</tr>`;
  //       });

  //       html += `</tbody></table>`;

  //       const element = document.createElement("div");
  //       element.innerHTML = html;

  //       const opt = {
  //         margin: 10,
  //         filename: `${fileName}.pdf`,
  //         image: { type: "jpeg", quality: 0.98 },
  //         html2canvas: { scale: 2 },
  //         jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
  //       };

  //       await html2pdf().set(opt).from(element).save();
  //   } catch (error) {
  //        console.error("PDF export failed", error);
  //   } finally {
  //       setIsExporting(false);
  //   }
  // };

  const overallStats = {
    total: overallStatusData?.data?.total || "N/A",

    disposed: 450,
    pending: 800,
    rejection: 15,
  };

  const statusBreakdown = [
    {
      status: "Pending with Dept",
      count: overallStatusData?.data?.pending_with_department || "N/A",
      percentage:
        overallStatusData?.percentages?.pending_with_department || "N/A",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      status: "Under Investigation",
      count: overallStatusData?.data?.under_investigation || "N/A",
      percentage: overallStatusData?.percentages?.under_investigation ?? "N/A",

      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      status: "Final Report Submitted",
      count: overallStatusData?.data?.final_submit || "N/A",
      percentage: overallStatusData?.percentages?.final_submit ?? "N/A",

      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      status: "Disposed",
      count: overallStatusData?.data?.disposed || "N/A",
      percentage: overallStatusData?.percentages?.disposed ?? "N/A",

      color: "text-green-600",
      bg: "bg-green-100",
    },
    // {
    //   status: "Disposed (Default)",
    //   count: 250,
    //   color: "text-green-700",
    //   bg: "bg-green-200",
    // },
    {
      status: "Rejected",
      count: 150,
      count: overallStatusData?.data?.rejected || "N/A",
      percentage: overallStatusData?.percentages?.rejected ?? "N/A",

      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  const tabs = [
    {
      id: "enrollment",
      label: "Enrollment Date-wise",
      icon: <FaCalendarAlt />,
    },
    { id: "district", label: "District-wise", icon: <FaMapMarkerAlt /> },
    { id: "department", label: "Department-wise", icon: <FaBuilding /> },
    // { id: "pendency", label: "Investigation Pendency", icon: <FaClock /> },
    { id: "dispatch", label: "Dispatch Register", icon: <FaPaperPlane /> },
    { id: "overall", label: "Overall Status", icon: <FaChartPie /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50  pb-20 md:pb-6">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          Reports
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          Generate and export case reports
        </p>
      </div>

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-h-[500px]">
        {activeTab === "enrollment" && (
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-6">
              Enrollment Date-wise List / पंजीकरण तिथि अनुसार सूची
            </h2>

            <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3 md:gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={enrollmentFilters.fromDate}
                  onChange={(e) =>
                    setEnrollmentFilters({
                      ...enrollmentFilters,
                      fromDate: e.target.value,
                    })
                  }
                  className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5"
                />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={enrollmentFilters.toDate}
                  onChange={(e) =>
                    setEnrollmentFilters({
                      ...enrollmentFilters,
                      toDate: e.target.value,
                    })
                  }
                  className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5"
                />
              </div>
              {/* <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => handleEnrollmentExport('pdf')}
                  disabled={isExporting || enrollmentLoading}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <FaSpinner className="animate-spin text-red-500" /> Loading...
                    </>
                  ) : (
                    <>
                      <FaFilePdf className="text-red-500" /> PDF
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleEnrollmentExport('excel')}
                  disabled={isExporting || enrollmentLoading}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <FaSpinner className="animate-spin text-green-600" /> Loading...
                    </>
                  ) : (
                    <>
                      <FaFileExcel className="text-green-600" /> Excel
                    </>
                  )}
                </button>
              </div> */}

              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => {
                    const formattedData = prepareEnrollmentDataForExport(
                      filteredEnrollmentData,
                    );
                    exportToPDF(formattedData, "Enrollment_Report");
                  }}
                  disabled={exportingPdf || enrollmentLoading}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {exportingPdf ? (
                    <>
                      <FaSpinner className="animate-spin text-red-500" />{" "}
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaFilePdf className="text-red-500" /> PDF
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const formattedData = prepareEnrollmentDataForExport(
                      filteredEnrollmentData,
                    );
                    exportToExcel(formattedData, "Enrollment_Report");
                  }}
                  disabled={exportingExcel || enrollmentLoading}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {exportingExcel ? (
                    <>
                      <FaSpinner className="animate-spin text-green-600" />{" "}
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaFileExcel className="text-green-600" /> Excel
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {filteredEnrollmentData.length} case(s) found
            </p>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 whitespace-nowrap">S.No</th>
                      <th className="px-6 py-3 whitespace-nowrap">
                        Complaint No.
                      </th>
                      {/* <th className="px-6 py-3 whitespace-nowrap">Case No.</th> */}
                      <th className="px-6 py-3 whitespace-nowrap">
                        Enrollment Date
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap">District</th>
                      <th className="px-6 py-3 whitespace-nowrap">
                        Department
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap">
                        Complainant
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap">Nature</th>
                      <th className="px-6 py-3 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollmentLoading ? (
                      <tr>
                        <td colSpan={9} className="py-20 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-600">
                            {/* <FaSpinner className="animate-spin text-3xl mb-3 text-blue-600" /> */}
                            <span className="">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredEnrollmentData.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10">
                          <div className="flex justify-center items-center text-gray-500">
                            No Data Found.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEnrollmentData?.map((row, index) => (
                        <tr
                          key={row.id || index}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap hover:underline cursor-pointer">
                            {row?.complain_no}
                          </td>
                          {/* <td className="px-6 py-4 text-blue-600 whitespace-nowrap hover:underline cursor-pointer">
                            {row.caseNo || "N/A"}
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {row?.created_at}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {row?.district_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {row?.department_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {row?.complainant_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs border border-gray-200">
                              {row?.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                              {row?.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "district" && (
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
              District-wise List / जिलेवार सूची
            </h2>

            <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3 md:gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="w-full sm:flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  District / जिला
                </label>
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option>All Districts</option>
                  {allDistrict?.map((items, index) => (
                    <option key={index} value={items.district_name}>
                      {items.district_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => {
                    const data = filteredDistrictData.map((item, idx) => ({
                      "S.No": idx + 1,
                      District: item.district || item.district_name || "N/A",
                      Total: item.total || 0,
                      Pending: item.pending || 0,
                      Disposed: item.disposed || 0,
                    }));
                    exportToPDF(data, "District_Report");
                  }}
                  disabled={exportingPdf || districtLoading}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {exportingPdf ? (
                    <FaSpinner className="animate-spin text-red-500" />
                  ) : (
                    <FaFilePdf className="text-red-500" />
                  )}{" "}
                  PDF
                </button>

                <button
                  onClick={() => {
                    const data = filteredDistrictData.map((item, idx) => ({
                      "S.No": idx + 1,
                      District: item.district || item.district_name || "N/A",
                      Total: item.total || 0,
                      Pending: item.pending || 0,
                      Disposed: item.disposed || 0,
                    }));
                    exportToExcel(data, "District_Report");
                  }}
                  disabled={exportingExcel || districtLoading}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {exportingExcel ? (
                    <FaSpinner className="animate-spin text-green-600" />
                  ) : (
                    <FaFileExcel className="text-green-600" />
                  )}{" "}
                  Excel
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-t-lg border-b border-blue-100 mb-0">
              <h3 className="text-sm font-semibold text-gray-700">
                District Summary / जिला सारांश
              </h3>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 whitespace-nowrap">District</th>
                    <th className="px-6 py-3 whitespace-nowrap">
                      District (Hindi)
                    </th>
                    <th className="px-6 py-3 text-right whitespace-nowrap">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-orange-600 whitespace-nowrap">
                      Pending
                    </th>
                    <th className="px-6 py-3 text-right text-green-600 whitespace-nowrap">
                      Disposed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {districtLoading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-600">
                          {/* <FaSpinner className="animate-spin text-3xl mb-3 text-blue-600" /> */}
                          <span className="">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredDistrictData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10">
                        <div className="flex justify-center items-center text-gray-500">
                          No Data Found.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDistrictData?.map((row, idx) => (
                      <tr
                        key={idx}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {row.district}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.district_hindi}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                          {row.total}
                        </td>
                        <td className="px-6 py-4 text-right text-orange-600 font-medium whitespace-nowrap">
                          {row.pending}
                        </td>
                        <td className="px-6 py-4 text-right text-green-600 font-medium whitespace-nowrap">
                          {row.disposed}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "department" && (
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
              Department-wise List / विभागवार सूची
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3 md:gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="w-full sm:flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Department / विभाग
                </label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option>All Departments</option>
                  {departmentData?.map((item, index) => (
                    <option key={index} value={item.department}>
                      {item.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => {
                    const data = filteredDepartmentData.map((item, idx) => ({
                      "S.No": idx + 1,
                      Department: item.department || "N/A",
                      Type: item.type || "N/A",
                      Total: item.total || 0,
                      Pending: item.pending || 0,
                      Disposed: item.disposed || 0,
                    }));
                    exportToPDF(data, "Department_Report");
                  }}
                  disabled={exportingPdf || departmentLoading}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {exportingPdf ? (
                    <FaSpinner className="animate-spin text-red-500" />
                  ) : (
                    <FaFilePdf className="text-red-500" />
                  )}{" "}
                  PDF
                </button>
                <button
                  onClick={() => {
                    const data = filteredDepartmentData.map((item, idx) => ({
                      "S.No": idx + 1,
                      Department: item.department || "N/A",
                      Type: item.type || "N/A",
                      Total: item.total || 0,
                      Pending: item.pending || 0,
                      Disposed: item.disposed || 0,
                    }));
                    exportToExcel(data, "Department_Report");
                  }}
                  disabled={exportingExcel || departmentLoading}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {exportingExcel ? (
                    <FaSpinner className="animate-spin text-green-600" />
                  ) : (
                    <FaFileExcel className="text-green-600" />
                  )}{" "}
                  Excel
                </button>
              </div>
            </div>

            {/* Rest of your department table code remains same */}
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 whitespace-nowrap">Department</th>
                    {/* <th className="px-6 py-3 whitespace-nowrap">Type</th> */}
                    <th className="px-6 py-3 text-right whitespace-nowrap">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-orange-600 whitespace-nowrap">
                      Pending
                    </th>
                    <th className="px-6 py-3 text-right text-green-600 whitespace-nowrap">
                      Disposed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {row.department}
                      </td>
                      {/* <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{row.type}</td> */}
                      <td className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                        {row.total}
                      </td>
                      <td className="px-6 py-4 text-right text-orange-600 font-medium whitespace-nowrap">
                        {row.pending}
                      </td>
                      <td className="px-6 py-4 text-right text-green-600 font-medium whitespace-nowrap">
                        {row.disposed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* {activeTab === "pendency" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">
                Investigation Pendency Report / जांच लंबितता रिपोर्ट
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  disabled={true}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                >
                  <FaFilePdf /> PDF
                </button>
                <button
                  disabled={true}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                >
                  <FaFileExcel /> Excel
                </button>
              </div>
            </div>
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <p>Report Preview Area</p>
            </div>
          </div>
        )} */}

        {activeTab === "dispatch" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-h-[500px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6">
              Scan Letters / स्कैन किए गए पत्र
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 min-w-[800px]">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 whitespace-nowrap">Scan Date</th>
                    <th className="px-6 py-3 whitespace-nowrap">Letter No.</th>
                    <th className="px-6 py-3 whitespace-nowrap">
                      Complaint No.
                    </th>
                    <th className="px-6 py-3 whitespace-nowrap">Type</th>
                    <th className="px-6 py-3 whitespace-nowrap">Subject</th>
                    <th className="px-6 py-3 whitespace-nowrap">Medium</th>
                    <th className="px-6 py-3 whitespace-nowrap">View</th>

                    {/* <th className="px-6 py-3 whitespace-nowrap">Pages</th>
                          <th className="px-6 py-3 whitespace-nowrap">Status</th> */}
                    {/* <th className="px-6 py-3 text-right whitespace-nowrap">
                            Actions
                          </th> */}
                  </tr>
                </thead>
                <tbody>
                  {isLettersLoading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : lettersList.length > 0 ? (
                    lettersList.map((row) => (
                      <tr
                        key={row.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(row.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {row.letter_no || "NA"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:underline cursor-pointer">
                          {getComplaintNo(row.complaint_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.letter_type || "NA"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 max-w-xs truncate">
                          {row.subject || "NA"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 max-w-xs truncate">
                          {row.Medium || "NA"}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">NA</td> */}
                        {/* <td className="px-6 py-4 whitespace-nowrap">NA</td> */}
                        {/* <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end items-center gap-3">
                                <button className="text-gray-500 hover:text-gray-700 p-2">
                                  <FaFilePdf />
                                </button>
                              </td> */}
                           <td>
               <button
  onClick={() => handleViewPdf(row.file, row.complaint_id)}
  disabled={loadingDoc === row.file}
  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 border border-blue-300 rounded-lg"
>
  {loadingDoc === row.file ? (
    <FaSpinner className="w-4 h-4 animate-spin" />
  ) : (
    <FaEye className="w-4 h-4" />
  )}
  View
</button>


                           </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

             {pdfViewUrl && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">PDF Viewer</h3>
        <button onClick={() => setPdfViewUrl(null)}>
          <FaTimes />
        </button>
      </div>

      <iframe
        src={`${pdfViewUrl}#zoom=page-width`}
        className="w-full h-full border-0"
      />
    </div>
  </div>
)}





        {activeTab === "overall" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">
                Overall Complaint Status / कुल शिकायत स्थिति
              </h2>
              <button
  onClick={() => window.print()}
  className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
>
  <FaPrint />
  <span className="hidden sm:inline">Print Summary</span>
</button>

            </div>
              <div ref={overallPrintRef} className="print-overall">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Total Complaints
                </h3>
                <span className="text-3xl font-bold text-blue-700">
                  {overallStatusData?.data?.total}
                </span>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Pending
                </h3>
                <span className="text-3xl font-bold text-orange-600">
                  {overallStatusData?.data?.in_progress}
                </span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Disposed
                </h3>
                <span className="text-3xl font-bold text-green-600">
                  {overallStatusData?.data?.disposed}
                </span>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Rejections
                </h3>
                <span className="text-3xl font-bold text-red-600">
                  {overallStatusData?.data?.rejected}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700 text-sm md:text-base">
                  Detailed Status Breakdown
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                    <tr>
                      <th className="px-4 md:px-6 py-3 whitespace-nowrap">
                        Status Category
                      </th>
                      <th className="px-4 md:px-6 py-3 text-right whitespace-nowrap">
                        Count
                      </th>
                      <th className="px-4 md:px-6 py-3 text-right whitespace-nowrap">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {statusBreakdown.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={`${item.color.replace("text", "bg")}`}
                            ></span>
                            <span className="font-medium text-gray-700 whitespace-nowrap">
                              {item.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right font-semibold text-gray-800 whitespace-nowrap">
                          {item.count}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right text-gray-500 whitespace-nowrap">
                          {item.percentage}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold border-t border-gray-200">
                      <td className="px-4 md:px-6 py-4">Grand Total</td>
                      <td className="px-4 md:px-6 py-4 text-right text-blue-700">
                        {overallStats.total}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Reporting;
