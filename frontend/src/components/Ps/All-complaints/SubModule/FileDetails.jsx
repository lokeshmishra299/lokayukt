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

      {/* === FEE VERIFICATION CARD === */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">

        {/* Heading */}
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="text-gray-800 font-semibold text-base">
            Fee Verification
          </h3>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">

          {/* Radio Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Full Fee */}
            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selectedFeeOption === "full" ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}>
              <input
                type="radio"
                name="feeOption"
                value="full"
                checked={selectedFeeOption === "full"}
                onChange={(e) => setSelectedFeeOption(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700 text-sm font-medium">
                Approve Full Fee
              </span>
            </label>

            {/* Partial Fee */}
            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selectedFeeOption === "partial" ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}>
              <input
                type="radio"
                name="feeOption"
                value="partial"
                checked={selectedFeeOption === "partial"}
                onChange={(e) => setSelectedFeeOption(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700 text-sm font-medium">
                Approve Partial Fee
              </span>
            </label>

            {/* Fee Exemption */}
            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selectedFeeOption === "exemption" ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}>
              <input
                type="radio"
                name="feeOption"
                value="exemption"
                checked={selectedFeeOption === "exemption"}
                onChange={(e) => setSelectedFeeOption(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700 text-sm font-medium">
                Approve Exemption
              </span>
            </label>

          </div>


          {/* Comments */}
          <div className="space-y-2">
            <label className="text-gray-700 text-sm font-medium">
              Remarks / Comments
            </label>

            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="Enter comments…"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 resize-none"
            />
          </div>


          {/* Approve Button */}
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

export default FileDetails;
