import React from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import { CiLock } from "react-icons/ci";

const Documents = () => {
  return (
    <div className="space-y-6">

      {/* Warning Section */}
      <div className="p-4 bg-yellow-50 text-yellow-700 border border-yellow-500 rounded-lg">
        <div className="flex items-start gap-3">
          <CiLock size={26} className="mt-0.5 flex-shrink-0" />

          <div>
            <h1 className="text-[16px] font-semibold leading-tight">
              You cannot view existing documents while the file is in motion.
            </h1>

            <p className="text-[14px] mt-1 leading-snug text-yellow-800">
              Document contents are confidential during review by authorities.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
        <h2 className="text-[18px] text-blue-900 font-semibold mb-3">
          Attach New Incoming Correspondence
        </h2>

        <p className="text-sm text-blue-800 mb-5">
          You can attach new external correspondence (letters, reminders, RTI replies) 
          that arrive after the file has been sent.
        </p>

        {/* Correspondence Type */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correspondence Type
          </label>
          <select className="border px-3 py-2 rounded-lg w-60 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option>Letter</option>
            <option>Reminder</option>
            <option>RTI Reply</option>
            <option>Counter Order</option>
          </select>
        </div>

        {/* Upload PDF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PDF Document
          </label>

          <label
            htmlFor="pdfUpload"
            className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition"
          >
            <FaArrowUpLong className="text-3xl text-gray-500 mb-2" />
            <p className="font-medium text-gray-700">Click to upload PDF</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Only .pdf files are allowed
            </p>

            <input
              id="pdfUpload"
              type="file"
              accept="application/pdf"
              className="hidden"
            />
          </label>
        </div>
      </div>

    </div>
  );
};

export default Documents;
