import React, { useState } from "react";
import { FaSearch, FaSpinner, FaTimes, FaEye, FaFileAlt } from "react-icons/fa"; // Added FaTimes
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../Pagination"; 

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// /api ko hatakar file ka base URL banaya
const APP_URL = BASE_URL.replace("/api", ""); 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Reporting = () => {
  const navigate = useNavigate();

  const [compFile, setCompFile] = useState(""); 
  const [corrResp, setCorrResp] = useState(""); 
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [district, setDistrict] = useState("");
  const [department, setDepartment] = useState("");
  
  const [enrollmentFromDate, setEnrollmentFromDate] = useState("");
  const [enrollmentToDate, setEnrollmentToDate] = useState("");
  const [complaintDate, setComplaintDate] = useState("");
  const [nature, setNature] = useState("");

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  // --- NEW: Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFileUrl, setModalFileUrl] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const { data: districtsList, isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts-list"],
    queryFn: async () => {
      const res = await api.get("/operator/all-district");
      return res.data.data || [];
    }
  });

  const { data: departmentsList, isLoading: loadingDepartments } = useQuery({
    queryKey: ["departments-list"],
    queryFn: async () => {
      const res = await api.get("/operator/department");
      return res.data.data || [];
    }
  });

  const handleSearch = async (page = 1) => {
    setIsLoading(true);
    
    try {
      const queryParams = {
        comp_file: compFile,
        comp_resp: corrResp,
        date: date,
        year: year,
        district: district,
        department: department,
        enroll_from: enrollmentFromDate,
        enroll_to: enrollmentToDate,     
        complaint_date: complaintDate,
        nature: nature,
        page: page 
      };

      const response = await api.get("/operator/search-by-field", {
        params: queryParams
      });

      if (response.data.status === true || response.data.status === "success") {
        const paginationData = response.data.data; 
        const fetchedData = paginationData?.data || []; 
        
        setResults(fetchedData);
        
        setCurrentPage(paginationData?.current_page || 1);
        setTotalPages(paginationData?.last_page || 1);
        setTotalItems(paginationData?.total || 0);
        setItemsPerPage(paginationData?.per_page || 10);
        
        if (fetchedData.length === 0 && page === 1) {
          toast.success("No records found for this search.");
        }
      } else {
        setResults([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("Failed to fetch search results");
      setResults([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewComplaint = (complaintId) => {
    if (!complaintId) return;
    navigate(`/lokayukt/all-complaints/view/${complaintId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "NA";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // --- NEW: View CP API Call ---
  const handleViewCP = async (id) => {
    setFileLoading(true);
    try {
      const response = await api.get(`/operator/view-cp/${id}`);
      const path = response.data?.cp || response.data?.data?.cp; 
      
      if (path) {
        const finalUrl = APP_URL + (path.startsWith('/') ? path : '/' + path);
        setModalFileUrl(finalUrl);
        setModalTitle("View CP File");
        setIsModalOpen(true);
      } else {
        toast.error("CP File path not found!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load CP file");
    } finally {
      setFileLoading(false);
    }
  };

  // --- NEW: View NP API Call ---
  const handleViewNP = async (id) => {
    setFileLoading(true);
    try {
      const response = await api.get(`/operator/view-np/${id}`);
      // Assuming api returns 'np' key holding the path
      const path = response.data?.np || response.data?.data?.np;
      
      if (path) {
        const finalUrl = APP_URL + (path.startsWith('/') ? path : '/' + path);
        setModalFileUrl(finalUrl);
        setModalTitle("View NP File");
        setIsModalOpen(true);
      } else {
        toast.error("NP File path not found!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load NP file");
    } finally {
      setFileLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4">
        
        <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-900 whitespace-nowrap">
          Reporting & Search
        </h2>
        
        {/* --- Filters Section --- */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end w-full">

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">File No</label>
              <input
                type="text"
                placeholder="शिकायतें, फ़ाइल संख्या"
                value={compFile}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/[^0-9/-]/g, "");
                  setCompFile(filtered);
                }}
                inputMode="numeric"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
              <input
                type="number"
                placeholder="YYYY"
                min="1990"
                max="2099"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Complaint</label>
              <input
                type="text"
                placeholder="शिकायतें"
                value={corrResp}
                onChange={(e) => setCorrResp(e.target.value)}
                className="w-full px-3 py-1 kruti-input text-lg placeholder:text-sm placeholder:font-sans border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  district ? "kruti-input text-[16px]" : "text-sm font-sans"
                }`}
              >
                <option value="" className="font-sans text-sm">All Districts</option>
                
                {!loadingDistricts && districtsList?.map((d) => (
                  <option key={d.id} value={d.id} className="kruti-input text-[16px]">
                    {d.district_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  department ? "kruti-input text-[16px]" : "text-sm font-sans"
                }`}
              >
                <option value="" className="font-sans text-sm">All Departments</option>
                
                {!loadingDepartments && departmentsList?.map((d) => (
                  <option key={d.id} value={d.id} className="kruti-input text-[16px]">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Enrollment From Date</label>
              <input
                type="date"
                value={enrollmentFromDate}
                onChange={(e) => setEnrollmentFromDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Enrollment To Date</label>
              <input
                type="date"
                value={enrollmentToDate}
                onChange={(e) => setEnrollmentToDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Complaint Date</label>
              <input
                type="date"
                value={complaintDate}
                onChange={(e) => setComplaintDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nature</label>
              <select
                value={nature}
                onChange={(e) => setNature(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Nature</option>
                <option value="1">Complaint</option>
                <option value="2">Assertion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white"
              />
            </div>

            <div>
              <button
                onClick={() => handleSearch(1)}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors h-[38px] ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-sm"
                }`}
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch className="text-sm" />}
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>

          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b">S.No</th>
                <th className="px-6 py-3 border-b">Comp. No</th>
                <th className="px-6 py-3 border-b">Year</th>
                <th className="px-6 py-3 border-b whitespace-nowrap">Enroll Date</th>
                <th className="px-6 py-3 border-b whitespace-nowrap">Comp. Date</th>
                <th className="px-6 py-3 border-b">Complainant</th>
                <th className="px-6 py-3 border-b">District</th>
                <th className="px-6 py-3 border-b">Department</th>
                <th className="px-6 py-3 border-b">Nature</th>
                <th className="px-6 py-3 border-b">Address</th>
                <th className="px-6 py-3 border-b">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="11" className="px-4 py-8 text-center text-gray-500">
                    Searching records...
                  </td>
                </tr>
              ) : results.length > 0 ? (
                results.map((item, index) => {
                  const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  
                  return (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">{serialNumber}</td>
                      
                      <td 
                        className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:underline whitespace-nowrap" 
                        // onClick={() => handleViewComplaint(item.id)}
                      >
                        {item.COMP_NO || "N/A"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.YEAR1 || "N/A"}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(item.ENROLL_DT)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(item.COMP_DT)}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        <span className="kruti-input text-[17px]">{item.COMP_NM || "ykxw ugha"}</span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        <span className=" text-[17px] kruti-input">{item.DISTT || "ykxw ugha"}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        <span className=" text-[17px] kruti-input">{item.DEPTT || "ykxw ugha"}</span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {item.NATURE == 1 ? "Complaint" : item.NATURE == 2 ? "Assertion" : item.NATURE || "N/A"}
                        </span>
                      </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                        <span className="kruti-input text-[17px]">{item.ADD1 || "ykxw ugha"}</span>
                      </td>

                       <td className="px-6 py-4 font-medium text-gray-800 space-y-2">
                        {/* Note: I've passed item.id here instead of item.ADD1 so it passes ID to API */}
                        <button
                          onClick={() => handleViewCP(item.id || item.COMP_NO)}
                          disabled={fileLoading}
                          className="flex items-center gap-2 px-3 py-1.5 w-full justify-center
                                     bg-blue-50 text-blue-700 border border-blue-200
                                     rounded hover:bg-blue-100 transition text-sm disabled:opacity-50"
                        >
                          <FaEye className="text-blue-600" />
                          View CP
                        </button>

                        <button
                          onClick={() => handleViewNP(item.id || item.COMP_NO)}
                          disabled={fileLoading}
                          className="flex items-center gap-2 px-3 py-1.5 w-full justify-center
                                     bg-green-50 text-green-700 border border-green-200
                                     rounded hover:bg-green-100 transition text-sm disabled:opacity-50"
                        >
                          <FaFileAlt className="text-green-600" />
                          View NP
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="11" className="px-4 py-8 text-center text-gray-500">
                    No records found. Please enter details and click Search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {results.length > 0 && totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => handleSearch(page)} 
              totalItems={totalItems}
              itemsPerPage={itemsPerPage} 
            />
          </div>
        )}

      </div>

      {/* --- NEW: Popup Modal for Viewing Files --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-slideDown">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaEye className="text-blue-600" />
                {modalTitle}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-red-500 bg-gray-200 hover:bg-red-100 p-2 rounded-full transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Body / Iframe */}
            <div className="flex-1 w-full h-full bg-gray-100 p-2">
              <iframe
                src={modalFileUrl}
                className="w-full h-full border-0 rounded-md shadow-sm bg-white"
                title={modalTitle}
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reporting;