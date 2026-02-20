import React from "react";

const MovementHistory = ({ complaint }) => {
  const actions = complaint?.actions || [];
  const finalItems = actions.length > 0 ? actions : [{ remarks: "NA" }];

  // Role + Name formatter
  const label = (role, name) => (name ? `${name} (${role})` : role);

  const getMovementTitle = (item) => {

    
    if (
  complaint?.status === "Final Disposal/Closed" &&
  item?.status === "Final Decision" &&
  item?.forward_by_uplokayukt !== undefined &&
  item?.forward_by_uplokayukt !== null
) {
  if (item.sent_through_rk === 1) {
    return "Hon’ble UpLokayukt → Record Section (RC) → Disposed";
  }
  return "Hon’ble UpLokayukt → Disposed";
}


    const record = "Received";

    // FROM
    const rk = label("RK", item.forward_by_rk_name);
    const lok = label("Lokayukt", item.forward_by_lokayukt_name);
    const uplok = label("UpLokayukt", item.forward_by_uplokayukt_name);
    const ps = label("PS", item.forward_by_ps_name);
    const roAro = label("RO/ARO", item.forward_by_ro_aro_name);
    const ro = label("RO", item.forward_by_ro_name);
    const cio = label("CIO", item.forward_by_cio_io_name);
    const io = label("IO", item.forward_by_io_name);
    const sec = label("Secretary", item.forward_by_sec_name);
    const js = label("JS", item.forward_bs_js_name); 
    const us = label("US", item.forward_by_us_name);
    const ds = label("DS", item.forward_by_ds_name);

    // TO
    const toLok = label("Lokayukt", item.forward_to_lokayukt_name);
    const toUpLok = label("UpLokayukt", item.forward_to_uplokayukt_name);
    const toSec = label("Secretary", item.forward_to_sec_name);
    const toCio = label("CIO", item.forward_to_cio_io_name);
    const toio = label("IO", item.forward_to_io_name);
    const toRoAro = label("RO/ARO", item.forward_to_ro_aro_name);
    const toRo = label("RO", item.forward_to_ro_name);
    const toJs = label("JS", item.forward_to_js_name);
    const toUs = label("US", item.forward_to_us_name);
    const toDs = label("DS", item.forward_to_ds_name);
    const toDispatch = label("Dispatch", item.forward_to_dispatch_name);


    /* ================= RK ================= */

     if (item.forward_by_rk && !item.forward_to_lokayukt) {
      return `${record} → Record Section (RC)`;
    }
    
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${rk} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_rk && item.forward_to_lokayukt) { return `${rk} → Hon’ble ${toLok}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${rk} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_rk && item.forward_to_uplokayukt) { return `${rk} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_sec) { return `${rk} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_rk && item.forward_to_sec) { return `${rk} → ${toSec}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ps) { return `${rk} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_rk && item.forward_to_ps) { return `${rk} → ${ps}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${rk} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_rk && item.forward_to_cio_io) { return `${rk} → ${toCio}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_io) { return `${rk} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_rk && item.forward_to_io) { return `${rk} → ${toio}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${rk} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_rk && item.forward_to_ro_aro) { return `${rk} → ${toRoAro}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ro) { return `${rk} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_rk && item.forward_to_ro) { return `${rk} → ${toRo}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_js) { return `${rk} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_rk && item.forward_to_js) { return `${rk} → ${toJs}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_us) { return `${rk} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_rk && item.forward_to_us) { return `${rk} → ${toUs}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ds) { return `${rk} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_rk && item.forward_to_ds) { return `${rk} → ${toDs}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${rk} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_rk && item.forward_to_dispatch) { return `${rk} → ${toDispatch}`; }


    /* ================= LOKAYUKT ================= */
    
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `Hon’ble ${lok} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_lokayukt && item.forward_to_lokayukt) { return `Hon’ble ${lok} → Hon’ble ${toLok}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `Hon’ble ${lok} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_lokayukt && item.forward_to_uplokayukt) { return `Hon’ble ${lok} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_sec) { return `Hon’ble ${lok} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_lokayukt && item.forward_to_sec) { return `Hon’ble ${lok} → ${toSec}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ps) { return `Hon’ble ${lok} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_lokayukt && item.forward_to_ps) { return `Hon’ble ${lok} → ${ps}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `Hon’ble ${lok} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_lokayukt && item.forward_to_cio_io) { return `Hon’ble ${lok} → ${toCio}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_io) { return `Hon’ble ${lok} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_lokayukt && item.forward_to_io) { return `Hon’ble ${lok} → ${toio}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `Hon’ble ${lok} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_lokayukt && item.forward_to_ro_aro) { return `Hon’ble ${lok} → ${toRoAro}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ro) { return `Hon’ble ${lok} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_lokayukt && item.forward_to_ro) { return `Hon’ble ${lok} → ${toRo}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_js) { return `Hon’ble ${lok} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_lokayukt && item.forward_to_js) { return `Hon’ble ${lok} → ${toJs}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_us) { return `Hon’ble ${lok} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_lokayukt && item.forward_to_us) { return `Hon’ble ${lok} → ${toUs}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ds) { return `Hon’ble ${lok} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_lokayukt && item.forward_to_ds) { return `Hon’ble ${lok} → ${toDs}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `Hon’ble ${lok} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_lokayukt && item.forward_to_dispatch) { return `Hon’ble ${lok} → ${toDispatch}`; }


    /* ================= UPLOKAYUKT ================= */
    
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `Hon’ble ${uplok} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_uplokayukt && item.forward_to_lokayukt) { return `Hon’ble ${uplok} → Hon’ble ${toLok}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `Hon’ble ${uplok} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_uplokayukt && item.forward_to_uplokayukt) { return `Hon’ble ${uplok} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_sec) { return `Hon’ble ${uplok} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_uplokayukt && item.forward_to_sec) { return `Hon’ble ${uplok} → ${toSec}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ps) { return `Hon’ble ${uplok} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ps) { return `Hon’ble ${uplok} → ${ps}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `Hon’ble ${uplok} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_uplokayukt && item.forward_to_cio_io) { return `Hon’ble ${uplok} → ${toCio}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_io) { return `Hon’ble ${uplok} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_uplokayukt && item.forward_to_io) { return `Hon’ble ${uplok} → ${toio}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `Hon’ble ${uplok} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ro_aro) { return `Hon’ble ${uplok} → ${toRoAro}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ro) { return `Hon’ble ${uplok} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ro) { return `Hon’ble ${uplok} → ${toRo}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_js) { return `Hon’ble ${uplok} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_js) { return `Hon’ble ${uplok} → ${toJs}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_us) { return `Hon’ble ${uplok} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_us) { return `Hon’ble ${uplok} → ${toUs}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ds) { return `Hon’ble ${uplok} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ds) { return `Hon’ble ${uplok} → ${toDs}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `Hon’ble ${uplok} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_uplokayukt && item.forward_to_dispatch) { return `Hon’ble ${uplok} → ${toDispatch}`; }


    /* ================= PS ================= */
    
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ps} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ps && item.forward_to_lokayukt) { return `${ps} → Hon’ble ${toLok}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ps} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ps && item.forward_to_uplokayukt) { return `${ps} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ps} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ps && item.forward_to_sec) { return `${ps} → ${toSec}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ps} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_ps && item.forward_to_ps) { return `${ps} → ${ps}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ps} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ps && item.forward_to_cio_io) { return `${ps} → ${toCio}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_io) { return `${ps} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ps && item.forward_to_io) { return `${ps} → ${toio}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ps} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ps && item.forward_to_ro_aro) { return `${ps} → ${toRoAro}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ps} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ps && item.forward_to_ro) { return `${ps} → ${toRo}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_js) { return `${ps} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ps && item.forward_to_js) { return `${ps} → ${toJs}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_us) { return `${ps} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ps && item.forward_to_us) { return `${ps} → ${toUs}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ds) { return `${ps} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ps && item.forward_to_ds) { return `${ps} → ${toDs}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ps} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ps && item.forward_to_dispatch) { return `${ps} → ${toDispatch}`; }


    /* ================= RO / ARO ================= */
    
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${roAro} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ro_aro && item.forward_to_lokayukt) { return `${roAro} → Hon’ble ${toLok}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${roAro} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ro_aro && item.forward_to_uplokayukt) { return `${roAro} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_sec) { return `${roAro} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ro_aro && item.forward_to_sec) { return `${roAro} → ${toSec}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ps) { return `${roAro} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_ro_aro && item.forward_to_ps) { return `${roAro} → ${ps}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${roAro} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ro_aro && item.forward_to_cio_io) { return `${roAro} → ${toCio}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_io) { return `${roAro} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ro_aro && item.forward_to_io) { return `${roAro} → ${toio}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${roAro} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ro_aro && item.forward_to_ro_aro) { return `${roAro} → ${toRoAro}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ro) { return `${roAro} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ro_aro && item.forward_to_ro) { return `${roAro} → ${toRo}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_js) { return `${roAro} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ro_aro && item.forward_to_js) { return `${roAro} → ${toJs}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_us) { return `${roAro} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ro_aro && item.forward_to_us) { return `${roAro} → ${toUs}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ds) { return `${roAro} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ro_aro && item.forward_to_ds) { return `${roAro} → ${toDs}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${roAro} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ro_aro && item.forward_to_dispatch) { return `${roAro} → ${toDispatch}`; }


    /* ================= RO ================= */
    
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ro} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ro && item.forward_to_lokayukt) { return `${ro} → Hon’ble ${toLok}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ro} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ro && item.forward_to_uplokayukt) { return `${ro} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ro} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ro && item.forward_to_sec) { return `${ro} → ${toSec}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ro} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_ro && item.forward_to_ps) { return `${ro} → ${ps}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ro} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ro && item.forward_to_cio_io) { return `${ro} → ${toCio}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_io) { return `${ro} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ro && item.forward_to_io) { return `${ro} → ${toio}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ro} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ro && item.forward_to_ro_aro) { return `${ro} → ${toRoAro}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ro} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ro && item.forward_to_ro) { return `${ro} → ${toRo}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_js) { return `${ro} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ro && item.forward_to_js) { return `${ro} → ${toJs}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_us) { return `${ro} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ro && item.forward_to_us) { return `${ro} → ${toUs}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ds) { return `${ro} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ro && item.forward_to_ds) { return `${ro} → ${toDs}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ro} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ro && item.forward_to_dispatch) { return `${ro} → ${toDispatch}`; }


    /* ================= CIO ================= */
    
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${cio} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_cio_io && item.forward_to_lokayukt) { return `${cio} → Hon’ble ${toLok}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${cio} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_cio_io && item.forward_to_uplokayukt) { return `${cio} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_sec) { return `${cio} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_cio_io && item.forward_to_sec) { return `${cio} → ${toSec}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ps) { return `${cio} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_cio_io && item.forward_to_ps) { return `${cio} → ${ps}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${cio} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_cio_io && item.forward_to_cio_io) { return `${cio} → ${toCio}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_io) { return `${cio} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_cio_io && item.forward_to_io) { return `${cio} → ${toio}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${cio} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_cio_io && item.forward_to_ro_aro) { return `${cio} → ${toRoAro}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ro) { return `${cio} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_cio_io && item.forward_to_ro) { return `${cio} → ${toRo}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_js) { return `${cio} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_cio_io && item.forward_to_js) { return `${cio} → ${toJs}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_us) { return `${cio} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_cio_io && item.forward_to_us) { return `${cio} → ${toUs}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ds) { return `${cio} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_cio_io && item.forward_to_ds) { return `${cio} → ${toDs}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${cio} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_cio_io && item.forward_to_dispatch) { return `${cio} → ${toDispatch}`; }


    /* ================= IO ================= */
    
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${io} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_io && item.forward_to_lokayukt) { return `${io} → Hon’ble ${toLok}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${io} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_io && item.forward_to_uplokayukt) { return `${io} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_sec) { return `${io} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_io && item.forward_to_sec) { return `${io} → ${toSec}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ps) { return `${io} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_io && item.forward_to_ps) { return `${io} → ${ps}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${io} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_io && item.forward_to_cio_io) { return `${io} → ${toCio}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_io) { return `${io} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_io && item.forward_to_io) { return `${io} → ${toio}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${io} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_io && item.forward_to_ro_aro) { return `${io} → ${toRoAro}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ro) { return `${io} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_io && item.forward_to_ro) { return `${io} → ${toRo}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_js) { return `${io} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_io && item.forward_to_js) { return `${io} → ${toJs}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_us) { return `${io} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_io && item.forward_to_us) { return `${io} → ${toUs}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ds) { return `${io} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_io && item.forward_to_ds) { return `${io} → ${toDs}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${io} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_io && item.forward_to_dispatch) { return `${io} → ${toDispatch}`; }


    /* ================= SECRETARY ================= */
    
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${sec} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_sec && item.forward_to_lokayukt) { return `${sec} → Hon’ble ${toLok}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${sec} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_sec && item.forward_to_uplokayukt) { return `${sec} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_sec) { return `${sec} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_sec && item.forward_to_sec) { return `${sec} → ${toSec}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ps) { return `${sec} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_sec && item.forward_to_ps) { return `${sec} → ${ps}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${sec} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_sec && item.forward_to_cio_io) { return `${sec} → ${toCio}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_io) { return `${sec} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_sec && item.forward_to_io) { return `${sec} → ${toio}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${sec} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_sec && item.forward_to_ro_aro) { return `${sec} → ${toRoAro}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ro) { return `${sec} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_sec && item.forward_to_ro) { return `${sec} → ${toRo}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_js) { return `${sec} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_sec && item.forward_to_js) { return `${sec} → ${toJs}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_us) { return `${sec} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_sec && item.forward_to_us) { return `${sec} → ${toUs}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ds) { return `${sec} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_sec && item.forward_to_ds) { return `${sec} → ${toDs}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${sec} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_sec && item.forward_to_dispatch) { return `${sec} → ${toDispatch}`; }


    /* ================= JS ================= */
    
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${js} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_js && item.forward_to_lokayukt) { return `${js} → Hon’ble ${toLok}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${js} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_js && item.forward_to_uplokayukt) { return `${js} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_sec) { return `${js} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_js && item.forward_to_sec) { return `${js} → ${toSec}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ps) { return `${js} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_js && item.forward_to_ps) { return `${js} → ${ps}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${js} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_js && item.forward_to_cio_io) { return `${js} → ${toCio}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_io) { return `${js} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_js && item.forward_to_io) { return `${js} → ${toio}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${js} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_js && item.forward_to_ro_aro) { return `${js} → ${toRoAro}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ro) { return `${js} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_js && item.forward_to_ro) { return `${js} → ${toRo}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_us) { return `${js} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_js && item.forward_to_us) { return `${js} → ${toUs}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ds) { return `${js} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_js && item.forward_to_ds) { return `${js} → ${toDs}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${js} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_js && item.forward_to_dispatch) { return `${js} → ${toDispatch}`; }


    /* ================= US ================= */
    
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${us} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_us && item.forward_to_lokayukt) { return `${us} → Hon’ble ${toLok}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${us} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_us && item.forward_to_uplokayukt) { return `${us} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_sec) { return `${us} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_us && item.forward_to_sec) { return `${us} → ${toSec}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ps) { return `${us} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_us && item.forward_to_ps) { return `${us} → ${ps}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${us} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_us && item.forward_to_cio_io) { return `${us} → ${toCio}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_io) { return `${us} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_us && item.forward_to_io) { return `${us} → ${toio}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${us} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_us && item.forward_to_ro_aro) { return `${us} → ${toRoAro}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ro) { return `${us} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_us && item.forward_to_ro) { return `${us} → ${toRo}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_js) { return `${us} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_us && item.forward_to_js) { return `${us} → ${toJs}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ds) { return `${us} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_us && item.forward_to_ds) { return `${us} → ${toDs}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${us} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_us && item.forward_to_dispatch) { return `${us} → ${toDispatch}`; }


    /* ================= DS ================= */
    
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ds} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ds && item.forward_to_lokayukt) { return `${ds} → Hon’ble ${toLok}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ds} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ds && item.forward_to_uplokayukt) { return `${ds} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ds} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ds && item.forward_to_sec) { return `${ds} → ${toSec}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ds} → Record Section (RC) → ${ps}`; }
    if (item.forward_by_ds && item.forward_to_ps) { return `${ds} → ${ps}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ds} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ds && item.forward_to_cio_io) { return `${ds} → ${toCio}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_io) { return `${ds} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ds && item.forward_to_io) { return `${ds} → ${toio}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ds} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ds && item.forward_to_ro_aro) { return `${ds} → ${toRoAro}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ds} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ds && item.forward_to_ro) { return `${ds} → ${toRo}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_js) { return `${ds} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ds && item.forward_to_js) { return `${ds} → ${toJs}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_us) { return `${ds} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ds && item.forward_to_us) { return `${ds} → ${toUs}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ds} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ds && item.forward_to_dispatch) { return `${ds} → ${toDispatch}`; }

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