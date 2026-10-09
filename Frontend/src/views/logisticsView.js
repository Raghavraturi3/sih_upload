// Logistics View Module

export function renderLogisticsView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const state = telemetryEngine.getState();

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Polar Logistics & Resupply Operations</h1>
        <p class="page-subheading">Icebreaker maritime tracking, LC-130 cargo flights, and overland snowcat convoys</p>
      </div>
      <div class="page-actions">
        <a href="#logisticsCommand" class="btn btn-primary btn-sm">LOGISTICS COMMAND CENTER ↗</a>
        <button class="btn btn-secondary btn-sm">+ Log Shipment Manifest</button>
      </div>
    </div>

    <!-- LOGISTICS FLEET CARDS -->
    <div class="grid-3">
      ${state.logistics.map(item => `
        <div class="card" style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
            <span class="badge ${item.status === 'IN_FLIGHT' ? 'badge-info' : item.status === 'ARRIVING' ? 'badge-success' : 'badge-warning'}">${item.status}</span>
            <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted);">${item.id}</span>
          </div>
          <div style="font-weight:700; font-size:14px; color:var(--text-primary); mb-1">${item.vehicle}</div>
          <div style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">Cargo: <strong>${item.cargo}</strong></div>
          <div style="font-size:11.5px; color:var(--text-muted); display:flex; justify-content:space-between; border-top:1px solid var(--border-subtle); padding-top:8px;">
            <span>Route: ${item.origin} → Base Alpha</span>
            <span>ETA: <strong>${item.ETA}</strong></span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- MANIFEST DETAILS TABLE -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Cold-Chain Supply Manifest Tracker</div>
        <button class="btn btn-secondary btn-sm">Download Airbill PDF</button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Container Description</th>
              <th>Carrier</th>
              <th>Weight (kg)</th>
              <th>Temp Requirement</th>
              <th>Current Temp</th>
              <th>Destination Sector</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 600;">CNT-991-A</td>
              <td>Insulated Bio-Sample Storage Vials</td>
              <td>LC-130 Hercules</td>
              <td>420 kg</td>
              <td>-80.0 °C (Cryo)</td>
              <td>-81.2 °C</td>
              <td>Cryo Vault B</td>
              <td><span class="badge badge-success">Cold-Chain Secure</span></td>
            </tr>
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 600;">CNT-992-B</td>
              <td>High-Altitude Ozone Sensor Replacement</td>
              <td>Snowcat Convoy</td>
              <td>180 kg</td>
              <td>Ambient (-20°C)</td>
              <td>-24.0 °C</td>
              <td>Telecom Observatory</td>
              <td><span class="badge badge-success">In Transit</span></td>
            </tr>
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 600;">CNT-993-C</td>
              <td>Fresh Hydroponics Seeding Pods</td>
              <td>LC-130 Hercules</td>
              <td>65 kg</td>
              <td>+15.0 °C (Heated)</td>
              <td>+14.8 °C</td>
              <td>Biomass Chamber</td>
              <td><span class="badge badge-info">Priority Air freight</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  return container;
}
