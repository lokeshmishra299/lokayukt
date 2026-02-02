import React, { useState } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaSearch,
  FaDownload,
  FaFilter,
  FaTimes,
  FaSave
} from 'react-icons/fa';

const FileAdministrator = () => {
  const [activeTab, setActiveTab] = useState('projects');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // --- 1. Projects State ---
  const [projects, setProjects] = useState([
    { id: 1, name: "Smart City Road Development", department: "PWD", status: "Ongoing", budget: "₹50 Cr" },
    { id: 2, name: "City Park Renovation", department: "Horticulture", status: "Pending", budget: "₹2 Cr" },
    { id: 3, name: "Street Light Installation Phase-2", department: "Electricity", status: "Completed", budget: "₹5 Cr" },
    { id: 4, name: "Drainage Cleaning Project", department: "Sanitation", status: "Ongoing", budget: "₹15 Cr" },
  ]);

  // --- 2. Files State ---
  const [files, setFiles] = useState([
    { fileNo: "F-2026/001", subject: "Tender Document for Road", type: "PDF", date: "25-01-2026", size: "2.4 MB" },
    { fileNo: "F-2026/002", subject: "NOC for Land Acquisition", type: "Image", date: "28-01-2026", size: "1.1 MB" },
    { fileNo: "F-2026/003", subject: "Annual Audit Report", type: "Excel", date: "29-01-2026", size: "500 KB" },
    { fileNo: "F-2026/004", subject: "Meeting Minutes - Jan", type: "Docx", date: "30-01-2026", size: "1.2 MB" },
  ]);

  // --- 3. Budget State ---
  const [budgets, setBudgets] = useState([
    { id: "B-001", head: "Infrastructure", allocated: "₹10,00,00,000", spent: "₹4,50,00,000", remaining: "₹5,50,00,000" },
    { id: "B-002", head: "Sanitation", allocated: "₹2,00,00,000", spent: "₹1,80,00,000", remaining: "₹20,00,000" },
    { id: "B-003", head: "Events & Cultural", allocated: "₹50,00,000", spent: "₹10,00,000", remaining: "₹40,00,000" },
    { id: "B-004", head: "IT & Software", allocated: "₹1,00,00,000", spent: "₹20,00,000", remaining: "₹80,00,000" },
  ]);

  // Handle Opening Modal
  const handleAddClick = () => {
    setFormData({}); // Clear form
    setIsModalOpen(true);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit (Dummy Logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'projects') {
      const newProject = {
        id: Math.floor(Math.random() * 1000) + 100, // Random ID
        name: formData.name || "New Project",
        department: formData.department || "General",
        status: formData.status || "Pending",
        budget: formData.budget || "₹0 Cr"
      };
      setProjects([...projects, newProject]);
    } 
    else if (activeTab === 'files') {
      const newFile = {
        fileNo: `F-2026/${Math.floor(Math.random() * 900) + 100}`,
        subject: formData.subject || "Untitled File",
        type: formData.type || "PDF",
        date: new Date().toLocaleDateString('en-GB'), // Current Date
        size: "0 KB" // Dummy size
      };
      setFiles([...files, newFile]);
    } 
    else if (activeTab === 'budget') {
      // Simple calculation logic for demo
      const allocated = parseInt(formData.allocated) || 0;
      const spent = parseInt(formData.spent) || 0;
      const remaining = allocated - spent;

      const newBudget = {
        id: `B-00${Math.floor(Math.random() * 10) + 5}`,
        head: formData.head || "New Head",
        allocated: `₹${allocated}`,
        spent: `₹${spent}`,
        remaining: `₹${remaining}`
      };
      setBudgets([...budgets, newBudget]);
    }

    setIsModalOpen(false);
  };

  // Modal Component
  const AddModal = () => {
    if (!isModalOpen) return null;

    let title = "";
    if (activeTab === 'projects') title = "Add New Project";
    if (activeTab === 'files') title = "Upload New File";
    if (activeTab === 'budget') title = "Add Budget Allocation";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
              <FaTimes />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* --- PROJECT FORM FIELDS --- */}
            {activeTab === 'projects' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input name="name" onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Smart Road Phase 2" />
                </div>
               
              
              </>
            )}

            {/* --- FILE FORM FIELDS --- */}
            {activeTab === 'files' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Subject / Name</label>
                  <input name="subject" onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Meeting Minutes" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  
               
                </div>
              
              </>
            )}

            {/* --- BUDGET FORM FIELDS --- */}
            {activeTab === 'budget' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Head</label>
                  <input name="head" onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Office Expenses" />
                </div>
               
               
              </>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 text-sm font-medium text-white bg-[#123463] rounded-lg hover:bg-[#0e2a4e] flex items-center gap-2"
              >
                <FaSave /> Save {activeTab === 'projects' ? 'Project' : activeTab === 'files' ? 'File' : 'Budget'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">File Administrator</h1>
          <p className="text-sm text-gray-500">फाइल प्रशासक डैशबोर्ड</p>
        </div>
        
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-[#123463] text-white px-4 py-2 rounded-lg hover:bg-[#0e2a4e] transition-colors text-sm font-medium shadow-sm w-full md:w-auto justify-center"
        >
          <FaPlus size={12} />
          {activeTab === 'projects' ? 'Add Topics' : activeTab === 'files' ? 'Upload File' : 'Add Allocation'}
        </button>
      </div>

      {/* --- Segmented Tabs --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        
        <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg mb-6 w-full overflow-x-auto">
          {['projects', 'files', 'budget'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 text-center whitespace-nowrap
                ${activeTab === tab 
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }
              `}
            >
              {tab === 'projects' && 'Projects / Topics'}
              {tab === 'files' && 'Files Registry'}
              {tab === 'budget' && 'Budget Overview'}
            </button>
          ))}
        </div>

        {/* 1. Projects Tab Content */}
        {activeTab === 'projects' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Active Topics</h2>
              <div className="flex gap-2 w-full md:w-auto">
                 <div className="relative w-full md:w-64">
                   <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
                   <input type="text" placeholder="Search projects..." className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                 </div>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 text-xs uppercase font-semibold">
                    <th className="p-4 border-b">Project ID</th>
                    <th className="p-4 border-b"> Topics </th>
                    <th className="p-4 border-b">Department</th>
                    {/* <th className="p-4 border-b">Budget</th> */}
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                  {projects.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{item.id}</td>
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{item.department}</span>
                      </td>
                      {/* <td className="p-4 font-semibold text-gray-700">{item.budget}</td> */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          item.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          item.status === 'Ongoing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                          <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Files Tab Content */}
        {activeTab === 'files' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold text-gray-800">File Directory</h2>
               <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                 <FaDownload size={12}/> Export Log
               </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 text-xs uppercase font-semibold">
                    <th className="p-4 border-b">File No.</th>
                    <th className="p-4 border-b">Subject / Name</th>
                    <th className="p-4 border-b">Type</th>
                    {/* <th className="p-4 border-b">Size</th> */}
                    <th className="p-4 border-b">Upload Date</th>
                    <th className="p-4 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                  {files.map((file, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-medium text-blue-600 cursor-pointer hover:underline">{file.fileNo}</td>
                      <td className="p-4 font-medium text-gray-900">{file.subject}</td>
                      <td className="p-4">
                          <span className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-xs uppercase font-bold text-gray-600">{file.type}</span>
                      </td>
                      {/* <td className="p-4 text-gray-500">{file.size}</td> */}
                      <td className="p-4 text-gray-500">{file.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button className="text-gray-500 hover:text-blue-600"><FaSearch /></button>
                          <button className="text-red-400 hover:text-red-600"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Budget Tab Content */}
        {activeTab === 'budget' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                <p className="text-sm font-medium text-blue-600 mb-1">Total Allocation</p>
                <p className="text-3xl font-bold text-gray-800">₹12.5 Cr</p>
                <p className="text-xs text-blue-500 mt-2">+5% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border border-red-200">
                <p className="text-sm font-medium text-red-600 mb-1">Total Utilized</p>
                <p className="text-3xl font-bold text-gray-800">₹6.4 Cr</p>
                <p className="text-xs text-red-500 mt-2">51.2% Utilized</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                <p className="text-sm font-medium text-green-600 mb-1">Available Funds</p>
                <p className="text-3xl font-bold text-gray-800">₹6.1 Cr</p>
                <p className="text-xs text-green-600 mt-2">Ready for allocation</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold text-gray-800">Department Wise Allocation</h2>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 text-xs uppercase font-semibold">
                    <th className="p-4 border-b">Budget ID</th>
                    <th className="p-4 border-b">Head / Category</th>
                    <th className="p-4 border-b text-right">Allocated</th>
                    {/* <th className="p-4 border-b text-right">Spent</th>
                    <th className="p-4 border-b text-right">Remaining</th> */}
                    <th className="p-4 border-b text-right">Utilization</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                  {budgets.map((b) => (
                    <tr key={b.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-500">{b.id}</td>
                      <td className="p-4 font-medium text-gray-900">{b.head}</td>
                      <td className="p-4 text-right font-semibold text-blue-700">{b.allocated}</td>
                      {/* <td className="p-4 text-right text-red-600">{b.spent}</td>
                      <td className="p-4 text-right text-green-600 font-bold">{b.remaining}</td> */}
                      <td className="p-4 text-right">
                        <div className="w-24 ml-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600" style={{ width: '45%' }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Render the Modal */}
      <AddModal />

    </div>
  );
}

export default FileAdministrator;