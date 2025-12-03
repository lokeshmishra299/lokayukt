import React, { useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

const Notes = ({ documents = [], approvalDocs = [] }) => {
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [selectedApprovalDoc, setSelectedApprovalDoc] = useState("");
  const [note, setNote] = useState("");
  const [pageRanges, setPageRanges] = useState([{ from: "", to: "" }]);

  // Sample documents data - Replace with actual props
  const sampleDocuments = [
    { id: 1, name: "Main Complaint", pages: 3, pageRange: "pp.1–3" },
    { id: 2, name: "Annexure 1 - Tender Documents", pages: 8, pageRange: "pp.4–11" },
    { id: 3, name: "Annexure 2 - Financial Records", pages: 12, pageRange: "pp.12–23" },
    { id: 4, name: "Annexure 3 - Email Communications", pages: 5, pageRange: "pp.24–28" },
    { id: 5, name: "Letter from Department (15 Jan)", pages: 2, pageRange: "pp.29–30" },
  ];

  const docsToUse = documents.length > 0 ? documents : sampleDocuments;

  const handleAddPageRange = () => {
    setPageRanges([...pageRanges, { from: "", to: "" }]);
  };

  const handlePageRangeChange = (index, field, value) => {
    const updated = [...pageRanges];
    updated[index][field] = value;
    setPageRanges(updated);
  };

  const handleSubmit = () => {
    // Add your submit logic here
    console.log("Note:", note);
    console.log("Selected Doc:", selectedDoc);
    console.log("Page Ranges:", pageRanges);
    console.log("Approval Doc:", selectedApprovalDoc);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-lg space-y-6 w-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="text-[16px] font-medium text-gray-800">Notes & Notings</p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 border border-gray-300 px-3 py-2 text-xs rounded-lg hover:bg-gray-50 transition w-full sm:w-auto">
            <FiDownload className="text-sm" />
            Download all notes (PDF)
          </button>

          {/* Add Note Button */}
          <button
            className="bg-blue-600 text-white px-3 py-2 text-xs rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
            onClick={() => setOpen(true)}
          >
            Add Note / Noting
          </button>
        </div>
      </div>

      {/* Modal */}
     {/* Modal */}
{open && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
      {/* Close Button - Top Right */}
      <button
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        onClick={() => setOpen(false)}
        aria-label="Close"
      >
        <FaTimes className="w-5 h-5 text-gray-600" />
      </button>

      <div className="p-6">
        {/* Heading */}
        <h2 className="text-lg font-semibold mb-6 pr-8">Add Note / Noting</h2>

        {/* Note Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note Content <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* References Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">References</h3>

          {/* Reference by Document */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference by Document
            </label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a document...</option>
              {docsToUse.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.pages} pages, combined {doc.pageRange})
                </option>
              ))}
            </select>
          </div>

          {/* Page Range Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference by Combined Page Range (Total: 30 pages)
            </label>

            {pageRanges.map((range, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  placeholder="From"
                  value={range.from}
                  onChange={(e) => handlePageRangeChange(index, "from", e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">to</span>
                <input
                  type="number"
                  placeholder="To"
                  value={range.to}
                  onChange={(e) => handlePageRangeChange(index, "to", e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {index === pageRanges.length - 1 && (
                  <button
                    onClick={handleAddPageRange}
                    className="text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    + Add Page Range
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Document for Approval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document for Approval (optional)
            </label>
            <select
              value={selectedApprovalDoc}
              onChange={(e) => setSelectedApprovalDoc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {docsToUse.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.pageRange})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!note.trim()}
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* NOTE CARD 1 */}
      <NoteCard
        name="Shri Vijay Sharma"
        role="PS to Lokayukta"
        time="14 Jan 2025, 3:45 PM"
        text={`Initial review of the complaint shows prima facie evidence
of procedural irregularities in the tender process. The complainant
has provided substantial documentation including tender documents
and email communications. Recommend detailed scrutiny of Annexure 1
and Annexure 3 for timeline verification.`}
        references={[
          "Main Complaint (pp.1–3)",
          "Annexure 1 - Tender Documents (pp.4–11)",
          "Annexure 3 - Email Communications (pp.24–28)",
        ]}
      />

      {/* NOTE CARD 2 */}
      <NoteCard
        name="Shri Ram Sharma"
        role="PS to Lokayukta"
        time="14 Jan 2025, 3:45 PM"
        text={`After examining the documents and the preliminary note by PS,
it appears that there are serious questions regarding the tender
evaluation process. The timeline presented in the email communications
contradicts the official tender records. Issue notice to the concerned
department to file their response within 15 days. Also approve partial
fee as the complainant has demonstrated financial hardship.`}
        references={[
          "Main Complaint (pp.1–3)",
          "main 1 - Tender Documents (pp.4–11)",
          "Annexure 3 - Email Communications (pp.24–28)",
        ]}
        extraTag="Letter from Department (15 Jan) (pp.29–30)"
      />
    </div>
  );
};

/* ====================== CARD COMPONENT ===================== */

const NoteCard = ({ name, role, time, text, references, extraTag }) => {
  return (
    <div className="border border-gray-200 shadow-sm rounded-xl p-4 sm:p-5 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-1 sm:gap-2">
        <div>
          <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-800">
            {name}
          </h3>
          <p className="text-xs text-gray-600">{role}</p>
        </div>

        <p className="text-xs text-gray-500">{time}</p>
      </div>

      {/* Note Text */}
      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
        {text}
      </div>

      <hr className="border-gray-300" />

      {/* References */}
      <p className="text-xs text-gray-700 font-medium">References:</p>

      <div className="flex flex-wrap gap-2 mt-1">
        {references.map((ref, idx) => (
          <RefTag key={idx} title={ref} />
        ))}
      </div>

      {extraTag && (
        <div className="mt-1">
          <span className="inline-flex items-center gap-1 border border-green-500 bg-green-50 px-2 py-[3px] rounded-md text-green-700 text-[11px]">
            {extraTag}
          </span>
        </div>
      )}
    </div>
  );
};

const RefTag = ({ title }) => (
  <div className="flex items-center gap-1 border border-blue-500 bg-blue-50 px-2 py-1 rounded-md text-blue-700 text-xs w-fit max-w-full">
    <FiFileText className="text-xs flex-shrink-0" />
    <p className="truncate">{title}</p>
  </div>
);

export default Notes;
