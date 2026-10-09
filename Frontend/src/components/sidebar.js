// Sidebar Navigation Rail Component - Instrument-Grade Geospatial Console
// 56px Collapsed / 220px Expanded with 2px Accent Active State and Dynamic RBAC

export function renderSidebar(currentRoute, onNavigate, authService, onOpenAIAssistant) {
  const user = authService?.getUser() || {
    name: 'Mission Controller',
    role: 'ADMIN',
    department: 'ALL',
    station: 'MAITRI'
  };

  const isAdmin = user.role === 'ADMIN';
  const isCollapsedInitial = localStorage.getItem('bm_sidebar_collapsed') === 'true';

  const navSections = [
    {
      title: 'COMMAND & CONTROL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' },
        ...(isAdmin ? [{
          id: 'aiCopilotAction',
          label: 'AI Copilot',
          icon: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
          badge: 'ADMIN',
          badgeClass: 'badge-info',
          isAction: true
        }] : []),
        { id: 'expeditions', label: 'Expedition Routes', icon: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>', badge: 'INTEL', badgeClass: 'badge-info' },
        { id: 'tracking', label: 'Live Polar Tracking', icon: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/>', badge: 'LIVE', badgeClass: 'badge-danger' },
        { id: 'logisticsCommand', label: 'Logistics Command', icon: '<path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1"/><path d="M4 18V9l8-4 8 4v9"/><polygon points="12 2 4 6 12 10 20 6 12 2"/>', badge: 'LIVE', badgeClass: 'badge-warning' },
        { id: 'envMonitoring', label: 'Env Monitoring', icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', badge: 'NEW', badgeClass: 'badge-warning' }
      ]
    },
    {
      title: 'STATION SECTORS',
      items: [
        { id: 'infrastructure', label: 'Infrastructure', icon: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><circle cx="12" cy="9" r="2"/>' },
        { id: 'energy', label: 'Microgrid Energy', icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
        { id: 'logistics', label: 'Cargo & Supply', icon: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
        { id: 'environment', label: 'Polar Weather', icon: '<path d="M17.5 19.5 12 16.5l-5.5 3 1-6.1-4.5-4.4 6.2-.9L12 2.5l2.8 5.6 6.2.9-4.5 4.4z"/>' },
        { id: 'research', label: 'Research Labs', icon: '<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 22h16a2 2 0 0 0 2-2V8l-6-6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M10 12h4"/><path d="M10 16h4"/>' }
      ]
    },
    {
      title: 'OPERATIONS & MAINTENANCE',
      items: [
        { id: 'inventory', label: 'Inventory Stores', icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
        { id: 'maintenance', label: 'Maintenance Work', icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>', badge: '2', badgeClass: 'badge-warning' },
        { id: 'alerts', label: 'Alerts & Triage', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', badge: '3', badgeClass: 'badge-danger' },
        { id: 'personnel', label: 'Base Personnel', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' }
      ]
    },
    {
      title: 'ADMIN & CONFIG',
      items: [
        { id: 'roles', label: 'Users & Security RBAC', icon: '<rect x="3" y="11" width="18" height="11" rx="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', badge: user.role === 'ADMIN' ? 'ADMIN' : '', badgeClass: 'badge-danger' },
        { id: 'reports', label: 'Reports & Export', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
        { id: 'settings', label: 'System Settings', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
        { id: 'help', label: 'Help & Manuals', icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' }
      ]
    }
  ];

  // Dynamic Filtering based on RBAC Permissions
  const filteredSections = navSections.map(sec => {
    return {
      ...sec,
      items: sec.items.filter(item => {
        if (!authService) return true;
        return authService.canAccessRoute(item.id);
      })
    };
  }).filter(sec => sec.items.length > 0);

  const sidebarEl = document.createElement('aside');
  sidebarEl.className = `sidebar ${isCollapsedInitial ? 'collapsed' : ''}`;
  sidebarEl.id = 'app-sidebar';

  const userInitial = (user.name || 'O').charAt(0).toUpperCase();

  sidebarEl.innerHTML = `
    <div class="sidebar-header">
      <div class="org-selector" id="org-selector-btn" title="Antarctic Station: ${user.station || 'Maitri'} (Click to toggle rail collapse)">
        <div class="org-logo">BM</div>
        <div class="org-info">
          <div class="org-name">BHARAT MATRI</div>
          <div class="org-subtitle">${user.station === 'ALL' ? 'MAITRI & BHARATI' : user.station + ' STATION'}</div>
        </div>
        <span class="org-chevron">▾</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      ${filteredSections.map(section => `
        <div class="nav-group">
          <div class="nav-group-title">${section.title}</div>
          <ul class="nav-list">
            ${section.items.map(item => `
              <li>
                <a href="${item.href || '#' + item.id}" class="nav-item ${currentRoute === item.id ? 'active' : ''}" data-route="${item.id}" ${item.href ? `data-href="${item.href}"` : ''} title="${item.label}">
                  <span class="nav-item-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      ${item.icon}
                    </svg>
                  </span>
                  <span class="nav-item-label">${item.label}</span>
                  ${item.badge ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </nav>

    <div class="sidebar-footer">
      <div class="user-profile-card" id="user-profile-btn" title="${user.name} (${user.role}) • Click to manage profile photo & settings">
        <div class="user-avatar" style="${user.profilePic ? `background-image: url('${user.profilePic}'); background-size: cover; background-position: center; border: 1px solid var(--accent-signal); color: transparent;` : ''}">
          ${user.profilePic ? '' : userInitial}
        </div>
        <div class="user-details">
          <div class="user-name">${user.name}</div>
          <div class="user-role">${user.role === 'ADMIN' ? 'BASE COMMANDER' : user.department + ' SPECIALIST'}</div>
        </div>
      </div>
      <button class="btn-sidebar-logout" id="btn-sidebar-logout" title="Lock Portal & Sign Out">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>LOGOUT</span>
      </button>
    </div>
  `;

  // Attach event listeners
  sidebarEl.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const route = btn.dataset.route;
      const href = btn.dataset.href;
      if (route === 'aiCopilotAction') {
        if (onOpenAIAssistant) onOpenAIAssistant();
        return;
      }
      if (href) {
        window.location.href = href;
      } else {
        onNavigate(route);
      }
    });
  });

  // Toggle sidebar collapse on org selector click
  sidebarEl.querySelector('#org-selector-btn').addEventListener('click', () => {
    sidebarEl.classList.toggle('collapsed');
    const isCollapsed = sidebarEl.classList.contains('collapsed');
    localStorage.setItem('bm_sidebar_collapsed', isCollapsed ? 'true' : 'false');
  });

  sidebarEl.querySelector('#user-profile-btn').addEventListener('click', () => {
    onNavigate('settings');
  });

  sidebarEl.querySelector('#btn-sidebar-logout').addEventListener('click', async () => {
    if (confirm('Lock mission control console and sign out?')) {
      if (authService) {
        await authService.logout();
      }
      window.location.hash = '';
      window.location.reload();
    }
  });

  return sidebarEl;
}
