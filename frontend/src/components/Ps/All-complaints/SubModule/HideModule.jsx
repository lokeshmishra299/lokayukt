import React from "react";
import { FaInfoCircle } from "react-icons/fa";

const HideModule = ({ complaint }) => {
  return (
    <div className="p-6 mx-6 mt-2 bg-gray-100 border border-gray-300 rounded-lg text-center shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <FaInfoCircle className="text-blue-600 text-3xl" />
        <h1 className="text-lg font-semibold text-gray-800">
          Complaint is Assigned to Another with PS[{complaint?.ps_assign_name || "N/A" }]
        </h1>
        <p className="text-sm text-gray-600">
          You do not have permission to view or modify this section.
        </p>
      </div>
    </div>
  );
};

export default HideModule;
