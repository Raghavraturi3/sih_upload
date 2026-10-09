// Antarctic Maritime & Polar Aviation Live Tracking Map
// Real-time operational geospatial interface across India → Cape Town → Southern Ocean → Maitri & Bharati

import { trackingService } from '../services/tracking/trackingService.js';
import { PolarMapEngine } from '../services/maps/mapProvider.js';
import { VIEWPORT_PRESETS } from '../services/maps/mapConfig.js';

export function renderTrackingView(telemetryEngine, authService, onNavigate) {
  const container = document.createElement('div');
  container.className = 'content-body tracking-module-root';

  let state = trackingService.getState();
  let mapEngine = null;

  // UI Selection State
  let selectedMmsi = null;
  let selectedIcao = null;
  let selectedShipmentId = null;
  let activeShipmentCategory = 'ALL';
  let activeTileLayer = 'dark';
  let isNauticalEnabled = false;
  let searchQuery = '';
  let timeMode = 'LIVE'; // 'LIVE' | '1H' | '6H' | '12H' | '24H' | '7D'
  let isDrawerOpen = false;
  let drawerMode = 'VESSEL'; // 'VESSEL' | 'AIRCRAFT'
  let isLegendOpen = true;

  // Layer toggles
  const layers = {
    vessels: true,
    aircraft: true,
    stations: true,
    gateways: true,
    plannedRoutes: true,
    actualTracks: true,
    nauticalMarks: false
  };

  function buildHTML() {
    const counters = trackingService.getCounters();
    const activeVessel = selectedMmsi ? trackingService.getVesselByMmsi(selectedMmsi) : null;
    const activeAircraft = selectedIcao ? trackingService.getAircraftByIcao(selectedIcao) : null;
    const activeShipment = selectedShipmentId ? state.shipments.find(s => s.shipmentId === selectedShipmentId) : null;

    // Filter shipments
    const filteredShipments = state.shipments.filter(sh => {
      const matchCat = activeShipmentCategory === 'ALL' || sh.category.toLowerCase().includes(activeShipmentCategory.toLowerCase());
      const matchSearch = !searchQuery || 
        sh.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) || 
        sh.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sh.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sh.carrierName && sh.carrierName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    // Filter vessels
    const filteredVessels = state.vessels.filter(v => {
      return !searchQuery || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.mmsi.includes(searchQuery) ||
        v.destination.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Filter aircraft
    const filteredAircraft = state.aircraft.filter(a => {
      return !searchQuery || 
        (a.callsign && a.callsign.toLowerCase().includes(searchQuery.toLowerCase())) || 
        a.icao24.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.destination.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return `
      <!-- TOP OPERATIONS COMMAND HEADER -->
      <div class="tracking-top-header" style="background:#070d19; border-bottom:1px solid var(--border-color); padding:10px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:32px; height:32px; border-radius:var(--radius-xs); background:var(--accent-signal-dim); border:1px solid var(--accent-signal-border); display:flex; align-items:center; justify-content:center; color:var(--accent-signal);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:800; font-size:14.5px; letter-spacing:0.5px; color:#ffffff;">
                Antarctic Maritime & Polar Aviation Live Tracking
              </span>
              <span class="badge badge-info" style="font-size:9.5px; background:rgba(0,210,255,0.12); color:var(--accent-cyan);">
                SIMULATED AIS / ADS-B FEED
              </span>
            </div>
            <div style="font-size:11px; color:var(--text-muted);">
              Geospatial corridor: Mormugao (India) ↔ Cape Town Gateway ↔ Southern Ocean ↔ Maitri & Bharati Stations
            </div>
          </div>
        </div>

        <!-- Live Status Tickers & Controls -->
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <div class="live-status-pill ${state.status.ais === 'CONNECTED' ? 'status-connected' : 'status-warn'}" title="${state.aisInfo.attribution}">
            <span class="status-dot"></span>
            <span>AIS: ${state.status.ais}</span>
          </div>

          <div class="live-status-pill ${state.status.adsb === 'CONNECTED' ? 'status-connected' : 'status-warn'}" title="${state.adsbInfo.attribution}">
            <span class="status-dot"></span>
            <span>ADS-B: ${state.status.adsb}</span>
          </div>

          <div class="live-status-pill status-connected" title="Leaflet 1.9.4 Geospatial Mapping Engine">
            <span class="status-dot"></span>
            <span>MAP: ONLINE</span>
          </div>

          <!-- Basemap Tile Switcher -->
          <div style="display:flex; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:6px; padding:2px;">
            <button class="btn btn-secondary btn-sm tile-btn ${activeTileLayer === 'dark' ? 'active' : ''}" data-layer="dark" style="font-size:10.5px; padding:3px 8px; border:none;">Tactical</button>
            <button class="btn btn-secondary btn-sm tile-btn ${activeTileLayer === 'satellite' ? 'active' : ''}" data-layer="satellite" style="font-size:10.5px; padding:3px 8px; border:none;">Satellite</button>
            <button class="btn btn-secondary btn-sm tile-btn ${activeTileLayer === 'osm' ? 'active' : ''}" data-layer="osm" style="font-size:10.5px; padding:3px 8px; border:none;">OSM</button>
            <button class="btn btn-secondary btn-sm nautical-toggle-btn ${isNauticalEnabled ? 'active' : ''}" style="font-size:10.5px; padding:3px 8px; border:none; ${isNauticalEnabled ? 'color:#38bdf8;' : ''}">Nautical</button>
          </div>

          <!-- Search Input -->
          <input type="text" id="tracking-search" class="form-input" style="width:180px; padding:5px 9px; font-size:11.5px;" placeholder="Search MMSI, ICAO, Ship..." value="${searchQuery}" />
        </div>
      </div>

      <!-- MAIN OPERATIONAL 3-COLUMN WORKSPACE -->
      <div class="tracking-workspace" style="display:grid; grid-template-columns: 280px 1fr 340px; height: calc(100vh - 170px); min-height:640px; background:#050914; position:relative; overflow:hidden;">
        
        <!-- LEFT OPERATIONS SIDEBAR: FLEET & AIR WING COUNTERS -->
        <div class="tracking-sidebar-left" style="background:#090f1d; border-right:1px solid var(--border-color); display:flex; flex-direction:column; overflow-y:auto;">
          
          <!-- Tactical Counters Grid -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; padding:10px; border-bottom:1px solid rgba(255,255,255,0.06);">
            <div class="counter-card" style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px;">
              <div style="font-size:9.5px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">VESSELS</div>
              <div style="font-size:18px; font-weight:800; font-family:var(--font-mono); color:#00f0ff;">${counters.vessels} <span style="font-size:10px; color:#22c55e;">LIVE</span></div>
            </div>
            <div class="counter-card" style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px;">
              <div style="font-size:9.5px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">AIRCRAFT</div>
              <div style="font-size:18px; font-weight:800; font-family:var(--font-mono); color:#38bdf8;">${counters.aircraft} <span style="font-size:10px; color:#22c55e;">LIVE</span></div>
            </div>
            <div class="counter-card" style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px;">
              <div style="font-size:9.5px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">SHIPMENTS</div>
              <div style="font-size:18px; font-weight:800; font-family:var(--font-mono); color:#f59e0b;">${counters.shipments} <span style="font-size:10px; color:var(--text-muted);">TRANSIT</span></div>
            </div>
            <div class="counter-card" style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px;">
              <div style="font-size:9.5px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">ALERTS</div>
              <div style="font-size:18px; font-weight:800; font-family:var(--font-mono); color:#ef4444;">${counters.alerts} <span style="font-size:10px; color:#ef4444;">ACTIVE</span></div>
            </div>
          </div>

          <!-- Viewport Corridor Focus Jump Buttons -->
          <div style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">CORRIDOR QUICK FOCUS</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              <button class="btn btn-secondary btn-sm preset-btn" data-preset="GLOBAL" style="font-size:10px; padding:3px 7px;">Global</button>
              <button class="btn btn-secondary btn-sm preset-btn" data-preset="SOUTHERN_OCEAN" style="font-size:10px; padding:3px 7px;">Southern Ocean</button>
              <button class="btn btn-secondary btn-sm preset-btn" data-preset="ANTARCTIC_REGION" style="font-size:10px; padding:3px 7px;">Antarctica</button>
              <button class="btn btn-secondary btn-sm preset-btn" data-preset="MAITRI_STATION" style="font-size:10px; padding:3px 7px;">Maitri</button>
              <button class="btn btn-secondary btn-sm preset-btn" data-preset="BHARATI_STATION" style="font-size:10px; padding:3px 7px;">Bharati</button>
              <button class="btn btn-secondary btn-sm preset-btn" data-preset="CAPE_TOWN" style="font-size:10px; padding:3px 7px;">Cape Town</button>
              <button class="btn btn-secondary btn-sm preset-btn" data-preset="INDIA_GOA" style="font-size:10px; padding:3px 7px;">Goa (India)</button>
            </div>
          </div>

          <!-- MARITIME FLEET LIST -->
          <div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.06);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:10.5px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">MARITIME FLEET (AIS)</span>
              <span style="font-size:9.5px; color:var(--accent-cyan); font-family:var(--font-mono);">${filteredVessels.length} Tracked</span>
            </div>

            <div class="tracking-list" style="display:flex; flex-direction:column; gap:6px;">
              ${filteredVessels.map(v => `
                <div class="fleet-item-row ${v.mmsi === selectedMmsi ? 'selected' : ''}" data-mmsi="${v.mmsi}">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-size:10px; font-weight:700; font-family:var(--font-mono); color:var(--accent-signal);">${v.vesselType === 'ICEBREAKER' ? 'ICE' : v.vesselType === 'TANKER' ? 'TNK' : 'SHP'}</span>
                      <div>
                        <div style="font-weight:700; font-size:12px; color:#ffffff;">${v.name}</div>
                        <div style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">MMSI ${v.mmsi} • ${v.vesselType}</div>
                      </div>
                    </div>
                    <span class="badge" style="font-size:8.5px; background:rgba(34,197,94,0.15); color:#22c55e; border:1px solid rgba(34,197,94,0.4);">${v.trackingStatus}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:10.5px; margin-top:5px; color:var(--text-secondary); border-top:1px solid rgba(255,255,255,0.04); padding-top:4px;">
                    <span>Speed: <strong>${v.speedKnots} kn</strong></span>
                    <span>Dest: <strong style="color:var(--accent-cyan);">${v.destination}</strong></span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- POLAR AVIATION LIST -->
          <div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.06);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:10.5px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">POLAR AVIATION (ADS-B)</span>
              <span style="font-size:9.5px; color:#38bdf8; font-family:var(--font-mono);">${filteredAircraft.length} Airborne</span>
            </div>

            <div class="tracking-list" style="display:flex; flex-direction:column; gap:6px;">
              ${filteredAircraft.map(a => `
                <div class="air-item-row ${a.icao24 === selectedIcao ? 'selected' : ''}" data-icao="${a.icao24}">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-size:10px; font-weight:700; font-family:var(--font-mono); color:#38bdf8;">AIR</span>
                      <div>
                        <div style="font-weight:700; font-size:12px; color:#ffffff;">${a.callsign || a.icao24}</div>
                        <div style="font-size:10px; color:var(--text-muted);">${a.model}</div>
                      </div>
                    </div>
                    <span class="badge badge-info" style="font-size:8.5px;">${a.altitude ? `${Math.round(a.altitude/1000)}k ft` : 'FL'}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:10.5px; margin-top:5px; color:var(--text-secondary); border-top:1px solid rgba(255,255,255,0.04); padding-top:4px;">
                    <span>Speed: <strong>${a.velocity} kt</strong></span>
                    <span>Dest: <strong style="color:var(--accent-cyan);">${a.destination}</strong></span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- OPERATIONAL ALERTS FEED -->
          <div style="padding:10px; margin-top:auto;">
            <div style="font-size:10.5px; font-weight:700; color:#ef4444; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
              CORRIDOR ALERTS (${state.alerts.length})
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${state.alerts.map(alt => `
                <div class="alert-item-box" data-vessel-mmsi="${alt.vesselMmsi || ''}" data-aircraft-icao="${alt.aircraftIcao || ''}" style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.3); border-radius:4px; padding:6px 8px; cursor:pointer;">
                  <div style="font-weight:700; font-size:11px; color:#f87171;">${alt.title}</div>
                  <div style="font-size:10px; color:var(--text-secondary); margin-top:2px;">${alt.details}</div>
                  <div style="font-size:9px; color:var(--text-muted); margin-top:3px; text-align:right;">${alt.timestamp}</div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- CENTER GEOSPATIAL MAP VIEWPORT -->
        <div class="tracking-map-container" style="position:relative; width:100%; height:100%; background:#050914;">
          <div id="polar-live-map-container" style="width:100%; height:100%; z-index:1;"></div>

          <!-- Floating Layer Control Panel -->
          <div class="map-floating-layers" style="position:absolute; top:14px; right:14px; background:rgba(9,15,29,0.92); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:10px 14px; font-size:11px; z-index:900; display:flex; flex-direction:column; gap:6px; box-shadow:0 8px 24px rgba(0,0,0,0.6);">
            <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px; font-size:10.5px; text-transform:uppercase; letter-spacing:0.5px;">OPERATIONAL LAYERS</div>
            <div class="layer-chk"><label><input type="checkbox" id="chk-vessels" ${layers.vessels ? 'checked' : ''}/> AIS Vessels</label></div>
            <div class="layer-chk"><label><input type="checkbox" id="chk-aircraft" ${layers.aircraft ? 'checked' : ''}/> ADS-B Aircraft</label></div>
            <div class="layer-chk"><label><input type="checkbox" id="chk-plannedRoutes" ${layers.plannedRoutes ? 'checked' : ''}/> Planned Corridors</label></div>
            <div class="layer-chk"><label><input type="checkbox" id="chk-actualTracks" ${layers.actualTracks ? 'checked' : ''}/> Historical Tracks</label></div>
            <div class="layer-chk"><label><input type="checkbox" id="chk-stations" ${layers.stations ? 'checked' : ''}/> Antarctic Stations</label></div>
            <div class="layer-chk"><label><input type="checkbox" id="chk-gateways" ${layers.gateways ? 'checked' : ''}/> Gateway Ports</label></div>
            <div class="layer-chk"><label><input type="checkbox" id="chk-nauticalMarks" ${layers.nauticalMarks ? 'checked' : ''}/> Nautical Marks</label></div>
          </div>

          <!-- Collapsible Floating Map Legend -->
          <div class="map-floating-legend" style="position:absolute; bottom:48px; left:14px; background:rgba(9,15,29,0.88); border:1px solid rgba(255,255,255,0.1); border-radius:4px; padding:8px 12px; font-size:10.5px; z-index:900; display:${isLegendOpen ? 'flex' : 'none'}; gap:14px; color:var(--text-secondary);">
            <div style="display:flex; align-items:center; gap:5px;"><span style="width:8px; height:8px; border-radius:50%; background:#00f0ff; display:inline-block;"></span> Maitri / Bharati Base</div>
            <div style="display:flex; align-items:center; gap:5px;"><span style="width:8px; height:8px; border-radius:1px; background:#00f0ff; display:inline-block;"></span> Live Vessel</div>
            <div style="display:flex; align-items:center; gap:5px;"><span style="width:8px; height:8px; border-radius:1px; background:#38bdf8; display:inline-block;"></span> Live Aircraft</div>
            <div style="display:flex; align-items:center; gap:5px;"><span style="width:14px; height:0; border-top:2px dashed #38bdf8; display:inline-block;"></span> Planned Corridor</div>
            <div style="display:flex; align-items:center; gap:5px;"><span style="width:14px; height:2px; background:#22c55e; display:inline-block;"></span> Actual AIS Track</div>
          </div>

          <!-- Bottom Time & Track Mode Control Bar -->
          <div class="map-bottom-timeline" style="position:absolute; bottom:0; left:0; right:0; height:38px; background:rgba(9,15,29,0.95); border-top:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:space-between; padding:0 16px; z-index:900; font-size:11px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; color:var(--text-muted); text-transform:uppercase; font-size:10px;">TIMELINE:</span>
              <button class="btn btn-secondary btn-sm time-btn ${timeMode === 'LIVE' ? 'active' : ''}" data-time="LIVE" style="padding:2px 8px; font-size:10px; font-weight:700; color:#22c55e;">● LIVE</button>
              <button class="btn btn-secondary btn-sm time-btn ${timeMode === '1H' ? 'active' : ''}" data-time="1H" style="padding:2px 8px; font-size:10px;">1h</button>
              <button class="btn btn-secondary btn-sm time-btn ${timeMode === '6H' ? 'active' : ''}" data-time="6H" style="padding:2px 8px; font-size:10px;">6h</button>
              <button class="btn btn-secondary btn-sm time-btn ${timeMode === '12H' ? 'active' : ''}" data-time="12H" style="padding:2px 8px; font-size:10px;">12h</button>
              <button class="btn btn-secondary btn-sm time-btn ${timeMode === '24H' ? 'active' : ''}" data-time="24H" style="padding:2px 8px; font-size:10px;">24h</button>
              <button class="btn btn-secondary btn-sm time-btn ${timeMode === '7D' ? 'active' : ''}" data-time="7D" style="padding:2px 8px; font-size:10px;">7d Track</button>
            </div>
            <div style="color:var(--text-muted); font-size:10.5px;">
              WebSocket Live Sync: <span style="color:#22c55e; font-family:var(--font-mono);">${state.status.lastUpdate}</span>
            </div>
          </div>
        </div>

        <!-- RIGHT LOGISTICS & SHIPMENTS LINKING PANEL -->
        <div class="tracking-sidebar-right" style="background:#090f1d; border-left:1px solid var(--border-color); display:flex; flex-direction:column; overflow-y:auto;">
          
          <div style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.06);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-weight:700; font-size:12px; color:#ffffff; text-transform:uppercase; letter-spacing:0.5px;">POLAR CARGO & RESUPPLY</span>
              <span class="badge badge-info" style="font-size:9.5px;">${filteredShipments.length} Active</span>
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">
              Click shipment to locate assigned carrier and inspect corridor route.
            </div>

            <!-- Category Filter Buttons -->
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              <button class="btn btn-secondary btn-sm cat-filter-btn ${activeShipmentCategory === 'ALL' ? 'active' : ''}" data-cat="ALL" style="font-size:10px; padding:2px 7px;">All</button>
              <button class="btn btn-secondary btn-sm cat-filter-btn ${activeShipmentCategory === 'Fuel' ? 'active' : ''}" data-cat="Fuel" style="font-size:10px; padding:2px 7px;">Fuel</button>
              <button class="btn btn-secondary btn-sm cat-filter-btn ${activeShipmentCategory === 'Medical' ? 'active' : ''}" data-cat="Medical" style="font-size:10px; padding:2px 7px;">Medical</button>
              <button class="btn btn-secondary btn-sm cat-filter-btn ${activeShipmentCategory === 'Food' ? 'active' : ''}" data-cat="Food" style="font-size:10px; padding:2px 7px;">Food</button>
              <button class="btn btn-secondary btn-sm cat-filter-btn ${activeShipmentCategory === 'Scientific' ? 'active' : ''}" data-cat="Scientific" style="font-size:10px; padding:2px 7px;">Scientific</button>
              <button class="btn btn-secondary btn-sm cat-filter-btn ${activeShipmentCategory === 'Spare' ? 'active' : ''}" data-cat="Spare" style="font-size:10px; padding:2px 7px;">Spares</button>
            </div>
          </div>

          <!-- Shipments List -->
          <div class="shipment-card-stream" style="padding:10px; display:flex; flex-direction:column; gap:8px;">
            ${filteredShipments.map(sh => `
              <div class="shipment-record-card ${sh.shipmentId === selectedShipmentId ? 'selected' : ''}" data-shipment-id="${sh.shipmentId}">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                  <code style="font-weight:700; font-size:11.5px; color:var(--accent-cyan);">${sh.shipmentId}</code>
                  <span class="badge ${sh.priority === 'CRITICAL' ? 'badge-danger' : sh.priority === 'HIGH' ? 'badge-warning' : 'badge-info'}" style="font-size:8.5px;">
                    ${sh.priority}
                  </span>
                </div>

                <div style="font-weight:700; font-size:12px; color:#ffffff; margin-bottom:4px;">${sh.title}</div>
                
                <div style="font-size:10.5px; color:var(--text-muted); margin-bottom:6px;">
                  Carrier: <strong style="color:#ffffff;">${sh.carrierName}</strong> (${sh.transportType})
                </div>

                <!-- Progress Bar -->
                <div style="background:rgba(255,255,255,0.06); height:4px; border-radius:2px; margin-bottom:6px; overflow:hidden;">
                  <div style="background:linear-gradient(90deg, #00f0ff, #22c55e); height:100%; width:${sh.progressPercent}%;"></div>
                </div>

                <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--text-secondary);">
                  <span>Dest: <strong style="color:#38bdf8;">${sh.destination}</strong></span>
                  <span>ETA: <strong>${sh.eta.split('•')[0]}</strong></span>
                </div>

                <button class="btn btn-secondary btn-sm btn-focus-carrier" data-shipment-id="${sh.shipmentId}" style="width:100%; margin-top:8px; font-size:10px; padding:3px 6px; justify-content:center;">
                  LOCATE CARRIER ON MAP
                </button>
              </div>
            `).join('')}
          </div>

        </div>

      </div>

      <!-- SLIDE-OUT DETAIL DRAWER (RIGHT PANEL) -->
      ${isDrawerOpen ? renderDrawer(drawerMode === 'VESSEL' ? activeVessel : activeAircraft, drawerMode) : ''}
    `;
  }

  // Render Slide-Out Operational Detail Drawer
  function renderDrawer(obj, mode) {
    if (!obj) return '';

    const isVessel = mode === 'VESSEL';
    const title = isVessel ? obj.name : (obj.callsign || obj.icao24);
    const shipment = isVessel ? trackingService.findShipmentByVessel(obj.mmsi) : trackingService.findShipmentByAircraft(obj.icao24);

    return `
      <div class="tracking-drawer-overlay" style="position:fixed; top:0; right:0; bottom:0; width:440px; background:#070d19; border-left:1px solid var(--border-color); box-shadow:-10px 0 35px rgba(0,0,0,0.8); z-index:1100; display:flex; flex-direction:column; animation: drawerSlideIn 0.25s ease;">
        <div class="drawer-header" style="padding:14px 18px; background:rgba(15,23,42,0.8); border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge ${isVessel ? 'badge-info' : 'badge-cyan'}" style="font-size:10px;">${isVessel ? 'VESSEL' : 'AIRCRAFT'}</span>
              <span style="font-weight:800; font-size:15px; color:#ffffff;">${title}</span>
              <span class="badge badge-success" style="font-size:9px;">● LIVE</span>
            </div>
            <div style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">
              ${isVessel ? `MMSI: ${obj.mmsi} | IMO: ${obj.imo || 'N/A'}` : `ICAO24: ${obj.icao24} | Reg: ${obj.registration || 'N/A'}`}
            </div>
          </div>
          <button class="btn btn-icon-only close-drawer-btn">✕</button>
        </div>

        <div class="drawer-body" style="padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:16px;">
          
          <!-- Identity & Navigation Box -->
          <div class="card" style="padding:12px;">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">
              NAVIGATION TELEMETRY
            </div>
            <div class="grid-2" style="font-size:11.5px; gap:8px;">
              <div><span style="color:var(--text-muted);">Coordinates:</span> <strong>${obj.latitude.toFixed(3)}° S, ${obj.longitude.toFixed(3)}° E</strong></div>
              <div><span style="color:var(--text-muted);">Speed:</span> <strong>${isVessel ? `${obj.speedKnots} kn` : `${obj.velocity} kt`}</strong></div>
              <div><span style="color:var(--text-muted);">Heading / Course:</span> <strong>${obj.heading || obj.course}°</strong></div>
              <div><span style="color:var(--text-muted);">${isVessel ? 'Flag:' : 'Altitude:'}</span> <strong>${isVessel ? (obj.flag || 'India') : `${obj.altitude} ft`}</strong></div>
              <div style="grid-column: span 2;"><span style="color:var(--text-muted);">Status:</span> <strong>${obj.navigationStatus || 'Enroute Under Air Vector'}</strong></div>
            </div>
          </div>

          <!-- Voyage Progression Box -->
          <div class="card" style="padding:12px;">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">
              VOYAGE PROGRESSION
            </div>
            <div style="display:flex; flex-direction:column; gap:6px; font-size:11.5px;">
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--text-muted);">Departure Port:</span>
                <strong>${obj.departurePort || obj.origin || 'Cape Town'}</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--text-muted);">Destination:</span>
                <strong style="color:var(--accent-cyan);">${obj.destination}</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--text-muted);">Estimated Arrival:</span>
                <strong>${obj.eta || 'Calculating...'}</strong>
              </div>
            </div>
          </div>

          <!-- Associated Logistics Cargo Manifest -->
          ${shipment ? `
            <div class="card" style="padding:12px; border-left:3px solid var(--accent-cyan);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:11px; font-weight:700; color:var(--accent-cyan); text-transform:uppercase;">
                  LINKED SHIPMENT: ${shipment.shipmentId}
                </span>
                <span class="badge ${shipment.priority === 'CRITICAL' ? 'badge-danger' : 'badge-warning'}" style="font-size:8.5px;">
                  ${shipment.priority}
                </span>
              </div>
              <div style="font-weight:700; font-size:12.5px; color:#ffffff; margin-bottom:4px;">${shipment.title}</div>
              <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">Category: ${shipment.category}</div>
              
              <div style="background:rgba(0,0,0,0.25); padding:8px; border-radius:4px; font-size:11px;">
                <div style="font-weight:600; color:var(--text-secondary); margin-bottom:4px;">Manifest Items:</div>
                <ul style="padding-left:16px; margin:0; color:#e2e8f0;">
                  ${shipment.items.map(it => `<li>${it.name}: <strong>${it.quantity} ${it.unit}</strong></li>`).join('')}
                </ul>
              </div>
            </div>
          ` : `
            <div class="card" style="padding:12px; font-size:11.5px; color:var(--text-muted);">
              No dedicated cargo manifest assigned to this transit.
            </div>
          `}

          <!-- Data Provenance -->
          <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:4px; font-size:10.5px; color:var(--text-muted);">
            <div>Data Source: <strong style="color:#ffffff;">${obj.dataSource}</strong></div>
            <div>Signal Freshness: <strong style="color:#22c55e;">${obj.lastUpdated}</strong></div>
            <div>Audit Trail: Verified via Antarctic Logistics Operations Subsystem</div>
          </div>

          <!-- Actions -->
          <div style="display:flex; gap:8px; margin-top:auto;">
            <button class="btn btn-primary btn-sm btn-focus-on-map" style="flex:1; justify-content:center;">
              CENTER ON MAP
            </button>
            <button class="btn btn-secondary btn-sm btn-goto-logistics-page" style="flex:1; justify-content:center;">
              LOGISTICS MODULE
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Initialize and synchronize Leaflet Map
  function setupMap() {
    setTimeout(() => {
      const mapContainer = container.querySelector('#polar-live-map-container');
      if (!mapContainer) return;

      if (!mapEngine) {
        mapEngine = new PolarMapEngine('polar-live-map-container');
        mapEngine.initialize('GLOBAL');
      }

      // Add permanent stations and gateways
      mapEngine.addStationMarkers(state.stations, (st) => {
        mapEngine.flyTo(st.latitude, st.longitude, 7);
      });

      mapEngine.addPortMarkers(state.gateways, (pt) => {
        mapEngine.flyTo(pt.latitude, pt.longitude, 7);
      });

      // Update vessels and aircraft
      updateMapLayers();
    }, 50);
  }

  function updateMapLayers() {
    if (!mapEngine) return;

    if (layers.vessels) {
      mapEngine.updateVessels(state.vessels, selectedMmsi, (v) => {
        selectedMmsi = v.mmsi;
        selectedIcao = null;
        drawerMode = 'VESSEL';
        isDrawerOpen = true;
        render();
      });
    } else {
      mapEngine.updateVessels([], null);
    }

    if (layers.aircraft) {
      mapEngine.updateAircraft(state.aircraft, selectedIcao, (a) => {
        selectedIcao = a.icao24;
        selectedMmsi = null;
        drawerMode = 'AIRCRAFT';
        isDrawerOpen = true;
        render();
      });
    } else {
      mapEngine.updateAircraft([], null);
    }

    if (layers.plannedRoutes || layers.actualTracks) {
      const visibleRoutes = state.routes.filter(r => {
        if (r.type === 'PLANNED' && !layers.plannedRoutes) return false;
        if (r.type === 'ACTUAL' && !layers.actualTracks) return false;
        return true;
      });
      mapEngine.addCorridorRoutes(visibleRoutes);
    } else {
      mapEngine.addCorridorRoutes([]);
    }
  }

  // Bind DOM Event Handlers
  function attachHandlers() {
    // 1. Basemap tile buttons
    container.querySelectorAll('.tile-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTileLayer = btn.dataset.layer;
        if (mapEngine) mapEngine.setTileLayer(activeTileLayer);
        container.querySelectorAll('.tile-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Nautical toggle
    const nauticalBtn = container.querySelector('.nautical-toggle-btn');
    if (nauticalBtn) {
      nauticalBtn.addEventListener('click', () => {
        isNauticalEnabled = !isNauticalEnabled;
        if (mapEngine) mapEngine.toggleNauticalOverlay(isNauticalEnabled);
        nauticalBtn.classList.toggle('active', isNauticalEnabled);
      });
    }

    // 2. Viewport preset buttons
    container.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        if (mapEngine) mapEngine.setViewport(preset);
      });
    });

    // 3. Search input
    const searchInput = container.querySelector('#tracking-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
      });
    }

    // 4. Shipment category filter buttons
    container.querySelectorAll('.cat-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeShipmentCategory = btn.dataset.cat;
        render();
      });
    });

    // 5. Select vessel from left list
    container.querySelectorAll('.fleet-item-row').forEach(row => {
      row.addEventListener('click', () => {
        const mmsi = row.dataset.mmsi;
        selectedMmsi = mmsi;
        selectedIcao = null;
        drawerMode = 'VESSEL';
        isDrawerOpen = true;
        const v = trackingService.getVesselByMmsi(mmsi);
        if (v && mapEngine) {
          mapEngine.flyTo(v.latitude, v.longitude, 6);
        }
        render();
      });
    });

    // 6. Select aircraft from left list
    container.querySelectorAll('.air-item-row').forEach(row => {
      row.addEventListener('click', () => {
        const icao = row.dataset.icao;
        selectedIcao = icao;
        selectedMmsi = null;
        drawerMode = 'AIRCRAFT';
        isDrawerOpen = true;
        const a = trackingService.getAircraftByIcao(icao);
        if (a && mapEngine) {
          mapEngine.flyTo(a.latitude, a.longitude, 6);
        }
        render();
      });
    });

    // 7. Click Shipment to Locate Carrier
    container.querySelectorAll('.btn-focus-carrier, .shipment-record-card').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const sId = el.dataset.shipmentId;
        selectedShipmentId = sId;
        const carrierInfo = trackingService.findVesselByShipment(sId);
        if (carrierInfo) {
          if (carrierInfo.type === 'VESSEL') {
            selectedMmsi = carrierInfo.object.mmsi;
            selectedIcao = null;
            drawerMode = 'VESSEL';
          } else {
            selectedIcao = carrierInfo.object.icao24;
            selectedMmsi = null;
            drawerMode = 'AIRCRAFT';
          }
          isDrawerOpen = true;
          if (mapEngine) {
            mapEngine.flyTo(carrierInfo.object.latitude, carrierInfo.object.longitude, 6);
          }
        }
        render();
      });
    });

    // 8. Alerts click
    container.querySelectorAll('.alert-item-box').forEach(box => {
      box.addEventListener('click', () => {
        const mmsi = box.dataset.vesselMmsi;
        const icao = box.dataset.aircraftIcao;
        if (mmsi) {
          selectedMmsi = mmsi;
          selectedIcao = null;
          drawerMode = 'VESSEL';
          isDrawerOpen = true;
          const v = trackingService.getVesselByMmsi(mmsi);
          if (v && mapEngine) mapEngine.flyTo(v.latitude, v.longitude, 6);
        } else if (icao) {
          selectedIcao = icao;
          selectedMmsi = null;
          drawerMode = 'AIRCRAFT';
          isDrawerOpen = true;
          const a = trackingService.getAircraftByIcao(icao);
          if (a && mapEngine) mapEngine.flyTo(a.latitude, a.longitude, 6);
        }
        render();
      });
    });

    // 9. Layer toggles
    const layerBindings = [
      { id: 'chk-vessels', key: 'vessels' },
      { id: 'chk-aircraft', key: 'aircraft' },
      { id: 'chk-stations', key: 'stations' },
      { id: 'chk-gateways', key: 'gateways' },
      { id: 'chk-plannedRoutes', key: 'plannedRoutes' },
      { id: 'chk-actualTracks', key: 'actualTracks' },
      { id: 'chk-nauticalMarks', key: 'nauticalMarks' }
    ];

    layerBindings.forEach(b => {
      const chk = container.querySelector(`#${b.id}`);
      if (chk) {
        chk.addEventListener('change', (e) => {
          layers[b.key] = e.target.checked;
          if (b.key === 'nauticalMarks') {
            isNauticalEnabled = e.target.checked;
            if (mapEngine) mapEngine.toggleNauticalOverlay(isNauticalEnabled);
          } else {
            updateMapLayers();
          }
        });
      }
    });

    // 10. Drawer Close & Action buttons
    const closeBtn = container.querySelector('.close-drawer-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        isDrawerOpen = false;
        render();
      });
    }

    const centerCamBtn = container.querySelector('.btn-focus-on-map');
    if (centerCamBtn) {
      centerCamBtn.addEventListener('click', () => {
        const target = drawerMode === 'VESSEL' 
          ? trackingService.getVesselByMmsi(selectedMmsi)
          : trackingService.getAircraftByIcao(selectedIcao);
        if (target && mapEngine) {
          mapEngine.flyTo(target.latitude, target.longitude, 7);
        }
      });
    }

    const gotoLogisticsBtn = container.querySelector('.btn-goto-logistics-page');
    if (gotoLogisticsBtn) {
      gotoLogisticsBtn.addEventListener('click', () => {
        if (onNavigate) onNavigate('logistics');
        else window.location.hash = '#logistics';
      });
    }

    // 11. Timeline mode buttons
    container.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        timeMode = btn.dataset.time;
        render();
      });
    });
  }

  function render() {
    container.innerHTML = buildHTML();
    setupMap();
    attachHandlers();
  }

  // Initial mount
  render();

  // Subscribe to live position updates from WebSocket
  const unsubscribe = trackingService.subscribe(() => {
    state = trackingService.getState();
    // Update live coordinates on map without re-rendering the whole page
    if (mapEngine) {
      updateMapLayers();
    }
  });

  return container;
}
