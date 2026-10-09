// Tactical Map Layers & Custom SVG Markers for Leaflet
// Renders professional maritime symbols, aircraft heading rotations, and GeoJSON corridors

import L from 'leaflet';

/**
 * Creates custom heading-rotated SVG icon for maritime vessels.
 * Distinct symbols for Cargo, Icebreaker, Research, Tanker, Supply.
 */
export function createVesselIcon(vessel, isSelected = false) {
  const heading = vessel.heading || vessel.course || 0;
  const isStale = vessel.trackingStatus === 'STALE';
  const isOffline = vessel.trackingStatus === 'OFFLINE';
  const isLive = vessel.trackingStatus === 'LIVE';

  let color = '#38bdf8'; // Default cyan
  let shapeIcon = '';

  const vType = (vessel.vesselType || '').toUpperCase();
  if (vType.includes('ICEBREAKER')) {
    color = '#f59e0b'; // Amber
    shapeIcon = `
      <polygon points="14,2 24,18 20,30 8,30 4,18" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <line x1="14" y1="6" x2="14" y2="26" stroke="#0f172a" stroke-width="2"/>
    `;
  } else if (vType.includes('RESEARCH')) {
    color = '#a855f7'; // Purple
    shapeIcon = `
      <path d="M14 2 L22 20 L18 29 L10 29 L6 20 Z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="14" cy="18" r="3" fill="#ffffff"/>
    `;
  } else if (vType.includes('TANKER')) {
    color = '#ef4444'; // Red
    shapeIcon = `
      <rect x="7" y="6" width="14" height="22" rx="4" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <polygon points="14,2 21,7 7,7" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
    `;
  } else {
    // Standard Cargo / Supply
    color = '#00f0ff'; // Cyan
    shapeIcon = `
      <polygon points="14,3 23,19 19,29 9,29 5,19" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <rect x="10" y="14" width="8" height="9" fill="#0f172a"/>
    `;
  }

  const pulseRing = isLive ? `
    <div style="position:absolute; top:-6px; left:-6px; width:40px; height:40px; border-radius:50%; border:1.5px solid ${color}; opacity:0.6; animation: markerPulse 2s infinite ease-out; pointer-events:none;"></div>
  ` : '';

  const selectionBorder = isSelected ? `border: 2px solid #ffffff; box-shadow: 0 0 15px ${color};` : '';

  const html = `
    <div class="vessel-marker-wrapper" style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center; ${selectionBorder}">
      ${pulseRing}
      <div style="transform: rotate(${heading}deg); transform-origin: center; transition: transform 0.4s ease;">
        <svg width="28" height="30" viewBox="0 0 28 32" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.6));">
          ${shapeIcon}
        </svg>
      </div>
      <div style="position:absolute; bottom:-14px; left:50%; transform:translateX(-50%); font-size:9px; font-weight:700; background:rgba(10,18,34,0.85); color:#ffffff; padding:1px 4px; border-radius:3px; white-space:nowrap; border:1px solid rgba(255,255,255,0.15); pointer-events:none;">
        ${vessel.name.split(' ')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-vessel-marker',
    html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
}

/**
 * Creates custom heading-rotated SVG icon for polar aircraft with altitude badge.
 */
export function createAircraftIcon(aircraft, isSelected = false) {
  const heading = aircraft.heading || 0;
  const isLive = aircraft.trackingStatus === 'LIVE';
  const color = '#38bdf8';

  const altKft = aircraft.altitude ? `${Math.round(aircraft.altitude / 1000)}k` : 'FL';

  const pulseRing = isLive ? `
    <div style="position:absolute; top:-5px; left:-5px; width:36px; height:36px; border-radius:50%; border:1.5px solid ${color}; opacity:0.6; animation: markerPulse 2.2s infinite ease-out; pointer-events:none;"></div>
  ` : '';

  const selectionGlow = isSelected ? 'filter: drop-shadow(0 0 8px #38bdf8);' : '';

  const html = `
    <div class="aircraft-marker-wrapper" style="position:relative; width:26px; height:26px; display:flex; align-items:center; justify-content:center; ${selectionGlow}">
      ${pulseRing}
      <div style="transform: rotate(${heading}deg); transform-origin: center; transition: transform 0.4s ease;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
        </svg>
      </div>
      <div style="position:absolute; bottom:-14px; left:50%; transform:translateX(-50%); font-size:8.5px; font-weight:700; background:rgba(10,18,34,0.9); color:#38bdf8; padding:1px 4px; border-radius:3px; white-space:nowrap; border:1px solid rgba(56,189,248,0.3); pointer-events:none;">
        ${aircraft.callsign || aircraft.icao24} • ${altKft}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-aircraft-marker',
    html,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14]
  });
}

/**
 * Creates permanent Station Marker for Maitri and Bharati.
 */
export function createStationIcon(station) {
  const html = `
    <div class="station-marker-pin" style="position:relative; width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
      <div style="position:absolute; inset:0; border-radius:50%; background:rgba(0,240,255,0.2); border:1.5px solid #00f0ff; animation: markerPulse 3s infinite;"></div>
      <div style="width:12px; height:12px; border-radius:50%; background:#ffffff; box-shadow:0 0 10px #00f0ff; z-index:2;"></div>
      <div style="position:absolute; top:-18px; left:50%; transform:translateX(-50%); background:#0f172a; color:#00f0ff; font-weight:800; font-size:9.5px; padding:1px 6px; border-radius:3px; border:1px solid #00f0ff; white-space:nowrap; z-index:3;">
        ${station.name.toUpperCase()}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'station-icon',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
}

/**
 * Creates Gateway Port Marker (Goa Mormugao Port & Cape Town Gateway).
 */
export function createPortIcon(port) {
  const html = `
    <div class="port-marker-pin" style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
      <div style="width:24px; height:24px; border-radius:50%; background:rgba(245,158,11,0.2); border:1.5px solid #f59e0b; display:flex; align-items:center; justify-content:center;">
        <span style="font-size:12px;">⚓</span>
      </div>
      <div style="position:absolute; top:-18px; left:50%; transform:translateX(-50%); background:#0f172a; color:#f59e0b; font-weight:800; font-size:9px; padding:1px 5px; border-radius:3px; border:1px solid #f59e0b; white-space:nowrap; z-index:3;">
        ${port.name.toUpperCase()}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'port-icon',
    html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
}
