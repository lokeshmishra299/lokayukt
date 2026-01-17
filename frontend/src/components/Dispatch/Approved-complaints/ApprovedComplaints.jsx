import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
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

  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("");

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
    const res = await api.get("/lokayukt/all-approved-complaints");
    return res.data.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-approved-complaints"],
    queryFn: getAllComplaints,

  });

  const getDistrict = async () => {
    const res = await api.get("/lokayukt/all-district");
    return res.data.data;
  };

  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ["district-api"],
    queryFn: getDistrict,

  });

  const getComplaintTypes = async () => {
    const res = await api.get("/lokayukt/complainstype");
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

  const handleViewDetails = (e, complaintId) => {
    e.stopPropagation();
    navigate(`view/${complaintId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const isVerifiedByRO = (complaint) => {
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

   // **************************count days*******************************************************
  const getDaysDifference = (date) => {
  const created = new Date(date);
  const today = new Date();

  const diffTime = today - created; // milliseconds difference
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};


  const stats = getStatistics();

  return (
    <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden">
      <div className="w-full bg-white flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b flex-shrink-0 bg-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
            <h2 className="text-lg font-bold text-gray-900">Sent</h2>
          
          </div>

            <div className="flex gap-2 mb-3">
                       {/* <div className="flex flex-col ">
                       <button className=" flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 rounded text-red-600 hover:bg-red-100 transition-colors text-xs font-medium">
                         <IoMdTime className="text-rose-500 text-sm " /> Overdue &gt; 7 days ({stats.overdue})
                       </button>
                       </div> */}
                       {/* <button className="px-2.5 py-1 bg-orange-50 border border-orange-200 rounded text-orange-600 hover:bg-orange-100 transition-colors text-xs font-medium">
                         ₹ Fee Pending (0)
                       </button> */}
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

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between text-xs gap-2">
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <select
                className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Status: All</option>
                <option value="in_progress">In Progress</option>
                <option value="disposed">Disposed Accepted</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
                <option value="investigating">Under Investigation</option>
                <option value="pending">Pending</option>
              </select>

              <select
                className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedFeeStatus}
                onChange={(e) => setSelectedFeeStatus(e.target.value)}
              >
                <option value="">Fee Status: All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="exempted">Exempted</option>
              </select>

              <select
                className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-gray-600">Sort by:</span>
              <select
                className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 sm:flex-none"
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
            )
             : 
               isLoading ? (
                 <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-600">Loading...</h1>
              </div>
            )
            :
             isError ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 text-sm">Error: {error.message}</p>
            </div>
          ) : filteredComplaints.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
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
                      {getDaysDifference(complaint.updated_at)}d</span>

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

                      <div className="flex gap-2 items-center w-full sm:w-auto">
                        <button
                          onClick={(e) => handleViewDetails(e, complaint.id)}
                          className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 font-medium whitespace-nowrap"
                        >
                          View Details
                        </button>

                        {isVerifiedByRO(complaint) && (
                         <>
                          
                         </>
                        )}
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
  );
};

export default AllComplaints;
