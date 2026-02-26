import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaTimes, FaSpinner, FaCloudUploadAlt, FaFileAlt, FaPrint, FaDownload } from "react-icons/fa";
import { BsFileEarmarkPdf } from "react-icons/bs";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import { RiEditBoxLine } from "react-icons/ri";
import { Modifier } from "draft-js";

// Import Editor components
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import EditDraft from "./EditDraft";
import Pagination from "../../../../Pagination";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");
const name = localStorage.getItem("name");
const subRole  = localStorage.getItem("subrole");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const DraftLetter = ({ complaint }) => {
  const [pdfViewUrl, setPdfViewUrl] = useState(null);
  const [draftPage, setDraftPage] = useState(1);
const itemsPerPage = 10;
  const [loadingDoc, setLoadingDoc] = useState(null);
  const [openAddDocuments, setopenAddDocuments] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  
  // Preview States
  const [previewImages, setPreviewImages] = useState([]); 
  const [generatingPreview, setGeneratingPreview] = useState(false); 
  const [sentEditorState, setSentEditorState] = useState(() =>
  EditorState.createEmpty()
);


const [sentToPersonInfo, setSentToPersonInfo] = useState("")
  
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
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  
  // -- Validation Errors State --
  const [errors, setErrors] = useState({});
  const [draftTitle, setDraftTitle] = useState(""); 

  const [editDraftPopup, setEditDraftPopup] = useState(false);

  const handlePastedText = (text, html, editorState) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const newContent = Modifier.replaceText(
    contentState,
    selection,
    text,
    editorState.getCurrentInlineStyle()
  );

  const newState = EditorState.push(editorState, newContent, "insert-characters");
  setEditorState(newState);

  return true; // ❌ stop HTML paste
};


  // Refs for Print/Preview
  const popupRef = useRef(null);

  const handleAddDocuments = () => {
    setErrors({});
    setopenAddDocuments(true);
  };

  const handleEditDraft = (draftId, complaintId) => {
    setSelectedDraftId(draftId);
    setSelectedComplaintId(complaintId);
    setEditDraftPopup(true);
  };

  // --- PREVIEW GENERATOR FOR SCREEN ---
  const generatePreview = async () => {
    if (!popupRef.current) return;
    
    setGeneratingPreview(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const canvas = await html2canvas(popupRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowHeight: popupRef.current.scrollHeight + 100,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pageHeight = (imgWidth * 297) / 210; 
      
      let heightLeft = imgHeight;
      let position = 0;
      const pages = [];

      pages.push({ image: imgData, position: 0 });
      heightLeft -= pageHeight;
      
      let pageCount = 1;
      while (heightLeft > 0) {
        position = - (pageHeight * pageCount);
        pages.push({ image: imgData, position: position });
        heightLeft -= pageHeight;
        pageCount++;
      }

      setPreviewImages(pages);
    } catch (error) {
      console.error("Preview Generation Failed", error);
      toast.error("Preview generate नहीं हो पाया");
    } finally {
      setGeneratingPreview(false);
    }
  };

  // --- 1. SMART SPLIT HELPER (टेक्स्ट कटने से बचाता है) ---
  const getSafeSplitY = (ctx, width, startY, pageHeightPx, totalHeight) => {
    const proposedSplit = Math.min(startY + pageHeightPx, totalHeight);
    if (proposedSplit >= totalHeight) return totalHeight;

    // 100px ऊपर तक स्कैन करें
    const scanRange = 100;
    const imageData = ctx.getImageData(0, proposedSplit - scanRange, width, scanRange);
    const data = imageData.data;

    for (let y = scanRange - 1; y >= 0; y--) {
      let isRowWhite = true;
      for (let x = 0; x < width; x += 10) {
        const idx = (y * width + x) * 4;
        // अगर पिक्सल डार्क है (टेक्स्ट है)
        if (data[idx] < 240 || data[idx + 1] < 240 || data[idx + 2] < 240) {
          isRowWhite = false;
          break;
        }
      }
      if (isRowWhite) return (proposedSplit - scanRange) + y;
    }
    return proposedSplit;
  };

  // --- 2. MASTER PDF GENERATOR (Print, Download & Submit के लिए कॉमन फंक्शन) ---
  const generatePdfDocument = async () => {
    if (!popupRef.current) return null;

    try {
      // बटन छुपाएं
      const elementsToHide = popupRef.current.querySelectorAll(".pdf-hide-section");
      elementsToHide.forEach((el) => (el.style.display = "none"));

      // Canvas बनाएँ
      const canvas = await html2canvas(popupRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowHeight: popupRef.current.scrollHeight + 50,
        onclone: (document) => {
          // बॉर्डर और शैडो हटाएं (काली लाइन रोकने के लिए)
          const el = document.getElementById("pdf-content-div");
          if (el) {
            el.style.border = "none";
            el.style.boxShadow = "none";
            el.style.margin = "0";
          }
        },
      });

      // बटन वापस दिखाएं
      elementsToHide.forEach((el) => (el.style.display = "flex"));

      // PDF Setup
      const ctx = canvas.getContext("2d");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pageHeight = 297;
      const marginTop = 10;     // पैडिंग (ऊपर)
      const marginBottom = 10;  // पैडिंग (नीचे)
      const printableHeight = pageHeight - marginTop - marginBottom;
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const printableHeightPx = (imgWidth * printableHeight) / pdfWidth;

      let currentY = 0;
      let pageCount = 0;

      while (currentY < imgHeight) {
        if (pageCount > 0) pdf.addPage();

        // सेफ कट पॉइंट ढूंढें
        const splitY = getSafeSplitY(ctx, imgWidth, currentY, printableHeightPx, imgHeight);
        const sliceHeight = splitY - currentY;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = imgWidth;
        tempCanvas.height = sliceHeight;
        const tempCtx = tempCanvas.getContext("2d");
        
        // स्लाइस काटें
        tempCtx.drawImage(canvas, 0, currentY, imgWidth, sliceHeight, 0, 0, imgWidth, sliceHeight);

        const sliceImgData = tempCanvas.toDataURL("image/png");
        const pdfSliceHeight = (sliceHeight * pdfWidth) / imgWidth;

        // PDF में डालें (Margin के साथ)
        pdf.addImage(sliceImgData, "PNG", 0, marginTop, pdfWidth, pdfSliceHeight);

        currentY = splitY;
        pageCount++;
      }
      return pdf;

    } catch (err) {
      console.error("PDF Generation Error:", err);
      // एरर आए तो बटन वापस दिखाएं
      const elementsToHide = popupRef.current?.querySelectorAll(".pdf-hide-section");
      if(elementsToHide) elementsToHide.forEach((el) => (el.style.display = "flex"));
      return null;
    }
  };

  // --- 3. HANDLE PRINT (FIXED) ---
  const handlePrint = async () => {
    const pdf = await generatePdfDocument();
    if (pdf) {
      // PDF को सीधे प्रिंट मोड में खोलें (Browser Print नहीं)
      pdf.autoPrint(); 
      const blobUrl = pdf.output("bloburl");
      window.open(blobUrl, "_blank");
    } else {
      toast.error("Failed to prepare Print document");
    }
  };

  // --- 4. HANDLE DOWNLOAD ---
  const handleDownloadPdf = async () => {
    const pdf = await generatePdfDocument();
    if (pdf) {
      pdf.save(`Noting_${complaint?.file_number || "File"}.pdf`);
      toast.success("PDF Downloaded Successfully!");
    } else {
      toast.error("Failed to Download PDF");
    }
  };

  // --- 5. HANDLE SUBMIT (Using same High-Quality Logic) ---
  const handleFinalSubmit = async () => {
    const pdf = await generatePdfDocument();
    
    if (!pdf) {
        toast.error("Error creating document for submission");
        return;
    }

    try {
      const pdfBlob = pdf.output("blob");
      
      const formData = new FormData();
      formData.append("complaint_id", complaint.id);
      formData.append("draft_note", note);
      formData.append("title", draftTitle);
      formData.append("sent_to_person_info", sentToPersonInfo);

      formData.append("file", pdfBlob, `Draft_${complaint?.file_number || "File"}.pdf`);

      const res = await api.post("/supervisor/create-draft", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        toast.success("Draft Added Successfully!");
        setShowSuccess(false);
        setDraftTitle("");
        setNote("");
        setSentToPersonInfo("");
          setSentEditorState(EditorState.createEmpty()); 
        setEditorState(EditorState.createEmpty());
        setErrors({});
        refetch();
      } else if (res.data.errors) {
        setShowSuccess(false);
        setOpenNoteModal(true);
        setErrors(res.data.errors);
        Object.values(res.data.errors).forEach((msgArr) => {
           toast.error(msgArr[0]);
        });
      }
    } catch (err) {
      toast.error("Server Error!");
      console.error(err);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      setPreviewImages([]); 
      generatePreview();
    }
  }, [showSuccess]);

  const closeEditDraft = () => {
    setEditDraftPopup(false);
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setNote(content);
    
    const contentState = editorState.getCurrentContent();
    if (contentState.hasText() && errors.draft_note) {
         setErrors(prev => ({...prev, draft_note: null}));
    }
  };

  const onSentEditorChange = (state) => {
  setSentEditorState(state);
  const html = draftToHtml(
    convertToRaw(state.getCurrentContent())
  );
  setSentToPersonInfo(html);
};


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
      toast.error("PDF नहीं खुल पाया");
    } finally {
      setLoadingDoc(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewDoc({ ...newDoc, file: e.target.files[0] });
      if (errors.file) setErrors({ ...errors, file: null });
    }
  };

  const handleSubmitDocument = async () => {
    setErrors({}); 
    
    if (!complaint?.id) {
      toast.error("Complaint ID is missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (newDoc.file) formData.append("file", newDoc.file);
      formData.append("type", newDoc.type || "");
      formData.append("title", newDoc.title || "");
      formData.append("complain_id", complaint.id);

      const response = await api.post("/supervisor/upload-draft-letter", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === false) {
        setErrors(response.data.errors || {});
        toast.error("Upload failed!");
        return;
      }

      toast.success("Document uploaded successfully!");
      setopenAddDocuments(false);
      setNewDoc({ title: "", type: "", file: null }); 
      setErrors({});
      refetch(); 
    } catch (error) {
      console.error("Upload failed", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        const msg = error.response?.data?.message || "Failed to upload document.";
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitNote = () => {
    setErrors({});
    const newErrors = {};
    let hasError = false;

    if (!draftTitle || !draftTitle.trim()) {
        newErrors.title = ["Title is required."];
        hasError = true;
    }

    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      newErrors.draft_note = ["Draft content is required."];
      hasError = true;
    }

    const sentContent = sentEditorState.getCurrentContent();
if (!sentContent.hasText()) {
  newErrors.sent_to_person_info = ["Sent To Person Info is required."];
  hasError = true;
}


    if (hasError) {
        setErrors(newErrors);
        return;
    }

    setOpenNoteModal(false);
    setShowSuccess(true);
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

  useEffect(() => {
  setDraftPage(1);
}, [documents]);

const lastIndex = draftPage * itemsPerPage;
const firstIndex = lastIndex - itemsPerPage;
const currentDrafts = documents.slice(firstIndex, lastIndex);
const totalPages = Math.ceil(documents.length / itemsPerPage);


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
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Draft</h2>
        <div className="flex items-center gap-2">
          {

            complaint?.assign_to_ro_aro ? 
            Number(complaint?.approved_rejected_by_ro_aro) !== 1 && (
              <button
            className="bg-blue-600 text-white px-3 py-2 text-xs rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
                setErrors({}); 
                setOpenNoteModal(true);
            }}
          >
            Create Draft
          </button>
          )
          :
          <div>

          </div>

          }
         
        {
          

          complaint?.assign_to_ro_aro
          ? 
          Number(complaint?.approved_rejected_by_ro_aro) !== 1 && (
  <button
    onClick={handleAddDocuments}
    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <FaCloudUploadAlt className="w-4 h-4" />
    Add Draft
  </button>
)
:
<div>
  
</div>

}
         
        </div>
      </div>

      {/* Docs List */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No documents available
          </div>
        ) : (
          currentDrafts.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <BsFileEarmarkPdf className="w-6 h-6 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm kruti-input font-medium text-gray-800">
                    {doc.title || "NA"}
                  </span>
                  {doc.type && (
                    <span className="text-xs text-gray-500">{doc.type}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
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

                {Number(complaint?.approved_rejected_by_ro_aro) !== 1 &&(
                      <button
                onClick={() => handleEditDraft(doc.id, doc.complain_id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                <RiEditBoxLine className="w-4 h-4" />
                Edit
                </button>
                )

                }
               
              </div>
            </div>
          ))
        )}
      </div>

      {documents.length > itemsPerPage && (
  <Pagination
    currentPage={draftPage}
    totalPages={totalPages}
    onPageChange={setDraftPage}
    totalItems={documents.length}
    itemsPerPage={itemsPerPage}
  />
)}

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
              {/* Draft Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Draft Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Draft Title"
                  value={newDoc.title}
                  onChange={(e) => {
                    setNewDoc({ ...newDoc, title: e.target.value });
                    if(errors.title) setErrors({...errors, title: null});
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.title ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              

              {/* Correspondence Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Correspondence Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newDoc.type}
                  onChange={(e) => {
                    setNewDoc({ ...newDoc, type: e.target.value });
                    if(errors.type) setErrors({...errors, type: null});
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all bg-white ${
                    errors.type ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="Draft Letter">Draft Letter</option>
                </select>
                {errors.type && (
                  <p className="text-xs text-red-500 mt-1">{errors.type}</p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <div className={`relative border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer group ${
                    errors.file ? "border-red-400 bg-red-50" : "border-gray-300"
                  }`}>
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
                        <FaCloudUploadAlt className={`w-8 h-8 transition-colors ${errors.file ? "text-red-400" : "text-gray-400 group-hover:text-blue-500"}`} />
                        <span className={`text-sm ${errors.file ? "text-red-500" : "text-gray-500"}`}>
                          Click to browse or drag file here
                        </span>
                        <span className="text-xs text-gray-400">
                          PDF, JPG, PNG (Max 2MB)
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {errors.file && (
                  <p className="text-xs text-red-500 mt-1">{errors.file}</p>
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

      {/* Add Note/Noting Modal */}
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
              <h2 className="text-lg font-semibold mb-4 md:mb-6 mt-4">Create Draft</h2>
             <label className="block text-md font-medium mb-2">
              Draft Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Mªk¶V 'kZ'kZd fy[ksa"
              value={draftTitle}  
              onChange={(e) => {
                  setDraftTitle(e.target.value);
                  if(errors.title) setErrors({...errors, title: null}); 
              }}
              className={`w-full kruti-input px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title[0]}
                </p>
            )}



            <label className="block text-sm font-medium my-2">
  Sent To Person Info
</label>

<div className="border border-gray-300 rounded-md mt-5">
  <Editor
    editorState={sentEditorState}
    onEditorStateChange={onSentEditorChange}
    // handlePastedText={handlePastedText}
    stripPastedStyles={true}
    editorClassName="kruti-input px-3  min-h-[100px]"
    editorStyle={{ lineHeight: "1.2", minHeight: "120px" }}
    placeholder="यहाँ भेजे गए व्यक्ति की जानकारी लिखें..."
    toolbar={{
      options: ["inline", "list", "textAlign", "history"],
      inline: { options: ["bold", "italic", "underline"] },
    }}
  />
</div>


{errors.sent_to_person_info && (
  <p className="text-red-500 text-xs mt-1">
    {errors.sent_to_person_info[0]}
  </p>
)}


            
              <label className="block text-sm font-medium my-2">
                Draft Content <span className="text-red-500">*</span>
              </label>
              <div
                className={`border rounded-md ${
                  errors.draft_note ? "border-red-500" : "border-gray-300"
                }`}
              >

            
                
                {/* <Editor
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName px-3 min-h-[120px] md:min-h-[150px]"
                  editorStyle={{ lineHeight: '1.2', minHeight: '150px' }}
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
                /> */}


<style>{`
.kruti-input div[data-block="true"], 
.kruti-input p,
.public-DraftStyleDefault-block {
  margin: 0 !important;
  padding: 0 !important;
}

.kruti-input .public-DraftEditor-content {
 padding-top: 6px !important;
  font-family: 'KrutiDev' !important;
  font-size: 20px !important;
  line-height: 1.1 !important; 
}

.kruti-input .public-DraftEditorPlaceholder-root {
  font-family: sans-serif !important;
  font-size: 14px !important;
  color: #9ca3af !important;
}

.kruti-input ol, 
.kruti-input ul, 
.kruti-input li {
  font-family: sans-serif !important;
}

.kruti-input li span,
.kruti-input li div {
  font-family: 'KrutiDev' !important;
}
`}</style>
                <Editor

                
  editorState={editorState}
  onEditorStateChange={onEditorStateChange}
  handlePastedText={handlePastedText}   
  stripPastedStyles={true}              
  toolbarClassName="toolbarClassName"
  wrapperClassName="wrapperClassName"
  editorClassName="editorClassName kruti-input px-3 min-h-[120px] md:min-h-[150px]"
  editorStyle={{ lineHeight: '1.2', minHeight: '150px' }}
  placeholder="ड्राफ्ट यहाँ लिखें..."
  toolbar={{
    options: ["inline","blockType","fontSize","list","textAlign","colorPicker","link","emoji","remove","history"],
    inline: { options: ["bold","italic","underline"] },
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
                  onClick={handleSubmitNote}
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
        {/* --- IMPORTANT: Added ID here --- */}
        <div 
            ref={popupRef} 
            id="pdf-content-div"  
            className="bg-white rounded-lg overflow-hidden"
        >

        <style>{`
            .draft-preview-content ol {
              list-style-type: decimal !important;
              padding-left: 20px !important;
              margin-bottom: 10px;
            }
            .draft-preview-content ul {
              list-style-type: disc !important;
              padding-left: 20px !important;
              margin-bottom: 10px;
            }
            .draft-preview-content li {
              margin-bottom: 4px;
            }
          `}</style>

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


     

            {/* --- HEADER SECTION --- */}
            {/* Added pb-0 to remove bottom padding causing gap */}
            <div className="mt-5 pt-5 px-6 pb-2 w-full flex justify-between items-start font-[Mangal] text-black">
            
                {/* Left Side Info - Removed 'relative top-9', added 'mt-8' for same look without gap */}
                  <div className="mt-8"> 
                    <h1>{subRole}</h1>
                    <h1>{name}</h1>
                    <h1>लोक आयुक्त उ०प्र०</h1>
                    <p className="">लखनऊ |</p>
                  </div>
              
                  {/* Center Logo - Removed 'relative left-6' if not needed, kept structure */}
                  <div className="w-1/3 relative left-6 text-center">
                    <h1 className="text-xl font-bold">लोक आयुक्त</h1>
                    <h2 className="text-md font-bold mt-1">उत्तर प्रदेश</h2>

                    <div className="mt-1 mx-auto w-25 h-25  rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src="/images/ChatGPTImage.png"
                        alt="Lok Ayukt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right Side Address */}
                  <div className="w-1/3 text-[15px] font-bold leading-6 text-right">
                    <p>पोस्ट बाक्स नं 172 (जी.पी.ओ.)</p>
                    <p>टी.सी. 46/बी-1, विभूति खण्ड</p>
                    <p>गोमती नगर</p>
                    <p>लखनऊ-226 010</p>

                    <div className="mt-1">
                      <p>दूरभाष : 2728660</p>
                      <p className="pr-0">2306717</p>
                    </div>  

                    <p className="mt-1">फैक्स : (0522) 2306647</p>
                  </div>
            </div>

          {/* --- BODY SECTION --- */}
          {/* Removed py-6/py-8, changed to pt-0 to pull content up */}
          <div className="px-6 pb-6 pt-0 md:px-8 md:pb-8 text-sm leading-relaxed text-gray-800 space-y-4 md:space-y-6">

            {/* Removed 'relative bottom-16' which was breaking flow */}
            <div className="-ml-5 mt-2"> 
              
              <div
  className="ml-6 draft-preview-content"
  dangerouslySetInnerHTML={{
    __html: sentToPersonInfo
      ?.replace(
  /<li>/g,
  '<li style="font-family: KrutiDev; font-size:20px; margin:0; padding:0; line-height:1.1;">'
)
.replace(
  /<p>/g,
  '<p style="font-family: KrutiDev; font-size:20px; margin:0; padding:0; line-height:1.1;">'
)
  }}
/>


            </div>



            {/* File No & Date – parallel */}
            <div className="flex justify-between  items-center">
              <p className="text-sm relative top-1 text-gray-500">
              संख्या: { complaint?.complain_no}
              </p>
              <p className="text-sm text-gray-500">
                दिनांक: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div
              className="rounded-md bg-white min-h-[200px] md:min-h-[260px] draft-preview-content"
              dangerouslySetInnerHTML={{
                __html: note
                 .replace(
  /<li>/g,
  '<li style="font-family: Arial, sans-serif; margin:0; padding:0; line-height:1.1;"><span style="font-family: KrutiDev; font-size:22px; line-height:1.1;">'
)
.replace(
  /<\/li>/g,
  '</span></li>'
)
.replace(
  /<p>/g,
  '<p style="font-family: KrutiDev; font-size:22px; margin:0; padding:0; line-height:1.1;">'
)
              }}
            />

            <div className="flex justify-between pt-4">
              <div />
              <div className="text-right text-xs text-gray-600">
                <p className="uppercase tracking-wide">भवदीय</p>
                <p>{name}</p>
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