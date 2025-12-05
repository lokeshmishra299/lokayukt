import React, { useState } from "react";
import { FaArrowUpLong, FaFilePdf } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleFileUpload = (e) => {
    setFieldErrors((prev) => ({ ...prev, file: undefined })); // clear file error

    const files = Array.from(e.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length !== files.length) {
      toast.error("Only PDF files are allowed!");
      return;
    }

    const newFiles = pdfFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(2),
      uploadDate: new Date().toLocaleDateString(),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
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

      uploadedFiles.forEach((fileData) => {
        formData.append("file", fileData.file);
      });

      formData.append("type", correspondenceType);
      formData.append("complain_id", complaint.id);

      await uploadApi.post("/operator/upload-document", formData);

      toast.success("Uploaded document successfully!");
      setUploadedFiles([]);
    } catch (error) {
      const res = error.response?.data;

      if (res?.errors) {
        setFieldErrors(res.errors);
        // const firstKey = Object.keys(res.errors)[0];
        // const firstMsg = res.errors[firstKey]?.[0];
        if (firstMsg) toast.error(firstMsg);
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
        {/* Warning Box */}
        <div className="p-4 bg-yellow-50 text-yellow-700 border border-yellow-500 rounded-lg">
          <div className="flex items-start gap-3">
            <CiLock size={26} className="mt-0.5 flex-shrink-0" />
            <div>
              <h1 className="text-[15px] sm:text-[16px] font-semibold">
                You cannot view existing documents while the file is in motion.
              </h1>
              <p className="text-[13px] sm:text-[14px] mt-1 leading-snug">
                Document contents are confidential during review by authorities.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Box */}
        <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          <h2 className="text-[17px] sm:text-[18px] text-blue-900 font-semibold mb-3">
            Attach New Incoming Correspondence
          </h2>

          <p className="text-sm text-blue-800 mb-3">
            Attach letters, reminders, RTI replies received after file movement.
          </p>

          {/* Correspondence Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correspondence Type (for all files)
            </label>
            <select
              value={correspondenceType}
              onChange={(e) => {
                setCorrespondenceType(e.target.value);
                setFieldErrors((prev) => ({ ...prev, type: undefined }));
              }}
              className={`border px-3 py-2 rounded-lg w-full sm:w-60 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                fieldErrors.type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option>Letter</option>
              <option>Reminder</option>
              <option>RTI Reply</option>
              <option>Counter Order</option>
            </select>
            {fieldErrors.type && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.type[0]}
              </p>
            )}
          </div>

          {/* PDF Upload Input */}
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

        {/* Uploaded File List */}
        {uploadedFiles.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-[16px] sm:text-[17px] font-semibold mb-4">
              Selected Documents ({uploadedFiles.length}) -
              <span className="text-blue-600"> {correspondenceType}</span>
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

        {/* Upload Button */}
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

      <ToastContainer />
    </>
  );
};

export default Documents;
