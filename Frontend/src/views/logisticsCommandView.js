// Antarctic Logistics Command Center — Native Single-Page Application View
// Instrument-grade operations interface for maritime resupply vessels, emergency polar air cargo, and station inventory pipelines

import '../pages/LogisticsCommandCenter/logisticsCommand.css';
import {
  COMMAND_CENTER_METADATA,
  TRACKED_VESSELS,
  EMERGENCY_AIR_MISSIONS,
  EMERGENCY_DECISION_ENGINE_DATA,
  INVENTORY_SUPPLY_GAP_CORRELATION,
  GEOSPATIAL_ROUTE_WAYPOINTS,
  LOGISTICS_COMMAND_KPIS,
  RECENT_LOGISTICS_COMMAND_ACTIVITY
} from '../pages/LogisticsCommandCenter/data/logisticsCommandData.js';

export function renderLogisticsCommandView(telemetryEngine, authService, onNavigate) {
  const container = document.createElement('div');
  container.className = 'content-body logistics-command-view-root';

  // ── Local Interactive State ──
  let selectedFleetTab = 'all'; // 'all', 'vessels', 'air_cargo', 'emergency'
  let selectedVesselId = 'VES-ANT-01'; // Default active vessel
  let selectedAirMissionId = 'AIR-EMG-2026-018';
  let emergencyModalOpen = false;

  // Mutable working datasets for real-time reactivity
  let workingVessels = [...TRACKED_VESSELS];
  let workingAirMissions = [...EMERGENCY_AIR_MISSIONS];
  let workingGaps = [...INVENTORY_SUPPLY_GAP_CORRELATION];

  // ── Scoped Toast Notification ──
  function showToast(message, type = 'success') {
    let toastContainer = container.querySelector('#log-cmd-view-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'log-cmd-view-toast-container';
      toastContainer.className = 'log-cmd-toast-container';
      container.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `log-cmd-toast ${type}`;
    const icon = type === 'success' 
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>'
      : type === 'warning' 
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
      : type === 'error'
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>';
    toast.innerHTML = `<span style="display:inline-flex; align-items:center;">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 260);
    }, 3200);
  }

  function selectVessel(vesselId) {
    selectedVesselId = vesselId;
    renderContent();
    const v = workingVessels.find(item => item.id === vesselId);
    if (v) showToast(`Selected ${v.name}: ${v.progressPercent}% to ${v.destination}`);
  }

  function inspectAirMission(missionId) {
    selectedAirMissionId = missionId;
    const m = workingAirMissions.find(item => item.missionId === missionId);
    if (m) showToast(`Air Mission ${m.flightNumber}: Altitude FL${m.altitudeFt / 100}, ETA ${m.etaHoursRemaining}h`, 'warning');
  }

  function openEmergencyModal() {
    emergencyModalOpen = true;
    const modal = container.querySelector('#log-cmd-emergency-modal');
    if (modal) modal.classList.add('open');
  }

  function closeEmergencyModal() {
    emergencyModalOpen = false;
    const modal = container.querySelector('#log-cmd-emergency-modal');
    if (modal) modal.classList.remove('open');
  }

  function submitEmergencyRequest() {
    const station = container.querySelector('#emg-target-station')?.value || 'Bharati Station';
    const item = container.querySelector('#emg-item-name')?.value || 'Generator Control Spares';
    const qty = container.querySelector('#emg-item-qty')?.value || '2';

    closeEmergencyModal();
    showToast(`Emergency Request Authorized: Air Flight AF-IND-04 manifesting ${qty}x ${item} for ${station}.`, 'success');

    if (workingGaps.length > 0) {
      workingGaps[0].gapStatusLabel = 'Flight AF-IND-04 En Route';
    }
    renderContent();
  }

  function exportManifest(vesselId) {
    const v = workingVessels.find(item => item.id === vesselId) || workingVessels[0];
    showToast(`Exporting cold-chain customs manifest for ${v.name}...`, 'success');
  }

  // ── Main Render Routine ──
  function renderContent() {
    container.innerHTML = '';

    // 1. Page Title Bar with Breadcrumb and Integrated Tab Controls
    const pageTitleBar = document.createElement('div');
    pageTitleBar.className = 'page-title-bar';
    pageTitleBar.innerHTML = `
      <div>
        <div class="breadcrumbs" style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 4px;">
          <span style="cursor: pointer; color: var(--accent-signal);" id="breadcrumb-logistics-link">LOGISTICS &amp; RESUPPLY</span>
          <span style="color: var(--text-dim);">/</span>
          <span style="color: var(--text-primary); font-weight: 600;">LOGISTICS COMMAND CENTER</span>
        </div>
        <h1 class="page-heading" style="margin: 0; font-size: 20px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.3px;">
          Antarctic Logistics Command Center
        </h1>
        <p class="page-subheading" style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-secondary);">
          Real-time tracking of maritime resupply vessels, emergency polar air cargo, and station inventory pipelines.
        </p>
      </div>
      <div class="page-actions" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <!-- Fleet Filtering Tabs -->
        <div class="log-cmd-tabs">
          <button class="log-cmd-tab ${selectedFleetTab === 'all' ? 'active' : ''}" data-tab="all">All Fleets</button>
          <button class="log-cmd-tab ${selectedFleetTab === 'vessels' ? 'active' : ''}" data-tab="vessels">Sea Vessels (4)</button>
          <button class="log-cmd-tab ${selectedFleetTab === 'air_cargo' ? 'active' : ''}" data-tab="air_cargo">Air Cargo (2)</button>
          <button class="log-cmd-tab ${selectedFleetTab === 'emergency' ? 'active' : ''}" data-tab="emergency">Emergency (1)</button>
        </div>

        <div class="log-cmd-sync-pill" title="Synchronized with Iridium & AIS Constellation">
          <span class="log-cmd-sync-dot"></span>
          <span style="font-family: var(--font-mono); font-size: 11px;">SAT-NET 30s</span>
        </div>

        <button class="btn btn-danger btn-sm" id="btn-open-emergency-modal" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          + Emergency Air Cargo
        </button>
      </div>
    `;
    container.appendChild(pageTitleBar);

    // 2. Main Content Wrapper
    const content = document.createElement('div');
    content.className = 'log-cmd-content';
    content.style.padding = '0';
    content.style.marginTop = '16px';

    // 2.1 Emergency Operations Command Banner
    content.appendChild(buildEmergencyCommandWidget());

    // 2.2 Operations KPIs Overview
    content.appendChild(buildKPIOverview());

    // 2.3 Interactive Dual Route Map (Sea & Air)
    content.appendChild(buildInteractiveMapSection());

    // 2.4 Live Vessel Tracking & Itemized Cargo Manifest Grid (2:1)
    const vesselGrid = document.createElement('div');
    vesselGrid.className = 'log-cmd-grid-2-1';
    vesselGrid.appendChild(buildVesselTrackingSection());
    vesselGrid.appendChild(buildCargoManifestSection());
    content.appendChild(vesselGrid);

    // 2.5 Emergency Polar Air Missions & Process Flow
    content.appendChild(buildEmergencyAirMissionsSection());

    // 2.6 Inventory Supply Gap & Digital Twin Recovery Grid (1:1)
    const twinGrid = document.createElement('div');
    twinGrid.className = 'log-cmd-grid-2';
    twinGrid.appendChild(buildSupplyGapDigitalTwinSection());
    twinGrid.appendChild(buildDecisionSupportSection());
    content.appendChild(twinGrid);

    // 2.7 Recent Activity Timeline
    content.appendChild(buildRecentActivitySection());

    container.appendChild(content);

    // 3. Emergency Request Modal
    container.appendChild(buildEmergencyRequestModal());

    // Attach Event Handlers
    attachEventHandlers();
  }

  // ── Section 1: Emergency Command Banner ──
  function buildEmergencyCommandWidget() {
    const card = document.createElement('div');
    card.className = 'log-cmd-emergency-banner';
    const dec = EMERGENCY_DECISION_ENGINE_DATA;

    card.innerHTML = `
      <div class="log-cmd-emergency-header">
        <div class="log-cmd-emergency-title" style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; color: #ffffff;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ACTIVE EMERGENCY LOGISTICS MISSION // BHARATI STATION
        </div>
        <span class="log-cmd-badge-live" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: rgba(239, 68, 68, 0.4);">
          PRIORITY: CRITICAL (LEVEL-1)
        </span>
      </div>
      <div class="log-cmd-emergency-grid">
        <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">
          <strong style="color: #ffffff;">Incident:</strong> ${dec.incidentSummary}
          <div style="margin-top: 4px; color: #fca5a5;">
            <strong>Critical Spare Status:</strong> 0 Units in Stock | Normal Sea Vessel (MV Antarctic Support) ETA: <strong>10 Days</strong> (Exceeds 3-day safe reserve threshold).
          </div>
        </div>

        <div style="background: rgba(0, 0, 0, 0.35); padding: 10px 14px; border-radius: 8px; font-size: 11px; border: 1px solid rgba(255, 255, 255, 0.06);">
          <div style="color: var(--log-text-muted); text-transform: uppercase; font-weight: 700;">Active Air Resupply</div>
          <div style="font-size: 14px; font-weight: 800; color: #10b981; margin: 2px 0;">Flight AF-IND-04 Polar Express</div>
          <div style="color: #cbd5e1;">ETA: <strong>36 Hours</strong> (Landing at Bharati Blue Ice Skiway)</div>
          <div style="color: var(--log-cyan); font-family: var(--log-font-mono); font-size: 10px;">Manifest: 2x Turbo Bearings + Governor Module</div>
        </div>

        <div style="background: rgba(0, 0, 0, 0.35); padding: 10px 14px; border-radius: 8px; font-size: 11px; border: 1px solid rgba(255, 255, 255, 0.06); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="color: var(--log-text-muted); text-transform: uppercase; font-weight: 700;">Digital Twin Recovery</div>
            <div style="color: #ffffff; font-weight: 700; margin-top: 2px;">Station Health Impact</div>
            <div style="color: #f59e0b; font-family: var(--log-font-mono); font-size: 12px;">74% (Degraded) → 98% (Post-Delivery)</div>
          </div>
          <button class="log-cmd-btn-emergency btn-inspect-flight" data-flight-id="AIR-EMG-2026-018" style="padding: 4px 10px; font-size: 10px; margin-top: 6px; justify-content: center;">
            View Emergency Flight Radar ↗
          </button>
        </div>
      </div>
    `;
    return card;
  }

  // ── Section 2: KPIs ──
  function buildKPIOverview() {
    const sec = document.createElement('div');
    const k = LOGISTICS_COMMAND_KPIS;

    sec.innerHTML = `
      <div class="log-cmd-grid-6">
        <div class="log-cmd-card" style="padding: 14px; text-align: center;">
          <div style="font-size: 10px; color: var(--log-cyan); font-weight: 700; text-transform: uppercase;">VESSELS AT SEA</div>
          <div style="font-size: 22px; font-weight: 900; color: #ffffff; font-family: var(--log-font-mono); margin-top: 4px;">${k.vesselsAtSea} Active</div>
          <div style="font-size: 10px; color: var(--log-text-dim);">3 In Transit // 1 Storm Delayed</div>
        </div>

        <div class="log-cmd-card" style="padding: 14px; text-align: center;">
          <div style="font-size: 10px; color: #38bdf8; font-weight: 700; text-transform: uppercase;">AIR MISSIONS</div>
          <div style="font-size: 22px; font-weight: 900; color: #38bdf8; font-family: var(--log-font-mono); margin-top: 4px;">${k.activeAirCargoFlights} Flights</div>
          <div style="font-size: 10px; color: var(--log-text-dim);">1 In Flight // 1 Pre-Flight</div>
        </div>

        <div class="log-cmd-card" style="padding: 14px; text-align: center;">
          <div style="font-size: 10px; color: #f59e0b; font-weight: 700; text-transform: uppercase;">FUEL IN TRANSIT</div>
          <div style="font-size: 22px; font-weight: 900; color: #f59e0b; font-family: var(--log-font-mono); margin-top: 4px;">125,000 L</div>
          <div style="font-size: 10px; color: var(--log-text-dim);">Polar Kerosene & Diesel</div>
        </div>

        <div class="log-cmd-card" style="padding: 14px; text-align: center;">
          <div style="font-size: 10px; color: #ffffff; font-weight: 700; text-transform: uppercase;">TOTAL CARGO TONNAGE</div>
          <div style="font-size: 22px; font-weight: 900; color: #ffffff; font-family: var(--log-font-mono); margin-top: 4px;">233.5 T</div>
          <div style="font-size: 10px; color: var(--log-text-dim);">Provisions, Spares & Pods</div>
        </div>

        <div class="log-cmd-card" style="padding: 14px; text-align: center;">
          <div style="font-size: 10px; color: #10b981; font-weight: 700; text-transform: uppercase;">ETA ACCURACY</div>
          <div style="font-size: 22px; font-weight: 900; color: #10b981; font-family: var(--log-font-mono); margin-top: 4px;">${k.averageETAAccuracy}</div>
          <div style="font-size: 10px; color: var(--log-text-dim);">Sea Ice & Weather Adjusted</div>
        </div>

        <div class="log-cmd-card" style="padding: 14px; text-align: center;">
          <div style="font-size: 10px; color: #c084fc; font-weight: 700; text-transform: uppercase;">EMERGENCY SLA</div>
          <div style="font-size: 22px; font-weight: 900; color: #c084fc; font-family: var(--log-font-mono); margin-top: 4px;">100%</div>
          <div style="font-size: 10px; color: var(--log-text-dim);">36h Delivery vs 48h Window</div>
        </div>
      </div>
    `;
    return sec;
  }

  // ── Section 3: Interactive Geospatial Radar Map ──
  function buildInteractiveMapSection() {
    const card = document.createElement('div');
    card.className = 'log-cmd-card';

    card.innerHTML = `
      <div class="log-cmd-card-header">
        <div>
          <div class="log-cmd-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            Antarctic Maritime &amp; Polar Aviation Live Tracking Map
          </div>
          <div class="log-cmd-card-subtitle">Global geospatial coordinates from India &amp; Cape Town Gateways to Maitri &amp; Bharati Stations</div>
        </div>
        <span class="log-cmd-badge-live">AIS + ADS-B RADAR</span>
      </div>

      <div class="log-cmd-map-wrapper">
        <div class="log-cmd-map-grid-lines"></div>
        <div class="log-cmd-map-radar-sweep"></div>

        <!-- India Origin -->
        <div class="log-cmd-map-node" style="top: 10%; right: 28%;" title="Mormugao Port / Goa, India">
          <div class="log-cmd-map-node-icon" style="color: #00f0ff;">📍</div>
          <div class="log-cmd-map-node-label">INDIA (Goa Port)</div>
        </div>

        <!-- Cape Town Gateway -->
        <div class="log-cmd-map-node" style="top: 36%; left: 40%;" title="Cape Town Air & Sea Logistics Gateway">
          <div class="log-cmd-map-node-icon" style="color: #38bdf8;">⚓</div>
          <div class="log-cmd-map-node-label">CAPE TOWN BASE</div>
        </div>

        <!-- Live Vessel: MV Antarctic Support -->
        <div class="log-cmd-map-node btn-select-vessel" data-vessel-id="VES-ANT-01" style="top: 56%; left: 45%; cursor: pointer;" title="MV Antarctic Support (78% Complete, ETA 10d)">
          <div class="log-cmd-map-node-icon" style="color: #10b981; animation: log-pulse 1.5s infinite;">🚢</div>
          <div class="log-cmd-map-node-label" style="border-color: #10b981; color: #10b981;">
            MV ANTARCTIC SUPPORT (15.4 kts // 10d ETA)
          </div>
        </div>

        <!-- Live Vessel: R/V Bharati -->
        <div class="log-cmd-map-node btn-select-vessel" data-vessel-id="VES-ANT-02" style="top: 68%; right: 22%; cursor: pointer;" title="R/V Bharati Polar Explorer (88% Complete, ETA 6d)">
          <div class="log-cmd-map-node-icon" style="color: #10b981;">🚢</div>
          <div class="log-cmd-map-node-label" style="border-color: #10b981;">
            R/V BHARATI (Prydz Bay // 6d ETA)
          </div>
        </div>

        <!-- Live Vessel: MV Maitri Resupply (Delayed in storm) -->
        <div class="log-cmd-map-node btn-select-vessel" data-vessel-id="VES-ANT-03" style="top: 48%; left: 32%; cursor: pointer;" title="MV Maitri Resupply (Delayed in storm front)">
          <div class="log-cmd-map-node-icon" style="color: #f59e0b;">🚢</div>
          <div class="log-cmd-map-node-label" style="border-color: #f59e0b; color: #f59e0b;">
            MV MAITRI (Delayed Gale // 15d ETA)
          </div>
        </div>

        <!-- Emergency Air Cargo Flight AF-IND-04 -->
        <div class="log-cmd-map-node btn-inspect-flight" data-flight-id="AIR-EMG-2026-018" style="top: 74%; right: 30%; cursor: pointer;" title="Flight AF-IND-04 (Emergency Generator Spares)">
          <div class="log-cmd-map-node-icon" style="color: #ef4444; animation: log-pulse 1s infinite;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
          </div>
          <div class="log-cmd-map-node-label" style="background: rgba(239, 68, 68, 0.9); border-color: #ffffff; color: #ffffff;">
            FLIGHT AF-IND-04 (ETA 36h // CRITICAL)
          </div>
        </div>

        <!-- Destination: Maitri Station -->
        <div class="log-cmd-map-node" style="bottom: 8%; left: 36%;" title="Maitri Station (Schirmacher Oasis)">
          <div class="log-cmd-map-node-icon" style="color: #00f0ff;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#00f0ff"><polygon points="12 2 22 22 2 22"/></svg>
          </div>
          <div class="log-cmd-map-node-label">MAITRI STATION (70°S 11°E)</div>
        </div>

        <!-- Destination: Bharati Station -->
        <div class="log-cmd-map-node" style="bottom: 8%; right: 26%;" title="Bharati Station (Larsemann Hills)">
          <div class="log-cmd-map-node-icon" style="color: #00f0ff;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#00f0ff"><polygon points="12 2 22 22 2 22"/></svg>
          </div>
          <div class="log-cmd-map-node-label">BHARATI STATION (69°S 76°E)</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--log-text-dim); margin-top: 10px; font-family: var(--log-font-mono);">
        <span>LEGEND: Sea Logistics • Emergency Air Missions • Antarctic Station Bases • Continental Gateways</span>
        <span>COORDINATES REFRESH: Real-time AIS / ADS-B Polar Downlink</span>
      </div>
    `;
    return card;
  }

  // ── Section 4: Live Vessel Tracking ──
  function buildVesselTrackingSection() {
    const card = document.createElement('div');
    card.className = 'log-cmd-card';

    let displayVessels = workingVessels;
    if (selectedFleetTab === 'emergency') {
      displayVessels = workingVessels.filter(v => v.status === 'DELAYED' || v.id === 'VES-ANT-01');
    } else if (selectedFleetTab === 'air_cargo') {
      displayVessels = [];
    }

    const vesselCardsHTML = displayVessels.length > 0 ? displayVessels.map(v => {
      const isSelected = v.id === selectedVesselId;
      return `
        <div class="log-cmd-vessel-card ${isSelected ? 'active' : ''} btn-select-vessel" data-vessel-id="${v.id}" style="cursor: pointer;">
          <div class="log-cmd-vessel-header">
            <div>
              <div class="log-cmd-vessel-name">
                <span>🚢 ${v.name}</span>
                <span style="font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; ${v.status === 'IN_TRANSIT' ? 'background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);' : 'background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);'}">
                  ● ${v.statusLabel}
                </span>
              </div>
              <div class="log-cmd-vessel-route">Route: ${v.route}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 13px; font-weight: 800; color: #ffffff; font-family: var(--log-font-mono);">ETA ${v.etaDays} Days</div>
              <div style="font-size: 10px; color: var(--log-text-dim);">${v.expectedArrival}</div>
            </div>
          </div>

          <div class="log-cmd-progress-container">
            <div class="log-cmd-progress-bar-track">
              <div class="log-cmd-progress-bar-fill" style="width: ${v.progressPercent}%;"></div>
            </div>
            <div class="log-cmd-progress-text">
              <span>Progress: ${v.progressPercent}% Completed</span>
              <span>Remaining: ${v.distanceRemainingKm.toLocaleString()} km</span>
            </div>
          </div>

          <div class="log-cmd-vessel-specs-grid">
            <div><strong>Location:</strong> ${v.currentLocationName}</div>
            <div><strong>Speed:</strong> ${v.speedKnots} kts (${v.headingDeg}°)</div>
            <div><strong>Sea Ice:</strong> ${v.seaIceConcentration}</div>
          </div>
        </div>
      `;
    }).join('') : `
      <div style="padding: 24px; text-align: center; color: var(--log-text-muted); font-size: 12px;">
        No sea vessels match the active filter criteria.
      </div>
    `;

    card.innerHTML = `
      <div class="log-cmd-card-header">
        <div>
          <div class="log-cmd-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16z"/></svg>
            Active Antarctic Maritime Resupply Fleet
          </div>
          <div class="log-cmd-card-subtitle">Select any vessel to inspect live telemetry and itemized cargo manifests</div>
        </div>
        <span class="log-cmd-badge-live">${workingVessels.length} VESSELS TRACKED</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${vesselCardsHTML}
      </div>
    `;
    return card;
  }

  // ── Section 5: Itemized Cargo Manifest ──
  function buildCargoManifestSection() {
    const card = document.createElement('div');
    card.className = 'log-cmd-card';

    const vessel = workingVessels.find(v => v.id === selectedVesselId) || workingVessels[0];

    const manifestRows = vessel.cargoManifest.map(m => `
      <tr>
        <td><span style="font-size: 13px; margin-right: 4px;">${m.icon}</span><strong>${m.category}</strong></td>
        <td>${m.item}</td>
        <td><strong>${m.qty}</strong></td>
        <td>${m.weightKg.toLocaleString()} kg</td>
        <td>
          <span style="padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; ${m.priority === 'CRITICAL' ? 'background: rgba(239, 68, 68, 0.2); color: #ef4444;' : m.priority === 'HIGH' ? 'background: rgba(245, 158, 11, 0.2); color: #f59e0b;' : 'background: rgba(56, 189, 248, 0.2); color: #38bdf8;'}">
            ${m.priority}
          </span>
        </td>
        <td style="font-size: 10px; color: var(--log-text-muted);">${m.storageClass}</td>
      </tr>
    `).join('');

    card.innerHTML = `
      <div class="log-cmd-card-header">
        <div>
          <div class="log-cmd-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Cargo Manifest // ${vessel.name}
          </div>
          <div class="log-cmd-card-subtitle">Destination: ${vessel.destination} | Total Payload: ${vessel.totalCargoWeightKg.toLocaleString()} kg</div>
        </div>
        <span class="log-cmd-badge-live">${vessel.cargoManifest.length} CATEGORIES</span>
      </div>

      <div style="background: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.15); padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-size: 11px;">
        <strong>Cargo Summary:</strong> ${vessel.cargoSummary}
      </div>

      <div style="overflow-x: auto;">
        <table class="log-cmd-manifest-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Item Description</th>
              <th>Quantity</th>
              <th>Weight</th>
              <th>Priority</th>
              <th>Hold</th>
            </tr>
          </thead>
          <tbody>
            ${manifestRows}
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; font-size: 11px; color: var(--log-text-muted);">
        <span>Master Captain: <strong>${vessel.captain}</strong></span>
        <button class="btn btn-secondary btn-sm btn-export-manifest" data-vessel-id="${vessel.id}">
          📥 Export Manifest PDF
        </button>
      </div>
    `;
    return card;
  }

  // ── Section 6: Emergency Polar Air Missions ──
  function buildEmergencyAirMissionsSection() {
    const card = document.createElement('div');
    card.className = 'log-cmd-card';

    const airCardsHTML = workingAirMissions.map(m => `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-left: 4px solid ${m.priorityColor}; padding: 14px; border-radius: 10px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 8px;">
              <span style="display:inline-flex; align-items:center; gap:5px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                <span>${m.flightNumber}</span>
              </span>
              <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: rgba(239, 68, 68, 0.2); color: ${m.priorityColor};">
                ${m.priority}
              </span>
            </div>
            <div style="font-size: 11px; color: var(--log-cyan); font-family: var(--log-font-mono); margin-top: 2px;">
              ${m.aircraftType} // Tail: ${m.tailNumber} // PIC: ${m.pilotInCommand}
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: rgba(16, 185, 129, 0.15); color: ${m.statusColor};">
              ● ${m.statusLabel}
            </span>
            <div style="font-size: 12px; font-weight: 800; color: #ffffff; font-family: var(--log-font-mono); margin-top: 4px;">
              ETA: ${m.etaHoursRemaining} Hours
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 11px; background: rgba(0, 0, 0, 0.25); padding: 8px 10px; border-radius: 6px;">
          <div><strong>Origin:</strong> ${m.origin}</div>
          <div><strong>Destination:</strong> ${m.destination}</div>
          <div><strong>Altitude:</strong> FL${m.altitudeFt / 100} (${m.groundSpeedKnots} kts)</div>
        </div>

        <div style="font-size: 11px; color: #cbd5e1;">
          <strong>Emergency Payload Items:</strong>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
            ${m.cargoManifest.map(c => `
              <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 3px 8px; border-radius: 4px; font-size: 10px; color: ${c.critical ? '#fca5a5' : '#ffffff'};">
                ${c.icon} ${c.item} (×${c.qty})
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="log-cmd-card-header">
        <div>
          <div class="log-cmd-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Emergency Polar Air Cargo Rapid Dispatches
          </div>
          <div class="log-cmd-card-subtitle">Dedicated ski-equipped aircraft missions bypassing sea ice obstacles</div>
        </div>
        <span class="log-cmd-badge-live">${workingAirMissions.length} ACTIVE AIR MISSIONS</span>
      </div>

      <!-- Lifecycle Pipeline -->
      <div class="log-cmd-lifecycle-pipeline" style="margin-bottom: 14px;">
        <div class="log-cmd-lifecycle-step">
          <div class="log-cmd-lifecycle-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div style="font-size: 10px; font-weight: 700; color: #ffffff; margin-top: 4px;">Incident Detected</div>
          <div style="font-size: 9px; color: var(--log-text-dim);">Generator 02 Bearing</div>
        </div>
        <div class="log-cmd-lifecycle-arrow">➔</div>
        <div class="log-cmd-lifecycle-step">
          <div class="log-cmd-lifecycle-icon" style="border-color: #ef4444; color: #ef4444;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <div style="font-size: 10px; font-weight: 700; color: #ffffff; margin-top: 4px;">Manifest Locked</div>
          <div style="font-size: 9px; color: var(--log-text-dim);">EC-2026-018 (185 kg)</div>
        </div>
        <div class="log-cmd-lifecycle-arrow">➔</div>
        <div class="log-cmd-lifecycle-step">
          <div class="log-cmd-lifecycle-icon" style="background: rgba(16,185,129,0.15); color: #10b981;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
          </div>
          <div style="font-size: 10px; font-weight: 700; color: #10b981; margin-top: 4px;">In Flight Radar</div>
          <div style="font-size: 9px; color: var(--log-text-dim);">FL145 Approaching Base</div>
        </div>
        <div class="log-cmd-lifecycle-arrow">➔</div>
        <div class="log-cmd-lifecycle-step">
          <div class="log-cmd-lifecycle-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div style="font-size: 10px; font-weight: 700; color: #ffffff; margin-top: 4px;">On-Site Install</div>
          <div style="font-size: 9px; color: var(--log-text-dim);">Maintenance Bay</div>
        </div>
        <div class="log-cmd-lifecycle-arrow">➔</div>
        <div class="log-cmd-lifecycle-step">
          <div class="log-cmd-lifecycle-icon" style="color: #10b981; border-color: #10b981;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div style="font-size: 10px; font-weight: 700; color: #10b981; margin-top: 4px;">Digital Twin 98%</div>
          <div style="font-size: 9px; color: var(--log-text-dim);">Normal Status</div>
        </div>
      </div>

      <div class="log-cmd-grid-2">
        ${airCardsHTML}
      </div>
    `;
    return card;
  }

  // ── Section 7: Inventory Supply Gap & Digital Twin Sync ──
  function buildSupplyGapDigitalTwinSection() {
    const card = document.createElement('div');
    card.className = 'log-cmd-card';

    const rowsHTML = workingGaps.map(g => `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); padding: 12px; border-radius: 8px; font-size: 11px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; color: #ffffff; font-size: 12px;">${g.item}</span>
          <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: rgba(16, 185, 129, 0.15); color: ${g.gapColor};">
            ● ${g.gapStatusLabel}
          </span>
        </div>
        <div style="color: var(--log-text-dim); font-size: 10px; margin-top: 2px;">Station: ${g.station} // Downstream Subsystem: ${g.downstreamSystem}</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 6px; background: rgba(0, 0, 0, 0.25); padding: 6px 8px; border-radius: 4px;">
          <div>Current Stock: <strong style="color: ${g.currentStock === 0 ? '#ef4444' : '#ffffff'};">${g.currentStock} Units</strong></div>
          <div>Sea Resupply: <strong>+${g.seaShipmentIncomingQty} (${g.seaShipmentETA.split('(')[0]})</strong></div>
          <div>Air Cargo: <strong style="color: #10b981;">+${g.emergencyAirIncomingQty} (${g.emergencyAirETA.split('(')[0]})</strong></div>
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="log-cmd-card-header">
        <div>
          <div class="log-cmd-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Inventory Supply Gap &amp; Digital Twin Sync
          </div>
          <div class="log-cmd-card-subtitle">Real-time inventory ledger updates correlated with emergency air delivery</div>
        </div>
        <span class="log-cmd-badge-live">INVENTORY LINK</span>
      </div>
      <div style="display: flex; flex-direction: column;">
        ${rowsHTML}
      </div>
    `;
    return card;
  }

  // ── Section 8: Decision Support Recommendation Engine ──
  function buildDecisionSupportSection() {
    const card = document.createElement('div');
    card.className = 'log-cmd-card';
    const dec = EMERGENCY_DECISION_ENGINE_DATA;

    const factorRows = dec.decisionAnalysis.map(f => `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding: 6px 0; font-size: 11px;">
        <span style="color: var(--log-text-muted);">${f.factor}</span>
        <strong style="color: ${f.color}; font-family: var(--log-font-mono);">${f.value}</strong>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="log-cmd-card-header">
        <div>
          <div class="log-cmd-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Emergency Logistics Decision Support Engine
          </div>
          <div class="log-cmd-card-subtitle">Rule-based analytical assessment for base operations commanders</div>
        </div>
        <span class="log-cmd-badge-live">98% CONFIDENCE</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${factorRows}
      </div>

      <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10b981; padding: 10px 12px; border-radius: 4px; font-size: 11px; margin-top: 10px; line-height: 1.4;">
        <strong style="color: #10b981;">Decision Advisory:</strong> ${dec.aiRecommendation.text}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 10px; color: var(--log-text-dim);">
        <span>Post-Delivery Station Health: <strong style="color: #10b981;">${dec.aiRecommendation.projectedStationHealthAfterFix}</strong></span>
        <span>Stock Projection: <strong style="color: #ffffff;">+${dec.aiRecommendation.projectedStockAfterDelivery} Kits</strong></span>
      </div>
    `;
    return card;
  }

  // ── Section 9: Recent Global Logistics Activity Log ──
  function buildRecentActivitySection() {
    const card = document.createElement('div');
    card.className = 'log-cmd-card';

    const rows = RECENT_LOGISTICS_COMMAND_ACTIVITY.map(a => `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.04); padding: 8px 0; font-size: 11px;">
        <div>
          <div style="color: #ffffff; font-weight: 600;">${a.event}</div>
          <div style="color: var(--log-text-dim); font-size: 10px; margin-top: 2px;">Source: ${a.user} // ${a.type}</div>
        </div>
        <span style="color: var(--log-cyan); font-family: var(--log-font-mono); font-size: 10px;">${a.time}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="log-cmd-card-header">
        <div class="log-cmd-card-title">
          <span>Global Logistics Telemetry Activity Log</span>
        </div>
        <span class="log-cmd-badge-live">IMMUTABLE AUDIT</span>
      </div>
      <div style="display: flex; flex-direction: column;">
        ${rows}
      </div>
    `;
    return card;
  }

  // ── Section 10: Emergency Cargo Request Modal ──
  function buildEmergencyRequestModal() {
    const backdrop = document.createElement('div');
    backdrop.id = 'log-cmd-emergency-modal';
    backdrop.className = `log-cmd-modal-backdrop ${emergencyModalOpen ? 'open' : ''}`;

    const userName = authService?.getUser()?.name || 'Base Commander';

    backdrop.innerHTML = `
      <div class="log-cmd-modal">
        <div class="log-cmd-modal-header">
          <div style="font-size: 14px; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>AUTHORIZE EMERGENCY CARGO REQUEST</span>
          </div>
          <button style="background:transparent; border:none; color:#cbd5e1; font-size:16px; cursor:pointer;" id="btn-close-emergency-modal-x">✕</button>
        </div>
        <div class="log-cmd-modal-body">
          <div class="log-cmd-form-group">
            <label class="log-cmd-form-label">Target Antarctic Station</label>
            <select class="log-cmd-form-select" id="emg-target-station">
              <option value="Bharati Station">Bharati Station (Larsemann Hills)</option>
              <option value="Maitri Station">Maitri Station (Schirmacher Oasis)</option>
            </select>
          </div>

          <div class="log-cmd-form-group">
            <label class="log-cmd-form-label">Critical Required Item</label>
            <input type="text" class="log-cmd-form-input" id="emg-item-name" value="Generator #02 Turbo Bearings & Controller">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="log-cmd-form-group">
              <label class="log-cmd-form-label">Quantity</label>
              <input type="number" class="log-cmd-form-input" id="emg-item-qty" value="2">
            </div>
            <div class="log-cmd-form-group">
              <label class="log-cmd-form-label">Priority Level</label>
              <select class="log-cmd-form-select" id="emg-priority">
                <option value="CRITICAL">🔴 CRITICAL (Within 48h)</option>
                <option value="HIGH">🟡 HIGH (Within 5 Days)</option>
              </select>
            </div>
          </div>

          <div class="log-cmd-form-group">
            <label class="log-cmd-form-label">Operational Failure Reason & Impact</label>
            <textarea class="log-cmd-form-textarea" id="emg-reason" rows="3">Generator failure risk / zero spare parts in station stock. Auxiliary diesel burn accelerating.</textarea>
          </div>

          <div class="log-cmd-form-group">
            <label class="log-cmd-form-label">Authorized Mission Requester</label>
            <input type="text" class="log-cmd-form-input" value="${userName} (Mission Controller) // LOG-002" readonly>
          </div>
        </div>
        <div class="log-cmd-modal-footer">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-emergency-modal">Cancel</button>
          <button class="btn btn-danger btn-sm" id="btn-submit-emergency-request">Authorize &amp; Dispatch Air Mission 🚀</button>
        </div>
      </div>
    `;

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeEmergencyModal();
    });

    return backdrop;
  }

  // ── Event Handlers Attachment ──
  function attachEventHandlers() {
    // Breadcrumb navigation
    const breadcrumbLink = container.querySelector('#breadcrumb-logistics-link');
    if (breadcrumbLink && onNavigate) {
      breadcrumbLink.addEventListener('click', () => onNavigate('logistics'));
    }

    // Filter tabs
    container.querySelectorAll('.log-cmd-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedFleetTab = e.currentTarget.getAttribute('data-tab');
        renderContent();
        showToast(`Filtered by ${selectedFleetTab.toUpperCase()}`);
      });
    });

    // Vessel selection buttons
    container.querySelectorAll('.btn-select-vessel').forEach(el => {
      el.addEventListener('click', () => {
        const vid = el.getAttribute('data-vessel-id');
        if (vid) selectVessel(vid);
      });
    });

    // Flight inspect buttons
    container.querySelectorAll('.btn-inspect-flight').forEach(el => {
      el.addEventListener('click', () => {
        const fid = el.getAttribute('data-flight-id');
        if (fid) inspectAirMission(fid);
      });
    });

    // Manifest export
    container.querySelectorAll('.btn-export-manifest').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vid = btn.getAttribute('data-vessel-id');
        exportManifest(vid);
      });
    });

    // Open Emergency Modal
    const openBtn = container.querySelector('#btn-open-emergency-modal');
    if (openBtn) {
      openBtn.addEventListener('click', () => openEmergencyModal());
    }

    // Close Modal buttons
    const closeX = container.querySelector('#btn-close-emergency-modal-x');
    if (closeX) closeX.addEventListener('click', () => closeEmergencyModal());

    const cancelBtn = container.querySelector('#btn-cancel-emergency-modal');
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeEmergencyModal());

    // Submit Request
    const submitBtn = container.querySelector('#btn-submit-emergency-request');
    if (submitBtn) submitBtn.addEventListener('click', () => submitEmergencyRequest());
  }

  // Initial render
  renderContent();

  return container;
}
