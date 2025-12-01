import React from "react";

const MovementHistory = () => {
  return (
    <div className="p-6 space-y-10">

      {/* Header */}
      <div className="flex items-center gap-2">
        <span className=" text-[18px]  text-gray-700">
          Movement
        </span>
        <span className="text-[18px]  text-gray-700">
          Timeline
        </span>
      </div>


      {/* Timeline Item 1 */}
      <div className="relative flex gap-4">

        {/* Left Timeline with Dot */}
        <div className="flex flex-col items-center">
          {/* Dot */}
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>

          {/* Line (Tailwind only) */}
          <div className="flex-1 w-[2px] bg-blue-300"></div>
        </div>

        {/* Card */}
        <div className="bg-white p-5 rounded-xl shadow border flex justify-between items-start w-full">
          <div>
            <p className="text-[15px]  text-gray-900">
              Received → Record Section
            </p>
            <p className="text-[13px] text-gray-600 mt-1">
              File received via post
            </p>
          </div>

          <p className="text-[13px] text-gray-500 whitespace-nowrap">
            12 Jan 2025, 10:30 AM
          </p>
        </div>
      </div>


      {/* Timeline Item 2 */}
      <div className="relative flex gap-4">

        {/* Left timeline with Dot */}
        <div className="flex flex-col items-center">
          {/* Dot */}
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>

          {/* Line */}
          <div className="flex-1 w-[2px] bg-blue-300"></div>
        </div>

        {/* Card */}
        <div className="bg-white p-5 rounded-xl shadow border flex justify-between items-start w-full">
          <div>
            <p className="text-[15px]  text-gray-900">
              Record Section → Lokayukta
            </p>
            <p className="text-[13px] text-gray-600 mt-1">
              Sent for review and fee approval
            </p>
          </div>

          <p className="text-[13px] text-gray-500 whitespace-nowrap">
            12 Jan 2025, 2:45 PM
          </p>
        </div>
      </div>

    </div>
  );
};

export default MovementHistory;
