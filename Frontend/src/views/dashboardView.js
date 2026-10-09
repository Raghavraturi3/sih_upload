// Dashboard View Module - Unified Antarctic Command Center
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export function renderDashboardView(telemetryEngine, onOpenCopilot, authService) {
  const container = document.createElement('div');
  container.className = 'content-body command-center-body';

  const state = telemetryEngine.getState();
  const dbStatus = telemetryEngine.getDBStatus ? telemetryEngine.getDBStatus() : { isConnected: false, state: 'offline' };
  const isAdmin = authService && authService.hasRole && authService.hasRole('ADMIN');
  const telemetryStateLabel = dbStatus.isConnected ? 'Connected' : 'Demo / Offline';
  const statusColor = dbStatus.isConnected ? 'success' : 'warning';

  container.innerHTML = `
    <div class="page-title-bar command-center-header">
      <div>
        <div class="command-center-eyebrow">Maitri Station</div>
        <h1 class="page-heading">Antarctic Operations Command Center</h1>
        <p class="page-subheading">Queens Maud Land, East Antarctica • Mission systems synchronized • ${dbStatus.isConnected ? 'Live backend telemetry' : 'Simulated telemetry mode'}</p>
      </div>
      <div class="page-actions">
        ${isAdmin ? `
          <button class="btn btn-primary btn-sm" id="btn-hero-ai-copilot" title="Open Antarctic AI Voice Copilot (Admin Only)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
            <span>AI COPILOT</span>
          </button>
        ` : ''}
        <button class="btn btn-secondary btn-sm" id="btn-refresh-dash">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Refresh Feed</span>
        </button>
      </div>
    </div>

    <div class="command-center-summary">
      <div class="command-center-status-block">
        <div class="command-center-status-row">
          <span class="command-core-name">MAITRI STATION</span>
          <span class="badge badge-${statusColor}"><span class="status-dot"></span> ${telemetryStateLabel}</span>
        </div>
        <div class="command-center-subtitle">Queen Maud Land, East Antarctica • Last telemetry update ${new Date(state.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Backend ${dbStatus.isConnected ? 'stable' : 'offline/demo'} </div>
      </div>
      <div class="command-center-status-meta">
        <div class="meta-pill"><span class="meta-label">Station status</span><span class="meta-value modern-pill success">OPERATIONAL</span></div>
        <div class="meta-pill"><span class="meta-label">Connection</span><span class="meta-value mono-num ${dbStatus.isConnected ? 'online' : 'offline'}">${dbStatus.isConnected ? 'SYNCED' : 'DEMO'}</span></div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Station output</span>
          <div class="kpi-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" id="kpi-power-val">${state.kpis.powerKw} kW</span>
          <span class="kpi-trend positive">↑ 2.4%</span>
        </div>
        <div class="kpi-subtext">Capacity: <span class="mono-num">${state.kpis.powerCapacityKw} kW</span></div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Ambient temp</span>
          <div class="kpi-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" id="kpi-temp-val">${state.kpis.tempAmbient} °C</span>
          <span class="kpi-trend negative">↓ -1.2°</span>
        </div>
        <div class="kpi-subtext">Windchill: <span class="mono-num">${state.kpis.windChill} °C</span></div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Active personnel</span>
          <div class="kpi-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${state.kpis.activePersonnel} On-Site</span>
          <span class="kpi-trend neutral">Max 60</span>
        </div>
        <div class="kpi-subtext">4 field teams in rotation</div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Incident watch</span>
          <div class="kpi-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" id="kpi-alert-val">${state.kpis.activeAlertsCount} Active</span>
          <span class="kpi-trend warning">P1 Priority</span>
        </div>
        <div class="kpi-subtext">1 high / 2 medium severity</div>
      </div>
    </div>

    <section class="operations-grid">
      <div class="operations-primary card">
        <div class="card-header">
          <div>
            <div class="card-title"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span>Maitri Station — Digital Twin</span></div>
            <div class="card-subtitle">Interactive 3D infrastructure model • ${dbStatus.isConnected ? 'live sync' : 'offline demo'}</div>
          </div>
          <div class="digital-twin-actions">
            <button class="btn btn-secondary btn-sm" id="btn-reset-map">Reset</button>
          </div>
        </div>
        <div class="twin-scene-panel">
          <div id="command-center-twin" class="command-center-twin"></div>
          <div class="twin-scene-toolbar">
            <button class="twin-tool active" data-preset="RESET">Reset</button>
            <button class="twin-tool" data-preset="TOP">Top</button>
            <button class="twin-tool" data-preset="FRONT">Front</button>
            <button class="twin-tool" data-preset="SIDE">Side</button>
            <button class="twin-tool" data-preset="ISOMETRIC">Iso</button>
          </div>
          <div class="twin-scene-legend">
            <span><i class="legend-swatch success"></i>Normal</span>
            <span><i class="legend-swatch warning"></i>Warning</span>
            <span><i class="legend-swatch critical"></i>Critical</span>
          </div>
        </div>
      </div>

      <aside class="operations-side stack-panel">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Weather & Environment</div>
              <div class="card-subtitle">Local conditions</div>
            </div>
          </div>
          <div class="card-body compact-stack">
            <div class="mini-weather-row">
              <div class="weather-temp">-8.2°C</div>
              <div class="weather-meta">Clear sky • 14.6 m/s</div>
            </div>
            <div class="mini-metrics">
              <div><span>Humidity</span><strong>68%</strong></div>
              <div><span>Visibility</span><strong>15 km</strong></div>
              <div><span>Wind</span><strong>E / 14.6 m/s</strong></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Infrastructure health</div>
              <div class="card-subtitle">Current system integrity</div>
            </div>
          </div>
          <div class="card-body compact-stack">
            <div class="health-row">
              <span>Power</span>
              <strong>94%</strong>
              <div class="mini-progress"><i style="width:94%"></i></div>
            </div>
            <div class="health-row">
              <span>Life support</span>
              <strong>97%</strong>
              <div class="mini-progress"><i style="width:97%"></i></div>
            </div>
            <div class="health-row">
              <span>Comms</span>
              <strong>91%</strong>
              <div class="mini-progress"><i style="width:91%"></i></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Critical alerts</div>
              <div class="card-subtitle">Escalated summary</div>
            </div>
          </div>
          <div class="card-body compact-stack">
            <ul class="alert-list">
              <li><span class="dot danger"></span> Cryo vault thermal spike</li>
              <li><span class="dot warning"></span> Turbine icing review</li>
              <li><span class="dot info"></span> Comm noise dampened</li>
            </ul>
          </div>
        </div>
      </aside>
    </section>

    <div class="grid-2-1 dashboard-lower-grid">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">24h energy output</div>
            <div class="card-subtitle">Solar PV vs wind vs storage</div>
          </div>
        </div>
        <div class="card-body">
          <div style="height: 260px; position: relative;">
            <canvas id="dash-power-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Recent activity</div>
            <div class="card-subtitle">Telemetry events & system updates</div>
          </div>
        </div>
        <div class="card-body">
          <ul class="activity-list">
            <li><span class="time">08:42</span><span class="event">Main building HVAC recalibrated</span></li>
            <li><span class="time">08:18</span><span class="event">Solar array gain +6.2% after clearing ice</span></li>
            <li><span class="time">07:54</span><span class="event">Crew rotation log synced to command board</span></li>
            <li><span class="time">07:21</span><span class="event">Fuel reservoir temperature stabilized</span></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Telemetry incidents & alerts</div>
          <div class="card-subtitle">Current triage queue</div>
        </div>
        <a href="#alerts" class="btn btn-secondary btn-sm" id="btn-view-all-alerts">View triage board</a>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Incident ID</th>
              <th>Description</th>
              <th>Sector</th>
              <th>Severity</th>
              <th>Timestamp</th>
              <th>Assignee</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody id="dash-incidents-tbody">
            ${state.incidents.map(inc => `
              <tr>
                <td class="mono-num">${inc.id}</td>
                <td><strong>${inc.title}</strong></td>
                <td>${inc.sector}</td>
                <td><span class="badge ${inc.severity === 'HIGH' ? 'badge-danger' : inc.severity === 'MEDIUM' ? 'badge-warning' : 'badge-info'}">${inc.severity}</span></td>
                <td class="mono-num small-muted">${inc.timestamp}</td>
                <td>${inc.assignee}</td>
                <td style="text-align:right;"><a href="#alerts" class="btn btn-secondary btn-sm btn-action-inspect" data-id="${inc.id}">Inspect</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const copilotBtn = container.querySelector('#btn-hero-ai-copilot');
  if (copilotBtn && onOpenCopilot) copilotBtn.addEventListener('click', onOpenCopilot);

  const refreshBtn = container.querySelector('#btn-refresh-dash');
  if (refreshBtn) refreshBtn.addEventListener('click', () => telemetryEngine.checkDBHealth && telemetryEngine.checkDBHealth());

  const resetBtn = container.querySelector('#btn-reset-map');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    const sceneHost = document.querySelector('#command-center-twin');
    if (sceneHost?.__twinSceneManager?.setCameraPreset) sceneHost.__twinSceneManager.setCameraPreset('RESET');
  });

  setTimeout(() => {
    initUnifiedDigitalTwin(document.querySelector('#command-center-twin'), state, (facility) => {
      const drawer = document.querySelector('#command-center-twin');
      if (drawer) drawer.setAttribute('data-selected-facility', facility?.label || '');
    });
    initPowerChart(container.querySelector('#dash-power-chart'));
  }, 60);

  return container;
}

async function initUnifiedDigitalTwin(rootElement, state, onSelection) {
  if (!rootElement) return;

  rootElement.innerHTML = '';

  const sceneShell = document.createElement('div');
  sceneShell.className = 'digital-twin-shell';
  rootElement.appendChild(sceneShell);

  const loading = document.createElement('div');
  loading.className = 'digital-twin-loading';
  loading.textContent = 'Initializing 3D station model…';
  rootElement.appendChild(loading);

  const fallback = document.createElement('div');
  fallback.className = 'digital-twin-fallback';
  fallback.style.display = 'none';
  fallback.innerHTML = '<strong>WebGL unavailable</strong><span>Switching to a static operational overview for the station model.</span>';
  rootElement.appendChild(fallback);

  const canvasHost = document.createElement('div');
  canvasHost.className = 'digital-twin-canvas-host';
  sceneShell.appendChild(canvasHost);

  let sceneManager = null;
  try {
    const { ThreeSceneManager } = await import('../services/digitalTwin/threeSceneManager.js');
    const { StationModelBuilder, MAITRI_HOTSPOTS } = await import('../services/digitalTwin/stationModels.js');
    sceneManager = new ThreeSceneManager(canvasHost, {
      onSelectObject: (assetId) => {
        const facility = MAITRI_HOTSPOTS.find(item => item.id === assetId);
        if (facility && onSelection) onSelection(facility);
      }
    });
    rootElement.__twinSceneManager = sceneManager;
    const modelBuilder = new StationModelBuilder(sceneManager.scene);
    sceneManager.modelBuilder = modelBuilder;
    modelBuilder.buildStation('MAITRI');
    sceneManager.setStationAtmosphere('MAITRI');
    sceneManager.setCameraPreset('ISOMETRIC');

    const pins = document.createElement('div');
    pins.className = 'digital-twin-pins';
    canvasHost.appendChild(pins);

    const hotspots = MAITRI_HOTSPOTS;
    hotspots.forEach((hotspot) => {
      const pin = document.createElement('button');
      pin.type = 'button';
      pin.className = 'twin-pin';
      pin.textContent = hotspot.label;
      pin.addEventListener('click', () => {
        if (onSelection) onSelection(hotspot);
        if (modelBuilder) modelBuilder.highlightEquipment(hotspot.id);
      });
      pins.appendChild(pin);

      const marker = document.createElement('div');
      marker.className = 'twin-pin-marker';
      marker.style.left = `${(hotspot.pos[0] + 18) * 8}px`;
      marker.style.top = `${(hotspot.pos[2] + 18) * 7}px`;
      pins.appendChild(marker);
    });

    if (loading) loading.remove();
    const sceneButtons = document.querySelectorAll('.twin-tool');
    sceneButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const preset = button.dataset.preset || 'RESET';
        if (rootElement.__twinSceneManager?.setCameraPreset) {
          rootElement.__twinSceneManager.setCameraPreset(preset);
        }
        sceneButtons.forEach((b) => b.classList.toggle('active', b === button));
      });
    });

    if (rootElement.__twinSceneManager?.setCameraPreset) {
      rootElement.__twinSceneManager.setCameraPreset('ISOMETRIC');
    }
  } catch (error) {
    console.warn('3D twin failed to initialize in command center dashboard:', error);
    if (loading) loading.remove();
    if (fallback) fallback.style.display = 'flex';
  }
}

function initPowerChart(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
      datasets: [
        {
          label: 'Solar PV Array (kW)',
          data: [20, 25, 45, 62, 54, 42, 48.2],
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          tension: 0.2,
          borderWidth: 2,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 2.5
        },
        {
          label: 'Wind Turbine Array (kW)',
          data: [65, 72, 80, 78, 85, 74, 74.6],
          borderColor: '#00e5ff',
          backgroundColor: 'transparent',
          tension: 0.2,
          borderWidth: 2,
          pointBackgroundColor: '#00e5ff',
          pointRadius: 2.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }, color: '#94a3b8', boxWidth: 10, padding: 12 } },
        tooltip: { backgroundColor: '#15202e', titleFont: { family: 'Plus Jakarta Sans', weight: '700' }, bodyFont: { family: 'JetBrains Mono' }, padding: 8, cornerRadius: 4, borderColor: 'rgba(255,255,255,0.12)', borderWidth: 1 }
      },
      scales: {
        x: { ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: 'rgba(148,163,184,0.08)' } },
        y: { ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: 'rgba(148,163,184,0.08)' } }
      }
    }
  });
}
