// Antarctic Digital Twin - Access Restricted / Unauthorized View

export function renderUnauthorizedView(authService, targetRoute, onNavigate) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const user = authService.getUser() || {
    name: 'Operator',
    role: 'EMPLOYEE',
    department: 'OPERATIONS',
    station: 'MAITRI'
  };

  container.innerHTML = `
    <div class="unauthorized-card-wrapper">
      <div class="unauthorized-card">
        <div class="unauthorized-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>CLEARANCE LEVEL INSUFFICIENT</span>
        </div>

        <h2 class="unauthorized-heading">Access Denied to Operational Module</h2>
        <p class="unauthorized-subtext">
          You attempted to access the <strong>#${targetRoute}</strong> sector, which requires elevated administrative clearance or membership in a different station department.
        </p>

        <div class="clearance-details-box">
          <div class="clearance-row">
            <span class="clearance-label">Authenticated Operator:</span>
            <span class="clearance-val">${user.name} (${user.employeeId || 'ID-N/A'})</span>
          </div>
          <div class="clearance-row">
            <span class="clearance-label">Security Role:</span>
            <span class="clearance-val"><span class="badge badge-info">${user.role}</span></span>
          </div>
          <div class="clearance-row">
            <span class="clearance-label">Assigned Department:</span>
            <span class="clearance-val"><span class="badge badge-warning">${user.department}</span></span>
          </div>
          <div class="clearance-row">
            <span class="clearance-label">Base Station:</span>
            <span class="clearance-val">${user.station} Base</span>
          </div>
        </div>

        <div class="unauthorized-actions">
          <button class="btn btn-primary" id="btn-return-home">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Return to Authorized Department Workspace</span>
          </button>
          <button class="btn btn-secondary" id="btn-logout-unauth">
            <span>Sign In as Different User</span>
          </button>
        </div>

        <div class="security-policy-notice">
          <span>Security Protocol Note: All unauthorized traversal attempts are recorded in the Antarctic Base Defense Audit Log.</span>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-return-home').addEventListener('click', () => {
    onNavigate(authService.getDefaultRoute());
  });

  container.querySelector('#btn-logout-unauth').addEventListener('click', async () => {
    await authService.logout();
    window.location.hash = '';
    window.location.reload();
  });

  return container;
}
