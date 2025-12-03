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

const AllDraft = () => {
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
    const res = await api.get("/operator/all-draft");
    return res.data.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-Draft"],
    queryFn: getAllComplaints,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const getDistrict = async () => {
    const res = await api.get("/operator/all-district");
    return res.data.data;
  };

  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ["district-api"],
    queryFn: getDistrict,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const getComplaintTypes = async () => {
    const res = await api.get("/operator/complainstype");
    return res.data.data;
  };

  const { data: complaintTypesData, isLoading: typesLoading } = useQuery({
    queryKey: ["complaint-types"],
    queryFn: getComplaintTypes,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
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

  const stats = getStatistics();

  const getDaysDifference = (dateString) => {
  const today = new Date();
  const createdDate = new Date(dateString);

  const diffTime = today - createdDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

  return (
    <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden">
      <div className="w-full bg-white flex flex-col overflow-hidden">
        <div className="px-3 sm:px-4 py-3 border-b flex-shrink-0 bg-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Draft</h2>
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
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && !data ? (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-gray-600">Loading...</h1>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 text-sm">Error: {error.message}</p>
            </div>
          ) : allComplaints.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-base">No drafts found</p>
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
                        {complaint.description || "No description available"}
                      </p>
                      <div className="text-[11px] text-gray-600 mb-1">
                        <span className="text-gray-500">Complainant:</span>
                        <span className="ml-1">{complaint.name}</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-gray-500">District:</span>
                        <span className="ml-1">{complaint.district_name}</span>
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
  {getDaysDifference(complaint.created_at)}d
</span>
                       
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

                      <button
                        onClick={(e) => handleViewDetails(e, complaint.id)}
                        className="w-full sm:w-auto px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 font-medium whitespace-nowrap"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No results found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDraft;
