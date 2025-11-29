import React from "react";
import { FaArrowUpLong } from "react-icons/fa6";

const Documents = () => {
  return (
    <div className=" space-y-6">

      {/* Warning Section */}
      <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
        <h1 className="text-lg font-semibold">
          You cannot view existing documents while the file is in motion.
        </h1>
        <p className="text-sm mt-1">
          Document contents are confidential during review by authorities.
        </p>
      </div>


      <div className="p-5 bg-white border rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Attach New Incoming Correspondence</h2>

        <p className="text-sm text-gray-600 mb-4">
          You can attach new external correspondence (letters, reminders, RTI replies) 
          that arrive after the file has been sent.
        </p>

        {/* Correspondence Type */}
        <label className="block font-medium mb-1">Correspondence Type</label>
        <select className="border px-3 py-2 rounded-lg w-60 mb-5 focus:outline-none">
          <option>Letter</option>
          <option>Reminder</option>
          <option>RTI Reply</option>
          <option>Counter Order</option>
        </select>

        {/* Upload PDF */}
        <div className="mt-3">
          <label className="block font-medium mb-2">Upload PDF Document</label>

          <label
            htmlFor="pdfUpload"
            className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50"
          >
            <FaArrowUpLong className="text-3xl text-gray-500 mb-2" />
            <p className="font-medium text-gray-700">Click to upload PDF</p>
            <p className="text-xs text-gray-500 mt-1">Only .pdf files are allowed</p>

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

export default Documents;