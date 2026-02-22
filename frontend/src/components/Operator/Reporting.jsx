import React, { useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// Pagination Component Import (Ensure path is correct according to your folder structure)
import Pagination from "../Pagination"; 

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

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
  const [itemsPerPage, setItemsPerPage] = useState(10); // API se aane wala per_page

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

  // Search logic me page param dynamically handle ho raha hai
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
        page: page // Request me page number bhejna
      };

      const response = await api.get("/operator/search-by-field", {
        params: queryParams
      });

      if (response.data.status === true || response.data.status === "success") {
        const paginationData = response.data.data; // Yeh apka paginated object hai
        const fetchedData = paginationData?.data || []; // Asli array of objects
        
        setResults(fetchedData);
        
        // Backend se aaye pagination data ko state me set karein
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

  return (
    <div className="bg-gray-50 min-h-screen">
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

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Complaint </label>
              <input
                type="text"
                placeholder="f'kdk;r,"
                value={corrResp}
                onChange={(e) => setCorrResp(e.target.value)}
                className="w-full px-3 py-1 kruti-input text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
              {/* Naya Search hamesha Page 1 se shuru hoga */}
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
                {/* 1. Comp. No aur Year ke liye alag th banaye gaye */}
                <th className="px-6 py-3 border-b">Comp. No</th>
                <th className="px-6 py-3 border-b">Year</th>
                <th className="px-6 py-3 border-b whitespace-nowrap">Enroll Date</th>
                <th className="px-6 py-3 border-b whitespace-nowrap">Comp. Date</th>
                <th className="px-6 py-3 border-b">Complainant</th>
                <th className="px-6 py-3 border-b">District</th>
                <th className="px-6 py-3 border-b">Department</th>
                <th className="px-6 py-3 border-b">Nature</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                   Searching records...
                  </td>
                </tr>
              ) : results.length > 0 ? (
                results.map((item, index) => {
                  // Serial number dynamically calculate hoga (Page 2 pe 11 se shuru hoga)
                  const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  
                  return (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">{serialNumber}</td>
                      
                      {/* 2. Comp. No. ka alag column banaya */}
                      <td 
                        className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:underline whitespace-nowrap" 
                        onClick={() => handleViewComplaint(item.id)}
                      >
                        {item.COMP_NO || "N/A"}
                      </td>

                      {/* 3. Year ka alag column banaya */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.YEAR1 || "N/A"}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(item.ENROLL_DT)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(item.COMP_DT)}
                      </td>

                      {/* Yaha Kruti Dev ki class lagayi gayi hai */}
                      <td className="px-6 py-4 font-medium text-gray-800">
                        <span className="kruti-input text-[17px]">{item.COMP_NM || "N/A"}</span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        <span className=" text-[17px]">{item.DISTT || "N/A"}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        <span className=" text-[17px]">{item.DEPTT || "N/A"}</span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {item.NATURE == 1 ? "Complaint" : item.NATURE == 2 ? "Assertion" : item.NATURE || "N/A"}
                        </span>
                      </td>
                    </tr>
                  )
                })
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

        {/* --- Server-Side Pagination Component --- */}
        {results.length > 0 && totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => handleSearch(page)} // Yaha click karne pe API wapas page number leke call hogi
              totalItems={totalItems}
              itemsPerPage={itemsPerPage} // API ke mutabiq dynamic items per page
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default Reporting;