import React, { useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";

const Notes = ({ documents = [], approvalDocs = [] }) => {
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [selectedApprovalDoc, setSelectedApprovalDoc] = useState("");
  const [note, setNote] = useState("");
  return (
    <div className="bg-white   rounded-lg space-y-6 w-full">

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <p className="text-[16px] font-medium text-gray-800">Notes & Notings</p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 border border-gray-300 px-3 py-2 text-xs rounded-lg hover:bg-gray-50 transition w-full sm:w-auto">
            <FiDownload className="text-sm" />
            Download all notes (PDF)
          </button>
          
 {/* Button */}
      <button
        className="bg-blue-600 text-white px-3 py-2 text-xs rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
        onClick={() => setOpen(true)}
      >
        Add Note / Noting
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-3xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">

            {/* Close */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>

            {/* Heading */}
            <h2 className="text-xl font-semibold mb-4">Add Note / Noting</h2>

            {/* Note Content */}
            <label className="font-medium">Note Content *</label>
            <textarea
              className="w-full border border-gray-300 rounded mt-2 p-3 h-32 resize-none"
              placeholder="Enter your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <hr className="my-5" />

            {/* References */}
            <h3 className="font-medium mb-3">References</h3>

            {/* Reference by Document */}
            <label className="text-sm">Reference by Document</label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
            >
              <option value="">Select a document...</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>

            {/* Page Range */}
            <div className="mt-6">
              <label className="text-sm font-medium">
                Reference by Combined Page Range (Total: 30 pages)
              </label>

              <div className="flex gap-3 mt-2">
                <input
                  type="number"
                  placeholder="From"
                  className="border rounded px-3 py-2 w-20"
                />
                <span className="mt-2">to</span>
                <input
                  type="number"
                  placeholder="To"
                  className="border rounded px-3 py-2 w-24"
                />
                <button className="border text-xs px-1 py-1 rounded hover:bg-gray-100">
                  + Add Page Range
                </button>
                 <label className="text-sm font-medium">
                Document for Approval (optional)
              </label>

              <select
                value={selectedApprovalDoc}
                onChange={(e) => setSelectedApprovalDoc(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded"
              >
                <option value="">None</option>
                {approvalDocs.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              </div>
            </div>

            {/* ------------------------------- */}
            {/* SECOND IMAGE UI ADDED BELOW    */}
            {/* ------------------------------- */}

            

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-10">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-3xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">

            {/* Close Icon */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>

            {/* Heading */}
            <h2 className="text-xl font-semibold mb-4">Add Note / Noting</h2>

            {/* Note Content */}
            <label className="font-medium">Note Content *</label>
            <textarea
              className="w-full border border-gray-300 rounded mt-2 p-3 h-32 resize-none"
              placeholder="Enter your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <hr className="my-5" />

            {/* References */}
            <h3 className="font-medium mb-2">References</h3>

            {/* Reference by Document */}
            <label className="text-sm">Reference by Document</label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
            >
              <option value="">Select a document...</option>

              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>

            {/* Page Range Section */}
            <div className="mt-6">
              <label className="text-sm font-medium">
                Reference by Combined Page Range (Total: 30 pages)
              </label>

              <div className="flex gap-3 mt-2">
                <input
                  type="number"
                  placeholder="From"
                  className="border rounded px-3 py-2 w-24"
                />
                <span className="mt-2">to</span>
                <input
                  type="number"
                  placeholder="To"
                  className="border rounded px-3 py-2 w-24"
                />
                <button className="border px-3 py-2 rounded hover:bg-gray-100">
                  + Add Page Range
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

        </div>
      </div>

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
