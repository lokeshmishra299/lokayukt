import React, { useState, useMemo } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileExcel,
  FaEye,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../Pagination";

/* =======================
   DUMMY DATA
======================= */
const dummyFiles = [
  {
    id: 1,
    title: "Medical Leave Application",
    file: "medical_leave.pdf",
    type: "PDF",
    created_at: "2026-02-10",
  },
  {
    id: 2,
    title: "Casual Leave Form",
    file: "casual_leave.jpg",
    type: "Image",
    created_at: "2026-02-11",
  },
  {
    id: 3,
    title: "Earned Leave Document",
    file: "earned_leave.docx",
    type: "Word",
    created_at: "2026-02-12",
  },
  {
    id: 4,
    title: "Leave Balance Sheet",
    file: "leave_balance.xlsx",
    type: "Excel",
    created_at: "2026-02-13",
  },
  {
    id: 5,
    title: "Special Leave Approval",
    file: "special_leave.pdf",
    type: "PDF",
    created_at: "2026-02-14",
  },
];

const ViewFiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const itemsPerPage = 10;

  /* =======================
     FILE ICON
  ======================= */
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFilePdf className="text-gray-500 text-xl" />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext))
      return <FaFilePdf className="text-red-500 text-xl" />;
    if (["doc", "docx"].includes(ext))
      return <FaFileWord className="text-blue-500 text-xl" />;
    if (["xls", "xlsx", "csv"].includes(ext))
      return <FaFileExcel className="text-green-600 text-xl" />;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FaFileImage className="text-purple-500 text-xl" />;
    return <FaFilePdf className="text-gray-500 text-xl" />;
  };

  /* =======================
     VIEW → NAVIGATE ONLY
  ======================= */
  const handleViewFile = (id) => {
    navigate(`${id}`);
  };

  /* =======================
     FILTER + PAGINATION
  ======================= */
  const filteredFiles = useMemo(() => {
    return dummyFiles.filter(
      (file) =>
        file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.file.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = filteredFiles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            View Personal Files
          </h1>
          <p className="text-sm text-gray-600">व्यक्तिगत फाइलें</p>
        </div>

        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search files"
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {currentFiles.length ? (
              currentFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex gap-3 items-center">
                    {getFileIcon(file.file)}
                    <span className="font-medium">{file.title}</span>
                  </td>
                  <td className="px-6 py-4">{file.type}</td>
                  <td className="px-6 py-4">{file.created_at}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleViewFile(file.id)}
                      className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100"
                    >
                      <FaEye />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredFiles.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ViewFiles;
