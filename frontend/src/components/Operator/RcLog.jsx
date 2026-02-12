import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Pagination from "../../components/Pagination";



const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const RcLog = () => {
  const getRcLogData = async () => {
    const res = await api.get("/operator/get-movement-history");
    return res.data.data; 
  };

  const { data: rclogValue, isLoading } = useQuery({
    queryKey: ["get-movement-history"],
    queryFn: getRcLogData,
  });



  const [openViewPopup, setOpenViewPopup] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

useEffect(() => {
  setCurrentPage(1);
}, [rclogValue]);

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

const currentLogs = rclogValue?.slice(indexOfFirstItem, indexOfLastItem) || [];

const totalPages = Math.ceil((rclogValue?.length || 0) / itemsPerPage);


  const label = (role, name) => {
    return name ? `${role} (${name})` : role;
  };

  const getMovementTitle = (item) => {
    if (!item) return "N/A";

    const record = "Received";
    const rk = label("RK", item.forward_by_rk_name);
    const ps = label("PS", item.forward_by_ps_name);
    const cio = label("CIO", item.forward_by_cio_io_name);
    const ro = label("RO/ARO", item.forward_by_ro_aro_name);
    const sec = label("Secretary", item.forward_by_sec_name);
    const lok = label("Lokayukt", item.forward_by_lokayukt_name);

    const toLok = label("Lokayukt", item.forward_to_lokayukt_name);
    const toUpLok = label("UpLokayukt", item.forward_to_uplokayukt_name);
    const toSec = label("Secretary", item.forward_to_sec_name);
    const toCio = label("CIO", item.forward_to_cio_io_name);
    const toRo = label("RO/ARO", item.forward_to_ro_aro_name);
    const toDispatch = label("Dispatch", item.forward_to_dispatch_name);

    if (item.forward_by_rk && (item.forward_to_lokayukt === 0 || item.forward_to_lokayukt === null)) {
      return `${record} → Record Section (RC)`;
    }

    if (item.forward_by_rk && item.forward_to_lokayukt) return `${rk} → ${toLok}`;
    if (item.forward_by_ps && item.forward_to_lokayukt) return `${ps} → ${toLok}`;
    if (item.forward_by_ps && item.forward_to_uplokayukt) return `${ps} → ${toUpLok}`;
    if (item.forward_by_ps && item.forward_to_sec) return `${ps} → ${toSec}`;

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_cio_io) {
      return `${ps} → Record Section (RC) → ${toCio}`;
    } else if (item.forward_by_ps && item.forward_to_cio_io) {
      return `${ps} → ${toCio}`;
    }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_sec) {
      return `${ro} → Record Section (RC) → ${toSec}`;
    } else if (item.forward_by_ro_aro && item.forward_to_sec) {
      return `${ro} → ${toSec}`;
    }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ps) {
      return `${cio} → Record Section (RC) → ${ps}`;
    }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_lokayukt) {
      return `${cio} → Record Section (RC) → ${toLok}`;
    }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ro_aro) {
      return `${ps} → Record Section (RC) → ${toRo}`;
    } else if (item.forward_by_ps && item.forward_to_ro_aro) {
      return `${ps} → ${toRo}`;
    }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ps) {
      return `${ro} → Record Section (RC) → ${ps}`;
    }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_dispatch) {
      return `${sec} → Record Section (RC) → ${toDispatch}`;
    } else if (item.forward_by_sec && item.forward_to_dispatch) {
      return `${sec} → ${toDispatch}`;
    }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_sec) {
      return `${lok} → Record Section (RC) → ${toSec}`;
    } else if (item.forward_by_lokayukt && item.forward_to_sec) {
      return `${lok} → ${toSec}`;
    }

    return `${record} → Record Section (RC)`;
  };

  const handleViewOpenPopup = (logItem) => {
    setSelectedLog(logItem); 
    setOpenViewPopup(true);
  };

  const handleClosePopup = () => {
    setOpenViewPopup(false);
    setSelectedLog(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

 

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
          Rc Log
        </h2>

        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-md border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">S.No</th>
                  <th className="px-4 py-2">Complaint ID</th>
                  <th className="px-4 py-2">Last Movement (Action)</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {currentLogs?.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
  {indexOfFirstItem + index + 1}
</td>
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {item?.complain_no || "-"}
                    </td>
                    <td className="px-4 py-2 text-blue-600 font-medium">
                      {getMovementTitle(item.last_action)}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {formatDate(item.last_action?.created_at)}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewOpenPopup(item)}
                        className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        <FaEye className="text-xs" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        )}
        <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  totalItems={rclogValue?.length || 0}
  itemsPerPage={itemsPerPage}
/>


        {openViewPopup && selectedLog && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl max-h-[90vh] flex flex-col">
              
              <div className="flex justify-between items-center border-b px-4 py-3 bg-gray-50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  Movement History 
                </h3>
                <button
                  onClick={handleClosePopup}
                  className="text-gray-500 hover:text-red-600 text-2xl"
                >
                  <IoCloseSharp />
                </button>
              </div>

              <div className="p-4 overflow-y-auto">
                <table className="min-w-full text-sm border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700 sticky top-0">
                    <tr>
                      <th className="border px-4 py-2 text-left w-12">S.No</th>
                      <th className="border px-4 py-2 text-left">Movement Description</th>
                      <th className="border px-4 py-2 text-left">Remarks</th>
                      <th className="border px-4 py-2 text-left w-32">Date</th>
                      <th className="border px-4 py-2 text-left w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLog.actions?.map((action, idx) => (
                      <tr key={action.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{idx + 1}</td>
                        <td className="border px-4 py-2 font-medium text-gray-800">
                           {getMovementTitle(action)}
                        </td>
                        <td className="border px-4 py-2 text-gray-600 italic">
                          {action.remarks || "No remarks"}
                        </td>
                        <td className="border px-4 py-2 whitespace-nowrap">
                          {formatDate(action.created_at)}
                        </td>
                        <td className="border px-4 py-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                             {action.status || "Completed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 border-t px-4 py-3 bg-gray-50 rounded-b-lg">
                <button
                  onClick={handleClosePopup}
                  className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300 font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RcLog;