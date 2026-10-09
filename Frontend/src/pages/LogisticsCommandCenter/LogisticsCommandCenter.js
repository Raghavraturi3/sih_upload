// Antarctic Logistics Command Center & Live Vessel/Air Tracking Module
// Standalone operations center for Indian Antarctic Stations (Maitri & Bharati).
// Strictly non-destructive: does not modify or overwrite existing admin dashboard logic.

import './logisticsCommand.css';
import { telemetry } from '../../utils/telemetry.js';
import { initAIAssistant } from '../../features/aiVoiceAssistant/index.js';
import {
  COMMAND_CENTER_METADATA,
  TRACKED_VESSELS,
  EMERGENCY_AIR_MISSIONS,
  EMERGENCY_DECISION_ENGINE_DATA,
  INVENTORY_SUPPLY_GAP_CORRELATION,
  GEOSPATIAL_ROUTE_WAYPOINTS,
  LOGISTICS_COMMAND_KPIS,
  RECENT_LOGISTICS_COMMAND_ACTIVITY
} from './data/logisticsCommandData.js';

// ── State ──
let selectedFleetTab = 'all'; // 'all', 'vessels', 'air_cargo', 'emergency'
let selectedVesselId = 'VES-ANT-01'; // Default selected vessel
let selectedAirMissionId = 'AIR-EMG-2026-018';
let emergencyModalOpen = false;

// Mutable working datasets
let workingVessels = [...TRACKED_VESSELS];
let workingAirMissions = [...EMERGENCY_AIR_MISSIONS];
let workingGaps = [...INVENTORY_SUPPLY_GAP_CORRELATION];

// ── Toast Notification System ──
function showToast(message, type = 'success') {
  let container = document.getElementById('log-cmd-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'log-cmd-toast-container';
    container.className = 'log-cmd-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `log-cmd-toast ${type}`;
  const icon = type === 'success' ? '🚢' : type === 'warning' ? '⚠️' : type === 'error' ? '🚨' : '✈️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}

// ── Mount ──
document.addEventListener('DOMContentLoaded', () => {
  renderPage();
  initAIAssistant({ telemetry });
});

function renderPage() {
  const app = document.getElementById('logistics-command-app');
  if (!app) return;
  app.innerHTML = '';
  app.appendChild(buildTopbar());

  const content = document.createElement('div');
  content.className = 'log-cmd-content';

  // 1. Dedicated Emergency Operations Command Banner
  content.appendChild(buildEmergencyCommandWidget());

  // 2. High-Level Operations KPIs
  content.appendChild(buildKPIOverview());

  // 3. Interactive Dual Route Map (Sea & Air)
  content.appendChild(buildInteractiveMapSection());

  // 4. Live Maritime Vessel Fleet Tracking & Itemized Cargo Manifest
  const vesselGrid = document.createElement('div');
  vesselGrid.className = 'log-cmd-grid-2-1';
  vesselGrid.appendChild(buildVesselTrackingSection());
  vesselGrid.appendChild(buildCargoManifestSection());
  content.appendChild(vesselGrid);

  // 5. Emergency Polar Air Cargo Missions & Lifecycle
  content.appendChild(buildEmergencyAirMissionsSection());

  // 6. Inventory Supply Gap & Digital Twin Infrastructure Recovery
  const twinGrid = document.createElement('div');
  twinGrid.className = 'log-cmd-grid-2';
  twinGrid.appendChild(buildSupplyGapDigitalTwinSection());
  twinGrid.appendChild(buildDecisionSupportSection());
  content.appendChild(twinGrid);

  // 7. Recent Command Activity Timeline
  content.appendChild(buildRecentActivitySection());

  app.appendChild(content);
  app.appendChild(buildEmergencyRequestModal());
}

// ── 1. TOPBAR ──
function buildTopbar() {
  const bar = document.createElement('header');
  bar.className = 'log-cmd-topbar';
  bar.innerHTML = `
    <div class="log-cmd-topbar-left">
      <a href="/logistics-management.html" class="log-cmd-back-link" title="Return to Logistics Inventory">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Logistics Overview
      </a>
      <div class="log-cmd-topbar-title-group">
        <div class="log-cmd-topbar-title">
          Antarctic Logistics Command Center
          <span class="log-cmd-badge-live">AIS SATELLITE & RADAR LIVE</span>
        </div>
        <div class="log-cmd-topbar-subtitle">
          Real-time tracking of maritime resupply vessels, emergency polar air cargo, and station inventory pipelines.
        </div>
      </div>
    </div>
    <div class="log-cmd-topbar-right">
      <div class="log-cmd-tabs">
        <button class="log-cmd-tab ${selectedFleetTab === 'all' ? 'active' : ''}" data-tab="all">All Fleets</button>
        <button class="log-cmd-tab ${selectedFleetTab === 'vessels' ? 'active' : ''}" data-tab="vessels">🚢 Sea Vessels (4)</button>
        <button class="log-cmd-tab ${selectedFleetTab === 'air_cargo' ? 'active' : ''}" data-tab="air_cargo">✈️ Air Cargo (2)</button>
        <button class="log-cmd-tab ${selectedFleetTab === 'emergency' ? 'active' : ''}" data-tab="emergency">🚨 Emergency (1)</button>
      </div>

      <div class="log-cmd-sync-pill" title="Synchronized with Iridium & AIS Constellation">
        <span class="log-cmd-sync-dot"></span>
        <span>SAT-NET Live (30s)</span>
      </div>

      <button class="log-cmd-btn-emergency" id="btn-open-emergency-modal">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        + Emergency Air Cargo Request
      </button>
    </div>
  `;

  setTimeout(() => {
    bar.querySelectorAll('.log-cmd-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedFleetTab = e.currentTarget.getAttribute('data-tab');
        renderPage();
        showToast(`Filtered by ${selectedFleetTab.toUpperCase()}`);
      });
    });

    const openEmgBtn = bar.querySelector('#btn-open-emergency-modal');
    if (openEmgBtn) {
      openEmgBtn.addEventListener('click', () => {
        openEmergencyModal();
      });
    }
  }, 20);

  return bar;
}

// ── 2. DEDICATED EMERGENCY OPERATIONS COMMAND BANNER ──
function buildEmergencyCommandWidget() {
  const card = document.createElement('div');
  card.className = 'log-cmd-emergency-banner';
  const dec = EMERGENCY_DECISION_ENGINE_DATA;

  card.innerHTML = `
    <div class="log-cmd-emergency-header">
      <div class="log-cmd-emergency-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        🚨 ACTIVE EMERGENCY LOGISTICS MISSION // BHARATI STATION
      </div>
      <span class="log-cmd-badge-live" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: rgba(239, 68, 68, 0.4);">
        PRIORITY: CRITICAL (LEVEL-1)
      </span>
    </div>
    <div class="log-cmd-emergency-grid">
      <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">
        <strong style="color: #ffffff;">Incident:</strong> ${dec.incidentSummary}
        <div style="margin-top: 4px; color: #fca5a5;">
          <strong>Critical Spare Status:</strong> 0 Units in Stock | Normal Ship (MV Antarctic Support) ETA: <strong>10 Days</strong> (Exceeds 3-day safe threshold).
        </div>
      </div>

      <div style="background: rgba(0, 0, 0, 0.35); padding: 10px 14px; border-radius: 8px; font-size: 11px; border: 1px solid rgba(255, 255, 255, 0.06);">
        <div style="color: var(--log-text-muted); text-transform: uppercase; font-weight: 700;">✈️ Active Air Resupply</div>
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
        <button class="log-cmd-btn-emergency" style="padding: 4px 10px; font-size: 10px; margin-top: 6px; justify-content: center;" onclick="inspectAirMission('AIR-EMG-2026-018')">
          View Emergency Flight Radar ↗
        </button>
      </div>
    </div>
  `;
  return card;
}

// ── 3. KPI OVERVIEW ──
function buildKPIOverview() {
  const sec = document.createElement('div');
  const k = LOGISTICS_COMMAND_KPIS;

  sec.innerHTML = `
    <div class="log-cmd-grid-6">
      <div class="log-cmd-card" style="padding: 14px; text-align: center;">
        <div style="font-size: 10px; color: var(--log-cyan); font-weight: 700; text-transform: uppercase;">🚢 VESSELS AT SEA</div>
        <div style="font-size: 24px; font-weight: 900; color: #ffffff; font-family: var(--log-font-mono); margin-top: 4px;">${k.vesselsAtSea} Active</div>
        <div style="font-size: 10px; color: var(--log-text-dim);">3 In Transit // 1 Storm Delayed</div>
      </div>

      <div class="log-cmd-card" style="padding: 14px; text-align: center;">
        <div style="font-size: 10px; color: #38bdf8; font-weight: 700; text-transform: uppercase;">✈️ AIR MISSIONS</div>
        <div style="font-size: 24px; font-weight: 900; color: #38bdf8; font-family: var(--log-font-mono); margin-top: 4px;">${k.activeAirCargoFlights} Flights</div>
        <div style="font-size: 10px; color: var(--log-text-dim);">1 In Flight // 1 Pre-Flight</div>
      </div>

      <div class="log-cmd-card" style="padding: 14px; text-align: center;">
        <div style="font-size: 10px; color: #f59e0b; font-weight: 700; text-transform: uppercase;">⛽ FUEL IN TRANSIT</div>
        <div style="font-size: 24px; font-weight: 900; color: #f59e0b; font-family: var(--log-font-mono); margin-top: 4px;">125,000 L</div>
        <div style="font-size: 10px; color: var(--log-text-dim);">Polar Kerosene & Diesel</div>
      </div>

      <div class="log-cmd-card" style="padding: 14px; text-align: center;">
        <div style="font-size: 10px; color: #ffffff; font-weight: 700; text-transform: uppercase;">📦 TOTAL CARGO TONNAGE</div>
        <div style="font-size: 24px; font-weight: 900; color: #ffffff; font-family: var(--log-font-mono); margin-top: 4px;">233.5 T</div>
        <div style="font-size: 10px; color: var(--log-text-dim);">Provisions, Spares & Pods</div>
      </div>

      <div class="log-cmd-card" style="padding: 14px; text-align: center;">
        <div style="font-size: 10px; color: #10b981; font-weight: 700; text-transform: uppercase;">⏱️ ETA ACCURACY</div>
        <div style="font-size: 24px; font-weight: 900; color: #10b981; font-family: var(--log-font-mono); margin-top: 4px;">${k.averageETAAccuracy}</div>
        <div style="font-size: 10px; color: var(--log-text-dim);">Sea Ice & Weather Adjusted</div>
      </div>

      <div class="log-cmd-card" style="padding: 14px; text-align: center;">
        <div style="font-size: 10px; color: #c084fc; font-weight: 700; text-transform: uppercase;">🛡️ EMERGENCY SLA</div>
        <div style="font-size: 24px; font-weight: 900; color: #c084fc; font-family: var(--log-font-mono); margin-top: 4px;">100%</div>
        <div style="font-size: 10px; color: var(--log-text-dim);">36h Delivery vs 48h Window</div>
      </div>
    </div>
  `;
  return sec;
}

// ── 4. INTERACTIVE DUAL ROUTE MAP (SEA & AIR) ──
function buildInteractiveMapSection() {
  const card = document.createElement('div');
  card.className = 'log-cmd-card';

  card.innerHTML = `
    <div class="log-cmd-card-header">
      <div>
        <div class="log-cmd-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          Antarctic Maritime & Polar Aviation Live Tracking Map
        </div>
        <div class="log-cmd-card-subtitle">Global geospatial coordinates from India & Cape Town Gateways to Maitri & Bharati Stations</div>
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
      <div class="log-cmd-map-node" style="top: 56%; left: 45%;" onclick="selectVessel('VES-ANT-01')" title="MV Antarctic Support (78% Complete, ETA 10d)">
        <div class="log-cmd-map-node-icon" style="color: #10b981; animation: log-pulse 1.5s infinite;">🚢</div>
        <div class="log-cmd-map-node-label" style="border-color: #10b981; color: #10b981;">
          MV ANTARCTIC SUPPORT (15.4 kts // 10d ETA)
        </div>
      </div>

      <!-- Live Vessel: R/V Bharati -->
      <div class="log-cmd-map-node" style="top: 68%; right: 22%;" onclick="selectVessel('VES-ANT-02')" title="R/V Bharati Polar Explorer (88% Complete, ETA 6d)">
        <div class="log-cmd-map-node-icon" style="color: #10b981;">🚢</div>
        <div class="log-cmd-map-node-label" style="border-color: #10b981;">
          R/V BHARATI (Prydz Bay // 6d ETA)
        </div>
      </div>

      <!-- Live Vessel: MV Maitri Resupply (Delayed in storm) -->
      <div class="log-cmd-map-node" style="top: 48%; left: 32%;" onclick="selectVessel('VES-ANT-03')" title="MV Maitri Resupply (Delayed in storm front)">
        <div class="log-cmd-map-node-icon" style="color: #f59e0b;">🚢</div>
        <div class="log-cmd-map-node-label" style="border-color: #f59e0b; color: #f59e0b;">
          MV MAITRI (Delayed Gale // 15d ETA)
        </div>
      </div>

      <!-- Emergency Air Cargo Flight AF-IND-04 -->
      <div class="log-cmd-map-node" style="top: 74%; right: 30%;" onclick="inspectAirMission('AIR-EMG-2026-018')" title="Flight AF-IND-04 (Emergency Generator Spares)">
        <div class="log-cmd-map-node-icon" style="color: #ef4444; animation: log-pulse 1s infinite;">✈️</div>
        <div class="log-cmd-map-node-label" style="background: rgba(239, 68, 68, 0.9); border-color: #ffffff; color: #ffffff;">
          🚨 FLIGHT AF-IND-04 (ETA 36h // CRITICAL)
        </div>
      </div>

      <!-- Destination: Maitri Station -->
      <div class="log-cmd-map-node" style="bottom: 8%; left: 36%;" title="Maitri Station (Schirmacher Oasis)">
        <div class="log-cmd-map-node-icon" style="color: #00f0ff;">🧊</div>
        <div class="log-cmd-map-node-label">MAITRI STATION (70°S 11°E)</div>
      </div>

      <!-- Destination: Bharati Station -->
      <div class="log-cmd-map-node" style="bottom: 8%; right: 26%;" title="Bharati Station (Larsemann Hills)">
        <div class="log-cmd-map-node-icon" style="color: #00f0ff;">🧊</div>
        <div class="log-cmd-map-node-label">BHARATI STATION (69°S 76°E)</div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--log-text-dim); margin-top: 10px; font-family: var(--log-font-mono);">
      <span>LEGEND: 🚢 Sea Logistics | ✈️ Emergency Air Missions | 🧊 Antarctic Base | 📍 Gateway Ports</span>
      <span>COORDINATES REFRESH: Real-time AIS / ADS-B Polar Satellite Downlink</span>
    </div>
  `;
  return card;
}

// ── 5. LIVE VESSEL FLEET TRACKING SECTION ──
function buildVesselTrackingSection() {
  const card = document.createElement('div');
  card.className = 'log-cmd-card';

  let displayVessels = workingVessels;
  if (selectedFleetTab === 'emergency') {
    displayVessels = workingVessels.filter(v => v.status === 'DELAYED' || v.id === 'VES-ANT-01');
  }

  const vesselCardsHTML = displayVessels.map(v => {
    const isSelected = v.id === selectedVesselId;
    return `
      <div class="log-cmd-vessel-card ${isSelected ? 'active' : ''}" onclick="selectVessel('${v.id}')">
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
            <div style="font-size: 14px; font-weight: 800; color: #ffffff; font-family: var(--log-font-mono);">ETA ${v.etaDays} Days</div>
            <div style="font-size: 10px; color: var(--log-text-dim);">${v.expectedArrival}</div>
          </div>
        </div>

        <div class="log-cmd-progress-container">
          <div class="log-cmd-progress-bar-track">
            <div class="log-cmd-progress-bar-fill" style="width: ${v.progressPercent}%;"></div>
          </div>
          <div class="log-cmd-progress-text">
            <span>Progress: ${v.progressPercent}% Completed</span>
            <span>Distance Left: ${v.distanceRemainingKm.toLocaleString()} km</span>
          </div>
        </div>

        <div class="log-cmd-vessel-specs-grid">
          <div><strong>Location:</strong> ${v.currentLocationName}</div>
          <div><strong>Speed:</strong> ${v.speedKnots} kts (${v.headingDeg}°)</div>
          <div><strong>Sea Ice:</strong> ${v.seaIceConcentration}</div>
        </div>
      </div>
    `;
  }).join('');

  card.innerHTML = `
    <div class="log-cmd-card-header">
      <div>
        <div class="log-cmd-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16z"/></svg>
          Active Antarctic Maritime Resupply Fleet
        </div>
        <div class="log-cmd-card-subtitle">Click any vessel to inspect live telemetry and itemized cargo manifests</div>
      </div>
      <span class="log-cmd-badge-live">${workingVessels.length} VESSELS TRACKED</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${vesselCardsHTML}
    </div>
  `;
  return card;
}

// ── 6. ITEMIZED CARGO MANIFEST SECTION ──
function buildCargoManifestSection() {
  const card = document.createElement('div');
  card.className = 'log-cmd-card';

  const vessel = workingVessels.find(v => v.id === selectedVesselId) || workingVessels[0];

  const manifestRows = vessel.cargoManifest.map(m => `
    <tr>
      <td><span style="font-size: 14px; margin-right: 4px;">${m.icon}</span><strong>${m.category}</strong></td>
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
          Itemized Cargo Manifest // ${vessel.name}
        </div>
        <div class="log-cmd-card-subtitle">Destination: ${vessel.destination} | Total Payload: ${vessel.totalCargoWeightKg.toLocaleString()} kg</div>
      </div>
      <span class="log-cmd-badge-live">${vessel.cargoManifest.length} CARGO CATEGORIES</span>
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
            <th>Storage Hold</th>
          </tr>
        </thead>
        <tbody>
          ${manifestRows}
        </tbody>
      </table>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; font-size: 11px; color: var(--log-text-muted);">
      <span>Master Captain: <strong>${vessel.captain}</strong></span>
      <button class="log-cmd-btn-emergency" style="background: rgba(0,240,255,0.15); color: var(--log-cyan); border-color: rgba(0,240,255,0.3); font-size: 10px; padding: 4px 10px;" onclick="exportManifest('${vessel.id}')">
        📥 Export Manifest PDF
      </button>
    </div>
  `;
  return card;
}

// ── 7. EMERGENCY POLAR AIR MISSIONS SECTION ──
function buildEmergencyAirMissionsSection() {
  const card = document.createElement('div');
  card.className = 'log-cmd-card';

  const airCardsHTML = workingAirMissions.map(m => `
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-left: 4px solid ${m.priorityColor}; padding: 16px; border-radius: 10px; display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-size: 14px; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 8px;">
            <span>✈️ ${m.flightNumber}</span>
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
        <div><strong>Altitude & Speed:</strong> FL${m.altitudeFt / 100} // ${m.groundSpeedKnots} kts</div>
      </div>

      <div style="font-size: 11px; color: #cbd5e1;">
        <strong>Emergency Cargo Items:</strong>
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
        <div class="log-cmd-card-subtitle">Dedicated ski-equipped aircraft missions bypassing sea logistics delays</div>
      </div>
      <span class="log-cmd-badge-live">${workingAirMissions.length} ACTIVE AIR MISSIONS</span>
    </div>

    <!-- Lifecycle Process Flow -->
    <div class="log-cmd-lifecycle-pipeline" style="margin-bottom: 14px;">
      <div class="log-cmd-lifecycle-step">
        <div class="log-cmd-lifecycle-icon">🚨</div>
        <div style="font-size: 10px; font-weight: 700; color: #ffffff; margin-top: 4px;">Incident Detected</div>
        <div style="font-size: 9px; color: var(--log-text-dim);">Generator 02 Failure</div>
      </div>
      <div class="log-cmd-lifecycle-arrow">➔</div>
      <div class="log-cmd-lifecycle-step">
        <div class="log-cmd-lifecycle-icon" style="border-color: #ef4444; color: #ef4444;">📦</div>
        <div style="font-size: 10px; font-weight: 700; color: #ffffff; margin-top: 4px;">Manifest Locked</div>
        <div style="font-size: 9px; color: var(--log-text-dim);">EC-2026-018 (185 kg)</div>
      </div>
      <div class="log-cmd-lifecycle-arrow">➔</div>
      <div class="log-cmd-lifecycle-step">
        <div class="log-cmd-lifecycle-icon" style="background: rgba(16,185,129,0.15); color: #10b981;">✈️</div>
        <div style="font-size: 10px; font-weight: 700; color: #10b981; margin-top: 4px;">In Flight Radar</div>
        <div style="font-size: 9px; color: var(--log-text-dim);">FL145 Approaching Base</div>
      </div>
      <div class="log-cmd-lifecycle-arrow">➔</div>
      <div class="log-cmd-lifecycle-step">
        <div class="log-cmd-lifecycle-icon">🛠️</div>
        <div style="font-size: 10px; font-weight: 700; color: #ffffff; margin-top: 4px;">On-Site Install</div>
        <div style="font-size: 9px; color: var(--log-text-dim);">Maintenance Bay Restored</div>
      </div>
      <div class="log-cmd-lifecycle-arrow">➔</div>
      <div class="log-cmd-lifecycle-step">
        <div class="log-cmd-lifecycle-icon" style="color: #10b981; border-color: #10b981;">🟢</div>
        <div style="font-size: 10px; font-weight: 700; color: #10b981; margin-top: 4px;">Digital Twin 98%</div>
        <div style="font-size: 9px; color: var(--log-text-dim);">Normal Operations</div>
      </div>
    </div>

    <div class="log-cmd-grid-2">
      ${airCardsHTML}
    </div>
  `;
  return card;
}

// ── 8. INVENTORY SUPPLY GAP & DIGITAL TWIN RECOVERY ──
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
      <div style="color: var(--log-text-dim); font-size: 10px; margin-top: 2px;">Station: ${g.station} // Target: ${g.downstreamSystem}</div>
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
          Inventory Supply Gap & Digital Twin Synchronization
        </div>
        <div class="log-cmd-card-subtitle">Real-time inventory ledger updates before and after emergency cargo delivery</div>
      </div>
      <span class="log-cmd-badge-live">INVENTORY LINK</span>
    </div>
    <div style="display: flex; flex-direction: column;">
      ${rowsHTML}
    </div>
  `;
  return card;
}

// ── 9. DECISION SUPPORT RECOMMENDATION SECTION ──
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
        <div class="log-cmd-card-subtitle">Rule-based analytical assessment for base commanders</div>
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

// ── 10. RECENT ACTIVITY TIMELINE ──
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
        <span>📋 Global Logistics Telemetry Activity Log</span>
      </div>
      <span class="log-cmd-badge-live">IMMUTABLE AUDIT</span>
    </div>
    <div style="display: flex; flex-direction: column;">
      ${rows}
    </div>
  `;
  return card;
}

// ── 11. EMERGENCY CARGO REQUEST MODAL ──
function buildEmergencyRequestModal() {
  const backdrop = document.createElement('div');
  backdrop.id = 'log-cmd-emergency-modal';
  backdrop.className = `log-cmd-modal-backdrop ${emergencyModalOpen ? 'open' : ''}`;

  backdrop.innerHTML = `
    <div class="log-cmd-modal">
      <div class="log-cmd-modal-header">
        <div style="font-size: 14px; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 8px;">
          <span>🚨 CREATE EMERGENCY CARGO REQUEST</span>
        </div>
        <button style="background:transparent; border:none; color:#cbd5e1; font-size:16px; cursor:pointer;" onclick="closeEmergencyModal()">✕</button>
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
          <label class="log-cmd-form-label">Authorized Logistics Requester</label>
          <input type="text" class="log-cmd-form-input" value="Dr. Kashish Sharma (Base Commander) // LOG-002" readonly>
        </div>
      </div>
      <div class="log-cmd-modal-footer">
        <button class="log-cmd-back-link" onclick="closeEmergencyModal()">Cancel</button>
        <button class="log-cmd-btn-emergency" onclick="submitEmergencyRequest()">Authorize & Dispatch Air Mission 🚀</button>
      </div>
    </div>
  `;

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeEmergencyModal();
  });

  return backdrop;
}

// ── Global Window Handlers ──
window.selectVessel = (vesselId) => {
  selectedVesselId = vesselId;
  renderPage();
  const v = workingVessels.find(item => item.id === vesselId);
  if (v) showToast(`Selected ${v.name}: ${v.progressPercent}% to ${v.destination}`);
};

window.inspectAirMission = (missionId) => {
  selectedAirMissionId = missionId;
  const m = workingAirMissions.find(item => item.missionId === missionId);
  if (m) showToast(`Air Mission ${m.flightNumber} tracked: Altitude FL${m.altitudeFt/100}, ETA ${m.etaHoursRemaining}h`, 'warning');
};

window.openEmergencyModal = () => {
  emergencyModalOpen = true;
  const modal = document.getElementById('log-cmd-emergency-modal');
  if (modal) modal.classList.add('open');
};

window.closeEmergencyModal = () => {
  emergencyModalOpen = false;
  const modal = document.getElementById('log-cmd-emergency-modal');
  if (modal) modal.classList.remove('open');
};

window.submitEmergencyRequest = () => {
  const station = document.getElementById('emg-target-station')?.value || 'Bharati Station';
  const item = document.getElementById('emg-item-name')?.value || 'Generator Control Spares';
  const qty = document.getElementById('emg-item-qty')?.value || '2';

  closeEmergencyModal();

  showToast(`🚨 Emergency Request Created! Air Cargo Flight AF-IND-04 manifesting ${qty}x ${item} for ${station}.`, 'success');

  // Trigger simulated state update
  workingGaps[0].gapStatusLabel = 'Flight AF-IND-04 En Route';
  renderPage();
};

window.exportManifest = (vesselId) => {
  const v = workingVessels.find(item => item.id === vesselId) || workingVessels[0];
  showToast(`Downloading Customs Manifest for ${v.name}...`, 'success');
};
