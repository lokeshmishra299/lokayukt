import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useMemo } from 'react';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileExcel, FaEye, FaSearch, FaSpinner, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Pagination from '../../../../Pagination';
import { useNavigate } from 'react-router-dom';


const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewFiles = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");
  const [viewUrl, setViewUrl] = useState(null); // Modal URL
  const [loadingDocId, setLoadingDocId] = useState(null); // Spinner
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;


  // 1. All Files List
  const AllFiles = async () => {
    const res = await api.get("/supervisor/all-files");
    return res.data;
  };

  const { data: allFilesData, isLoading } = useQuery({
    queryKey: ["all-files"],
    queryFn: AllFiles
  });

  const filesList = allFilesData?.data || [];

  // 2. URL Generator (Fix for /storage path)
  const makeFileUrl = (filePath) => {
    if (!filePath) return "";
    
    // BASE_URL se '/api' hata kar root domain nikalo
    // Example: "http://localhost:8000/api" -> "http://localhost:8000"
    const root = BASE_URL.replace(/\/api\/?$/, ""); 
    
    // Agar path me starting slash nahi hai to laga do
    const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    
    // Combine: http://localhost:8000/storage/doc_123.pdf
    return `${root}${cleanPath}`;
  };

  // 3. Handle View Click (Updated for your Response)
  const handleViewFile = async (id) => {
    try {
      setLoadingDocId(id); // Spinner Start
      
      const res = await api.get(`/supervisor/get-file-preview/${id}`);
      console.log("View API Response:", res.data); // Debugging ke liye

      // CHECK: Status true hona chahiye (Boolean true ya string "success")
      if (res.data.status === true || res.data.status === "success") {
        
        const filePath = res.data.data; // "/storage/doc_6986e4a19b524.pdf"
        
        if (filePath) {
            const fullUrl = makeFileUrl(filePath);
            console.log("Opening Full URL:", fullUrl);
            setViewUrl(fullUrl); // Popup Open karega
        } else {
            toast.error("File path empty hai.");
        }

      } else {
        toast.error(res.data.message || "File fetch failed.");
      }

    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Server error while opening file.");
    } finally {
      setLoadingDocId(null); // Spinner Stop
    }
  };

  // Helper: File Icon
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFilePdf className="text-gray-500 text-xl" />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return <FaFilePdf className="text-red-500 text-xl" />;
    if (['doc', 'docx'].includes(ext)) return <FaFileWord className="text-blue-500 text-xl" />;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <FaFileExcel className="text-green-600 text-xl" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <FaFileImage className="text-purple-500 text-xl" />;
    return <FaFilePdf className="text-gray-500 text-xl" />;
  };

  // Filter Logic
  const filteredFiles = useMemo(() => {
    return filesList.filter((file) =>
      (file.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       file.file?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [filesList, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

const currentFiles = filteredFiles.slice(
  indexOfFirstItem,
  indexOfLastItem
);

const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);


  return (
    <div className="bg-gray-50 min-h-screen ">
      {/* Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      
      {/* Title */}
      <div className="w-full md:w-auto flex flex-col text-left">
        <h1 className="text-xl font-bold text-gray-900">Leave Files</h1>
        <p className="text-sm text-gray-600">अवकाश फाइलें</p>
      </div>
    
      {/* Search + Button */}
      <div className="w-full md:w-auto flex flex-col sm:flex-row items-center justify-end gap-3">
    
        {/* Search */}
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
    
        {/* Button */}
        <button
          onClick={() => navigate("/employee/add-files")}
          className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white font-medium
                     rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Add Leave Files
        </button>
    
      </div>
    </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                 <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredFiles.length > 0 ? (
                currentFiles.map((file, index) => (
                  <tr key={file.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.file)}
                        <div>
                            <p className="text-sm kruti-input font-medium text-gray-900">{file.title || "Untitled"}</p>
                            {/* <p className="text-xs text-gray-500">{file.file}</p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 kruti-input py-4 text-sm text-gray-600">{file.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{file.created_at}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{file.status == 2 ? "Accepted" :
                    file.status == 3 ? "Rejected"
                    :
                    "N/A"
                    }</td>
                    <td className="px-6 py-4 text-right">
                        <button 
         onClick={() => {
    navigate(`${file.id}`)
  }}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition"
                        >
                          {loadingDocId === file.id ? <FaSpinner className="animate-spin" /> : <FaEye />}
                          View
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


            <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  // totalItems={filteredComplaints.length}
  totalItems={filteredFiles.length}
  itemsPerPage={itemsPerPage}
/>

      {/* --- POPUP / MODAL --- */}
      {viewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Document Preview</h3>
              <div className="flex gap-3">
                {/* Download Button (Optional) */}
                {/* <a 
                  href={viewUrl} 
                  download 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  Open Original
                </a> */}
                <button 
                  onClick={() => setViewUrl(null)} 
                  className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                >
                  <FaTimes size={22} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 bg-gray-200 p-1 flex justify-center items-center overflow-hidden">
              {/* Image Handler */}
              {viewUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i) ? (
                <div className="w-full h-full overflow-auto flex justify-center">
                    <img 
                    src={viewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain shadow-lg"
                    />
                </div>
              ) : (
                /* PDF Handler */
                <iframe
                  src={`${viewUrl}#toolbar=0&navpanes=0`} 
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

export default ViewFiles;