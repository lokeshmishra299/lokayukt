import React, { useState } from "react";
import { FaSearch, FaSpinner, FaEye } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Axios Setup
const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Reporting = () => {
  const navigate = useNavigate();

  // --- Input States ---
  const [compFile, setCompFile] = useState(""); 
  const [corrResp, setCorrResp] = useState(""); 
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  
  // ✅ New States for District, Department, From, To
  const [district, setDistrict] = useState("");
  const [department, setDepartment] = useState("");
  const [fromSender, setFromSender] = useState("");
  const [toReceiver, setToReceiver] = useState("");

  // --- Data & Loading States ---
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch Districts from API
  const { data: districtsList, isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts-list"],
    queryFn: async () => {
      const res = await api.get("/operator/all-district");
      return res.data.data || [];
    }
  });

  // ✅ Fetch Departments from API
  const { data: departmentsList, isLoading: loadingDepartments } = useQuery({
    queryKey: ["departments-list"],
    queryFn: async () => {
      const res = await api.get("/operator/department");
      return res.data.data || [];
    }
  });

  // --- API Call Function (GET) ---
  const handleSearch = async () => {
    setIsLoading(true);
    
    try {
      // ✅ Now sending all 8 parameters to backend
      const queryParams = {
        comp_file: compFile,
        comp_resp: corrResp,
        date: date,
        year: year,
        district: district,
        department: department,
        from: fromSender,
        to: toReceiver
      };

      const response = await api.get("/operator/search-by-field", {
        params: queryParams
      });

      if (response.data.status === true || response.data.status === "success") {
        setResults(response.data.data || []);
        if (response.data.data?.length === 0) {
          toast.success("No records found for this search.");
        }
      } else {
        setResults(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("Failed to fetch search results");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // View Handler
  const handleViewComplaint = (complaintId) => {
    if (!complaintId) return;
    navigate(`/lokayukt/all-complaints/view/${complaintId}`);
  };

  // Date Formatter Helper
  const formatDate = (dateString) => {
    if (!dateString) return "NA";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4">
        
        <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-900 whitespace-nowrap">
          Reporting & Search
        </h2>
        
        {/* ✅ Header & Search Filters (Updated Grid) */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end w-full">

            {/* Complaint / File No */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Complaint / File No</label>
              <input
                type="text"
                placeholder="शिकायत, फ़ाइल संख्या"
                value={compFile}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/[^0-9/-]/g, "");
                  setCompFile(filtered);
                }}
                inputMode="numeric"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Corr / Response */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Corr / Response </label>
              <input
                type="text"
                placeholder="f'kdk;r, izfriknd"
                value={corrResp}
                onChange={(e) => setCorrResp(e.target.value)}
                className="w-full px-3 py-2 kruti-input text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* District Dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Districts</option>
                {!loadingDistricts && districtsList?.map((d) => (
                  <option key={d.id} value={d.district_name}>{d.district_name}</option>
                ))}
              </select>
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Departments</option>
                {!loadingDepartments && departmentsList?.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* From (Sender) */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
              <input
                type="text"
                placeholder="Sender Name..."
                value={fromSender}
                onChange={(e) => setFromSender(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* To (Receiver) */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
              <input
                type="text"
                placeholder="Receiver Name..."
                value={toReceiver}
                onChange={(e) => setToReceiver(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white"
              />
            </div>

            {/* Year */}
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

            {/* Search Button */}
            <div>
              <button
                onClick={handleSearch}
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

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b">S.No</th>
                <th className="px-6 py-3 border-b">Complaint No.</th>
                <th className="px-6 py-3 border-b whitespace-nowrap">Enrollment Date</th>
                <th className="px-6 py-3 border-b">District</th>
                <th className="px-6 py-3 border-b">Department</th>
                <th className="px-6 py-3 border-b">From</th>
                <th className="px-6 py-3 border-b">To</th>
                <th className="px-6 py-3 border-b">Status</th>
                <th className="px-6 py-3 border-b">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    <FaSpinner className="animate-spin inline mr-2 text-blue-600" /> Searching records...
                  </td>
                </tr>
              ) : results.length > 0 ? (
                results.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{index + 1}</td>
                    
                    <td className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:underline whitespace-nowrap" onClick={() => handleViewComplaint(item.id)}>
                      {item.complain_no || "N/A"}
                    </td>
                    
                    {/* Enrollment Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(item.registration_date || item.created_at || item.date)}
                    </td>
                    
                    {/* District */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {item.district_name || item.district || "N/A"}
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {item.department_name || item.department || "N/A"}
                    </td>
                    
                    {/* From */}
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {item.from_name || item.forward_by_name || item.sender_name || "N/A"}
                    </td>

                    {/* To */}
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {item.to_name || item.forward_to_name || item.receiver_name || "N/A"}
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status || "In Motion"}
                      </span>
                    </td>
                    
                    {/* Action */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewComplaint(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition"
                      >
                        <FaEye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    No records found. Please enter details and click Search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Reporting;