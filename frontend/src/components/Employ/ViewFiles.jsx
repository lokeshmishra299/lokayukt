import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileExcel, FaEye, FaDownload, FaSearch } from 'react-icons/fa';
const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json", 
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewFiles = () => {

  const AllFiles = async () => {
  const res = await api.get("/employee/all-files");
  console.log("All Files", res.data); 
  return res.data;
};

  const {data: allFilesData} = useQuery({
    queryKey: ["all-files"],
    queryFn: AllFiles
  })

  // 1. Dummy Data (फाइलों की नकली सूची)
  const dummyFiles = [
    {
      id: 1,
      name: "Project_Proposal_2024.pdf",
      uploader: "Amit Sharma",
      date: "2024-01-15",
      size: "2.4 MB",
      type: "pdf",
      status: "Approved",
    },
    {
      id: 2,
      name: "Site_Inspection_Image_01.jpg",
      uploader: "Rahul Verma",
      date: "2024-01-18",
      size: "4.1 MB",
      type: "image",
      status: "Pending",
    },
    {
      id: 3,
      name: "Financial_Report_Q1.xlsx",
      uploader: "Sneha Gupta",
      date: "2024-01-20",
      size: "1.2 MB",
      type: "excel",
      status: "Rejected",
    },
    {
      id: 4,
      name: "Meeting_Minutes_Jan.docx",
      uploader: "Vikram Singh",
      date: "2024-01-22",
      size: "800 KB",
      type: "word",
      status: "Approved",
    },
    {
      id: 5,
      name: "Architecture_Blueprint.pdf",
      uploader: "Amit Sharma",
      date: "2024-01-25",
      size: "5.6 MB",
      type: "pdf",
      status: "Pending",
    },
  ];

  const [files, setFiles] = useState(dummyFiles);
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Helper Function: फाइल टाइप के हिसाब से आइकन चुनने के लिए
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-xl" />;
      case 'word': return <FaFileWord className="text-blue-500 text-xl" />;
      case 'excel': return <FaFileExcel className="text-green-600 text-xl" />;
      case 'image': return <FaFileImage className="text-purple-500 text-xl" />;
      default: return <FaFilePdf className="text-gray-500 text-xl" />;
    }
  };

  // 3. Helper Function: स्टेटस के हिसाब से रंग चुनने के लिए
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Approved</span>;
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Pending</span>;
      case 'Rejected':
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  // 4. Search Filter Logic
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.uploader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <div className="w-full  flex flex-col items-start justify-start text-left">
  <h1 className="text-xl font-bold text-gray-900 w-full text-left">
    Uploaded Files  
  </h1>

  <p className="text-sm sm:text-base text-gray-600 break-words w-full text-left">
    अपलोड फ़ाइलें.
  </p>
</div>



        {/* Search Bar */}
        <div className="mt-4 md:mt-0 relative">
          <input
            type="text"
            placeholder="Search files..."
            className="sm:pl-10 pl-20 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploader</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{file.uploader}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{file.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{file.size}</td>
                    <td className="px-6 py-4">{getStatusBadge(file.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 relative right-4">
                        <button className="text-blue-600 hover:text-blue-800" title="View">
                          <FaEye />
                        </button>
                        {/* <button className="text-gray-600 hover:text-gray-800" title="Download">
                          <FaDownload />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No files found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewFiles;