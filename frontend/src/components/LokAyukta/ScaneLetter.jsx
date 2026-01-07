import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaFilePdf,
  FaTimes,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTrash,
} from "react-icons/fa";
import { MdOutlineScanner } from "react-icons/md";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ScanLetter = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    complaint_id: "",
    letter_type: "",
     medium:"",
    subject: "",
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // 1. Fetch Complaint IDs
  const getAllComplainsID = async () => {
    const res = await api.get("/lokayukt/all-complain-ids");
    return res.data;
  };

  const { data: complainIdsData } = useQuery({
    queryKey: ["all-complain-ids"],
    queryFn: getAllComplainsID,
  });

  const complainList = complainIdsData?.data || [];

  // 2. Fetch All Dispatch Letters (NEW API CALL)
  const getAllDispatchLetters = async () => {
    const res = await api.get("/lokayukt/all-dispatch-letters");
    return res.data;
  };

  const { data: dispatchLettersData, isLoading: isLettersLoading } = useQuery({
    queryKey: ["all-dispatch-letters"],
    queryFn: getAllDispatchLetters,
  });

  const lettersList = dispatchLettersData?.data || [];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  // Handle File Change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (errors.file) {
        setErrors({ ...errors, file: null });
      }
    }
  };

  // Submit Logic
  const submitScaneData = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = new FormData();

    payload.append("complaint_id", formData.complaint_id);
    payload.append("letter_type", formData.letter_type);
    payload.append(" medium", formData.medium);
    payload.append("subject", formData.subject);

    if (selectedFile) {
      payload.append("file", selectedFile);
    }

    try {
      const res = await api.post("/lokayukt/add-dispatch", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Letter uploaded successfully!");
      console.log("Data Posted", res.data);

      // Refresh the list after success
      queryClient.invalidateQueries(["all-dispatch-letters"]);

      // Reset Form
      setFormData({
        complaint_id: "",
        letter_type: "",
         medium:"",
        subject: "",
      });
      setSelectedFile(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting:", error);

      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        // toast.error("Please check the required fields.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "NA";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  // Helper to find Complaint No from ID
  const getComplaintNo = (id) => {
    if (!id) return "NA";
    const found = complainList.find((c) => c.id == id);
    return found ? found.compNo : "NA";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            Scan Letters
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Scan and attach letters to case files
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
        >
          <MdOutlineScanner className="text-lg" /> Scan New Letter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-h-[500px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6">
          Scan Letters / स्कैन किए गए पत्र
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 min-w-[800px]">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Scan Date</th>
                <th className="px-6 py-3 whitespace-nowrap">Letter No.</th>
                <th className="px-6 py-3 whitespace-nowrap">Complaint No.</th>
                <th className="px-6 py-3 whitespace-nowrap">Type</th>
                <th className="px-6 py-3 whitespace-nowrap">Subject</th>
                <th className="px-6 py-3 whitespace-nowrap">Pages</th>
                <th className="px-6 py-3 whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLettersLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : lettersList.length > 0 ? (
                lettersList.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      {row.letter_no || "NA"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:underline cursor-pointer">
                      {getComplaintNo(row.complaint_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.letter_type || "NA"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 max-w-xs truncate">
                      {row.subject || "NA"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">NA</td>
                    <td className="px-6 py-4 whitespace-nowrap">NA</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end items-center gap-3">
                      <button className="text-gray-500 hover:text-gray-700 p-2">
                        <FaFilePdf />
                      </button>
                      {/* You can re-enable this check mark if you have status logic later */}
                      {/* <button className="text-green-600 hover:text-green-700 p-2"><FaCheckCircle /></button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
          <form
            onSubmit={submitScaneData}
            className="bg-white rounded-t-xl sm:mx-0 mx-5 md:rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-start p-4 md:p-5 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Scan / Upload Letter
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Scan a new letter or upload a scanned document
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedFile(null);
                  setErrors({});
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4 overflow-y-auto">
              {/* ------------ UPDATED DROPDOWN START ------------ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Number / प्रकरण संख्या{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="complaint_id"
                  value={formData.complaint_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-600 ${
                    errors.complaint_id ? "" : "border-gray-200"
                  }`}
                >
                  <option value="">Select Case Number</option>

                  {/* Mapping the data: Value is ID, Display is compNo */}
                  {complainList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.compNo}
                    </option>
                  ))}
                </select>
                {/* Validation Error Message */}
                {errors.complaint_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.complaint_id[0]}
                  </p>
                )}
              </div>
              {/* ------------ UPDATED DROPDOWN END ------------ */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Letter Type / पत्र प्रकार{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="letter_type"
                  value={formData.letter_type}
                  onChange= {handleChange}
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-600 ${
                    errors.letter_type ? "" : "border-gray-200"
                  }`}
                >
                  <option value="">Select type</option>
                  <option value="Incoming">Incoming</option>
                  <option value="Outgoing">Outgoing</option>
                  <option value="Internal Note">Internal Note</option>
                </select>
                {errors.letter_type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.letter_type[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medium / माध्यम{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-600 ${
                    errors.medium ? "" : "border-gray-200"
                  }`}
                >
                  <option value="">Select type</option>
                  <option value="Mode">Email</option>
                  <option value="Post">Post</option>
                  <option value="By Hand">By Hand</option>
                </select>
                {errors.medium && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.medium[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject / विषय <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Enter letter subject..."
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none ${
                    errors.subject ? "" : "border-gray-200"
                  }`}
                ></textarea>
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subject[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File / फाइल अपलोड करें{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />

                {!selectedFile ? (
                  <div
                    onClick={handleUploadAreaClick}
                    className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition-colors group ${
                      errors.file
                        ? "border-red-300 bg-red-50"
                        : "border-blue-200 bg-blue-50/50 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FaCloudUploadAlt
                        className={`text-3xl transition-transform group-hover:scale-110 ${
                          errors.file ? "text-red-400" : "text-blue-400"
                        }`}
                      />
                      <span className="text-sm text-gray-600 font-medium">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-gray-400">
                        PDF, JPG, PNG (max 10MB)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="border border-blue-200 rounded-lg bg-blue-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FaFilePdf className="text-red-500 text-2xl shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 shrink-0"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                )}
                {errors.file && (
                  <p className="text-red-500 text-xs mt-1">{errors.file[0]}</p>
                )}
              </div>
            </div>

            <div className="p-4 md:p-5 bg-gray-50 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedFile(null);
                  setErrors({});
                }}
                className="w-full md:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
              >
                Upload & Attach
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ScanLetter;
