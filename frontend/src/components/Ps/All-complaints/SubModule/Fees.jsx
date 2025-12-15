import axios from "axios";
import React, { useState } from "react";
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



const Fees = ({ complaint }) => {
  
const {id} = useParams()


const [fessSubmitForm, setFessSubmitForm] = useState({
  fee_exempted: 2, 
  remarks: "",
});


const handleFeeChange = (value) => {
  const feeMap = {
    full: 1,
    partial: 2,
    exemption: 0,
  };

  setSelectedFeeOption(value);

  setFessSubmitForm((prev) => ({
    ...prev,
    fee_exempted: feeMap[value],
  }));
};


  const FessSubmit = async ()=>{
  try {
    const res = api.post(`/ps/fessSubmit/${id}`)
  } catch (error) {
    console.log("Error he", error)
  }
}



const handleApprove = async () => {
  try {
    const res = await api.post(`/ps/fessSubmit/${id}`,fessSubmitForm);
    console.log("Fee Submitted:", res.data);
  } catch (error) {
    console.error("Submit Error:", error);
  }
};


  const [selectedFeeOption, setSelectedFeeOption] = useState("partial");


  return (
    <div className="w-full space-y-6">

  
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">

        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="text-gray-800 font-semibold text-base">
            Fee Verification
          </h3>
        </div>

     
        <div className="p-5 space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

     
            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selectedFeeOption === "full" ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}>
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

       
            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selectedFeeOption === "partial" ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}>
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

      
            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selectedFeeOption === "exemption" ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}>
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

          </div>


          <div className="flex justify-end">
            <button
              onClick={handleApprove}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Approve Fee
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Fees;
