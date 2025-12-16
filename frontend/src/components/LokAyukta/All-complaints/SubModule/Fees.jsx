import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});
const Fees = ({ complaint }) => {
  const { id } = useParams();
  const [erorrss, setErrorss] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [fessSubmitForm, setFessSubmitForm] = useState({
    fee_exempted: "2",
    remarks: "",
  });
  const [selectedFeeOption, setSelectedFeeOption] = useState("partial");
  const handleFeeChange = (value) => {
    const feeMap = {
      full: "1",
      partial: "2",
      exemption: "0",
    };
    setSelectedFeeOption(value);
    setFessSubmitForm((prev) => ({
      ...prev,
      fee_exempted: feeMap[value],
    }));
  };
  const handleApprove = async () => {
    try {
      setIsLoading(true); // Start loading
      setErrorss(null);
      const res = await api.post(
        `/lokayukt/fee-exempted/${id}`,
        fessSubmitForm
      );
      console.log("Fee Submitted:", res.data);
      // Success Toast
      toast.success("Fee Verified Successfully!");
      // Clear Remarks Field
      setFessSubmitForm((prev) => ({
        ...prev,
        remarks: "",
      }));
    } catch (error) {
      console.log("Error he", error);
      const errorData = error?.response?.data || null;
      setErrorss(errorData);
      // Error Toast
      if (errorData?.message) {
        // toast.error(errorData.message);
      } else {
        // toast.error("Something went wrong while verifying fee.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  return (
    <>
      {complaint.fee_approved_by_lokayukt == 1 ? (
        <div className="w-full flex items-center gap-4 p-6 bg-green-50 border border-green-300 rounded-xl shadow-sm">
          <FaCheckCircle className="text-green-600" size={28} />
          <div>
            <p className="text-green-800 text-base font-semibold">
              Fee Approved
            </p>
            <p className="text-green-700 text-sm mt-1">
              The fee has already been approved by the Lokayukt.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6">
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50">
              <h3 className="text-gray-800 font-semibold text-base">
                Fee Verification
              </h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    selectedFeeOption === "full"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="feeOption"
                    value="full"
                    checked={selectedFeeOption === "full"}
                    onChange={(e) => handleFeeChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700 text-sm font-medium">
                    Full Fee
                  </span>
                </label>
                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    selectedFeeOption === "partial"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="feeOption"
                    value="partial"
                    checked={selectedFeeOption === "partial"}
                    onChange={(e) => handleFeeChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700 text-sm font-medium">
                    Partial Fee
                  </span>
                </label>
                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    selectedFeeOption === "exemption"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="feeOption"
                    value="exemption"
                    checked={selectedFeeOption === "exemption"}
                    onChange={(e) => handleFeeChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700 text-sm font-medium">
                    Exemption
                  </span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-medium">
                  Remarks / Comments
                </label>
                <textarea
                  value={fessSubmitForm.remarks}
                  onChange={(e) =>
                    setFessSubmitForm((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Enter comments…"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 resize-none"
                />
                {erorrss && erorrss.errors && erorrss.errors.remarks && (
                  <p className="text-red-600 text-sm">
                    {erorrss.errors.remarks}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Approving..." : "Approve Fee"}
                </button>
              </div>
            </div>
          </div>
          {/* Toast Container Configured exactly like Login.js */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      )}
    </>
  );
};
export default Fees;







