import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileExcel, FaEye, FaSearch, FaSpinner, FaTimes, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Pagination from '../Pagination';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewLeaveFiels = () => {
  const { id } = useParams(); // Employee ID from URL
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;


  const [viewUrl, setViewUrl] = useState(null); 
  const [loadingDocId, setLoadingDocId] = useState(null); 

  const getEmploy = async () => {
    const res = await api.get(`/admin/get-employee-files/${id}`);
    console.log("Employ Data", res.data);
    return res.data;
  };

  const { data: getEmployData, isLoading } = useQuery({
    queryKey: ["get-employee-files", id], 
    queryFn: getEmploy
  });

  const filesList = getEmployData?.data || [];

  // 2. URL Generator Logic
  const makeFileUrl = (filePath) => {
    if (!filePath) return "";
    const root = BASE_URL.replace(/\/api\/?$/, ""); 
    const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    return `${root}${cleanPath}`;
  };

  // 3. Handle View Click
  const handleViewFile = async (fileId) => {
    try {
      setLoadingDocId(fileId);
      
      const res = await api.get(`/admin/get-file-pdf/${fileId}`);
      
      if (res.data.status === "success" || res.data.status === true) {
        const filePath = res.data.data;
        
        if (filePath) {
            const fullUrl = makeFileUrl(filePath);
            setViewUrl(fullUrl); 
        } else {
            toast.error("File path not found.");
        }
      } else {
        toast.error("File fetch failed.");
      }
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Server error while opening file.");
    } finally {
      setLoadingDocId(null);
    }
  };

  // Helper: Icons
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFilePdf className="text-gray-500 text-xl" />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return <FaFilePdf className="text-red-500 text-xl" />;
    if (['doc', 'docx'].includes(ext)) return <FaFileWord className="text-blue-500 text-xl" />;
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <FaFileImage className="text-purple-500 text-xl" />;
    return <FaFilePdf className="text-gray-500 text-xl" />;
  };

  // Filter Logic
  const filteredFiles = useMemo(() => {
    return filesList.filter((file) =>
      (file.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       file.type?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [filesList, searchTerm]);


const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

const paginatedFiles = filteredFiles.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);



  return (
    <div className="bg-gray-50 min-h-screen ">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full flex items-center gap-3">
        
          <div>
            <h1 className="text-xl font-bold text-gray-900">Employee Leave Files</h1>
            <p className="text-sm text-gray-600">कर्मचारी अवकाश फाइलें</p>

          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Qkby [kkstsa"
            className="pl-10 kruti-input pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                 <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading ...</td></tr>
              ) : filteredFiles.length > 0 ? (
                paginatedFiles.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(row.file)}
                        <div>
                            <p className="text-sm kruti-input font-medium text-gray-900">{row.title || "Untitled"}</p>
                            {/* <p className="text-xs text-gray-500 truncate max-w-[200px]">{row.file}</p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 kruti-input py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                            {row.type}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.created_at}</td>
                    
                    <td className="px-6 py-4 text-right">
                        <button 
                            onClick={() => handleViewFile(row.id)}
                            disabled={loadingDocId === row.id}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-white border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded transition shadow-sm"
                        >
                          {loadingDocId === row.id ? <FaSpinner className="animate-spin" /> : <FaEye />}
                          View
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No files found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  totalItems={filteredFiles.length}
  itemsPerPage={itemsPerPage}
/>



      {/* --- MODAL --- */}
      {viewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl">
            
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">File Preview</h3>
              <button 
                onClick={() => setViewUrl(null)} 
                className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
              >
                <FaTimes size={22} />
              </button>
            </div>

            <div className="flex-1 bg-gray-200 p-1 flex justify-center items-center overflow-hidden">
              {viewUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i) ? (
                <img 
                  src={viewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain shadow-lg"
                />
              ) : (
                <iframe
                  src={`${viewUrl}#toolbar=0`} 
                  className="w-full h-full border-0 bg-white shadow-lg"
                  title="PDF Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ViewLeaveFiels;