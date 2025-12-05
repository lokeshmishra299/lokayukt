import React, { useState } from "react";

const FileDetails = ({ complaint }) => {
  const [selectedFeeOption, setSelectedFeeOption] = useState("partial");
  const [comments, setComments] = useState("");

  const handleApprove = () => {
    console.log("Selected:", selectedFeeOption);
    console.log("Comments:", comments);
  };

  return (
    <div className="w-full space-y-6">

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* File No */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">File No.</p>
          <p className="text-gray-800 text-[15px] break-all">
            {complaint?.complain_no || "N/A"}
          </p>
        </div>

        {/* Case Type */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Case Type</p>
          <p className="text-gray-800 text-[15px]">
            {complaint?.case_type || "New Case"}
          </p>
        </div>

        {/* Received On */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Received On</p>
          <p className="text-gray-800 text-[15px]">12 Jan 2025</p>
        </div>

        {/* Current Level */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Current Level</p>
          <p className="text-gray-800 text-[15px]">
            {complaint?.current_level || "Lokayukta"}
          </p>
        </div>

        {/* Current Holder */}
      

        {/* Linked Old Case */}
    

      </div>

      {/* FEE VERIFICATION */}
      <div className="bg-blue-100 p-4 sm:p-6 rounded-xl border space-y-4">
        <h3 className="text-gray-800 font-semibold text-base">Fee Verification</h3>

        {/* Radio Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="feeOption"
              value="full"
              checked={selectedFeeOption === "full"}
              onChange={(e) => setSelectedFeeOption(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700 text-sm">Approve Full Fee</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="feeOption"
              value="partial"
              checked={selectedFeeOption === "partial"}
              onChange={(e) => setSelectedFeeOption(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700 text-sm">Approve Partial Fee</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="feeOption"
              value="exemption"
              checked={selectedFeeOption === "exemption"}
              onChange={(e) => setSelectedFeeOption(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700 text-sm">Approve Exemption</span>
          </label>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <label className="text-gray-700 text-sm font-medium">
            Comments
          </label>

          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            placeholder="Enter comments…"
            className="w-full px-4 py-3 bg-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 resize-none"
          />
        </div>

        {/* Approve Button */}
        <button
          onClick={handleApprove}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Approve Fee
        </button>
      </div>
    </div>
  );
};

export default FileDetails;
