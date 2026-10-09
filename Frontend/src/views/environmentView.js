// Environment View Module
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export function renderEnvironmentView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const state = telemetryEngine.getState();

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Polar Environment & Meteorology</h1>
        <p class="page-subheading">Atmospheric pressure, Blizzard warning triggers, UV radiation, and seismic monitoring</p>
      </div>
      <div class="page-actions">
        <a href="#envMonitoring" class="btn btn-primary btn-sm">Environmental Operations Center ↗</a>
        <button class="btn btn-danger btn-sm">Issue Weather Warning</button>
      </div>
    </div>

    <!-- METEOROLOGY KPI GRID -->
    <div class="kpi-grid">
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Wind Velocity</span><div class="kpi-icon" style="font-family:var(--font-mono); font-size:11px;">KTS</div></div>
        <div class="kpi-value-row">
          <span class="kpi-value">${state.kpis.windSpeedKnots} Knots</span>
          <span class="kpi-trend warning">Gale Force</span>
        </div>
        <div class="kpi-subtext">Direction: 210° SW | Gusts 58 kts</div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Barometric Pressure</span><div class="kpi-icon" style="font-family:var(--font-mono); font-size:11px;">BARO</div></div>
        <div class="kpi-value-row">
          <span class="kpi-value">982 hPa</span>
          <span class="kpi-trend negative">↓ Falling 4hPa</span>
        </div>
        <div class="kpi-subtext">Storm Front Approaching</div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Stratospheric Ozone</span><div class="kpi-icon" style="font-family:var(--font-mono); font-size:11px;">O3</div></div>
        <div class="kpi-value-row">
          <span class="kpi-value">185 DU</span>
          <span class="kpi-trend positive">Dobson Units</span>
        </div>
        <div class="kpi-subtext">UV Index: 1.2 (Low Solar Angle)</div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Ice Shelf Seismic Tremors</span><div class="kpi-icon" style="font-family:var(--font-mono); font-size:11px;">SEIS</div></div>
        <div class="kpi-value-row">
          <span class="kpi-value">0.12 Mw</span>
          <span class="kpi-trend neutral">Quiet</span>
        </div>
        <div class="kpi-subtext">Crevasse Acoustic Sensors Normal</div>
      </div>
    </div>

    <!-- WEATHER TREND CHART -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Ambient Temperature & Windchill Profile (24h)</div>
      </div>
      <div class="card-body">
        <div style="height: 280px; position: relative;">
          <canvas id="env-weather-chart"></canvas>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const canvas = container.querySelector('#env-weather-chart');
    if (canvas) {
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
          datasets: [
            { label: 'Ambient Air Temp (°C)', data: [-32, -33, -35, -34.2, -31, -33, -34.2, -35], borderColor: '#3b82f6', tension: 0.3 },
            { label: 'Windchill (°C)', data: [-45, -46, -49, -48.5, -44, -47, -48.5, -50], borderColor: '#ef4444', tension: 0.3 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }, 50);

  return container;
}
