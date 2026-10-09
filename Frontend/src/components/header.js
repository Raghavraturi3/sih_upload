// Top Navigation Header Component - Geospatial Operations Console (48px)
// Integrates RBAC, Live MongoDB Ticker, Theme/Density Selectors, and Admin AI Copilot

export function renderHeader(currentRouteTitle, onOpenCmdPalette, onOpenIncidentModal, telemetryEngine, authService, onOpenAIAssistant) {
  const headerEl = document.createElement('header');
  headerEl.className = 'main-header';

  const isAdmin = authService && authService.isAuthenticated && authService.hasRole('ADMIN');

  // Load saved theme & density
  const savedTheme = localStorage.getItem('bm_theme') || 'dark';
  const savedDensity = localStorage.getItem('bm_density') || 'comfortable';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-density', savedDensity);

  headerEl.innerHTML = `
    <div class="header-left">
      <button class="btn btn-sm btn-icon-only btn-secondary mobile-toggle-btn" id="sidebar-toggle-btn" title="Toggle Navigation Rail">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <div class="breadcrumbs">
        <span class="breadcrumb-item">ANTARCTIC OPS</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current" id="header-breadcrumb-title">${currentRouteTitle}</span>
      </div>

      <div class="system-status-pill" title="Autonomous life support and microgrid synchronization active">
        <span class="status-dot"></span>
        <span>NOMINAL</span>
      </div>

      <div class="system-status-pill mongodb-status-pill" id="mongo-status-pill" title="MongoDB Compass: mongodb://localhost:27017">
        <span class="status-dot mongo-status-dot"></span>
        <span id="mongo-status-text">DB: CONNECTING...</span>
      </div>
    </div>

    <div class="header-right">
      <!-- GLOBAL SEARCH / COMMAND PALETTE TRIGGER -->
      <div class="header-search" id="global-search-trigger" title="Jump to Module, Node or Convoy (Ctrl+K)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Search telemetry, nodes...</span>
        <span class="shortcut-badge">⌘K</span>
      </div>

      <!-- DENSITY TOGGLE (Compact / Comfortable) -->
      <button class="btn btn-secondary btn-sm" id="btn-toggle-density" title="Toggle Compact / Comfortable density">
        <span style="font-family:var(--font-mono); font-size:10.5px;">${savedDensity === 'compact' ? 'COMPACT' : 'COMFY'}</span>
      </button>

      <!-- THEME TOGGLE (Dark / Light) -->
      <button class="btn btn-secondary btn-sm btn-icon-only" id="btn-toggle-theme" title="Toggle Dark / Light theme">
        <svg id="theme-icon-dark" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="${savedTheme === 'light' ? 'display:none;' : 'display:block;'}">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg id="theme-icon-light" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="${savedTheme === 'light' ? 'display:block;' : 'display:none;'}">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <!-- AI COPILOT LAUNCHER (ADMIN ONLY) -->
      ${isAdmin ? `
        <button class="btn btn-secondary btn-sm ai-copilot-header-trigger" id="btn-header-ai-copilot" title="Open Antarctic AI Voice Copilot (Admin Only)" style="border-color: var(--line-accent); color: var(--accent-signal);">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
          <span>COPILOT</span>
        </button>
      ` : ''}

      <button class="btn btn-secondary btn-sm" id="btn-export-telemetry" title="Export current telemetry snapshot">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>EXPORT</span>
      </button>

      <button class="btn btn-danger btn-sm" id="btn-report-incident" title="Broadcast Station Incident Alert">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>REPORT INCIDENT</span>
      </button>

      <div id="header-user-profile-slot"></div>
    </div>
  `;

  // Attach handlers
  headerEl.querySelector('#global-search-trigger').addEventListener('click', onOpenCmdPalette);
  headerEl.querySelector('#btn-report-incident').addEventListener('click', onOpenIncidentModal);
  headerEl.querySelector('#btn-export-telemetry').addEventListener('click', () => {
    alert('Exporting Antarctic Operations Telemetry Data Dump (CSV/JSON format). Download starting...');
  });

  // Toggle density
  const densityBtn = headerEl.querySelector('#btn-toggle-density');
  densityBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-density') || 'comfortable';
    const next = current === 'comfortable' ? 'compact' : 'comfortable';
    document.documentElement.setAttribute('data-density', next);
    localStorage.setItem('bm_density', next);
    densityBtn.querySelector('span').textContent = next === 'compact' ? 'COMPACT' : 'COMFY';
  });

  // Toggle theme
  const themeBtn = headerEl.querySelector('#btn-toggle-theme');
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('bm_theme', next);
    headerEl.querySelector('#theme-icon-dark').style.display = next === 'light' ? 'none' : 'block';
    headerEl.querySelector('#theme-icon-light').style.display = next === 'light' ? 'block' : 'none';
  });

  const aiBtn = headerEl.querySelector('#btn-header-ai-copilot');
  if (aiBtn && onOpenAIAssistant) {
    aiBtn.addEventListener('click', onOpenAIAssistant);
  }

  const toggleBtn = headerEl.querySelector('#sidebar-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const sidebar = document.querySelector('#app-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('bm_sidebar_collapsed', isCollapsed ? 'true' : 'false');
      }
    });
  }

  // Profile avatar chip in header
  const profileSlot = headerEl.querySelector('#header-user-profile-slot');
  function updateHeaderProfile(user) {
    if (!profileSlot) return;
    if (!user) {
      profileSlot.innerHTML = '';
      return;
    }
    const userInitial = (user.name || 'U').charAt(0).toUpperCase();
    const avatarStyle = user.profilePic
      ? `background-image: url('${user.profilePic}'); background-size: cover; background-position: center; border: 1px solid var(--accent-signal); color: transparent;`
      : `background: var(--bg-raised); color: var(--accent-signal); border: 1px solid var(--line-medium); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 10px; font-family: var(--font-mono);`;

    profileSlot.innerHTML = `
      <a href="#settings" class="header-profile-chip" title="${user.name} (${user.role}) • Open Profile & Settings">
        <div style="width: 22px; height: 22px; border-radius: var(--radius-xs); flex-shrink: 0; ${avatarStyle}">
          ${user.profilePic ? '' : userInitial}
        </div>
        <span style="font-size: 11px; font-weight: 600; color: var(--text-primary); max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.name || 'User'}</span>
      </a>
    `;
  }

  if (authService) {
    updateHeaderProfile(authService.getUser());
    authService.subscribe(user => {
      updateHeaderProfile(user);
    });
  }

  // Live MongoDB Status binding
  const mongoPill = headerEl.querySelector('#mongo-status-pill');
  const mongoText = headerEl.querySelector('#mongo-status-text');
  const mongoDot = headerEl.querySelector('.mongo-status-dot');

  function updateMongoUI(dbStatus) {
    if (!mongoPill || !mongoText || !mongoDot) return;
    if (dbStatus && dbStatus.isConnected) {
      mongoDot.className = 'status-dot mongo-status-dot connected';
      mongoText.textContent = `DB: CONNECTED`;
      mongoPill.setAttribute('title', `Connected to database: ${dbStatus.dbName || 'antarctic_digital_twin'}`);
    } else {
      mongoDot.className = 'status-dot mongo-status-dot disconnected';
      mongoText.textContent = 'DB: OFFLINE';
      mongoPill.setAttribute('title', 'Unable to reach mongodb://localhost:27017');
    }
  }

  if (telemetryEngine) {
    updateMongoUI(telemetryEngine.getDBStatus());
    telemetryEngine.subscribe((state, dbStatus) => {
      updateMongoUI(dbStatus || telemetryEngine.getDBStatus());
    });
  }

  return headerEl;
}
