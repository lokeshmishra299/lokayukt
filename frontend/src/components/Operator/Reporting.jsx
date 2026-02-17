import React, { useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

// Axios Setup (ताकि Token अपने आप चला जाए)
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
  // Input States
  const [compFile, setCompFile] = useState(""); 
  const [corrResp, setCorrResp] = useState(""); 
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");

  // Data & Loading States
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- API Call Function (GET) ---
  const handleSearch = async () => {
    setIsLoading(true);
    
    try {
      // GET Request में Data 'params' के ज़रिए भेजा जाता है
      const queryParams = {
        comp_file: compFile,
        corr_resp: corrResp,
        date: date,
        year: year
      };

      // API Call: GET Method with Query Params
      const response = await api.get("/operator/search-by-field", {
        params: queryParams
      });

      // मान लिया है कि डेटा response.data.data में आता है (अपने API के हिसाब से चेक कर लें)
      if (response.data.status === true || response.data.status === "success") {
        setResults(response.data.data || []);
        if (response.data.data?.length === 0) {
          toast.success("No records found for this search.");
        }
      } else {
        // अगर API डायरेक्ट Array रिटर्न कर रही हो
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-4">
        
        <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-900 whitespace-nowrap">
          Reporting
        </h2>
        
        {/* Header & Search Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[220px_220px_180px_140px_auto] gap-4 items-center w-full">

            {/* Complaint / File No */}
            <input
              type="text"
              placeholder="शिकायत, फ़ाइल संख्या"
              value={compFile}
              onChange={(e) => setCompFile(e.target.value)}
              className="px-4  py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Corr / Response */}
            <input
              type="text"
              placeholder="f'kdk;r, izfriknd"
              value={corrResp}
              onChange={(e) => setCorrResp(e.target.value)}
              className="px-4 kruti-input py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Date */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            />

            {/* Year */}
            <input
              type="number"
              placeholder="Year (YYYY)"
              min="1990"
              max="2099"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 text-white px-6 py-3 rounded-md text-base font-medium transition-colors w-full ${
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch className="text-sm" />}
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">S.No</th>
                <th className="px-4 py-3 border-b">File No</th>
                <th className="px-4 py-3 border-b">Report Name</th>
                <th className="px-4 py-3 border-b">Generated By</th>
                <th className="px-4 py-3 border-b">Date</th>
                <th className="px-4 py-3 border-b">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    <FaSpinner className="animate-spin inline mr-2" /> Searching records...
                  </td>
                </tr>
              ) : results.length > 0 ? (
                results.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    
                    {/* नोट: यहाँ item.file_no, item.report_name आदि को अपने असली API Response की Keys से बदल लें */}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {item.file_no || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      {item.report_name || item.title || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.generated_by || item.user?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.date || item.created_at || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.status || "Generated"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No records found. Please apply filters and click Search.
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