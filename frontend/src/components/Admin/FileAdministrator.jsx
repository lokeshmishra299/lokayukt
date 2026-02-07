import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaTimes,
  FaSave,
  FaLayerGroup,
  FaFileAlt,
  FaSpinner,
  FaChartPie,
  FaDatabase,
  FaExclamationTriangle

} from 'react-icons/fa';

// --- 1. API Configuration ---
const BASE_URL = "http://localhost:8000/api"; 
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Helper for date formatting
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const FileAdministrator = () => {
  const queryClient = useQueryClient();
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState('filetypes');
  const [modalType, setModalType] = useState('form');
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editId, setEditId] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [budgetForm, setBudgetForm] = useState({
    expense_type: "",
    expense_money: "",
    remark: ""
  });

  const { data: topics = [], isLoading: loadingTopics } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const res = await api.get('/admin/topics');
      return res.data.data || res.data; 
    }
  });

  // --- FILE TYPES ---
  const { data: fileTypes = [], isLoading: loadingFileTypes } = useQuery({
    queryKey: ['filetypes'],
    queryFn: async () => {
      const res = await api.get('/admin/filetypes');
      return res.data.data || res.data;
    }
  });

  // --- BUDGETS ---
  const { data: budgets = [], isLoading: loadingBudgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const res = await api.get('/admin/budgets');
      return res.data.data || res.data;
    }
  });


  // --- TOPICS MUTATIONS ---
  const addTopicMutation = useMutation({
    mutationFn: (data) => api.post('/admin/add-topic', data),
    onSuccess: () => { queryClient.invalidateQueries(['topics']); toast.success('Topic added');
        setFormErrors({});
      closeModal(); },
    // onError: (err) => toast.error(err.response?.data?.message || 'Error adding topic')
    onError: (err) => {
  if (err.response?.data?.errors) {
    setFormErrors(err.response.data.errors);
  }
  // toast.error("Validation error");
}

  });

  const editTopicMutation = useMutation({
    mutationFn: ({ id, data }) => api.post(`/admin/edit-topic/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['topics']); toast.success('Topic updated'); 
        setFormErrors({});
      closeModal(); },
    // onError: (err) => toast.error(err.response?.data?.message || 'Error updating topic')
    onError: (err) => {
  if (err.response?.data?.errors) {
    setFormErrors(err.response.data.errors);
  }
  // toast.error("Validation error");
}

  });

  const deleteTopicMutation = useMutation({
    mutationFn: (id) => api.post(`/admin/delete-topic/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['topics']); 
        setFormErrors({});
      toast.success('Topic deleted'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Error deleting topic')
  });

  // --- FILE TYPES MUTATIONS ---
  const addFileTypeMutation = useMutation({
    mutationFn: (data) => api.post('/admin/add-filetype', data),
    onSuccess: () => { queryClient.invalidateQueries(['filetypes']); toast.success('File Type added'); closeModal(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Error adding file type')
  });

  const editFileTypeMutation = useMutation({
    mutationFn: ({ id, data }) => api.post(`/admin/edit-filetype/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['filetypes']); toast.success('File Type updated'); closeModal(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Error updating file type')
  });

  const deleteFileTypeMutation = useMutation({
    mutationFn: (id) => api.post(`/admin/delete-filetype/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['filetypes']); toast.success('File Type deleted'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Error deleting file type')
  });

  // --- BUDGET MUTATIONS ---
  const addBudgetMutation = useMutation({
    mutationFn: (data) => api.post('/admin/add-budget', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      toast.success("Budget added");
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error adding budget")
  });

  const editBudgetMutation = useMutation({
    mutationFn: ({ id, data }) => api.post(`/admin/edit-budget/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      toast.success("Budget updated");
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error updating budget")
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: (id) => api.post(`/admin/delete-budget/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      toast.success("Budget deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error deleting budget")
  });


  const openAddModal = () => {
  setFormErrors({});
  setModalType('form');   // ⭐ ADD THIS
  setModalMode('add');
  setEditId(null);
  setNameInput("");
  setBudgetForm({ expense_type: "", expense_money: "", remark: "" });
  setIsModalOpen(true);
};

  const openEditModal = (item) => {
  setModalType('form');   // ⭐ ADD THIS
  setModalMode('edit');
  setEditId(item.id);

  if (activeTab === 'budget') {
    setBudgetForm({
      expense_type: item.expense_type,
      expense_money: item.expense_money,
      remark: item.remark
    });
  } else {
    setNameInput(item.name);
  }

  setIsModalOpen(true);
};


  const closeModal = () => {
     setFormErrors({});
    setIsModalOpen(false);
    setNameInput("");
    setBudgetForm({ expense_type: "", expense_money: "", remark: "" });
    setEditId(null);
  };

const handleDeleteClick = (id) => {
  setEditId(id);
  setModalType('delete');
  setIsModalOpen(true);
};

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'topics') {
      modalMode === 'add'
        ? addTopicMutation.mutate({ name: nameInput })
        : editTopicMutation.mutate({ id: editId, data: { name: nameInput } });
    }
    else if (activeTab === 'filetypes') {
      modalMode === 'add'
        ? addFileTypeMutation.mutate({ name: nameInput })
        : editFileTypeMutation.mutate({ id: editId, data: { name: nameInput } });
    }
    else if (activeTab === 'budget') {
      modalMode === 'add'
        ? addBudgetMutation.mutate(budgetForm)
        : editBudgetMutation.mutate({ id: editId, data: budgetForm });
    }
  };

  const isSubmitting = addTopicMutation.isPending || editTopicMutation.isPending || 
                       addFileTypeMutation.isPending || editFileTypeMutation.isPending ||
                       addBudgetMutation.isPending || editBudgetMutation.isPending;

  // const StatusBadge = ({ status }) => {
    
  //   return (
  //     <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
  //       isActive 
  //       ? 'bg-green-50 text-green-700 border-green-200' 
  //       : 'bg-red-50 text-red-700 border-red-200'
  //     }`}>
  //       {isActive ? 'Active' : 'Inactive'}
  //     </span>
  //   );
  // };


 const confirmDelete = async () => {
  try {
    setIsDeleting(true);

    if (activeTab === 'topics') await deleteTopicMutation.mutateAsync(editId);
    else if (activeTab === 'filetypes') await deleteFileTypeMutation.mutateAsync(editId);
    else if (activeTab === 'budget') await deleteBudgetMutation.mutateAsync(editId);

    closeModal();
  } catch (err) {
    console.log(err);
  } finally {
    setIsDeleting(false);
  }
};


  const getPlaceholder = () => {
  if (activeTab === 'topics') return "Enter Topic Name";
  // if (activeTab === 'filetypes') return "Enter File Type Name";
    if (activeTab === 'filetypes') return "फ़ाइल टाइप का नाम दर्ज करें";
  return "";
};


       if (loadingTopics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          {/* <FaSpinner className="w-12 h-12 animate-spin text-[#13316C] mx-auto mb-4" /> */}
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">File Administrator</h1>
          <p className="text-sm text-gray-600">Manage Topics, File Types & Budget</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#123463] text-white px-4 py-2 rounded-lg hover:bg-[#0e2a4e] transition-colors text-sm font-medium shadow-sm"
        >
          <FaPlus size={12} />
          Add {activeTab === 'topics' ? 'Topic' : activeTab === 'filetypes' ? 'File Type' : 'Budget'}
        </button>
      </div>

      <div className="mt-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          
          {/* Tabs */}
          {/* <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg mb-6 w-full">
            {[
                { id: 'topics', label: 'Topics', icon: FaLayerGroup },
                { id: 'filetypes', label: 'File Types', icon: FaFileAlt },
                { id: 'budget', label: 'Budget', icon: FaChartPie },
            ].map(tab => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab.id 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                >
                <tab.icon className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} /> 
                <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
          </div> */}

          {/* --- TOPICS TABLE --- */}
          {activeTab === 'topics' && (
            <div className="animate-in fade-in duration-300">
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                    <tr>
                      <th className="p-4 border-b w-16">S.No</th>
                      <th className="p-4 border-b">Name</th>
                      <th className="p-4 border-b">Status</th>
                      <th className="p-4 border-b">Created At</th>
                      <th className="p-4 border-b text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                    {loadingTopics ? (
                      <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                    ) : topics.length === 0 ? (
                                           <tr><td colSpan="5" className="p-8 text-center">No Data Found.</td></tr>

                    ) : (
                      topics.map((item, index) => (
                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 text-gray-500">{index + 1}</td>
                          <td className="p-4 font-medium">{item.name}</td>
                          <td className="p-4 font-medium">
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      item.status == 1
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }`}
  >
    {item.status == 1 ? "Active" : "Inactive"}
  </span>
</td>

                          {/* <td className="p-4 font-medium">{item.status == 1 ? "Active" : "InActive"}</td> */}

                          {/* <td className="p-4 font-medium">{item.status == 1 ? "Active" : "InActive"}</td> */}
                          {/* <td className="p-4"><StatusBadge status={item.status || '1'} /></td> */}
                          <td className="p-4 text-gray-500">{formatDate(item.created_at)}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-3">
                              <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                              {/* <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button> */}
                              <button onClick={(e) => {
  e.stopPropagation();
  handleDeleteClick(item.id);
}} className="text-red-500 hover:text-red-700">
  <FaTrash />
</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- FILE TYPES TABLE --- */}
          {activeTab === 'filetypes' && (
            <div className="animate-in fade-in duration-300">
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                    <tr>
                      <th className="p-4 border-b w-16">S.No</th>
                      <th className="p-4 border-b">Type Name</th>
                      <th className="p-4 border-b">Status</th>
                      <th className="p-4 border-b">Created At</th>
                      <th className="p-4 border-b text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                    {loadingFileTypes ? (
                      <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                    ) : fileTypes.length === 0 ? (
                                                                 <tr><td colSpan="5" className="p-8 text-center">No Data Found.</td></tr>

                    ) : (
                      fileTypes.map((item, index) => (
                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 text-gray-500">{index + 1}</td>
                         <td className="p-4 kruti-input font-medium">
  <span className="bg-gray-100 px-2 py-1 text-[20px] rounded border uppercase">
    {item.name}
  </span>
</td>
                          <td className="p-4 font-medium">
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      item.status == 1
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }`}
  >
    {item.status == 1 ? "Active" : "Inactive"}
  </span>
</td>

                          {/* <td className="p-4"><StatusBadge status={item.status || '1'} /></td> */}
                          <td className="p-4 text-gray-500">{formatDate(item.created_at)}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-3">
                              <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                              {/* <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button> */}
                              <button onClick={(e) => {
  e.stopPropagation();
  handleDeleteClick(item.id);
}} className="text-red-500 hover:text-red-700">
  <FaTrash />
</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- BUDGET TABLE --- */}
          {activeTab === 'budget' && (
            <div className="animate-in fade-in duration-300">
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                    <tr>
                      <th className="p-4 border-b w-16">S.No</th>
                      <th className="p-4 border-b">Expense Type</th>
                      <th className="p-4 border-b">Expense Amount</th>
                      <th className="p-4 border-b">Remark</th>
                      <th className="p-4 border-b">Status</th>
                      <th className="p-4 border-b text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                    {loadingBudgets ? (
                      <tr><td colSpan="6" className="p-8 text-center"> Loading...</td></tr>
                    ) : budgets.length === 0 ? (
                                                                 <tr><td colSpan="5" className="p-8 text-center">No Data Found.</td></tr>

                    ) : (
                      budgets.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 text-gray-500">B-{item.id}</td>
                          <td className="p-4 font-medium">{item.expense_type}</td>
                          <td className="p-4 font-semibold text-gray-800">₹{item.expense_money}</td>
                          <td className="p-4 text-gray-500">{item.remark || '-'}</td>
                          <td className="p-4 font-medium">
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      item.status == 1
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }`}
  >
    {item.status == 1 ? "Active" : "Inactive"}
  </span>
</td>

                          {/* <td className="p-4"><StatusBadge status={item.status || 'Active'} /></td> */}
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-3">
                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                                {/* <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button> */}
                                <button onClick={(e) => {
  e.stopPropagation();
  handleDeleteClick(item.id);
}} className="text-red-500 hover:text-red-700">
  <FaTrash />
</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* --- REUSABLE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            
            {/* Modal Header */}
            {/* <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50"> */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">

             <h3 className="font-bold text-gray-800">
  {modalType === 'delete'
    ? `Delete ${activeTab === 'topics' ? 'Topic' : activeTab === 'filetypes' ? 'File Type' : 'Budget'}`
    : `${modalMode === 'add' ? 'Add' : 'Edit'} ${
        activeTab === 'topics' ? 'Topic' : activeTab === 'filetypes' ? 'File Type' : 'Budget'
      }`
  }
</h3>

              <button onClick={closeModal}><FaTimes className="text-gray-400 hover:text-red-500" /></button>
            </div>

            {/* Modal Form */}
        {modalType === 'form' ? (

  <form onSubmit={handleSubmit} className="p-6 space-y-4">

    {activeTab === 'budget' ? (
      <>
        <div>
          <label className="block text-sm font-medium mb-1">Expense Type *</label>
          <input
            value={budgetForm.expense_type}
            placeholder='Enter Expense Type'
            onChange={(e) => setBudgetForm({...budgetForm, expense_type: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {formErrors.expense_type && <p className="text-red-500 text-xs mt-1">{formErrors.expense_type[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expense Amount *</label>
          <input
            type="number"
            placeholder='Expense Amount Type'
            value={budgetForm.expense_money}
            onChange={(e) => setBudgetForm({...budgetForm, expense_money: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {formErrors.expense_money && <p className="text-red-500 text-xs mt-1">{formErrors.expense_money[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Remark</label>
          <textarea
            value={budgetForm.remark}
               placeholder='Enter Remark'
            onChange={(e) => setBudgetForm({...budgetForm, remark: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </>
    ) : (
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          value={nameInput}
          placeholder={getPlaceholder()}
          onChange={(e) => setNameInput(e.target.value)}
          
           className="
    w-full kruti-input px-3 py-2 border rounded-lg
    placeholder:text-sm placeholder:text-gray-400
  "
        />
        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>}
      </div>
    )}

    <div className="flex justify-end gap-3 pt-4 border-t">
      <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg">Cancel</button>
      <button type="submit" className="px-4 py-2 text-white bg-[#123463] rounded-lg flex items-center gap-2">
        {isSubmitting ? <FaSpinner className="animate-spin"/> : <FaSave />} Save
      </button>
    </div>
  </form>

) : (





<div className="p-6">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
      <FaExclamationTriangle className="w-5 h-5 text-red-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
      <p className="text-sm text-gray-500">This action cannot be undone</p>
    </div>
  </div>

  <p className="text-gray-700 mb-6">
    Are you sure you want to delete this item?
  </p>

  <div className="flex justify-end gap-3">
    <button
      onClick={closeModal}
      disabled={isDeleting}
      className="px-4 py-2 text-sm border rounded-md"
    >
      Cancel
    </button>

    <button
      onClick={confirmDelete}
      disabled={isDeleting}
      className="px-4 py-2 text-sm text-white bg-red-600 rounded-md flex items-center gap-2"
    >
      {isDeleting ? <FaSpinner className="animate-spin w-4 h-4" /> : <FaTrash className="w-4 h-4" />}
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  </div>
</div>


  


  

)}

          </div>
        </div>
      )}

    </div>
  );
}

export default FileAdministrator;