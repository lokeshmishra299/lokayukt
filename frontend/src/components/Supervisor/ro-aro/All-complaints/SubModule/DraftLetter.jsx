import React, { useState, useRef } from "react";
import { FaEye, FaTimes, FaSpinner, FaCloudUploadAlt, FaFileAlt, FaPrint, FaDownload } from "react-icons/fa";
import { BsFileEarmarkPdf } from "react-icons/bs";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { RiEditBoxLine } from "react-icons/ri";

// Import Editor components
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import EditDraft from "./EditDraft";
// import image from '../public/Lokimage.png' 

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");
const subrole = localStorage.getItem("subrole");


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const DraftLetter = ({ complaint }) => {
  const [pdfViewUrl, setPdfViewUrl] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(null);
  const [openAddDocuments, setopenAddDocuments] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState(null);
const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  
  // -- Add Document State --
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    type: "", 
    file: null,
  });

  // -- Add Note/Noting State --
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [note, setNote] = useState("");
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [selectedDoc, setSelectedDoc] = useState("");
  const [pageRanges, setPageRanges] = useState([{ from: "", to: "" }]);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [errors, setErrors] = useState({});
  const [draftTitle, setDraftTitle] = useState(""); 

  // const [selectedDraftId, setSelectedDraftId] = useState(null);
const [editDraftPopup, setEditDraftPopup] = useState(false);


  // Refs for Print/Preview
  const popupRef = useRef(null);

  // -- EDIT DRAFT POPUP STATE --
  // const [editDraftPopup, setEditDraftPopup] = useState(false);
  // OPTIONAL: Agar aapko specific ID edit karni hai to state bhi rakho
  // const [selectedDraftId, setSelectedDraftId] = useState(null);

  const handleAddDocuments = () => {
    setopenAddDocuments(true);
  };

const handleEditDraft = (draftId, complaintId) => {
  setSelectedDraftId(draftId);
  setSelectedComplaintId(complaintId);
  setEditDraftPopup(true);
};

  // ✅ New Function to Close Popup properly
  const closeEditDraft = () => {
    setEditDraftPopup(false);
    // setSelectedDraftId(null);
  };

  // -- Note Modal Functions --
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setNote(content);
  };

  const handleSelectDoc = async (fileName) => {
    setSelectedDoc(fileName);
    setPdfPreviewUrl(null);

    if (!fileName) return;

    try {
      setLoadingPdf(true);
      const res = await api.get(`/supervisor/get-file-preview/${complaint.id}`);
      if (res.data.status && res.data.data.length > 0) {
        const match = res.data.data.find((p) => p.includes(fileName));
        if (match) {
          const url = makeFileUrl(match);
          setPdfPreviewUrl(url);
        } else {
          toast.error("PDF path not found");
        }
      }
    } catch {
      toast.error("PDF नहीं खुल पाया");
    } finally {
      setLoadingPdf(false);
    }
  };

  // 1. Updated: Just opens the Preview Popup
  const handleSubmitNote = () => {
    setErrors({});
    
    // Simple Validation
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      toast.error("Please enter some content.");
      return;
    }

    // Close Editor, Open Preview
    setOpenNoteModal(false);
    setShowSuccess(true);
  };

  // 2. Updated: Generate PDF Blob and Send as Binary
  const handleFinalSubmit = async () => {
    if (!popupRef.current) return;

    // A. Generate PDF Blob from Preview
    try {
      // Hide buttons for screenshot
      const elementsToHide = popupRef.current.querySelectorAll(".pdf-hide-section");
      elementsToHide.forEach((el) => (el.style.display = "none"));

      // Capture Screenshot
      const canvas = await html2canvas(popupRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      // Show buttons back
      elementsToHide.forEach((el) => (el.style.display = "flex"));

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Get Binary Blob
      const pdfBlob = pdf.output("blob");

      // B. Create FormData Payload
      const formData = new FormData();
      formData.append("complaint_id", complaint.id);
      formData.append("draft_note", note);
      formData.append("title", draftTitle);
      // Append generated PDF as 'file'
      formData.append("file", pdfBlob, `Draft_${complaint?.file_number || "File"}.pdf`);

      // C. Send API Request
      const res = await api.post("/supervisor/create-draft", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file upload
        },
      });

      if (res.data.status) {
        toast.success("Draft Added Successfully!");
        setShowSuccess(false); // Close Preview
        setDraftTitle(""); 
        setNote("");
        setEditorState(EditorState.createEmpty());

        setNote("");
        setEditorState(EditorState.createEmpty());
        setSelectedDoc("");
        setPageRanges([{ from: "", to: "" }]);
        setPdfPreviewUrl(null);
      } else if (res.data.errors) {
        // If error, reopen editor to fix
        setShowSuccess(false);
        setOpenNoteModal(true);
        setErrors(res.data.errors);
        Object.values(res.data.errors).forEach((msgArr) => {
          toast.error(msgArr[0]);
        });
      }
    } catch (err) {
      // Restore buttons if something crashed mid-way
      const elementsToHide = popupRef.current?.querySelectorAll(".pdf-hide-section");
      if(elementsToHide) elementsToHide.forEach((el) => (el.style.display = "flex"));

      toast.error("Server Error!");
      if (err.response && err.response.data) {
          setErrors(err.response.data);
      }
      console.error(err);
    }

    if (!draftTitle.trim()) {
      toast.error("Title is required.");
      return; // exit if empty
    }
  };

  // Print/Download Placeholders
  const handlePrint = () => {
    window.print();
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

  const {
    data: documents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["documents", complaint?.id],
    queryFn: async () => {
      const res = await api.get(`/supervisor/get-draft-letter/${complaint.id}`);
      return res.data.status ? res.data.data : [];
    },
    enabled: !!complaint?.id,
  });

  const handleViewPdf = async (filename) => {
    try {
      setLoadingDoc(filename);
      const res = await api.get(`/supervisor/get-file-preview/${complaint.id}`);
      if (res.data.status && res.data.data.length > 0) {
        const match = res.data.data.find((p) => p.includes(filename));
        if (match) {
          const url = makeFileUrl(match);
          setPdfViewUrl(url);
        }
      }
    } catch (err) {
      alert("PDF नहीं खुल पाया");
    } finally {
      setLoadingDoc(null);
    }
  };

  // -- Handle File Selection --
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewDoc({ ...newDoc, file: e.target.files[0] });
    }
  };

  // -- Handle Form Submit (File Upload) --
  const handleSubmitDocument = async () => {
    setErrors({}); // Reset errors
    
    if (!newDoc.title || !newDoc.type || !newDoc.file) {
      toast.error("Please fill all fields and select a file.");
      return;
    }

    if (!complaint?.id) {
      toast.error("Complaint ID is missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      formData.append("file", newDoc.file);
      formData.append("type", newDoc.type);
      formData.append("title", newDoc.title);
      formData.append("complain_id", complaint.id);

      const response = await api.post("/supervisor/upload-draft-letter", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Check if response has errors
      if (response.data.status === false) {
        setErrors(response.data.errors || {});
        toast.error("Upload failed!");
        return;
      }

      toast.success("Document uploaded successfully!");
      setopenAddDocuments(false);
      setNewDoc({ title: "", type: "", file: null }); 
      refetch(); 
    } catch (error) {
      console.error("Upload failed", error);
      
      // Handle backend validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error("Validation error!");
      } else {
        const msg = error.response?.data?.message || "Failed to upload document.";
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
        <p className="text-sm">Error loading documents</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Draft</h2>
        <div className="flex items-center gap-2">
          <button
            className="bg-blue-600 text-white px-3 py-2 text-xs rounded-lg hover:bg-blue-700 transition"
            onClick={() => setOpenNoteModal(true)}
          >
            Create Draft
          </button>

          <button
            onClick={handleAddDocuments}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaCloudUploadAlt className="w-4 h-4" />
            Add Draft
          </button>
        </div>
      </div>

      {/* Docs List */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No documents available
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <BsFileEarmarkPdf className="w-6 h-6 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {doc.title || "NA"}
                  </span>
                  {doc.type && (
                    <span className="text-xs text-gray-500">{doc.type}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* View Button */}
                <button
                  onClick={() => handleViewPdf(doc.file)}
                  disabled={loadingDoc === doc.file}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                >
                  {loadingDoc === doc.file ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                  View
                </button>

                {/* Edit Button (Opens Popup) */}
  <button
  onClick={() => handleEditDraft(doc.id, doc.complain_id)}
  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50"
>
  <RiEditBoxLine className="w-4 h-4" />
  Edit
</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Edit Draft Popup (Pass closeModal) */}
{editDraftPopup && (
  <EditDraft
    draftId={selectedDraftId}
    complaintId={selectedComplaintId}
    closeModal={() => {
      setEditDraftPopup(false);
      setSelectedDraftId(null);
      setSelectedComplaintId(null);
    }}
  />
)}


      {/* Add Document Modal */}
      {openAddDocuments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg flex flex-col shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                Add New Draft
              </h3>
              <button
                onClick={() => setopenAddDocuments(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Draft Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Draft Title"
                  value={newDoc.title}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Correspondence Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newDoc.type}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="">Select Type</option>
                  <option value="Draft Letter">Draft Letter</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    {newDoc.file ? (
                      <>
                        <FaFileAlt className="w-8 h-8 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {newDoc.file.name}
                        </span>
                        <span className={`text-xs ${
                          newDoc.file.size > 2 * 1024 * 1024 
                            ? 'text-red-500 font-semibold' 
                            : 'text-green-500'
                        }`}>
                          Size: {(newDoc.file.size / 1024).toFixed(0)} KB
                          {newDoc.file.size > 2 * 1024 * 1024 && ' (Too large!)'}
                        </span>
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm text-gray-500">
                          Click to browse or drag file here
                        </span>
                        <span className="text-xs text-gray-400">
                          PDF, JPG, PNG (Max 2MB)
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                {errors && errors.file && errors.file[0] && (
                  <div className="text-red-500 text-xs mt-1 p-2 bg-red-50 border border-red-200 rounded">
                     {errors.file[0]}
                  </div>
                )}
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setopenAddDocuments(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDocument}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {isSubmitting && <FaSpinner className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Uploading..." : "Upload Draft"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note/Noting Modal (EDITOR) */}
      {openNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 md:p-0">
          <div className="bg-white w-full md:w-11/12 h-full md:h-[70vh] shadow-xl relative flex flex-col md:flex-row rounded-md overflow-hidden">
            <button
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white/80 hover:bg-gray-100 rounded-full z-10"
              onClick={() => setOpenNoteModal(false)}
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 px-4 md:p-6 overflow-y-auto">
             <label className="block text-md font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={draftTitle}   // bind karo state
              onChange={(e) => setDraftTitle(e.target.value)} // update state on change
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />

              <h2 className="text-lg font-semibold mb-4 md:mb-6">Create Draft</h2>
              <label className="block text-sm font-medium mb-2">
                Draft Content <span className="text-red-500">*</span>
              </label>
              <div
                className={`border rounded-md ${
                  errors.draft_note ? "border-red-500" : "border-gray-300"
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
              {errors.draft_note && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.draft_note[0]}
                </p>
              )}
              <div className="flex justify-end mt-24"> 
                <button
                  className="bg-blue-600 text-white px-3 py-3 rounded-lg hover:bg-blue-700 transition text-md"
                  onClick={handleSubmitNote} // THIS OPENS THE POPUP
                >
                 Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS / PREVIEW POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl my-auto">
            <div ref={popupRef} className="bg-white rounded-lg overflow-hidden">
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
                    <FaDownload /> <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              </div>

      <div className="mt-5 py-5 px-6 w-full flex justify-between font-[Mangal] text-black">
      {/* Left Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">लोक आयुक्त</h1>
        <h2 className="text-xl font-bold mt-1">उत्तर प्रदेश</h2>

        <div className="mt-4 mx-auto w-28 h-28 border-2 border-black rounded-full flex items-center justify-center text-sm leading-tight">
         <img
  src="/public/images/Lokimage.png"  // ✅ public folder से direct
  alt="Lok Ayukt"
  className="max-w-full max-h-full"
/>
        </div>
      </div>

      {/* Right Section */}
      <div className="text-base leading-7">
        <p>पोस्ट बाक्स नं 172 (जी.पी.ओ.)</p>
        <p>टी.सी. 46/बी-1, विभूति खण्ड</p>
        <p>गोमती नगर</p>
        <p>लखनऊ-226 010</p>

        <div className="mt-4">
          <p>दूरभाष : 2728660</p>
          <p className="ml-14">2306717</p>
        </div>

        <div className="mt-4">
          <p>फैक्स : (0522) 2306647</p>
        </div>
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
                    <p>{subrole}</p>
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
                  onClick={handleFinalSubmit} // THIS CALLS THE API WITH PDF BINARY
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF View Modal */}
      {pdfViewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">PDF Viewer</h3>
              <button
                onClick={() => setPdfViewUrl(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <iframe
              src={`${pdfViewUrl}#zoom=page-width`}
              className="w-full h-full border-0"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftLetter;