// 





import React from "react";

const MovementHistory = ({ complaint }) => {
  const actions = complaint?.actions || [];
  const finalItems = actions.length > 0 ? actions : [{ remarks: "NA" }];

  // Role + Name formatter
  const label = (role, name) => (name ? `${name} (${role})` : role);

  const getMovementTitle = (item) => {
    const record = "Received";

    // FROM
    const rk = label("RK", item.forward_by_rk_name);
    const ps = label("PS", item.forward_by_ps_name);
    const cio = label("CIO", item.forward_by_cio_io_name);
    const io = label("IO", item.forward_by_io_name);
    const roAro = label("RO/ARO", item.forward_by_ro_aro_name);
    const ro = label("RO", item.forward_by_ro_name);
    const sec = label("Secretary", item.forward_by_sec_name);
    const lok = label("Lokayukt", item.forward_by_lokayukt_name);

    // TO
    const toLok = label("Lokayukt", item.forward_to_lokayukt_name);
    const toUpLok = label("UpLokayukt", item.forward_to_uplokayukt_name);
    const toSec = label("Secretary", item.forward_to_sec_name);
    const toCio = label("CIO", item.forward_to_cio_io_name);
    const toio = label("IO", item.forward_to_io_name);
    const toRoAro = label("RO/ARO", item.forward_to_ro_aro_name);
    const toRo = label("RO", item.forward_to_ro_name);
    const toDispatch = label("Dispatch", item.forward_to_dispatch_name);

    /* ================= RK ================= */
    if (item.forward_by_rk && !item.forward_to_lokayukt) {
      return `${record} → Record Section (RC)`;
    }

    if (item.forward_by_rk && item.forward_to_lokayukt) {
      return `${rk} → Hon’ble ${toLok}`;
    }

    /* ================= PS ================= */
    if (item.forward_by_ps && item.forward_to_lokayukt) {
      return `${ps} → Hon’ble ${toLok}`;
    }

    if (item.forward_by_ps && item.forward_to_uplokayukt) {
      return `${ps} → Hon’ble ${toUpLok}`;
    }

    if (item.forward_by_ps && item.forward_to_sec) {
      return `${ps} → ${toSec}`;
    }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_cio_io) {
      return `${ps} → Record Section (RC) → ${toCio}`;
    }

    if (item.forward_by_ps && item.forward_to_cio_io) {
      return `${ps} → ${toCio}`;
    }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_io) {
      return `${ps} → Record Section (RC) → ${toio}`;
    }

    if (item.forward_by_ps && item.forward_to_io) {
      return `${ps} → ${toio}`;
    }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ro_aro) {
      return `${ps} → Record Section (RC) → ${toRoAro}`;
    }

    if (item.forward_by_ps && item.forward_to_ro_aro) {
      return `${ps} → ${toRoAro}`;
    }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ro) {
      return `${ps} → Record Section (RC) → ${toRo}`;
    }

    if (item.forward_by_ps && item.forward_to_ro) {
      return `${ps} → ${toRo}`;
    }

    /* ================= RO / ARO ================= */
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_sec) {
      return `${roAro} → Record Section (RC) → ${toSec}`;
    }

    if (item.forward_by_ro_aro && item.forward_to_sec) {
      return `${roAro} → ${toSec}`;
    }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ps) {
      return `${roAro} → Record Section (RC) → ${ps}`;
    }

    /* ================= RO ================= */
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ps) {
      return `${ro} → Record Section (RC) → ${ps}`;
    }

    if (item.forward_by_ro && item.forward_to_ps) {
      return `${ro} → ${ps}`;
    }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_sec) {
      return `${ro} → Record Section (RC) → ${toSec}`;
    }

    if (item.forward_by_ro && item.forward_to_sec) {
      return `${ro} → ${toSec}`;
    }

    /* ================= CIO ================= */
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ps) {
      return `${cio} → Record Section (RC) → ${ps}`;
    }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_lokayukt) {
      return `${cio} → Record Section (RC) → Hon’ble ${toLok}`;
    }

    /* ================= IO ================= */
if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ps) {
  return `${io} → Record Section (RC) → ${ps}`;
}

   if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_lokayukt) {
      return `${io} → Record Section (RC) → Hon’ble ${toLok}`;
    }

  if (item.forward_by_io && item.forward_to_ps) {
    return `${io} → ${ps}`;
  }

    /* ================= SECRETARY ================= */
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_dispatch) {
      return `${sec} → Record Section (RC) → ${toDispatch}`;
    }

    if (item.forward_by_sec && item.forward_to_dispatch) {
      return `${sec} → ${toDispatch}`;
    }

    /* ================= LOKAYUKT ================= */
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_sec) {
      return `Hon’ble ${lok} → Record Section (RC) → ${toSec}`;
    }

    if (item.forward_by_lokayukt && item.forward_to_sec) {
      return `Hon’ble ${lok} → ${toSec}`;
    }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_uplokayukt) {
      return `Hon’ble ${toLok} → Record Section (RC) → Hon’ble ${toUpLok}`;
    }

    if (item.forward_by_lokayukt && item.forward_to_uplokayukt) {
      return `Hon’ble ${toLok} → Hon’ble ${toUpLok}`;
    }

    return `${record} → Record Section (RC)`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[18px] text-gray-700">Movement History</span>
      </div>

      <div className="relative pl-10">
        <div className="absolute left-[14px] top-[20px] bottom-[20px] w-[2px] bg-blue-300" />

        {finalItems.map((item, index) => (
          <div key={index} className="relative mb-4">
            <div className="absolute left-[-32px] top-2 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>

            <div className="bg-white rounded-xl shadow border p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-3">
              <div className="flex-1">
                <p className="text-[15px] font-medium text-gray-900">
                  {getMovementTitle(item)}
                </p>
                <p className="text-[12px] text-gray-500 mt-1">
                  {item?.created_at || ""}
                </p>
                <p className="text-[13px] text-gray-600 mt-1">
                  <span className="font-semibold">Remark:</span>{" "}
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
