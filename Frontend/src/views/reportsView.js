// Reports & Analytics View Module
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export function renderReportsView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Station Analytics & Historical Reports</h1>
        <p class="page-subheading">Generate telemetry summaries, energy consumption analysis, and weather impact reports</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm" id="btn-gen-pdf">Generate PDF Report</button>
      </div>
    </div>

    <!-- REPORT FILTER CARD -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Custom Telemetry Report Builder</div>
      </div>
      <div class="card-body">
        <div class="grid-3">
          <div class="form-group">
            <label class="form-label">Select Metric Subsystem</label>
            <select class="form-select">
              <option>Microgrid Power Output (kW)</option>
              <option>Cryo Vault Thermal Stability</option>
              <option>Permafrost Anchor Strain</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Timeframe Window</label>
            <select class="form-select">
              <option>Last 7 Days (Polar Shift Alpha)</option>
              <option>Last 30 Days</option>
              <option>Year-To-Date (2026 Season)</option>
            </select>
          </div>

          <div class="form-group" style="display:flex; align-items:flex-end;">
            <button class="btn btn-secondary" style="width:100%;">Query Historical Database</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ANALYTICS GRAPH -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">7-Day Comparative Efficiency Trends</div>
      </div>
      <div class="card-body">
        <div style="height: 300px; position: relative;">
          <canvas id="reports-analytics-chart"></canvas>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const canvas = container.querySelector('#reports-analytics-chart');
    if (canvas) {
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            { label: 'Green Energy Used (kWh)', data: [3100, 3450, 3200, 3800, 3600, 3900, 4100], backgroundColor: '#10b981' },
            { label: 'Thermal Losses (kWh)', data: [210, 180, 190, 150, 160, 140, 130], backgroundColor: '#ef4444' }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }, 50);

  return container;
}
