import React from "react";
import { CiLock } from "react-icons/ci";

const Notes = () => {
  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 sm:p-10 text-center">

        {/* Lock Icon */}
        <CiLock
          size={50}
          className="mx-auto text-yellow-700 mb-3 sm:mb-4"
        />

        {/* Main Heading */}
        <h2 className="text-[15px] sm:text-[17px] font-medium text-yellow-800 leading-snug">
          Notings are confidential and cannot be viewed by Record Keeper
        </h2>

        {/* Subtext */}
        <p className="text-[13px] sm:text-[14px] text-yellow-700 mt-2 sm:mt-3 leading-snug">
          Internal notes and deliberations are restricted during case review.
        </p>
      </div>
    </div>
  );
};

export default Notes;
