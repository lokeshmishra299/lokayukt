import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaSpinner, FaDownload, FaPrint, FaEye } from "react-icons/fa";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

// 🎯 सिर्फ एक बार और सही इम्पोर्ट (Error Fixed)
import { EditorState, convertToRaw, Modifier, ContentState } from "draft-js";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");
const name = localStorage.getItem("name");

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
  const [pdfViewUrl, setPdfViewUrl] = useState(null);
  const [viewDocUrl, setViewDocUrl] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageRanges, setPageRanges] = useState([{ from: "", to: "" }]);
  const [errors, setErrors] = useState({});

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  // 🎯 पेस्टिंग फिक्स: सारी पुरानी स्टाइल हटाकर नॉर्मल 20px/22px टेक्स्ट पेस्ट करेगा
  const handlePastedText = (text, html, editorState) => {
    const pastedBlocks = ContentState.createFromText(text).getBlockMap();
    const newContent = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      pastedBlocks
    );
    const newState = EditorState.push(editorState, newContent, "insert-fragment");
    onEditorStateChange(newState);
    return "handled";
  };

  // --- 1. SMART SPLIT HELPER ---
  const getSafeSplitY = (ctx, width, startY, pageHeightPx, totalHeight) => {
    const proposedSplit = Math.min(startY + pageHeightPx, totalHeight);
    if (proposedSplit >= totalHeight) return totalHeight;

    const scanRange = 150; 
    const imageData = ctx.getImageData(0, proposedSplit - scanRange, width, scanRange);
    const data = imageData.data;

    for (let y = scanRange - 1; y >= 0; y--) {
      let isRowWhite = true;
      for (let x = 0; x < width; x += 10) {
        const idx = (y * width + x) * 4;
        if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
          isRowWhite = false;
          break;
        }
      }
      if (isRowWhite) return (proposedSplit - scanRange) + y;
    }
    return proposedSplit;
  };

  // --- 2. MASTER PDF GENERATOR ---
  const generatePdfDocument = async () => {
    if (!popupRef.current) return null;

    try {
      const elementsToHide = popupRef.current.querySelectorAll(".pdf-hide-section");
      elementsToHide.forEach((el) => (el.style.display = "none"));

      const canvas = await html2canvas(popupRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowHeight: popupRef.current.scrollHeight + 50,
        
        onclone: (document) => {
          const el = document.getElementById("pdf-content-div");
          if (el) {
            el.style.border = "none";
            el.style.boxShadow = "none";
            el.style.margin = "0";
            
            const styles = document.createElement("style");
            styles.innerHTML = `
            .draft-preview-content * {
                font-family: 'KrutiDev' !important;
            }
            .draft-preview-content p { margin-bottom: 10px !important; line-height: 1.5 !important; }
            .draft-preview-content li { margin-bottom: 8px !important; line-height: 1.5 !important; }
            .draft-preview-content ol, .draft-preview-content ul { margin-bottom: 10px !important; }
            `;
            document.head.appendChild(styles);
          }
        },
      });

      elementsToHide.forEach((el) => (el.style.display = "flex"));

      const ctx = canvas.getContext("2d");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pageHeight = 297;
      const marginTop = 15;    
      const marginBottom = 15; 
      const printableHeight = pageHeight - marginTop - marginBottom;
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const printableHeightPx = (imgWidth * printableHeight) / pdfWidth;

      let currentY = 0;
      let pageCount = 0;

      while (currentY < imgHeight) {
        if (pageCount > 0) pdf.addPage();

        const splitY = getSafeSplitY(ctx, imgWidth, currentY, printableHeightPx, imgHeight);
        const sliceHeight = splitY - currentY;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = imgWidth;
        tempCanvas.height = sliceHeight;
        const tempCtx = tempCanvas.getContext("2d");
        
        tempCtx.drawImage(canvas, 0, currentY, imgWidth, sliceHeight, 0, 0, imgWidth, sliceHeight);

        const sliceImgData = tempCanvas.toDataURL("image/png");
        const pdfSliceHeight = (sliceHeight * pdfWidth) / imgWidth;

        pdf.addImage(sliceImgData, "PNG", 0, marginTop, pdfWidth, pdfSliceHeight);

        currentY = splitY;
        pageCount++;
      }
      return pdf;

    } catch (err) {
      console.error("PDF Generation Error:", err);
      const elementsToHide = popupRef.current?.querySelectorAll(".pdf-hide-section");
      if(elementsToHide) elementsToHide.forEach((el) => (el.style.display = "flex"));
      return null;
    }
  };

  const handleDownloadPdf = async () => {
    const pdf = await generatePdfDocument();
    if (pdf) {
      pdf.save(`Noting_${complaint?.file_number || "File"}.pdf`);
      toast.success("PDF Downloaded successfully!");
    } else {
      toast.error("Failed to generate PDF");
    }
  };

  const handlePrint = async () => {
    const pdf = await generatePdfDocument();
    if (pdf) {
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    } else {
      toast.error("Failed to prepare Print");
    }
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get(`/lokayukt/get-document/${complaint?.id}`);
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
      const res = await api.get(`/lokayukt/get-notes/${complaint.id}`);
      if (res.data.status) {
        setNotesList(res.data.data);
      }
    } catch (err) {
      console.log("Notes fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [complaint?.id]);

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

  const fetchPdfPath = async (filename) => {
    try {
      const res = await api.get(`/lokayukt/get-file-preview/${complaint.id}`);
      if (res.data.status && res.data.data.length > 0) {
        const match = res.data.data.find((p) => p.includes(filename));
        if (match) return makeFileUrl(match);
      }
    } catch (err) {
      console.error("Error fetching PDF path", err);
    }
    return null;
  };

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

  const handleViewDocFromNote = async (fileName, noteId) => {
    setActiveNoteId(noteId);   
    if (!fileName) return;

    const url = await fetchPdfPath(fileName);
    if (url) setViewDocUrl(url);
    else toast.error("Document not found");
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setNote(content);
  };

  const handleSubmitNote = () => {
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      toast.error("Please add some note content");
      return;
    }
    setOpen(false);
    setShowSuccess(true);
  };

  const handleFinalSubmit = async () => {
    const pdf = await generatePdfDocument();
    
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
      const res = await api.post("/lokayukt/add-notes", payload);

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
    return contentState.hasText(); 
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
          onClick={() => {
            setNote(""); 
            setEditorState(EditorState.createEmpty()); 
            setSelectedDoc("");
            setPageRanges([{ from: "", to: "" }]);
            setPdfViewUrl(null);
            setOpen(true); 
          }}
        >
          Add Note / Noting
        </button>
      </div>

      {/* 50:50 SPLIT CONTAINER */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT SIDE: NOTES LIST */}
        <div
          className={`space-y-4 overflow-y-auto pr-2 custom-scrollbar transition-all duration-300 ${
            viewDocUrl ? "w-full md:w-1/2 h-[600px]" : "w-full max-h-[600px]"
          }`}
        >
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
          ) : notesList.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No notes available.</p>
          ) : (
            notesList.map((item, index) => {
              const referencedTitle = getDocName(item.d_id);
              const referencedFile = getDocFilename(item.d_id);

              return (
                <div key={item.id || index} className="border rounded-lg p-3 md:p-4 bg-gray-50">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-2 md:gap-0">
                    <p className="text-gray-800 font-medium"> {item?.forwarded_by_name}</p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* 🎯 आपकी ओरिजिनल लाइन-हाइट 1.1 बरकरार रखी गई है */}
                  <style>{`
                    .fetched-note-content p, 
                    .fetched-note-content div {
                        padding-top: 6px !important;   
                       margin-top: 0 !important;
                       margin-bottom: 2px !important; 
                       line-height: 1.1 !important;  
                    }
                    .fetched-note-content ol, 
                    .fetched-note-content ul {
                       margin-top: 0 !important;
                       margin-bottom: 2px !important;
                       padding-left: 20px !important;
                    }
                  `}</style>

                  <div
                    className="mt-2 fetched-note-content kruti-input text-sm text-gray-700 overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />

                  {(referencedTitle || (item.range_from && item.range_two)) && (
                    <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                      <span className="font-semibold">References:</span>
                      <div className="mt-1 pl-2 border-l-2 border-blue-200 flex flex-col gap-1">
                        {referencedTitle && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleViewDocFromNote(referencedFile, item.id)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                                activeNoteId === item.id 
                                  ? "bg-blue-600 text-white border-blue-600" 
                                  : "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border-blue-200"
                              }`}
                            >
                              <FaEye className="w-3 h-3" />
                              <span className="font-medium">{referencedTitle}</span>
                              {item.range_from && item.range_two && (
                                <p>Pages: {item.range_from} – {item.range_two}</p>
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

        {/* RIGHT SIDE: DOCUMENT VIEWER */}
        {viewDocUrl && (
          <div className="w-full md:w-1/2 h-[600px] bg-gray-100 rounded-lg border flex flex-col shadow-sm animate-fade-in">
            <div className="flex items-center justify-between p-3 border-b bg-white rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Document View
              </h3>
              <button
                onClick={() => {
                  setViewDocUrl(null);
                  setActiveNoteId(null); 
                }}
                className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-500 rounded-full transition-colors"
                title="Close Viewer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
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

      {/* ADD NOTE MODAL */}
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
              <h2 className="text-lg font-semibold mb-4 md:mb-6">Add Note / Noting</h2>

              <label className="block text-sm font-medium mb-2">
                Note Content <span className="text-red-500">*</span>
              </label>

              <div className={`border rounded-md ${errors.description ? "border-red-500" : "border-gray-300"}`}>
                
                {/* 🎯 आपकी ओरिजिनल लाइन-हाइट 1.1 और 1.2 बरकरार रखी गई है */}
                <style>{`
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
                    position: absolute;
                    z-index: 0;
                    pointer-events: none;
                  }
                  .kruti-input ol, 
                  .kruti-input ul, 
                  .kruti-input li {
                    font-family: sans-serif !important; 
                  }
                  .kruti-input li span, 
                  .kruti-input li div {
                    font-family: 'KrutiDev' !important;
                    font-size: 22px !important;
                  }
                `}</style>

                <Editor
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  handlePastedText={handlePastedText} 
                  stripPastedStyles={true}
                  editorClassName="editorClassName kruti-input px-3 min-h-[120px] md:min-h-[150px]"
                  editorStyle={{ lineHeight: '1.2', minHeight: '150px' }}
                  placeholder="Enter your note here..."
                  toolbar={{
                    options: ["inline", "blockType", "fontSize", "list", "textAlign", "colorPicker", "link", "emoji", "remove", "history"],
                    inline: { options: ["bold", "italic", "underline"] },
                  }}
                />
              </div>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}

              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Reference by Document</label>
                  <select
                    className={`w-full border rounded-md p-2 ${errors.d_id ? "border-red-500" : "border-gray-300"}`}
                    value={selectedDoc}
                    onChange={(e) => handleSelectDoc(e.target.value)}
                  >
                    <option value="">Select a document...</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.file}>{doc.title || "NA"}</option>
                    ))}
                  </select>
                  {errors.d_id && <p className="text-red-500 text-xs mt-1">{errors.d_id[0]}</p>}
                </div>

                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium mb-2">Pages</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className={`w-20 md:w-20 border rounded-md p-2 ${errors.range_from ? "border-red-500" : "border-gray-300"}`}
                      placeholder="From"
                      value={pageRanges[0].from}
                      onChange={(e) => handlePageRangeChange(0, "from", e.target.value)}
                    />
                    <input
                      type="number"
                      className={`w-20 md:w-20 border rounded-md p-2 ${errors.range_two ? "border-red-500" : "border-gray-300"}`}
                      placeholder="To"
                      value={pageRanges[0].to}
                      onChange={(e) => handlePageRangeChange(0, "to", e.target.value)}
                    />
                  </div>
                  {(errors.range_from || errors.range_two) && <p className="text-red-500 text-xs mt-1">Required</p>}
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3 border-t pt-4">
                <button className="px-4 py-2 text-sm border rounded-md" onClick={() => setOpen(false)}>Cancel</button>
                <button
                  onClick={handleSubmitNote}
                  disabled={!isFormValid()}
                  className={`px-4 py-2 text-sm rounded-md text-white ${isFormValid() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 border-t md:border-t-0 md:border-l flex flex-col min-h-[300px] md:min-h-0">
              <div className="w-full h-full flex items-center justify-center p-2">
                {loading ? (
                  <div className="text-gray-500 flex items-center gap-2"><FaSpinner className="animate-spin" /> Loading PDF...</div>
                ) : pdfViewUrl ? (
                  <iframe src={`${pdfViewUrl}#zoom=page-width`} className="w-full h-full border-0 rounded" title="PDF Preview" />
                ) : (
                  <p className="text-gray-400 text-sm text-center px-4">Select a document to preview PDF <br /> (Preview appears here)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP WITH PREVIEW */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl my-auto">
            
            <div ref={popupRef} id="pdf-content-div" className="bg-white rounded-lg overflow-hidden">
              
              {/* 🎯 आपकी ओरिजिनल लाइन-हाइट 1.15 बरकरार रखी गई है */}
              <style>{`
                .draft-preview-content * {
                  margin-top: 0 !important;
                  margin-bottom: 0 !important;
                  padding-top: 0 !important;
                  padding-bottom: 0 !important;
                  line-height: 1.15 !important;
                }
                .draft-preview-content p {
                   font-family: 'KrutiDev' !important;
                   font-size: 22px !important;
                   min-height: 1em;
                   margin-bottom: 4px !important;
                }
                .draft-preview-content ol, 
                .draft-preview-content ul, 
                .draft-preview-content li {
                  font-family: sans-serif !important; 
                  list-style-position: outside !important;
                  margin-left: 20px !important; 
                }
                .draft-preview-content ol { list-style-type: decimal !important; }
                .draft-preview-content ul { list-style-type: disc !important; }
                .draft-preview-content li {
                  display: list-item !important;
                  margin-bottom: 2px !important;
                }
              `}</style>

              <div className="px-4 py-3 md:px-6 md:py-4 border-b flex flex-wrap justify-between items-center bg-gray-100 pdf-hide-section gap-2">
                <p className="text-sm font-semibold text-gray-800">Preview Note</p>
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={handlePrint} className="p-2 rounded hover:bg-gray-200 text-gray-700 flex items-center gap-1 text-xs font-medium">
                    <FaPrint /> <span className="hidden sm:inline">Print</span>
                  </button>
                  <button onClick={handleDownloadPdf} className="p-2 rounded hover:bg-gray-200 text-blue-600 flex items-center gap-1 text-xs font-medium">
                    <FaDownload /> <span className="hidden sm:inline">Download</span>
                  </button>
                  <button onClick={() => setShowSuccess(false)} className="p-2 rounded hover:bg-gray-200 text-gray-600">
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6 md:px-8 md:py-8 text-sm leading-relaxed text-gray-800 space-y-4 md:space-y-6">
                
                {/* 🎯 आपकी ओरिजिनल लाइन-हाइट 1.0 बरकरार रखी गई है */}
                <div
                  className="rounded-md kruti-input bg-white px-2 py-2 md:px-5 md:py-4 min-h-[200px] draft-preview-content"
                  dangerouslySetInnerHTML={{
                    __html: note
                    .replace(/<li>/g, '<li style="font-family: Arial, sans-serif !important; margin-bottom: 0px !important; line-height: 1.0 !important;"><span style="font-family: \'KrutiDev\' !important; font-size: 22px;">')
                    .replace(/<\/li>/g, '</span></li>')
                    .replace(/<p>/g, '<p style="font-family: \'KrutiDev\' !important; font-size: 22px; margin-top: 0px !important; margin-bottom: 2px !important; line-height: 1.0 !important;">')
                  }}
                />

                <div className="flex justify-between pt-4">
                  <div />
                  <div className="text-right text-xs text-gray-600">
                    <p className="uppercase tracking-wide">Noting By</p>
                    <p>{name}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 md:px-8 border-t bg-gray-100 flex justify-end gap-3 pdf-hide-section">
                <button className="px-4 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-200 text-gray-700" onClick={() => setShowSuccess(false)}>Cancel</button>
                <button className="px-6 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleFinalSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notes;