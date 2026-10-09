// Environmental Monitoring Operations Center — Native SPA View Module
// Full-spectrum polar meteorology, station atmospheric sensors, blizzard risk, and digital twin synchronization

import '../pages/EnvironmentalMonitoring/environmental.css';
import Chart from 'chart.js/auto';
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
} from '../pages/EnvironmentalMonitoring/data/environmentalDemoData.js';

export function renderEnvironmentalMonitoringView(telemetryEngine, authService, onNavigate) {
  const container = document.createElement('div');
  container.className = 'content-body env-monitoring-view-root';

  // ── State ──
  let selectedStation = 'all'; // 'all', 'maitri', 'bharati'
  let trendTimeframe = '24h'; // '24h', '7d', '30d'
  let searchQuery = '';
  let filterType = 'all';
  let filterStatus = 'all';
  let currentPage = 1;
  const PAGE_SIZE = 6;
  let selectedSensor = null;

  let workingSensors = [...ENVIRONMENTAL_SENSORS];
  let workingAlerts = [...ENVIRONMENTAL_ALERTS];

  let tempChartInstance = null;
  let windChartInstance = null;

  function showToast(message, type = 'success') {
    let toastContainer = container.querySelector('#env-view-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'env-view-toast-container';
      toastContainer.className = 'env-toast-container';
      container.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `env-toast ${type}`;
    const icon = type === 'success' 
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>' 
      : type === 'warning' 
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' 
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    toast.innerHTML = `<span style="display:inline-flex; align-items:center;">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 260);
    }, 3200);
  }

  function renderContent() {
    // Cleanup previous charts
    if (tempChartInstance) { tempChartInstance.destroy(); tempChartInstance = null; }
    if (windChartInstance) { windChartInstance.destroy(); windChartInstance = null; }

    container.innerHTML = '';

    // Page title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'page-title-bar';
    titleBar.innerHTML = `
      <div>
        <div class="breadcrumbs" style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 4px;">
          <span style="cursor: pointer; color: var(--accent-signal);" id="env-breadcrumb-weather">POLAR WEATHER</span>
          <span style="color: var(--text-dim);">/</span>
          <span style="color: var(--text-primary); font-weight: 600;">ENVIRONMENTAL OPERATIONS</span>
        </div>
        <h1 class="page-heading" style="margin: 0; font-size: 20px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.3px;">
          Environmental Monitoring Operations Center
        </h1>
        <p class="page-subheading" style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-secondary);">
          Atmospheric telemetry, blizzard warning triggers, sensor networks, and cross-department environmental impacts.
        </p>
      </div>
      <div class="page-actions" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <div class="env-station-tabs">
          <button class="env-station-tab ${selectedStation === 'all' ? 'active' : ''}" data-station="all">All Stations</button>
          <button class="env-station-tab ${selectedStation === 'maitri' ? 'active' : ''}" data-station="maitri">Maitri</button>
          <button class="env-station-tab ${selectedStation === 'bharati' ? 'active' : ''}" data-station="bharati">Bharati</button>
        </div>

        <div class="env-sync-pill" title="Synchronized with IMD / WMO Polar Meteorological Grid">
          <span class="env-sync-dot"></span>
          <span style="font-family: var(--font-mono); font-size: 11px;">IMD WMO 60s</span>
        </div>

        <button class="btn btn-secondary btn-sm" id="btn-env-calibrate-trigger">
          🔬 Sensor Calibration
        </button>
      </div>
    `;
    container.appendChild(titleBar);

    // Main content
    const content = document.createElement('div');
    content.className = 'env-content';
    content.style.padding = '0';
    content.style.marginTop = '16px';

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

    // 7. Cross-Department Impacts
    content.appendChild(buildCrossDepartmentSection());

    // 8. 7-Day Polar Forecast
    content.appendChild(buildForecastSection());

    // 9. Alerts & Risk Index Grid
    const alertRiskGrid = document.createElement('div');
    alertRiskGrid.className = 'env-grid-2';
    alertRiskGrid.appendChild(buildAlertsSection());
    alertRiskGrid.appendChild(buildRiskSection());
    content.appendChild(alertRiskGrid);

    // 10. Sensor Status Summary & Asset Table
    content.appendChild(buildSensorSummarySection());
    content.appendChild(buildSensorTableSection());

    container.appendChild(content);
    container.appendChild(buildDrawer());

    // Attach Handlers
    attachEventHandlers();

    // Initialize Charts after DOM injection
    setTimeout(() => {
      initCharts();
    }, 80);
  }

  // ── Overview Section ──
  function buildOverviewSection() {
    const sec = document.createElement('div');
    sec.className = 'env-overview-kpi-grid';
    const kpis = ENVIRONMENTAL_OVERVIEW_KPIS;

    sec.innerHTML = `
      <div class="env-kpi-card">
        <div class="env-kpi-label">Avg Station Temp</div>
        <div class="env-kpi-val" style="color: var(--env-cyan);">${kpis.avgStationTemp}</div>
        <div class="env-kpi-sub" style="color: var(--env-amber);">${kpis.lowestTempRecorded} Extreme</div>
      </div>
      <div class="env-kpi-card">
        <div class="env-kpi-label">Peak Wind Velocity</div>
        <div class="env-kpi-val" style="color: #fca5a5;">${kpis.peakWindSpeed}</div>
        <div class="env-kpi-sub" style="color: var(--env-red);">Category 2 Gale</div>
      </div>
      <div class="env-kpi-card">
        <div class="env-kpi-label">Active Blizzard Alert</div>
        <div class="env-kpi-val" style="color: var(--env-amber);">${kpis.activeAlerts} Active</div>
        <div class="env-kpi-sub" style="color: var(--env-green);">${kpis.blizzardWarningStatus}</div>
      </div>
      <div class="env-kpi-card">
        <div class="env-kpi-label">Sensor Network Health</div>
        <div class="env-kpi-val" style="color: var(--env-green);">${kpis.sensorNetworkHealth}</div>
        <div class="env-kpi-sub">${kpis.activeSensorsCount} Nodes Reporting</div>
      </div>
      <div class="env-kpi-card">
        <div class="env-kpi-label">Solar Radiation Index</div>
        <div class="env-kpi-val" style="color: var(--env-purple);">${kpis.avgSolarRadiation}</div>
        <div class="env-kpi-sub">UV Index: ${kpis.uvIndex}</div>
      </div>
    `;
    return sec;
  }

  // ── Station Status Comparison ──
  function buildStationStatusSection() {
    const sec = document.createElement('div');
    sec.className = 'env-grid-2';

    const maitri = STATIONS_ENVIRONMENT.maitri;
    const bharati = STATIONS_ENVIRONMENT.bharati;

    sec.innerHTML = `
      <div class="env-card">
        <div class="env-card-header">
          <div>
            <div class="env-card-title">Maitri Station (Schirmacher Oasis)</div>
            <div class="env-card-subtitle">Coordinates: 70°45'57"S, 11°44'09"E · Elev: 117m</div>
          </div>
          <span class="env-badge-live">INLAND ICE SHELF</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; margin-top: 8px;">
          <div><div style="font-size:10px; color:var(--text-muted);">TEMP</div><strong style="font-size:16px; color:var(--env-cyan);">${maitri.temperature}</strong></div>
          <div><div style="font-size:10px; color:var(--text-muted);">WIND</div><strong style="font-size:16px; color:#fca5a5;">${maitri.windSpeed}</strong></div>
          <div><div style="font-size:10px; color:var(--text-muted);">PRESSURE</div><strong style="font-size:16px; color:#ffffff;">${maitri.pressure}</strong></div>
          <div><div style="font-size:10px; color:var(--text-muted);">STATUS</div><span style="font-size:10px; font-weight:700; color:var(--env-green);">NORMAL</span></div>
        </div>
      </div>

      <div class="env-card">
        <div class="env-card-header">
          <div>
            <div class="env-card-title">Bharati Station (Larsemann Hills)</div>
            <div class="env-card-subtitle">Coordinates: 69°24'28"S, 76°11'14"E · Elev: 35m</div>
          </div>
          <span class="env-badge-live" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border-color: rgba(245, 158, 11, 0.3);">COASTAL MARITIME</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; margin-top: 8px;">
          <div><div style="font-size:10px; color:var(--text-muted);">TEMP</div><strong style="font-size:16px; color:var(--env-cyan);">${bharati.temperature}</strong></div>
          <div><div style="font-size:10px; color:var(--text-muted);">WIND</div><strong style="font-size:16px; color:var(--env-amber);">${bharati.windSpeed}</strong></div>
          <div><div style="font-size:10px; color:var(--text-muted);">PRESSURE</div><strong style="font-size:16px; color:#ffffff;">${bharati.pressure}</strong></div>
          <div><div style="font-size:10px; color:var(--text-muted);">STATUS</div><span style="font-size:10px; font-weight:700; color:var(--env-amber);">GALE WARNING</span></div>
        </div>
      </div>
    `;
    return sec;
  }

  // ── Live Conditions Hero ──
  function buildLiveConditionsSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header">
        <div>
          <div class="env-card-title">Live Atmospheric Meteorology &amp; Blizzard Warning</div>
          <div class="env-card-subtitle">Real-time IMD Automated Polar Weather Station Array (APWA)</div>
        </div>
        <span class="env-badge-live">SEVERE WEATHER ADVISORY</span>
      </div>
      <div style="background: rgba(245, 158, 11, 0.08); border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 4px; font-size: 12px; line-height: 1.5; margin-bottom: 12px;">
        <strong style="color: #f59e0b;">Blizzard Alert Level 2 (Larsemann Hills Corridor):</strong> Wind gusts exceeding 58 knots expected at Bharati coastal perimeter between 14:00 and 22:00 UTC. Non-essential exterior scientific traverses are suspended.
      </div>
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;">
        <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted);">SURFACE AIR TEMP</div>
          <div style="font-size: 20px; font-weight: 800; color: var(--env-cyan); font-family: var(--font-mono); margin-top: 4px;">-28.4 °C</div>
          <div style="font-size: 10px; color: var(--text-dim);">Wind Chill: -41.2 °C</div>
        </div>
        <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted);">SUSTAINED WIND</div>
          <div style="font-size: 20px; font-weight: 800; color: #fca5a5; font-family: var(--font-mono); margin-top: 4px;">34.6 kts</div>
          <div style="font-size: 10px; color: var(--text-dim);">Peak Gust: 52.8 kts</div>
        </div>
        <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted);">SURFACE PRESSURE</div>
          <div style="font-size: 20px; font-weight: 800; color: #ffffff; font-family: var(--font-mono); margin-top: 4px;">982.4 hPa</div>
          <div style="font-size: 10px; color: #f59e0b;">↓ 4.1 hPa / 3h (Fall)</div>
        </div>
        <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted);">OPTICAL VISIBILITY</div>
          <div style="font-size: 20px; font-weight: 800; color: #38bdf8; font-family: var(--font-mono); margin-top: 4px;">1.8 km</div>
          <div style="font-size: 10px; color: var(--text-dim);">Blowing Snow Hazard</div>
        </div>
        <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted);">REL HUMIDITY</div>
          <div style="font-size: 20px; font-weight: 800; color: #10b981; font-family: var(--font-mono); margin-top: 4px;">76.2 %</div>
          <div style="font-size: 10px; color: var(--text-dim);">Dew Pt: -31.0 °C</div>
        </div>
      </div>
    `;
    return card;
  }

  // ── Charts: Temp Trend & Wind Conditions ──
  function buildTemperatureTrendSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header">
        <div>
          <div class="env-card-title">Temperature Variations (24h Trend)</div>
          <div class="env-card-subtitle">Ambient, Wind Chill &amp; Surface Frost Profiles</div>
        </div>
        <div class="env-chart-timeframe-tabs">
          <button class="env-timeframe-tab ${trendTimeframe === '24h' ? 'active' : ''}" data-tf="24h">24H</button>
          <button class="env-timeframe-tab ${trendTimeframe === '7d' ? 'active' : ''}" data-tf="7d">7D</button>
          <button class="env-timeframe-tab ${trendTimeframe === '30d' ? 'active' : ''}" data-tf="30d">30D</button>
        </div>
      </div>
      <div style="height: 240px; position: relative;">
        <canvas id="env-temp-chart-canvas"></canvas>
      </div>
    `;
    return card;
  }

  function buildWindConditionsSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header">
        <div>
          <div class="env-card-title">Wind Vector &amp; Blizzard Index</div>
          <div class="env-card-subtitle">Anemometer Array (Larsemann &amp; Schirmacher)</div>
        </div>
        <span class="env-badge-live">GUST DETECTION</span>
      </div>
      <div style="height: 240px; position: relative;">
        <canvas id="env-wind-chart-canvas"></canvas>
      </div>
    `;
    return card;
  }

  // ── Atmospheric Details ──
  function buildSnowConditionsSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header"><div class="env-card-title">Snowpack &amp; Drift Depth</div></div>
      <div style="font-size: 11.5px; color: #cbd5e1; display: flex; flex-direction: column; gap: 8px;">
        <div>Fresh Snow Accumulation (24h): <strong style="color: #ffffff;">14.2 cm</strong></div>
        <div>Total Snowpack Base: <strong style="color: #ffffff;">218 cm</strong></div>
        <div>Crevasse Bridge Stability: <strong style="color: var(--env-green);">HIGH (Frozen)</strong></div>
      </div>
    `;
    return card;
  }

  function buildVisibilitySection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header"><div class="env-card-title">Optical Visibility &amp; Whiteout</div></div>
      <div style="font-size: 11.5px; color: #cbd5e1; display: flex; flex-direction: column; gap: 8px;">
        <div>Current Runway Visual Range (RVR): <strong style="color: #ffffff;">1,800 m</strong></div>
        <div>Whiteout Risk Probability: <strong style="color: #f59e0b;">MEDIUM (42%)</strong></div>
        <div>Ceiling / Cloud Base: <strong style="color: #ffffff;">850 ft Overcast</strong></div>
      </div>
    `;
    return card;
  }

  function buildAtmosphericSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header"><div class="env-card-title">Radiation &amp; Magnetosphere</div></div>
      <div style="font-size: 11.5px; color: #cbd5e1; display: flex; flex-direction: column; gap: 8px;">
        <div>Solar Irradiance: <strong style="color: #ffffff;">142 W/m²</strong></div>
        <div>Geomagnetic K-Index: <strong style="color: var(--env-purple);">Kp 4 (Active Aurora)</strong></div>
        <div>Ozone Depletion Factor: <strong style="color: #ffffff;">Normal Seasonal</strong></div>
      </div>
    `;
    return card;
  }

  // ── Map & Digital Twin Flow ──
  function buildEnvironmentalMapSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header">
        <div>
          <div class="env-card-title">Antarctic Weather Sensor Topology Map</div>
          <div class="env-card-subtitle">Automated stations, satellite downlinks, and weather radars</div>
        </div>
        <span class="env-badge-live">RADAR LIVE</span>
      </div>
      <div style="background: radial-gradient(circle at 50% 50%, #10214a 0%, #060b1c 80%); height: 220px; border-radius: 8px; position: relative; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(0, 240, 255, 0.15);">
        <div style="position: absolute; width: 140px; height: 140px; border: 1px dashed rgba(0, 240, 255, 0.2); border-radius: 50%;"></div>
        <div style="position: absolute; width: 80px; height: 80px; border: 1px dashed rgba(0, 240, 255, 0.3); border-radius: 50%;"></div>
        <div style="text-align: center; z-index: 2;">
          <div style="font-size: 24px;">🌐</div>
          <div style="font-size: 11px; font-weight: 700; color: #ffffff; margin-top: 4px;">ANTARCTIC POLAR WEATHER GRID</div>
          <div style="font-size: 10px; color: var(--text-dim);">IMD INSAT-3D &amp; WMO Surface Sensor Synchronization</div>
        </div>
      </div>
    `;
    return card;
  }

  function buildDigitalTwinFlowSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header">
        <div>
          <div class="env-card-title">Digital Twin Atmospheric Coupling Flow</div>
          <div class="env-card-subtitle">Subsystem impact propagation from external weather conditions</div>
        </div>
        <span class="env-badge-live">COUPLED MODEL</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
        <div style="background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between;">
          <span>External -28.4°C / 34kt Gale</span>
          <strong style="color: var(--env-amber);">➔ HVAC Microgrid Thermal Load +18%</strong>
        </div>
        <div style="background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between;">
          <span>Snow Drift Accumulation</span>
          <strong style="color: #38bdf8;">➔ Solar PV Array Efficiency -65%</strong>
        </div>
        <div style="background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between;">
          <span>Sub-Zero Lubricant Viscosity</span>
          <strong style="color: #10b981;">➔ Auxiliary Generators Pre-Heated</strong>
        </div>
      </div>
    `;
    return card;
  }

  // ── Cross Department Impacts ──
  function buildCrossDepartmentSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header">
        <div class="env-card-title">Cross-Department Environmental Operations Advisory</div>
        <span class="env-badge-live">IMPACT ADVISORY</span>
      </div>
      <div class="env-grid-3">
        <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; font-size: 11px;">
          <strong style="color: #38bdf8; display:flex; align-items:center; gap:5px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
            <span>Logistics &amp; Air Cargo:</span>
          </strong>
          <div style="margin-top: 4px; color: var(--text-secondary);">Skiway landing at Bharati delayed until 22:00 UTC due to crosswind shear. Emergency air delivery ETA monitored.</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; font-size: 11px;">
          <strong style="color: #f59e0b; display:flex; align-items:center; gap:5px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>Energy &amp; Power Grid:</span>
          </strong>
          <div style="margin-top: 4px; color: var(--text-secondary);">Wind turbine curtailment activated if gusts exceed 60 kts. Battery storage at 94% buffer.</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; font-size: 11px;">
          <strong style="color: #10b981; display:flex; align-items:center; gap:5px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>
            <span>Field Research Science:</span>
          </strong>
          <div style="margin-top: 4px; color: var(--text-secondary);">Lake Zub glaciology core sampling expedition held at Base Shelter 3 until visibility clears.</div>
        </div>
      </div>
    `;
    return card;
  }

  // ── 7-Day Forecast ──
  function buildForecastSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    const forecast = ENVIRONMENTAL_7DAY_FORECAST || [];

    const getForecastSvg = (condition) => {
      const c = (condition || '').toLowerCase();
      if (c.includes('clear') || c.includes('sun')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
      }
      if (c.includes('snow') || c.includes('blizzard') || c.includes('drift')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4-4"/></svg>';
      }
      if (c.includes('partly') || c.includes('cirrus')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>';
      }
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>';
    };

    const daysHTML = forecast.map(d => `
      <div style="background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px; text-align: center;">
        <div style="font-size: 11px; font-weight: 700; color: #ffffff;">${d.day}</div>
        <div style="font-size: 18px; margin: 6px 0; display:flex; justify-content:center; align-items:center;">${getForecastSvg(d.condition)}</div>
        <div style="font-size: 12px; font-weight: 800; color: var(--env-cyan); font-family: var(--font-mono);">${d.tempHigh} / ${d.tempLow}</div>
        <div style="font-size: 10px; color: var(--text-dim); margin-top: 2px;">${d.wind}</div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="env-card-header">
        <div>
          <div class="env-card-title">7-Day Polar Meteorological Forecast</div>
          <div class="env-card-subtitle">Predictive models from ECMWF / IMD Polar Numerical Weather Prediction</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;">
        ${daysHTML}
      </div>
    `;
    return card;
  }

  // ── Alerts & Risk ──
  function buildAlertsSection() {
    const card = document.createElement('div');
    card.className = 'env-card';

    const alertsHTML = workingAlerts.map(a => `
      <div style="background: rgba(255, 255, 255, 0.03); border-left: 3px solid ${a.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'}; padding: 10px 12px; border-radius: 6px; font-size: 11px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between;">
          <strong style="color: #ffffff;">${a.title}</strong>
          <span style="font-size: 10px; font-weight: 700; color: ${a.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'};">${a.severity}</span>
        </div>
        <div style="color: var(--text-secondary); margin-top: 4px;">${a.description}</div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="env-card-header"><div class="env-card-title">Active Meteorological Alerts</div></div>
      <div style="display: flex; flex-direction: column;">
        ${alertsHTML}
      </div>
    `;
    return card;
  }

  function buildRiskSection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header"><div class="env-card-title">Polar Environmental Risk Index</div></div>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Blizzard &amp; Wind Chill Hazard</span>
            <strong style="color: #f59e0b;">78% (HIGH)</strong>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
            <div style="width: 78%; height: 100%; background: #f59e0b;"></div>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Sea Ice Traversal Risk</span>
            <strong style="color: #ef4444;">86% (CRITICAL)</strong>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
            <div style="width: 86%; height: 100%; background: #ef4444;"></div>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Structural Snow Loading</span>
            <strong style="color: #10b981;">32% (SAFE)</strong>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
            <div style="width: 32%; height: 100%; background: #10b981;"></div>
          </div>
        </div>
      </div>
    `;
    return card;
  }

  // ── Sensor Summary & Table ──
  function buildSensorSummarySection() {
    const card = document.createElement('div');
    card.className = 'env-card';
    card.innerHTML = `
      <div class="env-card-header">
        <div>
          <div class="env-card-title">Environmental Sensor Network Telemetry</div>
          <div class="env-card-subtitle">Status of 24 active automated meteorological and atmospheric nodes</div>
        </div>
      </div>
    `;
    return card;
  }

  function buildSensorTableSection() {
    const card = document.createElement('div');
    card.className = 'env-card';

    const rows = workingSensors.slice(0, 6).map(s => `
      <tr>
        <td><strong>${s.id}</strong></td>
        <td>${s.name}</td>
        <td>${s.station}</td>
        <td>${s.parameter}</td>
        <td><strong style="color: var(--env-cyan);">${s.value}</strong></td>
        <td>
          <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; ${s.status === 'ONLINE' ? 'background: rgba(16,185,129,0.15); color: #10b981;' : 'background: rgba(245,158,11,0.15); color: #f59e0b;'}">
            ${s.status}
          </span>
        </td>
      </tr>
    `).join('');

    card.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="env-sensor-table">
          <thead>
            <tr>
              <th>Sensor ID</th>
              <th>Sensor Designation</th>
              <th>Station</th>
              <th>Parameter</th>
              <th>Reading</th>
              <th>Health</th>
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

  // ── Drawer & Calibration ──
  function buildDrawer() {
    const drawer = document.createElement('div');
    drawer.id = 'env-drawer';
    drawer.className = 'env-drawer';
    drawer.innerHTML = `
      <div class="env-drawer-header">
        <span style="font-weight: 700; color: #ffffff;">Sensor Calibration Utility</span>
        <button style="background:transparent; border:none; color:#cbd5e1; font-size:16px; cursor:pointer;" id="btn-env-drawer-close">✕</button>
      </div>
      <div class="env-drawer-body" style="padding: 16px; font-size: 12px; color: #cbd5e1;">
        <p>Zero-point offset calibration verified against WMO secondary standard barometers and platinum resistance thermometers.</p>
        <button class="btn btn-primary btn-sm" id="btn-env-perform-cal">Run Diagnostics</button>
      </div>
    `;
    return drawer;
  }

  function initCharts() {
    const tempCanvas = container.querySelector('#env-temp-chart-canvas');
    if (tempCanvas) {
      const ctx = tempCanvas.getContext('2d');
      tempChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          datasets: [
            {
              label: 'Ambient Temp (°C)',
              data: [-26.2, -27.8, -28.4, -25.6, -24.8, -27.1, -28.4],
              borderColor: '#00f0ff',
              backgroundColor: 'rgba(0, 240, 255, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Wind Chill (°C)',
              data: [-38.5, -40.1, -41.2, -37.8, -36.2, -39.4, -41.2],
              borderColor: '#38bdf8',
              borderDash: [4, 4],
              tension: 0.3,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } }
          }
        }
      });
    }

    const windCanvas = container.querySelector('#env-wind-chart-canvas');
    if (windCanvas) {
      const ctx = windCanvas.getContext('2d');
      windChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          datasets: [
            {
              label: 'Sustained Wind (kts)',
              data: [22, 28, 34.6, 38, 42, 36, 34.6],
              backgroundColor: 'rgba(245, 158, 11, 0.4)',
              borderColor: '#f59e0b',
              borderWidth: 1
            },
            {
              label: 'Peak Gusts (kts)',
              data: [35, 42, 52.8, 56, 61, 54, 52.8],
              backgroundColor: 'rgba(239, 68, 68, 0.5)',
              borderColor: '#ef4444',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } }
          }
        }
      });
    }
  }

  function attachEventHandlers() {
    const breadcrumbWeather = container.querySelector('#env-breadcrumb-weather');
    if (breadcrumbWeather && onNavigate) {
      breadcrumbWeather.addEventListener('click', () => onNavigate('environment'));
    }

    container.querySelectorAll('.env-station-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedStation = e.currentTarget.getAttribute('data-station');
        renderContent();
        showToast(`Station filter: ${selectedStation.toUpperCase()}`);
      });
    });

    const calBtn = container.querySelector('#btn-env-calibrate-trigger');
    const drawer = container.querySelector('#env-drawer');
    const drawerClose = container.querySelector('#btn-env-drawer-close');

    if (calBtn && drawer) {
      calBtn.addEventListener('click', () => drawer.classList.add('open'));
    }
    if (drawerClose && drawer) {
      drawerClose.addEventListener('click', () => drawer.classList.remove('open'));
    }

    const runDiagBtn = container.querySelector('#btn-env-perform-cal');
    if (runDiagBtn) {
      runDiagBtn.addEventListener('click', () => {
        showToast('Running automated sensor calibration routine... All 24 nodes pass calibration.');
        if (drawer) drawer.classList.remove('open');
      });
    }
  }

  // Initial Render
  renderContent();

  return container;
}
