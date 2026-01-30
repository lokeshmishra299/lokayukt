import React, { useState } from 'react';
import { 
  FaFolder, 
  FaFileAlt, 
  FaMoneyBillWave, 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaSearch,
  FaDownload,
  FaFilter
} from 'react-icons/fa';

const FileAdministrator = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const dummyProjects = [
    { id: 101, name: "Smart City Road Development", department: "PWD", status: "Ongoing", budget: "₹50 Cr" },
    { id: 102, name: "City Park Renovation", department: "Horticulture", status: "Pending", budget: "₹2 Cr" },
    { id: 103, name: "Street Light Installation Phase-2", department: "Electricity", status: "Completed", budget: "₹5 Cr" },
    { id: 104, name: "Drainage Cleaning Project", department: "Sanitation", status: "Ongoing", budget: "₹15 Cr" },
  ];

  const dummyFiles = [
    { fileNo: "F-2026/001", subject: "Tender Document for Road", type: "PDF", date: "25-01-2026", size: "2.4 MB" },
    { fileNo: "F-2026/002", subject: "NOC for Land Acquisition", type: "Image", date: "28-01-2026", size: "1.1 MB" },
    { fileNo: "F-2026/003", subject: "Annual Audit Report", type: "Excel", date: "29-01-2026", size: "500 KB" },
    { fileNo: "F-2026/004", subject: "Meeting Minutes - Jan", type: "Docx", date: "30-01-2026", size: "1.2 MB" },
  ];

  const dummyBudget = [
    { id: "B-001", head: "Infrastructure", allocated: "₹10,00,00,000", spent: "₹4,50,00,000", remaining: "₹5,50,00,000" },
    { id: "B-002", head: "Sanitation", allocated: "₹2,00,00,000", spent: "₹1,80,00,000", remaining: "₹20,00,000" },
    { id: "B-003", head: "Events & Cultural", allocated: "₹50,00,000", spent: "₹10,00,000", remaining: "₹40,00,000" },
    { id: "B-004", head: "IT & Software", allocated: "₹1,00,00,000", spent: "₹20,00,000", remaining: "₹80,00,000" },
  ];

  const handleAddClick = (type) => {
    alert(`Add New ${type} functionality popup will open here.`);
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">File Administrator</h1>
          <p className="text-sm text-gray-500">फाइल प्रशासक डैशबोर्ड</p>
        </div>
        
        <button 
          onClick={() => handleAddClick(activeTab === 'projects' ? 'Project' : activeTab === 'files' ? 'File' : 'Budget')}
          className="flex items-center gap-2 bg-[#123463] text-white px-4 py-2 rounded-lg hover:bg-[#0e2a4e] transition-colors text-sm font-medium shadow-sm w-full md:w-auto justify-center"
        >
          <FaPlus size={12} />
          {activeTab === 'projects' ? 'Add Project' : activeTab === 'files' ? 'Upload File' : 'Add Allocation'}
        </button>
      </div>

      {/* --- Segmented Tabs (Full Width / Justified) --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        
        <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg mb-6 w-full">
          {['projects', 'files', 'budget'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 text-center whitespace-nowrap
                ${activeTab === tab 
                  ? 'bg-white text-blue-700 shadow-sm' 
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

        
        {activeTab === 'projects' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Active Projects List</h2>
              <div className="flex gap-2 w-full md:w-auto">
                 <div className="relative w-full md:w-64">
                   <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
                   <input type="text" placeholder="Search projects..." className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                 </div>
                 <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"><FaFilter /></button>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 text-xs uppercase font-semibold">
                    <th className="p-4 border-b">Project ID</th>
                    <th className="p-4 border-b">Project Name</th>
                    <th className="p-4 border-b">Department</th>
                    <th className="p-4 border-b">Budget</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                  {dummyProjects.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">#{item.id}</td>
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{item.department}</span>
                      </td>
                      <td className="p-4 font-semibold text-gray-700">{item.budget}</td>
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

        {/* 2. Files Tab */}
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
                    <th className="p-4 border-b">Size</th>
                    <th className="p-4 border-b">Upload Date</th>
                    <th className="p-4 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                  {dummyFiles.map((file, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-medium text-blue-600 cursor-pointer hover:underline">{file.fileNo}</td>
                      <td className="p-4 font-medium text-gray-900">{file.subject}</td>
                      <td className="p-4">
                         <span className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-xs uppercase font-bold text-gray-600">{file.type}</span>
                      </td>
                      <td className="p-4 text-gray-500">{file.size}</td>
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

        {/* 3. Budget Tab */}
        {activeTab === 'budget' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Budget Stats Cards */}
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
                    <th className="p-4 border-b text-right">Spent</th>
                    <th className="p-4 border-b text-right">Remaining</th>
                    <th className="p-4 border-b text-right">Utilization</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                  {dummyBudget.map((b) => (
                    <tr key={b.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-500">{b.id}</td>
                      <td className="p-4 font-medium text-gray-900">{b.head}</td>
                      <td className="p-4 text-right font-semibold text-blue-700">{b.allocated}</td>
                      <td className="p-4 text-right text-red-600">{b.spent}</td>
                      <td className="p-4 text-right text-green-600 font-bold">{b.remaining}</td>
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
    </div>
  );
}

export default FileAdministrator;