// Environmental Monitoring Operations Center — Main Application Module
// Standalone page module for Antarctic Research Stations (Maitri & Bharati).
// Does NOT modify or overwrite any existing admin dashboard logic.

import './environmental.css';
import Chart from 'chart.js/auto';
import { telemetry } from '../../utils/telemetry.js';
import { initAIAssistant } from '../../features/aiVoiceAssistant/index.js';
import {
  ENVIRONMENTAL_DATA_METADATA,
  ENVIRONMENTAL_OVERVIEW_KPIS,
  STATIONS_ENVIRONMENT,
  LIVE_ATMOSPHERIC_METRICS,
  TEMPERATURE_TRENDS,
  WIND_TRENDS,
  ENVIRONMENTAL_RISK_SUMMARY,
  ENVIRONMENTAL_ALERTS,
  ENVIRONMENTAL_SENSORS,
  SENSOR_STATUS_SUMMARY,
  ENVIRONMENTAL_DIGITAL_TWIN_FLOW,
  CROSS_DEPARTMENT_IMPACTS,
  FIELD_OPERATIONS_STATUS,
  RESEARCH_PROJECTS_ENVIRONMENT,
  ENVIRONMENTAL_7DAY_FORECAST,
  ENVIRONMENTAL_TEAM,
  RECENT_ENVIRONMENTAL_ACTIVITY,
  ENVIRONMENTAL_INSIGHTS,
  ALERT_THRESHOLDS
} from './data/environmentalDemoData.js';

// ── State ──
let selectedStation = 'all'; // 'all', 'maitri', 'bharati'
let trendTimeframe = '24h'; // '24h', '7d', '30d'
let searchQuery = '';
let filterType = 'all';
let filterStatus = 'all';
let currentPage = 1;
const PAGE_SIZE = 6;
let selectedSensor = null;
let profileDropdownOpen = false;

// Working mutable copies
let workingSensors = [...ENVIRONMENTAL_SENSORS];
let workingAlerts = [...ENVIRONMENTAL_ALERTS];

// Chart references
let tempChartInstance = null;
let windChartInstance = null;

// ── Toast Notification System ──
function showToast(message, type = 'success') {
  let container = document.getElementById('env-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'env-toast-container';
    container.className = 'env-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `env-toast ${type}`;
  const icon = type === 'success' ? '❄️' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️';
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

  if (telemetry && typeof telemetry.subscribe === 'function') {
    telemetry.subscribe((state) => {
      const syncEl = document.getElementById('env-live-sync-indicator');
      if (syncEl && state.kpis) {
        syncEl.textContent = `Polar Net Live (${state.kpis.windSpeedKnots || 28} kts)`;
      }
    });
  }
});

function renderPage() {
  const app = document.getElementById('environmental-app');
  if (!app) return;
  app.innerHTML = '';
  app.appendChild(buildTopbar());

  const content = document.createElement('div');
  content.className = 'env-content';

  // 1. Overview KPIs
  content.appendChild(buildOverviewSection());

  // 2. Station Environment Status (Maitri vs Bharati)
  content.appendChild(buildStationStatusSection());

  // 3. Live Conditions Hero + Severe Advisory
  content.appendChild(buildLiveConditionsSection());

  // 4. Trends Grid: Temperature Trend & Wind Conditions
  const trendsGrid = document.createElement('div');
  trendsGrid.className = 'env-grid-2-1';
  trendsGrid.appendChild(buildTemperatureTrendSection());
  trendsGrid.appendChild(buildWindConditionsSection());
  content.appendChild(trendsGrid);

  // 5. Snow, Visibility & Atmospheric Parameters
  const envDetailsGrid = document.createElement('div');
  envDetailsGrid.className = 'env-grid-3';
  envDetailsGrid.appendChild(buildSnowConditionsSection());
  envDetailsGrid.appendChild(buildVisibilitySection());
  envDetailsGrid.appendChild(buildAtmosphericSection());
  content.appendChild(envDetailsGrid);

  // 6. Map & Digital Twin Flow
  const mapTwinGrid = document.createElement('div');
  mapTwinGrid.className = 'env-grid-2';
  mapTwinGrid.appendChild(buildEnvironmentalMapSection());
  mapTwinGrid.appendChild(buildDigitalTwinFlowSection());
  content.appendChild(mapTwinGrid);

  // 7. Cross-Department Impacts & Operational Advisory
  content.appendChild(buildCrossDepartmentSection());

  // 8. Field Operations & Research Impact
  const fieldResearchGrid = document.createElement('div');
  fieldResearchGrid.className = 'env-grid-2';
  fieldResearchGrid.appendChild(buildFieldOperationsSection());
  fieldResearchGrid.appendChild(buildResearchImpactSection());
  content.appendChild(fieldResearchGrid);

  // 9. 7-Day Polar Forecast
  content.appendChild(buildForecastSection());

  // 10. Alerts & Risk Index Grid
  const alertRiskGrid = document.createElement('div');
  alertRiskGrid.className = 'env-grid-2';
  alertRiskGrid.appendChild(buildAlertsSection());
  alertRiskGrid.appendChild(buildRiskSection());
  content.appendChild(alertRiskGrid);

  // 11. Sensor Status Summary & Asset Table
  content.appendChild(buildSensorSummarySection());
  content.appendChild(buildSensorTableSection());

  // 12. Team, Activity Timeline & AI Insights
  const teamActivityGrid = document.createElement('div');
  teamActivityGrid.className = 'env-grid-3';
  teamActivityGrid.appendChild(buildTeamSection());
  teamActivityGrid.appendChild(buildRecentActivitySection());
  teamActivityGrid.appendChild(buildInsightsSection());
  content.appendChild(teamActivityGrid);

  // 13. Alert Thresholds Reference
  content.appendChild(buildThresholdsSection());

  app.appendChild(content);
  app.appendChild(buildDrawer());

  // Init Charts after DOM render
  setTimeout(() => {
    initTempTrendChart();
    initWindTrendChart();
  }, 80);
}

// ── TOPBAR ──
function buildTopbar() {
  const bar = document.createElement('header');
  bar.className = 'env-topbar';
  bar.innerHTML = `
    <div class="env-topbar-left">
      <a href="/index.html" class="env-back-link" title="Return to Main Admin Dashboard">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Admin Dashboard
      </a>
      <div class="env-topbar-title-group">
        <div class="env-topbar-title">
          Environmental Monitoring Operations Center
          <span class="env-badge-live">POLAR METEOROLOGY</span>
        </div>
        <div class="env-topbar-subtitle">
          Monitor environmental conditions, weather trends and sensor health across Antarctic stations.
        </div>
      </div>
    </div>
    <div class="env-topbar-right">
      <div class="env-station-tabs" id="env-station-tabs">
        <button class="env-station-tab ${selectedStation === 'all' ? 'active' : ''}" data-station="all">All Stations</button>
        <button class="env-station-tab ${selectedStation === 'maitri' ? 'active' : ''}" data-station="maitri">Maitri</button>
        <button class="env-station-tab ${selectedStation === 'bharati' ? 'active' : ''}" data-station="bharati">Bharati</button>
      </div>

      <div class="env-sync-pill" title="Synchronized with IMD / WMO Global Polar Grid">
        <span class="env-sync-dot"></span>
        <span id="env-live-sync-indicator">Sensors Live (60s)</span>
      </div>

      <div class="env-profile-chip" id="env-profile-chip" title="User Profile">
        <div class="env-profile-avatar">AS</div>
        <div class="env-profile-info">
          <div class="env-profile-name">Dr. Ananya Sharma</div>
          <div class="env-profile-role">Environmental Scientist · Bharati</div>
        </div>
        <div class="env-profile-dropdown ${profileDropdownOpen ? 'open' : ''}" id="env-profile-dropdown">
          <div class="env-profile-dd-item" id="env-dd-profile">👤 View Scientist Profile</div>
          <div class="env-profile-dd-item" id="env-dd-calibrate">🔬 Sensor Calibration Tool</div>
          <div class="env-profile-dd-divider"></div>
          <div class="env-profile-dd-item" id="env-dd-return">🚪 Return to Admin Dashboard</div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    // Station tabs
    bar.querySelectorAll('.env-station-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedStation = e.currentTarget.getAttribute('data-station');
        renderPage();
        showToast(`Filtered by ${selectedStation === 'all' ? 'All Stations' : selectedStation === 'maitri' ? 'Maitri Station' : 'Bharati Station'}`);
      });
    });

    // Profile Dropdown
    const chip = bar.querySelector('#env-profile-chip');
    const dd = bar.querySelector('#env-profile-dropdown');
    if (chip && dd) {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdownOpen = !profileDropdownOpen;
        dd.classList.toggle('open', profileDropdownOpen);
      });
    }

    const returnBtn = bar.querySelector('#env-dd-return');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => { window.location.href = '/index.html'; });
    }

    const calibrateBtn = bar.querySelector('#env-dd-calibrate');
    if (calibrateBtn) {
      calibrateBtn.addEventListener('click', () => {
        showToast('Initiating automated zero-offset laser & sonic calibration...', 'success');
      });
    }
  }, 20);

  return bar;
}

// ── 1. OVERVIEW SECTION ──
function buildOverviewSection() {
  const sec = document.createElement('div');
  const kpis = ENVIRONMENTAL_OVERVIEW_KPIS;

  sec.innerHTML = `
    <div class="env-grid-6">
      <div class="env-card env-kpi-card">
        <div class="env-kpi-top">
          <span class="env-kpi-label">Temperature</span>
          <span class="env-kpi-icon">🌡️</span>
        </div>
        <div class="env-kpi-value-row">
          <span class="env-kpi-value">${kpis.temperature.value}</span>
          <span class="env-kpi-unit">${kpis.temperature.unit}</span>
          <span class="env-kpi-pill ${kpis.temperature.statusType}">● ${kpis.temperature.status}</span>
        </div>
        <div class="env-kpi-footer">
          <span>${kpis.temperature.subtext}</span>
          <span>${kpis.temperature.trend}</span>
        </div>
      </div>

      <div class="env-card env-kpi-card">
        <div class="env-kpi-top">
          <span class="env-kpi-label">Wind Velocity</span>
          <span class="env-kpi-icon">💨</span>
        </div>
        <div class="env-kpi-value-row">
          <span class="env-kpi-value">${kpis.windSpeed.value}</span>
          <span class="env-kpi-unit">${kpis.windSpeed.unit}</span>
          <span class="env-kpi-pill ${kpis.windSpeed.statusType}">● ${kpis.windSpeed.status}</span>
        </div>
        <div class="env-kpi-footer">
          <span>${kpis.windSpeed.direction}</span>
          <span>${kpis.windSpeed.subtext}</span>
        </div>
      </div>

      <div class="env-card env-kpi-card">
        <div class="env-kpi-top">
          <span class="env-kpi-label">Optical Visibility</span>
          <span class="env-kpi-icon">👁️</span>
        </div>
        <div class="env-kpi-value-row">
          <span class="env-kpi-value">${kpis.visibility.value}</span>
          <span class="env-kpi-unit">${kpis.visibility.unit}</span>
          <span class="env-kpi-pill ${kpis.visibility.statusType}">● Low</span>
        </div>
        <div class="env-kpi-footer">
          <span>${kpis.visibility.subtext}</span>
          <span>${kpis.visibility.trend}</span>
        </div>
      </div>

      <div class="env-card env-kpi-card">
        <div class="env-kpi-top">
          <span class="env-kpi-label">Atmospheric Pressure</span>
          <span class="env-kpi-icon">📉</span>
        </div>
        <div class="env-kpi-value-row">
          <span class="env-kpi-value">${kpis.atmosphericPressure.value}</span>
          <span class="env-kpi-unit">${kpis.atmosphericPressure.unit}</span>
          <span class="env-kpi-pill ${kpis.atmosphericPressure.statusType}">● ${kpis.atmosphericPressure.status}</span>
        </div>
        <div class="env-kpi-footer">
          <span>${kpis.atmosphericPressure.subtext}</span>
          <span>${kpis.atmosphericPressure.trend}</span>
        </div>
      </div>

      <div class="env-card env-kpi-card">
        <div class="env-kpi-top">
          <span class="env-kpi-label">Snow Conditions</span>
          <span class="env-kpi-icon">🌨️</span>
        </div>
        <div class="env-kpi-value-row">
          <span class="env-kpi-value" style="font-size: 20px;">Heavy</span>
          <span class="env-kpi-pill ${kpis.snowConditions.statusType}">● Warning</span>
        </div>
        <div class="env-kpi-footer">
          <span>${kpis.snowConditions.accumulationCm} cm Drift</span>
          <span>${kpis.snowConditions.trend}</span>
        </div>
      </div>

      <div class="env-card env-kpi-card">
        <div class="env-kpi-top">
          <span class="env-kpi-label">Weather Status</span>
          <span class="env-kpi-icon">⚠️</span>
        </div>
        <div class="env-kpi-value-row">
          <span class="env-kpi-value" style="font-size: 18px; color: #f59e0b;">Severe</span>
          <span class="env-kpi-pill ${kpis.weatherStatus.statusType}">● Attention</span>
        </div>
        <div class="env-kpi-footer">
          <span>${kpis.weatherStatus.activeStation}</span>
          <span>Field Advisory</span>
        </div>
      </div>
    </div>
  `;
  return sec;
}

// ── 2. STATION ENVIRONMENT STATUS (MAITRI & BHARATI) ──
function buildStationStatusSection() {
  const sec = document.createElement('div');
  const m = STATIONS_ENVIRONMENT.maitri;
  const b = STATIONS_ENVIRONMENT.bharati;

  const showMaitri = selectedStation === 'all' || selectedStation === 'maitri';
  const showBharati = selectedStation === 'all' || selectedStation === 'bharati';

  sec.innerHTML = `
    <div class="env-grid-2">
      ${showMaitri ? `
        <div class="env-card env-station-compare-card" style="border-left: 4px solid #10b981;">
          <div class="env-card-header" style="margin-bottom: 8px;">
            <div>
              <div class="env-card-title">
                <span>🏔️ ${m.name}</span>
                <span class="env-station-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
                  ● ${m.overallStatus}
                </span>
              </div>
              <div class="env-card-subtitle">${m.region} // Elev: ${m.elevationM}m // ${m.coordinates}</div>
            </div>
            <button class="env-btn-sm" onclick="showStationModal('maitri')">Station Telemetry</button>
          </div>
          <table class="env-station-metrics-table">
            <tbody>
              <tr><td>Ambient Temperature</td><td>${m.temperature} °C (Windchill ${m.apparentTemp} °C)</td></tr>
              <tr><td>Wind Speed & Direction</td><td>${m.windSpeedKmH} km/h (${m.windSpeedKnots} kts) // ${m.windDirection}</td></tr>
              <tr><td>Optical Visibility</td><td>${m.visibilityKm} km (Nominal)</td></tr>
              <tr><td>Snow & Surface Conditions</td><td>${m.snowStatus} (${m.snowAccumulationCm} cm)</td></tr>
              <tr><td>Barometric Pressure</td><td>${m.pressureHpa} hPa // Humidity ${m.humidityPercent}%</td></tr>
              <tr><td>Solar Flux & Stratospheric Ozone</td><td>${m.solarRadiationWm2} W/m² // ${m.solarRadiationWm2 ? '185 DU' : ''}</td></tr>
              <tr><td>Sensor Network Health</td><td style="color: #10b981;">${m.sensorsOnline} / ${m.sensorsTotal} Online (95%)</td></tr>
            </tbody>
          </table>
        </div>
      ` : ''}

      ${showBharati ? `
        <div class="env-card env-station-compare-card" style="border-left: 4px solid #f59e0b;">
          <div class="env-card-header" style="margin-bottom: 8px;">
            <div>
              <div class="env-card-title">
                <span>🏔️ ${b.name}</span>
                <span class="env-station-badge" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);">
                  🟡 ${b.overallStatus}
                </span>
              </div>
              <div class="env-card-subtitle">${b.region} // Elev: ${b.elevationM}m // ${b.coordinates}</div>
            </div>
            <button class="env-btn-sm" onclick="showStationModal('bharati')">Station Telemetry</button>
          </div>
          <table class="env-station-metrics-table">
            <tbody>
              <tr><td>Ambient Temperature</td><td style="color: #fca5a5;">${b.temperature} °C (Extreme Windchill ${b.apparentTemp} °C)</td></tr>
              <tr><td>Wind Speed & Direction</td><td style="color: #f59e0b;">${b.windSpeedKmH} km/h (${b.windSpeedKnots} kts) // ${b.windDirection}</td></tr>
              <tr><td>Optical Visibility</td><td style="color: #ef4444;">${b.visibilityKm} km (Severe Blizzard Drift)</td></tr>
              <tr><td>Snow & Surface Conditions</td><td style="color: #ef4444;">${b.snowStatus} (${b.snowAccumulationCm} cm)</td></tr>
              <tr><td>Barometric Pressure</td><td>${b.pressureHpa} hPa // Humidity ${b.humidityPercent}%</td></tr>
              <tr><td>Solar Flux & Radiation</td><td>${b.solarRadiationWm2} W/m² (UV Index ${b.uvIndex})</td></tr>
              <tr><td>Sensor Network Health</td><td style="color: #f59e0b;">${b.sensorsOnline} / ${b.sensorsTotal} Online (2 Warning)</td></tr>
            </tbody>
          </table>
        </div>
      ` : ''}
    </div>
  `;
  return sec;
}

// ── 3. LIVE CONDITIONS HERO ──
function buildLiveConditionsSection() {
  const sec = document.createElement('div');
  const b = STATIONS_ENVIRONMENT.bharati;

  sec.innerHTML = `
    <div class="env-card env-hero-card">
      <div class="env-hero-grid">
        <div class="env-hero-temp-box">
          <div class="env-hero-station-tag">Current Conditions // ${selectedStation === 'maitri' ? 'Maitri Station' : 'Bharati Station (Active Storm)'}</div>
          <div class="env-hero-main-temp">
            ${selectedStation === 'maitri' ? '-24.1' : '-27.4'}
            <span class="env-hero-temp-unit">°C</span>
          </div>
          <div class="env-hero-apparent">
            Feels like <strong>${selectedStation === 'maitri' ? '-36.2°C' : '-44.5°C'}</strong> (Windchill Factor)
          </div>
          <div class="env-hero-condition-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
            ${selectedStation === 'maitri' ? 'Stable Polar Coastal Margin' : 'Severe Catabatic Front // Heavy Snow & Wind'}
          </div>
        </div>

        <div class="env-hero-metrics-grid">
          <div class="env-hero-metric-tile">
            <span class="env-hero-metric-tile-label">Wind Velocity</span>
            <span class="env-hero-metric-tile-value" style="color: #f59e0b;">51.2 km/h</span>
            <span class="env-hero-metric-tile-sub">Gusts 68.4 km/h (28 kts)</span>
          </div>
          <div class="env-hero-metric-tile">
            <span class="env-hero-metric-tile-label">Wind Direction</span>
            <span class="env-hero-metric-tile-value" style="color: #38bdf8;">NW (315°)</span>
            <span class="env-hero-metric-tile-sub">Ridge Tower Vector</span>
          </div>
          <div class="env-hero-metric-tile">
            <span class="env-hero-metric-tile-label">Visibility</span>
            <span class="env-hero-metric-tile-value" style="color: #ef4444;">1.2 km</span>
            <span class="env-hero-metric-tile-sub">Blowing Dry Snow</span>
          </div>
          <div class="env-hero-metric-tile">
            <span class="env-hero-metric-tile-label">Barometric Pressure</span>
            <span class="env-hero-metric-tile-value">982.4 hPa</span>
            <span class="env-hero-metric-tile-sub">Falling 3.8 hPa / 6h</span>
          </div>
          <div class="env-hero-metric-tile">
            <span class="env-hero-metric-tile-label">Relative Humidity</span>
            <span class="env-hero-metric-tile-value">78 %</span>
            <span class="env-hero-metric-tile-sub">Dew Point -31.2°C</span>
          </div>
          <div class="env-hero-metric-tile">
            <span class="env-hero-metric-tile-label">Snow Accumulation</span>
            <span class="env-hero-metric-tile-value" style="color: #f59e0b;">34.2 cm</span>
            <span class="env-hero-metric-tile-sub">+6.5 cm Last 12h</span>
          </div>
        </div>
      </div>
    </div>
  `;
  return sec;
}

// ── 4. TEMPERATURE TREND SECTION ──
function buildTemperatureTrendSection() {
  const card = document.createElement('div');
  card.className = 'env-card';
  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
          Temperature & Windchill Trend
        </div>
        <div class="env-card-subtitle">Ambient multi-station thermal profiles vs convective windchill index</div>
      </div>
      <div class="env-timeframe-selector">
        <button class="env-tf-btn ${trendTimeframe === '24h' ? 'active' : ''}" data-tf="24h">24H</button>
        <button class="env-tf-btn ${trendTimeframe === '7d' ? 'active' : ''}" data-tf="7d">7D</button>
        <button class="env-tf-btn ${trendTimeframe === '30d' ? 'active' : ''}" data-tf="30d">30D</button>
      </div>
    </div>
    <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 11px;">
      <span style="color: var(--env-text-muted);">Current: <strong style="color: #ffffff;">-27.4°C</strong></span>
      <span style="color: var(--env-text-muted);">Min: <strong style="color: #38bdf8;">-28.5°C</strong></span>
      <span style="color: var(--env-text-muted);">Max: <strong style="color: #f59e0b;">-22.5°C</strong></span>
      <span style="color: var(--env-text-muted);">Avg: <strong style="color: #ffffff;">-25.3°C</strong></span>
    </div>
    <div class="env-chart-wrapper">
      <canvas id="env-temp-chart"></canvas>
    </div>
  `;

  setTimeout(() => {
    card.querySelectorAll('.env-tf-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        trendTimeframe = e.currentTarget.getAttribute('data-tf');
        card.querySelectorAll('.env-tf-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        initTempTrendChart();
      });
    });
  }, 20);

  return card;
}

function initTempTrendChart() {
  const canvas = document.getElementById('env-temp-chart');
  if (!canvas) return;

  if (tempChartInstance) {
    tempChartInstance.destroy();
  }

  const dataObj = TEMPERATURE_TRENDS[trendTimeframe] || TEMPERATURE_TRENDS['24h'];

  tempChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: dataObj.labels,
      datasets: [
        {
          label: 'Bharati Station (°C)',
          data: dataObj.bharati,
          borderColor: '#00f0ff',
          backgroundColor: 'rgba(0, 240, 255, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3
        },
        {
          label: 'Maitri Station (°C)',
          data: dataObj.maitri,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          tension: 0.35,
          borderWidth: 2,
          borderDash: [3, 3],
          pointRadius: 2
        },
        {
          label: 'Apparent Windchill (°C)',
          data: dataObj.windchill,
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          tension: 0.35,
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#cbd5e1', font: { size: 10 } }
        }
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 9 } },
          grid: { color: 'rgba(255, 255, 255, 0.04)' }
        },
        y: {
          ticks: { color: '#64748b', font: { size: 9 } },
          grid: { color: 'rgba(255, 255, 255, 0.04)' }
        }
      }
    }
  });
}

// ── 5. WIND CONDITIONS & COMPASS SECTION ──
function buildWindConditionsSection() {
  const card = document.createElement('div');
  card.className = 'env-card';
  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
          Wind Velocity & Vector
        </div>
        <div class="env-card-subtitle">Sonic anemometer continuous vectoring</div>
      </div>
      <span class="env-kpi-pill warning">🟡 Strong Gusts</span>
    </div>

    <div class="env-wind-compass-wrap">
      <div class="env-compass-circle">
        <span class="env-compass-label env-compass-n">N</span>
        <span class="env-compass-label env-compass-s">S</span>
        <span class="env-compass-label env-compass-e">E</span>
        <span class="env-compass-label env-compass-w">W</span>
        <div class="env-compass-needle" id="env-compass-needle"></div>
        <div class="env-compass-center-dot"></div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; margin-top: 6px;">
      <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
        <div style="color: var(--env-text-muted);">Current Speed</div>
        <div style="font-size: 16px; font-weight: 800; color: #f59e0b; font-family: var(--env-font-mono);">51.2 km/h</div>
        <div style="font-size: 10px; color: var(--env-text-dim);">Direction: 315° NW</div>
      </div>
      <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
        <div style="color: var(--env-text-muted);">Peak Gust Today</div>
        <div style="font-size: 16px; font-weight: 800; color: #ef4444; font-family: var(--env-font-mono);">68.4 km/h</div>
        <div style="font-size: 10px; color: var(--env-text-dim);">Avg Today: 43.1 km/h</div>
      </div>
    </div>

    <div class="env-chart-wrapper" style="height: 120px; margin-top: 12px;">
      <canvas id="env-wind-chart"></canvas>
    </div>
  `;
  return card;
}

function initWindTrendChart() {
  const canvas = document.getElementById('env-wind-chart');
  if (!canvas) return;

  if (windChartInstance) {
    windChartInstance.destroy();
  }

  windChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: WIND_TRENDS.labels,
      datasets: [
        {
          label: 'Bharati Gusts (km/h)',
          data: WIND_TRENDS.bharatiGusts,
          borderColor: '#ef4444',
          borderDash: [3, 3],
          tension: 0.3,
          borderWidth: 1.5,
          pointRadius: 0
        },
        {
          label: 'Bharati Sustained (km/h)',
          data: WIND_TRENDS.bharatiSpeed,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 8 } }, grid: { display: false } },
        y: { ticks: { color: '#64748b', font: { size: 8 } }, grid: { color: 'rgba(255, 255, 255, 0.04)' } }
      }
    }
  });
}

// ── 6. SNOW CONDITIONS ──
function buildSnowConditionsSection() {
  const card = document.createElement('div');
  card.className = 'env-card';
  card.innerHTML = `
    <div class="env-card-header">
      <div class="env-card-title">
        <span>🌨️ Snow & Surface Conditions</span>
      </div>
      <span class="env-kpi-pill danger">● Warning</span>
    </div>
    <div style="font-size: 11px; color: #cbd5e1; line-height: 1.5; margin-bottom: 12px;">
      Acoustic snow depth sensors indicate heavy accumulation and horizontal snow drift around Bharati Module B air intakes.
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Snow Status</span>
        <strong style="color: #fca5a5;">Heavy Snowfall & Drift</strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Precipitation Rate</span>
        <strong>4.2 mm / hr</strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Total Accumulation</span>
        <strong style="color: #f59e0b; font-family: var(--env-font-mono);">34.2 cm</strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Last Observation</span>
        <span>09:42 UTC (Ultrasonic S01)</span>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Operational Impact</span>
        <span style="color: #f59e0b; font-weight: 700;">Intake Clearance Required</span>
      </div>
    </div>
  `;
  return card;
}

// ── 7. VISIBILITY MONITORING ──
function buildVisibilitySection() {
  const card = document.createElement('div');
  card.className = 'env-card';
  card.innerHTML = `
    <div class="env-card-header">
      <div class="env-card-title">
        <span>👁️ Optical Visibility Range</span>
      </div>
      <span class="env-kpi-pill warning">🟡 1.2 km</span>
    </div>
    <div style="font-size: 11px; color: #cbd5e1; line-height: 1.5; margin-bottom: 12px;">
      Forward laser transmissometer reports severe blowing snow scattering. Helipad approach beacons active.
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Current Visibility</span>
        <strong style="color: #ef4444; font-family: var(--env-font-mono);">1.2 km (Low)</strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Minimum Today</span>
        <strong>0.8 km (Blizzard Peak)</strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Average Today</span>
        <strong>4.6 km</strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Maximum Today</span>
        <strong>12.0 km (Pre-dawn Clear)</strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
        <span style="color: var(--env-text-muted);">Transmissometer Health</span>
        <span style="color: #f59e0b;">74% (Sensor V01 Window Heated)</span>
      </div>
    </div>
  `;
  return card;
}

// ── 8. ATMOSPHERIC CONDITIONS ──
function buildAtmosphericSection() {
  const card = document.createElement('div');
  card.className = 'env-card';
  card.innerHTML = `
    <div class="env-card-header">
      <div class="env-card-title">
        <span>🌌 Atmospheric & Scientific Telemetry</span>
      </div>
      <span class="env-kpi-pill stable">● Nominal</span>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
      <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
        <div style="color: var(--env-text-muted);">Barometric Pressure</div>
        <div style="font-size: 14px; font-weight: 700; color: #ffffff;">982.4 hPa</div>
        <div style="font-size: 9px; color: #f59e0b;">↓ Falling Depr.</div>
      </div>
      <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
        <div style="color: var(--env-text-muted);">Relative Humidity</div>
        <div style="font-size: 14px; font-weight: 700; color: #ffffff;">78 %</div>
        <div style="font-size: 9px; color: var(--env-text-dim);">Dew: -31.2°C</div>
      </div>
      <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
        <div style="color: var(--env-text-muted);">Ozone Column</div>
        <div style="font-size: 14px; font-weight: 700; color: var(--env-cyan);">185 DU</div>
        <div style="font-size: 9px; color: var(--env-text-dim);">Dobson Unit</div>
      </div>
      <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
        <div style="color: var(--env-text-muted);">Ice Seismicity</div>
        <div style="font-size: 14px; font-weight: 700; color: var(--env-green);">0.14 Mw</div>
        <div style="font-size: 9px; color: var(--env-text-dim);">Acoustic Baseline</div>
      </div>
    </div>
  `;
  return card;
}

// ── 9. MAP & DIGITAL TWIN FLOW ──
function buildEnvironmentalMapSection() {
  const card = document.createElement('div');
  card.className = 'env-card';
  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Antarctic Environmental Monitoring Map
        </div>
        <div class="env-card-subtitle">Schirmacher Oasis (Maitri) & Larsemann Hills (Bharati) Geospatial Overlay</div>
      </div>
      <span class="env-kpi-pill warning">Active Storm Front</span>
    </div>
    <div class="env-map-container">
      <div class="env-map-overlay-contour"></div>
      <div class="env-map-storm-layer" title="Catabatic Blizzard Storm Layer"></div>
      
      <div class="env-map-pin maitri" onclick="selectStationMap('maitri')" title="Maitri Station">
        <div class="env-map-pin-dot" style="background: #10b981; color: #10b981;"></div>
        <div class="env-map-pin-label">Maitri Station (-24°C // 32 km/h)</div>
      </div>

      <div class="env-map-pin bharati" onclick="selectStationMap('bharati')" title="Bharati Station">
        <div class="env-map-pin-dot" style="background: #f59e0b; color: #f59e0b;"></div>
        <div class="env-map-pin-label">Bharati Station (-27°C // 51 km/h ⚠️)</div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--env-text-dim); margin-top: 8px; font-family: var(--env-font-mono);">
      <span>PROJECTION: Polar Stereographic WGS-84</span>
      <span>SIMULATED SATELLITE RADAR & GROUND STATIONS</span>
    </div>
  `;
  return card;
}

function buildDigitalTwinFlowSection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  const nodesHTML = ENVIRONMENTAL_DIGITAL_TWIN_FLOW.map(node => `
    <div class="env-twin-node">
      <div class="env-twin-node-num">${node.step}</div>
      <div class="env-twin-node-content">
        <div class="env-twin-node-title">${node.stage}</div>
        <div class="env-twin-node-desc">${node.detail}</div>
      </div>
      <div class="env-twin-node-badge">${node.metric}</div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          Environmental Digital Twin Pipeline
        </div>
        <div class="env-card-subtitle">Continuous computational loop from atmospheric physics to mission decision support</div>
      </div>
      <span class="env-badge-live">LIVE COUPLING</span>
    </div>
    <div class="env-twin-flow">
      ${nodesHTML}
    </div>
  `;
  return card;
}

// ── 10. CROSS-DEPARTMENT IMPACTS ──
function buildCrossDepartmentSection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  const impactsHTML = CROSS_DEPARTMENT_IMPACTS.map(imp => `
    <div class="env-impact-card">
      <div class="env-impact-header">
        <div class="env-impact-title">
          <span>${imp.icon}</span>
          <span>${imp.department} // ${imp.title}</span>
        </div>
        <span class="env-impact-badge" style="background: rgba(245, 158, 11, 0.15); color: ${imp.statusColor}; border: 1px solid ${imp.statusColor};">
          ${imp.status}
        </span>
      </div>
      <div class="env-impact-summary">${imp.summary}</div>
      <div class="env-impact-metrics">
        ${imp.metrics.map(m => `<div class="env-impact-pill"><strong>${m.label}:</strong> ${m.value}</div>`).join('')}
      </div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          Cross-Department Operational Impact Matrix
        </div>
        <div class="env-card-subtitle">How sub-zero weather and catabatic storms propagate across station infrastructure</div>
      </div>
      <span class="env-badge-live">MULTI-DOMAIN</span>
    </div>
    <div class="env-grid-2">
      ${impactsHTML}
    </div>
  `;
  return card;
}

// ── 11. FIELD OPERATIONS & RESEARCH IMPACT ──
function buildFieldOperationsSection() {
  const card = document.createElement('div');
  card.className = 'env-card';
  const f = FIELD_OPERATIONS_STATUS;

  const rows = f.restrictions.map(r => `
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
      <div>
        <div style="font-weight: 700; color: #ffffff;">${r.activity}</div>
        <div style="color: var(--env-text-dim); font-size: 10px; margin-top: 2px;">${r.reason}</div>
      </div>
      <span style="font-weight: 700; font-size: 10px; padding: 2px 8px; border-radius: 4px; ${r.status === 'PROHIBITED' ? 'background: rgba(239, 68, 68, 0.2); color: #ef4444;' : r.status === 'RESTRICTED' ? 'background: rgba(245, 158, 11, 0.2); color: #f59e0b;' : 'background: rgba(16, 185, 129, 0.2); color: #10b981;'}">
        ${r.status}
      </span>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <span>🥾 Field Operations Status</span>
        </div>
        <div class="env-card-subtitle">Personnel movement & exterior transit authorizations</div>
      </div>
      <span class="env-kpi-pill warning">🟡 Restricted</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${rows}
    </div>
  `;
  return card;
}

function buildResearchImpactSection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  const rows = RESEARCH_PROJECTS_ENVIRONMENT.map(p => `
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 6px; font-size: 11px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700; color: #ffffff;">${p.name}</span>
        <span style="font-size: 10px; font-weight: 700; color: ${p.statusColor};">${p.status}</span>
      </div>
      <div style="color: var(--env-text-dim); font-size: 10px; margin-top: 2px;">Lead: ${p.lead} // ${p.station} // Resumption: ${p.resumptionETA}</div>
      <div style="color: #cbd5e1; font-size: 10px; margin-top: 4px;">${p.weatherImpact}</div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <span>🔬 Scientific Research Environment Impact</span>
        </div>
        <div class="env-card-subtitle">NCPOR polar science programs correlation</div>
      </div>
      <span class="env-kpi-pill stable">4 Programs</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${rows}
    </div>
  `;
  return card;
}

// ── 12. 7-DAY POLAR WEATHER FORECAST ──
function buildForecastSection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  const daysHTML = ENVIRONMENTAL_7DAY_FORECAST.map(d => `
    <div class="env-forecast-day-card">
      <div class="env-forecast-day-name">${d.day}</div>
      <div class="env-forecast-date">${d.date}</div>
      <div class="env-forecast-icon">${d.icon}</div>
      <div class="env-forecast-temp-range">${d.tempHigh}° / ${d.tempLow}°</div>
      <div class="env-forecast-wind">${d.wind}</div>
      <div class="env-forecast-snow">Snow: ${d.snowProb}</div>
      <div style="font-size: 9px; color: #cbd5e1; margin-top: 2px;">Vis: ${d.vis}</div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          7-Day Antarctic Meteorological Outlook
        </div>
        <div class="env-card-subtitle">European & IMD Polar Atmospheric Numerical Prediction Model (Simulated Forecast)</div>
      </div>
      <span class="env-badge-live">NWP MODEL</span>
    </div>
    <div class="env-forecast-grid">
      ${daysHTML}
    </div>
  `;
  return card;
}

// ── 13. ALERTS & RISK SECTION ──
function buildAlertsSection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  const items = workingAlerts.map(a => `
    <div style="background: rgba(255, 255, 255, 0.03); border-left: 3px solid ${a.severity === 'CRITICAL' ? '#ef4444' : a.severity === 'WARNING' ? '#f59e0b' : '#10b981'}; padding: 8px 12px; border-radius: 4px; font-size: 11px;">
      <div style="display: flex; justify-content: space-between;">
        <span style="font-weight: 700; color: ${a.severity === 'CRITICAL' ? '#ef4444' : a.severity === 'WARNING' ? '#f59e0b' : '#10b981'};">${a.severity} // ${a.category}</span>
        <span style="color: var(--env-text-dim); font-size: 10px;">${a.timestamp}</span>
      </div>
      <div style="font-weight: 600; color: #ffffff; margin-top: 2px;">${a.title}</div>
      <div style="color: #cbd5e1; font-size: 10px; margin-top: 2px;">${a.description}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 10px;">
        <span style="color: var(--env-cyan);">Rec: ${a.recommendedAction}</span>
        <button class="env-btn-sm" style="font-size: 9px; padding: 2px 6px;" onclick="acknowledgeAlert('${a.id}')">Acknowledge</button>
      </div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Active Environmental Warnings & Alerts
        </div>
        <div class="env-card-subtitle">Autonomous trigger thresholds</div>
      </div>
      <span class="env-kpi-pill danger">${workingAlerts.filter(a => a.status === 'ACTIVE').length} Active</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto;">
      ${items}
    </div>
  `;
  return card;
}

function buildRiskSection() {
  const card = document.createElement('div');
  card.className = 'env-card';
  const r = ENVIRONMENTAL_RISK_SUMMARY;

  const factorBars = r.factors.map(f => `
    <div class="env-risk-bar-row">
      <div class="env-risk-bar-labels">
        <span style="color: #ffffff; font-weight: 600;">${f.category}</span>
        <span style="color: ${f.color}; font-weight: 700;">${f.level} (${f.score}%)</span>
      </div>
      <div class="env-risk-bar-track">
        <div class="env-risk-bar-fill" style="width: ${f.score}%; background: ${f.color};"></div>
      </div>
      <div style="font-size: 9px; color: var(--env-text-dim); margin-top: 2px;">${f.detail}</div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Environmental Composite Risk Index
        </div>
        <div class="env-card-subtitle">Combined meteorological severity scoring</div>
      </div>
      <span class="env-kpi-pill warning">Score: ${r.overallRiskScore} / 100</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      ${factorBars}
    </div>
  `;
  return card;
}

// ── 14. SENSOR STATUS SUMMARY & ASSET TABLE ──
function buildSensorSummarySection() {
  const sec = document.createElement('div');
  const s = SENSOR_STATUS_SUMMARY;

  sec.innerHTML = `
    <div class="env-grid-6" style="margin-bottom: 8px;">
      <div class="env-card" style="padding: 12px; text-align: center;">
        <div style="font-size: 10px; color: var(--env-text-muted); font-weight: 700;">TOTAL SENSORS</div>
        <div style="font-size: 22px; font-weight: 800; color: #ffffff; font-family: var(--env-font-mono);">${s.total}</div>
      </div>
      <div class="env-card" style="padding: 12px; text-align: center;">
        <div style="font-size: 10px; color: var(--env-green); font-weight: 700;">ONLINE</div>
        <div style="font-size: 22px; font-weight: 800; color: var(--env-green); font-family: var(--env-font-mono);">${s.online}</div>
      </div>
      <div class="env-card" style="padding: 12px; text-align: center;">
        <div style="font-size: 10px; color: var(--env-amber); font-weight: 700;">WARNING</div>
        <div style="font-size: 22px; font-weight: 800; color: var(--env-amber); font-family: var(--env-font-mono);">${s.warning}</div>
      </div>
      <div class="env-card" style="padding: 12px; text-align: center;">
        <div style="font-size: 10px; color: var(--env-red); font-weight: 700;">OFFLINE</div>
        <div style="font-size: 22px; font-weight: 800; color: var(--env-red); font-family: var(--env-font-mono);">${s.offline}</div>
      </div>
      <div class="env-card" style="padding: 12px; text-align: center;">
        <div style="font-size: 10px; color: var(--env-blue); font-weight: 700;">DATA DELAYED</div>
        <div style="font-size: 22px; font-weight: 800; color: var(--env-blue); font-family: var(--env-font-mono);">${s.dataDelayed}</div>
      </div>
      <div class="env-card" style="padding: 12px; text-align: center;">
        <div style="font-size: 10px; color: var(--env-cyan); font-weight: 700;">AVAILABILITY</div>
        <div style="font-size: 22px; font-weight: 800; color: var(--env-cyan); font-family: var(--env-font-mono);">${s.availabilityPercent}%</div>
      </div>
    </div>
  `;
  return sec;
}

function buildSensorTableSection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  // Apply search and filters
  let filtered = workingSensors.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStation = selectedStation === 'all' || s.station.toLowerCase() === selectedStation.toLowerCase();
    const matchType = filterType === 'all' || s.type.toLowerCase().includes(filterType.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status.toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStation && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pagedSensors = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const rowsHTML = pagedSensors.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td><span style="font-family: var(--env-font-mono); color: var(--env-cyan); font-size: 11px;">${s.id}</span></td>
      <td>${s.type}</td>
      <td>${s.station}</td>
      <td><strong>${s.reading} ${s.unit}</strong></td>
      <td>
        <span style="padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; ${s.status === 'Online' ? 'background: rgba(16, 185, 129, 0.15); color: #10b981;' : s.status === 'Warning' ? 'background: rgba(245, 158, 11, 0.15); color: #f59e0b;' : 'background: rgba(239, 68, 68, 0.15); color: #ef4444;'}">
          ${s.status}
        </span>
      </td>
      <td>${s.lastUpdated}</td>
      <td>${s.health}%</td>
      <td>${s.assignedEmployee}</td>
      <td>
        <button class="env-btn-sm" onclick="inspectSensor('${s.id}')">Inspect</button>
      </td>
    </tr>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          Environmental Sensor Inventory & Telemetry Assets
        </div>
        <div class="env-card-subtitle">Active meteorological sensors deployed across Schirmacher Oasis and Larsemann Hills</div>
      </div>
      <span class="env-kpi-pill stable">${filtered.length} Sensors Matching</span>
    </div>

    <div class="env-toolbar">
      <input type="text" class="env-search-input" id="env-search-input" placeholder="Search sensor ID, type, location..." value="${searchQuery}">
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <select class="env-filter-select" id="env-filter-type">
          <option value="all" ${filterType === 'all' ? 'selected' : ''}>All Types</option>
          <option value="Temperature" ${filterType === 'Temperature' ? 'selected' : ''}>Temperature</option>
          <option value="Wind" ${filterType === 'Wind' ? 'selected' : ''}>Wind</option>
          <option value="Visibility" ${filterType === 'Visibility' ? 'selected' : ''}>Visibility</option>
          <option value="Pressure" ${filterType === 'Pressure' ? 'selected' : ''}>Pressure</option>
          <option value="Snow" ${filterType === 'Snow' ? 'selected' : ''}>Snow</option>
        </select>
        <select class="env-filter-select" id="env-filter-status">
          <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
          <option value="Online" ${filterStatus === 'Online' ? 'selected' : ''}>Online</option>
          <option value="Warning" ${filterStatus === 'Warning' ? 'selected' : ''}>Warning</option>
          <option value="Offline" ${filterStatus === 'Offline' ? 'selected' : ''}>Offline</option>
        </select>
        <button class="env-btn-sm" id="env-btn-reset-filters">Reset</button>
      </div>
    </div>

    <div class="env-table-responsive">
      <table class="env-table">
        <thead>
          <tr>
            <th>Sensor Name</th>
            <th>Sensor ID</th>
            <th>Type</th>
            <th>Station</th>
            <th>Reading</th>
            <th>Status</th>
            <th>Last Sync</th>
            <th>Health</th>
            <th>Assigned Lead</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML || '<tr><td colspan="10" style="text-align:center; padding: 20px; color: var(--env-text-dim);">No sensors match your query.</td></tr>'}
        </tbody>
      </table>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; font-size: 11px; color: var(--env-text-muted);">
      <span>Showing Page ${currentPage} of ${totalPages} (${filtered.length} total)</span>
      <div style="display: flex; gap: 6px;">
        <button class="env-btn-sm" id="env-prev-page" ${currentPage === 1 ? 'disabled style="opacity: 0.4;"' : ''}>Previous</button>
        <button class="env-btn-sm" id="env-next-page" ${currentPage >= totalPages ? 'disabled style="opacity: 0.4;"' : ''}>Next</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const searchInput = card.querySelector('#env-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        renderPage();
      });
    }

    const filterTypeEl = card.querySelector('#env-filter-type');
    if (filterTypeEl) {
      filterTypeEl.addEventListener('change', (e) => {
        filterType = e.target.value;
        currentPage = 1;
        renderPage();
      });
    }

    const filterStatusEl = card.querySelector('#env-filter-status');
    if (filterStatusEl) {
      filterStatusEl.addEventListener('change', (e) => {
        filterStatus = e.target.value;
        currentPage = 1;
        renderPage();
      });
    }

    const resetBtn = card.querySelector('#env-btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchQuery = '';
        filterType = 'all';
        filterStatus = 'all';
        currentPage = 1;
        renderPage();
      });
    }

    const prevBtn = card.querySelector('#env-prev-page');
    if (prevBtn && currentPage > 1) {
      prevBtn.addEventListener('click', () => { currentPage--; renderPage(); });
    }

    const nextBtn = card.querySelector('#env-next-page');
    if (nextBtn && currentPage < totalPages) {
      nextBtn.addEventListener('click', () => { currentPage++; renderPage(); });
    }
  }, 20);

  return card;
}

// ── 15. TEAM, ACTIVITY & INSIGHTS ──
function buildTeamSection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  const items = ENVIRONMENTAL_TEAM.map(t => `
    <div style="display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.03); padding: 8px 10px; border-radius: 8px; font-size: 11px;">
      <div class="env-profile-avatar" style="width: 28px; height: 28px; font-size: 11px;">${t.avatar}</div>
      <div style="flex: 1;">
        <div style="font-weight: 700; color: #ffffff;">${t.name}</div>
        <div style="color: var(--env-text-dim); font-size: 10px;">${t.role} // ${t.station}</div>
      </div>
      <span style="color: ${t.statusColor}; font-weight: 700; font-size: 10px;">● ${t.status}</span>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div class="env-card-title">
        <span>👥 Environmental Science Team</span>
      </div>
      <span class="env-kpi-pill stable">3 Leads</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${items}
    </div>
  `;
  return card;
}

function buildRecentActivitySection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  const items = RECENT_ENVIRONMENTAL_ACTIVITY.map(a => `
    <div style="border-left: 2px solid rgba(0, 240, 255, 0.4); padding-left: 10px; font-size: 11px; margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; font-size: 9px; color: var(--env-cyan); font-family: var(--env-font-mono);">
        <span>${a.time}</span>
        <span>${a.station}</span>
      </div>
      <div style="color: #ffffff; font-weight: 600; margin-top: 2px;">${a.title}</div>
      <div style="color: var(--env-text-dim); font-size: 10px;">Source: ${a.user}</div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div class="env-card-title">
        <span>📋 Telemetry Activity Log</span>
      </div>
      <span class="env-badge-live">SCADA</span>
    </div>
    <div style="display: flex; flex-direction: column; max-height: 200px; overflow-y: auto;">
      ${items}
    </div>
  `;
  return card;
}

function buildInsightsSection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  const items = ENVIRONMENTAL_INSIGHTS.map(i => `
    <div style="background: rgba(0, 240, 255, 0.04); border: 1px solid rgba(0, 240, 255, 0.12); padding: 8px 10px; border-radius: 6px; font-size: 11px; margin-bottom: 6px;">
      <div style="font-weight: 700; color: var(--env-cyan);">${i.title}</div>
      <div style="color: #cbd5e1; font-size: 10px; margin-top: 2px;">${i.content}</div>
      <div style="display: flex; justify-content: space-between; font-size: 9px; color: var(--env-text-dim); margin-top: 4px;">
        <span>Source: ${i.source}</span>
        <span>Confidence: ${i.confidence}</span>
      </div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div class="env-card-title">
        <span>💡 AI Mission Intelligence Insights</span>
      </div>
      <span class="env-badge-live">REASONING</span>
    </div>
    <div style="display: flex; flex-direction: column;">
      ${items}
    </div>
  `;
  return card;
}

// ── 16. ALERT THRESHOLDS REFERENCE TABLE ──
function buildThresholdsSection() {
  const card = document.createElement('div');
  card.className = 'env-card';

  const rows = ALERT_THRESHOLDS.map(t => `
    <tr>
      <td><strong>${t.parameter}</strong></td>
      <td style="color: #f59e0b;">${t.warningThreshold}</td>
      <td style="color: #ef4444;">${t.criticalThreshold}</td>
      <td>${t.currentMaitri}</td>
      <td>${t.currentBharati}</td>
    </tr>
  `).join('');

  card.innerHTML = `
    <div class="env-card-header">
      <div>
        <div class="env-card-title">
          <span>⚙️ Meteorological Operational Alert Thresholds</span>
        </div>
        <div class="env-card-subtitle">Safety criteria established by NCPOR Polar Logistics Command</div>
      </div>
      <span class="env-badge-live">SAFETY BASELINE</span>
    </div>
    <div class="env-table-responsive">
      <table class="env-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Warning Trigger</th>
            <th>Critical Trigger</th>
            <th>Maitri Value</th>
            <th>Bharati Value</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
  return card;
}

// ── 17. SENSOR DETAIL DRAWER ──
function buildDrawer() {
  const backdrop = document.createElement('div');
  backdrop.id = 'env-drawer-backdrop';
  backdrop.className = `env-drawer-backdrop ${selectedSensor ? 'open' : ''}`;

  const drawer = document.createElement('div');
  drawer.id = 'env-drawer';
  drawer.className = `env-drawer ${selectedSensor ? 'open' : ''}`;

  if (selectedSensor) {
    drawer.innerHTML = `
      <div class="env-drawer-header">
        <div>
          <div style="font-size: 14px; font-weight: 800; color: #ffffff;">${selectedSensor.name}</div>
          <div style="font-size: 11px; color: var(--env-cyan); font-family: var(--env-font-mono);">${selectedSensor.id} // ${selectedSensor.station}</div>
        </div>
        <button class="env-drawer-close" onclick="closeSensorDrawer()">✕</button>
      </div>
      <div class="env-drawer-body">
        <div style="background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.2); padding: 12px; border-radius: 8px;">
          <div style="font-size: 10px; color: var(--env-text-muted); text-transform: uppercase;">Current Live Reading</div>
          <div style="font-size: 28px; font-weight: 900; color: #ffffff; font-family: var(--env-font-mono);">
            ${selectedSensor.reading} <span style="font-size: 16px; color: var(--env-cyan);">${selectedSensor.unit}</span>
          </div>
          <div style="font-size: 11px; color: ${selectedSensor.status === 'Online' ? '#10b981' : '#f59e0b'}; font-weight: 700; margin-top: 4px;">
            ● ${selectedSensor.status} (Health: ${selectedSensor.health}%)
          </div>
        </div>

        <div style="font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
            <span style="color: var(--env-text-muted);">Station & Location</span>
            <strong>${selectedSensor.station} // ${selectedSensor.location}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
            <span style="color: var(--env-text-muted);">Signal Strength</span>
            <strong>${selectedSensor.signalStrength}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
            <span style="color: var(--env-text-muted);">Assigned Technician</span>
            <strong>${selectedSensor.assignedEmployee}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
            <span style="color: var(--env-text-muted);">Calibration Valid Until</span>
            <strong>${selectedSensor.calibratedUntil}</strong>
          </div>
        </div>

        <div style="font-weight: 700; font-size: 12px; color: #ffffff; margin-top: 10px;">Recent 15-Minute Telemetry Stream</div>
        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 6px 10px; border-radius: 4px;">
            <span>09:44 UTC</span>
            <strong>${selectedSensor.reading} ${selectedSensor.unit}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 6px 10px; border-radius: 4px;">
            <span>09:30 UTC</span>
            <strong>${typeof selectedSensor.reading === 'number' ? (selectedSensor.reading * 0.98).toFixed(1) : selectedSensor.reading} ${selectedSensor.unit}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 6px 10px; border-radius: 4px;">
            <span>09:15 UTC</span>
            <strong>${typeof selectedSensor.reading === 'number' ? (selectedSensor.reading * 0.96).toFixed(1) : selectedSensor.reading} ${selectedSensor.unit}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 14px;">
          <button class="env-btn-sm" style="flex: 1; padding: 8px;" onclick="pingSensor('${selectedSensor.id}')">📡 Ping Sensor</button>
          <button class="env-btn-sm" style="flex: 1; padding: 8px; background: rgba(0,240,255,0.15); color: var(--env-cyan);" onclick="calibrateSensor('${selectedSensor.id}')">⚙️ Calibrate</button>
        </div>
      </div>
    `;
  }

  backdrop.appendChild(drawer);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeSensorDrawer();
  });

  return backdrop;
}

// ── Global Window Handlers for Interactive Actions ──
window.inspectSensor = (sensorId) => {
  const found = workingSensors.find(s => s.id === sensorId);
  if (found) {
    selectedSensor = found;
    renderPage();
  }
};

window.closeSensorDrawer = () => {
  selectedSensor = null;
  renderPage();
};

window.acknowledgeAlert = (alertId) => {
  workingAlerts = workingAlerts.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a);
  renderPage();
  showToast(`Alert ${alertId} acknowledged by Commander.`);
};

window.pingSensor = (sensorId) => {
  showToast(`Ping packet dispatched to ${sensorId}: 14ms latency (Nominal)`, 'success');
};

window.calibrateSensor = (sensorId) => {
  showToast(`Initiating zero-drift recalibration routine on ${sensorId}...`, 'success');
};

window.selectStationMap = (stationKey) => {
  selectedStation = stationKey;
  renderPage();
  showToast(`Viewing ${stationKey === 'maitri' ? 'Maitri Station' : 'Bharati Station'} environmental telemetry.`);
};

window.showStationModal = (stationKey) => {
  selectedStation = stationKey;
  renderPage();
  showToast(`Filtering metrics to ${stationKey.toUpperCase()}`);
};
