import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
  import { IoMdArrowBack } from "react-icons/io";

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
  // ✅ यहाँ 'Id' की जगह 'id' कर दिया है क्योंकि आपके Route में ':id' है
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const currentFileId = id; 

  const [permissions, setPermissions] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const getSubroleRole = async () => {
    const res = await api.get("/admin/get-roles-supervisor");
    return res.data.data; 
  };

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["roles-supervisor"], 
    queryFn: getSubroleRole
  });

  useEffect(() => {
    if (users && Array.isArray(users)) {
      const initialPerms = {};
      users.forEach(user => {
        initialPerms[user.id] = { view: false, edit: false, all: false };
      });
      setPermissions(initialPerms);
    }
  }, [users]);

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
      file_id: parseInt(id), // ✅ यहाँ भी 'id' इस्तेमाल किया है
      permissions: payloadPermissions
    };

    try {
      setIsSaving(true);
      const response = await api.post("/admin/file/give-permission", payload);
      console.log("Response:", response.data);
      toast.success("Permissions saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-6 text-gray-600">Loading users...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading users data.</div>;

  return (
    <div className="bg-gray-50 min-h-screen ">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto ">
        
        {/* Header Section with BACK Button on Right */}
        <div className="flex justify-between items-start ">
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
        <div className="overflow-x-auto">
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
              {users?.map(user => {
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
        <div className="flex justify-end items-center gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
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

      </div>
    </div>
  );
}

export default AllPermission;