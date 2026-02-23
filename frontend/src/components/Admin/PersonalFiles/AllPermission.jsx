import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import Pagination from "../../Pagination"; // Make sure path is correct

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AllPermission = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [permissions, setPermissions] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ API 1: Get All Users with their Name and Subrole
  const getSubroleRole = async () => {
    const res = await api.get("/admin/get-roles-supervisor");
    return res.data.data; 
  };

  const { data: users, isLoading: usersLoading, isError: usersError } = useQuery({
    queryKey: ["roles-supervisor"], 
    queryFn: getSubroleRole
  });

  // ✅ API 2: Get Saved Permissions for Checkboxes (1 or 0)
  const getSavedPermissions = async () => {
    const res = await api.get(`/admin/private-file-permission/${id}`);
    return res.data.data; // array with can_view, can_edit
  };

  const { data: savedPerms, isLoading: permsLoading } = useQuery({
    queryKey: ["private-file-permission", id], 
    queryFn: getSavedPermissions,
    enabled: !!id
  });

  // ✅ Combine Both APIs: Set Checkboxes dynamically
  useEffect(() => {
    if (users && Array.isArray(users)) {
      const initialPerms = {};
      
      users.forEach(user => {
        // Find if this user has any saved permissions in the 2nd API
        const savedUserPerm = savedPerms?.find(p => p.id === user.id);
        
        // Agar 1 hai to true, nahi to false
        const hasView = savedUserPerm ? savedUserPerm.can_view === 1 : false;
        const hasEdit = savedUserPerm ? savedUserPerm.can_edit === 1 : false;
        const hasAll = hasView && hasEdit;
        
        initialPerms[user.id] = { 
          view: hasView, 
          edit: hasEdit, 
          all: hasAll 
        };
      });
      
      setPermissions(initialPerms);
    }
  }, [users, savedPerms]);

  // Checkbox logic
  const handleCheckboxChange = (userId, type, checked) => {
    setPermissions(prev => {
      const current = { ...prev[userId] };

      if (type === 'all') {
        current.all = checked;
        current.view = checked;
        current.edit = checked;
      } else if (type === 'edit') {
        current.edit = checked;
        if (checked) {
          current.view = true;
          current.all = true;
        } else {
          current.all = false;
        }
      } else if (type === 'view') {
        current.view = checked;
        if (!checked) {
          current.edit = false;
          current.all = false;
        }
      }

      if (current.view && current.edit) {
        current.all = true;
      }

      return { ...prev, [userId]: current };
    });
  };

  // Save Permissions
  const handleSave = async () => {
    const payloadPermissions = Object.entries(permissions)
      .filter(([userId, perms]) => perms.view || perms.edit)
      .map(([userId, perms]) => ({
        user_id: parseInt(userId),
        view: perms.view,
        edit: perms.edit
      }));

    if (payloadPermissions.length === 0) {
      toast.error("Please assign permissions to at least one user.");
      return;
    }

    const payload = {
      file_id: parseInt(id),
      permissions: payloadPermissions
    };

    try {
      setIsSaving(true);
      const response = await api.post("/admin/file/give-permission", payload);
      toast.success("Permissions saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  // Pagination Logic
  const safeUsers = users || [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = safeUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(safeUsers.length / itemsPerPage);

  if (usersLoading || permsLoading) return <div className="p-6 text-gray-600 text-center">Loading...</div>;
  if (usersError) return <div className="p-6 text-red-500">Error loading users data.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section with BACK Button on Right */}
        <div className="flex justify-between items-start mb-4 mt-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Give Permissions</h2>
            <p className="text-sm text-gray-500 mt-1">Assign view and edit access to users.</p>
          </div>
          <div>
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
            >
              <IoMdArrowBack className="w-4 h-4" /> Back
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded-t-xl shadow-sm border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-1/2">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">View</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Edit</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">All</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Loop through Paginated Users */}
              {currentUsers.map(user => {
                const userName = user.name || "Unknown";
                const subroleName = user.subrole?.label || user.subrole?.name || "No subrole";
                const initial = userName.charAt(0).toUpperCase();

                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                          {initial}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500">{subroleName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        checked={permissions[user.id]?.view || false}
                        onChange={(e) => handleCheckboxChange(user.id, 'view', e.target.checked)}
                      />
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        checked={permissions[user.id]?.edit || false}
                        onChange={(e) => handleCheckboxChange(user.id, 'edit', e.target.checked)}
                      />
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        checked={permissions[user.id]?.all || false}
                        onChange={(e) => handleCheckboxChange(user.id, 'all', e.target.checked)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Footer Section with Save & Cancel Buttons on Right */}
        <div className="flex justify-end items-center gap-3 px-6 py-4 bg-gray-50 border-x border-b border-gray-200 rounded-b-xl shadow-sm">
          <button 
            onClick={() => navigate(-1)} 
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition shadow-sm"
          >
            {isSaving ? 'Allowing...' : 'Allow Permissions'}
          </button>
        </div>

        {/* Pagination Component */}
        {safeUsers.length > 0 && (
          <div className="mt-4 mb-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={safeUsers.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default AllPermission;