// Antarctic Digital Twin - Admin User Management & RBAC Portal
import { authService } from '../auth/authService.js';

export function renderRolesView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const user = authService.getUser() || { role: 'ADMIN' };
  const isAdmin = user.role === 'ADMIN';

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">User Management & Role-Based Access Control (RBAC)</h1>
        <p class="page-subheading">Centralized credential authorization, department assignments, and security audit logs</p>
      </div>
      <div class="page-actions">
        ${isAdmin ? `<button class="btn btn-primary btn-sm" id="btn-open-create-user">+ Register New Employee</button>` : ''}
        <button class="btn btn-secondary btn-sm" id="btn-refresh-users">⟳ Refresh Directory</button>
      </div>
    </div>

    <!-- TABS BAR -->
    <div class="admin-tabs-bar">
      <button class="admin-tab active" data-tab="employees">Station Personnel Directory (<span id="user-count-badge">...</span>)</button>
      <button class="admin-tab" data-tab="matrix">Role Permissions Matrix</button>
      <button class="admin-tab" data-tab="audit">Defense & Security Audit Logs</button>
    </div>

    <!-- TAB 1: EMPLOYEES DIRECTORY -->
    <div id="tab-content-employees" class="tab-pane active">
      <div class="card">
        <div class="card-header" style="justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div class="card-title">Registered Station Operators</div>
          <div style="display:flex; gap:8px;">
            <input type="text" id="user-search-input" class="form-input" style="padding:5px 10px; font-size:12px; width:220px;" placeholder="Search by name, ID, or email..." />
            <select id="user-dept-filter" class="form-select" style="padding:5px 10px; font-size:12px;">
              <option value="ALL">All Departments</option>
              <option value="ENERGY">Energy</option>
              <option value="LOGISTICS">Logistics</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="ENVIRONMENT">Environment</option>
              <option value="RESEARCH">Research</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table" id="users-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Employee ID</th>
                <th>Role</th>
                <th>Department</th>
                <th>Station</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="users-table-body">
              <tr><td colspan="8" style="text-align:center; padding:20px;">Loading users from MongoDB...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: RBAC MATRIX TABLE -->
    <div id="tab-content-matrix" class="tab-pane" style="display:none;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">System Role Permissions Matrix</div>
          <span class="badge badge-info">ISO-27001 Enforced</span>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Permission Scope</th>
                <th>ADMIN</th>
                <th>ENERGY Specialist</th>
                <th>LOGISTICS Lead</th>
                <th>ENVIRONMENT Scientist</th>
                <th>INFRASTRUCTURE Lead</th>
                <th>RESEARCH Glaciologist</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:600;">Full Station Digital Twin & Telemetry</td>
                <td><span class="badge badge-success">FULL</span></td>
                <td><span class="badge badge-success">ALLOWED</span></td>
                <td><span class="badge badge-success">ALLOWED</span></td>
                <td><span class="badge badge-success">ALLOWED</span></td>
                <td><span class="badge badge-success">ALLOWED</span></td>
                <td><span class="badge badge-success">ALLOWED</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">Microgrid Nuclear & Wind Controls</td>
                <td><span class="badge badge-success">FULL</span></td>
                <td><span class="badge badge-success">FULL</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-info">READ-ONLY</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">Maritime & Air Cargo Logistics Tracking</td>
                <td><span class="badge badge-success">FULL</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-success">FULL</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">Environmental & Meteorological Sensors</td>
                <td><span class="badge badge-success">FULL</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-success">FULL</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-success">READ-ONLY</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">User Credential & RBAC Policy Management</td>
                <td><span class="badge badge-success">FULL</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
                <td><span class="badge badge-danger">DENIED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: AUDIT LOGS -->
    <div id="tab-content-audit" class="tab-pane" style="display:none;">
      <div class="card">
        <div class="card-header" style="justify-content:space-between;">
          <div class="card-title">Security & Operations Audit Trail</div>
          <button class="btn btn-secondary btn-sm" id="btn-refresh-audit">⟳ Refresh Audit Logs</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Operator</th>
                <th>Station</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody id="audit-table-body">
              <tr><td colspan="5" style="text-align:center; padding:20px;">Loading security audit trail...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- CREATE EMPLOYEE MODAL -->
    <div class="modal-backdrop" id="modal-create-user" style="display:none;">
      <div class="modal-card" style="max-width:560px;">
        <div class="modal-header">
          <div class="card-title" style="color:var(--accent-blue);">
            Register New Antarctic Operator
          </div>
          <button class="btn btn-icon-only" id="btn-close-create-modal">✕</button>
        </div>
        <form class="card-body" id="form-create-user">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="new-user-name" placeholder="e.g. Dr. A. Sen" required />
            </div>
            <div class="form-group">
              <label class="form-label">Employee ID</label>
              <input type="text" class="form-input" id="new-user-empid" placeholder="e.g. ENG005" required />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Official Email</label>
              <input type="email" class="form-input" id="new-user-email" placeholder="e.g. a.sen@antarctic.gov.in" required />
            </div>
            <div class="form-group">
              <label class="form-label">Temporary Password</label>
              <input type="password" class="form-input" id="new-user-pwd" placeholder="Min 6 characters" required />
            </div>
          </div>

          <div class="grid-3">
            <div class="form-group">
              <label class="form-label">Role</label>
              <select class="form-select" id="new-user-role">
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Department</label>
              <select class="form-select" id="new-user-dept">
                <option value="ENERGY">ENERGY</option>
                <option value="LOGISTICS">LOGISTICS</option>
                <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                <option value="ENVIRONMENT">ENVIRONMENT</option>
                <option value="RESEARCH">RESEARCH</option>
                <option value="OPERATIONS">OPERATIONS</option>
                <option value="ALL">ALL</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Base Station</label>
              <select class="form-select" id="new-user-station">
                <option value="MAITRI">MAITRI</option>
                <option value="BHARATI">BHARATI</option>
                <option value="ALL">ALL</option>
              </select>
            </div>
          </div>

          <div class="modal-actions" style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn btn-secondary" id="btn-cancel-create-user">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-submit-create-user">Create Employee Record</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Internal State
  let cachedUsers = [];

  // Tab switching
  const tabs = container.querySelectorAll('.admin-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      container.querySelector('#tab-content-employees').style.display = target === 'employees' ? 'block' : 'none';
      container.querySelector('#tab-content-matrix').style.display = target === 'matrix' ? 'block' : 'none';
      container.querySelector('#tab-content-audit').style.display = target === 'audit' ? 'block' : 'none';

      if (target === 'audit') loadAuditLogs();
    });
  });

  // Load Users Function
  async function loadUsers() {
    const tbody = container.querySelector('#users-table-body');
    const badge = container.querySelector('#user-count-badge');
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px;">Fetching directory from MongoDB...</td></tr>`;

    try {
      const token = authService.getToken();
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Access denied to admin user management.');
      }

      const data = await res.json();
      cachedUsers = data.users || [];
      if (badge) badge.textContent = cachedUsers.length;
      renderUsersTable(cachedUsers);
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--accent-red); padding:20px;">${err.message}</td></tr>`;
    }
  }

  function renderUsersTable(users) {
    const tbody = container.querySelector('#users-table-body');
    if (!users || users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px;">No operators found matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = users.map(u => {
      const isSuspended = u.status === 'SUSPENDED';
      const statusBadge = isSuspended 
        ? `<span class="badge badge-danger">SUSPENDED</span>` 
        : `<span class="badge badge-success">ACTIVE</span>`;
      const roleBadge = u.role === 'ADMIN'
        ? `<span class="badge badge-danger">ADMIN</span>`
        : `<span class="badge badge-info">EMPLOYEE</span>`;
      const lastLoginStr = u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) : 'Never';

      const avatarHtml = u.profilePic
        ? `<div style="width:34px; height:34px; border-radius:50%; background-image:url('${u.profilePic}'); background-size:cover; background-position:center; border:2px solid var(--accent-cyan); flex-shrink:0;"></div>`
        : `<div style="width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg, rgba(0,210,255,0.2), rgba(0,110,255,0.3)); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; color:var(--accent-cyan); flex-shrink:0;">${(u.name || 'U').charAt(0).toUpperCase()}</div>`;

      return `
        <tr data-user-id="${u.id}">
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              ${avatarHtml}
              <div>
                <div style="font-weight:600;">${u.name}</div>
                <div style="font-size:11px; color:var(--text-muted);">${u.email}</div>
              </div>
            </div>
          </td>
          <td><code style="font-size:11.5px; font-weight:600;">${u.employeeId}</code></td>
          <td>${roleBadge}</td>
          <td><span class="badge badge-warning">${u.department}</span></td>
          <td>${u.station}</td>
          <td>${statusBadge}</td>
          <td style="font-size:11.5px; color:var(--text-muted);">${lastLoginStr}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-secondary btn-sm toggle-status-btn" data-id="${u.id}" data-status="${u.status}" title="Toggle Active / Suspended status">
                ${isSuspended ? 'Activate' : 'Suspend'}
              </button>
              <button class="btn btn-secondary btn-sm reset-pwd-btn" data-id="${u.id}" data-name="${u.name}" title="Reset security password">
                Reset Pwd
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row button listeners
    tbody.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const currentStatus = btn.dataset.status;
        const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        if (confirm(`Change account status to ${nextStatus}?`)) {
          await updateUserStatus(id, nextStatus);
        }
      });
    });

    tbody.querySelectorAll('.reset-pwd-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const newPwd = prompt(`Enter new password for ${name}:`, 'TempPass@2026');
        if (newPwd) {
          await resetUserPassword(id, newPwd);
        }
      });
    });
  }

  // Filter & Search
  const searchInput = container.querySelector('#user-search-input');
  const deptFilter = container.querySelector('#user-dept-filter');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase();
    const dept = deptFilter?.value || 'ALL';

    const filtered = cachedUsers.filter(u => {
      const matchQ = (u.name || '').toLowerCase().includes(q) ||
                     (u.email || '').toLowerCase().includes(q) ||
                     (u.employeeId || '').toLowerCase().includes(q);
      const matchDept = dept === 'ALL' || u.department === dept;
      return matchQ && matchDept;
    });

    renderUsersTable(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (deptFilter) deptFilter.addEventListener('change', applyFilters);

  // Update Status in MongoDB
  async function updateUserStatus(userId, status) {
    try {
      const token = authService.getToken();
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await loadUsers();
      } else {
        alert('Could not update user status.');
      }
    } catch (e) {
      alert(e.message);
    }
  }

  // Reset Password in MongoDB
  async function resetUserPassword(userId, newPassword) {
    try {
      const token = authService.getToken();
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      alert(data.message || 'Password updated.');
    } catch (e) {
      alert(e.message);
    }
  }

  // Load Audit Logs
  async function loadAuditLogs() {
    const tbody = container.querySelector('#audit-table-body');
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Fetching audit events from MongoDB...</td></tr>`;

    try {
      const token = authService.getToken();
      const res = await fetch('/api/admin/audit-logs', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include'
      });
      const data = await res.json();
      const logs = data.logs || [];

      if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No audit events found.</td></tr>`;
        return;
      }

      tbody.innerHTML = logs.map(l => {
        const timeStr = new Date(l.timestamp).toLocaleString();
        let badgeClass = 'badge-info';
        if (l.action === 'LOGIN_SUCCESS') badgeClass = 'badge-success';
        if (l.action === 'LOGIN_FAILED' || l.action === 'ACCESS_DENIED') badgeClass = 'badge-danger';
        if (l.action === 'USER_CREATED' || l.action === 'PASSWORD_RESET') badgeClass = 'badge-warning';

        return `
          <tr>
            <td style="font-size:11px; color:var(--text-muted);">${timeStr}</td>
            <td><span class="badge ${badgeClass}">${l.action}</span></td>
            <td><strong>${l.employeeId}</strong> (${l.userName || 'System'})</td>
            <td>${l.station || 'MAITRI'}</td>
            <td style="font-size:12px; color:var(--text-secondary);">${l.details}</td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--accent-red); padding:20px;">${err.message}</td></tr>`;
    }
  }

  // Create User Modal & Form
  const modal = container.querySelector('#modal-create-user');
  const btnOpenModal = container.querySelector('#btn-open-create-user');
  const btnCloseModal = container.querySelector('#btn-close-create-modal');
  const btnCancelModal = container.querySelector('#btn-cancel-create-user');
  const formCreateUser = container.querySelector('#form-create-user');

  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  function closeModal() {
    if (modal) modal.style.display = 'none';
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (formCreateUser) {
    formCreateUser.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: container.querySelector('#new-user-name').value,
        employeeId: container.querySelector('#new-user-empid').value,
        email: container.querySelector('#new-user-email').value,
        password: container.querySelector('#new-user-pwd').value,
        role: container.querySelector('#new-user-role').value,
        department: container.querySelector('#new-user-dept').value,
        station: container.querySelector('#new-user-station').value
      };

      try {
        const token = authService.getToken();
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert(`Successfully registered ${data.user.name} (${data.user.employeeId})!`);
          closeModal();
          formCreateUser.reset();
          await loadUsers();
        } else {
          alert(data.message || 'Could not register user.');
        }
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // Refresh buttons
  container.querySelector('#btn-refresh-users')?.addEventListener('click', loadUsers);
  container.querySelector('#btn-refresh-audit')?.addEventListener('click', loadAuditLogs);

  // Initial load
  loadUsers();

  return container;
}
