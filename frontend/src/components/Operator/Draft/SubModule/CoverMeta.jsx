import React from "react";
import { CiLock } from "react-icons/ci";

const CoverMeta = () => {
  return (
    <div className="w-full space-y-6">
      <div className="p-4 bg-yellow-50 text-yellow-700 border border-yellow-500 rounded-lg">
        <div className="flex items-start gap-3">
          <CiLock size={26} className="mt-1 flex-shrink-0 text-yellow-700" />
          <div>
            <p className="text-[16px] font-semibold relative top-[0.8px]">
              File contents hidden due to confidentiality
            </p>
            <p className="text-[14px] leading-6 text-yellow-700 mt-1">
              This file is currently in motion with Lokayukta. Detailed metadata 
              and contents are restricted during review period.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">File No.</p>
          <p className="text-gray-800  text-[15px]">2025/LOK/123</p>
        </div>

  
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Case Type</p>
          <p className="text-gray-800  text-[15px]">New Case</p>
        </div>

      
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Current Level</p>
          <p className="text-gray-800  text-[15px]">Lokayukta</p>
        </div>

        
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Current Holder</p>
          <p className="text-gray-800  text-[15px]">With Lokayukta</p>
        </div>

        {/* Fee Type */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Fee Type</p>
          <p className="text-gray-800  text-[15px]">Partial</p>
        </div>

        {/* Fee Status */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Fee Status</p>
          <p className="text-gray-800  text-[15px]">Awaiting approval</p>
        </div>

      </div>
    </div>
  );
};

export default CoverMeta;
