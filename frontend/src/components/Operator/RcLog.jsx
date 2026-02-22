import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaEye, FaSpinner } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { toast, Toaster } from "react-hot-toast";
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
  const queryClient = useQueryClient();
  const [openViewPopup, setOpenViewPopup] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [recordToUpdate, setRecordToUpdate] = useState(null); 
  
  // ✅ डेट और टाइम स्टोर करने के लिए नया State
  const [rcUpdateDateTime, setRcUpdateDateTime] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getRcLogData = async () => {
    const res = await api.get("/operator/get-movement-history");
    return res.data.data;
  };

  const { data: rclogValue, isLoading, refetch } = useQuery({
    queryKey: ["get-movement-history"],
    queryFn: getRcLogData,
  });

  // --- UPDATE MUTATION ---
  const updateRcMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post(`/operator/update-rc/${recordToUpdate?.id}`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Record Updated Successfully!");
      setShowUpdateModal(false);
      setRecordToUpdate(null);
      setRcUpdateDateTime(""); // ✅ सबमिट होने के बाद इनपुट क्लियर करें
      refetch(); 
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update record");
    },
  });

  const handleUpdateRecord = () => {
    if (!rcUpdateDateTime) {
      toast.error("Please select Date and Time");
      return;
    }

    // HTML datetime-local "YYYY-MM-DDTHH:mm" फॉर्मेट में डेटा देता है
    // बैकएंड के लिए हम इसे "YYYY-MM-DD HH:mm:ss" में बदल रहे हैं
    const formattedDateTime = rcUpdateDateTime.replace("T", " ") + ":00";

    const payload = {
      rc_update: formattedDateTime
    };

    updateRcMutation.mutate(payload);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [rclogValue]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = rclogValue?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((rclogValue?.length || 0) / itemsPerPage);

  const label = (role, name) => {
    return name ? `${name} (${role})` : role;
  };

  // --- ALL CONDITIONS APPLIED HERE ---
  const getMovementTitle = (item) => {
    if (!item) return "N/A";
    const record = "Received";

    // FROM
    const rk = label("RK", item.forward_by_rk_name);
    const lok = label("Lokayukt", item.forward_by_lokayukt_name);
    const uplok = label("UpLokayukt", item.forward_by_uplokayukt_name);
    const ps = label("PS", item.forward_by_ps_name);
    const roAro = label("RO/ARO", item.forward_by_ro_aro_name);
    const ro = label("RO", item.forward_by_ro_name);
    const cio = label("CIO", item.forward_by_cio_io_name);
    const io = label("IO", item.forward_by_io_name);
    const sec = label("Secretary", item.forward_by_sec_name);
    const js = label("JS", item.forward_by_js_name); 
    const us = label("US", item.forward_by_us_name);
    const ds = label("DS", item.forward_by_ds_name);

    // TO
    const toLok = label("Lokayukt", item.forward_to_lokayukt_name);
    const toUpLok = label("UpLokayukt", item.forward_to_uplokayukt_name);
    const toSec = label("Secretary", item.forward_to_sec_name);
    const toCio = label("CIO", item.forward_to_cio_io_name);
    const toio = label("IO", item.forward_to_io_name);
    const toRoAro = label("RO/ARO", item.forward_to_ro_aro_name);
    const toRo = label("RO", item.forward_to_ro_name);
    const toJs = label("JS", item.forward_to_js_name);
    const toUs = label("US", item.forward_to_us_name);
    const toDs = label("DS", item.forward_to_ds_name);
    const toDispatch = label("Dispatch", item.forward_to_dispatch_name);

    /* ================= RK ================= */
    if (item.forward_by_rk && !item.forward_to_lokayukt) { return `${record} → Record Section (RC)`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${rk} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_rk && item.forward_to_lokayukt) { return `${rk} → Hon’ble ${toLok}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${rk} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_rk && item.forward_to_uplokayukt) { return `${rk} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_sec) { return `${rk} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_rk && item.forward_to_sec) { return `${rk} → ${toSec}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ps) { return `${rk} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_rk && item.forward_to_ps) { return `${rk} → ${ps}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${rk} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_rk && item.forward_to_cio_io) { return `${rk} → ${toCio}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_io) { return `${rk} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_rk && item.forward_to_io) { return `${rk} → ${toio}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${rk} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_rk && item.forward_to_ro_aro) { return `${rk} → ${toRoAro}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ro) { return `${rk} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_rk && item.forward_to_ro) { return `${rk} → ${toRo}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_js) { return `${rk} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_rk && item.forward_to_js) { return `${rk} → ${toJs}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_us) { return `${rk} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_rk && item.forward_to_us) { return `${rk} → ${toUs}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ds) { return `${rk} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_rk && item.forward_to_ds) { return `${rk} → ${toDs}`; }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${rk} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_rk && item.forward_to_dispatch) { return `${rk} → ${toDispatch}`; }

    /* ================= LOKAYUKT ================= */
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `Hon’ble ${lok} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_lokayukt && item.forward_to_lokayukt) { return `Hon’ble ${lok} → Hon’ble ${toLok}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `Hon’ble ${lok} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_lokayukt && item.forward_to_uplokayukt) { return `Hon’ble ${lok} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_sec) { return `Hon’ble ${lok} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_lokayukt && item.forward_to_sec) { return `Hon’ble ${lok} → ${toSec}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ps) { return `Hon’ble ${lok} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_lokayukt && item.forward_to_ps) { return `Hon’ble ${lok} → ${ps}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `Hon’ble ${lok} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_lokayukt && item.forward_to_cio_io) { return `Hon’ble ${lok} → ${toCio}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_io) { return `Hon’ble ${lok} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_lokayukt && item.forward_to_io) { return `Hon’ble ${lok} → ${toio}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `Hon’ble ${lok} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_lokayukt && item.forward_to_ro_aro) { return `Hon’ble ${lok} → ${toRoAro}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ro) { return `Hon’ble ${lok} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_lokayukt && item.forward_to_ro) { return `Hon’ble ${lok} → ${toRo}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_js) { return `Hon’ble ${lok} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_lokayukt && item.forward_to_js) { return `Hon’ble ${lok} → ${toJs}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_us) { return `Hon’ble ${lok} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_lokayukt && item.forward_to_us) { return `Hon’ble ${lok} → ${toUs}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ds) { return `Hon’ble ${lok} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_lokayukt && item.forward_to_ds) { return `Hon’ble ${lok} → ${toDs}`; }
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `Hon’ble ${lok} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_lokayukt && item.forward_to_dispatch) { return `Hon’ble ${lok} → ${toDispatch}`; }

    /* ================= UPLOKAYUKT ================= */
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `Hon’ble ${uplok} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_uplokayukt && item.forward_to_lokayukt) { return `Hon’ble ${uplok} → Hon’ble ${toLok}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `Hon’ble ${uplok} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_uplokayukt && item.forward_to_uplokayukt) { return `Hon’ble ${uplok} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_sec) { return `Hon’ble ${uplok} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_uplokayukt && item.forward_to_sec) { return `Hon’ble ${uplok} → ${toSec}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ps) { return `Hon’ble ${uplok} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ps) { return `Hon’ble ${uplok} → ${ps}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `Hon’ble ${uplok} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_uplokayukt && item.forward_to_cio_io) { return `Hon’ble ${uplok} → ${toCio}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_io) { return `Hon’ble ${uplok} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_uplokayukt && item.forward_to_io) { return `Hon’ble ${uplok} → ${toio}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `Hon’ble ${uplok} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ro_aro) { return `Hon’ble ${uplok} → ${toRoAro}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ro) { return `Hon’ble ${uplok} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ro) { return `Hon’ble ${uplok} → ${toRo}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_js) { return `Hon’ble ${uplok} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_js) { return `Hon’ble ${uplok} → ${toJs}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_us) { return `Hon’ble ${uplok} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_us) { return `Hon’ble ${uplok} → ${toUs}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ds) { return `Hon’ble ${uplok} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ds) { return `Hon’ble ${uplok} → ${toDs}`; }
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `Hon’ble ${uplok} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_uplokayukt && item.forward_to_dispatch) { return `Hon’ble ${uplok} → ${toDispatch}`; }

    /* ================= PS ================= */
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ps} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ps && item.forward_to_lokayukt) { return `${ps} → Hon’ble ${toLok}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ps} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ps && item.forward_to_uplokayukt) { return `${ps} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ps} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ps && item.forward_to_sec) { return `${ps} → ${toSec}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ps} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_ps && item.forward_to_ps) { return `${ps} → ${ps}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ps} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ps && item.forward_to_cio_io) { return `${ps} → ${toCio}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_io) { return `${ps} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ps && item.forward_to_io) { return `${ps} → ${toio}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ps} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ps && item.forward_to_ro_aro) { return `${ps} → ${toRoAro}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ps} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ps && item.forward_to_ro) { return `${ps} → ${toRo}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_js) { return `${ps} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ps && item.forward_to_js) { return `${ps} → ${toJs}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_us) { return `${ps} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ps && item.forward_to_us) { return `${ps} → ${toUs}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ds) { return `${ps} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ps && item.forward_to_ds) { return `${ps} → ${toDs}`; }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ps} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ps && item.forward_to_dispatch) { return `${ps} → ${toDispatch}`; }

    /* ================= RO / ARO ================= */
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${roAro} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ro_aro && item.forward_to_lokayukt) { return `${roAro} → Hon’ble ${toLok}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${roAro} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ro_aro && item.forward_to_uplokayukt) { return `${roAro} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_sec) { return `${roAro} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ro_aro && item.forward_to_sec) { return `${roAro} → ${toSec}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ps) { return `${roAro} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_ro_aro && item.forward_to_ps) { return `${roAro} → ${ps}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${roAro} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ro_aro && item.forward_to_cio_io) { return `${roAro} → ${toCio}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_io) { return `${roAro} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ro_aro && item.forward_to_io) { return `${roAro} → ${toio}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${roAro} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ro_aro && item.forward_to_ro_aro) { return `${roAro} → ${toRoAro}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ro) { return `${roAro} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ro_aro && item.forward_to_ro) { return `${roAro} → ${toRo}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_js) { return `${roAro} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ro_aro && item.forward_to_js) { return `${roAro} → ${toJs}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_us) { return `${roAro} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ro_aro && item.forward_to_us) { return `${roAro} → ${toUs}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ds) { return `${roAro} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ro_aro && item.forward_to_ds) { return `${roAro} → ${toDs}`; }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${roAro} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ro_aro && item.forward_to_dispatch) { return `${roAro} → ${toDispatch}`; }

    /* ================= RO ================= */
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ro} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ro && item.forward_to_lokayukt) { return `${ro} → Hon’ble ${toLok}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ro} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ro && item.forward_to_uplokayukt) { return `${ro} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ro} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ro && item.forward_to_sec) { return `${ro} → ${toSec}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ro} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_ro && item.forward_to_ps) { return `${ro} → ${ps}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ro} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ro && item.forward_to_cio_io) { return `${ro} → ${toCio}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_io) { return `${ro} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ro && item.forward_to_io) { return `${ro} → ${toio}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ro} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ro && item.forward_to_ro_aro) { return `${ro} → ${toRoAro}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ro} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ro && item.forward_to_ro) { return `${ro} → ${toRo}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_js) { return `${ro} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ro && item.forward_to_js) { return `${ro} → ${toJs}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_us) { return `${ro} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ro && item.forward_to_us) { return `${ro} → ${toUs}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ds) { return `${ro} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ro && item.forward_to_ds) { return `${ro} → ${toDs}`; }
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ro} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ro && item.forward_to_dispatch) { return `${ro} → ${toDispatch}`; }

    /* ================= CIO ================= */
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${cio} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_cio_io && item.forward_to_lokayukt) { return `${cio} → Hon’ble ${toLok}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${cio} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_cio_io && item.forward_to_uplokayukt) { return `${cio} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_sec) { return `${cio} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_cio_io && item.forward_to_sec) { return `${cio} → ${toSec}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ps) { return `${cio} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_cio_io && item.forward_to_ps) { return `${cio} → ${ps}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${cio} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_cio_io && item.forward_to_cio_io) { return `${cio} → ${toCio}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_io) { return `${cio} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_cio_io && item.forward_to_io) { return `${cio} → ${toio}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${cio} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_cio_io && item.forward_to_ro_aro) { return `${cio} → ${toRoAro}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ro) { return `${cio} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_cio_io && item.forward_to_ro) { return `${cio} → ${toRo}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_js) { return `${cio} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_cio_io && item.forward_to_js) { return `${cio} → ${toJs}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_us) { return `${cio} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_cio_io && item.forward_to_us) { return `${cio} → ${toUs}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ds) { return `${cio} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_cio_io && item.forward_to_ds) { return `${cio} → ${toDs}`; }
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${cio} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_cio_io && item.forward_to_dispatch) { return `${cio} → ${toDispatch}`; }

    /* ================= IO ================= */
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${io} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_io && item.forward_to_lokayukt) { return `${io} → Hon’ble ${toLok}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${io} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_io && item.forward_to_uplokayukt) { return `${io} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_sec) { return `${io} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_io && item.forward_to_sec) { return `${io} → ${toSec}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ps) { return `${io} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_io && item.forward_to_ps) { return `${io} → ${ps}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${io} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_io && item.forward_to_cio_io) { return `${io} → ${toCio}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_io) { return `${io} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_io && item.forward_to_io) { return `${io} → ${toio}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${io} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_io && item.forward_to_ro_aro) { return `${io} → ${toRoAro}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ro) { return `${io} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_io && item.forward_to_ro) { return `${io} → ${toRo}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_js) { return `${io} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_io && item.forward_to_js) { return `${io} → ${toJs}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_us) { return `${io} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_io && item.forward_to_us) { return `${io} → ${toUs}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ds) { return `${io} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_io && item.forward_to_ds) { return `${io} → ${toDs}`; }
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${io} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_io && item.forward_to_dispatch) { return `${io} → ${toDispatch}`; }

    /* ================= SECRETARY ================= */
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${sec} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_sec && item.forward_to_lokayukt) { return `${sec} → Hon’ble ${toLok}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${sec} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_sec && item.forward_to_uplokayukt) { return `${sec} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_sec) { return `${sec} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_sec && item.forward_to_sec) { return `${sec} → ${toSec}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ps) { return `${sec} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_sec && item.forward_to_ps) { return `${sec} → ${ps}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${sec} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_sec && item.forward_to_cio_io) { return `${sec} → ${toCio}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_io) { return `${sec} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_sec && item.forward_to_io) { return `${sec} → ${toio}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${sec} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_sec && item.forward_to_ro_aro) { return `${sec} → ${toRoAro}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ro) { return `${sec} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_sec && item.forward_to_ro) { return `${sec} → ${toRo}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_js) { return `${sec} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_sec && item.forward_to_js) { return `${sec} → ${toJs}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_us) { return `${sec} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_sec && item.forward_to_us) { return `${sec} → ${toUs}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ds) { return `${sec} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_sec && item.forward_to_ds) { return `${sec} → ${toDs}`; }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${sec} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_sec && item.forward_to_dispatch) { return `${sec} → ${toDispatch}`; }

    /* ================= JS ================= */
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${js} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_js && item.forward_to_lokayukt) { return `${js} → Hon’ble ${toLok}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${js} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_js && item.forward_to_uplokayukt) { return `${js} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_sec) { return `${js} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_js && item.forward_to_sec) { return `${js} → ${toSec}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ps) { return `${js} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_js && item.forward_to_ps) { return `${js} → ${ps}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${js} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_js && item.forward_to_cio_io) { return `${js} → ${toCio}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_io) { return `${js} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_js && item.forward_to_io) { return `${js} → ${toio}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${js} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_js && item.forward_to_ro_aro) { return `${js} → ${toRoAro}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ro) { return `${js} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_js && item.forward_to_ro) { return `${js} → ${toRo}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_us) { return `${js} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_js && item.forward_to_us) { return `${js} → ${toUs}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ds) { return `${js} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_js && item.forward_to_ds) { return `${js} → ${toDs}`; }
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${js} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_js && item.forward_to_dispatch) { return `${js} → ${toDispatch}`; }

    /* ================= US ================= */
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${us} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_us && item.forward_to_lokayukt) { return `${us} → Hon’ble ${toLok}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${us} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_us && item.forward_to_uplokayukt) { return `${us} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_sec) { return `${us} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_us && item.forward_to_sec) { return `${us} → ${toSec}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ps) { return `${us} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_us && item.forward_to_ps) { return `${us} → ${ps}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${us} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_us && item.forward_to_cio_io) { return `${us} → ${toCio}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_io) { return `${us} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_us && item.forward_to_io) { return `${us} → ${toio}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${us} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_us && item.forward_to_ro_aro) { return `${us} → ${toRoAro}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ro) { return `${us} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_us && item.forward_to_ro) { return `${us} → ${toRo}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_js) { return `${us} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_us && item.forward_to_js) { return `${us} → ${toJs}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ds) { return `${us} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_us && item.forward_to_ds) { return `${us} → ${toDs}`; }
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${us} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_us && item.forward_to_dispatch) { return `${us} → ${toDispatch}`; }

    /* ================= DS ================= */
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ds} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ds && item.forward_to_lokayukt) { return `${ds} → Hon’ble ${toLok}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ds} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ds && item.forward_to_uplokayukt) { return `${ds} → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ds} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ds && item.forward_to_sec) { return `${ds} → ${toSec}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ds} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_ds && item.forward_to_ps) { return `${ds} → ${ps}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ds} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ds && item.forward_to_cio_io) { return `${ds} → ${toCio}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_io) { return `${ds} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ds && item.forward_to_io) { return `${ds} → ${toio}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ds} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ds && item.forward_to_ro_aro) { return `${ds} → ${toRoAro}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ds} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ds && item.forward_to_ro) { return `${ds} → ${toRo}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_js) { return `${ds} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ds && item.forward_to_js) { return `${ds} → ${toJs}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_us) { return `${ds} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ds && item.forward_to_us) { return `${ds} → ${toUs}`; }
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ds} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ds && item.forward_to_dispatch) { return `${ds} → ${toDispatch}`; }

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
      <Toaster position="top-right" />
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
                    {/* ✅ यहाँ UPDATE और VIEW दोनों बटन दिए गए हैं */}
                    <td className="px-4 py-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRecordToUpdate(item);
                          setRcUpdateDateTime(""); // नया ओपन करते समय इनपुट रीसेट करें
                          setShowUpdateModal(true);
                        }}
                        className="flex items-center gap-1 text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Update
                      </button>
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

        {/* --- VIEW MODAL --- */}
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

              {/* View Modal Footer */}
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

        {/* --- UPDATE CONFIRMATION MODAL WITH DATETIME INPUT --- */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Update Record</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={rcUpdateDateTime}
                  onChange={(e) => setRcUpdateDateTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                    setRecordToUpdate(null);
                    setRcUpdateDateTime("");
                  }}
                  disabled={updateRcMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRecord}
                  disabled={updateRcMutation.isPending || !rcUpdateDateTime}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  {updateRcMutation.isPending && <FaSpinner className="animate-spin" />}
                  {updateRcMutation.isPending ? "Updating..." : "Update"}
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