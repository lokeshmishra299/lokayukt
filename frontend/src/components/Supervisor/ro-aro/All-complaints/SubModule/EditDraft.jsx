import React, { useState, useEffect } from "react";
import { FaTimes, FaCloudUploadAlt, FaFileAlt, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query"; 

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});


const EditDraft = ({ closeModal, draftId, complaintId }) => {
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    type: "Draft Letter", 
  });

  const [existingFile, setExistingFile] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: draftData, isLoading, isError } = useQuery({
    queryKey: ["editDraft", draftId],
    queryFn: async () => {
      const res = await api.get(`/supervisor/edit-draft-letter/${draftId}`);
      return res.data;
    },
    enabled: !!draftId, 
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (draftData && draftData.status && draftData.data) {
      const data = draftData.data;
      setFormData((prev) => ({
        ...prev,
        title: data.title || "",
        type: data.type || "Draft Letter",
      }));
      setExistingFile(data.file); 
    } else if (isError) {
        toast.error("Failed to load draft details.");
    }
  }, [draftData, isError]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!formData.title) {
      toast.error("Title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("id", draftId); 
      payload.append("title", formData.title);
      payload.append("type", formData.type);
      
      if(complaintId) {
          payload.append("complain_id", complaintId);
      }

      if (formData.file) {
        payload.append("file", formData.file);
      }

      const res = await api.post(`/supervisor/update-draft-letter/${draftId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        toast.success(res.data.message || "Draft Updated Successfully!");
        if (closeModal) closeModal(); 
      } else {
        if (res.data.errors) {
            setErrors(res.data.errors);
            const firstErrorKey = Object.keys(res.data.errors)[0];
            if(firstErrorKey) toast.error(res.data.errors[firstErrorKey][0]);
        } else {
            toast.error(res.data.message || "Failed to update draft.");
        }
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Server Error while updating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 md:p-0">
          <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 md:p-0">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}

        {
          isLoading ? (
            <div>
              Loading...
            </div>
          )
          :

             <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Edit Draft</h3>
          <button
            onClick={closeModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        /* Content */}
        <div className="p-6 space-y-5">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Draft Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Draft Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                  errors.title ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
             {errors.title && <p className="text-xs text-red-500">{errors.title[0]}</p>}
          </div>

          {/* File Upload Section */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Upload New File <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            
            {/* Show Existing File Info */}
            {existingFile && !formData.file && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-100 rounded flex items-center gap-2 text-sm text-blue-800">
                <FaFileAlt />
                <span className="truncate">Current: {existingFile}</span>
              </div>
            )}

            <div className={`relative border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer group ${
                 errors.file ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}>
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                {formData.file ? (
                  <>
                    <FaFileAlt className="w-8 h-8 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {formData.file.name}
                    </span>
                    <span className="text-xs text-green-500">
                      Size: {(formData.file.size / 1024).toFixed(0)} KB
                    </span>
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm text-gray-500">
                      Click to replace existing file
                    </span>
                    <span className="text-xs text-gray-400">
                      PDF, JPG, PNG (Max 2MB)
                    </span>
                  </>
                )}
              </div>
            </div>
             {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file[0]}</p>}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all shadow-sm"
          >
            {isSubmitting && <FaSpinner className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Updating..." : "Update Draft"}
          </button>
        </div>
        
     
      </div>
    </div>
  );
};

export default EditDraft;
