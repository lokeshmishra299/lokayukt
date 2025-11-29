import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import Notes from "./SubModule/Notes";
import Documents from "./SubModule/Documents";
import CoverMeta from "./SubModule/CoverMeta";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const InboxUI = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState("cover");

  const getAllComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/operator/all-complaints");
      console.log("All Complaints Data", res.data);
      if (res.data.status && res.data.data) {
        setAllComplaints(res.data.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getAllComplaints();
  }, []);

  const getTagColors = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      gray: "bg-gray-200 text-gray-700",
      yellow: "bg-yellow-100 text-yellow-700",
      green: "bg-green-100 text-green-700",
      red: "bg-red-100 text-red-700"
    };
    return colors[color] || "bg-gray-100 text-gray-700";
  };

  // Helper function to get status badge color
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
      {/* LEFT PANEL - 50% */}
      <div className="w-1/2 bg-white border-r flex flex-col overflow-hidden">
        {/* HEADER - Fixed at top */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-lg font-semibold">Inbox</h2>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                Inbox: {allComplaints.length}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
                Over 7 days: 0
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                Received today: 0
              </span>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-3 text-xs">
            <button className="px-3 py-1 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
              Overdue &gt; 7 days (0)
            </button>
            <button className="px-3 py-1 bg-purple-50 border border-purple-200 rounded text-purple-700">
              Fee Pending (0)
            </button>
          </div>

          {/* SEARCH BAR - DISABLED */}
          <div className="relative mb-3">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              disabled
              className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm bg-gray-100 cursor-not-allowed opacity-60"
              placeholder="Search by file no., complainant, subject..."
            />
          </div>

          {/* FILTERS */}
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

        {/* FILE LIST - Scrollable with VISIBLE scrollbar */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : allComplaints.length > 0 ? (
            allComplaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => {
                  setSelectedComplaint(complaint);
                  setActiveTab("cover");
                }}
                className={`p-4 border-b cursor-pointer transition-all relative ${
                  selectedComplaint?.id === complaint.id
                    ? "bg-gray-50"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* Blue Left Border for Selected */}
                {selectedComplaint?.id === complaint.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                )}

                <div className={selectedComplaint?.id === complaint.id ? "pl-3" : ""}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      File No. {complaint.complain_no}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded ${getStatusColor(complaint.status)}`}>
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
                      Complainant: <span className="font-medium">{complaint.name}</span>
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
                      Created: {new Date(complaint.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No complaints found</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - 50% */}
      <div className="w-1/2 bg-white flex flex-col overflow-hidden">
        {selectedComplaint ? (
          <>
            {/* Header Section */}
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  File No. {selectedComplaint.complain_no}
                </h2>
                <p className={`px-3 py-1 rounded ${getStatusColor(selectedComplaint.status)}`}>
                  In Motion – With Lokayukta
                </p>
              </div>

              <p className="text-gray-700 mb-4">
                {selectedComplaint.remark || "No detailed description available for this complaint."}
              </p>

              {/* Complainant & District in 2 columns */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">COMPLAINANT</p>
                  <p className="font-semibold text-gray-800">
                    {selectedComplaint.name}
                  </p>
                  <p className="text-sm text-gray-600">{selectedComplaint.address}</p>
                  <p className="text-sm text-gray-600 mt-1">Mobile: {selectedComplaint.mobile}</p>
                  {selectedComplaint.email && (
                    <p className="text-sm text-gray-600">Email: {selectedComplaint.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">DISTRICT</p>
                  <p className="font-semibold text-gray-800">
                    {selectedComplaint.district_name}
                  </p>
                  {selectedComplaint.dob && (
                    <>
                      <p className="text-xs text-gray-500 uppercase mb-1 mt-3">DATE OF BIRTH</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(selectedComplaint.dob).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Fee Status */}
              <div className="flex gap-3">
                {selectedComplaint.fee_exempted === 1 ? (
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded text-sm border border-green-200">
                    Fee: Exempted
                  </span>
                ) : selectedComplaint.amount ? (
                  <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded text-sm border border-yellow-200">
                    Fee: ₹{selectedComplaint.amount}
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded text-sm border border-gray-200">
                    Fee: Not specified
                  </span>
                )}
                {selectedComplaint.challan_no && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-sm border border-blue-200">
                    Challan: {selectedComplaint.challan_no}
                  </span>
                )}
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-b px-6 flex-shrink-0">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("cover")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                    activeTab === "cover"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Cover & Meta
                  {activeTab === "cover" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                    activeTab === "documents"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Documents
                  {activeTab === "documents" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("notings")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                    activeTab === "notings"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Notes / Notings
                  {activeTab === "notings" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("movement")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                    activeTab === "movement"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Movement History
                  {activeTab === "movement" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === "cover" && (
                <div className="space-y-4">
                  {selectedComplaint.report_status && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <CoverMeta/>

                    </div>
                  )}
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-3">
                  <Documents/>
                </div>
              )}

              {activeTab === "notings" && (
                <div className="space-y-3">
                  {selectedComplaint.remark ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Remarks</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{selectedComplaint.remark}</p>
                    </div>
                  ) : (
                  <Notes/>
                  )}
                </div>
              )}

              {activeTab === "movement" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-gray-800">Created</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedComplaint.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-gray-800">Last Updated</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedComplaint.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Buttons */}
            <div className="border-t p-4 flex gap-3 flex-shrink-0">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Pull Back
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Mark as Received (Physical)
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto">
                Forward Physical
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <div className="text-6xl mb-3">📄</div>
              <p className="text-base">Select a file to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxUI;
