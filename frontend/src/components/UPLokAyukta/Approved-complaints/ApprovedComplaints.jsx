import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdTime } from "react-icons/io";
import Pagination from "../../Pagination";

import { krutiToUnicode } from "../../../components/utils/krutiToUnicode";
import { unicodeToKrutiDev } from "../../../components/utils/unicodeToKruti";


const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AllComplaints = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [complaintToApprove, setComplaintToApprove] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [selectedNature, setSelectedNature] = useState("");
  

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;



  // const sortComplaintsByDate = (complaints, order) => {
  //   return [...complaints].sort((a, b) => {
  //     const dateA = new Date(a.created_at);
  //     const dateB = new Date(b.created_at);

  //     if (order === "desc") {
  //       return dateB - dateA;
  //     } else {
  //       return dateA - dateB;
  //     }
  //   });
  // };


  // Sorting Function
  function sortComplaintsByDate(complaints, order) {
    if (!order) return complaints; // डिफ़ॉल्ट ऑर्डर

    return [...complaints].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      if (order === "desc") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });
  }

 const getAllComplaints = async () => {
  const res = await api.get("/uplokayukt/all-approved-complaints");
  return res.data; 
};



    const [apiStats, setApiStats] = useState({
      older7DaysCount: 0,
      todayCount: 0,
      feePending: 0,
      older7DaysDueCount: 0
    });


    


  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["all-approved-complaints", location.pathname],
    queryFn: getAllComplaints,
  });

  
  
  const stats = {
  overdue: data?.older7DaysCount || 0,
  receivedToday: data?.todayCount || 0,
};

  const getDistrict = async () => {
    const res = await api.get("/uplokayukt/all-district");
    return res.data.data;


      if (res.data) {
      setApiStats({
        older7DaysCount: res.data.older7DaysCount || 0,
        todayCount: res.data.todayCount || 0,
        feePending: res.data.feePending || 0,
        older7DaysDueCount: res.data.older7DaysDueCount || 0
      });
    }
    
  };

  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ["district-api"],
    queryFn: getDistrict,

  });

  const getComplaintTypes = async () => {
    const res = await api.get("/uplokayukt/complainstype");
    return res.data.data;
  };

  const { data: complaintTypesData, isLoading: typesLoading } = useQuery({
    queryKey: ["complaint-types"],
    queryFn: getComplaintTypes,

  });

useEffect(() => {
  if (!data) return;

  // 👇 LIST ke liye (niche wali UI)
  const complaints = data.data || [];
  setAllComplaints(complaints);

  // Directly set the filtered complaints without sorting
  setFilteredComplaints(complaints);
  setCurrentPage(1);

  // 👇 STATS ke liye (top badges)
  setApiStats({
    feePending: data.feePending || 0,
    older7DaysCount: data.older7DaysCount || 0,
    older7DaysDueCount: data.older7DaysDueCount || 0,
    todayCount: data.todayCount || 0,
  });
}, [data]); // Removed sortOrder from dependencies


  // useEffect(() => {
  //   if (data?.data && Array.isArray(data.data)) { // Note: 'data' variable structure might vary based on getAllComplaints return
      
     
  //     const rawData = Array.isArray(data) ? data : (data?.data || []);

  //     const decodedData = rawData.map((item) => ({
  //       ...item,
  //       complain_no: krutiToUnicode(item.complain_no || ""),
  //       complainantName: krutiToUnicode(item.complainantName || ""),
  //       respondentName: krutiToUnicode(item.respondentName || ""),
  //       name: krutiToUnicode(item.name || ""),
  //       district_name: krutiToUnicode(item.district_name || ""),
  //       remark: krutiToUnicode(item.remark || ""),
  //       description: krutiToUnicode(item.description || ""),
  //       complaint_description: krutiToUnicode(item.complaint_description || ""),
  //       // अन्य फील्ड्स
  //       fatherName: krutiToUnicode(item.fatherName || ""),
  //       currentAddress: krutiToUnicode(item.currentAddress || ""),
  //     }));

  //     setAllComplaints(decodedData);
      
  //     const sorted = sortComplaintsByDate(decodedData, sortOrder);
  //     setFilteredComplaints(sorted);
  //     setCurrentPage(1);
  //   }
  //   else if (Array.isArray(data)) {
  //        const decodedData = data.map((item) => ({
  //           ...item,
  //           complain_no: item.complain_no || "",
  //           complainantName: krutiToUnicode(item.complainantName || ""),
  //           respondentName: krutiToUnicode(item.respondentName || ""),
  //           name: krutiToUnicode(item.name || ""),
  //           district_name: krutiToUnicode(item.district_name || ""),
  //           remark: krutiToUnicode(item.remark || ""),
  //           description: krutiToUnicode(item.description || ""),
  //           complaint_description: krutiToUnicode(item.complaint_description || ""),
  //           fatherName: krutiToUnicode(item.fatherName || ""),
  //           currentAddress: krutiToUnicode(item.currentAddress || ""),
  //         }));
  //         setAllComplaints(decodedData);
  //         const sorted = sortComplaintsByDate(decodedData, sortOrder);
  //         setFilteredComplaints(sorted);
  //         setCurrentPage(1);
  //   }

  // }, [data, sortOrder]);


//   useEffect(() => {
//     if (allComplaints.length === 0) return;

//     let filtered = [...allComplaints];

//     if (searchQuery.trim() !== "") {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter((complaint) => {
//         return (
//                       complaint.complainantName?.toLowerCase().includes(query) ||
//       complaint.respondentName?.toLowerCase().includes(query) ||
//           complaint.complain_no?.toLowerCase().includes(query) ||
//           complaint.name?.toLowerCase().includes(query) ||
//           complaint.district_name?.toLowerCase().includes(query) ||
//           complaint.remark?.toLowerCase().includes(query) ||
//           complaint.description?.toLowerCase().includes(query) ||
//           complaint.email?.toLowerCase().includes(query) ||
//           complaint.mobile?.includes(query)
//         );
//       });
//     }

//     if (selectedDistrict !== "") {
//   filtered = filtered.filter((complaint) => {
//     const dataDistrict = complaint.dist_new;

//     if (!dataDistrict) return false;

//     return (
//       dataDistrict.toString().toLowerCase().trim() ===
//       selectedDistrict.toString().toLowerCase().trim()
//     );
//   });
// }


//     if (selectedStatus !== "") {
//       filtered = filtered.filter((complaint) => {
//         return complaint.status === selectedStatus;
//       });
//     }

//     if (selectedFeeStatus !== "") {
//       filtered = filtered.filter((complaint) => {
//           return complaint.fee_exempted?.toString() === selectedFeeStatus;
//       });
//     }

//     if (selectedCaseType !== "") {
//   filtered = filtered.filter((complaint) => {
//     return (
//       complaint.category &&
//       complaint.category.toLowerCase() === selectedCaseType.toLowerCase()
//     );
//   });
// }


//     const sorted = sortComplaintsByDate(filtered, sortOrder);
//     setFilteredComplaints(sorted);
//     setCurrentPage(1);
//   }, [
//     searchQuery,
//     allComplaints,
//     selectedDistrict,
//     selectedStatus,
//     selectedFeeStatus,
//     selectedCaseType,
//   ]);


useEffect(() => {
    if (allComplaints.length === 0) return;

    let filtered = [...allComplaints];

    // 1. Search Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      const queryFromKruti = krutiToUnicode(searchQuery).toLowerCase().trim();
      const queryToKruti = unicodeToKrutiDev(searchQuery).trim();

      filtered = filtered.filter((complaint) => {
        const match = (val) => {
            if (!val) return false;
            const strVal = String(val).toLowerCase();
            const strValOriginal = String(val);
            return (
              strVal.includes(query) || 
              strVal.includes(queryFromKruti) ||
              strValOriginal.includes(queryToKruti)
            );
        };

        return (
          match(complaint.complainantName) ||
          match(complaint.respondentName) ||
          match(complaint.complain_no) ||
          match(complaint.name) ||
          match(complaint.district_name) ||
          match(complaint.remark) ||
          match(complaint.description) ||
          match(complaint.complaint_description) ||
          match(complaint.email) ||
          match(complaint.mobile)
        );
      });
    }

    // 2. District Filter
    if (selectedDistrict !== "") {
        filtered = filtered.filter((complaint) => {
          const dataDistrict = complaint.dist_new || complaint.district_name;
          if (!dataDistrict) return false;
          return String(dataDistrict).toLowerCase().trim() === selectedDistrict.toLowerCase().trim();
        });
    }

    // 3. Status Filter
    if (selectedStatus !== "") {
        filtered = filtered.filter((complaint) => complaint.status === selectedStatus);
    }

    // 4. Fee Status Filter
    if (selectedFeeStatus !== "") {
        filtered = filtered.filter((complaint) => complaint.fee_exempted?.toString() === selectedFeeStatus);
    }

    // 5. Nature Filter (Complaint / Assertion)
    if (selectedNature !== "") {
      filtered = filtered.filter((complaint) =>
        String(complaint.category || "").toLowerCase().trim() === selectedNature.toLowerCase().trim()
      );
    }

    // 6. Case Type Filter (New / Old / Today)
    if (selectedCaseType === "new") {
      filtered = filtered.filter((complaint) => complaint.case_type == 1);
    }
    if (selectedCaseType === "old") {
      filtered = filtered.filter((complaint) => complaint.case_type == 2);
    }
    if (selectedCaseType === "today") {
      const today = new Date().toDateString();
      filtered = filtered.filter((complaint) => new Date(complaint.created_at).toDateString() === today);
    }

    // 7. Sorting Apply
    const sorted = sortComplaintsByDate(filtered, sortOrder);
    
    // 8. Final Data Update
    setFilteredComplaints(sorted); 
    setCurrentPage(1);
    
  }, [
    searchQuery,
    allComplaints,
    selectedDistrict,
    selectedStatus,
    selectedFeeStatus,
    selectedNature,      // Nature added here
    selectedCaseType,    // Case Type added here
    sortOrder            // Sort Order added here
  ]);


const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

const currentComplaints = filteredComplaints.slice(
  indexOfFirstItem,
  indexOfLastItem
);

const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);


  const handleViewDetails = (e, complaintId) => {
    e.stopPropagation();
    navigate(`view/${complaintId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleApproveClick = (e, complaint) => {
    e.stopPropagation();
    setComplaintToApprove(complaint);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (!complaintToApprove) return;

    setIsApproving(true);

    try {
      const response = await api.post(
        `/uplokayukt/approved-by-ro/${complaintToApprove.id}`
      );

      if (response.data.success || response.status === 200) {
        toast.success("Sent To UpLokayukt Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const updateData = (prevData) =>
          prevData.map((complaint) =>
            complaint.id === complaintToApprove.id
              ? { ...complaint, approved_rejected_by_ro: 1 }
              : complaint
          );

        setAllComplaints(updateData);
        setFilteredComplaints(updateData);

        refetch();
      } else {
        toast.error("Failed to approve complaint");
      }
    } catch (error) {
      console.error("Approval Error:", error);
      toast.error("Failed to approve complaint");
    } finally {
      setIsApproving(false);
      setIsConfirmModalOpen(false);
      setComplaintToApprove(null);
    }
  };

  const handleCancelApproval = () => {
    setIsConfirmModalOpen(false);
    setComplaintToApprove(null);
  };

  const isApprovedByRO = (complaint) => {
    return complaint.approved_rejected_by_ro === 1;
  };

  const getStatistics = () => {
    const overdueCount = allComplaints.filter((c) => c.status === "overdue")
      .length;
    const receivedToday = allComplaints.filter((c) => {
      const today = new Date().toDateString();
      const complaintDate = new Date(c.created_at).toDateString();
      return today === complaintDate;
    }).length;

    return {
      total: allComplaints.length,
      overdue: overdueCount,
      receivedToday: receivedToday,
    };
  };

  const getDaysDifference = (date) => {
  const created = new Date(date);
  const today = new Date();

  const diffTime = today - created; // milliseconds difference
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};



function limitTo50Words(text) {
      const words = text.trim().split(/\s+/);

      if (words.length <= 30) {
        return text;
      }

      return words.slice(0, 30).join(" ") + " ...";
    }



// const getDaysDifference = (dateString) => {
//   const today = new Date();
//   const createdDate = new Date(dateString);

//   const diffTime = today - createdDate;
//   return Math.floor(diffTime / (1000 * 60 * 60 * 24));
// };


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden">
        <div className="w-full bg-white flex flex-col overflow-hidden">
          <div className="px-3 sm:px-4 py-3 border-b flex-shrink-0 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Sent</h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                {/* <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium whitespace-nowrap">
                  Inbox: {filteredComplaints.length}
                </span>
                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium whitespace-nowrap">
                  Over 7 days: {apiStats.older7DaysCount}
                </span>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium whitespace-nowrap">
                  Received today: {apiStats.todayCount}
                </span> */}
              </div>
            </div>

          <div className="flex gap-2 mb-3">
              {/* <div className="flex flex-col ">
              <button className=" flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 rounded text-red-600 hover:bg-red-100 transition-colors text-xs font-medium">
                <IoMdTime className="text-rose-500 text-sm " /> Overdue &gt; 7 days ({apiStats.older7DaysDueCount})
              </button></div> */}
              {/* <button className="px-2.5 py-1 bg-orange-50 border border-orange-200 rounded text-orange-600 hover:bg-orange-100 transition-colors text-xs font-medium">
                ₹ Fee Pending ({apiStats.feePending})
              </button> */}
            </div>

            <div className="relative mb-3">
              <IoSearchOutline className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              {/* <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by file no., complainant, subject..."
              /> */}

                                                  <input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="kruti-input w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:!font-sans placeholder:!text-gray-500 placeholder:!text-sm placeholder:!tracking-normal"
  placeholder="Search by file no., complainant, subject..."
/>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:flex-row gap-2">
                <select
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Status: All</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Disposed Accepted">Disposed Accepted</option>
                  {/* <option value="Resolved">Resolved</option> */}
                  <option value="Rejected">Rejected</option>
                  <option value="Under Investigation">Under Investigation</option>
                  {/* <option value="Pending">Pending</option> */}
                </select>

                <select
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  disabled={districtLoading}
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="">District: All</option>
                  {districtData?.map((item) => (
                    <option key={item.id} value={item.district_name}>
                      {item.district_name}
                    </option>
                  ))}
                </select>
                <select 
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  value={selectedFeeStatus}
                  onChange={(e) => setSelectedFeeStatus(e.target.value)}
                >
                  <option value="">Fee Status: All</option>
                  <option value="0">Pending</option>
                  <option value="2">Partial</option>
                  <option value="1">Paid</option>
                  <option value="3">Exempted</option>
                </select>
          <select
                  className="border border-gray-300 px-2 py-1 rounded-md text-xs"
                  value={selectedNature}
                  onChange={(e) => setSelectedNature(e.target.value)}
                >
                  <option value="">Nature: All</option>
                  <option value="complaint">Complaint</option>
                  <option value="assertion">Assertion</option>
                </select>

                <select
                  value={selectedCaseType}
                  onChange={(e) => setSelectedCaseType(e.target.value)}
                  className="border border-gray-300 px-2 py-1 rounded-md text-xs"
                >
                  <option value="">Case Type: All</option>
                  <option value="new">New Case</option>
                  <option value="old">Old Case</option>
                  <option value="today">Today Case</option>
                </select>

              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-xs whitespace-nowrap">Sort by:</span>
                <select
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  value={sortOrder}
                  onChange={handleSortChange}>
                <option value="">Received Date </option> 
                <option value="asc">Ascending Order</option> 
                <option value="desc">Decending Order</option>
                 {/* <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option> */}
                </select>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
              {
             isLoading ? (
                 <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-600">Loading...</h1>
              </div>
            ) :


            allComplaints.length == 0 ? (
              <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-600">No Data Found.</h1>
              </div>
            ) :
            
             isError ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500 text-sm">Error: {error.message}</p>
              </div>
            ) : filteredComplaints.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {currentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="px-3 sm:px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          File No. {complaint.complain_no}
                        </p>
                       <p className="text-xs text-gray-700 mb-1">
                          <span className="text-[15px]">Description: </span>
                            <span className="kruti-input">
                                {limitTo50Words(complaint.complaint_description) ||
                              "No description available"}
                            </span>
                          
                          </p>
                       <div className="text-[11px] text-gray-600 mb-1">
                          <span className="text-gray-500">
                            Cause Date
                            :</span>
                          <span className="ml-1">{complaint.cause_date || "NA"}</span>
                          <span className="mx-1 text-gray-400">•</span>
                          <span className="text-gray-500">
                            Category
                            :</span>
                          <span className="ml-1">
                            {complaint.category || "NA"}
                          </span>
                        </div>
                         <div className="text-[10px] text-gray-400">
                          Received:{" "}
                          {new Date(complaint.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}{" "}
                          • Last action:{" "}
                          {new Date(complaint.updated_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                     <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                        <div className="flex gap-1.5">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-medium whitespace-nowrap">
                             {complaint.case_type == 1 ?  "New Case" :
                          complaint.case_type == 2 ? "Old Case"
                          :
                          "New Case"
                           
                            }
                          </span>
                          {/* {complaint.fee_exempted === 1 && ( */}
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[11px] font-medium whitespace-nowrap">
                            {complaint.approved_rejected_by_lokayukt === 1
                              ? " With UpLokayukta"
                              : "With Lokayukta"}
                          </span>
                          {/* )} */}
                        </div>
                         <div className="flex gap-1.5">
                         <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[11px] font-medium">
                      {getDaysDifference(complaint.created_at)}d</span>
                                                             <span
  className={`
    px-2 py-0.5 rounded text-[11px] font-medium
    ${
      complaint.fee_exempted === 0
        ? "bg-green-50 text-blue-600"    
        : complaint.fee_exempted === 1
        ?
        "bg-orange-50 text-orange-600"     
        : complaint.fee_exempted === 2
        ? "bg-blue-50 text-orange-400" 
        : ""
    }
  `}
>
  {complaint.fee_exempted === 3
    ? "Exempted"
    : complaint.fee_exempted === 1
    ? "Paid"
    : complaint.fee_exempted === 2
    ? "Partial"
    : "Pending"}
</span>
                        </div>
                     <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={(e) => handleViewDetails(e, complaint.id)}
                            className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 font-medium whitespace-nowrap">
                            View Details
                          </button>
                        {/*{isApprovedByRO(complaint) ? (
                            <span className="flex-1 sm:flex-none px-2 py-1.5 bg-green-100 text-green-700 rounded-md text-[11px] font-medium whitespace-nowrap flex items-center justify-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                           Send 
                          </span>
                          ) : (
                            <button
                              onClick={(e) =>
                                handleApproveClick(e, complaint)
                              }
                              className="flex-1 sm:flex-none px-3 py-1.5 text-green-700 border border-green-700 hover:bg-green-700 hover:text-white rounded-md transition-colors duration-200 text-xs font-medium whitespace-nowrap"
                            >
                              
                             Send To Lokayukt
                            </button>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-sm">
                  {searchQuery || selectedDistrict || selectedStatus || selectedFeeStatus || selectedCaseType
                    ? "No results found"
                    : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

            <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  totalItems={filteredComplaints.length}
  itemsPerPage={itemsPerPage}
/>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    Confirm Approval
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Are you sure you want to approve this complaint?
                  </p>
                  {complaintToApprove && (
                    <p className="text-xs text-gray-600 mt-1">
                      File No: {complaintToApprove.complain_no}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelApproval}
                  disabled={isApproving}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  disabled={isApproving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isApproving ? "Approving..." : "Yes, Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllComplaints;
