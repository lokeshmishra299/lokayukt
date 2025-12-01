import React from "react";
import { CiLock } from "react-icons/ci";

const Notes = () => {
  return (
    <div className="p-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-10 text-center">

        {/* Lock Icon */}
        <CiLock size={60} className="mx-auto text-yellow-700 mb-3" />

        {/* Main Heading */}
        <h2 className="text-[17px]  text-yellow-800">
          Notings are confidential and cannot be viewed by Record Keeper
        </h2>

        {/* Subtext */}
        <p className="text-[14px] text-yellow-700 mt-2">
          Internal notes and deliberations are restricted during case review.
        </p>
      </div>
    </div>
  );
};

export default Notes;
