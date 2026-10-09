// Maintenance View Module

export function renderMaintenanceView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Preventive & Emergency Maintenance</h1>
        <p class="page-subheading">Work orders, technician assignments, structural overhaul schedules, and spare parts allocation</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm">+ Dispatch Maintenance Team</button>
      </div>
    </div>

    <!-- WORK ORDERS TABLE -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Active Work Order Tickets</div>
        <span class="badge badge-warning">2 Pending Maintenance Tasks</span>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Task Summary</th>
              <th>Equipment System</th>
              <th>Priority</th>
              <th>Assigned Tech</th>
              <th>Scheduled Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 600;">WO-2026-104</td>
              <td>Replace Secondary Coolant Pump O-Rings</td>
              <td>Cryo Storage Vault B</td>
              <td><span class="badge badge-danger">HIGH</span></td>
              <td>Sven Lindqvist</td>
              <td>Today, 14:00 UTC</td>
              <td><span class="badge badge-warning">IN PROGRESS</span></td>
              <td><button class="btn btn-secondary btn-sm">Complete Task</button></td>
            </tr>
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 600;">WO-2026-103</td>
              <td>Wind Turbine Array #3 Rotor De-Icing</td>
              <td>Outer Energy Perimeter</td>
              <td><span class="badge badge-warning">MEDIUM</span></td>
              <td>Ing. Elena Rostova</td>
              <td>Tomorrow, 09:00 UTC</td>
              <td><span class="badge badge-info">SCHEDULED</span></td>
              <td><button class="btn btn-secondary btn-sm">Start Task</button></td>
            </tr>
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 600;">WO-2026-102</td>
              <td>HEPA Filter Air Scrubber Swap #4</td>
              <td>Habitation Ring 1</td>
              <td><span class="badge badge-neutral">LOW</span></td>
              <td>Tarek Al-Mansoor</td>
              <td>Completed Yesterday</td>
              <td><span class="badge badge-success">RESOLVED</span></td>
              <td><button class="btn btn-secondary btn-sm" disabled>Archived</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  return container;
}
