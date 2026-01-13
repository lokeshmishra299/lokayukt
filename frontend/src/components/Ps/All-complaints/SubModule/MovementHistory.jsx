import React from "react";
import { FaArrowRight } from "react-icons/fa6";

const userName = localStorage.getItem("name");

const MovementHistory = ({ complaint }) => {
  const actions = complaint?.actions || [];
  const finalItems = actions.length > 0 ? actions : [{ remarks: "NA" }];


  // const getMovementTitle = (item) => {
  //   const record = "Recived ";
  //   const recordSection = "PS";


  //   if (item.forward_by_rk && (item.forward_to_lokayukt === 0 || item.forward_to_lokayukt === null)) {
  //     return `${record} → Record Section`;
  //   }


  //   if (item.forward_by_ps && item.forward_to_lokayukt) {
  //     return `${recordSection} → Lokayukta`;
  //   }
  //      if (item.forward_by_ps && item.forward_to_uplokayukt) {
  //     return `${recordSection} → UpLokayukta`;

  //   }

   
  //   return `${recordSection} → Record Section`;
  // };


 const getMovementTitle = (item) => {
    const record = "Recived ";
    const recordSection = "Record Section";

    // forward_by_rk && forward_to_lokayukt is 0 or null
    if (item.forward_by_rk && (item.forward_to_lokayukt === 0 || item.forward_to_lokayukt === null)) {
      return `${record} → Record Section`;
    }

    // forward_by_rk && forward_by_lokayukt present value 
    if (item.forward_by_rk && item.forward_to_lokayukt) {
      return `${recordSection} → Lokayukta`;
    }
    if (item.forward_by_ps && item.forward_to_lokayukt) {
      return `PS  → Lokayukta`;
    }
    if (item.forward_by_ps && item.forward_to_uplokayukt) {
      return `PS  → UpLokayukta`;
    }
    if (item.forward_by_ps && item.forward_to_sec) {
      return `PS  → Secratory`;
    }
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_cio_io) {
      return `PS → RC → CIO`;
    }else if (item.forward_by_ps && item.forward_to_cio_io) {
      return `PS  → CIO`;
    }
    if (item.forward_by_ps && item.forward_to_ro_aro) {
      return `PS  → RO/ARO`;
    }
    if (item.forward_by_ps && item.forward_to_ro_aro) {
      return `PS  → RO/ARO`;
    }
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_sec) {
      return `RO/ARO → RO → Secratory`;
    }else if (item.forward_by_ro_aro && item.forward_to_sec) {
      return `RO/ARO → Secratory`;
    }
    if (item.forward_by_cio && item.forward_to_ps) {
      return `CIO  → PS`;
    }
    if (item.forward_by_sec && item.forward_to_ro_aro) {
      return `Secratory  → RO/ARO`;
    }
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ro_aro) {
      return `Secratory → RO → RO/ARO`;
    } 
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ps) {
      return `CIO → RC → PS`;
    }

   
    return `${recordSection} → Record Section`;
  };
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[18px] text-gray-700">Movement</span>
        <span className="text-[18px] text-gray-700">History</span>
      </div>

      <div className="relative pl-10">
        <div className="absolute left-[14px] top-[20px] bottom-[20px] w-[2px] bg-blue-300"></div>

        {finalItems.map((item, index) => (
          <div key={index} className="relative mb-4">

          
            <div className="absolute left-[-32px] top-2 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>

            
            <div className="bg-white rounded-xl shadow border p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">

              <div className="flex-1">
                
                <p className="text-[14px] sm:text-[15px] text-gray-900 font-medium flex items-center gap-2">
                  {getMovementTitle(item)} 
                </p>

                
                <p className="text-[12px] text-gray-500 mt-1">
                  {item?.created_at || ""}
                </p>

                
                <p className="text-[13px] text-gray-600 mt-1 leading-snug">
                  <span className="font-semibold text-gray-700 mr-1">Remark:</span>
                  {item?.remarks || "NA"}
                </p>
              </div>

              
              <div className="flex flex-col items-start sm:items-end gap-1.5 min-w-fit">
                <span className="text-[11px] sm:text-[12px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md whitespace-nowrap">
                  {item?.status || "Forwarded"}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovementHistory;
