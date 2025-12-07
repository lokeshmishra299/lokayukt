import React, { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");
const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

// ========================
// AXIOS INSTANCE
// ========================
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Notes = ({ complaint }) => {
  // ========================
  // STATES
  // ========================
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Data States
  const [documents, setDocuments] = useState([]);
  const [notesList, setNotesList] = useState([]); // State for API notes
  
  // Form States
  const [selectedDoc, setSelectedDoc] = useState("");
  const [pdfViewUrl, setPdfViewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageRanges, setPageRanges] = useState([{ from: "", to: "" }]);
  const [errors, setErrors] = useState({});

  // ========================
  // 1. GET DOCUMENT LIST
  // ========================
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get(`/ps/get-document/${complaint?.id}`);
        if (res.data.status) setDocuments(res.data.data);
      } catch (err) {
        console.log("Document fetch error:", err);
      }
    };

    if (complaint?.id) fetchDocs();
  }, [complaint?.id]);

  // ========================
  // 2. GET NOTES LIST (New Added)
  // ========================
  const fetchNotes = async () => {
    if (!complaint?.id) return;
    try {
      const res = await api.get(`/ps/get-notes/${complaint.id}`);
      if (res.data.status) {
        setNotesList(res.data.data);
      }
    } catch (err) {
      console.log("Notes fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [complaint?.id]);

  // ========================
  // URL FIX
  // ========================
  const normalizePath = (filePath) => {
    if (!filePath) return "";
    return filePath.replace(/^\//, "").replace("storage/", "storage/Document/");
  };

  const makeFileUrl = (filePath) => {
    return `${BASE_URL.replace("/api", "")}/${normalizePath(filePath)}`;
  };

  // ========================
  // SELECT DOCUMENT PREVIEW
  // ========================
  const handleSelectDoc = async (fileName) => {
    setSelectedDoc(fileName);
    setPdfViewUrl(null);

    if (!fileName) return;

    try {
      setLoading(true);
      const res = await api.get(`/ps/get-file-preview/${complaint.id}`);
      if (res.data.status && res.data.data.length > 0) {
        const match = res.data.data.find((p) => p.includes(fileName));
        if (match) {
          setPdfViewUrl(makeFileUrl(match));
        }
      }
    } catch {
      toast.error("PDF नहीं खुल पाया");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // SHOW FINAL PREVIEW POPUP
  // ========================
  const handleSubmitNote = () => {
    setOpen(false);
    setShowSuccess(true);
  };

  // ========================
  // POST NOTE API
  // ========================
  const handleFinalSubmit = async () => {
    setErrors({}); // clear previous errors

    const selectedDocObj = documents.find((doc) => doc.file === selectedDoc);
    const docId = selectedDocObj ? selectedDocObj.id : "";

    const payload = {
      complaint_id: complaint.id,
      description: note,
      d_id: docId,
      range_from: pageRanges[0].from,
      range_two: pageRanges[0].to,
    };

    try {
      const res = await api.post("/ps/add-notes", payload);

      // SUCCESS
      if (res.data.status) {
        toast.success("Note Added Successfully!");
        setShowSuccess(false);
        
        // Reset Form
        setNote("");
        setSelectedDoc("");
        setPageRanges([{ from: "", to: "" }]);
        setPdfViewUrl(null);
        
        // Refresh the List
        fetchNotes();
      }
      // BACKEND ERRORS
      else if (res.data.errors) {
        setErrors(res.data.errors);
        Object.values(res.data.errors).forEach((msgArr) => {
          toast.error(msgArr[0]);
        });
      }
    } catch (err) {
      toast.error("Server Error!");
    }
  };

  // ========================
  // INPUT HANDLER
  // ========================
  const handlePageRangeChange = (idx, field, value) => {
    const updated = [...pageRanges];
    updated[idx][field] = value;
    setPageRanges(updated);
  };

  // ========================
  // VALIDATION
  // ========================
  const isFormValid = () => {
    return note.trim() !== "" && selectedDoc !== "" && pageRanges[0].from !== "" && pageRanges[0].to !== "";
  };

  // ========================
  // HELPER: Get Doc Name by ID
  // ========================
  const getDocName = (dId) => {
    if (!documents.length || !dId) return null;
    const doc = documents.find(d => d.id === dId);
    return doc ? doc.file : null;
  };

  // ========================
  // RENDER
  // ========================
  return (
    <div className="bg-white rounded-lg w-full p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-[16px] font-medium text-gray-800">Notes & Notings</p>
        <button
          className="bg-blue-600 text-white px-3 py-2 text-xs rounded-lg hover:bg-blue-700"
          onClick={() => setOpen(true)}
        >
          Add Note / Noting
        </button>
      </div>

      {/* DISPLAY NOTES (Dynamic from API) */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {notesList.length === 0 ? (
           <p className="text-sm text-gray-500 text-center py-4">No notes available.</p>
        ) : (
          notesList.map((item, index) => {
             // Find doc name for display
             const referencedFile = getDocName(item.d_id);
             
             return (
              <div key={item.id || index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <p className=" text-gray-800">
                    {/* User ID: {item.added_by}  */}
                    {user?.name}

                    {/* Note: If API sends user name later, replace item.added_by with item.user_name */}
                  </p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleString('en-IN', { 
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' 
                    })}
                  </p>
                </div>
                
                <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                  {item.description}
                </div>

                {/* Show Reference if document exists */}
                {(referencedFile || (item.range_from && item.range_two)) && (
                  <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                    <span className="font-semibold">References:</span>
                    <div className="mt-1 pl-2 border-l-2 border-blue-200">
                       {referencedFile && <p>Doc: {referencedFile}</p>}
                       {item.range_from && item.range_two && (
                         <p>Pages: {item.range_from} – {item.range_two}</p>
                       )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 h-5/6 shadow-xl relative flex rounded-md overflow-hidden">
            <button
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setOpen(false)}
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* LEFT FORM */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-6">Add Note / Noting</h2>

              <label className="block text-sm font-medium mb-2">
                Note Content <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full border rounded-md p-3 h-32 resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Reference by Document</label>
                <select
                  className={`w-full border rounded-md p-2 ${
                    errors.d_id ? "border-red-500" : "border-gray-300"
                  }`}
                  value={selectedDoc}
                  onChange={(e) => handleSelectDoc(e.target.value)}
                >
                  <option value="">Select a document...</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.file}>
                      {doc.file}
                    </option>
                  ))}
                </select>
                {errors.d_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.d_id[0]}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Combined Page Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className={`w-20 border rounded-md p-2 ${
                      errors.range_from ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="From"
                    value={pageRanges[0].from}
                    onChange={(e) => handlePageRangeChange(0, "from", e.target.value)}
                  />
                  <input
                    type="number"
                    className={`w-20 border rounded-md p-2 ${
                      errors.range_two ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="To"
                    value={pageRanges[0].to}
                    onChange={(e) => handlePageRangeChange(0, "to", e.target.value)}
                  />
                </div>
                {(errors.range_from || errors.range_two) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.range_from?.[0] || errors.range_two?.[0]}
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-6 gap-3 border-t pt-4">
                <button
                  className="px-4 py-2 text-sm border rounded-md"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitNote}
                  disabled={!isFormValid()}
                  className={`px-4 py-2 text-sm rounded-md text-white ${
                    isFormValid() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* RIGHT PDF PREVIEW */}
            <div className="flex-1 bg-gray-50 border-l flex">
              <div className="w-full h-full flex items-center justify-center">
                {loading ? (
                  <div className="text-gray-500 flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Loading PDF...
                  </div>
                ) : pdfViewUrl ? (
                  <iframe
                    src={`${pdfViewUrl}#zoom=page-width`}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <p className="text-gray-400 text-sm">Select a document to preview PDF</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
{showSuccess && (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl   overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-100">
        <p className="text-sm font-semibold text-gray-800"></p>

        <button
          onClick={() => setShowSuccess(false)}
          className="p-2 rounded hover:bg-gray-200 text-gray-600"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* BODY */}
      <div className="px-8 py-8 text-sm leading-relaxed text-gray-800 space-y-6">

        <p className="text-sm text-center font-semibold text-gray-800">
          File No: {complaint?.file_number || complaint?.complain_no}
        </p>

        <p className="text-xs text-gray-500">
          Data: {new Date().toLocaleDateString()}
        </p>

        {/* SUBJECT / DESCRIPTION */}
        <div className="  rounded-md bg-white px-5 py-4 min-h-[260px] whitespace-pre-wrap">
          {note}
        </div>

        {/* DATE + AUTHORITY */}
        <div className="flex justify-between pt-4">
          <p className="text-xs text-gray-500"></p>

          <div className="text-right text-xs text-gray-600">
            <p className="uppercase tracking-wide">Noting By</p>
            {/* <p className="font-semibold mt-1 text-gray-800">{user?.name}</p> */}
            <p className="font-semibold mt-1 text-gray-800">Shri Sanjay Mishra</p>
            <p>PS Name...</p>
          </div>
        </div>

      </div>

      {/* FOOTER BUTTONS */}
      <div className="px-8 py-4 border-t bg-gray-100 flex justify-end gap-3">
        <button
          className="px-4 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-200 text-gray-700"
          onClick={() => setShowSuccess(false)}
        >
          Cancel
        </button>

        <button
          className="px-6 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleFinalSubmit}
        >
          Submit
        </button>
      </div>

    </div>
  </div>
)}

      {/* TOAST */}
      <ToastContainer />
    </div>
  );
};

export default Notes;
