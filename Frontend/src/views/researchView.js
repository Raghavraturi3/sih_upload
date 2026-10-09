// Research View Module

export function renderResearchView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Scientific Research & Telemetry Experiments</h1>
        <p class="page-subheading">Ice Core Deep Drilling, South Pole Neutrino Observatory, and Sub-glacier Cryo Analysis</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm">+ New Project Proposal</button>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Project Deep-Ice Core Stratigraphy</div>
          <span class="badge badge-success">Drilling Active (3,240m)</span>
        </div>
        <div class="card-body">
          <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">Extracting ancient atmospheric gas bubbles sealed in polar ice sheet 800,000 years BP.</p>
          <div style="font-size:11.5px; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between;"><span>Current Core Depth:</span><strong>3,241.8 Meters</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Core Temperature:</span><strong>-54.2 °C</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Target Depth:</span><strong>3,400.0 Meters</strong></div>
          </div>
          <div class="progress-bar-bg" style="margin-top:12px;"><div class="progress-bar-fill success" style="width: 95%;"></div></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">South Pole IceCube Neutrino Array</div>
          <span class="badge badge-info">Collecting Data</span>
        </div>
        <div class="card-body">
          <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">5,160 optical sensors embedded 2.5km below ice surface detecting astrophysical neutrinos.</p>
          <div style="font-size:11.5px; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between;"><span>Detection Events Today:</span><strong>1,482 Triggers</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>DOM Sensor Health:</span><strong>99.8% Nominal</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Data Transmission:</span><strong>24.2 GB / hr</strong></div>
          </div>
          <div class="progress-bar-bg" style="margin-top:12px;"><div class="progress-bar-fill success" style="width: 99%;"></div></div>
        </div>
      </div>
    </div>
  `;

  return container;
}
