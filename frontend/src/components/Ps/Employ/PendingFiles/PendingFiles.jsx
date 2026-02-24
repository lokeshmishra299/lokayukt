import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useMemo, useEffect } from 'react';
import { 
  FaFilePdf, FaFileWord, FaFileImage, 
  FaEye, FaSearch, FaSpinner, FaTimes
} from 'react-icons/fa';
import Pagination from '../../../Pagination';
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewPersonalFiles = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const [viewUrl, setViewUrl] = useState(null); 
  const [loadingDocId, setLoadingDocId] = useState(null); 

  // --- API Fetching (GET ONLY) ---
  const getAllFiles = async () => {
    const res = await api.get("/ps/personal-file-list");
    console.log("Personal Files", res.data);
    return res.data;
  };

  const { data: allFileData, isLoading } = useQuery({
    queryKey: ["get-leave-personal-details"],
    queryFn: getAllFiles
  });

  const filesList = Array.isArray(allFileData) ? allFileData : allFileData?.data || [];

  // --- Handlers ---
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFilePdf className="text-gray-500 text-xl" />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return <FaFilePdf className="text-red-500 text-xl" />;
    if (['doc', 'docx'].includes(ext)) return <FaFileWord className="text-blue-500 text-xl" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return <FaFileImage className="text-purple-500 text-xl" />;
    return <FaFilePdf className="text-gray-500 text-xl" />;
  };

  const handleViewFile = (fileId) => {
    navigate(`${fileId}`);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- Filter & Pagination Logic ---
  const filteredFiles = useMemo(() => {
    return filesList.filter((file) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        file.title?.toLowerCase().includes(searchLower) || 
        file.type?.toLowerCase().includes(searchLower) ||
        file.user?.name?.toLowerCase().includes(searchLower) ||
        file.status?.toLowerCase().includes(searchLower)
      );
    });
  }, [filesList, searchTerm]);

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-gray-50 min-h-screen ">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
         
         {/* Title */}
         <div className="w-full md:w-auto flex items-center gap-3">
           <div>
             <h1 className="text-xl font-bold text-gray-900">Pending Personal Files</h1>
             <p className="text-sm text-gray-600">लंबित व्यक्तिगत फाइलें</p>
           </div>
         </div>
   
         {/* Search */}
         <div className="w-full md:w-auto flex flex-col sm:flex-row items-center justify-end gap-3">
   
           <div className="relative w-full sm:w-64 md:w-80">
             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
             <input
               type="text"
               placeholder="फाइल खोजे"
               className="pl-9 py-2 kruti-input border border-gray-300 rounded-lg w-full
                          text-[14px] placeholder:text-[14px] placeholder:text-gray-400
                          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
               value={searchTerm}
               onChange={(e) => {
                 setSearchTerm(e.target.value);
                 setCurrentPage(1);
               }}
             />
           </div>
   
         </div>
       </div>
   

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
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
                 <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center gap-2">
                         <span>Loading...</span>
                      </div>
                    </td>
                 </tr>
              ) : filteredFiles.length === 0 ? (
                <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No files found.
                    </td>
                </tr>
              ) : (
                paginatedFiles.map((row, index) => {
                  return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(row.file)}
                        <div>
                            <p className="text-sm kruti-input font-medium text-gray-900">{row.title || "Untitled"}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                            {row.type}
                        </span>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-600">{row.created_at}</td>
                    
                    <td className="px-6 py-4 text-right">
                        <button 
                            onClick={() => handleViewFile(row.id)}
                            disabled={loadingDocId === row.id}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded transition shadow-sm border 
                                ${loadingDocId === row.id 
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                    : 'bg-white text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50'
                                }`}
                        >
                          {loadingDocId === row.id ? <FaSpinner className="animate-spin" /> : <FaEye />}
                          View
                        </button>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredFiles.length > 0 && (
        <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredFiles.length}
              itemsPerPage={itemsPerPage}
            />
        </div>
      )}

      {/* --- MODAL --- */}
      {viewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">File Preview</h3>
              <button 
                onClick={() => setViewUrl(null)} 
                className="p-2 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full transition-all shadow-sm"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="flex-1 bg-gray-200 flex justify-center items-center overflow-hidden">
              {viewUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i) ? (
                <img 
                  src={viewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain drop-shadow-lg"
                />
              ) : (
                <iframe
                  src={`${viewUrl}#toolbar=0`} 
                  className="w-full h-full border-0 bg-white"
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

export default ViewPersonalFiles;