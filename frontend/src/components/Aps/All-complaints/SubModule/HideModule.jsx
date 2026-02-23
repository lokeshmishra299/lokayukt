import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";



const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});


const HideModule = () => {

  const {id} = useParams()


   const {
    data: complaintData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["complaint-details", id],
    queryFn: async () => {
      const res = await api.get(`/ps/view-complaint/${id}`);
      console.log("Hide Data", res.data)
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });


   if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-600">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-6 mt-2 bg-gray-100 border border-gray-300 rounded-lg text-center shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <FaInfoCircle className="text-blue-600 text-3xl" />
        <h1 className="text-lg font-semibold text-gray-800">
            Complaint is Assigned to Another with PS  [{complaintData?.ps_assign_name || "N/A"}]
        </h1>
        <p className="text-sm text-gray-600">
          You do not have permission to view or modify this section.
        </p>
      </div>
    </div>
  );
};

export default HideModule;
