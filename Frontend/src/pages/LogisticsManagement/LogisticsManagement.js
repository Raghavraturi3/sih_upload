// Logistics & Supply Operations Center — Main Application Module
// Standalone page module for Antarctic Research Stations (Maitri & Bharati).
// Does NOT modify or overwrite any existing admin dashboard logic.

import './logistics.css';
import Chart from 'chart.js/auto';
import { initAIAssistant } from '../../features/aiVoiceAssistant/index.js';
import {
  STATIONS,
  SUPPLY_OVERVIEW_KPIS,
  SUPPLY_CATEGORIES,
  STATION_INVENTORY_HEALTH,
  CRITICAL_SUPPLIES,
  SUPPLY_COVERAGE,
  CONSUMPTION_TRENDS,
  CONSUMPTION_BREAKDOWN,
  STORAGE_FACILITIES,
  STORAGE_ALERTS,
  RESUPPLY_SCHEDULE,
  INCOMING_SHIPMENTS,
  EMERGENCY_REQUESTS,
  SUPPLY_RISK_ANALYSIS,
  INVENTORY_ITEMS,
  LOGISTICS_TEAM,
  LOGISTICS_ALERTS,
  RECENT_LOGISTICS_ACTIVITY,
  LOGISTICS_IMPACTS,
  LOGISTICS_PERFORMANCE
} from './data/logisticsDemoData.js';

// ── State ──
let selectedStation = 'all';
let selectedCategory = null;
let trendTimeframe = 'today';
let searchQuery = '';
let filterStatus = 'all';
let currentPage = 1;
const PAGE_SIZE = 8;
let selectedItem = null;
let selectedEmployee = null;
let profileDropdownOpen = false;
let emergencyModalOpen = false;

// Working mutable copies for interactive actions
let workingInventory = [...INVENTORY_ITEMS];
let workingRequests = [...EMERGENCY_REQUESTS];
let workingAlerts = [...LOGISTICS_ALERTS];

// Chart instances
let trendChartInstance = null;
let breakdownChartInstance = null;

// ── Toast Notification System ──
function showToast(message, type = 'success') {
  let container = document.getElementById('logistics-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'logistics-toast-container';
    container.className = 'logistics-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `logistics-toast ${type}`;
  const icon = type === 'success' ? '📦' : type === 'warning' ? '⚠️' : type === 'error' ? '🚨' : 'ℹ️';
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
  initAIAssistant();
});

function renderPage() {
  const app = document.getElementById('logistics-app');
  if (!app) return;
  app.innerHTML = '';
  app.appendChild(buildTopbar());

  const content = document.createElement('div');
  content.className = 'logistics-content';

  content.appendChild(buildOverviewSection());
  content.appendChild(buildCategoryGrid());
  content.appendChild(buildEmergencyBanner());

  const healthGrid = document.createElement('div');
  healthGrid.className = 'logistics-grid-2';
  healthGrid.appendChild(buildInventoryHealthSection());
  healthGrid.appendChild(buildSupplyCoverageSection());
  content.appendChild(healthGrid);

  const critShipGrid = document.createElement('div');
  critShipGrid.className = 'logistics-grid-2';
  critShipGrid.appendChild(buildCriticalSuppliesSection());
  critShipGrid.appendChild(buildEmergencyStatusSection());
  content.appendChild(critShipGrid);

  const chartGrid = document.createElement('div');
  chartGrid.className = 'logistics-grid-2-1';
  chartGrid.appendChild(buildTrendChartSection());
  chartGrid.appendChild(buildBreakdownSection());
  content.appendChild(chartGrid);

  const mapShipGrid = document.createElement('div');
  mapShipGrid.className = 'logistics-grid-2';
  mapShipGrid.appendChild(buildLogisticsMapSection());
  mapShipGrid.appendChild(buildResupplyPlanningSection());
  content.appendChild(mapShipGrid);

  content.appendChild(buildShipTrackingSection());

  const storageGrid = document.createElement('div');
  storageGrid.className = 'logistics-grid-2';
  storageGrid.appendChild(buildStorageCapacitySection());
  storageGrid.appendChild(buildSupplyRiskSection());
  content.appendChild(storageGrid);

  const teamAlertGrid = document.createElement('div');
  teamAlertGrid.className = 'logistics-grid-2';
  teamAlertGrid.appendChild(buildAlertsSection());
  teamAlertGrid.appendChild(buildTeamSection());
  content.appendChild(teamAlertGrid);

  content.appendChild(buildPerformanceSection());
  content.appendChild(buildImpactSection());
  content.appendChild(buildInventoryTableSection());
  content.appendChild(buildRecentActivitySection());

  app.appendChild(content);
  app.appendChild(buildDrawer());
  app.appendChild(buildEmergencyModal());

  // Render charts & canvas after DOM paint
  setTimeout(() => {
    initTrendChart();
    initBreakdownChart();
    initLogisticsMap();
  }, 100);
}

// ── TOPBAR ──
function buildTopbar() {
  const bar = document.createElement('header');
  bar.className = 'logistics-topbar';
  bar.innerHTML = `
    <div class="logistics-topbar-left">
      <a href="/index.html" class="logistics-back-link" title="Return to Main Admin Dashboard">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Admin Dashboard
      </a>
      <span class="logistics-topbar-title">Logistics & Supply Management</span>
      <span class="logistics-topbar-subtitle">Monitor inventory, storage, resupply requirements and critical supplies across Antarctic stations.</span>
    </div>
    <div class="logistics-topbar-right">
      <a href="/logistics-command-center.html" class="logistics-back-link" style="border-color: rgba(0, 240, 255, 0.4); color: #00f0ff; background: rgba(0, 240, 255, 0.1);" title="Open Live Fleet & Air Tracking Command Center">
        🚢 Live Tracking Command Center ↗
      </a>
      <div class="logistics-station-tabs" id="station-tabs">
        <button class="logistics-station-tab ${selectedStation === 'all' ? 'active' : ''}" data-station="all">All Stations</button>
        <button class="logistics-station-tab ${selectedStation === 'Maitri' ? 'active' : ''}" data-station="Maitri">Maitri</button>
        <button class="logistics-station-tab ${selectedStation === 'Bharati' ? 'active' : ''}" data-station="Bharati">Bharati</button>
      </div>

      <div class="logistics-sync-pill" title="Telemetry Synchronized with Inmarsat & VHF Logistics Network">
        <span class="logistics-sync-dot"></span>
        <span>Logistics Net (Live)</span>
      </div>

      <div class="logistics-profile-chip" id="profile-chip" title="Account & Operations Profile">
        <div class="logistics-profile-avatar">AS</div>
        <div class="logistics-profile-info">
          <div class="logistics-profile-name">Arjun Sharma</div>
          <div class="logistics-profile-role">Logistics Operations Lead</div>
        </div>
        <span class="logistics-online-dot"></span>
        <div class="logistics-profile-dropdown ${profileDropdownOpen ? 'open' : ''}" id="profile-dropdown">
          <div class="logistics-profile-dd-item" id="dd-view-profile">👤 View Officer Profile</div>
          <div class="logistics-profile-dd-item" id="dd-open-emergency">🚨 New Emergency Supply Request</div>
          <div class="logistics-profile-dd-divider"></div>
          <div class="logistics-profile-dd-item" id="dd-return-admin">🚪 Return to Admin Dashboard</div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    bar.querySelectorAll('.logistics-station-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        selectedStation = tab.dataset.station;
        selectedCategory = null;
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
        openEmployeeDrawer(LOGISTICS_TEAM[0]);
      });
    }

    const openEmergBtn = bar.querySelector('#dd-open-emergency');
    if (openEmergBtn) {
      openEmergBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdownOpen = false;
        dropdown.classList.remove('open');
        openEmergencyModal();
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
  const kpi = SUPPLY_OVERVIEW_KPIS;
  const filtered = getFilteredInventory();
  const stationText = selectedStation === 'all' ? 'Maitri & Bharati' : selectedStation;

  section.innerHTML = `
    <div class="logistics-section-header">
      <div class="logistics-section-title">Supply Overview · ${stationText}</div>
      <span style="font-size:11.5px; color:var(--text-muted); font-family:var(--font-mono);">Automated Polar Inventory Tracking</span>
    </div>
    <div class="logistics-kpi-grid" style="margin-top: 10px;">
      <div class="logistics-kpi-card" data-filter="all" title="Total unique inventory items tracked">
        <div class="logistics-kpi-header">
          <span class="logistics-kpi-title">Total Inventory</span>
          <span>📦</span>
        </div>
        <div class="logistics-kpi-value val-blue">${kpi.totalInventoryItems}</div>
        <div class="logistics-kpi-subtext">Active SKUs on station records</div>
      </div>

      <div class="logistics-kpi-card" data-filter="Critical" title="Items below safety reserve buffer">
        <div class="logistics-kpi-header">
          <span class="logistics-kpi-title">Critical Items</span>
          <span>🔴</span>
        </div>
        <div class="logistics-kpi-value val-red">${kpi.criticalItems}</div>
        <div class="logistics-kpi-subtext">High outage operational risk</div>
      </div>

      <div class="logistics-kpi-card" data-filter="Needs Attention" title="Items nearing reorder threshold">
        <div class="logistics-kpi-header">
          <span class="logistics-kpi-title">Low Stock</span>
          <span>⚠️</span>
        </div>
        <div class="logistics-kpi-value val-amber">${kpi.lowStock}</div>
        <div class="logistics-kpi-subtext">Reorder window active</div>
      </div>

      <div class="logistics-kpi-card" title="Cargo containers and pallets on inbound vessels">
        <div class="logistics-kpi-header">
          <span class="logistics-kpi-title">In Transit</span>
          <span>🚢</span>
        </div>
        <div class="logistics-kpi-value val-cyan">${kpi.inTransit}</div>
        <div class="logistics-kpi-subtext">Scheduled summer resupply</div>
      </div>

      <div class="logistics-kpi-card" title="Depot volume utilized">
        <div class="logistics-kpi-header">
          <span class="logistics-kpi-title">Storage Utilization</span>
          <span>🏢</span>
        </div>
        <div class="logistics-kpi-value val-blue">${kpi.storageUtilizationPercent}%</div>
        <div class="logistics-kpi-subtext">Bharati near ceiling (93%)</div>
      </div>

      <div class="logistics-kpi-card" title="Average days of mission autonomy">
        <div class="logistics-kpi-header">
          <span class="logistics-kpi-title">Days of Supply</span>
          <span>🗓️</span>
        </div>
        <div class="logistics-kpi-value val-green">${kpi.daysOfSupplyAvg} <span style="font-size:14px; font-weight:600;">Days</span></div>
        <div class="logistics-kpi-subtext">Average mission autonomy</div>
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.logistics-kpi-card[data-filter]').forEach(card => {
      card.addEventListener('click', () => {
        filterStatus = card.dataset.filter;
        currentPage = 1;
        updateTableOnly();
        showToast(`Filtered inventory by: ${filterStatus === 'all' ? 'All Items' : filterStatus}`, 'info');
      });
    });
  }, 20);

  return section;
}

// ── CATEGORY GRID ──
function buildCategoryGrid() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="logistics-section-header" style="margin-top: 4px;">
      <div class="logistics-section-title">Supply Category Overview</div>
      ${selectedCategory ? `<button class="logistics-btn logistics-btn-secondary logistics-btn-sm" id="btn-clear-cat">Clear Category Filter</button>` : '<span style="font-size:11.5px; color:var(--text-muted);">Click category to filter inventory</span>'}
    </div>
    <div class="logistics-cat-grid" style="margin-top: 10px;">
      ${SUPPLY_CATEGORIES.map(cat => {
        const isSelected = selectedCategory === cat.id;
        const color = cat.status === 'Healthy' || cat.status === 'Normal' ? 'green' : 'amber';
        return `
          <div class="logistics-cat-card ${isSelected ? 'selected' : ''}" data-cat-id="${cat.id}">
            <div class="logistics-cat-top">
              <span class="logistics-cat-name">${cat.icon} ${cat.name}</span>
              <span class="logistics-badge ${cat.status === 'Healthy' ? 'logistics-badge-green' : cat.status === 'Normal' ? 'logistics-badge-blue' : 'logistics-badge-amber'}">${cat.status}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
              <div>
                <div style="font-size:20px; font-weight:800; font-family:var(--font-mono); color:var(--text-primary);">${cat.stockPercent}%</div>
                <div style="font-size:11px; color:var(--text-muted);">${cat.daysRemaining ? `${cat.daysRemaining} days remaining` : `${cat.availablePercent}% available`}</div>
              </div>
              <div style="text-align:right; font-size:11px; font-weight:600; color:${cat.criticalCount ? 'var(--accent-red)' : 'var(--accent-green)'};">
                ${cat.criticalCount ? `🔴 ${cat.criticalCount} Critical` : '✅ All Stocked'}
              </div>
            </div>

            <div class="logistics-meter-bg">
              <div class="logistics-meter-fill ${color}" style="width:${cat.stockPercent}%;"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.logistics-cat-card').forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.dataset.catId;
        selectedCategory = selectedCategory === catId ? null : catId;
        currentPage = 1;
        renderPage();
      });
    });

    const clearBtn = section.querySelector('#btn-clear-cat');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedCategory = null;
        currentPage = 1;
        renderPage();
      });
    }
  }, 20);

  return section;
}

// ── EMERGENCY REQUEST BANNER ──
function buildEmergencyBanner() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="logistics-emergency-card">
      <div class="logistics-emergency-content">
        <div class="logistics-emergency-title">
          <span>🚨</span>
          <span>Emergency Logistics Response Center</span>
        </div>
        <div class="logistics-emergency-desc">
          Generator 02 ECM module at Bharati is at zero stock. Fast-track air dispatch from Christchurch / McMurdo is prepared.
        </div>
      </div>
      <button class="logistics-btn logistics-btn-danger" id="btn-trigger-emergency">
        <span>+</span> Submit Emergency Supply Request
      </button>
    </div>
  `;

  setTimeout(() => {
    const btn = section.querySelector('#btn-trigger-emergency');
    if (btn) btn.addEventListener('click', openEmergencyModal);
  }, 20);

  return section;
}

// ── INVENTORY HEALTH ──
function buildInventoryHealthSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  const filtered = selectedStation === 'all' ? STATION_INVENTORY_HEALTH : STATION_INVENTORY_HEALTH.filter(s => s.station === selectedStation);

  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">🏥 Station Inventory Health Index</div>
      <span class="logistics-badge logistics-badge-green">Audit Synchronized</span>
    </div>
    <div class="logistics-card-body" style="display:flex; flex-direction:column; gap:16px;">
      ${filtered.map(st => {
        const dotCol = (status) => status === 'Healthy' || status === 'Normal' ? 'green' : status === 'Attention' ? 'amber' : 'red';
        return `
          <div class="logistics-health-card">
            <div class="logistics-health-header">
              <div>
                <div class="logistics-health-title">🇮🇳 ${st.station.toUpperCase()} STATION</div>
                <div style="font-size:11px; color:var(--text-muted);">Storage Used: ${st.storageUsedUnits} / ${st.storageCapacityUnits} units (${st.storageUsedPercent}%)</div>
              </div>
              <div class="logistics-health-score" style="color:${st.healthPercent >= 85 ? 'var(--accent-green)' : 'var(--accent-amber)'};">
                ${st.healthPercent}%
              </div>
            </div>

            <div class="logistics-meter-bg">
              <div class="logistics-meter-fill ${st.healthPercent >= 85 ? 'green' : 'amber'}" style="width:${st.healthPercent}%;"></div>
            </div>

            <div class="logistics-chips-row">
              <span class="logistics-chip"><span class="logistics-chip-dot ${dotCol(st.fuelStatus)}"></span>Fuel: ${st.fuelStatus}</span>
              <span class="logistics-chip"><span class="logistics-chip-dot ${dotCol(st.foodStatus)}"></span>Food: ${st.foodStatus}</span>
              <span class="logistics-chip"><span class="logistics-chip-dot ${dotCol(st.medicalStatus)}"></span>Medical: ${st.medicalStatus}</span>
              <span class="logistics-chip"><span class="logistics-chip-dot ${dotCol(st.sparesStatus)}"></span>Spares: ${st.sparesStatus}</span>
              <span class="logistics-chip"><span class="logistics-chip-dot ${dotCol(st.scientificStatus)}"></span>Science: ${st.scientificStatus}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return section;
}

// ── SUPPLY COVERAGE (DAYS OF SUPPLY) ──
function buildSupplyCoverageSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">⏳ Supply Operational Coverage (Days Remaining)</div>
      <span style="font-size:11.5px; color:var(--text-muted);">30-Day Safe Winter Baseline</span>
    </div>
    <div class="logistics-card-body">
      <div class="logistics-coverage-list">
        ${SUPPLY_COVERAGE.map(cov => {
          const color = cov.status === 'Healthy' ? 'green' : cov.status === 'Normal' ? 'blue' : cov.status === 'Attention' ? 'amber' : 'red';
          const pct = Math.min(100, Math.round((cov.days / 60) * 100));
          return `
            <div class="logistics-coverage-item">
              <div class="logistics-coverage-top">
                <span style="font-weight:600; color:var(--text-primary);">${cov.category}</span>
                <span style="font-family:var(--font-mono); font-weight:700; color:${cov.status === 'Critical' ? 'var(--accent-red)' : 'var(--text-primary)'};">${cov.days} Days (${cov.stockText})</span>
              </div>
              <div class="logistics-meter-bg">
                <div class="logistics-meter-fill ${color}" style="width:${pct}%;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  return section;
}

// ── CRITICAL SUPPLIES ──
function buildCriticalSuppliesSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  const filtered = selectedStation === 'all' ? CRITICAL_SUPPLIES : CRITICAL_SUPPLIES.filter(c => c.station === selectedStation);

  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">⚠️ Critical Shortage Watchlist</div>
      <span class="logistics-badge logistics-badge-red">${filtered.length} Items Require Action</span>
    </div>
    <div class="logistics-card-body">
      <div class="logistics-critical-list">
        ${filtered.map(crit => `
          <div class="logistics-critical-item" data-crit-id="${crit.id}" title="Click to inspect item and actions">
            <div class="logistics-critical-item-left">
              <div class="logistics-critical-item-title">${crit.item}</div>
              <div class="logistics-critical-item-meta">${crit.station} · Stock: <strong>${crit.currentStock}</strong> (Min: ${crit.minRequired}) · Burn: ${crit.dailyConsumption}</div>
              <div style="font-size:11px; color:${crit.riskLevel === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-amber)'}; margin-top:3px;">
                🚨 ${crit.actionRequired}
              </div>
            </div>
            <div style="text-align:right;">
              <span class="logistics-badge ${crit.riskLevel === 'CRITICAL' ? 'logistics-badge-red' : 'logistics-badge-amber'}">${crit.riskLevel}</span>
              <div style="font-size:10.5px; color:var(--text-muted); margin-top:4px;">${crit.nextResupply}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.logistics-critical-item').forEach(item => {
      item.addEventListener('click', () => {
        const found = workingInventory.find(i => i.id === item.dataset.critId);
        if (found) openDrawer(found);
      });
    });
  }, 20);

  return section;
}

// ── EMERGENCY LOGISTICS STATUS ──
function buildEmergencyStatusSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">🚁 Emergency Logistics Dispatch Status</div>
      <span class="logistics-badge logistics-badge-red">${workingRequests.length} Active Tickets</span>
    </div>
    <div class="logistics-card-body" style="display:flex; flex-direction:column; gap:12px;">
      ${workingRequests.map(req => `
        <div style="background:var(--bg-muted); border-radius:var(--radius-md); padding:12px 14px; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; font-family:var(--font-mono); font-size:12.5px; color:var(--accent-blue);">${req.id} (${req.station})</span>
            <span class="logistics-badge ${req.priority === 'CRITICAL' ? 'logistics-badge-red' : 'logistics-badge-amber'}">${req.status}</span>
          </div>
          <div style="font-weight:600; font-size:12.5px; color:var(--text-primary);">${req.requiredItem}</div>
          <div style="font-size:11px; color:var(--text-muted);">${req.reason}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px;">
            <span>Deadline: <strong>${req.requiredBy}</strong></span>
            <span>Progress: <strong>${req.progress}%</strong></span>
          </div>
          <div class="logistics-meter-bg">
            <div class="logistics-meter-fill blue" style="width:${req.progress}%;"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return section;
}

// ── TREND CHART ──
function buildTrendChartSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">📈 Supply Consumption Trends</div>
      <div class="logistics-chart-tabs" id="trend-timeframe-tabs">
        <button class="logistics-chart-tab ${trendTimeframe === 'today' ? 'active' : ''}" data-tf="today">24H</button>
        <button class="logistics-chart-tab ${trendTimeframe === 'sevenDays' ? 'active' : ''}" data-tf="sevenDays">7D</button>
        <button class="logistics-chart-tab ${trendTimeframe === 'thirtyDays' ? 'active' : ''}" data-tf="thirtyDays">30D</button>
      </div>
    </div>
    <div class="logistics-card-body">
      <div class="logistics-chart-container">
        <canvas id="logistics-trend-canvas"></canvas>
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.logistics-chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        section.querySelectorAll('.logistics-chart-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        trendTimeframe = tab.dataset.tf;
        updateTrendChart();
      });
    });
  }, 20);

  return section;
}

function initTrendChart() {
  const canvas = document.getElementById('logistics-trend-canvas');
  if (!canvas) return;
  const data = CONSUMPTION_TRENDS[trendTimeframe];

  if (trendChartInstance) trendChartInstance.destroy();

  trendChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Fuel (Liters)',
          data: data.fuel,
          borderColor: '#ea580c',
          backgroundColor: 'rgba(234,88,12,0.06)',
          tension: 0.35,
          fill: true,
          pointRadius: 3
        },
        {
          label: 'Food Rations (Packs)',
          data: data.food,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          tension: 0.35,
          pointRadius: 3
        },
        {
          label: 'Scientific Materials (Units)',
          data: data.scientific,
          borderColor: '#2563eb',
          backgroundColor: 'transparent',
          borderDash: [4, 4],
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
        legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
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
  const data = CONSUMPTION_TRENDS[trendTimeframe];
  trendChartInstance.data.labels = data.labels;
  trendChartInstance.data.datasets[0].data = data.fuel;
  trendChartInstance.data.datasets[1].data = data.food;
  trendChartInstance.data.datasets[2].data = data.scientific;
  trendChartInstance.update();
}

// ── CONSUMPTION BREAKDOWN ──
function buildBreakdownSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">🥧 Consumption by Category</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Station Aggregate</span>
    </div>
    <div class="logistics-card-body" style="display:flex; flex-direction:column; gap:12px;">
      <div style="position:relative; height:150px; display:flex; justify-content:center;">
        <canvas id="logistics-breakdown-canvas"></canvas>
      </div>

      <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">
        ${CONSUMPTION_BREAKDOWN.slice(0, 5).map(cat => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid var(--bg-muted); font-size:12px;">
            <span style="display:flex; align-items:center; gap:8px;">
              <span style="width:8px; height:8px; border-radius:2px; background:${cat.color};"></span>
              ${cat.category}
            </span>
            <span style="font-family:var(--font-mono); font-weight:700;">${cat.percent}%</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return section;
}

function initBreakdownChart() {
  const canvas = document.getElementById('logistics-breakdown-canvas');
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
        legend: { display: false }
      }
    }
  });
}

// ── 2D LOGISTICS OVERVIEW MAP SCHEMATIC ──
function buildLogisticsMapSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">🗺️ Polar Maritime & Air Logistics Route Map</div>
      <span class="logistics-badge logistics-badge-blue">DEMO / SIMULATED TRACKING</span>
    </div>
    <div class="logistics-card-body" style="padding:0;">
      <div class="logistics-map-container">
        <canvas id="logistics-map-canvas" class="logistics-map-canvas"></canvas>
      </div>
    </div>
  `;
  return section;
}

function initLogisticsMap() {
  const canvas = document.getElementById('logistics-map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  function draw() {
    if (!document.getElementById('logistics-map-canvas')) return;
    ctx.fillStyle = '#0c1221';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Map Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Latitude rings
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height + 60, 220, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height + 60, 140, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // Antarctic Coastline representation
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height, canvas.width * 0.45, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Staged Ports / Origins
    const capeTown = { x: canvas.width * 0.22, y: 35, name: 'Cape Town (RSA)' };
    const goa = { x: canvas.width * 0.78, y: 35, name: 'Goa / Port Louis' };
    const maitri = { x: canvas.width * 0.28, y: canvas.height - 45, name: 'Maitri Base' };
    const bharati = { x: canvas.width * 0.72, y: canvas.height - 40, name: 'Bharati Base' };

    // Draw route 1 (Cape Town to Maitri)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(capeTown.x, capeTown.y);
    ctx.bezierCurveTo(capeTown.x - 30, canvas.height * 0.5, maitri.x - 20, canvas.height * 0.7, maitri.x, maitri.y);
    ctx.stroke();

    // Draw route 2 (Goa to Bharati)
    ctx.strokeStyle = '#4ade80';
    ctx.beginPath();
    ctx.moveTo(goa.x, goa.y);
    ctx.bezierCurveTo(goa.x + 20, canvas.height * 0.5, bharati.x + 20, canvas.height * 0.7, bharati.x, bharati.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Animated ships
    const now = Date.now();
    const ship1T = (now % 6000) / 6000;
    const s1X = capeTown.x + (maitri.x - capeTown.x) * 0.78;
    const s1Y = capeTown.y + (maitri.y - capeTown.y) * 0.78;

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(s1X, s1Y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('🚢 MV Golovnin (78%)', s1X + 10, s1Y + 3);

    const s2X = goa.x + (bharati.x - goa.x) * 0.52;
    const s2Y = goa.y + (bharati.y - goa.y) * 0.52;
    ctx.fillStyle = '#4ade80';
    ctx.beginPath(); ctx.arc(s2X, s2Y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('🚢 RV Palmer (52%)', s2X - 110, s2Y + 3);

    // Station dots
    [maitri, bharati].forEach(st => {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(st.x, st.y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(`📍 ${st.name}`, st.x - 30, st.y + 18);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// ── RESUPPLY PLANNING ──
function buildResupplyPlanningSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">📅 Seasonal Resupply Missions</div>
      <span style="font-size:11.5px; color:var(--text-muted);">2026/2027 Summer Expedition</span>
    </div>
    <div class="logistics-card-body" style="display:flex; flex-direction:column; gap:12px;">
      ${RESUPPLY_SCHEDULE.map(sch => `
        <div style="background:var(--bg-muted); border-radius:var(--radius-md); padding:12px 14px; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; font-size:13px; color:var(--text-primary);">${sch.station} Expedition Resupply</span>
            <span class="logistics-badge ${sch.daysUntilArrival <= 12 ? 'logistics-badge-blue' : 'logistics-badge-amber'}">ETA: ${sch.daysUntilArrival} Days</span>
          </div>
          <div style="font-size:11.5px; color:var(--text-muted);">Vessel: <strong>${sch.vessel}</strong> (${sch.mode})</div>
          <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
            Cargo: ${sch.supplies.join(' · ')}
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:4px;">
            <span>Voyage Completion</span>
            <strong>${sch.progress}%</strong>
          </div>
          <div class="logistics-meter-bg">
            <div class="logistics-meter-fill blue" style="width:${sch.progress}%;"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return section;
}

// ── SHIP & CARGO TRACKING ──
function buildShipTrackingSection() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="logistics-section-header">
      <div class="logistics-section-title">Shipment & Inbound Cargo Tracking</div>
      <span class="logistics-badge logistics-badge-blue">DEMO / SIMULATED VESSEL TELEMETRY</span>
    </div>
    <div class="logistics-grid-3" style="margin-top:10px;">
      ${INCOMING_SHIPMENTS.map(ship => `
        <div class="logistics-ship-card">
          <div class="logistics-ship-header">
            <span class="logistics-ship-title">${ship.vessel}</span>
            <span class="logistics-badge logistics-badge-green">${ship.status}</span>
          </div>

          <div style="font-size:11px; color:var(--text-muted);">
            Route: <strong>${ship.origin} → ${ship.destination}</strong>
          </div>

          <div class="logistics-ship-grid">
            <div class="logistics-ship-item">
              <span class="logistics-ship-label">Estimated Arrival</span>
              <span class="logistics-ship-val">${ship.eta}</span>
            </div>
            <div class="logistics-ship-item">
              <span class="logistics-ship-label">Current Position</span>
              <span class="logistics-ship-val">${ship.position}</span>
            </div>
            <div class="logistics-ship-item">
              <span class="logistics-ship-label">Sea Conditions</span>
              <span class="logistics-ship-val">${ship.seaState}</span>
            </div>
            <div class="logistics-ship-item">
              <span class="logistics-ship-label">Cargo Integrity</span>
              <span class="logistics-ship-val" style="color:var(--accent-green);">${ship.cargoStatus}</span>
            </div>
          </div>

          <div style="font-size:11px; color:var(--text-secondary); background:var(--bg-surface); padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-default);">
            Manifest: ${ship.cargoSummary}
          </div>

          <div style="display:flex; justify-content:space-between; font-size:11px;">
            <span>Transit Progress</span>
            <strong>${ship.progress}%</strong>
          </div>
          <div class="logistics-meter-bg">
            <div class="logistics-meter-fill blue" style="width:${ship.progress}%;"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return section;
}

// ── STORAGE CAPACITY SECTION ──
function buildStorageCapacitySection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">🏢 Station Storage Facility Utilization</div>
      <span class="logistics-badge logistics-badge-amber">Bharati Near Ceiling</span>
    </div>
    <div class="logistics-card-body" style="display:flex; flex-direction:column; gap:16px;">
      ${STORAGE_FACILITIES.map(fac => `
        <div class="logistics-storage-station">
          <div class="logistics-storage-header">
            <div>
              <div style="font-weight:700; font-size:13.5px;">${fac.station} — ${fac.facility}</div>
              <div style="font-size:11px; color:var(--text-muted);">${fac.used.toLocaleString()} used / ${fac.totalCapacity.toLocaleString()} total units (${fac.available.toLocaleString()} available)</div>
            </div>
            <span class="logistics-badge ${fac.utilizationPercent >= 90 ? 'logistics-badge-amber' : 'logistics-badge-green'}">${fac.status} (${fac.utilizationPercent}%)</span>
          </div>

          <div class="logistics-meter-bg">
            <div class="logistics-meter-fill ${fac.utilizationPercent >= 90 ? 'amber' : 'green'}" style="width:${fac.utilizationPercent}%;"></div>
          </div>

          <div class="logistics-storage-compartments">
            ${fac.breakdown.map(b => `
              <div class="logistics-storage-comp-row">
                <div style="display:flex; justify-content:space-between; color:var(--text-secondary);">
                  <span>${b.name}</span>
                  <strong>${b.used} / ${b.capacity} (${b.percent}%)</strong>
                </div>
                <div class="logistics-meter-bg" style="height:4px;">
                  <div class="logistics-meter-fill ${b.percent >= 90 ? 'amber' : 'blue'}" style="width:${b.percent}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return section;
}

// ── SUPPLY RISK & FORECAST ──
function buildSupplyRiskSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">⚠️ Supply Risk & Shortage Forecast</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Predictive Burn Decision Support</span>
    </div>
    <div class="logistics-card-body" style="display:flex; flex-direction:column; gap:12px;">
      ${SUPPLY_RISK_ANALYSIS.map(risk => `
        <div style="background:var(--bg-muted); border-radius:var(--radius-md); padding:12px 14px; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; font-size:13px; color:var(--text-primary);">${risk.supply}</span>
            <span class="logistics-badge ${risk.badgeClass}">${risk.level}</span>
          </div>
          <div style="font-size:11.5px; color:var(--text-muted);">${risk.station} · Buffer: <strong>${risk.daysRemaining}</strong></div>
          <div style="font-size:11px; color:var(--text-secondary);">${risk.reason}</div>
          <div style="font-size:11px; font-weight:600; color:var(--accent-blue); margin-top:2px;">
            💡 Recommendation: ${risk.recommendedAction}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return section;
}

// ── ALERTS SECTION ──
function buildAlertsSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  const filtered = selectedStation === 'all' ? workingAlerts : workingAlerts.filter(a => a.station === selectedStation);

  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">🔔 Logistics & Supply Alerts</div>
      <span style="font-size:11.5px; color:var(--text-muted);">${filtered.length} Active</span>
    </div>
    <div class="logistics-card-body">
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${filtered.map(al => {
          const dotClass = al.type === 'CRITICAL' ? 'dot-critical' : al.type === 'WARNING' ? 'dot-warning' : 'dot-resolved';
          return `
            <div style="display:flex; align-items:flex-start; gap:12px; padding:10px 14px; background:var(--bg-muted); border-radius:var(--radius-md); cursor:pointer;" data-alert-asset="${al.assetId}">
              <div class="logistics-chip-dot ${al.type === 'CRITICAL' ? 'red' : al.type === 'WARNING' ? 'amber' : 'green'}" style="margin-top:6px;"></div>
              <div style="flex:1;">
                <div style="font-size:12.5px; font-weight:600; color:var(--text-primary);">${al.title}</div>
                <div style="font-size:11px; color:var(--text-muted);">${al.station} · ${al.timestamp} · ${al.detail}</div>
              </div>
              <span class="logistics-badge ${al.type === 'CRITICAL' ? 'logistics-badge-red' : al.type === 'WARNING' ? 'logistics-badge-amber' : 'logistics-badge-green'}">${al.type}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('[data-alert-asset]').forEach(item => {
      item.addEventListener('click', () => {
        const found = workingInventory.find(i => i.id === item.dataset.alertAsset);
        if (found) openDrawer(found);
      });
    });
  }, 20);

  return section;
}

// ── TEAM SECTION ──
function buildTeamSection() {
  const section = document.createElement('div');
  section.className = 'logistics-card';
  const filtered = selectedStation === 'all' ? LOGISTICS_TEAM : LOGISTICS_TEAM.filter(t => t.station === selectedStation || t.station === 'HQ');

  section.innerHTML = `
    <div class="logistics-card-header">
      <div class="logistics-card-title">👥 Logistics Operations Team</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Click to open Profile</span>
    </div>
    <div class="logistics-card-body" style="display:flex; flex-direction:column; gap:10px;">
      ${filtered.map(member => `
        <div class="logistics-cat-card" data-member-id="${member.id}" style="padding:12px; cursor:pointer;" title="Click to view profile">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="logistics-profile-avatar" style="width:40px; height:40px; font-size:13px;">${member.avatar}</div>
            <div style="flex:1;">
              <div style="font-weight:700; font-size:13px;">${member.name}</div>
              <div style="font-size:11.5px; color:var(--accent-blue); font-weight:600;">${member.role} · ${member.station}</div>
              <div style="font-size:11px; color:var(--text-muted); display:flex; gap:8px; margin-top:2px;">
                <span>● ${member.status}</span>
                <span>📻 ${member.commsChannel}</span>
                <span>📋 ${member.activeRequests} Requests</span>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('[data-member-id]').forEach(card => {
      card.addEventListener('click', () => {
        const member = LOGISTICS_TEAM.find(m => m.id === card.dataset.memberId);
        if (member) openEmployeeDrawer(member);
      });
    });
  }, 20);

  return section;
}

// ── PERFORMANCE SECTION ──
function buildPerformanceSection() {
  const section = document.createElement('div');
  const perf = LOGISTICS_PERFORMANCE;
  section.innerHTML = `
    <div class="logistics-section-header">
      <div class="logistics-section-title">Logistics & Supply Chain Performance</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Polar Cold-Chain Audit</span>
    </div>
    <div class="logistics-kpi-grid" style="margin-top:10px;">
      <div class="logistics-kpi-card">
        <span class="logistics-kpi-title">Inventory Accuracy</span>
        <div class="logistics-kpi-value val-green">${perf.inventoryAccuracyPercent}%</div>
        <span class="logistics-kpi-subtext">RFID & Barcode scanned</span>
      </div>
      <div class="logistics-kpi-card">
        <span class="logistics-kpi-title">On-Time Resupply</span>
        <div class="logistics-kpi-value val-blue">${perf.onTimeResupplyPercent}%</div>
        <span class="logistics-kpi-subtext">Icebreaker voyage window</span>
      </div>
      <div class="logistics-kpi-card">
        <span class="logistics-kpi-title">Critical Availability</span>
        <div class="logistics-kpi-value val-amber">${perf.criticalSupplyAvailabilityPercent}%</div>
        <span class="logistics-kpi-subtext">Life support & power spares</span>
      </div>
      <div class="logistics-kpi-card">
        <span class="logistics-kpi-title">Storage Utilization</span>
        <div class="logistics-kpi-value val-blue">${perf.storageUtilizationPercent}%</div>
        <span class="logistics-kpi-subtext">Across station depots</span>
      </div>
      <div class="logistics-kpi-card">
        <span class="logistics-kpi-title">Open Supply Requests</span>
        <div class="logistics-kpi-value val-cyan">${perf.openSupplyRequests}</div>
        <span class="logistics-kpi-subtext">Pending summer staging</span>
      </div>
      <div class="logistics-kpi-card">
        <span class="logistics-kpi-title">Active Shipments</span>
        <div class="logistics-kpi-value val-green">${perf.activeShipments}</div>
        <span class="logistics-kpi-subtext">Vessels & aircraft</span>
      </div>
    </div>
  `;
  return section;
}

// ── DIGITAL TWIN CROSS-DEPARTMENT IMPACT ──
function buildImpactSection() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="logistics-section-header" style="margin-top:4px;">
      <div class="logistics-section-title">Digital Twin Cross-Department Cascade Impact</div>
      <span style="font-size:11.5px; color:var(--text-muted);">Supply Chain Dependency Matrix</span>
    </div>
    <div class="logistics-grid-2" style="margin-top:10px;">
      ${LOGISTICS_IMPACTS.map(imp => `
        <div class="logistics-card" style="padding:16px;">
          <div style="font-weight:700; font-size:13px; color:var(--text-primary); margin-bottom:10px;">${imp.title}</div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${imp.steps.map((s, i) => `
              ${i > 0 ? '<div style="color:var(--accent-red); font-size:11px; padding-left:8px;">↓</div>' : ''}
              <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text-secondary); background:var(--bg-muted); padding:6px 10px; border-radius:var(--radius-sm);">
                <span>${i === 0 ? '🔴' : i === imp.steps.length - 1 ? '⚠️' : '→'}</span>
                <span>${s}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return section;
}

// ── INVENTORY TABLE SECTION ──
function getFilteredInventory() {
  let list = workingInventory;
  if (selectedStation !== 'all') {
    list = list.filter(i => i.station === selectedStation);
  }
  if (selectedCategory) {
    const catObj = SUPPLY_CATEGORIES.find(c => c.id === selectedCategory);
    if (catObj) list = list.filter(i => i.category === catObj.name);
  }
  if (filterStatus !== 'all') {
    list = list.filter(i => i.status === filterStatus);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(i =>
      i.item.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.assignee.toLowerCase().includes(q) ||
      i.storageLocation.toLowerCase().includes(q) ||
      i.station.toLowerCase().includes(q)
    );
  }
  return list;
}

function buildInventoryTableSection() {
  const section = document.createElement('div');
  section.id = 'logistics-table-section';
  section.innerHTML = renderTableInner();
  setTimeout(() => attachTableEvents(section), 20);
  return section;
}

function renderTableInner() {
  const filtered = getFilteredInventory();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const statusBadge = (s) => {
    if (s === 'Operational') return 'logistics-badge-green';
    if (s === 'Needs Attention') return 'logistics-badge-amber';
    if (s === 'Critical') return 'logistics-badge-red';
    return 'logistics-badge-neutral';
  };

  return `
    <div class="logistics-section-header">
      <div class="logistics-section-title">Station Inventory & Supplies Registry</div>
    </div>
    <div class="logistics-card" style="margin-top:10px;">
      <div class="logistics-card-body" style="padding-bottom:0;">
        <div class="logistics-table-toolbar">
          <input type="text" class="logistics-search-input" id="logistics-search-input" placeholder="Search supplies, equipment or inventory by SKU, name, assignee..." value="${searchQuery}" />
          <div class="logistics-filter-group">
            <select class="logistics-select" id="logistics-status-filter">
              <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="Operational" ${filterStatus === 'Operational' ? 'selected' : ''}>Operational</option>
              <option value="Needs Attention" ${filterStatus === 'Needs Attention' ? 'selected' : ''}>Needs Attention</option>
              <option value="Critical" ${filterStatus === 'Critical' ? 'selected' : ''}>Critical</option>
            </select>
            <span style="font-size:12px; color:var(--text-muted); white-space:nowrap;">${filtered.length} items</span>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="logistics-data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>SKU ID</th>
                <th>Category</th>
                <th>Station</th>
                <th>Stock / Min</th>
                <th>Daily Burn</th>
                <th>Days Remaining</th>
                <th>Status</th>
                <th>Location</th>
                <th>Assignee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${paged.map(item => `
                <tr data-item-id="${item.id}">
                  <td style="font-weight:600;">${item.item}</td>
                  <td style="font-family:var(--font-mono); font-size:11px; font-weight:600;">${item.id}</td>
                  <td><span class="logistics-badge logistics-badge-neutral">${item.category}</span></td>
                  <td>${item.station}</td>
                  <td style="font-family:var(--font-mono); font-weight:700;">${item.currentStock} <span style="color:var(--text-muted); font-size:11px; font-weight:400;">/ ${item.minStock}</span></td>
                  <td style="font-size:11.5px; color:var(--text-muted);">${item.dailyConsumption}</td>
                  <td style="font-weight:700; color:${item.daysRemaining <= 5 ? 'var(--accent-red)' : item.daysRemaining <= 15 ? 'var(--accent-amber)' : 'var(--text-primary)'};">${item.daysRemaining} Days</td>
                  <td><span class="logistics-badge ${statusBadge(item.status)}">${item.status}</span></td>
                  <td style="font-size:11.5px; color:var(--text-muted);">${item.storageLocation}</td>
                  <td><span class="assignee-link" data-name="${item.assignee}" style="text-decoration:underline; cursor:pointer;">${item.assignee}</span></td>
                  <td>
                    <button class="logistics-btn logistics-btn-secondary logistics-btn-sm btn-inspect-item" data-item-id="${item.id}">Inspect</button>
                  </td>
                </tr>
              `).join('')}
              ${paged.length === 0 ? '<tr><td colspan="11" style="text-align:center; padding:32px; color:var(--text-muted);">🔍 No inventory records found matching your criteria.</td></tr>' : ''}
            </tbody>
          </table>
        </div>

        <div class="logistics-table-pagination">
          <span>Showing ${paged.length} of ${filtered.length} items (Page ${currentPage} of ${totalPages})</span>
          <div class="logistics-pagination-btns">
            ${Array.from({ length: totalPages }, (_, i) => `
              <button class="logistics-page-btn ${currentPage === i + 1 ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachTableEvents(section) {
  const searchInput = section.querySelector('#logistics-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      updateTableOnly();
    });
  }

  const statusFilter = section.querySelector('#logistics-status-filter');
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
  section.querySelectorAll('.logistics-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      updateTableOnly();
    });
  });

  section.querySelectorAll('.btn-inspect-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = workingInventory.find(i => i.id === btn.dataset.itemId);
      if (item) openDrawer(item);
    });
  });

  section.querySelectorAll('.logistics-data-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      const item = workingInventory.find(i => i.id === row.dataset.itemId);
      if (item) openDrawer(item);
    });
  });

  section.querySelectorAll('.assignee-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const member = LOGISTICS_TEAM.find(m => m.name === link.dataset.name);
      if (member) openEmployeeDrawer(member);
    });
  });
}

function updateTableOnly() {
  const section = document.getElementById('logistics-table-section');
  if (!section) return;
  const searchInput = section.querySelector('#logistics-search-input');
  const hadFocus = document.activeElement === searchInput;
  const selStart = searchInput ? searchInput.selectionStart : 0;
  const selEnd = searchInput ? searchInput.selectionEnd : 0;

  section.innerHTML = renderTableInner();
  attachTableEvents(section);

  if (hadFocus) {
    const newSearch = section.querySelector('#logistics-search-input');
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
    <div class="logistics-section-header">
      <div class="logistics-section-title">Recent Logistics Activity Audit</div>
    </div>
    <div class="logistics-card" style="margin-top:10px;">
      <div class="logistics-card-body">
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${RECENT_LOGISTICS_ACTIVITY.map(entry => `
            <div style="display:flex; align-items:flex-start; gap:14px; padding:6px 0; border-bottom:1px solid var(--bg-muted);">
              <span style="font-family:var(--font-mono); font-size:11.5px; font-weight:700; color:var(--text-muted); min-width:44px;">${entry.time}</span>
              <div style="flex:1;">
                <div style="font-size:12.5px; font-weight:600; color:var(--text-primary);">${entry.action}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Logged by ${entry.person} · Audit Verification OK</div>
              </div>
              <span class="logistics-badge logistics-badge-neutral" style="font-size:9.5px;">Log</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  return section;
}

// ── DRAWER (ITEM & EMPLOYEE) ──
function buildDrawer() {
  const backdrop = document.createElement('div');
  backdrop.className = 'logistics-drawer-backdrop';
  backdrop.id = 'logistics-drawer-backdrop';
  backdrop.innerHTML = `
    <div class="logistics-drawer" id="logistics-drawer">
      <div class="logistics-drawer-header">
        <div class="logistics-drawer-title" id="drawer-title">Details</div>
        <button class="logistics-drawer-close" id="drawer-close-btn" title="Close (Esc)">✕</button>
      </div>
      <div class="logistics-drawer-body" id="drawer-body"></div>
      <div class="logistics-drawer-actions" id="drawer-actions"></div>
    </div>
  `;

  setTimeout(() => {
    const bd = document.getElementById('logistics-drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');
    if (bd) bd.addEventListener('click', (e) => { if (e.target === bd) closeDrawer(); });
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  }, 30);

  return backdrop;
}

function openDrawer(item) {
  selectedItem = item;
  selectedEmployee = null;
  const backdrop = document.getElementById('logistics-drawer-backdrop');
  const title = document.getElementById('drawer-title');
  const body = document.getElementById('drawer-body');
  const actions = document.getElementById('drawer-actions');

  if (!backdrop || !body) return;

  title.textContent = `${item.item} (${item.id})`;

  const statusBadge = item.status === 'Operational' ? 'logistics-badge-green' : item.status === 'Needs Attention' ? 'logistics-badge-amber' : 'logistics-badge-red';

  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">${item.id}</span>
      <span class="logistics-badge ${statusBadge}">${item.status}</span>
    </div>

    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Category</span><span class="logistics-drawer-field-value">${item.category}</span></div>
    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Assigned Station</span><span class="logistics-drawer-field-value">${item.station} Research Station</span></div>
    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Current On-Hand Stock</span><span class="logistics-drawer-field-value">${item.currentStock} units</span></div>
    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Minimum Safety Threshold</span><span class="logistics-drawer-field-value">${item.minStock} units</span></div>
    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Estimated Days Remaining</span><span class="logistics-drawer-field-value" style="color:${item.daysRemaining <= 5 ? 'var(--accent-red)' : 'var(--text-primary)'}; font-weight:700;">${item.daysRemaining} Days</span></div>
    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Physical Storage Location</span><span class="logistics-drawer-field-value">${item.storageLocation}</span></div>
    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Custody Officer</span><span class="logistics-drawer-field-value">${item.assignee}</span></div>

    <div style="margin-top:8px;">
      <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">Cold-Chain & Warehouse Status</div>
      <div style="background:var(--bg-muted); padding:10px 12px; border-radius:var(--radius-md); font-family:var(--font-mono); font-size:11.5px; display:flex; flex-direction:column; gap:4px;">
        <div>Storage Environment: Insulated Pod -2°C to 4°C</div>
        <div>Barcode Scan Date: 08 Sep 2026 (07:15 UTC)</div>
        <div>Hazard Classification: Class 9 Non-Flammable / Essential</div>
      </div>
    </div>
  `;

  actions.innerHTML = `
    <button class="logistics-btn logistics-btn-primary logistics-btn-sm" id="btn-toggle-stock">Adjust Stock</button>
    <button class="logistics-btn logistics-btn-danger logistics-btn-sm" id="btn-request-emergency-item">Request Emergency Air Resupply</button>
  `;

  setTimeout(() => {
    const toggleBtn = document.getElementById('btn-toggle-stock');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        item.currentStock += 2;
        item.status = item.currentStock >= item.minStock ? 'Operational' : 'Needs Attention';
        item.daysRemaining += 4;
        openDrawer(item);
        updateTableOnly();
        showToast(`Stock replenished (+2 units) for ${item.item}`, 'success');
      });
    }

    const emergBtn = document.getElementById('btn-request-emergency-item');
    if (emergBtn) {
      emergBtn.addEventListener('click', () => {
        closeDrawer();
        openEmergencyModal(item);
      });
    }
  }, 20);

  backdrop.classList.add('open');
}

function openEmployeeDrawer(member) {
  selectedEmployee = member;
  selectedItem = null;
  const backdrop = document.getElementById('logistics-drawer-backdrop');
  const title = document.getElementById('drawer-title');
  const body = document.getElementById('drawer-body');
  const actions = document.getElementById('drawer-actions');

  if (!backdrop || !body) return;

  title.textContent = `Personnel Record — ${member.name}`;

  const assignedItems = workingInventory.filter(i => i.assignee === member.name);

  body.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; padding:8px 0; border-bottom:1px solid var(--border-default);">
      <div class="logistics-profile-avatar" style="width:52px; height:52px; font-size:18px;">${member.avatar}</div>
      <div>
        <div style="font-size:16px; font-weight:700; color:var(--text-primary);">${member.name}</div>
        <div style="font-size:12.5px; color:var(--accent-blue); font-weight:600;">${member.role}</div>
        <div style="font-size:11.5px; color:var(--text-muted); display:flex; align-items:center; gap:6px; margin-top:2px;">
          <span class="logistics-online-dot"></span>${member.status} · 📍 ${member.station} Station
        </div>
      </div>
    </div>

    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Employee ID</span><span class="logistics-drawer-field-value" style="font-family:var(--font-mono);">${member.id}</span></div>
    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Assigned Base</span><span class="logistics-drawer-field-value">${member.station} Research Station</span></div>
    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Emergency Comms Radio</span><span class="logistics-drawer-field-value">${member.commsChannel}</span></div>
    <div class="logistics-drawer-field"><span class="logistics-drawer-field-label">Certifications</span><span class="logistics-drawer-field-value">${member.certifications}</span></div>

    <div style="margin-top:10px;">
      <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">Custody Supplies (${assignedItems.length})</div>
      <div style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto;">
        ${assignedItems.map(i => `
          <div class="logistics-card" style="padding:8px 12px; cursor:pointer; display:flex; justify-content:space-between; align-items:center;" data-emp-item-id="${i.id}">
            <div>
              <div style="font-weight:600; font-size:12px;">${i.item}</div>
              <div style="font-size:10.5px; color:var(--text-muted);">${i.category} · Stock: ${i.currentStock}</div>
            </div>
            <span class="logistics-badge ${i.status === 'Operational' ? 'logistics-badge-green' : 'logistics-badge-amber'}" style="font-size:9.5px;">${i.status}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  actions.innerHTML = `
    <button class="logistics-btn logistics-btn-primary logistics-btn-sm" id="btn-dispatch-logistics-comms">Dispatch Comms</button>
  `;

  setTimeout(() => {
    body.querySelectorAll('[data-emp-item-id]').forEach(el => {
      el.addEventListener('click', () => {
        const found = workingInventory.find(i => i.id === el.dataset.empItemId);
        if (found) openDrawer(found);
      });
    });

    const commsBtn = document.getElementById('btn-dispatch-logistics-comms');
    if (commsBtn) {
      commsBtn.addEventListener('click', () => {
        showToast(`Priority radio transmission dispatched to ${member.name} on ${member.commsChannel}`, 'success');
      });
    }
  }, 20);

  backdrop.classList.add('open');
}

function closeDrawer() {
  const backdrop = document.getElementById('logistics-drawer-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  selectedItem = null;
  selectedEmployee = null;
}

// ── EMERGENCY REQUEST MODAL ──
function buildEmergencyModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'logistics-modal-backdrop';
  backdrop.id = 'emergency-modal-backdrop';
  backdrop.innerHTML = `
    <div class="logistics-modal">
      <div class="logistics-modal-header">
        <span class="logistics-modal-title">🚨 Create Emergency Supply Request</span>
        <button class="logistics-drawer-close" id="modal-close-btn">✕</button>
      </div>
      <div class="logistics-modal-body">
        <div class="logistics-form-group">
          <label class="logistics-form-label">Destination Station</label>
          <select class="logistics-form-select" id="emerg-station">
            <option value="Bharati">Bharati (Larsemann Hills)</option>
            <option value="Maitri">Maitri (Schirmacher Oasis)</option>
          </select>
        </div>

        <div class="logistics-form-group">
          <label class="logistics-form-label">Requested Item / SKU</label>
          <input type="text" class="logistics-form-input" id="emerg-item" value="Generator Electronic Control Module (ECM)" />
        </div>

        <div class="logistics-form-group">
          <label class="logistics-form-label">Required Quantity</label>
          <input type="number" class="logistics-form-input" id="emerg-qty" value="2" min="1" max="50" />
        </div>

        <div class="logistics-form-group">
          <label class="logistics-form-label">Priority Level</label>
          <select class="logistics-form-select" id="emerg-priority">
            <option value="CRITICAL">CRITICAL (Within 48 Hours - Air Cargo)</option>
            <option value="HIGH">HIGH (Within 5 Days - Overland / Helicopter)</option>
          </select>
        </div>

        <div class="logistics-form-group">
          <label class="logistics-form-label">Operational Justification</label>
          <input type="text" class="logistics-form-input" id="emerg-reason" value="Microgrid backup failure; emergency redundancy required." />
        </div>
      </div>
      <div class="logistics-modal-footer">
        <button class="logistics-btn logistics-btn-secondary" id="modal-cancel-btn">Cancel</button>
        <button class="logistics-btn logistics-btn-danger" id="modal-submit-btn">Submit Request</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const bd = document.getElementById('emergency-modal-backdrop');
    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const submitBtn = document.getElementById('modal-submit-btn');

    const close = () => { bd.classList.remove('open'); emergencyModalOpen = false; };
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (cancelBtn) cancelBtn.addEventListener('click', close);
    if (bd) bd.addEventListener('click', (e) => { if (e.target === bd) close(); });

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const itemVal = document.getElementById('emerg-item').value;
        const stationVal = document.getElementById('emerg-station').value;
        const qtyVal = document.getElementById('emerg-qty').value;
        const priorityVal = document.getElementById('emerg-priority').value;
        const reasonVal = document.getElementById('emerg-reason').value;

        const newId = `EC-2026-${Math.floor(100 + Math.random() * 900)}`;
        workingRequests.unshift({
          id: newId,
          station: stationVal,
          priority: priorityVal,
          requiredItem: `${itemVal} ×${qtyVal}`,
          quantity: parseInt(qtyVal),
          reason: reasonVal,
          requiredBy: 'Within 48 Hours',
          requestedBy: 'ENG-EMP-001 (Arjun Sharma)',
          status: 'Pending Air Approval',
          progress: 15
        });

        close();
        renderPage();
        showToast(`Emergency logistics request #${newId} logged successfully`, 'success');
      });
    }
  }, 20);

  return backdrop;
}

function openEmergencyModal(prefillItem) {
  const bd = document.getElementById('emergency-modal-backdrop');
  if (!bd) return;
  if (prefillItem) {
    const itemInput = document.getElementById('emerg-item');
    const stationSelect = document.getElementById('emerg-station');
    if (itemInput) itemInput.value = prefillItem.item;
    if (stationSelect) stationSelect.value = prefillItem.station;
  }
  bd.classList.add('open');
  emergencyModalOpen = true;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    const modal = document.getElementById('emergency-modal-backdrop');
    if (modal) modal.classList.remove('open');
  }
});
