// Modals Component: Command Palette (Ctrl+K) & Incident Broadcast Modal
// Terminal-grade overlay styling, keyboard paths, and tabular command routes

export function initModals(onNavigate, telemetryEngine) {
  // Create Command Palette Backdrop & Card
  const cmdBackdrop = document.createElement('div');
  cmdBackdrop.className = 'modal-backdrop';
  cmdBackdrop.id = 'cmd-palette-backdrop';

  cmdBackdrop.innerHTML = `
    <div class="modal-card">
      <div class="cmd-input-wrapper">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" class="cmd-input" id="cmd-input-field" placeholder="Jump to station module, convoy, or telemetry sector..." autofocus />
        <span class="shortcut-badge">ESC TO CLOSE</span>
      </div>
      <div class="cmd-list" id="cmd-results-list">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  // Create Incident Modal Backdrop & Card
  const incBackdrop = document.createElement('div');
  incBackdrop.className = 'modal-backdrop';
  incBackdrop.id = 'incident-modal-backdrop';

  incBackdrop.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div class="card-title" style="color:var(--sev-emergency);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>BROADCAST TELEMETRY INCIDENT</span>
        </div>
        <button class="btn btn-sm btn-icon-only btn-ghost" id="inc-modal-close">✕</button>
      </div>
      <form class="card-body" id="incident-form" style="display:flex; flex-direction:column; gap:var(--space-3);">
        <div class="form-group">
          <label class="form-label">Incident Summary / Title</label>
          <input type="text" class="form-input" id="inc-title-input" placeholder="e.g. Primary Coolant Line Pressure Drop" required />
        </div>
        <div class="form-group">
          <label class="form-label">Station Sector Location</label>
          <select class="form-select" id="inc-sector-input">
            <option>Reactor Vault A</option>
            <option>Cryo Storage Vault B</option>
            <option>Wind Array Outer Ring</option>
            <option>Habitation Ring 1</option>
            <option>Deep Space Telecom Mast</option>
          </select>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Severity Classification</label>
            <select class="form-select" id="inc-severity-input">
              <option value="HIGH">HIGH (P1 Emergency)</option>
              <option value="MEDIUM">MEDIUM (P2 Warning)</option>
              <option value="LOW">LOW (P3 Monitor)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Assignee Specialist</label>
            <input type="text" class="form-input" id="inc-assignee-input" value="Dr. E. Vance" />
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
          <button type="button" class="btn btn-secondary btn-sm" id="inc-cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-danger btn-sm">Broadcast Alert</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(cmdBackdrop);
  document.body.appendChild(incBackdrop);

  // Command palette items list
  const commands = [
    { label: 'Go to Dashboard', route: 'dashboard', desc: 'Main telemetry & base overview' },
    { label: 'Go to Expedition Routes', route: 'expeditions', desc: 'SCAR ADD GIS & Sentinel-1 SAR intelligence' },
    { label: 'Go to Live Polar Tracking', route: 'tracking', desc: 'AIS vessel and ADS-B flight corridors' },
    { label: 'Go to Infrastructure', route: 'infrastructure', desc: 'HVAC, filtration & pressure systems' },
    { label: 'Go to Microgrid Energy', route: 'energy', desc: 'Wind & solar arrays, BESS storage' },
    { label: 'Go to Logistics & Cargo', route: 'logistics', desc: 'Flight cargo & cold-chain supply tracker' },
    { label: 'Go to Polar Weather', route: 'environment', desc: 'Meteorology, blizzard triggers & tremors' },
    { label: 'Go to Research Labs', route: 'research', desc: 'Ice core stratigraphy & neutrino observatory' },
    { label: 'Go to Inventory Stores', route: 'inventory', desc: 'Stock reserves & spare parts ledger' },
    { label: 'Go to Maintenance Work', route: 'maintenance', desc: 'Work order tickets & scheduled repairs' },
    { label: 'Go to Alerts & Incidents', route: 'alerts', desc: 'Live triage queue & incident response' },
    { label: 'Go to Personnel Roster', route: 'personnel', desc: 'Deployment roster & duty status' },
    { label: 'Go to Roles & RBAC', route: 'roles', desc: 'User management & ISO-27001 matrix' },
    { label: 'Go to Reports & Analytics', route: 'reports', desc: 'Historical data exporter & PDF builder' },
    { label: 'Go to System Settings', route: 'settings', desc: 'Profile photo upload & sat-com IP' },
    { label: 'Go to Help & Manuals', route: 'help', desc: 'Operating manuals & transponder ping test' }
  ];

  const inputEl = cmdBackdrop.querySelector('#cmd-input-field');
  const resultsEl = cmdBackdrop.querySelector('#cmd-results-list');

  function renderCmdResults(query = '') {
    const filtered = commands.filter(c => 
      c.label.toLowerCase().includes(query.toLowerCase()) || 
      c.desc.toLowerCase().includes(query.toLowerCase())
    );

    resultsEl.innerHTML = filtered.length ? filtered.map((c, i) => `
      <div class="cmd-item ${i === 0 ? 'selected' : ''}" data-route="${c.route}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        <span style="font-weight:600;">${c.label}</span>
        <span class="cmd-item-desc">${c.desc}</span>
      </div>
    `).join('') : '<div style="padding:12px; color:var(--text-muted); text-align:center; font-size:12px;">No matching telemetry command found.</div>';

    resultsEl.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        onNavigate(item.dataset.route);
        closeCmdPalette();
      });
    });
  }

  inputEl.addEventListener('input', (e) => renderCmdResults(e.target.value));

  function openCmdPalette() {
    cmdBackdrop.classList.add('active');
    inputEl.value = '';
    renderCmdResults('');
    setTimeout(() => inputEl.focus(), 50);
  }

  function closeCmdPalette() {
    cmdBackdrop.classList.remove('active');
  }

  cmdBackdrop.addEventListener('click', (e) => {
    if (e.target === cmdBackdrop) closeCmdPalette();
  });

  // Global Ctrl+K / Cmd+K listener
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdBackdrop.classList.contains('active') ? closeCmdPalette() : openCmdPalette();
    }
    if (e.key === 'Escape') {
      closeCmdPalette();
      closeIncidentModal();
    }
  });

  // Incident Modal Handlers
  function openIncidentModal() {
    incBackdrop.classList.add('active');
  }
  function closeIncidentModal() {
    incBackdrop.classList.remove('active');
  }

  incBackdrop.querySelector('#inc-modal-close').addEventListener('click', closeIncidentModal);
  incBackdrop.querySelector('#inc-cancel-btn').addEventListener('click', closeIncidentModal);
  incBackdrop.addEventListener('click', (e) => {
    if (e.target === incBackdrop) closeIncidentModal();
  });

  incBackdrop.querySelector('#incident-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = incBackdrop.querySelector('#inc-title-input').value;
    const sector = incBackdrop.querySelector('#inc-sector-input').value;
    const severity = incBackdrop.querySelector('#inc-severity-input').value;
    const assignee = incBackdrop.querySelector('#inc-assignee-input').value;

    telemetryEngine.addIncident({ title, sector, severity, assignee });
    closeIncidentModal();
    onNavigate('alerts');
  });

  return { openCmdPalette, openIncidentModal };
}
