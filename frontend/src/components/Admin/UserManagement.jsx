// pages/UserManagement.js
import React, { useState, useEffect } from 'react';
import {
  FaUserPlus,
  FaUser as FaUserIcon,
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
  FaSpinner,
  FaExclamationTriangle,
  FaDownload
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../Pagination';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Delete Confirmation Modal Component
const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName, 
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl transform transition-all">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-700">
            Are you sure you want to delete user <span className="font-semibold text-gray-900">"{userName}"</span>? 
            This will permanently remove all their data and access.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#123463] focus:border-[#123463] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center gap-2 ${
              isDeleting 
                ? 'bg-red-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isDeleting ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="w-4 h-4" />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Toggle status loading state
  const [togglingUserId, setTogglingUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        if (response.data.status === true) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  const displayValue = (value) => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return 'NA';
    }
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'NA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'NA';
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      Administrator: 'bg-red-100 text-red-800',
      admin: 'bg-red-100 text-red-800',
      Operator: 'bg-blue-100 text-blue-800',
      Supervisor: 'bg-green-100 text-green-800',
      Secretary: 'bg-gray-100 text-gray-800',
      CIO: 'bg-cyan-100 text-cyan-800',
      RO: 'bg-yellow-100 text-yellow-800',
      ARO: 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  // Fixed: Handle toggle user status with proper error handling
  const toggleUserStatus = async (userId, currentStatus) => {
    setTogglingUserId(userId);
    
    try {
      const response = await api.post(`/admin/change-status/${userId}`);
      
      if (response.data.status === true) {
      
        const newStatus = (currentStatus === '1' || currentStatus === 1) ? '0' : '1';
        
       
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, status: newStatus }
              : user
          )
        );
        
        toast.success(response.data.message || 'Status updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Status toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setTogglingUserId(null);
    }
  };

  // Handle delete button click
  const handleDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    
    setIsDeleting(true);
    
    try {
      const response = await api.post(`/admin/delete-users/${deletingUser.id}`);
      
      if (response.data.status === true) {
        toast.success(response.data.message || 'User deleted successfully');
        
        // Remove user from local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== deletingUser.id));
        
        // Close modal and reset state
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
        
        // If current page is empty after deletion, go to previous page
        const remainingUsers = users.length - 1;
        const maxPage = Math.ceil(remainingUsers / ITEMS_PER_PAGE);
        if (currentPage > maxPage && maxPage > 0) {
          setCurrentPage(maxPage);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Error deleting user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === '' ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const userRole = user.role?.label || user.role?.name || 'Unknown';
    const matchesRole = selectedRole === 'all' || userRole === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const uniqueRoles = [...new Set(users.map(user => user.role?.label || user.role?.name).filter(Boolean))];
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      
      <div className="p-4 space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600">उपयोगकर्ता प्रबंधन</p>
          </div>
          <button
            onClick={() => navigate("add")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#13316C] text-white rounded-md text-sm "
          >
            <FaUserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Compact Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-4">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full m-3">
              <button
                onClick={() => setActiveTab('users')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all flex-1 ${
                  activeTab === 'users' ? "bg-white text-black shadow-sm" : "hover:text-gray-700"
                }`}
              >
                Users 
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all flex-1 ${
                  activeTab === 'roles' ? "bg-white text-black shadow-sm" : "hover:text-gray-700"
                }`}
              >
                Roles & Permissions
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all flex-1 ${
                  activeTab === 'audit' ? "bg-white text-black shadow-sm" : "hover:text-gray-700"
                }`}
              >
                Audit Log
              </button>
            </div>

            {/* Tab Content */}
            <div className="px-4 pb-4">
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {/* Search and Filter with Export Button */}
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        User List 
                        {/* ({filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}) */}
                      </h3>
                      <div className="flex gap-3">
                        <input
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                        />
                        <select
                          className="w-32 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                        >
                          <option value="all">All Roles</option>
                          {uniqueRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>

                        {/* Export Button */}
                        <button
                          onClick={() => {
                            try {
                              if (filteredUsers.length === 0) {
                                return;
                              }

                              const wsData = [
                                ["Sr.No", "Name", "Username", "Email", "Role", "Status", "Last Login"],
                                ...filteredUsers.map((user, idx) => [
                                  idx + 1,
                                  user.name || "NA",
                                  user.user_name || "NA",
                                  user.email || "NA",
                                  user.role?.label || user.role?.name || "NA",
                                  (user.status === '1' || user.status === 1) ? "Active" : "Inactive",
                                  user.updated_at ? new Date(user.updated_at).toLocaleString('en-IN') : "NA"
                                ])
                              ];

                              const wb = XLSX.utils.book_new();
                              const ws = XLSX.utils.aoa_to_sheet(wsData);

                              const headerStyle = {
                                font: { bold: true, color: { rgb: "000000" } },
                                alignment: { horizontal: "center" },
                                fill: { fgColor: { rgb: "D3D3D3" } }
                              };

                              const range = XLSX.utils.decode_range(ws['!ref']);
                              for (let C = range.s.c; C <= range.e.c; ++C) {
                                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
                                if (!ws[cellAddress]) ws[cellAddress] = {};
                                ws[cellAddress].s = headerStyle;
                              }

                              ws['!cols'] = [
                                { wch: 8 },
                                { wch: 20 },
                                { wch: 20 },
                                { wch: 30 },
                                { wch: 20 },
                                { wch: 12 },
                                { wch: 22 },
                              ];

                              XLSX.utils.book_append_sheet(wb, ws, "Users Report");

                              const excelBuffer = XLSX.write(wb, {
                                bookType: 'xlsx',
                                type: 'array',
                                cellStyles: true
                              });

                              const data = new Blob([excelBuffer], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                              });

                              saveAs(data, `users_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
                            } catch (error) {
                              console.error("Export failed:", error);
                            }
                          }}
                          className="flex items-center gap-2 bg-[#13316C] text-white px-4 py-2 rounded-md transition"
                        >
                          <FaDownload className="text-base" />
                          <span className="text-sm">Export</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Compact Table */}
                  <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-4 font-medium text-gray-900">User</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Contact</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Role</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Department</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Status</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Last Login</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {paginatedUsers.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                                No users found
                              </td>
                            </tr>
                          ) : (
                            paginatedUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                {/* User Info */}
                                <td className="py-2 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <FaUserIcon className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">{displayValue(user.name)}</div>
                                      <div className="text-xs text-gray-500">{displayValue(user.role?.name)}</div>
                                    </div>
                                  </div>
                                </td>

                                {/* Contact */}
                                <td className="py-2 px-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs text-gray-700">
                                      <FaEnvelope className="w-3 text-red-500 h-3" />
                                      <span className="truncate max-w-[120px]">{displayValue(user.email)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-700">
                                      <FaPhone className="w-3 text-green-600 h-3" />
                                      {displayValue(user.number)}
                                    </div>
                                  </div>
                                </td>

                                {/* Role */}
                                <td className="py-2 px-4">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role?.label || user.role?.name)}`}>
                                    {displayValue(user.role?.name)}
                                  </span>
                                </td>

                                {/* Department */}
                                <td className="py-2 px-4">
                                  <div className="text-xs text-gray-700">
                                    {displayValue(user.department?.name || user.department)}
                                  </div>
                                </td>

                                {/* Status with Toggle Switch */}
                                <td className="py-2 px-4">
                                  <div className="flex items-center gap-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={user.status === '1' || user.status === 1}
                                        onChange={() => toggleUserStatus(user.id, user.status)}
                                        disabled={togglingUserId === user.id}
                                        className="sr-only peer"
                                      />
                                      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer transition-all ease-in-out duration-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13316C] ${
                                        togglingUserId === user.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
                                      }`}></div>
                                    </label>
                                    {togglingUserId === user.id && (
                                      <FaSpinner className="w-3 h-3 animate-spin text-gray-500" />
                                    )}
                                    <span className={`text-xs ${user.status === '1' || user.status === 1 ? 'text-green-600' : 'text-gray-500'}`}>
                                      {user.status === '1' || user.status === 1 ? 'active' : 'inactive'}
                                    </span>
                                  </div>
                                </td>

                                {/* Last Login */}
                                <td className="py-2 px-4 text-xs text-gray-700">
                                  {formatDate(user.updated_at)}
                                </td>

                                {/* Actions */}
                                <td className="py-2 px-4">
                                  <div className="flex gap-1">
                                    <button 
                                      onClick={() => navigate(`edit/${user.id}`)}
                                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                      title="Edit User"
                                    >
                                      <FaEdit className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(user)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                                      title="Delete User"
                                    >
                                      <FaTrash className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Component */}
                    {totalPages > 1 && (
                      <div className="mt-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          totalItems={filteredUsers.length}
                          itemsPerPage={ITEMS_PER_PAGE}
                          showInfo={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Roles & Permissions Tab */}
              {activeTab === 'roles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uniqueRoles.map((role) => (
                    <div key={role} className="bg-white border border-gray-200 rounded-md p-3">
                      <div className="flex items-center gap-2 text-base font-semibold mb-2">
                        <FaShieldAlt className="w-4 h-4 text-blue-600" />
                        {role}
                      </div>
                      <div className="text-sm">
                        <div><strong>Users:</strong> {users.filter((u) => (u.role?.label || u.role?.name) === role).length}</div>
                        <div className="mt-2"><strong>Permissions:</strong></div>
                        <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
                          <li>Role-based access control</li>
                          <li>System permissions</li>
                          <li>Data management</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Audit Log Tab */}
              {activeTab === 'audit' && (
                <div className="bg-white border border-gray-200 rounded-md">
                  <div className="px-4 py-2 border-b bg-gray-50">
                    <h3 className="text-base font-semibold">User Activity Audit Log</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {users.slice(0, 5).map((user, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">Last updated profile</div>
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(user.updated_at)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        userName={deletingUser?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default UserManagement;
