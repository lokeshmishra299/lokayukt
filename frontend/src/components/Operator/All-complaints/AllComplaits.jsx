import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; // ← Import karo
import axios from "axios";
// import Notes from "./SubModule/Notes";
// import Documents from "./SubModule/Documents";
// import CoverMeta from "./SubModule/CoverMeta";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AllComplaits = () => {
  const navigate = useNavigate(); 
  
  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState("cover");
  const [searchQuery, setSearchQuery] = useState("");

  const getAllComplaints = async () => {
    const res = await api.get("/operator/all-complaints");
    console.log("Data", res.data);
    return res.data.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-complaints"],
    queryFn: getAllComplaints,
  });

  useEffect(() => {
    if (data) {
      setAllComplaints(data);
      setFilteredComplaints(data);
    }
  }, [data]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredComplaints(allComplaints);
    } else {
      const filtered = allComplaints.filter((complaint) => {
        const query = searchQuery.toLowerCase();
        return (
          complaint.complain_no?.toLowerCase().includes(query) ||
          complaint.name?.toLowerCase().includes(query) ||
          complaint.district_name?.toLowerCase().includes(query) ||
          complaint.remark?.toLowerCase().includes(query) ||
          complaint.email?.toLowerCase().includes(query) ||
          complaint.mobile?.includes(query)
        );
      });
      setFilteredComplaints(filtered);
    }
  }, [searchQuery, allComplaints]);

// Navigate View Details
  const handleViewDetails = (e, complaintId) => {
    e.stopPropagation();
    navigate(`view/${complaintId}`); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTagColors = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      gray: "bg-gray-200 text-gray-700",
      yellow: "bg-yellow-100 text-yellow-700",
      green: "bg-green-100 text-green-700",
      red: "bg-red-100 text-red-700",
    };
    return colors[color] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Under Investigation":
        return "bg-purple-100 text-purple-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full h-screen flex bg-gray-50 overflow-hidden">
      <div className="w-full bg-white flex flex-col overflow-hidden">
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-lg font-semibold">Inbox</h2>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                Inbox: {filteredComplaints.length}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
                Over 7 days: 0
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                Received today: 0
              </span>
            </div>
          </div>

          <div className="flex gap-2 mb-3 text-xs">
            <button className="px-3 py-1 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
              Overdue &gt; 7 days (0)
            </button>
            <button className="px-3 py-1 bg-purple-50 border border-purple-200 rounded text-purple-700">
              Fee Pending (0)
            </button>
          </div>

          <div className="relative mb-3">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by file no., complainant, subject..."
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
            <select className="border px-2 py-1.5 rounded">
              <option>Status: All</option>
            </select>
            <select className="border px-2 py-1.5 rounded">
              <option>Current Holder: All</option>
            </select>
            <select className="border px-2 py-1.5 rounded">
              <option>Fee Status: All</option>
            </select>
          </div>

          <div className="flex justify-between gap-2 text-xs">
            <select className="border px-2 py-1.5 rounded">
              <option>Case Type: All</option>
            </select>
            <select className="border px-2 py-1.5 rounded">
              <option>Sort by: Received Date</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className=" font-medium text-gray-800 ">Loading...</p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">Error: {error.message}</p>
            </div>
          ) : filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className={`p-4 border-b transition-all relative ${
                  selectedComplaint?.id === complaint.id
                    ? "bg-gray-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={
                    selectedComplaint?.id === complaint.id ? "pl-3" : ""
                  }
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      File No. {complaint.complain_no}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        New Case
                      </span>
                      {complaint.fee_exempted === 1 && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                          With Lokayukt
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">
                    {complaint.remark || "No description available"}
                  </p>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-600">
                      Complainant:{" "}
                      <span className="font-medium">{complaint.name}</span>
                    </span>
                    <span className="text-gray-600">
                      District: {complaint.district_name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {complaint.mobile}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      Created:{" "}
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </span>
                  </div>

                
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={(e) => handleViewDetails(e, complaint.id)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors duration-200 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                {searchQuery ? "No results found" : "No complaints found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllComplaits;
