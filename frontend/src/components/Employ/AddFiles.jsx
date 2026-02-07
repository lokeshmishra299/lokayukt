import React, { useState } from "react";
import { FaArrowUpLong, FaFilePdf } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";

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

const AddFiles = () => {
  const [correspondenceType, setCorrespondenceType] = useState("Letter");
  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});


  // All Files

 const AllFiles = async () => {
  const res = await api.get("/employee/filetypes");
  console.log("All Files", res.data.data); 
  return res.data.data;
};

  const {data: allFilesData} = useQuery({
    queryKey: ["filetypes"],
    queryFn: AllFiles
  })

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


    if (!title.trim()) {
        setFieldErrors((prev) => ({ ...prev, title: ["Title is required"] }));
        return;
    }

    if (uploadedFiles.length === 0) {
        setFieldErrors((prev) => ({ ...prev, file: ["Please select at least one file."] }));
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
      
    
      await uploadApi.post("/employee/upload-file", formData);

      toast.success("Uploaded document successfully!");
      setUploadedFiles([]);
      setTitle(""); 
      setCorrespondenceType("Letter"); 
    } catch (error) {
      const res = error.response?.data;

      if (res?.errors) {
        setFieldErrors(res.errors);
        const firstKey = Object.keys(res.errors)[0];
        const firstMsg = res.errors[firstKey]?.[0];
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
      {/* <div className="space-y-6 w-full h-screen"> */}
      <div className="space-y-6 w-full min-h-screen pb-10">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add Leave Files</h1>
            <p className="text-sm sm:text-base text-gray-600 break-words">
              छुट्टी फाइल जोड़ें
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            
          <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Topic <span className="text-red-500">*</span>
  </label>

  
 {!title && (
  <span className="absolute left-3 top-[32px] text-gray-400 text-base pointer-events-none kruti-input">
    fo"k; tksM+s
  </span>
)}

  <input
    type="text"
    value={title}
    onChange={(e) => {
      setTitle(e.target.value);
      setFieldErrors((prev) => ({ ...prev, title: undefined }));
    }}
    className={`border kruti-input px-3 py-2 text-base rounded-lg w-full bg-white text-gray-700
      focus:outline-none focus:ring-2 focus:ring-blue-300
      ${
        fieldErrors.title ? "border-red-500" : "border-gray-300"
      }`}
  />

  {fieldErrors.title && (
    <p className="mt-1 text-xs text-red-600">
      {fieldErrors.title[0]}
    </p>
  )}
</div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FIle Types  <span className="text-red-500">*</span>
              </label>
           <select
  value={correspondenceType}
  onChange={(e) => {
    setCorrespondenceType(e.target.value);
    setFieldErrors((prev) => ({ ...prev, type: undefined }));
  }}
  className={`border kruti-input px-3 py-2 rounded-lg w-full bg-white text-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-300
    ${fieldErrors.type ? "border-red-500" : "border-gray-300"}`}
>
  {/* <option value="">Select File Type</option> */}
  <option value="">QksbZ Qkby izdkj pqusa</option>


  {allFilesData?.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
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

        {uploadedFiles.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-[16px] sm:text-[17px] font-semibold mb-4">
              Selected Documents ({uploadedFiles.length}) 
              {/* <span className="text-blue-600"> {title ? `${correspondenceType}: ${title}` : correspondenceType}</span> */}
            </h3>

            {/* <div className="space-y-3"> */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">

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
            {isUploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </div>

      <Toaster position="top-right"  />
    </>
  );
};

export default AddFiles;