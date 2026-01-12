import React, { useState } from "react";
import { FaEye, FaTimes, FaSpinner, FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";
import { BsFileEarmarkPdf } from "react-icons/bs";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
// import { toast } from "react-toastify";
import { toast } from "react-hot-toast";


const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Documents = ({ complaint }) => {
  const [pdfViewUrl, setPdfViewUrl] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(null);
  const [openAddDocuments, setopenAddDocuments] = useState(false);

  // -- Add Document State --
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    type: "Letter", // Default to first option
    file: null,
  });

  // Backend Errors State
  const [errors, setErrors] = useState({});

  const handleAddDocuments = () => {
    setErrors({});
    setopenAddDocuments(true);
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
      const res = await api.get(`/lokayukt/get-document/${complaint.id}`);
      return res.data.status ? res.data.data : [];
    },
    enabled: !!complaint?.id,
  });

  const handleViewPdf = async (filename) => {
    try {
      setLoadingDoc(filename);
      const res = await api.get(`/lokayukt/get-file-preview/${complaint.id}`);
      if (res.data.status && res.data.data.length > 0) {
        const match = res.data.data.find((p) => p.includes(filename));
        if (match) {
          const url = makeFileUrl(match);
          setPdfViewUrl(url);
        }
      }
    } catch (err) {
      // alert("PDF nahi khul paya");
    } finally {
      setLoadingDoc(null);
    }
  };

  // -- Handle File Selection --
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewDoc({ ...newDoc, file: e.target.files[0] });
      // Clear file error locally when user selects file
      if (errors.file) setErrors({ ...errors, file: null });
    }
  };

  // -- Handle Form Submit --
  const handleSubmitDocument = async () => {
    // 1. Reset Errors
    setErrors({});

    // 2. CHECK REMOVED: Maine wo code hata diya jo empty fields ko rok raha tha.
    // Ab request seedha backend pe jayegi chahe fields khali hon.

    if (!complaint?.id) {
      toast.error("Complaint ID missing");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Agar file null hai toh bhi backend bhej rahe hain taaki backend error de
      if(newDoc.file) {
          formData.append("file", newDoc.file);
      }
      formData.append("type", newDoc.type || ""); // Empty string agar khali ho
      formData.append("title", newDoc.title || ""); 
      formData.append("complain_id", complaint.id);

      await api.post("/lokayukt/upload-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded successfully!");
      setopenAddDocuments(false);
      setNewDoc({ title: "", type: "Letter", file: null });
      setErrors({});
      refetch();
    } catch (error) {
      console.error("Upload failed", error);
      
      // -- Backend Errors Capture --
      if (error.response && error.response.data && error.response.data.errors) {
        // Backend se aaye errors ko state me set kar rahe hain
        setErrors(error.response.data.errors);
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
      {/* <Toaster position="top-right"  /> */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
        <button
          onClick={handleAddDocuments}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaCloudUploadAlt className="w-4 h-4" />
          Add Documents
        </button>
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
              {/* Icon + Filename */}
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

              {/* Actions */}
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Document Modal */}
      {openAddDocuments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg flex flex-col shadow-2xl animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                Add New Document
              </h3>
              <button
                onClick={() => setopenAddDocuments(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Document Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Document Title"
                  value={newDoc.title}
                  onChange={(e) => {
                    setNewDoc({ ...newDoc, title: e.target.value });
                    if(errors.title) setErrors({...errors, title: null});
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                    errors.title ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {/* --- BACKEND ERROR FOR TITLE --- */}
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Document Type */}
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
                  <option value="Letter">Letter</option>
                  <option value="Reminder">Reminder</option>
                  <option value="RTI Reply">RTI Reply</option>
                  <option value="Counter Order">Counter Order</option>
                </select>
                {/* --- BACKEND ERROR FOR TYPE --- */}
                {errors.type && (
                  <p className="text-xs text-red-500 mt-1">{errors.type}</p>
                )}
              </div>

              {/* File Upload Area */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`relative border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer group ${
                    errors.file ? "border-red-400 bg-red-50" : "border-gray-300"
                  }`}
                >
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
                        <span className="text-xs text-gray-500">
                          {(newDoc.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className={`w-8 h-8 transition-colors ${errors.file ? "text-red-400" : "text-gray-400 group-hover:text-blue-500"}`} />
                        <span className={`text-sm ${errors.file ? "text-red-500" : "text-gray-500"}`}>
                          Click to browse or drag file here
                        </span>
                        <span className="text-xs text-gray-400">
                          PDF, JPG, PNG (Max 5MB)
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {/* --- BACKEND ERROR FOR FILE --- */}
                {errors.file && (
                  <p className="text-xs text-red-500 mt-1">{errors.file}</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
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
                {isSubmitting ? "Uploading..." : "Upload Document"}
              </button>
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

export default Documents;