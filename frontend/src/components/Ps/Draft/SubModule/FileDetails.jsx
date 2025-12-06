import React from "react";
import { CiLock } from "react-icons/ci";

const FileDetails = ({ complaint }) => {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Alert Section - Fully responsive */}
      <div className="p-3 sm:p-4 bg-yellow-50 text-yellow-700 border border-yellow-500 rounded-lg">
        <div className="flex items-start gap-2 sm:gap-3">
          <CiLock 
            size={20} 
            className="mt-0.5 sm:mt-1 flex-shrink-0 text-yellow-700 sm:w-[26px] sm:h-[26px]" 
          />
          <div>
            <p className="text-sm sm:text-[16px] font-semibold leading-tight sm:leading-normal">
              File contents hidden due to confidentiality
            </p>
            <p className="text-xs sm:text-[14px] leading-5 sm:leading-6 text-yellow-700 mt-1">
              This file is currently in motion with Lokayukta. Detailed metadata 
              and contents are restricted during review period.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Section - Responsive: 1 column mobile, 2 columns tablet+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        
        {/* File No. */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">File No.</p>
          <p className="text-gray-800 text-sm sm:text-[15px] font-medium break-words">
            {complaint?.complain_no || 'N/A'}
          </p>
        </div>

        {/* Case Type */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Case Type</p>
          <p className="text-gray-800 text-sm sm:text-[15px] font-medium">
            {complaint?.case_type || 'New Case'}
          </p>
        </div>

        {/* Current Level */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Current Level</p>
          <p className="text-gray-800 text-sm sm:text-[15px] font-medium">
            {complaint?.current_level || 'Lokayukta'}
          </p>
        </div>

        {/* Current Holder */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Current Holder</p>
          <p className="text-gray-800 text-sm sm:text-[15px] font-medium">
            {complaint?.current_holder || 'With Lokayukta'}
          </p>
        </div>

        {/* Fee Type */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Fee Type</p>
          <p className="text-gray-800 text-sm sm:text-[15px] font-medium">
            {complaint?.fee_exempted === 1 
              ? 'Exempted' 
              : complaint?.amount 
              ? 'Paid' 
              : 'Partial'}
          </p>
        </div>

        {/* Fee Status */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Fee Status</p>
          <p className="text-gray-800 text-sm sm:text-[15px] font-medium">
            {complaint?.payment_status || 'Awaiting approval'}
          </p>
        </div>

        {/* Registration Date - Conditional */}
        {complaint?.created_at && (
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border">
            <p className="text-gray-500 text-xs sm:text-sm mb-1">Registration Date</p>
            <p className="text-gray-800 text-sm sm:text-[15px] font-medium">
              {new Date(complaint.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        )}

        {/* District - Conditional */}
        {complaint?.district_name && (
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border">
            <p className="text-gray-500 text-xs sm:text-sm mb-1">District</p>
            <p className="text-gray-800 text-sm sm:text-[15px] font-medium break-words">
              {complaint.district_name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDetails;
