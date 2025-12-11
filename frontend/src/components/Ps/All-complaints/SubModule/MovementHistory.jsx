import axios from "axios";
import React from "react";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const MovementHistory = ({ complaint }) => {


  const backendRemark = complaint?.actions?.[0]?.remarks || "NA";

  const items = [
    {
      title: "PS to Lokayukta (Shri ABC) → Lokayukta",
      status: "Marked",
      desc: "File marked for review and orders",
      time: "15 Jan 2025, 3:00 PM",
      remark: backendRemark,  
    },
    {
      title: "UpLokayukta → PS to Lokayukta (Shri ABC)",
      remark: backendRemark,  
        desc: "Please prepare draft order for investigation",
      time: "13 Jan 2025, 11:30 AM",
      status: "Marked",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[18px] text-gray-700">Movement</span>
        <span className="text-[18px] text-gray-700">History</span>
      </div>

      <div className="relative pl-10">
        <div className="absolute left-[14px] top-[20px] bottom-[20px] w-[2px] bg-blue-300"></div>

        {items.map((item, index) => (
          <div key={index} className="relative mb-4">

            <div className="absolute left-[-32px] top-2 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>

            <div className="bg-white rounded-xl shadow border p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">

              <div className="flex-1">
                <p className="text-[14px] sm:text-[15px] text-gray-900 font-medium">
                  {item.title || "NA"}
                </p>

                <p className="text-[12px] text-gray-500 mt-1">{item.time || "NA"}</p>

                <p className="text-[13px] text-gray-600 mt-1 leading-snug">
                <span className="font-semibold text-gray-700 mr-1">Remark:</span>
                   {item.remark || "NA"}
                </p>
              </div>

              {/* Right Side */}
              <div className="flex flex-col items-start sm:items-end gap-1.5 min-w-fit">
                <span className="text-[11px] sm:text-[12px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md whitespace-nowrap">
                  {item.status || "NA"}
                </span>

                {/* <div className="text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                  <span className="font-semibold text-gray-700 mr-1">Remark:</span>
                   {item.desc || "NA"}
                </div> */}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovementHistory;
