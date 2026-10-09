// Alerts & Incidents View Module

export function renderAlertsView(telemetryEngine, onOpenIncidentModal) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const state = telemetryEngine.getState();

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Incident Triage & Alert Management</h1>
        <p class="page-subheading">Real-time emergency telemetry triggers, severity classification, and response protocols</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-danger btn-sm" id="alerts-report-btn">+ Broadcast New Incident</button>
      </div>
    </div>

    <!-- INCIDENTS BOARD -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Live Triage Stream (${state.incidents.length} Active)</div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-sm">All Severities</button>
          <button class="btn btn-secondary btn-sm">High Only</button>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Incident Code</th>
              <th>System & Summary</th>
              <th>Sector</th>
              <th>Severity Level</th>
              <th>Timestamp</th>
              <th>Assignee</th>
              <th>Current Status</th>
              <th>Triage Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.incidents.map(inc => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 700;">${inc.id}</td>
                <td style="font-weight: 600;">${inc.title}</td>
                <td>${inc.sector}</td>
                <td>
                  <span class="badge ${inc.severity === 'HIGH' ? 'badge-danger' : inc.severity === 'MEDIUM' ? 'badge-warning' : 'badge-info'}">
                    ${inc.severity}
                  </span>
                </td>
                <td style="color:var(--text-muted);">${inc.timestamp}</td>
                <td>${inc.assignee}</td>
                <td><span class="badge badge-neutral">${inc.status}</span></td>
                <td>
                  <button class="btn btn-secondary btn-sm">Resolve Incident</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    const btn = container.querySelector('#alerts-report-btn');
    if (btn) btn.addEventListener('click', onOpenIncidentModal);
  }, 50);

  return container;
}
