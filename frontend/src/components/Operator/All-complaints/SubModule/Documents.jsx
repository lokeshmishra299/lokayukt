import React, { useState, useEffect } from "react";
import { FaArrowUpLong, FaFilePdf } from "react-icons/fa6";
import { FaTimes, FaEye, FaSpinner } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const uploadApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Documents = ({ complaint }) => {
  const [correspondenceType, setCorrespondenceType] = useState("Letter");
  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // --- NEW STATE FOR FETCHING DOCUMENTS ---
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [pdfViewUrl, setPdfViewUrl] = useState(null);
  const [loadingDocId, setLoadingDocId] = useState(null);

  // --- 1. FETCH DOCUMENTS API (Operator List) ---
  const fetchDocuments = async () => {
    if (!complaint?.id) return;
    setIsLoadingDocs(true);
    try {
      // List fetch karne ke liye operator wali api
      const res = await api.get(`/operator/get-document/${complaint.id}`);
      if (res.data.status) {
        setDocuments(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [complaint?.id]);

  // --- 2. VIEW DOCUMENT HELPER ---
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

  const handleViewPdf = async (filename) => {
    try {
      setLoadingDocId(filename); 
      // ✅ UPDATED: View ke liye 'operator' wali API use ki hai
      const res = await api.get(`/operator/get-file-preview/${complaint.id}`);
      
      if (res.data.status && res.data.data.length > 0) {
        const match = res.data.data.find((p) => p.includes(filename));
        if (match) {
          const url = makeFileUrl(match);
          setPdfViewUrl(url);
        } else {
          toast.error("File not found on server.");
        }
      }
    } catch (err) {
      console.error("Preview Error", err);
      toast.error("Unable to open file.");
    } finally {
      setLoadingDocId(null);
    }
  };

  // --- EXISTING UPLOAD LOGIC ---
  const handleFileUpload = (e) => {
    setFieldErrors((prev) => ({ ...prev, file: undefined }));

    const files = Array.from(e.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length !== files.length) {
      toast.error("Only PDF files are allowed!");
      return;
    }

    setUploadedFiles((prevFiles) => {
      let updatedFiles = [...prevFiles];

      pdfFiles.forEach((file) => {
        const existingIndex = updatedFiles.findIndex(
          (f) => f.name === file.name
        );

        const newFileObj = {
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          uploadDate: new Date().toLocaleDateString(),
        };

        if (existingIndex !== -1) {
          updatedFiles[existingIndex] = newFileObj;
        } else {
          updatedFiles.push(newFileObj);
        }
      });

      return updatedFiles;
    });

    e.target.value = null;
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const uploadDocument = async () => {
    setFieldErrors({});

    if (!complaint?.id) {
      toast.error("Complaint ID is missing");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      uploadedFiles.forEach((fileData, index) => {
        formData.append(`file[${index}]`, fileData.file);
      });
      formData.append("type", correspondenceType);
      formData.append("title", title);
      formData.append("complain_id", complaint.id);

      // Upload ke liye operator wali api
      await uploadApi.post("/operator/upload-document", formData);

      toast.success("Uploaded document successfully!");
      setUploadedFiles([]);
      setTitle("");
      fetchDocuments();
    } catch (error) {
      const res = error.response?.data;
      if (res?.errors) {
        setFieldErrors(res.errors);
        if (res.errors.file) toast.error(res.errors.file[0]);
      } else if (res?.message) {
        toast.error(res.message);
      } else {
        toast.error("Failed to upload documents. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 w-full">
        
        {/* --- DOCUMENT LIST --- */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Existing Documents</h2>
          
          {isLoadingDocs ? (
            <div className="text-center py-4 text-gray-500">Loading documents...</div>
          ) : documents.length > 0 ? (
            <div className="grid gap-3">
              {documents.map((doc, index) => (
                <div 
                  key={doc.id || index} 
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-red-50 p-2 rounded-lg">
                      <FaFilePdf className="text-red-500 text-xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {doc.title || doc.file || "Untitled Document"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.type} • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewPdf(doc.file)}
                    disabled={loadingDocId === doc.file}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-70"
                  >
                    {loadingDocId === doc.file ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaEye />
                    )}
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center text-gray-500">
              No documents found for this file.
            </div>
          )}
        </div>

        {/* --- UPLOAD BOX --- */}
        <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          <h2 className="text-[17px] sm:text-[18px] text-blue-900 font-semibold mb-3">
            Attach New Incoming Correspondence
          </h2>

          <p className="text-sm text-blue-800 mb-3">
            Attach letters, reminders, RTI replies received after file movement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Add Title"
                className={`border px-3 py-2 rounded-lg w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  fieldErrors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.title[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correspondence Type <span className="text-red-500">*</span>
              </label>
              <select
                value={correspondenceType}
                onChange={(e) => {
                  setCorrespondenceType(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, type: undefined }));
                }}
                className={`border px-3 py-2 rounded-lg w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  fieldErrors.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option>Letter</option>
                <option>Reminder</option>
                <option>RTI Reply</option>
                <option>Counter Order</option>
              </select>
              {fieldErrors.type && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.type[0]}</p>
              )}
            </div>
          </div>

          <div className="mb-1">
            <label
              htmlFor="pdfUpload"
              className={`cursor-pointer w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition ${
                fieldErrors.file
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <FaArrowUpLong className="text-3xl text-gray-500 mb-2" />
              <p className="font-medium text-gray-700">
                Click to upload PDF(s)
              </p>
              <p className="text-xs text-gray-500">
                Only .pdf files are allowed
              </p>

              <input
                id="pdfUpload"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {fieldErrors.file && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.file[0]}
              </p>
            )}
          </div>
        </div>

        {/* Uploaded File List (Preview before upload) */}
        {uploadedFiles.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-[16px] sm:text-[17px] font-semibold mb-4">
              Selected Documents ({uploadedFiles.length}) - 
              <span className="text-blue-600"> {title ? `${correspondenceType}: ${title}` : correspondenceType}</span>
            </h3>

            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <FaFilePdf className="text-red-600 text-2xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
                        <span>{file.size} KB</span>
                        <span>{file.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="self-end sm:self-center p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end">
          <button
            onClick={uploadDocument}
            disabled={isUploading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
          >
            <FiUpload className="text-lg" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </div>

      <Toaster position="top-right" />

      {/* PDF View Modal */}
      {pdfViewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-800">Document Viewer</h3>
              <button
                onClick={() => setPdfViewUrl(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <iframe
              src={`${pdfViewUrl}#zoom=page-width`}
              className="w-full h-full border-0 bg-gray-100"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Documents;