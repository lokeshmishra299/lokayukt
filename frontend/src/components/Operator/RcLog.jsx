import React from "react";
import { FaEye } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

const RcLog = () => {
  const [openViewPopup, setOpenViewPopup] = React.useState(false);

  const handelViewOpenPoup = () => {
    setOpenViewPopup(true);
  };

  const handleClosePopup = () => {
    setOpenViewPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-4">
        
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
          Rc Log
        </h2>

        <div className="overflow-x-auto rounded-md border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">S.No</th>
                <th className="px-4 py-2">User Name</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2 font-medium text-gray-800">Rahul</td>
                <td className="px-4 py-2 text-blue-600">Created RC</td>
                <td className="px-4 py-2 text-gray-600">24 Jan 2026</td>
                <td className="px-4 py-2">
                  <button
                    onClick={handelViewOpenPoup}
                    className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    <FaEye className="text-xs" />
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


        {openViewPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl">
              
              <div className="flex justify-between items-center border-b px-4 py-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  RC Details
                </h3>
                <button
                  onClick={handleClosePopup}
                  className="text-gray-500 hover:text-red-600 text-xl"
                >
                  <IoCloseSharp/>
                </button>
              </div>

              <div className="p-4 overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border px-4 py-2 text-left">Field</th>
                      <th className="border px-4 py-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-4 py-2 font-medium">User</td>
                      <td className="border px-4 py-2">Rahul</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-4 py-2 font-medium">Action</td>
                      <td className="border px-4 py-2">Created RC</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-4 py-2 font-medium">Date</td>
                      <td className="border px-4 py-2">24 Jan 2026</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border px-4 py-2 font-medium">Status</td>
                      <td className="border px-4 py-2 text-green-600 font-semibold">
                        Success
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 border-t px-4 py-3">
                <button
                  onClick={handleClosePopup}
                  className="px-4 py-1.5 bg-gray-200 rounded text-sm hover:bg-gray-300"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RcLog;
