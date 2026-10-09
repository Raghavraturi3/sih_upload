// Infrastructure Management — Main Application Module
// This is a completely standalone page module that does NOT modify any existing admin pages.

import './infrastructure.css';
import { initAIAssistant } from '../../features/aiVoiceAssistant/index.js';
import { renderInfrastructureView } from '../../views/infrastructureView.js';
import {
  INFRASTRUCTURE_KPIS, CATEGORY_HEALTH, ASSET_CATEGORIES, ASSETS,
  CRITICAL_ASSETS, TEAM_MEMBERS, MAINTENANCE_OPS, ALERTS,
  RECENT_ACTIVITY, IMPACT_CHAINS, DIGITAL_TWIN_NODES
} from './data/infrastructureDemoData.js';

// ── State ──
let selectedStation = 'all';
let selectedCategory = null;
let searchQuery = '';
let filterStatus = 'all';
let currentPage = 1;
const PAGE_SIZE = 8;
let selectedAsset = null;
let selectedEmployee = null;
let profileDropdownOpen = false;

// Mutable in-memory working sets for interactive demo actions
let workingAssets = [...ASSETS];
let workingAlerts = [...ALERTS];
let workingMaintenance = JSON.parse(JSON.stringify(MAINTENANCE_OPS));

// ── Toast Notification System ──
function showToast(message, type = 'success') {
  let container = document.getElementById('infra-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'infra-toast-container';
    container.className = 'infra-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `infra-toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}

// ── Mount ──
document.addEventListener('DOMContentLoaded', () => {
  renderPage();
  initAIAssistant();
});

function renderPage() {
  const app = document.getElementById('infra-app');
  if (!app) return;
  app.innerHTML = '';
  app.appendChild(buildTopbar());

  const content = document.createElement('div');
  content.className = 'infra-content';

  // Mount Interconnected Digital Twin Subsystems
  content.appendChild(renderInfrastructureView());

  content.appendChild(buildKPISection());
  content.appendChild(buildHealthSection());
  content.appendChild(buildCategoryGrid());
  content.appendChild(buildDigitalTwinSection());

  const midGrid = document.createElement('div');
  midGrid.className = 'infra-grid-2';
  midGrid.appendChild(buildCriticalAssetsSection());
  midGrid.appendChild(buildAlertsSection());
  content.appendChild(midGrid);

  content.appendChild(buildTeamSection());
  content.appendChild(buildMaintenanceSection());
  content.appendChild(buildAssetTable());

  const bottomGrid = document.createElement('div');
  bottomGrid.className = 'infra-grid-2';
  bottomGrid.appendChild(buildRecentActivitySection());
  bottomGrid.appendChild(buildImpactSection());
  content.appendChild(bottomGrid);

  app.appendChild(content);
  app.appendChild(buildDrawer());

  // Init canvas after DOM paint
  setTimeout(() => initTwinCanvas(), 80);
}

// ── TOPBAR ──
function buildTopbar() {
  const bar = document.createElement('header');
  bar.className = 'infra-topbar';
  bar.innerHTML = `
    <div class="infra-topbar-left">
      <a href="/index.html" class="infra-back-link" title="Return to Main Admin Dashboard">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Admin Dashboard
      </a>
      <span class="infra-topbar-title">Infrastructure Management</span>
      <span class="infra-topbar-subtitle">Indian Antarctic Research Stations · Maitri & Bharati</span>
    </div>
    <div class="infra-topbar-right">
      <div class="infra-station-tabs" id="station-tabs">
        <button class="infra-station-tab ${selectedStation === 'all' ? 'active' : ''}" data-station="all">All Stations</button>
        <button class="infra-station-tab ${selectedStation === 'Maitri' ? 'active' : ''}" data-station="Maitri">Maitri</button>
        <button class="infra-station-tab ${selectedStation === 'Bharati' ? 'active' : ''}" data-station="Bharati">Bharati</button>
      </div>
      <div class="infra-profile-chip" id="profile-chip" title="Account & Operations Profile">
        <div class="infra-profile-avatar">AS</div>
        <div class="infra-profile-info">
          <div class="infra-profile-name">Arjun Sharma</div>
          <div class="infra-profile-role">Lead Infra Engineer</div>
        </div>
        <span class="infra-online-dot"></span>
        <div class="infra-profile-dropdown ${profileDropdownOpen ? 'open' : ''}" id="profile-dropdown">
          <div class="infra-profile-dd-item" id="dd-view-profile">👤 View Engineer Profile</div>
          <div class="infra-profile-dd-item" id="dd-station-telemetry">📡 Station Telemetry Diagnostics</div>
          <div class="infra-profile-dd-divider"></div>
          <div class="infra-profile-dd-item" id="dd-return-admin">🚪 Return to Admin Dashboard</div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    bar.querySelectorAll('.infra-station-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        selectedStation = tab.dataset.station;
        selectedCategory = null;
        currentPage = 1;
        renderPage();
      });
    });

    const chip = bar.querySelector('#profile-chip');
    const dropdown = bar.querySelector('#profile-dropdown');
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdownOpen = !profileDropdownOpen;
      dropdown.classList.toggle('open', profileDropdownOpen);
    });

    const viewProfileBtn = bar.querySelector('#dd-view-profile');
    if (viewProfileBtn) {
      viewProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdownOpen = false;
        dropdown.classList.remove('open');
        openEmployeeDrawer(TEAM_MEMBERS[0]);
      });
    }

    const diagBtn = bar.querySelector('#dd-station-telemetry');
    if (diagBtn) {
      diagBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdownOpen = false;
        dropdown.classList.remove('open');
        showToast('Running comprehensive subsystem diagnostics for Maitri & Bharati...', 'info');
      });
    }

    const returnBtn = bar.querySelector('#dd-return-admin');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        window.location.href = '/index.html';
      });
    }

    document.addEventListener('click', () => {
      profileDropdownOpen = false;
      const dd = document.querySelector('#profile-dropdown');
      if (dd) dd.classList.remove('open');
    });
  }, 20);

  return bar;
}

// ── KPI METRICS ──
function buildKPISection() {
  const section = document.createElement('div');
  const filtered = getFilteredAssets();
  const total = filtered.length;
  const op = filtered.filter(a => a.status === 'Operational').length;
  const att = filtered.filter(a => a.status === 'Needs Attention').length;
  const crit = filtered.filter(a => a.status === 'Critical').length;
  const maint = filtered.filter(a => a.status === 'Under Maintenance').length;

  section.innerHTML = `
    <div class="infra-kpi-grid">
      <div class="infra-kpi-card" data-filter="all" style="cursor:pointer;" title="View all assets">
        <div class="infra-kpi-header">
          <span class="infra-kpi-title">Total Infrastructure Assets</span>
          <span class="infra-kpi-icon">🏗️</span>
        </div>
        <div class="infra-kpi-value">${total}</div>
        <div class="infra-kpi-subtext">Active monitoring at ${selectedStation === 'all' ? 'Maitri & Bharati' : selectedStation}</div>
      </div>
      <div class="infra-kpi-card" data-filter="Operational" style="cursor:pointer;" title="Filter by Operational">
        <div class="infra-kpi-header">
          <span class="infra-kpi-title">Operational</span>
          <span class="infra-kpi-icon">✅</span>
        </div>
        <div class="infra-kpi-value val-green">${op}</div>
        <div class="infra-kpi-subtext">${total ? Math.round((op / total) * 100) : 0}% fleet readiness</div>
      </div>
      <div class="infra-kpi-card" data-filter="Needs Attention" style="cursor:pointer;" title="Filter by Needs Attention">
        <div class="infra-kpi-header">
          <span class="infra-kpi-title">Needs Attention</span>
          <span class="infra-kpi-icon">⚠️</span>
        </div>
        <div class="infra-kpi-value val-amber">${att}</div>
        <div class="infra-kpi-subtext">Subsystem warning threshold</div>
      </div>
      <div class="infra-kpi-card" data-filter="Critical" style="cursor:pointer;" title="Filter by Critical">
        <div class="infra-kpi-header">
          <span class="infra-kpi-title">Critical Attention</span>
          <span class="infra-kpi-icon">🔴</span>
        </div>
        <div class="infra-kpi-value val-red">${crit}</div>
        <div class="infra-kpi-subtext">High priority dispatch</div>
      </div>
      <div class="infra-kpi-card" data-filter="Under Maintenance" style="cursor:pointer;" title="Filter by Under Maintenance">
        <div class="infra-kpi-header">
          <span class="infra-kpi-title">Under Maintenance</span>
          <span class="infra-kpi-icon">🔧</span>
        </div>
        <div class="infra-kpi-value val-purple">${maint}</div>
        <div class="infra-kpi-subtext">Scheduled technician work</div>
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.infra-kpi-card').forEach(card => {
      card.addEventListener('click', () => {
        filterStatus = card.dataset.filter;
        currentPage = 1;
        updateAssetTableOnly();
        showToast(`Filtered assets by: ${filterStatus === 'all' ? 'All Statuses' : filterStatus}`, 'info');
      });
    });
  }, 20);

  return section;
}

// ── OVERALL HEALTH ──
function buildHealthSection() {
  const section = document.createElement('div');
  const filteredAssets = getFilteredAssets();
  const avgHealth = filteredAssets.length ? Math.round(filteredAssets.reduce((acc, a) => acc + a.health, 0) / filteredAssets.length) : 92;

  section.innerHTML = `
    <div class="infra-card" style="margin-top: 18px;">
      <div class="infra-card-header">
        <div class="infra-card-title">Subsystem Health Index</div>
        <span class="infra-badge infra-badge-green">Live Telemetry Synchronized</span>
      </div>
      <div class="infra-card-body">
        <div class="infra-health-main">
          <div class="infra-health-circle" style="--health-pct: ${avgHealth}%;">
            <div class="infra-health-circle-inner">${avgHealth}%</div>
          </div>
          <div>
            <div class="infra-health-label">System Readiness Index</div>
            <div class="infra-health-sublabel">${selectedStation === 'all' ? 'Combined Indian Antarctic Subsystems (Maitri & Bharati)' : `${selectedStation} Research Station Base Units`}</div>
          </div>
        </div>
        <div class="infra-health-grid">
          ${CATEGORY_HEALTH.map(cat => {
            const healthColor = cat.health >= 90 ? 'green' : cat.health >= 70 ? 'amber' : 'red';
            return `
              <div class="infra-health-item">
                <div class="infra-health-item-header">
                  <span class="infra-health-item-name">${cat.icon} ${cat.name}</span>
                  <span class="infra-health-item-value">${cat.health}%</span>
                </div>
                <div class="infra-health-bar-bg">
                  <div class="infra-health-bar-fill ${healthColor}" style="width: ${cat.health}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  return section;
}

// ── CATEGORY GRID ──
function buildCategoryGrid() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="infra-section-header">
      <div class="infra-section-title">Infrastructure Categories</div>
      ${selectedCategory ? `<button class="infra-btn infra-btn-secondary infra-btn-sm" id="clear-cat-filter">Clear Filter</button>` : ''}
    </div>
    <div class="infra-cat-grid" style="margin-top: 10px;">
      ${ASSET_CATEGORIES.map(cat => {
        const isSelected = selectedCategory === cat.id;
        const icon = CATEGORY_HEALTH.find(h => h.id === cat.id)?.icon || '📦';
        return `
          <div class="infra-card infra-cat-card ${isSelected ? 'selected' : ''}" data-cat-id="${cat.id}">
            <div class="infra-cat-top">
              <div class="infra-cat-name">${icon} ${cat.name}</div>
              <span class="infra-cat-count">${cat.total} Units</span>
            </div>
            <div class="infra-cat-status-row">
              <span class="infra-cat-status-pill green">● ${cat.operational} OK</span>
              ${cat.attention ? `<span class="infra-cat-status-pill amber">● ${cat.attention} Warn</span>` : ''}
              ${cat.critical ? `<span class="infra-cat-status-pill red">● ${cat.critical} Crit</span>` : ''}
              ${cat.maintenance ? `<span class="infra-cat-status-pill purple">● ${cat.maintenance} Maint</span>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.infra-cat-card').forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.dataset.catId;
        selectedCategory = selectedCategory === catId ? null : catId;
        currentPage = 1;
        renderPage();
      });
    });

    const clearBtn = section.querySelector('#clear-cat-filter');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedCategory = null;
        currentPage = 1;
        renderPage();
      });
    }
  }, 20);

  return section;
}

// ── DIGITAL TWIN ──
function buildDigitalTwinSection() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="infra-section-header">
      <div class="infra-section-title">Station Digital Twin Schematic</div>
      <span style="font-size:12px; color:var(--text-muted);">Click any node to inspect telemetry & status</span>
    </div>
    <div class="infra-card" style="margin-top: 10px;">
      <div class="infra-card-body" style="padding: 0;">
        <div class="infra-twin-container">
          <canvas id="infra-twin-canvas" class="infra-twin-canvas"></canvas>
          <div class="infra-twin-legend">
            <div class="infra-twin-legend-item"><span class="infra-twin-legend-dot" style="background:#059669;"></span> Operational</div>
            <div class="infra-twin-legend-item"><span class="infra-twin-legend-dot" style="background:#d97706;"></span> Attention</div>
            <div class="infra-twin-legend-item"><span class="infra-twin-legend-dot" style="background:#dc2626;"></span> Critical</div>
            <div class="infra-twin-legend-item"><span class="infra-twin-legend-dot" style="background:#7c3aed;"></span> Maintenance</div>
          </div>
        </div>
      </div>
    </div>
  `;
  return section;
}

function initTwinCanvas() {
  const canvas = document.getElementById('infra-twin-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  const statusColors = {
    'Operational': '#059669',
    'Needs Attention': '#d97706',
    'Critical': '#dc2626',
    'Under Maintenance': '#7c3aed'
  };

  canvas.addEventListener('click', (e) => {
    const cRect = canvas.getBoundingClientRect();
    const mx = e.clientX - cRect.left;
    const my = e.clientY - cRect.top;
    DIGITAL_TWIN_NODES.forEach(node => {
      const nx = (node.x / 650) * canvas.width;
      const ny = (node.y / 360) * canvas.height;
      if (Math.hypot(mx - nx, my - ny) < 22) {
        const asset = workingAssets.find(a => a.id === node.id);
        if (asset) openDrawer(asset);
      }
    });
  });

  function draw() {
    if (!document.getElementById('infra-twin-canvas')) return;
    ctx.fillStyle = '#0c1221';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Station labels
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillText('MAITRI RESEARCH STATION (Schirmacher Oasis)', 40, 32);
    ctx.fillText('BHARATI RESEARCH STATION (Larsemann Hills)', canvas.width / 2 + 30, 32);

    // Station divider
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 20);
    ctx.lineTo(canvas.width / 2, canvas.height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    const now = Date.now();

    DIGITAL_TWIN_NODES.forEach((node, i) => {
      // Station filter visibility
      if (selectedStation !== 'all' && node.station !== selectedStation) return;

      const nx = (node.x / 650) * canvas.width;
      const ny = (node.y / 360) * canvas.height;
      const currentAsset = workingAssets.find(a => a.id === node.id);
      const currentStatus = currentAsset ? currentAsset.status : node.status;
      const color = statusColors[currentStatus] || '#059669';

      // Pulse
      const pulseR = 14 + Math.sin(now / 500 + i) * 3;
      ctx.fillStyle = color + '33';
      ctx.beginPath();
      ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(nx, ny, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Node Label
      ctx.fillStyle = '#f8fafc';
      ctx.font = '500 10.5px Inter, sans-serif';
      ctx.fillText(node.label, nx + 12, ny + 3);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// ── CRITICAL ASSETS ──
function buildCriticalAssetsSection() {
  const filtered = getFilteredAssets().filter(a => a.status === 'Critical' || a.status === 'Needs Attention' || a.health < 75);
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="infra-card">
      <div class="infra-card-header">
        <div class="infra-card-title">⚠️ Critical Assets Watchlist</div>
        <span class="infra-badge infra-badge-red">${filtered.length} Require Action</span>
      </div>
      <div class="infra-card-body">
        <div class="infra-critical-list">
          ${filtered.slice(0, 5).map(asset => `
            <div class="infra-critical-item" data-asset-id="${asset.id}" style="cursor:pointer;" title="Click to inspect asset">
              <div class="infra-critical-info">
                <div class="infra-critical-name">${asset.name}</div>
                <div class="infra-critical-station">${asset.station} · ${asset.category} · Assigned: ${asset.assignee}</div>
              </div>
              <div class="infra-critical-right">
                <span class="infra-badge ${asset.status === 'Critical' ? 'infra-badge-red' : 'infra-badge-amber'}">${asset.status}</span>
                <span style="font-size:12px; font-weight:700; color:${asset.health < 60 ? 'var(--accent-red)' : 'var(--accent-amber)'};">${asset.health}%</span>
              </div>
            </div>
          `).join('')}
          ${filtered.length === 0 ? '<div style="color:var(--text-muted); font-size:12px; text-align:center; padding:18px;">✅ No critical infrastructure warnings for this station.</div>' : ''}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.infra-critical-item').forEach(item => {
      item.addEventListener('click', () => {
        const asset = workingAssets.find(a => a.id === item.dataset.assetId);
        if (asset) openDrawer(asset);
      });
    });
  }, 20);

  return section;
}

// ── ALERTS ──
function buildAlertsSection() {
  const section = document.createElement('div');
  const filtered = selectedStation === 'all' ? workingAlerts : workingAlerts.filter(a => a.station === selectedStation);
  section.innerHTML = `
    <div class="infra-card">
      <div class="infra-card-header">
        <div class="infra-card-title">🔔 Active Infrastructure Alerts</div>
        <span style="font-size:11.5px; color:var(--text-muted);">${filtered.length} Total</span>
      </div>
      <div class="infra-card-body">
        <div class="infra-alert-list">
          ${filtered.map(alert => {
            const dotClass = alert.type === 'CRITICAL' ? 'dot-critical' : alert.type === 'WARNING' ? 'dot-warning' : alert.type === 'RESOLVED' ? 'dot-resolved' : 'dot-info';
            return `
              <div class="infra-alert-item" data-asset-id="${alert.assetId}" title="Click to inspect affected asset">
                <div class="infra-alert-type-dot ${dotClass}"></div>
                <div class="infra-alert-content">
                  <div class="infra-alert-title">${alert.title}</div>
                  <div class="infra-alert-meta">${alert.station} · ${alert.timestamp} · Asset: ${alert.assetId}</div>
                </div>
                <span class="infra-badge ${alert.type === 'CRITICAL' ? 'infra-badge-red' : alert.type === 'WARNING' ? 'infra-badge-amber' : alert.type === 'RESOLVED' ? 'infra-badge-green' : 'infra-badge-blue'}">${alert.type}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.infra-alert-item').forEach(item => {
      item.addEventListener('click', () => {
        const asset = workingAssets.find(a => a.id === item.dataset.assetId);
        if (asset) openDrawer(asset);
      });
    });
  }, 20);

  return section;
}

// ── TEAM ──
function buildTeamSection() {
  const section = document.createElement('div');
  const filtered = selectedStation === 'all' ? TEAM_MEMBERS : TEAM_MEMBERS.filter(t => t.station === selectedStation || t.station === 'HQ');
  section.innerHTML = `
    <div class="infra-section-header">
      <div class="infra-section-title">Antarctic Infrastructure Personnel</div>
      <span style="font-size:12px; color:var(--text-muted);">Click any member to open Employee Profile</span>
    </div>
    <div class="infra-team-grid" style="margin-top: 10px;">
      ${filtered.map(member => {
        const dotClass = member.status === 'Online' ? 'online' : member.status === 'On Site' ? 'onsite' : 'offline';
        return `
          <div class="infra-card infra-team-card" data-member-id="${member.id}" title="Click to view ${member.name}'s profile">
            <div class="infra-team-avatar">${member.avatar}</div>
            <div class="infra-team-info">
              <div class="infra-team-name">${member.name}</div>
              <div class="infra-team-role">${member.role}</div>
              <div class="infra-team-meta">
                <span><span class="infra-team-status-dot ${dotClass}"></span>${member.status}</span>
                <span>📍 ${member.station}</span>
                <span>${member.teamMembers ? `👥 ${member.teamMembers} Members` : `🔧 ${member.assignedAssets} Assets`}</span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.infra-team-card').forEach(card => {
      card.addEventListener('click', () => {
        const member = TEAM_MEMBERS.find(m => m.id === card.dataset.memberId);
        if (member) openEmployeeDrawer(member);
      });
    });
  }, 20);

  return section;
}

// ── MAINTENANCE ──
function buildMaintenanceSection() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="infra-section-header">
      <div class="infra-section-title">Maintenance Operations Pipeline</div>
      <span style="font-size:12px; color:var(--text-muted);">Click any work order to view asset</span>
    </div>
    <div class="infra-card" style="margin-top: 10px;">
      <div class="infra-card-body">
        <div class="infra-maint-cols">
          <div class="infra-maint-column">
            <div class="infra-maint-col-title col-due">Due (${workingMaintenance.due.length})</div>
            ${workingMaintenance.due.map(m => `
              <div class="infra-maint-item priority-${m.priority}" data-asset-id="${m.assetId}">
                <div class="infra-maint-item-name">${m.name}</div>
                <div class="infra-maint-item-detail">${m.station} · ${m.dueText}</div>
              </div>
            `).join('')}
          </div>
          <div class="infra-maint-column">
            <div class="infra-maint-col-title col-overdue">Overdue (${workingMaintenance.overdue.length})</div>
            ${workingMaintenance.overdue.map(m => `
              <div class="infra-maint-item priority-${m.priority}" data-asset-id="${m.assetId}">
                <div class="infra-maint-item-name">${m.name}</div>
                <div class="infra-maint-item-detail">${m.station} · ${m.dueText}</div>
              </div>
            `).join('')}
          </div>
          <div class="infra-maint-column">
            <div class="infra-maint-col-title col-progress">In Progress (${workingMaintenance.inProgress.length})</div>
            ${workingMaintenance.inProgress.map(m => `
              <div class="infra-maint-item priority-${m.priority}" data-asset-id="${m.assetId}">
                <div class="infra-maint-item-name">${m.name}</div>
                <div class="infra-maint-item-detail">${m.station} · ${m.dueText}</div>
              </div>
            `).join('')}
          </div>
          <div class="infra-maint-column">
            <div class="infra-maint-col-title col-completed">Completed (${workingMaintenance.completed.length})</div>
            ${workingMaintenance.completed.map(m => `
              <div class="infra-maint-item priority-${m.priority}" data-asset-id="${m.assetId}">
                <div class="infra-maint-item-name">${m.name}</div>
                <div class="infra-maint-item-detail">${m.station} · ${m.dueText}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    section.querySelectorAll('.infra-maint-item').forEach(item => {
      item.addEventListener('click', () => {
        const asset = workingAssets.find(a => a.id === item.dataset.assetId);
        if (asset) openDrawer(asset);
      });
    });
  }, 20);

  return section;
}

// ── FILTER HELPERS ──
function getFilteredAssets() {
  let list = workingAssets;
  if (selectedStation !== 'all') {
    list = list.filter(a => a.station === selectedStation);
  }
  if (selectedCategory) {
    const catName = ASSET_CATEGORIES.find(c => c.id === selectedCategory)?.name;
    if (catName) list = list.filter(a => a.category === catName);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.assignee.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    );
  }
  if (filterStatus !== 'all') {
    list = list.filter(a => a.status === filterStatus);
  }
  return list;
}

// ── ASSET TABLE ──
function buildAssetTable() {
  const section = document.createElement('div');
  section.id = 'asset-table-section';
  section.innerHTML = renderAssetTableInner();

  setTimeout(() => attachTableEvents(section), 20);
  return section;
}

function renderAssetTableInner() {
  const filtered = getFilteredAssets();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const statusBadge = (s) => {
    if (s === 'Operational') return 'infra-badge-green';
    if (s === 'Needs Attention') return 'infra-badge-amber';
    if (s === 'Critical') return 'infra-badge-red';
    if (s === 'Under Maintenance') return 'infra-badge-purple';
    return 'infra-badge-neutral';
  };

  const healthColor = (h) => h >= 90 ? 'green' : h >= 70 ? 'amber' : 'red';

  return `
    <div class="infra-section-header">
      <div class="infra-section-title">Station Asset Registry${selectedCategory ? ` — ${ASSET_CATEGORIES.find(c => c.id === selectedCategory)?.name || ''}` : ''}</div>
    </div>
    <div class="infra-card" style="margin-top: 10px;">
      <div class="infra-table-toolbar">
        <input type="text" class="infra-search-input" id="asset-search" placeholder="Search by asset name, ID, category, assignee..." value="${searchQuery}" />
        <div class="infra-filter-group">
          <select class="infra-select" id="status-filter">
            <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="Operational" ${filterStatus === 'Operational' ? 'selected' : ''}>Operational</option>
            <option value="Needs Attention" ${filterStatus === 'Needs Attention' ? 'selected' : ''}>Needs Attention</option>
            <option value="Critical" ${filterStatus === 'Critical' ? 'selected' : ''}>Critical</option>
            <option value="Under Maintenance" ${filterStatus === 'Under Maintenance' ? 'selected' : ''}>Under Maintenance</option>
          </select>
          <span style="font-size:12px; color:var(--text-muted); white-space:nowrap;">${filtered.length} assets found</span>
        </div>
      </div>
      <div style="overflow-x: auto;">
        <table class="infra-data-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Asset ID</th>
              <th>Category</th>
              <th>Station</th>
              <th>Status</th>
              <th>Health</th>
              <th>Last Inspection</th>
              <th>Next Maintenance</th>
              <th>Assignee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="asset-table-body">
            ${paged.map(asset => `
              <tr data-asset-id="${asset.id}">
                <td style="font-weight:600;">${asset.name}</td>
                <td style="font-family:var(--font-mono); font-weight:600; font-size:11px;">${asset.id}</td>
                <td><span class="infra-badge infra-badge-neutral">${asset.category}</span></td>
                <td>${asset.station}</td>
                <td><span class="infra-badge ${statusBadge(asset.status)}">${asset.status}</span></td>
                <td>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="infra-health-bar-bg" style="width:60px;"><div class="infra-health-bar-fill ${healthColor(asset.health)}" style="width:${asset.health}%;"></div></div>
                    <span style="font-weight:600; font-size:11px;">${asset.health}%</span>
                  </div>
                </td>
                <td style="color:var(--text-muted);">${asset.lastInspection}</td>
                <td style="color:var(--text-muted);">${asset.nextMaintenance}</td>
                <td><span class="assignee-link" data-assignee="${asset.assignee}" style="text-decoration:underline; cursor:pointer;" title="View assignee">${asset.assignee}</span></td>
                <td>
                  <button class="infra-btn infra-btn-secondary infra-btn-sm asset-view-btn" data-asset-id="${asset.id}">Inspect</button>
                </td>
              </tr>
            `).join('')}
            ${paged.length === 0 ? '<tr><td colspan="10" style="text-align:center; padding:32px; color:var(--text-muted); font-size:13px;">🔍 No infrastructure assets match your search or filter criteria.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
      <div class="infra-table-pagination" id="asset-pagination">
        <span>Showing ${paged.length} of ${filtered.length} assets (Page ${currentPage} of ${totalPages})</span>
        <div class="infra-pagination-btns">
          ${Array.from({ length: totalPages }, (_, i) => `
            <button class="infra-page-btn ${currentPage === i + 1 ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function attachTableEvents(section) {
  const searchInput = section.querySelector('#asset-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      updateAssetTableOnly();
    });
  }

  const statusSelect = section.querySelector('#status-filter');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      filterStatus = e.target.value;
      currentPage = 1;
      updateAssetTableOnly();
    });
  }

  attachRowAndPaginationEvents(section);
}

function attachRowAndPaginationEvents(section) {
  section.querySelectorAll('.infra-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      updateAssetTableOnly();
    });
  });

  section.querySelectorAll('.asset-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const asset = workingAssets.find(a => a.id === btn.dataset.assetId);
      if (asset) openDrawer(asset);
    });
  });

  section.querySelectorAll('.infra-data-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      const asset = workingAssets.find(a => a.id === row.dataset.assetId);
      if (asset) openDrawer(asset);
    });
  });

  section.querySelectorAll('.assignee-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const member = TEAM_MEMBERS.find(m => m.name === link.dataset.assignee);
      if (member) openEmployeeDrawer(member);
    });
  });
}

function updateAssetTableOnly() {
  const section = document.getElementById('asset-table-section');
  if (!section) return;
  const searchInput = section.querySelector('#asset-search');
  const hadFocus = document.activeElement === searchInput;
  const selStart = searchInput ? searchInput.selectionStart : 0;
  const selEnd = searchInput ? searchInput.selectionEnd : 0;

  section.innerHTML = renderAssetTableInner();
  attachTableEvents(section);

  if (hadFocus) {
    const newSearchInput = section.querySelector('#asset-search');
    if (newSearchInput) {
      newSearchInput.focus();
      newSearchInput.setSelectionRange(selStart, selEnd);
    }
  }
}

// ── RECENT ACTIVITY ──
function buildRecentActivitySection() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="infra-card">
      <div class="infra-card-header">
        <div class="infra-card-title">📋 Live Infrastructure Activity Audit</div>
      </div>
      <div class="infra-card-body">
        <div class="infra-timeline">
          ${RECENT_ACTIVITY.map(entry => `
            <div class="infra-timeline-item">
              <div class="infra-timeline-dot-wrap">
                <div class="infra-timeline-dot dot-${entry.type}"></div>
              </div>
              <div style="display:flex; align-items:flex-start; gap:12px; flex:1;">
                <div class="infra-timeline-time">${entry.time}</div>
                <div class="infra-timeline-content">
                  <div class="infra-timeline-action">${entry.action}</div>
                  <div class="infra-timeline-person">${entry.person}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  return section;
}

// ── IMPACT CHAINS ──
function buildImpactSection() {
  const section = document.createElement('div');
  section.innerHTML = `
    <div class="infra-card">
      <div class="infra-card-header">
        <div class="infra-card-title">🔗 Infrastructure Failure Cascade Analysis</div>
      </div>
      <div class="infra-card-body" style="display:flex; flex-direction:column; gap:14px;">
        ${IMPACT_CHAINS.map(chain => `
          <div class="infra-impact-chain">
            <div class="infra-impact-chain-title">${chain.title}</div>
            ${chain.steps.map((step, i) => `
              ${i > 0 ? '<div class="infra-impact-arrow">↓</div>' : ''}
              <div class="infra-impact-step">
                <span style="font-size:13px;">${i === 0 ? '🔴' : i === chain.steps.length - 1 ? '⚠️' : '→'}</span>
                ${step}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return section;
}

// ── DETAILS DRAWER (ASSET & EMPLOYEE) ──
function buildDrawer() {
  const backdrop = document.createElement('div');
  backdrop.className = 'infra-drawer-backdrop';
  backdrop.id = 'asset-drawer-backdrop';
  backdrop.innerHTML = `
    <div class="infra-drawer" id="asset-drawer">
      <div class="infra-drawer-header">
        <div class="infra-drawer-title" id="drawer-title">Details</div>
        <button class="infra-drawer-close" id="drawer-close-btn" title="Close (Esc)">✕</button>
      </div>
      <div class="infra-drawer-body" id="drawer-body"></div>
      <div class="infra-drawer-actions" id="drawer-actions"></div>
    </div>
  `;

  setTimeout(() => {
    const bd = document.getElementById('asset-drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');
    if (bd) bd.addEventListener('click', (e) => { if (e.target === bd) closeDrawer(); });
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  }, 30);

  return backdrop;
}

// Open Asset Details
function openDrawer(asset) {
  selectedAsset = asset;
  selectedEmployee = null;
  const backdrop = document.getElementById('asset-drawer-backdrop');
  const title = document.getElementById('drawer-title');
  const body = document.getElementById('drawer-body');
  const actions = document.getElementById('drawer-actions');

  if (!backdrop || !body) return;

  title.textContent = `${asset.name} (${asset.id})`;

  const statusBadge = asset.status === 'Critical' ? 'infra-badge-red' : asset.status === 'Needs Attention' ? 'infra-badge-amber' : asset.status === 'Under Maintenance' ? 'infra-badge-purple' : 'infra-badge-green';
  const healthColor = asset.health >= 90 ? 'green' : asset.health >= 70 ? 'amber' : 'red';

  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">${asset.id}</span>
      <span class="infra-badge ${statusBadge}">${asset.status}</span>
    </div>
    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Category</span><span class="infra-drawer-field-value">${asset.category}</span></div>
    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Station Base</span><span class="infra-drawer-field-value">${asset.station} Research Station</span></div>
    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Physical Location</span><span class="infra-drawer-field-value">${asset.location}</span></div>
    <div class="infra-drawer-field">
      <span class="infra-drawer-field-label">Asset Health</span>
      <span class="infra-drawer-field-value" style="display:flex; align-items:center; gap:8px;">
        <div class="infra-health-bar-bg" style="width:80px;"><div class="infra-health-bar-fill ${healthColor}" style="width:${asset.health}%;"></div></div>
        <strong>${asset.health}%</strong>
      </span>
    </div>
    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Last Inspection</span><span class="infra-drawer-field-value">${asset.lastInspection}</span></div>
    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Next Maintenance</span><span class="infra-drawer-field-value">${asset.nextMaintenance}</span></div>
    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Responsible Engineer</span><span class="infra-drawer-field-value">${asset.assignee}</span></div>

    <div style="margin-top:10px;">
      <div style="font-size:12px; font-weight:600; color:var(--text-primary); margin-bottom:6px;">Subsystem Telemetry</div>
      <div style="background:var(--bg-muted); padding:10px 12px; border-radius:var(--radius-md); font-size:11.5px; font-family:var(--font-mono); display:flex; flex-direction:column; gap:4px;">
        <div>Operating Temp: ${asset.category === 'Generators' ? '82°C (Coolant: 64°C)' : '-18°C ambient'}</div>
        <div>Vibration Level: ${asset.status === 'Needs Attention' ? '4.8 mm/s (ELEVATED)' : '1.2 mm/s (NOMINAL)'}</div>
        <div>Load / Duty Cycle: ${asset.status === 'Critical' ? '96% (OVERLOAD RISK)' : '64%'}</div>
      </div>
    </div>

    <div style="margin-top:10px;">
      <div style="font-size:12px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Recent Service Log</div>
      <div style="font-size:11.5px; color:var(--text-muted); display:flex; flex-direction:column; gap:6px;">
        <div>📋 Inspection completed on ${asset.lastInspection} by ${asset.assignee}</div>
        ${asset.status !== 'Operational' ? `<div style="color:var(--accent-amber);">⚠️ Condition alert logged: ${asset.status}</div>` : '<div style="color:var(--accent-green);">✅ Telemetry telemetry signals nominal</div>'}
      </div>
    </div>
  `;

  actions.innerHTML = `
    <button class="infra-btn infra-btn-primary infra-btn-sm" id="btn-toggle-status">Update Status</button>
    <button class="infra-btn infra-btn-secondary infra-btn-sm" id="btn-schedule-maint">Schedule Service</button>
    <button class="infra-btn infra-btn-secondary infra-btn-sm" id="btn-view-engineer">View Assignee</button>
  `;

  setTimeout(() => {
    const statusBtn = document.getElementById('btn-toggle-status');
    if (statusBtn) {
      statusBtn.addEventListener('click', () => {
        const statuses = ['Operational', 'Needs Attention', 'Under Maintenance', 'Critical'];
        const nextIdx = (statuses.indexOf(asset.status) + 1) % statuses.length;
        asset.status = statuses[nextIdx];
        asset.health = asset.status === 'Operational' ? 95 : asset.status === 'Needs Attention' ? 74 : asset.status === 'Under Maintenance' ? 62 : 45;
        openDrawer(asset);
        updateAssetTableOnly();
        showToast(`Asset status updated to: ${asset.status}`, asset.status === 'Operational' ? 'success' : 'warning');
      });
    }

    const schedBtn = document.getElementById('btn-schedule-maint');
    if (schedBtn) {
      schedBtn.addEventListener('click', () => {
        asset.nextMaintenance = '12 Sep 2026';
        workingMaintenance.due.unshift({
          assetId: asset.id,
          name: asset.name,
          station: asset.station,
          dueText: 'Scheduled for 12 Sep 2026',
          priority: 'medium'
        });
        openDrawer(asset);
        updateAssetTableOnly();
        showToast(`Maintenance work order created for ${asset.name}`, 'success');
      });
    }

    const viewEngBtn = document.getElementById('btn-view-engineer');
    if (viewEngBtn) {
      viewEngBtn.addEventListener('click', () => {
        const member = TEAM_MEMBERS.find(m => m.name === asset.assignee);
        if (member) {
          openEmployeeDrawer(member);
        } else {
          showToast(`Engineer profile for ${asset.assignee} is on record`, 'info');
        }
      });
    }
  }, 30);

  backdrop.classList.add('open');
}

// Open Employee Profile Drawer
function openEmployeeDrawer(member) {
  selectedEmployee = member;
  selectedAsset = null;
  const backdrop = document.getElementById('asset-drawer-backdrop');
  const title = document.getElementById('drawer-title');
  const body = document.getElementById('drawer-body');
  const actions = document.getElementById('drawer-actions');

  if (!backdrop || !body) return;

  title.textContent = `Personnel Profile — ${member.name}`;

  const dotClass = member.status === 'Online' ? 'online' : member.status === 'On Site' ? 'onsite' : 'offline';
  const assignedAssetsList = workingAssets.filter(a => a.assignee === member.name);

  body.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; padding:8px 0; border-bottom:1px solid var(--border-default);">
      <div class="infra-team-avatar" style="width:54px; height:54px; font-size:18px;">${member.avatar}</div>
      <div>
        <div style="font-size:16px; font-weight:700; color:var(--text-primary);">${member.name}</div>
        <div style="font-size:12.5px; color:var(--accent-blue); font-weight:600;">${member.role}</div>
        <div style="font-size:11.5px; color:var(--text-muted); display:flex; align-items:center; gap:6px; margin-top:2px;">
          <span class="infra-team-status-dot ${dotClass}"></span>${member.status} · 📍 ${member.station} Station
        </div>
      </div>
    </div>

    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Employee ID</span><span class="infra-drawer-field-value" style="font-family:var(--font-mono);">${member.id}</span></div>
    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Assigned Station</span><span class="infra-drawer-field-value">${member.station} Research Station</span></div>
    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Satellite Radio Channel</span><span class="infra-drawer-field-value">VHF-Ch ${member.id === 'EMP-001' ? '16' : '09'} (Priority Ops)</span></div>
    <div class="infra-drawer-field"><span class="infra-drawer-field-label">Polar Expeditions</span><span class="infra-drawer-field-value">38th, 40th, 42nd ISEA</span></div>

    <div style="margin-top:8px;">
      <div style="font-size:12px; font-weight:600; color:var(--text-primary); margin-bottom:6px;">Qualifications & Certifications</div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
        <span class="infra-badge infra-badge-neutral">Polar Survival Phase IV</span>
        <span class="infra-badge infra-badge-blue">Generator Systems Level 3</span>
        <span class="infra-badge infra-badge-green">ECLSS HVAC Safety</span>
        <span class="infra-badge infra-badge-purple">Satellite Earth Station Ops</span>
      </div>
    </div>

    <div style="margin-top:10px;">
      <div style="font-size:12px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Assigned Station Assets (${assignedAssetsList.length})</div>
      <div style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto;">
        ${assignedAssetsList.map(a => `
          <div class="infra-card" style="padding:8px 12px; cursor:pointer; display:flex; justify-content:space-between; align-items:center;" data-emp-asset-id="${a.id}">
            <div>
              <div style="font-weight:600; font-size:12px;">${a.name}</div>
              <div style="font-size:10.5px; color:var(--text-muted);">${a.category} · ${a.station}</div>
            </div>
            <span class="infra-badge ${a.status === 'Operational' ? 'infra-badge-green' : a.status === 'Critical' ? 'infra-badge-red' : 'infra-badge-amber'}" style="font-size:10px;">${a.status}</span>
          </div>
        `).join('')}
        ${assignedAssetsList.length === 0 ? '<div style="color:var(--text-muted); font-size:11.5px;">No individual equipment assigned directly.</div>' : ''}
      </div>
    </div>
  `;

  actions.innerHTML = `
    <button class="infra-btn infra-btn-primary infra-btn-sm" id="btn-contact-member">Dispatch Comms</button>
    <button class="infra-btn infra-btn-secondary infra-btn-sm" id="btn-reassign-member">Assign New Asset</button>
  `;

  setTimeout(() => {
    body.querySelectorAll('[data-emp-asset-id]').forEach(item => {
      item.addEventListener('click', () => {
        const asset = workingAssets.find(a => a.id === item.dataset.empAssetId);
        if (asset) openDrawer(asset);
      });
    });

    const contactBtn = document.getElementById('btn-contact-member');
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        showToast(`Comms dispatch ping sent to ${member.name} via SatCom VHF-16`, 'success');
      });
    }

    const reassignBtn = document.getElementById('btn-reassign-member');
    if (reassignBtn) {
      reassignBtn.addEventListener('click', () => {
        showToast(`Task queue assignment interface opened for ${member.name}`, 'info');
      });
    }
  }, 30);

  backdrop.classList.add('open');
}

function closeDrawer() {
  const backdrop = document.getElementById('asset-drawer-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  selectedAsset = null;
  selectedEmployee = null;
}

// Close drawer on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});
