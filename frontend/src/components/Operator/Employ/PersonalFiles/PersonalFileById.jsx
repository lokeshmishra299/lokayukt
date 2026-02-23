import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { FaFileAlt, FaEye } from "react-icons/fa";
import Notes from '../SubModule/Notes';
import MovementHistory from "../../../Operator/Employ/SubModule/MovementHistory"

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const PersonalFileById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("notings");

  const { data: response, isLoading } = useQuery({
    queryKey: ["personal-file-list", id],
    queryFn: async () => {
      const res = await api.get(`/operator/personal-file-list/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  const fileData = response?.data;

  // URL Generator (Fix for /storage/employeeFiles path)
  const getFileUrl = (fileName) => {
    if (!fileName) return "";
    
    // BASE_URL se '/api' hata kar root domain nikalo
    const root = BASE_URL.replace(/\/api\/?$/, ""); 

    // Path setup: Agar file me pehle se slash nahi hai to laga do
    let cleanPath = fileName.startsWith("/") ? fileName : `/${fileName}`;

    // Agar path me "/storage" nahi hai, to usko "/storage/employeeFiles" ke andar append kar do
    if (!cleanPath.includes("/storage/")) {
        cleanPath = `/storage/employeeFiles${cleanPath}`;
    }

    // Combine: http://127.0.0.1:8000/storage/employeeFiles/doc_123.pdf
    return `${root}${cleanPath}`;
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full bg-white flex flex-col min-h-screen">
        
        {/* Header Section */}
        <div className="p-4 md:p-6 border-b">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-semibold text-gray-800">
              File No. {fileData?.id} (<span className="text-blue-600 uppercase">{fileData?.title}</span>)
            </h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded bg-blue-100 text-blue-800 border-blue-200">
                {fileData?.type || "Personal File"}
              </span>
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
              >
                <IoMdArrowBack className="w-4 h-4" /> Back
              </button>
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="space-y-3 mb-6 mt-4">
            <div>
              <h3 className="text-gray-900 text-[14px] font-bold mb-2">फ़ाइल का विवरण</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[14px] text-black font-semibold uppercase mb-1">शीर्षक (Title)</p>
                  <p className="kruti-input text-gray-800 text-sm">{fileData?.title || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[14px] text-black font-semibold uppercase mb-1">दिनांक</p>
                  <p className="text-gray-800 text-sm">{fileData?.created_at || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[14px] text-black font-semibold uppercase mb-1">Forward Status</p>
                  <p className="text-gray-800 text-sm">{fileData?.is_forward === 1 ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- PDF FILE DISPLAY AREA (Sabse Upar) --- */}
          <div className="mt-4 border rounded-lg overflow-hidden bg-gray-100">
            <div className="bg-gray-200 px-4 py-2 flex justify-between items-center border-b">
              <span className="text-sm font-bold flex items-center gap-2">
                <FaFileAlt className="text-red-600" /> Document Preview
              </span>
              <a 
                href={getFileUrl(fileData?.file)} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 text-xs font-bold hover:underline"
              >
                Open in New Tab
              </a>
            </div>
            <div className="h-[500px] w-full">
              {fileData?.file ? (
                <iframe
                  src={`${getFileUrl(fileData?.file)}#toolbar=0`}
                  className="w-full h-full"
                  title="File Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 italic">
                  No file attachment found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Tab Navigation (Niche) --- */}
        <div className="hidden md:flex border-b px-6 mt-2">
          <div className="flex gap-6 overflow-x-auto">
            {["notings", "movement", "documents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 pt-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? "text-blue-600" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab === "notings" && "Notes / Notings"}
                {tab === "movement" && "Movement History"}
                {/* {tab === "documents" && "Related Documents"} */}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === "notings" && (
             <div>
              <Notes/>
             </div>
          )}
          {activeTab === "movement" && (
             <div>
              <MovementHistory/>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PersonalFileById;