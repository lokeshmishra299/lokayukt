import React, { useState, useRef } from "react";
import {
  FaSearch,
  FaPlus,
  FaFilePdf,
  FaTimes,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaEye,
  FaDownload,
  FaTrash,
} from "react-icons/fa";
import { MdOutlineScanner } from "react-icons/md";

const ScanLetter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Mock Data for Scanned Letters
  const scannedLetters = [
    {
      id: 1,
      scanDate: "5/6/2025",
      letterNo: "LTR/2025/001",
      caseNo: "LOK/2024/0001",
      type: "Incoming",
      subject: "Response to show cause notice",
      pages: 3,
      status: "Attached to File",
    },
    {
      id: 2,
      scanDate: "4/6/2025",
      letterNo: "LTR/2025/002",
      caseNo: "LOK/2024/0022",
      type: "Incoming",
      subject: "Investigation report from DM Agra",
      pages: 12,
      status: "Pending Attachment",
    },
    {
      id: 3,
      scanDate: "3/6/2025",
      letterNo: "LTR/2025/003",
      caseNo: "LOK/2025/0015",
      type: "Outgoing Copy",
      subject: "Notice to department - office copy",
      pages: 2,
      status: "Attached to File",
    },
  ];

  // Handle File Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Trigger File Input Click
  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  // Remove Selected File
  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
   
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Responsive: Flex col on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            Scan Letters
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Scan and attach letters to case files
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
        >
          <MdOutlineScanner className="text-lg" /> Scan New Letter
        </button>
      </div>

      {/* Scanned Letters Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-h-[500px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6">
          Scanned Letters / स्कैन किए गए पत्र
        </h2>

        {/* Overflow Auto handles horizontal scrolling on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 min-w-[800px]">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Scan Date</th>
                <th className="px-6 py-3 whitespace-nowrap">Letter No.</th>
                <th className="px-6 py-3 whitespace-nowrap">Case No.</th>
                <th className="px-6 py-3 whitespace-nowrap">Type</th>
                <th className="px-6 py-3 whitespace-nowrap">Subject</th>
                <th className="px-6 py-3 whitespace-nowrap">Pages</th>
                <th className="px-6 py-3 whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {scannedLetters.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.scanDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {row.letterNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:underline cursor-pointer">
                    {row.caseNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 max-w-xs truncate">
                    {row.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.pages}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        row.status === "Attached to File"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end items-center gap-3">
                    <button className="text-gray-500 hover:text-gray-700 p-2">
                      <FaFilePdf />
                    </button>
                    {row.status === "Pending Attachment" && (
                      <button className="text-green-600 hover:text-green-700 p-2">
                        <FaCheckCircle />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center  justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
          <div className="bg-white rounded-t-xl sm:mx-0 mx-5 md:rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between  items-start p-4 md:p-5 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Scan / Upload Letter
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Scan a new letter or upload a scanned document
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 md:p-6 space-y-4 overflow-y-auto">
              {/* Case Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Number / प्रकरण संख्या
                </label>
                <input
                  type="text"
                  placeholder="Enter case number or search..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Letter Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Letter Type / पत्र प्रकार
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-600">
                  <option>Select type</option>
                  <option>Incoming</option>
                  <option>Outgoing</option>
                  <option>Internal Note</option>
                </select>
              </div>

              {/* Subject Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject / विषय
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter letter subject..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File / फाइल अपलोड करें
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />

                {!selectedFile ? (
                  // Default Upload State
                  <div
                    onClick={handleUploadAreaClick}
                    className="border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/50 p-6 md:p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FaCloudUploadAlt className="text-3xl text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-gray-600 font-medium">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-gray-400">
                        PDF, JPG, PNG (max 10MB)
                      </span>
                    </div>
                  </div>
                ) : (
                  // File Selected State
                  <div className="border border-blue-200 rounded-lg bg-blue-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FaFilePdf className="text-red-500 text-2xl shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 shrink-0"
                      title="Remove file"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-5 bg-gray-50 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-end gap-3 shrink-0">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedFile(null);
                }}
                className="w-full md:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button className="w-full md:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors shadow-sm">
                Upload & Attach
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanLetter;
