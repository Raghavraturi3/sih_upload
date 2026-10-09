// Personnel View Module

export function renderPersonnelView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const state = telemetryEngine.getState();

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Base Station Personnel Roster</h1>
        <p class="page-subheading">Active personnel deployment, duty shift rosters, polar medical clearance, and emergency contacts</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm">+ Deploy New Personnel</button>
      </div>
    </div>

    <!-- PERSONNEL ROSTER TABLE -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Station On-Site Roster (${state.personnel.length} Listed)</div>
        <button class="btn btn-secondary btn-sm">Export Roster PDF</button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Personnel ID</th>
              <th>Full Name</th>
              <th>Station Role / Title</th>
              <th>Assigned Sector</th>
              <th>Duty Status</th>
              <th>Medical Clearance</th>
              <th>Sat-Com Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.personnel.map(person => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600;">${person.id}</td>
                <td style="font-weight: 600;">${person.name}</td>
                <td>${person.role}</td>
                <td>${person.sector}</td>
                <td>
                  <span class="badge ${person.duty === 'ON_DUTY' ? 'badge-success' : person.duty === 'ON_CALL' ? 'badge-info' : 'badge-neutral'}">
                    ${person.duty.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span class="badge ${person.medical === 'CLEARED' ? 'badge-success' : 'badge-warning'}">
                    ${person.medical}
                  </span>
                </td>
                <td style="font-family: var(--font-mono);">${person.contact}</td>
                <td>
                  <button class="btn btn-secondary btn-sm">Page Personnel</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return container;
}
