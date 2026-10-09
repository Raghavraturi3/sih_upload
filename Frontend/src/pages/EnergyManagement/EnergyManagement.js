// Energy Management Operations Center — Main Application Module
// Standalone page module for Antarctic Research Stations (Maitri & Bharati).
// Does NOT modify or overwrite any existing admin dashboard logic.

import './energy.css';
import Chart from 'chart.js/auto';
import { telemetry } from '../../utils/telemetry.js';
import { initAIAssistant } from '../../features/aiVoiceAssistant/index.js';
import {
  STATIONS,
  ENERGY_OVERVIEW_KPIS,
  STATION_ENERGY_HEALTH,
  GENERATOR_UNITS,
  SOLAR_SYSTEM,
  BATTERY_STORAGE,
  FUEL_MANAGEMENT,
  CONSUMPTION_BREAKDOWN,
  ENERGY_TRENDS,
  ENERGY_ALERTS,
  ENERGY_TEAM,
  ENERGY_PERFORMANCE_METRICS,
  ENERGY_INSIGHTS,
  CROSS_DEPARTMENT_IMPACTS,
  ENERGY_RISK,
  ENERGY_ASSETS,
  ENERGY_MAINTENANCE,
  RECENT_ENERGY_ACTIVITY,
  ENERGY_FLOW_NODES
} from './data/energyDemoData.js';

// ── State ──
let selectedStation = 'all';
let trendTimeframe = 'today';
let searchQuery = '';
let filterType = 'all';
let filterStatus = 'all';
let currentPage = 1;
const PAGE_SIZE = 8;
let selectedAsset = null;
let selectedEmployee = null;
let profileDropdownOpen = false;

// Working mutable copies for interactive actions
let workingAssets = [...ENERGY_ASSETS];
let workingGenerators = [...GENERATOR_UNITS];
let workingAlerts = [...ENERGY_ALERTS];
let workingMaintenance = JSON.parse(JSON.stringify(ENERGY_MAINTENANCE));

// Chart instances
let trendChartInstance = null;
let breakdownChartInstance = null;

// ── Toast Notification System ──
function showToast(message, type = 'success') {
  let container = document.getElementById('energy-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'energy-toast-container';
    container.className = 'energy-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `energy-toast ${type}`;
  const icon = type === 'success' ? '⚡' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️';
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

  // Safely subscribe to live telemetry engine if active
  if (telemetry && typeof telemetry.subscribe === 'function') {
    telemetry.subscribe((state) => {
      const syncEl = document.getElementById('energy-live-power-sync');
      if (syncEl && state.kpis) {
        syncEl.textContent = `${state.kpis.powerKw} kW Live`;
      }
    });
  }
});

function renderPage() {
  const app = document.getElementById('energy-app');
  if (!app) return;
  app.innerHTML = '';
  app.appendChild(buildTopbar());

  const content = document.createElement('div');
  content.className = 'energy-content';

  content.appendChild(buildOverviewSection());
  content.appendChild(buildHealthSection());

  const genGrid = document.createElement('div');
  genGrid.className = 'energy-grid-2';
  genGrid.appendChild(buildPowerGenerationSection());
  genGrid.appendChild(buildLiveFlowSection());
  content.appendChild(genGrid);

  const chartGrid = document.createElement('div');
  chartGrid.className = 'energy-grid-2-1';
  chartGrid.appendChild(buildTrendChartSection());
  chartGrid.appendChild(buildBreakdownSection());
  content.appendChild(chartGrid);

  const monitorGrid = document.createElement('div');
  monitorGrid.className = 'energy-grid-2';
  monitorGrid.appendChild(buildPeakLoadSection());
  monitorGrid.appendChild(buildGeneratorStatusSection());
  content.appendChild(monitorGrid);

  const storageGrid = document.createElement('div');
  storageGrid.className = 'energy-grid-3';
  storageGrid.appendChild(buildSolarSection());
  storageGrid.appendChild(buildBatterySection());
  storageGrid.appendChild(buildFuelSection());
  content.appendChild(storageGrid);

  const teamAlertGrid = document.createElement('div');
  teamAlertGrid.className = 'energy-grid-2';
  teamAlertGrid.appendChild(buildAlertsSection());
  teamAlertGrid.appendChild(buildTeamSection());
  content.appendChild(teamAlertGrid);

  content.appendChild(buildPerformanceSection());
  content.appendChild(buildInsightsSection());

  const twinImpactGrid = document.createElement('div');
  twinImpactGrid.className = 'energy-grid-2';
  twinImpactGrid.appendChild(buildDigitalTwinSection());
  twinImpactGrid.appendChild(buildImpactAndRiskSection());
  content.appendChild(twinImpactGrid);

  content.appendChild(buildMaintenanceSection());
  content.appendChild(buildAssetTableSection());
  content.appendChild(buildRecentActivitySection());

  app.appendChild(content);
  app.appendChild(buildDrawer());

  // Render charts after DOM paint
  setTimeout(() => {
    initTrendChart();
    initBreakdownChart();
  }, 100);
}

// ── TOPBAR ──
function buildTopbar() {
  const bar = document.createElement('header');
  bar.className = 'energy-topbar';
  bar.innerHTML = `
    <div class="energy-topbar-left">
      <a href="/index.html" class="energy-back-link" title="Return to Main Admin Dashboard">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Admin Dashboard
      </a>
      <span class="energy-topbar-title">Energy Management</span>
      <span class="energy-topbar-subtitle">Monitor power generation, consumption, storage and energy reliability across Antarctic stations.</span>
    </div>
    <div class="energy-topbar-right">
      <div class="energy-station-tabs" id="station-tabs">
        <button class="energy-station-tab ${selectedStation === 'all' ? 'active' : ''}" data-station="all">All Stations</button>
        <button class="energy-station-tab ${selectedStation === 'Maitri' ? 'active' : ''}" data-station="Maitri">Maitri</button>
        <button class="energy-station-tab ${selectedStation === 'Bharati' ? 'active' : ''}" data-station="Bharati">Bharati</button>
      </div>

      <div class="energy-sync-pill" title="Telemetry Synchronized with Polar Ground Network">
        <span class="energy-sync-dot"></span>
        <span id="energy-live-power-sync">SCADA Live (18ms)</span>
      </div>

      <div class="energy-profile-chip" id="profile-chip" title="Account & Operations Profile">
        <div class="energy-profile-avatar">AS</div>
        <div class="energy-profile-info">
          <div class="energy-profile-name">Arjun Sharma</div>
          <div class="energy-profile-role">Energy Engineer · Maitri</div>
        </div>
        <span class="energy-online-dot"></span>
        <div class="energy-profile-dropdown ${profileDropdownOpen ? 'open' : ''}" id="profile-dropdown">
          <div class="energy-profile-dd-item" id="dd-view-profile">👤 View Engineer Profile</div>
          <div class="energy-profile-dd-item" id="dd-station-telemetry">⚡ Run Microgrid Diagnostics</div>
          <div class="energy-profile-dd-divider"></div>
          <div class="energy-profile-dd-item" id="dd-return-admin">🚪 Return to Admin Dashboard</div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    bar.querySelectorAll('.energy-station-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        selectedStation = tab.dataset.station;
        currentPage = 1;
        renderPage();
      });
    });

    const chip = bar.querySelector('#profile-chip');
    const dropdown = bar.querySelector('#profile-dropdown');
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdownOpen = !profileDropdownOpen;
      dropdown.classList.toggle('open', profileDropdownOpen);
    });

    const viewProfileBtn = bar.querySelector('#dd-view-profile');
    if (viewProfileBtn) {
      viewProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdownOpen = false;
        dropdown.classList.remove('open');
        openEmployeeDrawer(ENERGY_TEAM[0]);
      });
    }

    const diagBtn = bar.querySelector('#dd-station-telemetry');
    if (diagBtn) {
      diagBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdownOpen = false;
        dropdown.classList.remove('open');
        showToast('Initiating harmonic busbar frequency scan at Maitri & Bharati...', 'info');
      });
    }

    const returnBtn = bar.querySelector('#dd-return-admin');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        window.location.href = '/index.html';
      });
    }

    document.addEventListener('click', () => {
      profileDropdownOpen = false;
      const dd = document.querySelector('#profile-dropdown');
      if (dd) dd.classList.remove('open');
    });
  }, 20);

  return bar;
}

// ── OVERVIEW KPIS ──
function buildOverviewSection() {
  const section = document.createElement('div');
  const kpi = ENERGY_OVERVIEW_KPIS;
  const stationLabel = selectedStation === 'all' ? 'Maitri & Bharati' : selectedStation;

  section.innerHTML = `
    <div class="energy-section-header">
      <div class="energy-section-title">Energy Overview · ${stationLabel}</div>
      <span style="font-size:11.5px; color:var(--text-muted); font-family:var(--font-mono);">Real-time Telemetry Data Model</span>
    </div>
    <div class="energy-kpi-grid" style="margin-top: 10px;">
      <div class="energy-kpi-card" title="Total power generated across active sources">
        <div class="energy-kpi-header">
          <span class="energy-kpi-title">Total Generation</span>
          <span>⚡</span>
        </div>
        <div class="energy-kpi-value val-blue">${selectedStation === 'Bharati' ? '390' : selectedStation === 'Maitri' ? '430' : kpi.totalGenerationKw} <span style="font-size:14px; font-weight:600;">kWh</span></div>
        <div class="energy-kpi-subtext">Generators + Solar PV + Wind</div>
      </div>

      <div class="energy-kpi-card" title="Current station power draw">
        <div class="energy-kpi-header">
          <span class="energy-kpi-title">Consumption</span>
          <span>🔌</span>
        </div>
        <div class="energy-kpi-value val-orange">${selectedStation === 'Bharati' ? '315' : selectedStation === 'Maitri' ? '395' : kpi.totalConsumptionKw} <span style="font-size:14px; font-weight:600;">kWh</span></div>
        <div class="energy-kpi-subtext">Active station facilities load</div>
      </div>

      <div class="energy-kpi-card" title="Reserve headroom before generator dispatch">
        <div class="energy-kpi-header">
          <span class="energy-kpi-title">Available Power</span>
          <span>🔋</span>
        </div>
        <div class="energy-kpi-value val-green">${selectedStation === 'Bharati' ? '75' : selectedStation === 'Maitri' ? '35' : kpi.availablePowerKw} <span style="font-size:14px; font-weight:600;">kWh</span></div>
        <div class="energy-kpi-subtext">Immediate spinning reserve</div>
      </div>

      <div class="energy-kpi-card" title="State of charge in stationary lithium battery storage">
        <div class="energy-kpi-header">
          <span class="energy-kpi-title">Battery Level</span>
          <span>🪫</span>
        </div>
        <div class="energy-kpi-value val-blue">${selectedStation === 'Bharati' ? '78' : selectedStation === 'Maitri' ? '86' : kpi.batteryLevelPercent}%</div>
        <div class="energy-kpi-subtext">8.4 hrs backup buffer</div>
      </div>

      <div class="energy-kpi-card" title="Arctic D-50 winter diesel fuel remaining">
        <div class="energy-kpi-header">
          <span class="energy-kpi-title">Fuel Reserve</span>
          <span>🛢️</span>
        </div>
        <div class="energy-kpi-value val-amber">${kpi.fuelReservePercent}%</div>
        <div class="energy-kpi-subtext">74,240 L (~90.5 days)</div>
      </div>

      <div class="energy-kpi-card" title="Photovoltaic solar generation">
        <div class="energy-kpi-header">
          <span class="energy-kpi-title">Solar Generation</span>
          <span>☀️</span>
        </div>
        <div class="energy-kpi-value val-green">${kpi.solarGenerationKw} <span style="font-size:14px; font-weight:600;">kWh</span></div>
        <div class="energy-kpi-subtext">17% renewable offset</div>
      </div>
    </div>
  `;
  return section;
}

// ── STATION ENERGY HEALTH ──
function buildHealthSection() {
  const section = document.createElement('div');
  const filteredStations = selectedStation === 'all'
    ? STATION_ENERGY_HEALTH
    : STATION_ENERGY_HEALTH.filter(s => s.station === selectedStation);

  section.innerHTML = `
    <div class="energy-section-header" style="margin-top: 4px;">
      <div class="energy-section-title">Energy System Health</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Station Power Quality Index</span>
    </div>
    <div class="energy-health-station-grid" style="margin-top: 10px;">
      ${filteredStations.map(station => {
        const dotCol = (status) => status === 'Normal' || status === 'Healthy' || status === 'Active' ? 'green' : status === 'Attention' || status === 'High' || status === 'Limited' ? 'amber' : 'red';
        return `
          <div class="energy-station-health-card">
            <div class="energy-station-health-header">
              <div>
                <div class="energy-station-name">🇮🇳 ${station.station.toUpperCase()} STATION</div>
                <div style="font-size:11px; color:var(--text-muted);">Load: ${station.loadKw} kW / ${station.capacityKw} kW Capacity</div>
              </div>
              <div class="energy-station-health-pct" style="color: ${station.healthPercent >= 85 ? 'var(--accent-green)' : 'var(--accent-amber)'};">
                ${station.healthPercent}%
              </div>
            </div>

            <div class="energy-meter-bg">
              <div class="energy-meter-fill ${station.healthPercent >= 85 ? 'green' : 'amber'}" style="width:${station.healthPercent}%;"></div>
            </div>

            <div class="energy-station-chips-row">
              <span class="energy-status-chip"><span class="energy-status-dot ${dotCol(station.generationStatus)}"></span>Generation: ${station.generationStatus}</span>
              <span class="energy-status-chip"><span class="energy-status-dot ${dotCol(station.consumptionStatus)}"></span>Consumption: ${station.consumptionStatus}</span>
              <span class="energy-status-chip"><span class="energy-status-dot ${dotCol(station.batteryStatus)}"></span>Battery: ${station.batteryStatus}</span>
              <span class="energy-status-chip"><span class="energy-status-dot ${dotCol(station.fuelStatus)}"></span>Fuel: ${station.fuelStatus}</span>
              <span class="energy-status-chip"><span class="energy-status-dot ${dotCol(station.solarStatus)}"></span>Solar: ${station.solarStatus}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return section;
}

// ── POWER GENERATION SECTION ──
function buildPowerGenerationSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">⚡ Power Generation Sources</div>
      <span class="energy-badge energy-badge-green">Synchronized Grid</span>
    </div>
    <div class="energy-card-body" style="display:flex; flex-direction:column; gap:16px;">
      <div>
        <div style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px;">Diesel Generators</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-muted); padding:10px 14px; border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:600; font-size:12.5px;">Generator 01 (Maitri Prime)</div>
              <div style="font-size:11px; color:var(--text-muted);">Caterpillar C9 · 72% Load</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700; font-family:var(--font-mono);">420 kWh</div>
              <span class="energy-badge energy-badge-green" style="font-size:9.5px;">Operational</span>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-muted); padding:10px 14px; border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:600; font-size:12.5px;">Generator 02 (Maitri Aux)</div>
              <div style="font-size:11px; color:var(--text-muted);">Caterpillar C9 · 81% Load</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700; font-family:var(--font-mono);">380 kWh</div>
              <span class="energy-badge energy-badge-amber" style="font-size:9.5px;">Needs Attention</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px;">Renewable & Storage</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-muted); padding:10px 14px; border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:600; font-size:12.5px;">Solar PV Arrays</div>
              <div style="font-size:11px; color:var(--text-muted);">Maitri & Bharati Polar Bifacial Panels</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700; font-family:var(--font-mono); color:var(--accent-green);">145 kWh</div>
              <span class="energy-badge energy-badge-green" style="font-size:9.5px;">Active</span>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-muted); padding:10px 14px; border-radius:var(--radius-md);">
            <div>
              <div style="font-weight:600; font-size:12.5px;">BESS Lithium Storage</div>
              <div style="font-size:11px; color:var(--text-muted);">410 kWh Stored · Float Charging</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700; font-family:var(--font-mono); color:var(--accent-blue);">82%</div>
              <span class="energy-badge energy-badge-blue" style="font-size:9.5px;">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  return section;
}

// ── LIVE ENERGY FLOW SCHEMATIC ──
function buildLiveFlowSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">🔄 Station Energy Flow Schematic</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Click node to inspect telemetry</span>
    </div>
    <div class="energy-card-body" style="padding: 16px;">
      <div class="energy-flow-container">
        <div class="energy-flow-diagram">
          <!-- Generation Column -->
          <div class="energy-flow-col">
            <div class="energy-flow-col-title">Generation</div>
            <div class="energy-flow-node" data-flow="gen">
              <span class="energy-flow-node-title">Diesel Gens</span>
              <span class="energy-flow-node-val">800 kW</span>
            </div>
            <div class="energy-flow-node" data-flow="sol">
              <span class="energy-flow-node-title">Solar PV</span>
              <span class="energy-flow-node-val">38 kW</span>
            </div>
          </div>

          <div class="energy-flow-connector">→</div>

          <!-- Distribution Column -->
          <div class="energy-flow-col">
            <div class="energy-flow-col-title">Distribution</div>
            <div class="energy-flow-node" data-flow="dist" style="border-color:#38bdf8;">
              <span class="energy-flow-node-title">415V Busbar</span>
              <span class="energy-flow-node-val">838 kW</span>
            </div>
            <div class="energy-flow-node" data-flow="bat">
              <span class="energy-flow-node-title">BESS Bank</span>
              <span class="energy-flow-node-val">82% SOC</span>
            </div>
          </div>

          <div class="energy-flow-connector">→</div>

          <!-- Load Consumption Column -->
          <div class="energy-flow-col" style="flex:1.4;">
            <div class="energy-flow-col-title">Station Loads</div>
            <div class="energy-flow-node" data-flow="load-htg">
              <span class="energy-flow-node-title">Heating & Thermal</span>
              <span class="energy-flow-node-val">270 kW (38%)</span>
            </div>
            <div class="energy-flow-node" data-flow="load-lab">
              <span class="energy-flow-node-title">Laboratories</span>
              <span class="energy-flow-node-val">128 kW (18%)</span>
            </div>
            <div class="energy-flow-node" data-flow="load-comms">
              <span class="energy-flow-node-title">Comms & Sensors</span>
              <span class="energy-flow-node-val">178 kW (25%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.energy-flow-node').forEach(node => {
      node.addEventListener('click', () => {
        const flowId = node.dataset.flow;
        if (flowId.includes('gen')) {
          openDrawer(workingAssets[0]);
        } else if (flowId.includes('sol')) {
          openDrawer(workingAssets[4]);
        } else if (flowId.includes('bat')) {
          openDrawer(workingAssets[6]);
        } else if (flowId.includes('dist')) {
          openDrawer(workingAssets[8]);
        } else {
          showToast(`Inspecting power distribution branch for ${node.querySelector('.energy-flow-node-title').textContent}`, 'info');
        }
      });
    });
  }, 20);

  return section;
}

// ── TREND CHART ──
function buildTrendChartSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">📈 Energy Demand & Generation Trends</div>
      <div class="energy-chart-tabs" id="trend-timeframe-tabs">
        <button class="energy-chart-tab ${trendTimeframe === 'today' ? 'active' : ''}" data-tf="today">24H</button>
        <button class="energy-chart-tab ${trendTimeframe === 'sevenDays' ? 'active' : ''}" data-tf="sevenDays">7D</button>
        <button class="energy-chart-tab ${trendTimeframe === 'thirtyDays' ? 'active' : ''}" data-tf="thirtyDays">30D</button>
      </div>
    </div>
    <div class="energy-card-body">
      <div class="energy-chart-container">
        <canvas id="energy-trend-canvas"></canvas>
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.energy-chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        section.querySelectorAll('.energy-chart-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        trendTimeframe = tab.dataset.tf;
        updateTrendChart();
      });
    });
  }, 20);

  return section;
}

function initTrendChart() {
  const canvas = document.getElementById('energy-trend-canvas');
  if (!canvas) return;
  const data = ENERGY_TRENDS[trendTimeframe];

  if (trendChartInstance) trendChartInstance.destroy();

  trendChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Generation (kWh)',
          data: data.generation,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.08)',
          tension: 0.35,
          fill: true,
          pointRadius: 3
        },
        {
          label: 'Consumption (kWh)',
          data: data.consumption,
          borderColor: '#ea580c',
          backgroundColor: 'transparent',
          borderDash: [4, 4],
          tension: 0.35,
          pointRadius: 3
        },
        {
          label: 'Solar (kWh)',
          data: data.solar,
          borderColor: '#059669',
          backgroundColor: 'transparent',
          tension: 0.35,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: { padding: 10, cornerRadius: 6 }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

function updateTrendChart() {
  if (!trendChartInstance) return;
  const data = ENERGY_TRENDS[trendTimeframe];
  trendChartInstance.data.labels = data.labels;
  trendChartInstance.data.datasets[0].data = data.generation;
  trendChartInstance.data.datasets[1].data = data.consumption;
  trendChartInstance.data.datasets[2].data = data.solar;
  trendChartInstance.update();
}

// ── CONSUMPTION BREAKDOWN ──
function buildBreakdownSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">🥧 Consumption Breakdown</div>
      <span style="font-size:11.5px; color:var(--text-muted);">710 kWh Total</span>
    </div>
    <div class="energy-card-body" style="display:flex; flex-direction:column; gap:12px;">
      <div style="position:relative; height:150px; display:flex; justify-content:center;">
        <canvas id="energy-breakdown-canvas"></canvas>
      </div>

      <div style="display:flex; flex-direction:column; gap:2px; margin-top:4px;">
        ${CONSUMPTION_BREAKDOWN.slice(0, 5).map(cat => `
          <div class="energy-breakdown-row">
            <div class="energy-breakdown-info">
              <span class="energy-breakdown-dot" style="background:${cat.color};"></span>
              <span class="energy-breakdown-title">${cat.category}</span>
            </div>
            <span class="energy-breakdown-stats">${cat.percent}% <span style="color:var(--text-muted); font-size:11px; font-weight:400;">(${cat.kw} kW)</span></span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return section;
}

function initBreakdownChart() {
  const canvas = document.getElementById('energy-breakdown-canvas');
  if (!canvas) return;

  if (breakdownChartInstance) breakdownChartInstance.destroy();

  breakdownChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: CONSUMPTION_BREAKDOWN.map(c => c.category),
      datasets: [{
        data: CONSUMPTION_BREAKDOWN.map(c => c.percent),
        backgroundColor: CONSUMPTION_BREAKDOWN.map(c => c.color),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
          }
        }
      }
    }
  });
}

// ── PEAK LOAD SECTION ──
function buildPeakLoadSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  const kpi = ENERGY_OVERVIEW_KPIS;
  const loadPct = Math.round((kpi.totalConsumptionKw / kpi.totalCapacityKw) * 100);

  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">⚠️ Peak Load Monitoring</div>
      <span class="energy-badge energy-badge-amber">Peak Window 18:40 UTC</span>
    </div>
    <div class="energy-card-body">
      <div class="energy-peak-display">
        <div class="energy-gauge-circle" style="--load-pct: ${loadPct}%;">
          <div class="energy-gauge-inner">
            <span class="energy-gauge-number">${loadPct}%</span>
            <span class="energy-gauge-label">LOAD FACTOR</span>
          </div>
        </div>

        <div class="energy-peak-meta-grid">
          <div class="energy-peak-meta-item">
            <span class="energy-peak-meta-label">Current Demand</span>
            <span class="energy-peak-meta-val">${kpi.totalConsumptionKw} kW</span>
          </div>
          <div class="energy-peak-meta-item">
            <span class="energy-peak-meta-label">24H Recorded Peak</span>
            <span class="energy-peak-meta-val" style="color:var(--accent-orange);">${kpi.peakLoadKw} kW</span>
          </div>
          <div class="energy-peak-meta-item">
            <span class="energy-peak-meta-label">Total Substation Capacity</span>
            <span class="energy-peak-meta-val">${kpi.totalCapacityKw} kW</span>
          </div>
          <div class="energy-peak-meta-item">
            <span class="energy-peak-meta-label">Remaining Safe Headroom</span>
            <span class="energy-peak-meta-val" style="color:var(--accent-green);">${kpi.totalCapacityKw - kpi.peakLoadKw} kW</span>
          </div>
        </div>
      </div>
    </div>
  `;
  return section;
}

// ── GENERATOR MONITORING SECTION ──
function buildGeneratorStatusSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">⚙️ Generator Operations Status</div>
      <span style="font-size:11.5px; color:var(--text-muted);">${workingGenerators.length} Units Active</span>
    </div>
    <div class="energy-card-body" style="padding:16px;">
      <div class="energy-gen-grid">
        ${workingGenerators.slice(0, 2).map(gen => `
          <div class="energy-gen-card">
            <div class="energy-gen-top">
              <span class="energy-gen-name">${gen.name}</span>
              <span class="energy-badge ${gen.status === 'Operational' ? 'energy-badge-green' : 'energy-badge-amber'}">${gen.status}</span>
            </div>

            <div class="energy-gen-stats">
              <div class="energy-gen-stat-item">
                <span class="energy-gen-stat-label">Output</span>
                <span class="energy-gen-stat-val">${gen.outputKw} kW</span>
              </div>
              <div class="energy-gen-stat-item">
                <span class="energy-gen-stat-label">Load</span>
                <span class="energy-gen-stat-val">${gen.loadPercent}%</span>
              </div>
              <div class="energy-gen-stat-item">
                <span class="energy-gen-stat-label">Burn Rate</span>
                <span class="energy-gen-stat-val">${gen.fuelConsumptionLh} L/h</span>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted);">
              <span>Runtime: ${gen.runtimeHours} hrs</span>
              <span>Health: <strong>${gen.healthPercent}%</strong></span>
            </div>

            <div style="display:flex; gap:8px; margin-top:4px;">
              <button class="energy-btn energy-btn-secondary energy-btn-sm btn-inspect-gen" data-gen-id="${gen.id}" style="flex:1;">View Details</button>
              <button class="energy-btn energy-btn-primary energy-btn-sm btn-service-gen" data-gen-id="${gen.id}" style="flex:1;">Service</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.btn-inspect-gen').forEach(btn => {
      btn.addEventListener('click', () => {
        const asset = workingAssets.find(a => a.id === btn.dataset.genId);
        if (asset) openDrawer(asset);
      });
    });

    section.querySelectorAll('.btn-service-gen').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast(`Maintenance dispatch queued for ${btn.dataset.genId}`, 'success');
      });
    });
  }, 20);

  return section;
}

// ── SOLAR SECTION ──
function buildSolarSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  const sol = SOLAR_SYSTEM;
  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">☀️ Solar Generation</div>
      <span class="energy-badge energy-badge-green">● ${sol.status}</span>
    </div>
    <div class="energy-card-body" style="display:flex; flex-direction:column; gap:12px;">
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
        <div class="energy-perf-item">
          <span class="energy-perf-val" style="color:var(--accent-green);">${sol.currentOutputKw} kW</span>
          <span class="energy-perf-label">Current Output</span>
        </div>
        <div class="energy-perf-item">
          <span class="energy-perf-val">${sol.dailyGenerationKwh} kWh</span>
          <span class="energy-perf-label">Daily Yield</span>
        </div>
      </div>

      <div class="energy-storage-bars">
        <div class="energy-storage-item">
          <div class="energy-storage-header">
            <span>Installed Solar Capacity (${sol.installedCapacityKw} kW)</span>
            <strong>${Math.round((sol.currentOutputKw / sol.installedCapacityKw) * 100)}%</strong>
          </div>
          <div class="energy-meter-bg">
            <div class="energy-meter-fill green" style="width:${Math.round((sol.currentOutputKw / sol.installedCapacityKw) * 100)}%;"></div>
          </div>
        </div>

        <div class="energy-storage-item">
          <div class="energy-storage-header">
            <span>Renewable Station Contribution</span>
            <strong>${sol.renewableContributionPercent}%</strong>
          </div>
          <div class="energy-meter-bg">
            <div class="energy-meter-fill blue" style="width:${sol.renewableContributionPercent}%;"></div>
          </div>
        </div>
      </div>

      <div style="font-size:11px; color:var(--text-muted); background:var(--bg-muted); padding:8px 10px; border-radius:var(--radius-md);">
        Irradiance: <strong>${sol.irradianceWm2} W/m²</strong> · ${sol.snowClearingStatus}
      </div>
    </div>
  `;
  return section;
}

// ── BATTERY SECTION ──
function buildBatterySection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  const bat = BATTERY_STORAGE;
  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">🔋 Energy Storage (BESS)</div>
      <span class="energy-badge energy-badge-blue">● ${bat.chargingState}</span>
    </div>
    <div class="energy-card-body" style="display:flex; flex-direction:column; gap:12px;">
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
        <div class="energy-perf-item">
          <span class="energy-perf-val" style="color:var(--accent-blue);">${bat.batteryLevelPercent}%</span>
          <span class="energy-perf-label">State of Charge (SOC)</span>
        </div>
        <div class="energy-perf-item">
          <span class="energy-perf-val">${bat.storedEnergyKwh} kWh</span>
          <span class="energy-perf-label">Stored Energy</span>
        </div>
      </div>

      <div class="energy-storage-bars">
        <div class="energy-storage-item">
          <div class="energy-storage-header">
            <span>Available Usable Capacity</span>
            <strong>${bat.availableCapacityPercent}%</strong>
          </div>
          <div class="energy-meter-bg">
            <div class="energy-meter-fill blue" style="width:${bat.availableCapacityPercent}%;"></div>
          </div>
        </div>

        <div class="energy-storage-item">
          <div class="energy-storage-header">
            <span>Estimated Backup Runtime</span>
            <strong style="color:var(--accent-green);">${bat.estimatedBackupHours} Hours</strong>
          </div>
          <div class="energy-meter-bg">
            <div class="energy-meter-fill green" style="width:75%;"></div>
          </div>
        </div>
      </div>

      <div style="font-size:11px; color:var(--text-muted); background:var(--bg-muted); padding:8px 10px; border-radius:var(--radius-md);">
        Bus Voltage: <strong>${bat.cellVoltageAvgV} V/cell</strong> · Battery Temp: <strong>${bat.internalTempC}°C</strong>
      </div>
    </div>
  `;
  return section;
}

// ── FUEL SECTION ──
function buildFuelSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  const fuel = FUEL_MANAGEMENT;
  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">🛢️ Fuel Reserve Management</div>
      <span class="energy-badge energy-badge-green">● ${fuel.status}</span>
    </div>
    <div class="energy-card-body" style="display:flex; flex-direction:column; gap:12px;">
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
        <div class="energy-perf-item">
          <span class="energy-perf-val" style="color:var(--accent-amber);">${fuel.fuelReservePercent}%</span>
          <span class="energy-perf-label">Storage Capacity</span>
        </div>
        <div class="energy-perf-item">
          <span class="energy-perf-val">${fuel.estimatedDaysRemaining} Days</span>
          <span class="energy-perf-label">Estimated Autonomy</span>
        </div>
      </div>

      <div class="energy-storage-item">
        <div class="energy-storage-header">
          <span>Available Arctic Diesel (${fuel.availableLitres.toLocaleString()} L)</span>
          <strong>${fuel.fuelReservePercent}%</strong>
        </div>
        <div class="energy-meter-bg">
          <div class="energy-meter-fill amber" style="width:${fuel.fuelReservePercent}%;"></div>
        </div>
      </div>

      <div class="energy-fuel-banner">
        <span>ℹ️</span>
        <span>Burn rate: <strong>${fuel.dailyConsumptionLitres} L/day</strong>. Reserve exceeds the 30-day polar contingency buffer.</span>
      </div>
    </div>
  `;
  return section;
}

// ── ALERTS SECTION ──
function buildAlertsSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  const filtered = selectedStation === 'all' ? workingAlerts : workingAlerts.filter(a => a.station === selectedStation);

  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">🔔 Energy Alerts & Incidents</div>
      <span style="font-size:11.5px; color:var(--text-muted);">${filtered.length} Active</span>
    </div>
    <div class="energy-card-body">
      <div class="energy-alert-list">
        ${filtered.map(al => {
          const dotClass = al.type === 'CRITICAL' ? 'dot-critical' : al.type === 'WARNING' ? 'dot-warning' : 'dot-resolved';
          return `
            <div class="energy-alert-item" data-asset-id="${al.assetId}" title="Click to view affected asset">
              <div class="energy-alert-dot ${dotClass}"></div>
              <div class="energy-alert-content">
                <div class="energy-alert-title">${al.title}</div>
                <div class="energy-alert-meta">${al.station} · ${al.timestamp} · Impact: ${al.impact}</div>
              </div>
              <span class="energy-badge ${al.type === 'CRITICAL' ? 'energy-badge-red' : al.type === 'WARNING' ? 'energy-badge-amber' : 'energy-badge-green'}">${al.type}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.energy-alert-item').forEach(item => {
      item.addEventListener('click', () => {
        const asset = workingAssets.find(a => a.id === item.dataset.assetId);
        if (asset) openDrawer(asset);
      });
    });
  }, 20);

  return section;
}

// ── TEAM SECTION ──
function buildTeamSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  const filtered = selectedStation === 'all' ? ENERGY_TEAM : ENERGY_TEAM.filter(t => t.station === selectedStation || t.station === 'HQ');

  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">👥 Energy Operations Team</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Click to open Profile</span>
    </div>
    <div class="energy-card-body" style="display:flex; flex-direction:column; gap:10px;">
      ${filtered.map(member => `
        <div class="energy-team-card" data-member-id="${member.id}" title="Click to view ${member.name}'s profile">
          <div class="energy-team-avatar">${member.avatar}</div>
          <div style="flex:1;">
            <div class="energy-team-name">${member.name}</div>
            <div class="energy-team-role">${member.role} · ${member.station}</div>
            <div class="energy-team-meta">
              <span>● ${member.status}</span>
              <span>📻 ${member.commsChannel}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.energy-team-card').forEach(card => {
      card.addEventListener('click', () => {
        const member = ENERGY_TEAM.find(m => m.id === card.dataset.memberId);
        if (member) openEmployeeDrawer(member);
      });
    });
  }, 20);

  return section;
}

// ── PERFORMANCE SECTION ──
function buildPerformanceSection() {
  const section = document.createElement('div');
  const perf = ENERGY_PERFORMANCE_METRICS;
  section.innerHTML = `
    <div class="energy-section-header">
      <div class="energy-section-title">Energy Performance Metrics</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Operational Efficiency Audit</span>
    </div>
    <div class="energy-perf-grid" style="margin-top:10px;">
      <div class="energy-perf-item">
        <span class="energy-perf-val" style="color:var(--accent-blue);">${perf.generationEfficiencyPercent}%</span>
        <span class="energy-perf-label">Generation Efficiency</span>
      </div>
      <div class="energy-perf-item">
        <span class="energy-perf-val">${perf.energyUtilizationPercent}%</span>
        <span class="energy-perf-label">Energy Utilization</span>
      </div>
      <div class="energy-perf-item">
        <span class="energy-perf-val" style="color:var(--accent-green);">${perf.renewableContributionPercent}%</span>
        <span class="energy-perf-label">Renewable Contribution</span>
      </div>
      <div class="energy-perf-item">
        <span class="energy-perf-val">${perf.avgDailyConsumptionKwh} kWh</span>
        <span class="energy-perf-label">Avg Daily Consumption</span>
      </div>
      <div class="energy-perf-item">
        <span class="energy-perf-val" style="color:var(--accent-orange);">${perf.peakDemandKw} kW</span>
        <span class="energy-perf-label">Peak Demand</span>
      </div>
      <div class="energy-perf-item">
        <span class="energy-perf-val" style="color:var(--accent-green);">${perf.systemAvailabilityPercent}%</span>
        <span class="energy-perf-label">System Availability</span>
      </div>
    </div>
  `;
  return section;
}

// ── INSIGHTS SECTION ──
function buildInsightsSection() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="energy-section-header" style="margin-top:4px;">
      <div class="energy-section-title">Energy Efficiency Insights</div>
      <span style="font-size:11.5px; color:var(--text-muted);">SCADA Telemetry Heuristics</span>
    </div>
    <div class="energy-insights-grid" style="margin-top:10px;">
      ${ENERGY_INSIGHTS.map(ins => `
        <div class="energy-insight-card ${ins.type}">
          <div class="energy-insight-title">${ins.title}</div>
          <div class="energy-insight-text">${ins.text}</div>
        </div>
      `).join('')}
    </div>
  `;
  return section;
}

// ── DIGITAL TWIN & RISK ──
function buildDigitalTwinSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">🌐 Station Digital Twin Interconnect</div>
      <span class="energy-badge energy-badge-blue">Live Telemetry Linked</span>
    </div>
    <div class="energy-card-body" style="display:flex; flex-direction:column; gap:12px;">
      <div style="font-size:12px; color:var(--text-secondary);">
        The Energy Operations Center streams power telemetry directly into the station 3D/2D Digital Twin model to visualize live circuit distribution:
      </div>
      <div style="background:#0f172a; border-radius:var(--radius-md); padding:16px; color:#f8fafc; font-size:12px; display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #334155; padding-bottom:6px;">
          <span>Diesel Generators (GEN-MAI-001 / GEN-BHA-001)</span>
          <span style="color:#38bdf8; font-family:var(--font-mono);">830 kW Out</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #334155; padding-bottom:6px;">
          <span>Main Switchgear & Busbar Distribution</span>
          <span style="color:#4ade80; font-family:var(--font-mono);">Nominal (50.02 Hz)</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #334155; padding-bottom:6px;">
          <span>Habitation Block A Heating Loop</span>
          <span style="color:#fbbf24; font-family:var(--font-mono);">21.4°C / 269.8 kW</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>South Pole Neutrino & Atmospheric Science Wing</span>
          <span style="color:#a78bfa; font-family:var(--font-mono);">Clean Power 127.8 kW</span>
        </div>
      </div>
      <button class="energy-btn energy-btn-secondary energy-btn-sm" id="btn-goto-digital-twin" style="align-self:flex-start;">
        Open 3D Spatial Digital Twin →
      </button>
    </div>
  `;

  setTimeout(() => {
    const btn = section.querySelector('#btn-goto-digital-twin');
    if (btn) {
      btn.addEventListener('click', () => {
        window.location.href = '/index.html#digitalTwin';
      });
    }
  }, 20);

  return section;
}

function buildImpactAndRiskSection() {
  const section = document.createElement('div');
  section.className = 'energy-card';
  const risk = ENERGY_RISK;

  section.innerHTML = `
    <div class="energy-card-header">
      <div class="energy-card-title">⚠️ Cross-Department Impact & Operational Risk</div>
      <span class="energy-badge ${risk.badgeClass}">Risk Level: ${risk.level}</span>
    </div>
    <div class="energy-card-body" style="display:flex; flex-direction:column; gap:14px;">
      <div style="font-size:12px; color:var(--text-secondary); background:var(--bg-muted); padding:10px 12px; border-radius:var(--radius-md);">
        <div style="font-weight:700; margin-bottom:4px;">Risk Assessment Drivers:</div>
        <ul style="padding-left:16px; margin:0; display:flex; flex-direction:column; gap:2px;">
          ${risk.reasons.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <div class="energy-impact-chain">
        <div class="energy-impact-title">${CROSS_DEPARTMENT_IMPACTS[0].title}</div>
        ${CROSS_DEPARTMENT_IMPACTS[0].steps.map((s, i) => `
          ${i > 0 ? '<div class="energy-impact-arrow">↓</div>' : ''}
          <div class="energy-impact-step">
            <span>${i === 0 ? '🔴' : i === CROSS_DEPARTMENT_IMPACTS[0].steps.length - 1 ? '⚠️' : '→'}</span>
            <span>${s}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return section;
}

// ── MAINTENANCE PIPELINE ──
function buildMaintenanceSection() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="energy-section-header">
      <div class="energy-section-title">Energy Maintenance Operations</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Click task to inspect asset</span>
    </div>
    <div class="energy-card" style="margin-top:10px;">
      <div class="energy-card-body">
        <div class="energy-maint-cols">
          <div class="energy-maint-col">
            <div class="energy-maint-col-title col-due">Due Soon (${workingMaintenance.due.length})</div>
            ${workingMaintenance.due.map(m => `
              <div class="energy-maint-item" data-asset-id="${m.assetId}">
                <div class="energy-maint-item-name">${m.name}</div>
                <div class="energy-maint-item-detail">${m.station} · ${m.dueText}</div>
              </div>
            `).join('')}
          </div>

          <div class="energy-maint-col">
            <div class="energy-maint-col-title col-overdue">Overdue (${workingMaintenance.overdue.length})</div>
            ${workingMaintenance.overdue.map(m => `
              <div class="energy-maint-item" data-asset-id="${m.assetId}">
                <div class="energy-maint-item-name">${m.name}</div>
                <div class="energy-maint-item-detail">${m.station} · ${m.dueText}</div>
              </div>
            `).join('')}
          </div>

          <div class="energy-maint-col">
            <div class="energy-maint-col-title col-progress">In Progress (${workingMaintenance.inProgress.length})</div>
            ${workingMaintenance.inProgress.map(m => `
              <div class="energy-maint-item" data-asset-id="${m.assetId}">
                <div class="energy-maint-item-name">${m.name}</div>
                <div class="energy-maint-item-detail">${m.station} · ${m.dueText}</div>
              </div>
            `).join('')}
          </div>

          <div class="energy-maint-col">
            <div class="energy-maint-col-title col-completed">Completed (${workingMaintenance.completed.length})</div>
            ${workingMaintenance.completed.map(m => `
              <div class="energy-maint-item" data-asset-id="${m.assetId}">
                <div class="energy-maint-item-name">${m.name}</div>
                <div class="energy-maint-item-detail">${m.station} · ${m.dueText}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.energy-maint-item').forEach(item => {
      item.addEventListener('click', () => {
        const asset = workingAssets.find(a => a.id === item.dataset.assetId);
        if (asset) openDrawer(asset);
      });
    });
  }, 20);

  return section;
}

// ── ASSET REGISTRY TABLE ──
function getFilteredAssets() {
  let list = workingAssets;
  if (selectedStation !== 'all') {
    list = list.filter(a => a.station === selectedStation);
  }
  if (filterType !== 'all') {
    list = list.filter(a => a.type === filterType);
  }
  if (filterStatus !== 'all') {
    list = list.filter(a => a.status === filterStatus);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.assignee.toLowerCase().includes(q) ||
      a.station.toLowerCase().includes(q)
    );
  }
  return list;
}

function buildAssetTableSection() {
  const section = document.createElement('div');
  section.id = 'energy-table-section';
  section.innerHTML = renderAssetTableInner();
  setTimeout(() => attachTableEvents(section), 20);
  return section;
}

function renderAssetTableInner() {
  const filtered = getFilteredAssets();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const statusBadge = (s) => {
    if (s === 'Operational') return 'energy-badge-green';
    if (s === 'Needs Attention') return 'energy-badge-amber';
    if (s === 'Standby') return 'energy-badge-blue';
    return 'energy-badge-neutral';
  };

  const types = Array.from(new Set(workingAssets.map(a => a.type)));

  return `
    <div class="energy-section-header">
      <div class="energy-section-title">Energy Infrastructure Assets Registry</div>
    </div>
    <div class="energy-card" style="margin-top:10px;">
      <div class="energy-card-body" style="padding-bottom:0;">
        <div class="energy-table-toolbar">
          <input type="text" class="energy-search-input" id="energy-asset-search" placeholder="Search energy assets by name, ID, type, assignee..." value="${searchQuery}" />
          <div class="energy-filter-group">
            <select class="energy-select" id="energy-type-filter">
              <option value="all" ${filterType === 'all' ? 'selected' : ''}>All Asset Types</option>
              ${types.map(t => `<option value="${t}" ${filterType === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
            <select class="energy-select" id="energy-status-filter">
              <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="Operational" ${filterStatus === 'Operational' ? 'selected' : ''}>Operational</option>
              <option value="Needs Attention" ${filterStatus === 'Needs Attention' ? 'selected' : ''}>Needs Attention</option>
              <option value="Standby" ${filterStatus === 'Standby' ? 'selected' : ''}>Standby</option>
            </select>
            <span style="font-size:12px; color:var(--text-muted); white-space:nowrap;">${filtered.length} assets</span>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="energy-data-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Asset ID</th>
                <th>Type</th>
                <th>Station</th>
                <th>Output / Rating</th>
                <th>Health</th>
                <th>Status</th>
                <th>Last Maintenance</th>
                <th>Assignee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${paged.map(asset => `
                <tr data-asset-id="${asset.id}">
                  <td style="font-weight:600;">${asset.name}</td>
                  <td style="font-family:var(--font-mono); font-size:11px; font-weight:600;">${asset.id}</td>
                  <td><span class="energy-badge energy-badge-neutral">${asset.type}</span></td>
                  <td>${asset.station}</td>
                  <td style="font-family:var(--font-mono); font-weight:600;">${asset.output}</td>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div class="energy-meter-bg" style="width:50px;">
                        <div class="energy-meter-fill ${asset.health >= 85 ? 'green' : 'amber'}" style="width:${asset.health}%;"></div>
                      </div>
                      <span style="font-size:11px; font-weight:700;">${asset.health}%</span>
                    </div>
                  </td>
                  <td><span class="energy-badge ${statusBadge(asset.status)}">${asset.status}</span></td>
                  <td style="color:var(--text-muted);">${asset.lastMaintenance}</td>
                  <td><span class="assignee-link" data-name="${asset.assignee}" style="text-decoration:underline; cursor:pointer;">${asset.assignee}</span></td>
                  <td>
                    <button class="energy-btn energy-btn-secondary energy-btn-sm btn-inspect-asset" data-asset-id="${asset.id}">Inspect</button>
                  </td>
                </tr>
              `).join('')}
              ${paged.length === 0 ? '<tr><td colspan="10" style="text-align:center; padding:32px; color:var(--text-muted);">🔍 No energy assets match your search or filter criteria.</td></tr>' : ''}
            </tbody>
          </table>
        </div>

        <div class="energy-table-pagination">
          <span>Showing ${paged.length} of ${filtered.length} assets (Page ${currentPage} of ${totalPages})</span>
          <div class="energy-pagination-btns">
            ${Array.from({ length: totalPages }, (_, i) => `
              <button class="energy-page-btn ${currentPage === i + 1 ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachTableEvents(section) {
  const searchInput = section.querySelector('#energy-asset-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      updateTableOnly();
    });
  }

  const typeFilter = section.querySelector('#energy-type-filter');
  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      filterType = e.target.value;
      currentPage = 1;
      updateTableOnly();
    });
  }

  const statusFilter = section.querySelector('#energy-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      filterStatus = e.target.value;
      currentPage = 1;
      updateTableOnly();
    });
  }

  attachRowEvents(section);
}

function attachRowEvents(section) {
  section.querySelectorAll('.energy-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      updateTableOnly();
    });
  });

  section.querySelectorAll('.btn-inspect-asset').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const asset = workingAssets.find(a => a.id === btn.dataset.assetId);
      if (asset) openDrawer(asset);
    });
  });

  section.querySelectorAll('.energy-data-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      const asset = workingAssets.find(a => a.id === row.dataset.assetId);
      if (asset) openDrawer(asset);
    });
  });

  section.querySelectorAll('.assignee-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const member = ENERGY_TEAM.find(m => m.name === link.dataset.name);
      if (member) openEmployeeDrawer(member);
    });
  });
}

function updateTableOnly() {
  const section = document.getElementById('energy-table-section');
  if (!section) return;
  const searchInput = section.querySelector('#energy-asset-search');
  const hadFocus = document.activeElement === searchInput;
  const selStart = searchInput ? searchInput.selectionStart : 0;
  const selEnd = searchInput ? searchInput.selectionEnd : 0;

  section.innerHTML = renderAssetTableInner();
  attachTableEvents(section);

  if (hadFocus) {
    const newSearch = section.querySelector('#energy-asset-search');
    if (newSearch) {
      newSearch.focus();
      newSearch.setSelectionRange(selStart, selEnd);
    }
  }
}

// ── RECENT ACTIVITY ──
function buildRecentActivitySection() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="energy-section-header">
      <div class="energy-section-title">Recent Energy Activity Audit</div>
    </div>
    <div class="energy-card" style="margin-top:10px;">
      <div class="energy-card-body">
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${RECENT_ENERGY_ACTIVITY.map(entry => `
            <div style="display:flex; align-items:flex-start; gap:14px; padding:6px 0; border-bottom:1px solid var(--bg-muted);">
              <span style="font-family:var(--font-mono); font-size:11.5px; font-weight:700; color:var(--text-muted); min-width:44px;">${entry.time}</span>
              <div style="flex:1;">
                <div style="font-size:12.5px; font-weight:600; color:var(--text-primary);">${entry.action}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Logged by ${entry.person} · Status: Nominal</div>
              </div>
              <span class="energy-badge energy-badge-neutral" style="font-size:9.5px;">Audit</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  return section;
}

// ── DRAWER (ASSET & EMPLOYEE) ──
function buildDrawer() {
  const backdrop = document.createElement('div');
  backdrop.className = 'energy-drawer-backdrop';
  backdrop.id = 'energy-drawer-backdrop';
  backdrop.innerHTML = `
    <div class="energy-drawer" id="energy-drawer">
      <div class="energy-drawer-header">
        <div class="energy-drawer-title" id="drawer-title">Details</div>
        <button class="energy-drawer-close" id="drawer-close-btn" title="Close (Esc)">✕</button>
      </div>
      <div class="energy-drawer-body" id="drawer-body"></div>
      <div class="energy-drawer-actions" id="drawer-actions"></div>
    </div>
  `;

  setTimeout(() => {
    const bd = document.getElementById('energy-drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');
    if (bd) bd.addEventListener('click', (e) => { if (e.target === bd) closeDrawer(); });
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  }, 30);

  return backdrop;
}

function openDrawer(asset) {
  selectedAsset = asset;
  selectedEmployee = null;
  const backdrop = document.getElementById('energy-drawer-backdrop');
  const title = document.getElementById('drawer-title');
  const body = document.getElementById('drawer-body');
  const actions = document.getElementById('drawer-actions');

  if (!backdrop || !body) return;

  title.textContent = `${asset.name} (${asset.id})`;

  const statusBadge = asset.status === 'Operational' ? 'energy-badge-green' : asset.status === 'Needs Attention' ? 'energy-badge-amber' : 'energy-badge-blue';

  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">${asset.id}</span>
      <span class="energy-badge ${statusBadge}">${asset.status}</span>
    </div>

    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Equipment Category</span><span class="energy-drawer-field-value">${asset.type}</span></div>
    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Station Facility</span><span class="energy-drawer-field-value">${asset.station} Research Station</span></div>
    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Rated Output / Capacity</span><span class="energy-drawer-field-value">${asset.output}</span></div>
    <div class="energy-drawer-field">
      <span class="energy-drawer-field-label">System Health</span>
      <span class="energy-drawer-field-value" style="display:flex; align-items:center; gap:8px;">
        <div class="energy-meter-bg" style="width:70px;"><div class="energy-meter-fill ${asset.health >= 85 ? 'green' : 'amber'}" style="width:${asset.health}%;"></div></div>
        <strong>${asset.health}%</strong>
      </span>
    </div>
    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Last Maintenance</span><span class="energy-drawer-field-value">${asset.lastMaintenance}</span></div>
    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Next Service Date</span><span class="energy-drawer-field-value">${asset.nextMaintenance}</span></div>
    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Designated Engineer</span><span class="energy-drawer-field-value">${asset.assignee}</span></div>

    <div style="margin-top:8px;">
      <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">Live Subsystem Telemetry</div>
      <div style="background:var(--bg-muted); padding:10px 12px; border-radius:var(--radius-md); font-family:var(--font-mono); font-size:11.5px; display:flex; flex-direction:column; gap:4px;">
        <div>Electrical Output: ${asset.output} (3-Phase 415V / 50Hz)</div>
        <div>Engine / Cell Temp: ${asset.status === 'Needs Attention' ? '88°C (THERMAL ELEVATION)' : '80°C (NOMINAL)'}</div>
        <div>Vibration Signature: ${asset.status === 'Needs Attention' ? '3.8 mm/s (WARN)' : '1.1 mm/s (NOMINAL)'}</div>
      </div>
    </div>
  `;

  actions.innerHTML = `
    <button class="energy-btn energy-btn-primary energy-btn-sm" id="btn-toggle-asset-status">Toggle Status</button>
    <button class="energy-btn energy-btn-secondary energy-btn-sm" id="btn-sched-asset-maint">Schedule Service</button>
    <button class="energy-btn energy-btn-secondary energy-btn-sm" id="btn-inspect-assignee">View Assignee</button>
  `;

  setTimeout(() => {
    const toggleBtn = document.getElementById('btn-toggle-asset-status');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        asset.status = asset.status === 'Operational' ? 'Needs Attention' : 'Operational';
        asset.health = asset.status === 'Operational' ? 95 : 72;
        openDrawer(asset);
        updateTableOnly();
        showToast(`Asset status updated to: ${asset.status}`, asset.status === 'Operational' ? 'success' : 'warning');
      });
    }

    const schedBtn = document.getElementById('btn-sched-asset-maint');
    if (schedBtn) {
      schedBtn.addEventListener('click', () => {
        asset.nextMaintenance = '15 Sep 2026';
        workingMaintenance.due.unshift({
          assetId: asset.id,
          name: asset.name,
          station: asset.station,
          dueText: 'Scheduled maintenance for 15 Sep 2026',
          priority: 'medium'
        });
        openDrawer(asset);
        updateTableOnly();
        showToast(`Maintenance work order generated for ${asset.name}`, 'success');
      });
    }

    const assigneeBtn = document.getElementById('btn-inspect-assignee');
    if (assigneeBtn) {
      assigneeBtn.addEventListener('click', () => {
        const member = ENERGY_TEAM.find(m => m.name === asset.assignee);
        if (member) openEmployeeDrawer(member);
      });
    }
  }, 20);

  backdrop.classList.add('open');
}

function openEmployeeDrawer(member) {
  selectedEmployee = member;
  selectedAsset = null;
  const backdrop = document.getElementById('energy-drawer-backdrop');
  const title = document.getElementById('drawer-title');
  const body = document.getElementById('drawer-body');
  const actions = document.getElementById('drawer-actions');

  if (!backdrop || !body) return;

  title.textContent = `Personnel Record — ${member.name}`;

  const assignedAssetsList = workingAssets.filter(a => a.assignee === member.name);

  body.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; padding:8px 0; border-bottom:1px solid var(--border-default);">
      <div class="energy-team-avatar" style="width:52px; height:52px; font-size:18px;">${member.avatar}</div>
      <div>
        <div style="font-size:16px; font-weight:700; color:var(--text-primary);">${member.name}</div>
        <div style="font-size:12.5px; color:var(--accent-blue); font-weight:600;">${member.role}</div>
        <div style="font-size:11.5px; color:var(--text-muted); display:flex; align-items:center; gap:6px; margin-top:2px;">
          <span class="energy-online-dot"></span>${member.status} · 📍 ${member.station} Station
        </div>
      </div>
    </div>

    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Employee ID</span><span class="energy-drawer-field-value" style="font-family:var(--font-mono);">${member.id}</span></div>
    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Assigned Station Base</span><span class="energy-drawer-field-value">${member.station} Research Station</span></div>
    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Emergency VHF Channel</span><span class="energy-drawer-field-value">${member.commsChannel}</span></div>
    <div class="energy-drawer-field"><span class="energy-drawer-field-label">Antarctic Expeditions</span><span class="energy-drawer-field-value">${member.polarExperience}</span></div>

    <div style="margin-top:8px;">
      <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">Certifications & Clearances</div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
        <span class="energy-badge energy-badge-blue">Caterpillar Marine Diesel Tier 4</span>
        <span class="energy-badge energy-badge-green">High-Voltage Substation Safety</span>
        <span class="energy-badge energy-badge-purple">Lithium BESS Thermal Management</span>
        <span class="energy-badge energy-badge-neutral">Polar Winterover Survival IV</span>
      </div>
    </div>

    <div style="margin-top:10px;">
      <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">Assigned Energy Assets (${assignedAssetsList.length})</div>
      <div style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto;">
        ${assignedAssetsList.map(a => `
          <div class="energy-card" style="padding:8px 12px; cursor:pointer; display:flex; justify-content:space-between; align-items:center;" data-emp-asset-id="${a.id}">
            <div>
              <div style="font-weight:600; font-size:12px;">${a.name}</div>
              <div style="font-size:10.5px; color:var(--text-muted);">${a.type} · ${a.output}</div>
            </div>
            <span class="energy-badge ${a.status === 'Operational' ? 'energy-badge-green' : 'energy-badge-amber'}" style="font-size:9.5px;">${a.status}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  actions.innerHTML = `
    <button class="energy-btn energy-btn-primary energy-btn-sm" id="btn-ping-employee">Dispatch Radio Comms</button>
    <button class="energy-btn energy-btn-secondary energy-btn-sm" id="btn-reassign-employee">Shift Handover</button>
  `;

  setTimeout(() => {
    body.querySelectorAll('[data-emp-asset-id]').forEach(item => {
      item.addEventListener('click', () => {
        const asset = workingAssets.find(a => a.id === item.dataset.empAssetId);
        if (asset) openDrawer(asset);
      });
    });

    const pingBtn = document.getElementById('btn-ping-employee');
    if (pingBtn) {
      pingBtn.addEventListener('click', () => {
        showToast(`Radio hail transmitted to ${member.name} on ${member.commsChannel}`, 'success');
      });
    }

    const reassignBtn = document.getElementById('btn-reassign-employee');
    if (reassignBtn) {
      reassignBtn.addEventListener('click', () => {
        showToast(`Shift log handover initiated with ${member.name}`, 'info');
      });
    }
  }, 20);

  backdrop.classList.add('open');
}

function closeDrawer() {
  const backdrop = document.getElementById('energy-drawer-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  selectedAsset = null;
  selectedEmployee = null;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});
