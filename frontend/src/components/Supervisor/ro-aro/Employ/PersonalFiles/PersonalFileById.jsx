import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import Notes from "../../Employ/PersonalFiles/PersonalFileById"

/* =======================
   DUMMY DATA
======================= */
const dummyNotes = [
  {
    id: 1,
    note: "File received and initial review completed.",
    date: "12 Feb 2026",
  },
  {
    id: 2,
    note: "Forwarded for internal verification.",
    date: "13 Feb 2026",
  },
];

const dummyMovementHistory = [
  {
    id: 1,
    action: "File Uploaded",
    by: "Applicant",
    date: "12 Feb 2026",
  },
  {
    id: 2,
    action: "File Viewed",
    by: "ARO Officer",
    date: "13 Feb 2026",
  },
  {
    id: 3,
    action: "Note Added",
    by: "RO Officer",
    date: "14 Feb 2026",
  },
];

const RoAroPersonalFileById = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("notes");

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="bg-white min-h-screen flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="p-4 md:p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Personal File Details
            </h2>

            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm"
            >
              <IoMdArrowBack /> Back
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-1">
            File ID: {id}
          </p>
        </div>

        {/* ================= TABS ================= */}
        <div className="border-b px-6 bg-white">
          <div className="flex gap-6">
            {["notes", "movement"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 pt-3 text-sm font-medium relative ${
                  activeTab === tab
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab === "notes" && "Notes"}
                {tab === "movement" && "Movement History"}

                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 p-4 md:p-6">

          {/* NOTES TAB */}
          {activeTab === "notes" && (
           <Notes/>
          )}

          {/* MOVEMENT HISTORY TAB */}
          {activeTab === "movement" && (
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Movement History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Action</th>
                      <th className="px-4 py-2 text-left">By</th>
                      <th className="px-4 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyMovementHistory.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">{item.action}</td>
                        <td className="px-4 py-2">{item.by}</td>
                        <td className="px-4 py-2">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoAroPersonalFileById;
