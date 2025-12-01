import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const AllComplaints = () => {
  const navigate = useNavigate();

  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
  const token = localStorage.getItem("access_token");

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // AllComplaints API Call
  const getAllComplaints = async () => {
    const res = await api.get("/operator/all-approved-complaints");
    return res.data.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-approved-complaints"],
    queryFn: getAllComplaints,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // District API Call
  const getDistrict = async () => {
    const res = await api.get("/operator/all-district");
    return res.data.data;
  };

  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ["district-api"],
    queryFn: getDistrict,
    staleTime: 10 * 60 * 1000,
  });

  // Complaint Types API Call
  const getComplaintTypes = async () => {
    const res = await api.get("/operator/complainstype");
    return res.data.data;
  };

  const { data: complaintTypesData, isLoading: typesLoading } = useQuery({
    queryKey: ["complaint-types"],
    queryFn: getComplaintTypes,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setAllComplaints(data);
      const sorted = sortComplaintsByDate(data, sortOrder);
      setFilteredComplaints(sorted);
    }
  }, [data, sortOrder]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      const sorted = sortComplaintsByDate(allComplaints, sortOrder);
      setFilteredComplaints(sorted);
    } else {
      const filtered = allComplaints.filter((complaint) => {
        const query = searchQuery.toLowerCase();
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
      const sorted = sortComplaintsByDate(filtered, sortOrder);
      setFilteredComplaints(sorted);
    }
  }, [searchQuery, allComplaints, sortOrder]);

  // Sort function for received date
  const sortComplaintsByDate = (complaints, order) => {
    return [...complaints].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      if (order === "desc") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });
  };

  const handleViewDetails = (e, complaintId) => {
    e.stopPropagation();
    navigate(`view/${complaintId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Check if verified by RO
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

  const stats = getStatistics();

  return (
    <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden">
      <div className="w-full bg-white flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="px-4 py-3 border-b flex-shrink-0 bg-white">
          {/* Title and Stats */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Inbox</h2>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                Inbox: {filteredComplaints.length}
              </span>
              <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium">
                Over 7 days: {stats.overdue}
              </span>
              <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium">
                Received today: {stats.receivedToday}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-3">
            <button className="px-2.5 py-1 bg-red-50 border border-red-200 rounded text-red-600 hover:bg-red-100 transition-colors text-xs font-medium">
              ⚠ Overdue &gt; 7 days ({stats.overdue})
            </button>
            <button className="px-2.5 py-1 bg-orange-50 border border-orange-200 rounded text-orange-600 hover:bg-orange-100 transition-colors text-xs font-medium">
              ₹ Fee Pending (0)
            </button>
          </div>

          {/* Search Bar */}
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

          {/* Filters and Sort */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex gap-2">
              <select className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Status: All</option>
                <option value="in_progress">In Progress</option>
                <option value="disposed">Disposed Accepted</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
                <option value="investigating">Under Investigation</option>
                <option value="pending">Pending</option>
              </select>

              {/* District Dropdown */}
              <select
                className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={districtLoading}
              >
                <option value="">District: All</option>
                {districtData?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.district_name}
                  </option>
                ))}
              </select>

              <select className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Fee Status: All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="exempted">Exempted</option>
              </select>

              {/* Case Type Dropdown */}
              <select
                className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={typesLoading}
              >
                <option value="">Case Type: All</option>
                {complaintTypesData?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.name_h})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="desc">Received Date (Newest First)</option>
                <option value="asc">Received Date (Oldest First)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-gray-600">Loading...</h1>
            </div>
          ) : isError ? (
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
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        File No. {complaint.complain_no}
                      </p>
                      <p className="text-xs text-gray-700 mb-1">
                        {complaint.description ||
                          complaint.remark ||
                          "No description available"}
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

                    {/* Right Content - Status & Button */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {/* Top Row - Status Badges */}
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

                      {/* Middle Row - Time & Status */}
                      <div className="flex gap-1.5">
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[11px] font-medium">
                          &gt;9d
                        </span>
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[11px] font-medium">
                          Partial
                        </span>
                      </div>

                      {/* Bottom Row - Button and Verified Badge */}
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={(e) => handleViewDetails(e, complaint.id)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 font-medium whitespace-nowrap"
                        >
                          View Details
                        </button>

                        {/* Verified Badge */}
                        {isVerifiedByRO(complaint) && (
                          <span className="px-2 py-1.5 bg-green-100 text-green-700 rounded-md text-[11px] font-medium whitespace-nowrap flex items-center gap-1">
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
                            Verified
                          </span>
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
                {searchQuery ? "No results found" : "No complaints available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllComplaints;
