import React, { useState } from "react";
import { FaEye, FaCheckSquare } from "react-icons/fa";
import { BsFileEarmarkPdf, BsDownload } from "react-icons/bs";

const Documents = ({ complaint }) => {
  const [selectedDocs, setSelectedDocs] = useState([]);

  const documents = [
    {
      id: 1,
      title: "Main Complaint",
      pages: "1-3",
      combined: "1-3",
      type: "Complaint",
    },
    {
      id: 2,
      title: "Annexure 1 - Tender Documents",
      pages: "1-8",
      combined: "4-11",
      type: "Evidence",
    },
    {
      id: 3,
      title: "Annexure 2 - Financial Records",
      pages: "1-12",
      combined: "12-23",
      type: "Evidence",
    },
    {
      id: 4,
      title: "Annexure 3 - Email Communications",
      pages: "1-5",
      combined: "24-28",
      type: "Evidence",
    },
    {
      id: 5,
      title: "Letter from Department (15 Jan)",
      pages: "1-2",
      combined: "29-30",
      type: "External Correspondence",
    },
  ];

  const handleSelectDoc = (docId) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Info Message */}
      <div className="p-4 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg">
        <p className="text-sm leading-tight">
          Documents are treated as a continuous case file. Combined pages
          update automatically when new documents are added.
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Documents</h2>

        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition">
          <BsDownload className="w-4 h-4" />
          Download case as single PDF
        </button>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >

            {/* Checkbox */}
            <button
              onClick={() => handleSelectDoc(doc.id)}
              className="flex-shrink-0 mt-1 sm:mt-0"
            >
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                  selectedDocs.includes(doc.id)
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedDocs.includes(doc.id) && (
                  <FaCheckSquare className="w-4 h-4 text-white" />
                )}
              </div>
            </button>

            {/* PDF Icon */}
            <div className="flex-shrink-0">
              <BsFileEarmarkPdf className="w-6 h-6 text-blue-600" />
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-800 leading-tight">
                {doc.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1">
                <span>Pages: {doc.pages}</span>

                <span className="text-gray-400">•</span>

                <span className="text-purple-700 px-2 py-0.5 rounded bg-purple-100 font-medium">
                  Combined: {doc.combined}
                </span>

                <span className="text-gray-400">•</span>

                <span>{doc.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add as Reference Button */}
      <div className="pt-1">
        <button className="w-full sm:w-auto px-6 py-2.5 text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition shadow-sm">
          Add selected as Reference in Note
        </button>
      </div>
    </div>
  );
};

export default Documents;
