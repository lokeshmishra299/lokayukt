// pages/MasterData.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaDatabase,
  FaMapMarkerAlt,
  FaBuilding,
  FaUsers,
  FaFileAlt,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast, Toaster } from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Import the separate Pagination component
import Pagination from '../Pagination';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Delete Confirmation Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
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
            Are you sure you want to delete <span className="font-semibold text-gray-900 kruti-input">"{itemName}"</span>? 
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Common logic to parse backend errors
const parseBackendErrors = (error) => {
  const errorObj = {};
  if (error.response && error.response.data) {
    const { data } = error.response;
    const errorsSource = data.errors || (typeof data.message === 'object' ? data.message : null);
    
    if (errorsSource) {
      Object.keys(errorsSource).forEach(key => {
        let frontendKey = key;
        // Map backend keys to single 'name' input
        if (['district_name', 'dist_name_hi', 'name_hindi', 'name_h'].includes(key)) frontendKey = 'name';
        else if (['district_code', 'dept_code'].includes(key)) frontendKey = 'code';
        
        errorObj[frontendKey] = Array.isArray(errorsSource[key]) ? errorsSource[key][0] : errorsSource[key];
      });
    }
  }
  return errorObj;
};

// Edit Modal Component
const EditModal = ({ isOpen, onClose, activeTab, editingItem }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', description: '', code: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen && editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
        code: editingItem.code || ''
      });
      setErrors({});
    }
  }, [isOpen, editingItem]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      let endpoint = '';
      let requestData = {};

      switch (activeTab) {
        case 'districts':
          endpoint = `/admin/edit-district/${editingItem.id}`;
          requestData = { district_name: formData.name, dist_name_hi: formData.name, district_code: formData.code };
          break;
        case 'departments':
          endpoint = `/admin/edit-department/${editingItem.id}`;
          requestData = { name: formData.name, name_hindi: formData.name, dept_code: formData.code };
          break;
        case 'subjects':
          endpoint = `/admin/edit-subject/${editingItem.id}`;
          requestData = { name: formData.name, name_h: formData.name };
          break;
        case 'designations':
          endpoint = `/admin/edit-designation/${editingItem.id}`;
          requestData = { name: formData.name, name_h: formData.name };
          break;
        case 'complaint-types':
          endpoint = `/admin/edit-complainstype/${editingItem.id}`;
          requestData = { name: formData.name, name_h: formData.name, description: formData.description };
          break;
        case 'rejection-reasons':
          endpoint = `/admin/edit-rejection/${editingItem.id}`;
          requestData = { name: formData.name, name_h: formData.name, description: formData.description };
          break;
        default:
          return;
      }

      const response = await api.post(endpoint, requestData);

      if (response.data.status === true || response.data.status === 'success') {
        toast.success(response.data.message || 'Item updated successfully!');
        queryClient.invalidateQueries(['masterData', activeTab]);
        onClose();
      }
    } catch (error) {
      console.error('Edit error:', error);
      const backendErrors = parseBackendErrors(error);
      if (Object.keys(backendErrors).length > 0) setErrors(backendErrors);
      else toast.error('Error updating item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="px-4 py-3 border-b text-lg font-semibold">
          Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (नाम) *
              </label>
              <input 
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] kruti-input text-lg"
                placeholder="uke ntZ djsa" // "नाम दर्ज करें" in Krutidev
                autoComplete="off"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {(activeTab === 'districts' || activeTab === 'departments') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {activeTab === 'districts' ? 'District Code' : 'Department Code'} *
                </label>
                <input 
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                  placeholder={`Enter ${activeTab === 'districts' ? 'district' : 'department'} code`}
                  autoComplete="off"
                />
                {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
              </div>
            )}

            {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] kruti-input text-lg"
                  placeholder="fooj.k ntZ djsa" // "विवरण दर्ज करें" in Krutidev
                  rows="3"
                  autoComplete="off"
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>
            )}
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50" disabled={isSubmitting}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#123463] hover:bg-[#123463] text-white'}`}>
              {isSubmitting ? <><FaSpinner className="w-4 h-4 animate-spin" /> Updating...</> : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Modal Component
const AddModal = ({ isOpen, onClose, activeTab }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', description: '', code: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', description: '', code: '' });
      setErrors({}); 
    }
  }, [isOpen]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); 

    try {
      let endpoint = '';
      let requestData = {};

      switch (activeTab) {
        case 'districts':
          endpoint = `/admin/add-district`;
          requestData = { district_name: formData.name, dist_name_hi: formData.name, district_code: formData.code };
          break;
        case 'departments':
          endpoint = `/admin/add-department`;
          requestData = { name: formData.name, name_hindi: formData.name, dept_code: formData.code };
          break;
        case 'subjects':
          endpoint = `/admin/add-subject`;
          requestData = { name: formData.name, name_h: formData.name };
          break;
        case 'designations':
          endpoint = `/admin/add-designation`;
          requestData = { name: formData.name, name_h: formData.name };
          break;
        case 'complaint-types':
          endpoint = `/admin/add-complainstype`;
          requestData = { name: formData.name, name_h: formData.name, description: formData.description };
          break;
        case 'rejection-reasons':
          endpoint = `/admin/add-rejection`;
          requestData = { name: formData.name, name_h: formData.name, description: formData.description };
          break;
        default: return;
      }

      const response = await api.post(endpoint, requestData);

      if (response.data.status === true || response.data.status === 'success') {
        toast.success(response.data.message || 'Item added successfully!');
        queryClient.invalidateQueries(['masterData', activeTab]);
        onClose();
      }
    } catch (error) {
      console.error('Add error:', error);
      const backendErrors = parseBackendErrors(error);
      if (Object.keys(backendErrors).length > 0) setErrors(backendErrors);
      else toast.error('Error adding item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="px-4 py-3 border-b text-lg font-semibold">
          Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (नाम) *
              </label>
              <input 
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] kruti-input text-lg"
                placeholder="uke ntZ djsa" // "नाम दर्ज करें" in Krutidev
                autoComplete="off"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            
            {(activeTab === 'districts' || activeTab === 'departments') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {activeTab === 'districts' ? 'District Code' : 'Department Code'} *
                </label>
                <input 
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                  placeholder={`Enter ${activeTab === 'districts' ? 'district' : 'department'} code`}
                  autoComplete="off"
                />
                {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
              </div>
            )}

            {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] kruti-input text-lg"
                  placeholder="fooj.k ntZ djsa" // "विवरण दर्ज करें" in Krutidev
                  rows="3"
                  autoComplete="off"
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>
            )}
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50" disabled={isSubmitting}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#123463] hover:bg-[#123463] text-white'}`}>
              {isSubmitting ? <><FaSpinner className="w-4 h-4 animate-spin" /> Adding...</> : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MasterData = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('districts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination states for each tab
  const [paginations, setPaginations] = useState({
    districts: 1, departments: 1, subjects: 1, designations: 1, 'complaint-types': 1, 'rejection-reasons': 1
  });
  const ITEMS_PER_PAGE = 10;
  const [downlode, setDownlode] = useState(false);

  const handleBackupDownload = async () => {
    try {
      setDownlode(true);
      const response = await api.get("/admin/download-backup", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `backup-${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Backup downloaded successfully ✅");
    } catch (error) {
      console.error("Backup download error:", error);
      toast.error("Backup download failed ❌");
    } finally {
      setDownlode(false);
    }
  };

  // React Query Fetch function
  const fetchMasterData = async (tab) => {
    let endpoint = '';
    switch (tab) {
      case 'districts': endpoint = '/admin/all-district'; break;
      case 'departments': endpoint = '/admin/department'; break;
      case 'subjects': endpoint = '/admin/subjects'; break;
      case 'designations': endpoint = '/admin/designation'; break;
      case 'complaint-types': endpoint = '/admin/complainstype'; break;
      case 'rejection-reasons': endpoint = '/admin/rejections'; break;
      default: return [];
    }
    const res = await api.get(endpoint);
    const rawData = res.data.data || [];

    return rawData.map(item => {
      // Map API fields appropriately
      if (tab === 'districts') {
        return {
          id: item.id,
          name: item.district_name || item.dist_name_hi, // krutidev text
          code: item.district_code,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0]
        };
      }
      if (tab === 'departments') {
        return {
          id: item.id,
          name: item.name, // krutidev text
          code: item.dept_code,
          status: item.status === '1' || item.status === 1 ? 'active' : 'inactive',
          createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '-'
        };
      }
      return {
        id: item.id,
        name: item.name || item.name_h || item.name_hindi, // krutidev text
        description: item.description,
        status: item.status === '1' || item.status === 1 ? 'active' : 'inactive',
        createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '-'
      };
    });
  };

  // Use React Query
  const { data: currentTabData = [], isLoading } = useQuery({
    queryKey: ['masterData', activeTab],
    queryFn: () => fetchMasterData(activeTab),
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  const handlePageChange = (page) => {
    setPaginations(prev => ({ ...prev, [activeTab]: page }));
  };

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'districts': endpoint = `/admin/delete-district/${deletingItem.id}`; break;
        case 'departments': endpoint = `/admin/delete-department/${deletingItem.id}`; break;
        case 'subjects': endpoint = `/admin/delete-subject/${deletingItem.id}`; break;
        case 'designations': endpoint = `/admin/delete-designation/${deletingItem.id}`; break;
        case 'complaint-types': endpoint = `/admin/delete-complainstype/${deletingItem.id}`; break;
        case 'rejection-reasons': endpoint = `/admin/delete-rejection/${deletingItem.id}`; break;
        default: return;
      }
      const response = await api.post(endpoint);
      if (response.data.status === true || response.data.success === true) {
        toast.success(response.data.message || 'Item deleted successfully!');
        queryClient.invalidateQueries(['masterData', activeTab]);
        setIsDeleteModalOpen(false);
        setDeletingItem(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const masterDataTabs = [
    { id: 'districts', label: 'Districts', labelHi: 'जिले', icon: FaMapMarkerAlt, iconColor: 'text-red-600' },
    { id: 'departments', label: 'Departments', labelHi: 'विभाग', icon: FaBuilding, iconColor: 'text-blue-600' },
    { id: 'subjects', label: 'Category', labelHi: 'विषय', icon: FaFileAlt, iconColor: 'text-green-600' },
    { id: 'designations', label: 'Designations', labelHi: 'पदनाम', icon: FaUsers, iconColor: 'text-purple-600' },
    // { id: 'complaint-types', label: 'Complaint Types', labelHi: 'शिकायत प्रकार', icon: FaFileAlt, iconColor: 'text-orange-600' },
    // { id: 'rejection-reasons', label: 'Rejection Reasons', labelHi: 'अस्वीकृति कारण', icon: FaFileAlt, iconColor: 'text-pink-600' },
  ];

  const getPaginatedData = (data, currentPage) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const activeTabDetails = masterDataTabs.find(t => t.id === activeTab);
  const currentPage = paginations[activeTab];
  const paginatedData = getPaginatedData(currentTabData, currentPage);
  const totalPages = Math.ceil(currentTabData.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      <Toaster position="top-right" />
      
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Master Data</h1>
            <p className="text-sm text-gray-600">मास्टर डेटा</p>
          </div>
          <button
            onClick={handleBackupDownload}
            className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {downlode ? (
              <><FaSpinner className="w-4 h-4 animate-spin" /><span>Downloading...</span></>
            ) : (
              <><FaDatabase className="w-4 h-4 text-slate-600" /><span className="hidden sm:inline">Backup Data</span></>
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="space-y-6">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {masterDataTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1 ${
                      activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : ""
                    }`}
                  >
                    <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${tab.iconColor}`} />
                    <span className="hidden md:inline text-xs lg:text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 sm:p-4">
              <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-4 sm:px-6 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <FaDatabase className="w-5 h-5 text-indigo-600" />
                      {activeTabDetails?.label} / {activeTabDetails?.labelHi}
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#13316C] text-white rounded-md text-sm"
                    >
                      <FaPlus className="w-4 h-4" /> Add New
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Name (नाम)</th>
                          {(activeTab === 'districts' || activeTab === 'departments') && (
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Code</th>
                          )}
                          {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Description</th>
                          )}
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Status</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Created</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan="7" className="py-8 text-center text-gray-500">
                              <FaSpinner className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                              Loading...
                            </td>
                          </tr>
                        ) : paginatedData.length > 0 ? (
                          paginatedData.map((item) => (
                            <tr key={`${activeTab}-${item.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 sm:py-3 px-2 sm:px-3 text-lg text-gray-900 kruti-input">
                                {item.name}
                              </td>
                              {(activeTab === 'districts' || activeTab === 'departments') && (
                                <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-700">{item.code}</td>
                              )}
                              {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
                                <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-700 kruti-input text-lg">
                                  {item.description && item.description.length > 30 
                                    ? `${item.description.substring(0, 30)}...` 
                                    : item.description
                                  }
                                </td>
                              )}
                              <td className="py-2 sm:py-3 px-2 sm:px-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-600">{item.createdAt}</td>
                              <td className="py-2 sm:py-3 px-2 sm:px-3">
                                <div className="flex gap-1 sm:gap-2">
                                  <button onClick={() => handleEdit(item)} className="px-1.5 sm:px-2 py-1 border rounded text-xs hover:bg-gray-50" title="Edit">
                                    <FaEdit className="w-3 h-3 text-blue-600" />
                                  </button>
                                  <button onClick={() => handleDelete(item)} className="px-1.5 sm:px-2 py-1 border rounded text-xs hover:bg-gray-50 hover:border-red-300" title="Delete">
                                    <FaTrash className="w-3 h-3 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="py-8 text-center text-gray-500">
                              No data available for {activeTabDetails?.label}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={currentTabData.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    showInfo={true}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <AddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} activeTab={activeTab} />
      <EditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} activeTab={activeTab} editingItem={editingItem} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} itemName={deletingItem?.name} isDeleting={isDeleting} />
    </div>
  );
};

export default MasterData;