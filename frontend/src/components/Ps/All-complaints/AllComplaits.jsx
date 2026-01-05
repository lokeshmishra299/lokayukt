import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdTime } from "react-icons/io";

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
  const [sortOrder, setSortOrder] = useState("desc");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [complaintToApprove, setComplaintToApprove] = useState(null);
  const [isApproving, setIsApproving] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("");

  const [uploadList, setUploadList] = useState([]);
const [selectedUpload, setSelectedUpload] = useState("");
const [isSending, setIsSending] = useState(false);

 const roleParent = localStorage.getItem("roleParent");

  // const navigate = useNavigate();




  const sortComplaintsByDate = (complaints, order) => {
    return [...complaints].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      if (order === "desc") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  };


  const getAllComplaints = async () => {
    const res = await api.get("/ps/all-complaints");
    console.log("Data he", res)
    return res.data.data;
  };

const handleSendToUPLokayukt = async () => {
  if (!selectedUpload || !complaintToApprove) return;

  try {
    setIsSending(true);

    await api.post(
      `/ps/forward-to-uplokayukt/${complaintToApprove.id}`,
      {
        forward_to: selectedUpload,
      }
    );

    toast.success("Send To UPLokayukt Successfully!");

    setIsConfirmModalOpen(false);
    setSelectedUpload("");
    setComplaintToApprove(null);

    refetch();
  } catch (error) {
    console.error("Send error:", error);
    toast.error("Send failed");
  } finally {
    setIsSending(false);
  }
};


  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["complaints", location.pathname],
    queryFn: getAllComplaints,
  });


    const stats = {
  overdue: data?.older7DaysCount || 0,
  receivedToday: data?.todayCount || 0,
};


  const getDistrict = async () => {
    const res = await api.get("/ps/all-district");
    return res.data.data;
  };

  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ["district-api"],
    queryFn: getDistrict,

  });

  const getComplaintTypes = async () => {
    const res = await api.get("/ps/complainstype");
    return res.data.data;
  };

  

  const { data: complaintTypesData, isLoading: typesLoading } = useQuery({
    queryKey: ["complaint-types"],
    queryFn: getComplaintTypes,

  });

  useEffect(() => {
    if (data) {
      setAllComplaints(data);
      const sorted = sortComplaintsByDate(data, sortOrder);
      setFilteredComplaints(sorted);
    }
  }, [data, sortOrder]);

  useEffect(() => {
    if (allComplaints.length === 0) return;

    let filtered = [...allComplaints];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((complaint) => {
        return (
          complaint.complain_no?.toLowerCase().includes(query) ||
          complaint.name?.toLowerCase().includes(query) ||
          complaint.district_name?.toLowerCase().includes(query) ||
          complaint.remark?.toLowerCase().includes(query) ||
          complaint.description?.toLowerCase().includes(query) ||
          complaint.email?.toLowerCase().includes(query) ||
          complaint.mobile?.includes(query)
        );
      });
    }

    if (selectedDistrict !== "") {
      filtered = filtered.filter((complaint) => {
        return complaint.district_name?.toLowerCase() === selectedDistrict.toLowerCase();
      });
    }

    if (selectedStatus !== "") {
      filtered = filtered.filter((complaint) => {
        return complaint.status === selectedStatus;
      });
    }

    if (selectedFeeStatus !== "") {
      filtered = filtered.filter((complaint) => {
        return complaint.fee_status === selectedFeeStatus;
      });
    }

    if (selectedCaseType !== "") {
      filtered = filtered.filter((complaint) => {
        return complaint.complaint_type_id === parseInt(selectedCaseType);
      });
    }

    const sorted = sortComplaintsByDate(filtered, sortOrder);
    setFilteredComplaints(sorted);
  }, [
    searchQuery,
    allComplaints,
    selectedDistrict,
    selectedStatus,
    selectedFeeStatus,
    selectedCaseType,
  ]);


  useEffect(() => {
  if (isConfirmModalOpen) {
    api
      .get("/ps/get-uplokayukt")
      .then((res) => {
        setUploadList(res.data);
      })
      .catch((err) => {
        console.error("UPLokayukt API error:", err);
      });
  }
}, [isConfirmModalOpen]);


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
        `/ps/approved-by-ro/${complaintToApprove.id}`
      );

      if (response.data.success || response.status === 200) {
        toast.success("Send To Lokayukt Successfully!", {
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
              ? { ...complaint, approved_rejected_by_lokayukt: 1 }
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
    return complaint.approved_rejected_by_lokayukt === 1;
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

  const diffTime = today - created; 
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};






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
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Inbox</h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium whitespace-nowrap">
                  Inbox: {filteredComplaints.length}
                </span>
                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium whitespace-nowrap">
                  Over 7 days: {stats.overdue}
                </span>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium whitespace-nowrap">
                  Received today: {stats.receivedToday}
                </span>
              </div>
            </div>

          <div className="flex gap-2 mb-3">
              <div className="flex flex-col ">
              <button className=" flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 rounded text-red-600 hover:bg-red-100 transition-colors text-xs font-medium">
                <IoMdTime className="text-rose-500 text-sm " /> Overdue &gt; 7 days ({stats.overdue})
              </button></div>
              <button className="px-2.5 py-1 bg-orange-50 border border-orange-200 rounded text-orange-600 hover:bg-orange-100 transition-colors text-xs font-medium">
                ₹ Fee Pending (0)
              </button>
            </div>

            <div className="relative mb-3">
              <IoSearchOutline className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by file no., complainant, subject..."
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:flex-row gap-2">
                <select
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="">Status: All</option>
                  <option value="in_progress">In Progress</option>
                  <option value="disposed">Disposed Accepted</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                  <option value="investigating">Under Investigation</option>
                  <option value="pending">Pending</option>
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
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="exempted">Exempted</option>
                </select>

                <select
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  disabled={typesLoading}
                  value={selectedCaseType}
                  onChange={(e) => setSelectedCaseType(e.target.value)}
                >
                  <option value="">Case Type: All</option>
                  {complaintTypesData?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-xs whitespace-nowrap">Sort by:</span>
                <select
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                <option value="desc">Received Date </option> 
                <option value="asc">Ascending Order</option> 
                <option value="desc">Decending Order</option>
                 {/* <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option> */}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
          {data?.length == 0 ? (
              <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-600">No Data Found.</h1>
              </div>
            ) :
            
             isLoading ? (
                 <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-600">Loading...</h1>
              </div>
            ) :
            
             isError ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500 text-sm">Error: {error.message}</p>
              </div>
            ) : filteredComplaints.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
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
                          Description: {complaint.complaint_description ||
                            "No description available"}
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
                            New Case
                          </span>
                          {complaint.fee_exempted === 1 && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[11px] font-medium whitespace-nowrap">
                              With Lokayukta
                            </span>
                          )}
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
  {complaint.fee_exempted === 0
    ? "Exempted"
    : complaint.fee_exempted === 1
    ? "Paid"
    : complaint.fee_exempted === 2
    ? "Partial"
    : ""}
</span>


                        </div>


                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={(e) => handleViewDetails(e, complaint.id)}
                            className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 font-medium whitespace-nowrap"
                          >
                            View Details
                          </button>
                          
                            {roleParent !== "lok-ayukt" && (
  complaint.approved_rejected_by_lokayukt === 1 ? (
    <span className="flex-1 sm:flex-none px-2 py-1.5 bg-green-100 text-green-700 rounded-md text-[11px] font-medium whitespace-nowrap flex items-center justify-center">
      Sent
    </span>
  ) : (
    <button
      onClick={(e) => handleApproveClick(e, complaint)}
      className="flex-1 sm:flex-none px-3 py-1.5 text-green-700 border border-green-700 
                 hover:bg-green-700 hover:text-white rounded-md transition-colors duration-200 
                 text-xs font-medium whitespace-nowrap"
    >
      Send To UPLokayukt
    </button>
  )
)}




                          {/* {isApprovedByRO(complaint) ? (
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

      {/* {isConfirmModalOpen && (
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
      )} */}


      {isConfirmModalOpen && roleParent !== "lok-ayukt" && (
  <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
    <div className="bg-white rounded-xl shadow-2xl w-[440px] relative">

      <button
        onClick={() => {
          setIsConfirmModalOpen(false);
          setSelectedUpload("");
          setComplaintToApprove(null);
        }}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full 
                   bg-gray-100 hover:bg-gray-200"
      >
        ✕
      </button>

      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Send to UPLokayukt</h3>
      </div>

      <div className="px-6 py-5">
        <label className="block text-sm font-medium mb-2">
          Select UPLokayukt
        </label>
        <select
          value={selectedUpload}
          onChange={(e) => setSelectedUpload(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select</option>
          {uploadList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end px-6 py-4 bg-gray-50 rounded-b-xl">
        <button
          onClick={handleSendToUPLokayukt}
          disabled={isSending || !selectedUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default AllComplaints;
