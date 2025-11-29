



import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
export default function Newcomplaints() {
  // Dummy complaint data
  const complaintsData = [
    {
      id: 1,
      fileNo: "2025/LOK/123",
      subject: "Complaint regarding irregularities in tender...",
      complainant: "Shri Ramesh Kumar",
      address: "78, Hazratganj, Lucknow",
      district: "Lucknow",
      email: "ramesh.kumar@gmail.com",
      mobile: "9876543210",
      status: "In Motion – With Lokayukta",
      caseType: "New Case",
      feeStatus: "Partial (Awaiting Lokayukta approval)",
      tags: [
        { label: "New Case", color: "blue" },
        { label: "With Lokayukta", color: "purple" },
        { label: "2 days", color: "gray" },
        { label: "Fee Partial", color: "yellow" }
      ],
      receivedDate: "12 Jan 2025",
      lastAction: "15 Jan 2025",
      fullSubject: "Complaint regarding irregularities in tender allocation for road construction project"
    },
    {
      id: 2,
      fileNo: "2025/LOK/118",
      subject: "Allegations of corruption in land acquisition proces...",
      complainant: "Smt. Priya Sharma",
      address: "45, Civil Lines, Noida",
      district: "Noida",
      email: "priya.sharma@gmail.com",
      mobile: "9123456789",
      status: "Under Review",
      caseType: "New Case",
      feeStatus: "Paid",
      tags: [
        { label: "New Case", color: "blue" },
        { label: "With UpLokayukta", color: "purple" },
        { label: ">9 days", color: "red" },
        { label: "Fee Paid", color: "green" }
      ],
      receivedDate: "03 Jan 2025",
      lastAction: "14 Jan 2025",
      fullSubject: "Allegations of corruption in land acquisition process"
    },
    {
      id: 3,
      fileNo: "2024/LOK/892",
      subject: "Misuse of public funds in scholarship distribution...",
      complainant: "Shri Vijay Singh",
      address: "15, Civil Lines, Kanpur",
      district: "Kanpur",
      email: "vijay.singh@gmail.com",
      mobile: "9876543211",
      status: "Old Case",
      caseType: "Old Case",
      feeStatus: "Fee Exempted",
      tags: [
        { label: "Old Case", color: "gray" },
        { label: "With PS", color: "purple" },
        { label: "15 days", color: "red" },
        { label: "Fee Exempted", color: "green" }
      ],
      receivedDate: "28 Dec 2024",
      lastAction: "10 Jan 2025",
      fullSubject: "Misuse of public funds in scholarship distribution"
    },
    {
      id: 4,
      fileNo: "2025/LOK/105",
      subject: "Unauthorized construction complaint...",
      complainant: "Smt. Anjali Verma",
      address: "22, Gomti Nagar, Lucknow",
      district: "Lucknow",
      email: "anjali.verma@gmail.com",
      mobile: "9876543212",
      status: "New Case",
      caseType: "New Case",
      feeStatus: "Paid",
      tags: [
        { label: "New Case", color: "blue" },
        { label: "With Lokayukta", color: "purple" },
        { label: "1 day", color: "gray" },
        { label: "Fee Paid", color: "green" }
      ],
      receivedDate: "14 Jan 2025",
      lastAction: "15 Jan 2025",
      fullSubject: "Unauthorized construction complaint in residential area"
    }
  ];

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState("cover");

  // Helper function for tag colors
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
                Inbox: 24
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
                Over 7 days: 5
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                Received today: 3
              </span>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-3 text-xs">
            <button className="px-3 py-1 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
              Overdue &gt; 7 days (5)
            </button>
            <button className="px-3 py-1 bg-purple-50 border border-purple-200 rounded text-purple-700">
              Fee Pending (8)
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="relative mb-3">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          {complaintsData.map((complaint) => (
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
                    File No. {complaint.fileNo}
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                      {complaint.caseType}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                      With Lokayukta
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2">{complaint.subject}</p>

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-600">
                    Complainant: <span className="font-medium">{complaint.complainant}</span>
                  </span>
                  <span className="text-gray-600">
                    District: {complaint.district}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                      2 days
                    </span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                      Fee Partial
                    </span>
                  </div>
                  <span className="text-gray-500">
                    Received: {complaint.receivedDate} • Last action: {complaint.lastAction}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - 50% */}
      <div className="w-1/2 bg-white flex flex-col overflow-hidden">
        {selectedComplaint ? (
          <>
            {/* Header Section */}
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-800">
                  File No. {selectedComplaint.fileNo}
                </h2>
                {/* <div className="flex gap-8">
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">
                    Record Keeper
                  </button>
                  <button className="text-sm text-gray-600">Lokayukta</button>
                  <button className="text-sm text-gray-600">UpLokayukta</button>
                </div> */}
                <h1 className="text-pink-400 border ">In Motion – With Lokayukta</h1>
              </div>

              <p className="text-gray-700 mb-4">{selectedComplaint.fullSubject}</p>

              {/* Complainant & District in 2 columns */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">COMPLAINANT</p>
                  <p className="font-semibold text-gray-800">
                    {selectedComplaint.complainant}
                  </p>
                  <p className="text-sm text-gray-600">{selectedComplaint.address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">DISTRICT</p>
                  <p className="font-semibold text-gray-800">
                    {selectedComplaint.district}
                  </p>
                </div>
              </div>

              {/* Fee Status */}
              <div>
                <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded text-sm border border-yellow-200">
                  Fee: {selectedComplaint.feeStatus}
                </span>
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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="text-yellow-600 text-xl">🔒</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        File contents hidden due to confidentiality
                      </h4>
                      <p className="text-sm text-gray-700">
                        This file is currently in motion with Lokayukta. Detailed metadata
                        and content are restricted.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">No documents uploaded yet.</p>
                </div>
              )}

              {activeTab === "notings" && (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">No notings available.</p>
                </div>
              )}

              {activeTab === "movement" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-gray-800">With Lokayukta</p>
                      <p className="text-sm text-gray-600">15 Jan 2025, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-gray-800">Received at Office</p>
                      <p className="text-sm text-gray-600">12 Jan 2025, 09:15 AM</p>
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
}