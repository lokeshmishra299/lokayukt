import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useMemo, useEffect } from 'react';
import { 
  FaFilePdf, FaFileWord, FaFileImage, 
  FaEye, FaSearch, FaSpinner, FaTimes, FaUser
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Pagination from '../Pagination';
import { FaPaperPlane } from "react-icons/fa";
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


const AllLeaveFiles = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient(); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [openSendPoup, setopenSendPoup] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);   
  const [formErrors, setFormErrors] = useState({});

  const [selectedAuthority, setSelectedAuthority] = useState("committee");
  const itemsPerPage = 10;

  const [viewUrl, setViewUrl] = useState(null); 
  const [loadingDocId, setLoadingDocId] = useState(null); 

  // --- API Fetching (GET) ---
  const getAllFiles = async () => {
    const res = await api.get("/admin/get-leave-personal-details");
    return res.data;
  };

  const { data: allFileData, isLoading } = useQuery({
    queryKey: ["get-leave-personal-details"],
    queryFn: getAllFiles
  });


  const getRoleSubrole = async ()=>{
    const res = await api.get("/admin/get-roles-supervisor");
    console.log("Role Subrole", res.data)
    return res.data.data
  }

  const {data: roleSubrole} = useQuery({
    queryKey: ["get-roles-supervisor"],
    queryFn: getRoleSubrole
  }) 


  const sendFilePermission = async ({ file_id, user_id }) => {
  const res = await api.post("/admin/access-files-permission", {
    file_id,
    user_id,
  });
  return res.data;
};




  const filesList = Array.isArray(allFileData) ? allFileData : allFileData?.data || [];

  const updateLeaveStatus = async ({ id, status }) => {
    const res = await api.post(`/admin/update-leave-status/${id}`, { status });
    return res.data;
  };

  const statusMutation = useMutation({
    mutationFn: updateLeaveStatus,
    onMutate: async (updatedFile) => {
      await queryClient.cancelQueries({ queryKey: ["get-leave-details"] });
      const previousData = queryClient.getQueryData(["get-leave-details"]);

      queryClient.setQueryData(["get-leave-details"], (old) => {
        if (!old) return old;
        const isArray = Array.isArray(old);
        const dataList = isArray ? old : old.data;
        
        const updatedList = dataList.map(file => 
          file.id === updatedFile.id ? { ...file, status: updatedFile.status } : file
        );

        return isArray ? updatedList : { ...old, data: updatedList };
      });

      return { previousData };
    },
    onError: (err, newStatus, context) => {
      queryClient.setQueryData(["get-leave-details"], context.previousData);
      toast.error(err.response?.data?.message || "Failed to update status");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Status updated successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-leave-details"] });
    }
  });

  const sendPermissionMutation = useMutation({
  mutationFn: sendFilePermission,
  onSuccess: (data) => {
    toast.success(data.message || "File sent successfully");
    setopenSendPoup(false);
    setSelectedAuthority("");
    setSelectedFileId(null);
      setFormErrors({});
  },
 onError: (err) => {
  const resErrors = err.response?.data?.errors;

  if (resErrors) {
    setFormErrors(resErrors);   
  } else {
    toast.error(err.response?.data?.message || "Failed to send file");
  }
},

});


  // --- Handlers ---
  const handleToggleStatus = (id, currentStatus) => {
    // अगर पहले से Accepted है तो Rejected कर दो, वरना Accepted कर दो
    const newStatus = (currentStatus === 'Accepted' || currentStatus === '1' || currentStatus === 1) ? 'Rejected' : 'Accepted';
    statusMutation.mutate({ id, status: newStatus });
  };

  const makeFileUrl = (filePath) => {
    if (!filePath) return "";
    const root = BASE_URL.replace(/\/api\/?$/, ""); 
    const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    return `${root}${cleanPath}`;
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFilePdf className="text-gray-500 text-xl" />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return <FaFilePdf className="text-red-500 text-xl" />;
    if (['doc', 'docx'].includes(ext)) return <FaFileWord className="text-blue-500 text-xl" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return <FaFileImage className="text-purple-500 text-xl" />;
    return <FaFilePdf className="text-gray-500 text-xl" />;
  };

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
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">All Personal File</h1>
            <p className="text-sm text-gray-600">समस्त व्यक्तिगत फाइलें</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Qkby [kkstsa"
            className="pl-10 kruti-input pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:border-blue-500"

            // className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-72 focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permission</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                 <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                     Loading... 
                    </td>
                 </tr>
              ) : filteredFiles.length > 0 ? (
                paginatedFiles.map((row, index) => {
                  
                  // Helper boolean for checked state
                  const isAccepted = row.status === 'Accepted' || row.status === '1' || row.status === 1;

                  return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 p-2 rounded-full text-gray-500">
                          <FaUser size={12} />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 capitalize">
                          {row.user?.name || "Unknown"}
                        </span>
                      </div>
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
                    
                    {/* --- EXACT TOGGLE FROM YOUR CODE --- */}
                      <td className="px-6 py-4">
<button
  onClick={() => {
    navigate(`${row.id}`);
  }}
  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Permissions
</button>

</td>



                    
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
              ) : (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No files found.</td></tr>
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


     {openSendPoup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white w-full max-w-md rounded-lg shadow-xl animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Send Personal File
        </h2>
        <button
          onClick={() => setopenSendPoup(false)}
          className="text-gray-500 hover:text-red-600"
        >
          <FaTimes />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select 
          </label>

       <select
  value={selectedAuthority}
  onChange={(e) => setSelectedAuthority(e.target.value)}
  className="w-full px-3 py-2 border rounded-md text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-400"
>
  <option value="">Select Authority</option>

  {roleSubrole?.map((item) => {
    const roleLabel = item?.name;
    const subroleLabel = item.subrole?.label;

    return (
      <option key={item.id} value={item.id}>
        {roleLabel}
        {subroleLabel ? ` (${subroleLabel})` : ""}
      </option>
    );
  })}
</select>

{formErrors?.user_id && (
  <p className="mt-1 text-sm text-red-600">
    {formErrors.user_id[0]}
  </p>
)}

        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50">
        <button
          onClick={() => setopenSendPoup(false)}
          className="px-4 py-2 text-sm rounded-md border border-gray-300
                     hover:bg-gray-100"
        >
          Cancel
        </button>

       <button
  onClick={() => {
    if (!selectedFileId || !selectedAuthority) {
      return;
    }

    sendPermissionMutation.mutate({
      file_id: selectedFileId,
      user_id: selectedAuthority,
    });
  }}
  disabled={sendPermissionMutation.isPending}
  className={`inline-flex items-center gap-2 px-4 py-2
    text-sm font-medium rounded-md shadow transition
    ${
      sendPermissionMutation.isPending
        ? "bg-green-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700 text-white"
    }`}
>
  {sendPermissionMutation.isPending ? (
    <>
      Sending...
    </>
  ) : (
    <>
      <FaPaperPlane />
      Send
    </>
  )}
</button>

      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default AllLeaveFiles;