// Energy View Module
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export function renderEnergyView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const state = telemetryEngine.getState();

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Polar Microgrid & Power Generation</h1>
        <p class="page-subheading">Wind turbine arrays, solar PV tilt arrays, diesel emergency generators & BESS battery storage</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm">Grid Balancer Configuration</button>
        <button class="btn btn-primary btn-sm">Force Battery Discharge Test</button>
      </div>
    </div>

    <!-- ENERGY KPI GRID -->
    <div class="kpi-grid">
      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Wind Turbine Generation</span>
          <div class="kpi-icon" style="font-family:var(--font-mono); font-size:11px;">WIND</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${state.kpis.windOutputKw} kW</span>
          <span class="kpi-trend positive">52% Share</span>
        </div>
        <div class="kpi-subtext">8 / 8 Turbines Operational</div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Solar PV Polar Tilt</span>
          <div class="kpi-icon" style="font-family:var(--font-mono); font-size:11px;">SOLAR</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${state.kpis.solarOutputKw} kW</span>
          <span class="kpi-trend positive">34% Share</span>
        </div>
        <div class="kpi-subtext">Sun Elevation: 14.2°</div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Battery Reserves (BESS)</span>
          <div class="kpi-icon" style="font-family:var(--font-mono); font-size:11px;">BESS</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${state.kpis.batteryChargePercent}%</span>
          <span class="kpi-trend positive">Full Reserve</span>
        </div>
        <div class="kpi-subtext">Estimated Backup: 48.5 Hours</div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Diesel Backup Generators</span>
          <div class="kpi-icon" style="font-family:var(--font-mono); font-size:11px;">GEN</div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">STANDBY</span>
          <span class="kpi-trend neutral">0.0 kW</span>
        </div>
        <div class="kpi-subtext">Fuel Consumption: 0 L/hr</div>
      </div>
    </div>

    <!-- CHARTS GRID -->
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Generation vs Station Demand (24h)</div>
        </div>
        <div class="card-body">
          <div style="height: 280px; position: relative;">
            <canvas id="energy-gen-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Power Distribution Share</div>
        </div>
        <div class="card-body">
          <div style="height: 280px; position: relative;">
            <canvas id="energy-share-chart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    initEnergyCharts(container.querySelector('#energy-gen-chart'), container.querySelector('#energy-share-chart'));
  }, 50);

  return container;
}

function initEnergyCharts(genCanvas, shareCanvas) {
  if (genCanvas) {
    new Chart(genCanvas, {
      type: 'line',
      data: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        datasets: [
          { label: 'Total Supply (kW)', data: [130, 138, 142, 155, 160, 148, 142, 145], borderColor: '#10b981', tension: 0.3 },
          { label: 'Station Demand (kW)', data: [110, 115, 125, 140, 145, 138, 135, 130], borderColor: '#2563eb', borderDash: [4, 4], tension: 0.3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  if (shareCanvas) {
    new Chart(shareCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Wind Turbines', 'Solar PV', 'Fuel Cells', 'Emergency Diesel'],
        datasets: [{
          data: [52, 34, 14, 0],
          backgroundColor: ['#2563eb', '#10b981', '#8b5cf6', '#ef4444']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
    });
  }
}
