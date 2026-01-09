import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaSpinner, FaDownload, FaPrint, FaEye } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");
const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Notes = ({ complaint }) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const popupRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [notesList, setNotesList] = useState([]);

  const [selectedDoc, setSelectedDoc] = useState("");
  const [pdfViewUrl, setPdfViewUrl] = useState(null); // Used for Add Note Preview
  const [viewDocUrl, setViewDocUrl] = useState(null); // Used for List View (Right Panel)
  const [loading, setLoading] = useState(false);
  const [pageRanges, setPageRanges] = useState([{ from: "", to: "" }]);
  const [errors, setErrors] = useState({});

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get(`/supervisor/get-documentdraft/${complaint?.id}`);
        if (res.data.status) setDocuments(res.data.data);
      } catch (err) {
        console.log("Document fetch error:", err);
      }
    };

    if (complaint?.id) fetchDocs();
  }, [complaint?.id]);

  const fetchNotes = async () => {
    if (!complaint?.id) return;
    try {
       setLoading(true);
      const res = await api.get(`/supervisor/get-notes/${complaint.id}`);
      if (res.data.status) {
        setNotesList(res.data.data);
      }
    } catch (err) {
      console.log("Notes fetch error:", err);
    }
    finally{
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [complaint?.id]);

  // --- PATH LOGIC ---
  const normalizePath = (filePath) => {
    if (!filePath) return "";
    let fp = filePath.replace(/^\//, "");
    fp = fp.replace("storage/", "storage/Document/");
    return fp;
  };

  const makeFileUrl = (filePath) => {
    const root = BASE_URL.replace("/api", "");
    const fixedPath = normalizePath(filePath);
    return `${root}/${fixedPath}`;
  };

  // Helper to fetch PDF URL from API
  const fetchPdfPath = async (filename) => {
    try {
      const res = await api.get(`/supervisor/get-file-preview/${complaint.id}`);
      if (res.data.status && res.data.data.length > 0) {
        const match = res.data.data.find((p) => p.includes(filename));
        if (match) {
          return makeFileUrl(match);
        }
      }
    } catch (err) {
      console.error("Error fetching PDF path", err);
    }
    return null;
  };

  // --- HANDLER FOR ADD NOTE PREVIEW ---
  const handleSelectDoc = async (fileName) => {
    setSelectedDoc(fileName);
    setPdfViewUrl(null);

    if (!fileName) return;

    try {
      setLoading(true);
      const url = await fetchPdfPath(fileName);
      if (url) setPdfViewUrl(url);
      else toast.error("PDF path not found");
    } catch {
      toast.error("PDF नहीं खुल पाया");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER FOR LIST VIEW BUTTON ---
  const handleViewDocFromNote = async (fileName) => {
    if (!fileName) return;
    const url = await fetchPdfPath(fileName);
    if (url) {
      setViewDocUrl(url);
    } else {
      toast.error("Document not found");
    }
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setNote(content);
  };

  const handleSubmitNote = () => {
    const contentState = editorState.getCurrentContent();
    const hasText = contentState.hasText();

    if (!hasText) {
      toast.error("Please add some note content");
      return;
    }

    setOpen(false);
    setShowSuccess(true);
  };

  const handleDownloadPdf = async () => {
    if (!popupRef.current) return;

    try {
      const elementsToHide =
        popupRef.current.querySelectorAll(".pdf-hide-section");
      elementsToHide.forEach((el) => (el.style.display = "none"));

      const canvas = await html2canvas(popupRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      elementsToHide.forEach((el) => (el.style.display = "flex"));

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Noting_${complaint?.file_number || "File"}.pdf`);

      toast.success("PDF Downloaded successfully!");
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("Failed to generate PDF");
    }
  };

  const handlePrint = () => {
    if (!popupRef.current) return;

    const printWindow = window.open("", "_blank");
    const styles = Array.from(
      document.querySelectorAll("link[rel='stylesheet'], style")
    )
      .map((node) => node.outerHTML)
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Note</title>
          ${styles}
          <style>
            body { background-color: white; -webkit-print-color-adjust: exact; }
            .pdf-hide-section { display: none !important; } 
            .print-container { padding: 20px; }
          </style>
        </head>
        <body class="print-container">
          ${popupRef.current.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleFinalSubmit = async () => {
    setErrors({});
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
      const res = await api.post("/supervisor/add-notes", payload);

      if (res.data.status) {
        toast.success("Note Added Successfully!");
        setShowSuccess(false);
        setNote("");
        setEditorState(EditorState.createEmpty());
        setSelectedDoc("");
        setPageRanges([{ from: "", to: "" }]);
        setPdfViewUrl(null);
        fetchNotes();
      } else if (res.data.errors) {
        setErrors(res.data.errors);
        Object.values(res.data.errors).forEach((msgArr) => {
          toast.error(msgArr[0]);
        });
      }
    } catch (err) {
      toast.error("Server Error!");
    }
  };

  const handlePageRangeChange = (idx, field, value) => {
    const updated = [...pageRanges];
    updated[idx][field] = value;
    setPageRanges(updated);
  };

  const isFormValid = () => {
    const contentState = editorState.getCurrentContent();
    const hasText = contentState.hasText();

    return hasText && selectedDoc !== "";
  };

  const getDocName = (dId) => {
    if (!documents.length || !dId) return null;
    const doc = documents.find((d) => d.id === dId);
    return doc ? doc.title || doc.file : null;
  };

  const getDocFilename = (dId) => {
    if (!documents.length || !dId) return null;
    const doc = documents.find((d) => d.id === dId);
    return doc ? doc.file : null;
  };

  return (
    <div className="bg-white rounded-lg w-full p-3 md:p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-[16px] font-medium text-gray-800">
          Notes & Notings
        </p>
        <button
          className="bg-blue-600 text-white px-3 py-2 text-xs rounded-lg hover:bg-blue-700 transition"
          onClick={() => setOpen(true)}
        >
          Add Note / Noting
        </button>
      </div>

      {/* 50:50 SPLIT CONTAINER */}
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* LEFT SIDE: NOTES LIST (Takes 50% if viewed, 100% otherwise) */}
        <div
          className={`space-y-4 overflow-y-auto pr-2 custom-scrollbar transition-all duration-300 ${
            viewDocUrl ? "w-full md:w-1/2 h-[600px]" : "w-full max-h-[600px]"
          }`}
        >
          {
             loading?
          (
            <p className="text-sm text-gray-500 text-center py-4">
              Loading...
            </p>
          ) :
          notesList.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No notes available.
            </p>
          ) : (
            notesList.map((item, index) => {
              const referencedTitle = getDocName(item.d_id);
              const referencedFile = getDocFilename(item.d_id);

              return (
                <div
                  key={item.id || index}
                  className="border rounded-lg p-3 md:p-4 bg-gray-50"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-2 md:gap-0">
                    <p className="text-gray-800 font-medium"> {item?.forwarded_by_name}</p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div
                    className="mt-2 whitespace-pre-wrap text-sm text-gray-700 overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />

                  {(referencedTitle || (item.range_from && item.range_two)) && (
                    <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                      <span className="font-semibold">References:</span>
                      <div className="mt-1 pl-2 border-l-2 border-blue-200 flex flex-col gap-1">
                        {referencedTitle && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleViewDocFromNote(referencedFile)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                                viewDocUrl && viewDocUrl.includes(referencedFile || '') 
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border-blue-200"
                              }`}
                            >
                              <FaEye className="w-3 h-3" />
                              <span className="font-medium">
                                {referencedTitle}
                              </span>{" "}
                              {item.range_from && item.range_two && (
                                <p>
                                  Pages: {item.range_from} – {item.range_two}
                                </p>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT SIDE: DOCUMENT VIEWER (Only shows when viewDocUrl is set) */}
        {viewDocUrl && (
          <div className="w-full md:w-1/2 h-[600px] bg-gray-100 rounded-lg border flex flex-col shadow-sm animate-fade-in">
            {/* Viewer Header */}
            <div className="flex items-center justify-between p-3 border-b bg-white rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                 Document View
              </h3>
              <button
                onClick={() => setViewDocUrl(null)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-500 rounded-full transition-colors"
                title="Close Viewer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            {/* Viewer Iframe */}
            <div className="flex-1 overflow-hidden relative bg-gray-200">
                <iframe
                  src={`${viewDocUrl}#zoom=page-width`}
                  className="w-full h-full border-0"
                  title="PDF Viewer"
                />
            </div>
          </div>
        )}
      </div>

      {/* ADD NOTE MODAL (UNCHANGED) */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 md:p-0">
          <div className="bg-white w-full md:w-11/12 h-full md:h-5/6 shadow-xl relative flex flex-col md:flex-row rounded-md overflow-hidden">
            <button
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white/80 hover:bg-gray-100 rounded-full z-10"
              onClick={() => setOpen(false)}
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4 md:mb-6">
                Add Note / Noting
              </h2>

              <label className="block text-sm font-medium mb-2">
                Note Content <span className="text-red-500">*</span>
              </label>

              <div
                className={`border rounded-md ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              >
                <Editor
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName px-3 min-h-[120px] md:min-h-[150px]"
                  placeholder="Enter your note here..."
                  toolbar={{
                    options: [
                      "inline",
                      "blockType",
                      "fontSize",
                      "list",
                      "textAlign",
                      "colorPicker",
                      "link",
                      "emoji",
                      "remove",
                      "history",
                    ],
                    inline: { options: ["bold", "italic", "underline"] },
                  }}
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description[0]}
                </p>
              )}

              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Reference by Document
                  </label>
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
                        {doc.title || "NA"}
                      </option>
                    ))}
                  </select>
                  {errors.d_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.d_id[0]}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium mb-2">
                    Pages
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className={`w-20 md:w-20 border rounded-md p-2 ${
                        errors.range_from
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="From"
                      value={pageRanges[0].from}
                      onChange={(e) =>
                        handlePageRangeChange(0, "from", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className={`w-20 md:w-20 border rounded-md p-2 ${
                        errors.range_two
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="To"
                      value={pageRanges[0].to}
                      onChange={(e) =>
                        handlePageRangeChange(0, "to", e.target.value)
                      }
                    />
                  </div>
                  {(errors.range_from || errors.range_two) && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>
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
                    isFormValid()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 border-t md:border-t-0 md:border-l flex flex-col min-h-[300px] md:min-h-0">
              <div className="w-full h-full flex items-center justify-center p-2">
                {loading ? (
                  <div className="text-gray-500 flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Loading PDF...
                  </div>
                ) : pdfViewUrl ? (
                  <iframe
                    src={`${pdfViewUrl}#zoom=page-width`}
                    className="w-full h-full border-0 rounded"
                    title="PDF Preview"
                  />
                ) : (
                  <p className="text-gray-400 text-sm text-center px-4">
                    Select a document to preview PDF <br />
                    (Preview appears here)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP (UNCHANGED) */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl my-auto">
            <div
              ref={popupRef}
              className="bg-white rounded-lg overflow-hidden"
            >
              <div className="px-4 py-3 md:px-6 md:py-4 border-b flex flex-wrap justify-between items-center bg-gray-100 pdf-hide-section gap-2">
                <p className="text-sm font-semibold text-gray-800">
                  Preview Note
                </p>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded hover:bg-gray-200 text-gray-700 flex items-center gap-1 text-xs font-medium"
                    title="Print"
                  >
                    <FaPrint /> <span className="hidden sm:inline">Print</span>
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    className="p-2 rounded hover:bg-gray-200 text-blue-600 flex items-center gap-1 text-xs font-medium"
                    title="Download as PDF"
                  >
                    <FaDownload />{" "}
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  <button
                    onClick={() => setShowSuccess(false)}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6 md:px-8 md:py-8 text-sm leading-relaxed text-gray-800 space-y-4 md:space-y-6">
                <p className="text-sm text-center font-semibold text-gray-800">
                  File No: {complaint?.file_number || complaint?.complain_no}
                </p>

                <p className="text-xs text-gray-500">
                  Date: {new Date().toLocaleDateString()}
                </p>

                <div
                  className="rounded-md bg-white px-2 py-2 md:px-5 md:py-4 min-h-[200px] md:min-h-[260px] whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: note }}
                />

                <div className="flex justify-between pt-4">
                  <div />
                  <div className="text-right text-xs text-gray-600">
                    <p className="uppercase tracking-wide">Noting By</p>
                    <p className="font-semibold mt-1 text-gray-800">
                      Shri Sanjay Mishra
                    </p>
                    <p>PS Name...</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 md:px-8 border-t bg-gray-100 flex justify-end gap-3 pdf-hide-section">
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
        </div>
      )}

      {/* TOAST */}
      <ToastContainer />
    </div>
  );
};

export default Notes;