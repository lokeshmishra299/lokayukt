// pages/MasterData.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the separate Pagination component
import Pagination from '../Pagination';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// --- HELPER: Parse Backend Errors (Preserved) ---
const parseBackendErrors = (error) => {
  const errorObj = {};
  if (error.response && error.response.data) {
    const { data } = error.response;
    if (data.errors) {
      Object.keys(data.errors).forEach(key => {
        let frontendKey = key;
        if (key === 'district_name') frontendKey = 'name';
        else if (key === 'dist_name_hi') frontendKey = 'nameHi';
        else if (key === 'district_code') frontendKey = 'code';
        else if (key === 'name_hindi' || key === 'name_h') frontendKey = 'nameHi';
        
        errorObj[frontendKey] = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
      });
    } else if (data.message && typeof data.message === 'object') {
      Object.keys(data.message).forEach(key => {
        let frontendKey = key;
        if (key === 'district_name') frontendKey = 'name';
        else if (key === 'dist_name_hi') frontendKey = 'nameHi';
        else if (key === 'district_code') frontendKey = 'code';
        else if (key === 'name_hindi' || key === 'name_h') frontendKey = 'nameHi';
        
        errorObj[frontendKey] = Array.isArray(data.message[key]) ? data.message[key][0] : data.message[key];
      });
    }
  }
  return errorObj;
};

// --- MODAL COMPONENTS ---

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
            Are you sure you want to delete <span className="font-semibold text-gray-900">"{itemName}"</span>? 
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center gap-2 ${
              isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isDeleting ? <><FaSpinner className="w-4 h-4 animate-spin" /> Deleting...</> : <><FaTrash className="w-4 h-4" /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ isOpen, onClose, activeTab, editingItem, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', nameHi: '', description: '', code: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen && editingItem) {
      setFormData({
        name: editingItem.name || '',
        nameHi: editingItem.nameHi || '',
        description: editingItem.description || '',
        code: editingItem.code || ''
      });
      setErrors({});
    }
  }, [isOpen, editingItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      // Call parent onSubmit (mutation)
      await onSubmit(formData);
      onClose();
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
              <input name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-[#123463] focus:border-[#123463]" placeholder="Enter name" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Hindi) *</label>
              <input name="nameHi" type="text" value={formData.nameHi} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-[#123463] focus:border-[#123463]" placeholder="हिंदी में नाम दर्ज करें" />
              {errors.nameHi && <p className="mt-1 text-xs text-red-600">{errors.nameHi}</p>}
            </div>
            {activeTab === 'districts' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District Code *</label>
                <input name="code" type="text" value={formData.code} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-[#123463] focus:border-[#123463]" placeholder="Enter district code" />
                {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
              </div>
            )}
            {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-[#123463] focus:border-[#123463]" placeholder="Enter description" rows="3" />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>
            )}
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50" disabled={isSubmitting}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#123463] text-white'}`}>
              {isSubmitting ? <><FaSpinner className="w-4 h-4 animate-spin" /> Updating...</> : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddModal = ({ isOpen, onClose, activeTab, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', nameHi: '', description: '', code: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', nameHi: '', description: '', code: '' });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      await onSubmit(formData);
      onClose();
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
              <input name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-[#123463] focus:border-[#123463]" placeholder="Enter name" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Hindi) *</label>
              <input name="nameHi" type="text" value={formData.nameHi} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-[#123463] focus:border-[#123463]" placeholder="हिंदी में नाम दर्ज करें" />
              {errors.nameHi && <p className="mt-1 text-xs text-red-600">{errors.nameHi}</p>}
            </div>
            {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-[#123463] focus:border-[#123463]" placeholder="Enter description" rows="3" />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>
            )}
            {/* {activeTab === 'districts' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District Code *</label>
                <input name="code" type="text" value={formData.code} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-[#123463] focus:border-[#123463]" placeholder="Enter code" />
                {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
              </div>
            )} */}
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50" disabled={isSubmitting}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#123463] text-white'}`}>
              {isSubmitting ? <><FaSpinner className="w-4 h-4 animate-spin" /> Adding...</> : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const MasterData = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('districts');
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Pagination State (One per tab)
  const [paginationState, setPaginationState] = useState({
    districts: 1, departments: 1, subjects: 1, designations: 1, 'complaint-types': 1, 'rejection-reasons': 1
  });
  const ITEMS_PER_PAGE = 10;

  const handlePageChange = (page) => {
    setPaginationState(prev => ({ ...prev, [activeTab]: page }));
  };

  // --- REACT QUERY: FETCH HOOKS ---
  const { data: districts = [], isLoading: loadingDistricts } = useQuery({
    queryKey: ['districts'],
    queryFn: () => api.get('/lokayukt/all-district').then(res => res.data.data),
    select: data => data.map(item => ({
      id: item.id,
      name: item.district_name,
      nameHi: item.dist_name_hi,
      code: item.district_code || item.district_name?.substring(0, 3).toUpperCase(),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    }))
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/lokayukt/department').then(res => res.data.data),
    select: data => data.map(item => ({
      id: item.id,
      name: item.name,
      nameHi: item.name_hindi,
      status: item.status === '1' ? 'active' : 'inactive',
      createdAt: new Date(item.created_at).toISOString().split('T')[0]
    }))
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => api.get('/lokayukt/subjects').then(res => res.data.data),
    select: data => data.map(item => ({
      id: item.id,
      name: item.name,
      nameHi: item.name_h,
      status: item.status === '1' ? 'active' : 'inactive',
      createdAt: new Date(item.created_at).toISOString().split('T')[0]
    }))
  });

  const { data: designations = [] } = useQuery({
    queryKey: ['designations'],
    queryFn: () => api.get('/lokayukt/designation').then(res => res.data.data),
    select: data => data.map(item => ({
      id: item.id,
      name: item.name,
      nameHi: item.name_h,
      status: item.status === '1' ? 'active' : 'inactive',
      createdAt: new Date(item.created_at).toISOString().split('T')[0]
    }))
  });

  const { data: complaintTypes = [] } = useQuery({
    queryKey: ['complaint-types'],
    queryFn: () => api.get('/lokayukt/complainstype').then(res => res.data.data),
    select: data => data.map(item => ({
      id: item.id,
      name: item.name,
      nameHi: item.name_h,
      description: item.description,
      status: item.status === '1' ? 'active' : 'inactive',
      createdAt: new Date(item.created_at).toISOString().split('T')[0]
    }))
  });

  const { data: rejectionReasons = [] } = useQuery({
    queryKey: ['rejection-reasons'],
    queryFn: () => api.get('/lokayukt/rejections').then(res => res.data.data),
    select: data => data.map(item => ({
      id: item.id,
      name: item.name,
      nameHi: item.name_h,
      description: item.description,
      status: item.status === '1' ? 'active' : 'inactive',
      createdAt: new Date(item.created_at).toISOString().split('T')[0]
    }))
  });

  // --- REACT QUERY: MUTATIONS ---

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: async (formData) => {
      let endpoint = '';
      let requestData = {};

      switch (activeTab) {
        case 'districts':
          endpoint = `/lokayukt/add-district`;
          requestData = { district_name: formData.name, dist_name_hi: formData.nameHi, district_code: formData.code };
          break;
        case 'departments':
          endpoint = `/lokayukt/add-department`;
          requestData = { name: formData.name, name_hindi: formData.nameHi };
          break;
        case 'subjects':
          endpoint = `/lokayukt/add-subject`;
          requestData = { name: formData.name, name_h: formData.nameHi };
          break;
        case 'designations':
          endpoint = `/lokayukt/add-designation`;
          requestData = { name: formData.name, name_h: formData.nameHi };
          break;
        case 'complaint-types':
          endpoint = `/lokayukt/add-complainstype`;
          requestData = { name: formData.name, name_h: formData.nameHi, description: formData.description };
          break;
        case 'rejection-reasons':
          endpoint = `/lokayukt/add-rejection`;
          requestData = { name: formData.name, name_h: formData.nameHi, description: formData.description };
          break;
      }
      const res = await api.post(endpoint, requestData);
      if(res.data.status !== true && res.data.success !== true) throw new Error(res.data.message);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Item added successfully!');
      queryClient.invalidateQueries([activeTab]); // Refetch active tab data
    }
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      let endpoint = '';
      let requestData = {};
      const id = editingItem.id;

      switch (activeTab) {
        case 'districts':
          endpoint = `/lokayukt/edit-district/${id}`;
          requestData = { district_name: formData.name, dist_name_hi: formData.nameHi, district_code: formData.code };
          break;
        case 'departments':
          endpoint = `/lokayukt/edit-department/${id}`;
          requestData = { name: formData.name, name_hindi: formData.nameHi };
          break;
        case 'subjects':
          endpoint = `/lokayukt/edit-subject/${id}`;
          requestData = { name: formData.name, name_h: formData.nameHi };
          break;
        case 'designations':
          endpoint = `/lokayukt/edit-designation/${id}`;
          requestData = { name: formData.name, name_h: formData.nameHi };
          break;
        case 'complaint-types':
          endpoint = `/lokayukt/edit-complainstype/${id}`;
          requestData = { name: formData.name, name_h: formData.nameHi, description: formData.description };
          break;
        case 'rejection-reasons':
          endpoint = `/lokayukt/edit-rejection/${id}`;
          requestData = { name: formData.name, name_h: formData.nameHi, description: formData.description };
          break;
      }
      const res = await api.post(endpoint, requestData);
      if(res.data.status !== true && res.data.success !== true) throw new Error(res.data.message);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Item updated successfully!');
      queryClient.invalidateQueries([activeTab]);
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      let endpoint = '';
      switch (activeTab) {
        case 'districts': endpoint = `/lokayukt/delete-district/${deletingItem.id}`; break;
        case 'departments': endpoint = `/lokayukt/delete-department/${deletingItem.id}`; break;
        case 'subjects': endpoint = `/lokayukt/delete-subject/${deletingItem.id}`; break;
        case 'designations': endpoint = `/lokayukt/delete-designation/${deletingItem.id}`; break;
        case 'complaint-types': endpoint = `/lokayukt/delete-complainstype/${deletingItem.id}`; break;
        case 'rejection-reasons': endpoint = `/lokayukt/delete-rejection/${deletingItem.id}`; break;
      }
      const res = await api.post(endpoint);
      if(res.data.status !== true && res.data.success !== true) throw new Error(res.data.message);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Item deleted successfully!');
      queryClient.invalidateQueries([activeTab]);
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
    },
    onError: (err) => {
      console.error('Delete error:', err);
      toast.error('Error deleting item.');
    }
  });

  // --- HANDLERS ---

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  }, []);

  const masterDataTabs = [
    { id: 'districts', label: 'Districts', labelHi: 'जिले', icon: FaMapMarkerAlt, data: districts, iconColor: 'text-red-600' },
    { id: 'departments', label: 'Departments', labelHi: 'विभाग', icon: FaBuilding, data: departments, iconColor: 'text-blue-600' },
    { id: 'subjects', label: 'Category', labelHi: 'विषय', icon: FaFileAlt, data: subjects, iconColor: 'text-green-600' },
    { id: 'designations', label: 'Designations', labelHi: 'पदनाम', icon: FaUsers, data: designations, iconColor: 'text-purple-600' },
    { id: 'complaint-types', label: 'Complaint Types', labelHi: 'शिकायत प्रकार', icon: FaFileAlt, data: complaintTypes, iconColor: 'text-orange-600' },
    { id: 'rejection-reasons', label: 'Rejection Reasons', labelHi: 'अस्वीकृति कारण', icon: FaFileAlt, data: rejectionReasons, iconColor: 'text-pink-600' },
  ];

  const MasterDataTable = ({ data, title, tabId }) => {
    const currentPage = paginationState[tabId];
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FaDatabase className="w-5 h-5 text-indigo-600" /> {title}
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 bg-[#13316C] text-white rounded-md text-sm hover:bg-[#0d234d]">
            <FaPlus className="w-4 h-4" /> Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-medium text-gray-900">Name (English)</th>
                <th className="text-left py-3 px-3 font-medium text-gray-900">Name (Hindi)</th>
                {tabId === 'districts' && <th className="text-left py-3 px-3 font-medium text-gray-900">Code</th>}
                {(tabId === 'complaint-types' || tabId === 'rejection-reasons') && <th className="text-left py-3 px-3 font-medium text-gray-900">Description</th>}
                <th className="text-left py-3 px-3 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-3 font-medium text-gray-900">Created</th>
                <th className="text-left py-3 px-3 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={`${tabId}-${item.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 px-3 text-gray-700">{item.nameHi}</td>
                    {tabId === 'districts' && <td className="py-3 px-3 text-gray-700">{item.code}</td>}
                    {(tabId === 'complaint-types' || tabId === 'rejection-reasons') && (
                      <td className="py-3 px-3 text-gray-700">
                        {item.description?.length > 30 ? `${item.description.substring(0, 30)}...` : item.description}
                      </td>
                    )}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{item.createdAt}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="px-2 py-1 border rounded text-xs hover:bg-gray-50 text-blue-600 border-blue-200"><FaEdit className="w-3 h-3" /></button>
                        <button onClick={() => handleDelete(item)} className="px-2 py-1 border rounded text-xs hover:bg-red-50 text-red-600 border-red-200"><FaTrash className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    {loadingDistricts ? <span className="flex items-center justify-center gap-2">Loading...</span> : `No data available for ${title}`}
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
          totalItems={data.length}
          itemsPerPage={ITEMS_PER_PAGE}
          showInfo={true}
        />
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">Master Data</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="space-y-6">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {masterDataTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-medium transition-all gap-1 ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${tab.iconColor}`} />
                    <span className="hidden md:inline text-xs lg:text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 sm:p-4">
              {masterDataTabs.map((tab) =>
                activeTab === tab.id ? (
                  <div key={tab.id} className="mt-2">
                    <MasterDataTable data={tab.data} title={`${tab.label} / ${tab.labelHi}`} tabId={tab.id} />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        activeTab={activeTab}
        onSubmit={addMutation.mutateAsync}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingItem(null); }}
        activeTab={activeTab}
        editingItem={editingItem}
        onSubmit={updateMutation.mutateAsync}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingItem(null); }}
        onConfirm={() => deleteMutation.mutate()}
        itemName={deletingItem?.name}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default MasterData;
