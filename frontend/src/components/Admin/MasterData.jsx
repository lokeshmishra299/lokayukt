// pages/MasterData.js
import React, { useState, useEffect, useCallback } from 'react';
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName, 
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
            Are you sure you want to delete <span className="font-semibold text-gray-900">"{itemName}"</span>? 
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

// Edit Modal Component
const EditModal = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  editingItem, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nameHi: '',
    description: '',
    code: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

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
          else if (key === 'name_hindi') frontendKey = 'nameHi';
          else if (key === 'name_h') frontendKey = 'nameHi';
          
          errorObj[frontendKey] = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
        });
      }
      
      else if (data.message && typeof data.message === 'object') {
        Object.keys(data.message).forEach(key => {
          let frontendKey = key;
          if (key === 'district_name') frontendKey = 'name';
          else if (key === 'dist_name_hi') frontendKey = 'nameHi';
          else if (key === 'district_code') frontendKey = 'code';
          else if (key === 'name_hindi') frontendKey = 'nameHi';
          else if (key === 'name_h') frontendKey = 'nameHi';
          
          errorObj[frontendKey] = Array.isArray(data.message[key]) ? data.message[key][0] : data.message[key];
        });
      }
    }
    
    return errorObj;
  };

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
          requestData = {
            district_name: formData.name,
            dist_name_hi: formData.nameHi,
            district_code: formData.code
          };
          break;
        case 'departments':
          endpoint = `/admin/edit-department/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_hindi: formData.nameHi
          };
          break;
        case 'subjects':
          endpoint = `/admin/edit-subject/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi
          };
          break;
        case 'designations':
          endpoint = `/admin/edit-designation/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi
          };
          break;
        case 'complaint-types':
          endpoint = `/admin/edit-complainstype/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi,
            description: formData.description
          };
          break;
        case 'rejection-reasons':
          endpoint = `/admin/edit-rejection/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi,
            description: formData.description
          };
          break;
        default:
          toast.error('Invalid tab selected');
          return;
      }

      const response = await api.post(endpoint, requestData);

      if (response.data.status === true) {
        toast.success(response.data.message || 'Item updated successfully!');
        onSave(formData);
        onClose();
      }
    } catch (error) {
      console.error('Edit error:', error);
      
      const backendErrors = parseBackendErrors(error);
      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
      } else {
        toast.error('Error updating item. Please try again.');
      }
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
                Name (English) *
              </label>
              <input 
                key={`edit-name-${activeTab}`}
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                placeholder="Enter name"
                autoComplete="off"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (Hindi) *
              </label>
              <input 
                key={`edit-nameHi-${activeTab}`}
                name="nameHi"
                type="text"
                value={formData.nameHi}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                placeholder="हिंदी में नाम दर्ज करें"
                autoComplete="off"
              />
              {errors.nameHi && (
                <p className="mt-1 text-xs text-red-600">{errors.nameHi}</p>
              )}
            </div>
            {activeTab === 'districts' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District Code *
                </label>
                <input 
                  key={`edit-code-${activeTab}`}
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                  placeholder="Enter district code"
                  autoComplete="off"
                />
                {errors.code && (
                  <p className="mt-1 text-xs text-red-600">{errors.code}</p>
                )}
              </div>
            )}
            {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  key={`edit-description-${activeTab}`}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                  placeholder="Enter description"
                  rows="3"
                  autoComplete="off"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                )}
              </div>
            )}
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#123463] hover:bg-[#123463] text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Modal Component
const AddModal = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nameHi: '',
    description: '',
    code: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        nameHi: '',
        description: '',
        code: ''
      });
      setErrors({}); 
    }
  }, [isOpen]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

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
          else if (key === 'name_hindi') frontendKey = 'nameHi';
          else if (key === 'name_h') frontendKey = 'nameHi';
          
          errorObj[frontendKey] = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
        });
      }
  
      else if (data.message && typeof data.message === 'object') {
        Object.keys(data.message).forEach(key => {
          let frontendKey = key;
          if (key === 'district_name') frontendKey = 'name';
          else if (key === 'dist_name_hi') frontendKey = 'nameHi';
          else if (key === 'district_code') frontendKey = 'code';
          else if (key === 'name_hindi') frontendKey = 'nameHi';
          else if (key === 'name_h') frontendKey = 'nameHi';
          
          errorObj[frontendKey] = Array.isArray(data.message[key]) ? data.message[key][0] : data.message[key];
        });
      }
    }
    
    return errorObj;
  };

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
          requestData = {
            district_name: formData.name,
            dist_name_hi: formData.nameHi,
            district_code: formData.code
          };
          break;
        case 'departments':
          endpoint = `/admin/add-department`;
          requestData = {
            name: formData.name,
            name_hindi: formData.nameHi
          };
          break;
        case 'subjects':
          endpoint = `/admin/add-subject`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi
          };
          break;
        case 'designations':
          endpoint = `/admin/add-designation`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi
          };
          break;
        case 'complaint-types':
          endpoint = `/admin/add-complainstype`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi,
            description: formData.description
          };
          break;
        case 'rejection-reasons':
          endpoint = `/admin/add-rejection`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi,
            description: formData.description
          };
          break;
        default:
          toast.error('Invalid tab selected');
          return;
      }

      const response = await api.post(endpoint, requestData);

      if (response.data.status === true) {
        toast.success(response.data.message || 'Item added successfully!');
        onSave(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Add error:', error);
      
      const backendErrors = parseBackendErrors(error);
      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
      } else {
        toast.error('Error adding item. Please try again.');
      }
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
                Name (English) *
              </label>
              <input 
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                placeholder="Enter name"
                autoComplete="off"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (Hindi) *
              </label>
              <input 
                name="nameHi"
                type="text"
                value={formData.nameHi}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                placeholder="हिंदी में नाम दर्ज करें"
                autoComplete="off"
              />
              {errors.nameHi && (
                <p className="mt-1 text-xs text-red-600">{errors.nameHi}</p>
              )}
            </div>
            {activeTab === 'districts' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District Code *
                </label>
                <input 
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                  placeholder="Enter district code"
                  autoComplete="off"
                />
                {errors.code && (
                  <p className="mt-1 text-xs text-red-600">{errors.code}</p>
                )}
              </div>
            )}
            {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                  placeholder="Enter description"
                  rows="3"
                  autoComplete="off"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                )}
              </div>
            )}
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#123463] hover:bg-[#123463] text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('districts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for all master data
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState([]);

  // Pagination states for each tab
  const [districtsPagination, setDistrictsPagination] = useState({ currentPage: 1 });
  const [departmentsPagination, setDepartmentsPagination] = useState({ currentPage: 1 });
  const [subjectsPagination, setSubjectsPagination] = useState({ currentPage: 1 });
  const [designationsPagination, setDesignationsPagination] = useState({ currentPage: 1 });
  const [complaintTypesPagination, setComplaintTypesPagination] = useState({ currentPage: 1 });
  const [rejectionReasonsPagination, setRejectionReasonsPagination] = useState({ currentPage: 1 });

  const ITEMS_PER_PAGE = 10;

  // Fetch all master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        // Fetch districts
        const districtsResponse = await api.get('/admin/all-district');
        if (districtsResponse.data.status === 'success') {
          const districtsData = districtsResponse.data.data.map(item => ({
            id: item.id,
            name: item.district_name,
            nameHi: item.dist_name_hi,
            code: item.district_code || item.district_name.substring(0, 3).toUpperCase(),
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
          }));
          setDistricts(districtsData);
        }

        // Fetch departments
        const departmentsResponse = await api.get('/admin/department');
        if (departmentsResponse.data.status === 'success') {
          const departmentsData = departmentsResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_hindi,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setDepartments(departmentsData);
        }

        // Fetch subjects
        const subjectsResponse = await api.get('/admin/subjects');
        if (subjectsResponse.data.status === 'success') {
          const subjectsData = subjectsResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_h,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setSubjects(subjectsData);
        }

        // Fetch designations
        const designationsResponse = await api.get('/admin/designation');
        if (designationsResponse.data.status === 'success') {
          const designationsData = designationsResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_h,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setDesignations(designationsData);
        }

        // Fetch complaint types
        const complaintTypesResponse = await api.get('/admin/complainstype');
        if (complaintTypesResponse.data.status === 'success') {
          const complaintTypesData = complaintTypesResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_h,
            description: item.description,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setComplaintTypes(complaintTypesData);
        }

        // Fetch rejection reasons
        const rejectionReasonsResponse = await api.get('/admin/rejections');
        if (rejectionReasonsResponse.data.status === 'success') {
          const rejectionReasonsData = rejectionReasonsResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_h,
            description: item.description,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setRejectionReasons(rejectionReasonsData);
        }

      } catch (error) {
        // console.error('Error fetching master data:', error);
        // toast.error('Error fetching data');
      }
    };

    fetchMasterData();
  }, []);

  // Individual page change handlers
  const handleDistrictsPageChange = useCallback((page) => {
    setDistrictsPagination({ currentPage: page });
  }, []);

  const handleDepartmentsPageChange = useCallback((page) => {
    setDepartmentsPagination({ currentPage: page });
  }, []);

  const handleSubjectsPageChange = useCallback((page) => {
    setSubjectsPagination({ currentPage: page });
  }, []);

  const handleDesignationsPageChange = useCallback((page) => {
    setDesignationsPagination({ currentPage: page });
  }, []);

  const handleComplaintTypesPageChange = useCallback((page) => {
    setComplaintTypesPagination({ currentPage: page });
  }, []);

  const handleRejectionReasonsPageChange = useCallback((page) => {
    setRejectionReasonsPagination({ currentPage: page });
  }, []);

  // Handle edit
  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  }, []);

  // Handle delete
  const handleDelete = useCallback((item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  }, []);

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    
    try {
      let endpoint = '';

      switch (activeTab) {
        case 'districts':
          endpoint = `/admin/delete-district/${deletingItem.id}`;
          break;
        case 'departments':
          endpoint = `/admin/delete-department/${deletingItem.id}`;
          break;
        case 'subjects':
          endpoint = `/admin/delete-subject/${deletingItem.id}`;
          break;
        case 'designations':
          endpoint = `/admin/delete-designation/${deletingItem.id}`;
          break;
        case 'complaint-types':
          endpoint = `/admin/delete-complainstype/${deletingItem.id}`;
          break;
        case 'rejection-reasons':
          endpoint = `/admin/delete-rejection/${deletingItem.id}`;
          break;
        default:
          toast.error('Invalid tab selected');
          return;
      }

      const response = await api.post(endpoint);

      if (response.data.status === true || response.data.success === true) {
        toast.success(response.data.message || 'Item deleted successfully!');
        
        switch (activeTab) {
          case 'districts':
            setDistricts(prev => prev.filter(item => item.id !== deletingItem.id));
            break;
          case 'departments':
            setDepartments(prev => prev.filter(item => item.id !== deletingItem.id));
            break;
          case 'subjects':
            setSubjects(prev => prev.filter(item => item.id !== deletingItem.id));
            break;
          case 'designations':
            setDesignations(prev => prev.filter(item => item.id !== deletingItem.id));
            break;
          case 'complaint-types':
            setComplaintTypes(prev => prev.filter(item => item.id !== deletingItem.id));
            break;
          case 'rejection-reasons':
            setRejectionReasons(prev => prev.filter(item => item.id !== deletingItem.id));
            break;
        }
        
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

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  // Handle edit save
  const handleEditSave = useCallback((formData) => {
    const updatedItem = {
      ...editingItem,
      name: formData.name,
      nameHi: formData.nameHi,
      description: formData.description,
      code: formData.code
    };

    switch (activeTab) {
      case 'districts':
        setDistricts(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
      case 'departments':
        setDepartments(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
      case 'subjects':
        setSubjects(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
      case 'designations':
        setDesignations(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
      case 'complaint-types':
        setComplaintTypes(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
      case 'rejection-reasons':
        setRejectionReasons(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
    }
  }, [activeTab, editingItem]);

  // Handle add save
  const handleAddSave = useCallback((newData) => {
    const newItem = {
      id: newData.id,
      name: activeTab === 'districts' ? newData.district_name : newData.name,
      nameHi: activeTab === 'districts' ? newData.dist_name_hi : newData.name_hindi || newData.name_h,
      code: activeTab === 'districts' ? newData.district_code : undefined,
      description: newData.description,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    switch (activeTab) {
      case 'districts':
        setDistricts(prev => [...prev, newItem]);
        break;
      case 'departments':
        setDepartments(prev => [...prev, newItem]);
        break;
      case 'subjects':
        setSubjects(prev => [...prev, newItem]);
        break;
      case 'designations':
        setDesignations(prev => [...prev, newItem]);
        break;
      case 'complaint-types':
        setComplaintTypes(prev => [...prev, newItem]);
        break;
      case 'rejection-reasons':
        setRejectionReasons(prev => [...prev, newItem]);
        break;
    }
  }, [activeTab]);

  // Close edit modal
  const handleEditClose = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  }, []);

  // Get paginated data
  const getPaginatedData = (data, currentPage) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  // Get current page and handler for each tab
  const getCurrentPageAndHandler = (tabId) => {
    switch (tabId) {
      case 'districts':
        return {
          currentPage: districtsPagination.currentPage,
          onPageChange: handleDistrictsPageChange
        };
      case 'departments':
        return {
          currentPage: departmentsPagination.currentPage,
          onPageChange: handleDepartmentsPageChange
        };
      case 'subjects':
        return {
          currentPage: subjectsPagination.currentPage,
          onPageChange: handleSubjectsPageChange
        };
      case 'designations':
        return {
          currentPage: designationsPagination.currentPage,
          onPageChange: handleDesignationsPageChange
        };
      case 'complaint-types':
        return {
          currentPage: complaintTypesPagination.currentPage,
          onPageChange: handleComplaintTypesPageChange
        };
      case 'rejection-reasons':
        return {
          currentPage: rejectionReasonsPagination.currentPage,
          onPageChange: handleRejectionReasonsPageChange
        };
      default:
        return {
          currentPage: 1,
          onPageChange: () => {}
        };
    }
  };

  const masterDataTabs = [
    { id: 'districts', label: 'Districts', labelHi: 'जिले', icon: FaMapMarkerAlt, data: districts, iconColor: 'text-red-600' },
    { id: 'departments', label: 'Departments', labelHi: 'विभाग', icon: FaBuilding, data: departments, iconColor: 'text-blue-600' },
    { id: 'subjects', label: 'Subjects', labelHi: 'विषय', icon: FaFileAlt, data: subjects, iconColor: 'text-green-600' },
    { id: 'designations', label: 'Designations', labelHi: 'पदनाम', icon: FaUsers, data: designations, iconColor: 'text-purple-600' },
    { id: 'complaint-types', label: 'Complaint Types', labelHi: 'शिकायत प्रकार', icon: FaFileAlt, data: complaintTypes, iconColor: 'text-orange-600' },
    { id: 'rejection-reasons', label: 'Rejection Reasons', labelHi: 'अस्वीकृति कारण', icon: FaFileAlt, data: rejectionReasons, iconColor: 'text-pink-600' },
  ];

  const MasterDataTable = ({ data, title, tabId }) => {
    const { currentPage, onPageChange } = getCurrentPageAndHandler(tabId);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const paginatedData = getPaginatedData(data, currentPage);

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FaDatabase className="w-5 h-5 text-indigo-600" />
            {title}
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#13316C] text-white rounded-md text-sm"
          >
            <FaPlus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Name (English)</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Name (Hindi)</th>
                {tabId === 'districts' && (
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Code</th>
                )}
                {(tabId === 'complaint-types' || tabId === 'rejection-reasons') && (
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Description</th>
                )}
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Status</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Created</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={`${tabId}-${item.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">{item.name}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-700">{item.nameHi}</td>
                    {tabId === 'districts' && (
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-700">{item.code}</td>
                    )}
                    {(tabId === 'complaint-types' || tabId === 'rejection-reasons') && (
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-700">
                        {item.description && item.description.length > 30 
                          ? `${item.description.substring(0, 30)}...` 
                          : item.description
                        }
                      </td>
                    )}
                    <td className="py-2 sm:py-3 px-2 sm:px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-600">{item.createdAt}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-3">
                      <div className="flex gap-1 sm:gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="px-1.5 sm:px-2 py-1 border rounded text-xs hover:bg-gray-50"
                          title="Edit"
                        >
                          <FaEdit className="w-3 h-3 text-blue-600" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item)}
                          className="px-1.5 sm:px-2 py-1 border rounded text-xs hover:bg-gray-50 hover:border-red-300"
                          title="Delete"
                        >
                          <FaTrash className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No data available for {title}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Use Separate Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={data.length}
          itemsPerPage={ITEMS_PER_PAGE}
          showInfo={true}
        />
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
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
      
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Master Data / मास्टर डेटा</h1>
          <button className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            <FaDatabase className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Backup Data</span>
          </button>
        </div>

        {/* Tabs Component */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="space-y-6">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
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

            {/* Tab Content */}
            <div className="p-3 sm:p-4">
              {masterDataTabs.map((tab) =>
                activeTab === tab.id ? (
                  <div key={tab.id} className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <MasterDataTable 
                      data={tab.data} 
                      title={`${tab.label} / ${tab.labelHi}`}
                      tabId={tab.id}
                    />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        activeTab={activeTab}
        onSave={handleAddSave}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        activeTab={activeTab}
        editingItem={editingItem}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deletingItem?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default MasterData;
