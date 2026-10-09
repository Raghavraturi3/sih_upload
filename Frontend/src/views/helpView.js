// Help Center View Module

export function renderHelpView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Station SOP & Operating Manuals</h1>
        <p class="page-subheading">Standard operating procedures, emergency blizzard lockdown guides, and diagnostics tools</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="btn-run-diag">Run Satellite Diagnostic Tool</button>
      </div>
    </div>

    <!-- SOP GUIDES GRID -->
    <div class="grid-3">
      <div class="card" style="padding:16px;">
        <div style="font-weight:700; font-size:14px; margin-bottom:6px;">SOP-01: Severe Blizzard Protocol</div>
        <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">Step-by-step procedures for sealing external airlocks, locking wind turbine orientation, and switching to life-support emergency reserves.</p>
        <button class="btn btn-secondary btn-sm" style="width:100%;">View Manual PDF</button>
      </div>

      <div class="card" style="padding:16px;">
        <div style="font-weight:700; font-size:14px; margin-bottom:6px;">SOP-04: Cryo Vault Thermal Recovery</div>
        <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">Instructions for manually purging liquid nitrogen coolant lines and resetting secondary heat exchanger valves.</p>
        <button class="btn btn-secondary btn-sm" style="width:100%;">View Manual PDF</button>
      </div>

      <div class="card" style="padding:16px;">
        <div style="font-weight:700; font-size:14px; margin-bottom:6px;">SOP-09: Satellite Transponder Realignment</div>
        <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">Calibrating dish motorized tracking gimbals during polar geomagnetic storms.</p>
        <button class="btn btn-secondary btn-sm" style="width:100%;">View Manual PDF</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const diagBtn = container.querySelector('#btn-run-diag');
    if (diagBtn) {
      diagBtn.addEventListener('click', () => {
        alert('Running Satellite Transponder Ping & Diagnostic Test...\nResult: 18ms latency, 0.00% packet loss. Gateway operational.');
      });
    }
  }, 50);

  return container;
}
