// Main Application Entry Point - Secure Antarctic Operations Digital Twin
import './style.css';
import { telemetry } from './utils/telemetry.js';
import { authService } from './auth/authService.js';
import { renderSidebar } from './components/sidebar.js';
import { renderHeader } from './components/header.js';
import { initModals } from './components/modals.js';
import { initAIAssistant, updateAIAssistantVisibility, openAIAssistant } from './features/aiVoiceAssistant/index.js';

// Import Views
import { renderLoginView } from './views/loginView.js';
import { renderUnauthorizedView } from './views/unauthorizedView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderInfrastructureView } from './views/infrastructureView.js';
import { renderEnergyView } from './views/energyView.js';
import { renderLogisticsView } from './views/logisticsView.js';
import { renderEnvironmentView } from './views/environmentView.js';
import { renderResearchView } from './views/researchView.js';
import { renderInventoryView } from './views/inventoryView.js';
import { renderMaintenanceView } from './views/maintenanceView.js';
import { renderAlertsView } from './views/alertsView.js';
import { renderPersonnelView } from './views/personnelView.js';
import { renderRolesView } from './views/rolesView.js';
import { renderReportsView } from './views/reportsView.js';
import { renderSettingsView } from './views/settingsView.js';
import { renderHelpView } from './views/helpView.js';
import { renderExpeditionsView } from './views/expeditionsView.js';
import { renderTrackingView } from './views/trackingView.js';
import { renderLogisticsCommandView } from './views/logisticsCommandView.js';
import { renderEnvironmentalMonitoringView } from './views/environmentalMonitoringView.js';

const routesMap = {
  dashboard: { title: 'Dashboard', render: () => renderDashboardView(telemetry, openAIAssistant, authService) },
  tracking: { title: 'Antarctic Maritime & Polar Aviation Live Tracking', render: () => renderTrackingView(telemetry, authService, navigateTo) },
  liveTracking: { title: 'Antarctic Maritime & Polar Aviation Live Tracking', render: () => renderTrackingView(telemetry, authService, navigateTo) },
  logisticsCommand: { title: 'Antarctic Logistics Command Center', render: () => renderLogisticsCommandView(telemetry, authService, navigateTo) },
  expeditions: { title: 'Expedition & Convoy Route Intelligence', render: () => renderExpeditionsView(telemetry, authService, navigateTo) },
  routeIntelligence: { title: 'Expedition & Convoy Route Intelligence', render: () => renderExpeditionsView(telemetry, authService, navigateTo) },
  infrastructure: { title: 'Infrastructure', render: () => renderInfrastructureView(telemetry) },
  energy: { title: 'Energy Management', render: () => renderEnergyView(telemetry) },
  logistics: { title: 'Logistics Management', render: () => renderLogisticsView(telemetry) },
  environment: { title: 'Environmental Monitoring', render: () => renderEnvironmentView(telemetry) },
  envMonitoring: { title: 'Environmental Operations Center', render: () => renderEnvironmentalMonitoringView(telemetry, authService, navigateTo) },
  research: { title: 'Research Activities', render: () => renderResearchView(telemetry) },
  inventory: { title: 'Inventory Stores', render: () => renderInventoryView(telemetry) },
  maintenance: { title: 'Maintenance & Repairs', render: () => renderMaintenanceView(telemetry) },
  alerts: { title: 'Alerts & Incidents', render: (modals) => renderAlertsView(telemetry, modals?.openIncidentModal) },
  personnel: { title: 'Station Personnel', render: () => renderPersonnelView(telemetry) },
  roles: { title: 'User Management & RBAC Security', render: () => renderRolesView(telemetry) },
  reports: { title: 'Reports & Analytics', render: () => renderReportsView(telemetry) },
  settings: { title: 'System Settings', render: () => renderSettingsView(telemetry) },
  help: { title: 'Help & Operations Manual', render: () => renderHelpView(telemetry) }
};

let currentRoute = 'dashboard';
let modalsInstance = null;

function normalizeRouteId(raw) {
  if (!raw) return 'dashboard';
  let cleaned = raw.replace(/^#/, '').replace(/^\//, '');
  if (cleaned === 'admin/live-tracking' || cleaned === 'live-tracking' || cleaned === 'polar-tracking') {
    return 'tracking';
  }
  if (cleaned === 'admin/expeditions' || cleaned === 'expedition-routes' || cleaned === 'route-intelligence') {
    return 'expeditions';
  }
  if (cleaned === 'digitalTwin' || cleaned === 'digital-twin' || cleaned === 'digital-twin-3d') {
    return 'dashboard';
  }
  if (cleaned === 'logistics-command' || cleaned === 'logisticsCommandCenter' || cleaned === 'logistics-command-center' || cleaned === 'logisticsCommand') {
    return 'logisticsCommand';
  }
  if (cleaned === 'environmental-monitoring' || cleaned === 'env-monitoring' || cleaned === 'environmentalMonitoring' || cleaned === 'envMonitoring') {
    return 'envMonitoring';
  }
  return routesMap[cleaned] ? cleaned : 'dashboard';
}

function navigateTo(routeId) {
  routeId = normalizeRouteId(routeId);
  currentRoute = routeId;
  window.location.hash = routeId;
  renderApp();
}

function renderApp() {
  const appEl = document.querySelector('#app');
  appEl.innerHTML = '';

  // Enforce AI Copilot visibility: ONLY for authenticated ADMIN users
  updateAIAssistantVisibility(authService);

  // 1. Guard: Check Authentication
  if (!authService.isAuthenticated) {
    const loginView = renderLoginView(authService, (user) => {
      const defaultRoute = authService.getDefaultRoute();
      navigateTo(defaultRoute);
    });
    appEl.appendChild(loginView);
    return;
  }

  // 2. Guard: Check Role/Department Authorization for currentRoute
  const activeRoute = routesMap[currentRoute] || routesMap.dashboard;
  const isAuthorized = authService.canAccessRoute(currentRoute);

  // Render Sidebar & Header with Admin AI Copilot bridge
  const sidebarEl = renderSidebar(currentRoute, navigateTo, authService, openAIAssistant);
  const mainWrapper = document.createElement('main');
  mainWrapper.className = 'main-wrapper';

  const headerEl = renderHeader(
    isAuthorized ? activeRoute.title : 'Access Restricted',
    () => modalsInstance && modalsInstance.openCmdPalette(),
    () => modalsInstance && modalsInstance.openIncidentModal(),
    telemetry,
    authService,
    openAIAssistant
  );

  // Render active view or unauthorized view
  let viewContent;
  if (isAuthorized) {
    viewContent = activeRoute.render(modalsInstance);
  } else {
    viewContent = renderUnauthorizedView(authService, currentRoute, navigateTo);
  }

  mainWrapper.appendChild(headerEl);
  mainWrapper.appendChild(viewContent);

  appEl.appendChild(sidebarEl);
  appEl.appendChild(mainWrapper);
}

// Initial setup
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize AI assistant engine instance
  initAIAssistant({ routerCallback: navigateTo, telemetry });

  // Try restoring existing session
  await authService.restoreSession();

  // Synchronize AI Copilot visibility based on restored session
  updateAIAssistantVisibility(authService);

  const rawHash = window.location.hash.replace('#', '');
  if (authService.isAuthenticated) {
    if (rawHash) {
      currentRoute = normalizeRouteId(rawHash);
    } else {
      currentRoute = authService.getDefaultRoute();
      window.location.hash = currentRoute;
    }
  }

  modalsInstance = initModals(navigateTo, telemetry);
  renderApp();

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const newRawHash = window.location.hash.replace('#', '');
    const resolvedRoute = normalizeRouteId(newRawHash);
    if (resolvedRoute !== currentRoute) {
      currentRoute = resolvedRoute;
      renderApp();
    }
  });

  // Re-render and toggle AI Copilot when auth status changes
  authService.subscribe((user, isAuthenticated) => {
    if (!isAuthenticated) {
      currentRoute = 'dashboard';
    }
    updateAIAssistantVisibility(authService);
    renderApp();
  });

  // Subscribe to real-time telemetry updates for KPI tickers
  telemetry.subscribe((state) => {
    const kpiPower = document.querySelector('#kpi-power-val');
    const kpiTemp = document.querySelector('#kpi-temp-val');
    const kpiAlert = document.querySelector('#kpi-alert-val');

    if (kpiPower) kpiPower.innerText = `${state.kpis.powerKw} kW`;
    if (kpiTemp) kpiTemp.innerText = `${state.kpis.tempAmbient} °C`;
    if (kpiAlert) kpiAlert.innerText = `${state.kpis.activeAlertsCount} Active`;
  });
});
