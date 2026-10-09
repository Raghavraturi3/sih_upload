// Infrastructure Management View Module
// Indian Antarctic Research Stations (Maitri & Bharati)
// Complete Interconnected Digital Twin: Power, Heating, Water, Fuel, Dependencies, Maintenance, What-If Simulation

import { infrastructureService } from '../services/infrastructure/infrastructureService.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export function renderInfrastructureView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';
  container.id = 'infrastructure-management-root';

  let chartInstance = null;
  let genDetailChartInstance = null;
  let activeGenModalTab = 'overview';
  let activeGenModalTf = '24H';

  function render() {
    const data = infrastructureService.getTelemetry();
    const isAdmin = true;

    container.innerHTML = `
      <!-- TOP STATUS BAR & STATION SELECTOR -->
      <div class="page-title-bar" style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
            <h1 class="page-heading" style="margin:0; font-size:22px; font-weight:800; letter-spacing:-0.02em;">
              INFRASTRUCTURE MANAGEMENT
            </h1>
            <span class="badge" style="font-size:10px; background:rgba(6,182,212,0.12); color:#06b6d4; border:1px solid rgba(6,182,212,0.3); font-family:var(--font-mono, monospace);">
              ● SIMULATION MODE
            </span>
            ${data.isSimulationActive ? `
              <span class="badge" style="font-size:10px; background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid #ef4444; animation:pulse 1.5s infinite; display:inline-flex; align-items:center; gap:4px; font-family:var(--font-mono, monospace);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                SCENARIO: ${data.activeScenario.replace('_', ' ')}
              </span>
            ` : ''}
          </div>
          <p class="page-subheading" style="margin:0; color:#94a3b8; font-size:12.5px;">
            ${data.stationName} (${data.stationLocation}) • Primary Life Support, Energy Microgrid & Water Infrastructure
          </p>
        </div>

        <!-- Station Switcher & Actions -->
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:6px; background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:4px 10px;">
            <span style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase;">STATION:</span>
            <select id="select-infra-station" style="background:transparent; border:none; color:#22d3ee; font-weight:800; font-size:12.5px; cursor:pointer; outline:none; font-family:var(--font-sans, sans-serif);">
              <option value="MAITRI" ${data.stationId === 'MAITRI' ? 'selected' : ''} style="background:#0b1324;">MAITRI (Priyadarshini Lake)</option>
              <option value="BHARATI" ${data.stationId === 'BHARATI' ? 'selected' : ''} style="background:#0b1324;">BHARATI (Prydz Bay RO)</option>
            </select>
          </div>

          <button class="btn btn-secondary btn-sm" id="btn-quick-sim-toggle" style="padding:5px 10px; font-size:11px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>${data.isSimulationActive ? 'Reset Baseline' : 'Inject Failure'}</span>
          </button>
        </div>
      </div>

      <!-- STEP 4: INFRASTRUCTURE OVERVIEW TOP STRIP -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:12px 16px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:11px; font-weight:800; font-family:var(--font-mono, monospace); color:#cbd5e1; display:flex; align-items:center; gap:16px;">
            <span>STATION: <strong style="color:#38bdf8;">${data.stationId}</strong></span>
            <span style="color:#475569;">|</span>
            <span style="color:${data.health.power === 'NORMAL' ? '#10b981' : '#ef4444'};">POWER: <strong>${data.health.power}</strong></span>
            <span style="color:${data.health.water === 'NORMAL' ? '#10b981' : '#f59e0b'};">WATER: <strong>${data.health.water}</strong></span>
            <span style="color:${data.health.heating === 'NORMAL' ? '#10b981' : '#f59e0b'};">HEATING: <strong>${data.health.heating}</strong></span>
            <span style="color:${data.health.fuel === 'NORMAL' ? '#10b981' : '#f59e0b'};">FUEL: <strong>${data.health.fuel}</strong></span>
          </div>
          <div style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8; display:flex; align-items:center; gap:6px;">
            <span style="width:6px; height:6px; border-radius:50%; background:#10b981; animation:pulse 2s infinite;"></span>
            <span>MODEL SYNCHRONIZED</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; text-align:center; font-family:var(--font-mono, monospace);">
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">GENERATION</div>
            <div style="font-size:17px; font-weight:800; color:#38bdf8; margin-top:2px;">${data.totalGenerationKw} kW</div>
            <div style="font-size:9px; color:#64748b;">${data.generators.filter(g => g.status === 'ONLINE').length} Generators Active</div>
          </div>
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">CONSUMPTION</div>
            <div style="font-size:17px; font-weight:800; color:#fbbf24; margin-top:2px;">${data.totalConsumptionKw} kW</div>
            <div style="font-size:9px; color:#64748b;">Peak: ${data.peakLoadTodayKw} kW</div>
          </div>
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid ${data.availableCapacityKw < 15 ? '#ef4444' : '#1e293b'};">
            <div style="font-size:9.5px; color:#94a3b8;">AVAILABLE CAPACITY</div>
            <div style="font-size:17px; font-weight:800; color:${data.availableCapacityKw < 15 ? '#ef4444' : '#34d399'}; margin-top:2px;">
              ${data.availableCapacityKw} kW
            </div>
            <div style="font-size:9px; color:${data.availableCapacityKw < 15 ? '#f87171' : '#64748b'};">
              ${data.availableCapacityKw < 0 ? 'DEFICIT ALERT' : 'Reserve Margin'}
            </div>
          </div>
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">FRESH WATER</div>
            <div style="font-size:17px; font-weight:800; color:#06b6d4; margin-top:2px;">${data.waterSystem.freshWaterStorage.levelPercent}%</div>
            <div style="font-size:9px; color:#64748b;">${data.waterSystem.freshWaterStorage.reserveDaysRemaining} Days Reserve</div>
          </div>
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">HEATING DEMAND</div>
            <div style="font-size:17px; font-weight:800; color:#f59e0b; margin-top:2px;">${data.heatingDemandPercent}%</div>
            <div style="font-size:9px; color:#64748b;">Power: ${data.heatingPowerKw} kW</div>
          </div>
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid ${data.health.criticalAlertsCount > 0 ? '#ef4444' : '#1e293b'};">
            <div style="font-size:9.5px; color:#94a3b8;">CRITICAL ALERTS</div>
            <div style="font-size:17px; font-weight:800; color:${data.health.criticalAlertsCount > 0 ? '#ef4444' : '#34d399'}; margin-top:2px;">
              ${data.health.criticalAlertsCount}
            </div>
            <div style="font-size:9px; color:#64748b;">${data.health.criticalAlertsCount > 0 ? 'Action Required' : 'All Nominals Clear'}</div>
          </div>
        </div>
      </div>

      <!-- STEP 2: SUB-NAVIGATION TABS (STRICTLY INSIDE INFRASTRUCTURE MANAGEMENT) -->
      <div style="display:flex; gap:6px; border-bottom:1px solid #1e293b; padding-bottom:8px; margin-bottom:16px; overflow-x:auto;">
        ${[
          { id: 'overview', label: 'Station Overview', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
          { id: 'power', label: 'Power Infrastructure', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
          { id: 'heating', label: 'Heating Infrastructure', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>' },
          { id: 'water', label: 'Water Infrastructure', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>' },
          { id: 'dependencies', label: 'Dependencies', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M6 9v6"/><path d="M9 18h6"/></svg>' },
          { id: 'maintenance', label: 'Maintenance', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
          { id: 'simulation', label: 'What-If Simulation', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' }
        ].map(t => `
          <button class="btn-infra-tab ${data.activeTab === t.id ? 'active' : ''}" data-tab="${t.id}" style="padding:6px 12px; font-size:11.5px; border-radius:6px; border:1px solid ${data.activeTab === t.id ? '#22d3ee' : '#1e293b'}; background:${data.activeTab === t.id ? 'rgba(34,211,238,0.1)' : '#070d19'}; color:${data.activeTab === t.id ? '#22d3ee' : '#94a3b8'}; cursor:pointer; font-weight:700; display:inline-flex; align-items:center; gap:6px; white-space:nowrap; transition:all 0.18s ease-out;">
            ${t.icon}
            <span>${t.label}</span>
          </button>
        `).join('')}
      </div>

      <!-- MAIN TAB CONTENT CONTAINER -->
      <div id="infra-tab-content-area">
        ${renderTabContent(data)}
      </div>

      <!-- GENERATOR DETAIL PANEL MODAL (STEP 6) -->
      ${data.selectedGeneratorId ? renderGeneratorDetailModal(data) : ''}
    `;

    bindEvents(container, data);
    initCharts(data);
  }

  // ── Tab Content Router ──
  function renderTabContent(data) {
    switch (data.activeTab) {
      case 'power':
        return renderPowerTab(data);
      case 'heating':
        return renderHeatingTab(data);
      case 'water':
        return renderWaterTab(data);
      case 'dependencies':
        return renderDependenciesTab(data);
      case 'maintenance':
        return renderMaintenanceTab(data);
      case 'simulation':
        return renderSimulationTab(data);
      case 'overview':
      default:
        return renderOverviewTab(data);
    }
  }

  // ── 1. Station Overview Tab ──
  function renderOverviewTab(data) {
    return `
      <!-- Energy Distribution & Sankey-Style Flow (Step 10) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 6h-5a4 4 0 0 0-4 4v4"/><path d="m15 9 3-3-3-3"/><path d="M6 18h5a4 4 0 0 0 4-4V6"/><circle cx="18" cy="6" r="3"/></svg>
            <span>ENERGY DISTRIBUTION & MAIN POWER BUS FLOW</span>
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">415V 3-PHASE • CLICK NODE TO INSPECT</span>
        </div>

        <!-- Visual Flow Pipeline -->
        <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:12px; font-family:var(--font-mono, monospace); font-size:11px;">
          <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:8px; border-bottom:1px dashed #1e293b; flex-wrap:wrap; gap:8px;">
            <span style="color:#38bdf8; font-weight:700;">
              GENERATORS (${data.totalGenerationKw} kW)
            </span>
            <span style="color:#94a3b8;">──▶ MAIN DISTRIBUTION BUS ──▶</span>
            <span style="color:#fbbf24; font-weight:700;">
              TOTAL DEMAND (${data.totalConsumptionKw} kW)
            </span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px; margin-top:10px;">
            ${data.systemLoads.map(load => `
              <div class="btn-inspect-load" data-load-id="${load.id}" style="padding:8px 10px; background:#0b1324; border-left:3px solid ${load.color}; border-radius:4px; cursor:pointer; border-top:1px solid #1e293b; border-right:1px solid #1e293b; border-bottom:1px solid #1e293b;">
                <div style="color:#94a3b8; font-size:9.5px; text-transform:uppercase;">${load.name}</div>
                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:2px;">
                  <strong style="color:${load.color}; font-size:13px;">${load.powerKw} kW</strong>
                  <span style="font-size:10px; color:#64748b;">${load.percent}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Historical Consumption Trend Multi-Line Chart (Chart.js) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee; display:flex; align-items:center; gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              <span>POWER & HEATING HISTORICAL CONSUMPTION TRENDS</span>
            </div>
            <div style="font-size:10px; color:#94a3b8; margin-top:2px;">
              Continuous kW Telemetry vs Model Projected Energy Curve
            </div>
          </div>

          <div style="display:flex; gap:4px; font-family:var(--font-mono, monospace);">
            ${['1H', '6H', '24H', '7D', '30D'].map(tf => `
              <button class="btn btn-sm btn-infra-tf ${data.timeframe === tf ? 'btn-primary' : 'btn-secondary'}" data-tf="${tf}" style="padding:3px 8px; font-size:10.5px; border-radius:4px;">
                ${tf}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="height:260px; position:relative;">
          <canvas id="infra-main-chart"></canvas>
        </div>
      </div>
    `;
  }

  // ── 2. Power Infrastructure Tab (Steps 5 - 10, 21) ──
  function renderPowerTab(data) {
    return `
      <!-- Station Power Consumption Readout (Step 7) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>STATION POWER CONSUMPTION</span>
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">
            Available Capacity = Generation - Consumption
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px; text-align:center; font-family:var(--font-mono, monospace); margin-bottom:14px;">
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">GENERATION</div>
            <div style="font-size:19px; font-weight:800; color:#38bdf8; margin-top:2px;">${data.totalGenerationKw} kW</div>
            <div style="font-size:9px; color:#64748b;">All active units</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">CONSUMPTION</div>
            <div style="font-size:19px; font-weight:800; color:#fbbf24; margin-top:2px;">${data.totalConsumptionKw} kW</div>
            <div style="font-size:9px; color:#64748b;">Instantaneous demand</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid ${data.availableCapacityKw < 15 ? '#ef4444' : '#1e293b'};">
            <div style="font-size:9.5px; color:#94a3b8;">AVAILABLE CAPACITY</div>
            <div style="font-size:19px; font-weight:800; color:${data.availableCapacityKw < 15 ? '#ef4444' : '#34d399'}; margin-top:2px;">
              ${data.availableCapacityKw} kW
            </div>
            <div style="font-size:9px; color:#64748b;">Reserve margin</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">PEAK TODAY</div>
            <div style="font-size:19px; font-weight:800; color:#e2e8f0; margin-top:2px;">${data.peakLoadTodayKw} kW</div>
            <div style="font-size:9px; color:#64748b;">14:30 UTC peak</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">AVERAGE TODAY</div>
            <div style="font-size:19px; font-weight:800; color:#cbd5e1; margin-top:2px;">${data.averageLoadTodayKw} kW</div>
            <div style="font-size:9px; color:#64748b;">Running 24h avg</div>
          </div>
        </div>

        <!-- Step 9: kW vs kWh -->
        <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:12px; font-family:var(--font-mono, monospace); font-size:11.5px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div>
            <span style="color:#94a3b8;">Current Power:</span>
            <strong style="color:#fbbf24; margin-left:6px;">${data.totalConsumptionKw} kW</strong>
          </div>
          <div>
            <span style="color:#94a3b8;">Energy Today:</span>
            <strong style="color:#38bdf8; margin-left:6px;">${data.stationEnergyTodayKwh} kWh</strong>
          </div>
          <div>
            <span style="color:#94a3b8;">Energy This Week:</span>
            <strong style="color:#10b981; margin-left:6px;">${data.stationEnergyThisWeekKwh} kWh</strong>
          </div>
        </div>
      </div>

      <!-- Power Consumption by System (Step 8) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee;">
            POWER CONSUMPTION BY SYSTEM (SUM = ${data.totalConsumptionKw} kW)
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">TOTAL = SUM(ALL ACTIVE SYSTEM LOADS)</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
          ${data.systemLoads.map(load => `
            <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:10px 12px; font-family:var(--font-mono, monospace);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="color:#e2e8f0; font-size:11.5px; font-weight:700;">${load.name}</span>
                <strong style="color:${load.color}; font-size:13px;">${load.powerKw} kW</strong>
              </div>
              <div style="width:100%; height:5px; background:#1e293b; border-radius:3px; overflow:hidden;">
                <div style="width:${load.percent}%; height:100%; background:${load.color};"></div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:9.5px; color:#64748b; margin-top:4px;">
                <span>Share of Grid</span>
                <span>${load.percent}%</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Generator System Cards (Step 5 & 30: InfrastructureAssetCard) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee;">
            GENERATOR INFRASTRUCTURE ASSETS (CLICK FOR DETAIL PANEL)
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">
            415V 50Hz DIESEL & CO-GEN ARRAY
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
          ${data.generators.map(gen => renderGeneratorAssetCard(gen)).join('')}
        </div>
      </div>

      <!-- Fuel Management & Consumption (Step 21) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#f59e0b; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/><path d="M7 10V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><line x1="3" y1="22" x2="19" y2="22"/></svg>
            <span>FUEL STORAGE & DIESEL CONSUMPTION</span>
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">
            ${data.fuelSystem.fuelType}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px; text-align:center; font-family:var(--font-mono, monospace);">
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">FUEL LEVEL</div>
            <div style="font-size:18px; font-weight:800; color:#38bdf8; margin-top:2px;">${data.fuelSystem.levelPercent}%</div>
            <div style="font-size:9px; color:#64748b;">${data.fuelSystem.currentLiters.toLocaleString()} / ${data.fuelSystem.capacityLiters.toLocaleString()} L</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">CURRENT BURN</div>
            <div style="font-size:18px; font-weight:800; color:#fbbf24; margin-top:2px;">${data.fuelSystem.currentFuelConsumptionLph} L/h</div>
            <div style="font-size:9px; color:#64748b;">Instantaneous burn</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">DAILY CONSUMPTION</div>
            <div style="font-size:18px; font-weight:800; color:#cbd5e1; margin-top:2px;">${data.fuelSystem.dailyFuelConsumptionLpd} L/day</div>
            <div style="font-size:9px; color:#64748b;">24h projected</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">GENERATOR OUTPUT</div>
            <div style="font-size:18px; font-weight:800; color:#10b981; margin-top:2px;">${data.totalGenerationKw} kW</div>
            <div style="font-size:9px; color:#64748b;">Total generator load</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">FUEL RESERVE</div>
            <div style="font-size:18px; font-weight:800; color:#34d399; margin-top:2px;">${data.fuelSystem.fuelReserveDaysRemaining} Days</div>
            <div style="font-size:9px; color:#64748b;">Overwintering buffer</div>
          </div>
        </div>
      </div>
    `;
  }

  // ── 3. Heating Infrastructure Tab (Steps 11 - 14) ──
  function renderHeatingTab(data) {
    return `
      <!-- Heating System Overview (Step 11) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#f59e0b; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
            <span>HEATING INFRASTRUCTURE & HYDRONIC LOOPS</span>
          </div>
          <span class="badge ${data.heatingStatus === 'NORMAL' ? 'badge-success' : 'badge-warning'}" style="font-size:9.5px; font-family:var(--font-mono, monospace);">
            ● ${data.heatingStatus}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; text-align:center; font-family:var(--font-mono, monospace); margin-bottom:12px;">
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9px; color:#94a3b8;">INDOOR TEMP</div>
            <div style="font-size:16px; font-weight:800; color:#38bdf8; margin-top:2px;">${data.indoorTempC}°C</div>
            <div style="font-size:8.5px; color:#64748b;">Target: ${data.targetIndoorTempC}°C</div>
          </div>
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9px; color:#94a3b8;">OUTDOOR TEMP</div>
            <div style="font-size:16px; font-weight:800; color:#94a3b8; margin-top:2px;">${data.outdoorTempC}°C</div>
            <div style="font-size:8.5px; color:#64748b;">Wind: ${data.environment.windSpeed} m/s</div>
          </div>
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9px; color:#94a3b8;">HEATING DEMAND</div>
            <div style="font-size:16px; font-weight:800; color:#fbbf24; margin-top:2px;">${data.heatingDemandPercent}%</div>
            <div style="font-size:8.5px; color:#64748b;">Thermal Load</div>
          </div>
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9px; color:#94a3b8;">HEATING POWER</div>
            <div style="font-size:16px; font-weight:800; color:#f59e0b; margin-top:2px;">${data.heatingPowerKw} kW</div>
            <div style="font-size:8.5px; color:#64748b;">Instantaneous</div>
          </div>
          <div style="background:#070d19; padding:8px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9px; color:#94a3b8;">ENERGY TODAY</div>
            <div style="font-size:16px; font-weight:800; color:#34d399; margin-top:2px;">${data.heatingEnergyTodayKwh} kWh</div>
            <div style="font-size:8.5px; color:#64748b;">Week: ${data.heatingEnergyThisWeekKwh} kWh</div>
          </div>
        </div>
      </div>

      <!-- Configurable Heating Zones (Step 12 & 13) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee;">
            STATION HEATING ZONES (SUM = ${data.heatingPowerKw} kW)
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">PROGRAMMATIC ZONE SUM</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
          ${data.heatingZones.map(zone => `
            <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:12px; font-family:var(--font-mono, monospace);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-weight:700; color:#e2e8f0; font-size:11.5px;">${zone.name}</span>
                <span class="badge ${zone.status === 'NORMAL' ? 'badge-success' : 'badge-warning'}" style="font-size:8.5px;">${zone.status}</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:10.5px; margin-bottom:8px;">
                <div><span style="color:#94a3b8;">Current:</span> <strong style="color:#38bdf8;">${zone.currentTemp}°C</strong></div>
                <div><span style="color:#94a3b8;">Target:</span> <strong style="color:#fbbf24;">${zone.targetTemp}°C</strong></div>
                <div><span style="color:#94a3b8;">Diff:</span> <strong style="color:${zone.temperatureDifference > 0 ? '#f87171' : '#34d399'};">${zone.temperatureDifference > 0 ? '+' : ''}${zone.temperatureDifference}°C</strong></div>
                <div><span style="color:#94a3b8;">Demand:</span> <strong>${zone.heatingDemand}%</strong></div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #1e293b; padding-top:6px; font-size:11px;">
                <span style="color:#94a3b8;">Power:</span>
                <strong style="color:#f59e0b;">${zone.powerConsumptionKw} kW</strong>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Outdoor Weather -> Heating Demand Coupled Model (Step 14) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4-4"/></svg>
            <span>OUTDOOR WEATHER → HEATING DEMAND COUPLING</span>
          </div>
          <span class="badge" style="font-size:9.5px; background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid #f59e0b; font-family:var(--font-mono, monospace);">
            MODEL ESTIMATE
          </span>
        </div>

        <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:12px; margin-bottom:12px;">
          <div style="font-size:11px; font-weight:700; color:#cbd5e1; margin-bottom:8px;">
            Interactive Weather Perturbation Simulator (Test Heat Loss Dynamics)
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; font-size:11px; font-family:var(--font-mono, monospace);">
            <div>
              <div style="display:flex; justify-content:space-between; color:#94a3b8; margin-bottom:4px;">
                <span>Outdoor Air Temperature</span>
                <strong style="color:#38bdf8;" id="label-outdoor-temp">${data.environment.outdoorTemp}°C</strong>
              </div>
              <input type="range" id="slider-outdoor-temp" min="-45" max="-5" value="${data.environment.outdoorTemp}" step="0.5" style="width:100%; cursor:pointer;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; color:#94a3b8; margin-bottom:4px;">
                <span>Katabatic Wind Speed</span>
                <strong style="color:#38bdf8;" id="label-wind-speed">${data.environment.windSpeed} m/s</strong>
              </div>
              <input type="range" id="slider-wind-speed" min="0" max="65" value="${data.environment.windSpeed}" step="1" style="width:100%; cursor:pointer;" />
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; font-family:var(--font-mono, monospace); font-size:11px;">
          <div style="background:#070d19; padding:8px 10px; border-radius:4px; border:1px solid #1e293b;">
            <span style="color:#94a3b8;">Coupled Heat Loss Factor:</span>
            <strong style="color:#fbbf24; margin-left:6px;">${data.modelEstimateHeatLossFactor}x</strong>
          </div>
          <div style="background:#070d19; padding:8px 10px; border-radius:4px; border:1px solid #1e293b;">
            <span style="color:#94a3b8;">Predicted 6h Demand:</span>
            <strong style="color:#f59e0b; margin-left:6px;">${data.predictedHeatingDemandKw} kW</strong>
          </div>
          <div style="background:#070d19; padding:8px 10px; border-radius:4px; border:1px solid #1e293b;">
            <span style="color:#94a3b8;">Fuel Burn Effect:</span>
            <strong style="color:#38bdf8; margin-left:6px;">+${Math.round((data.predictedHeatingDemandKw - data.heatingPowerKw) * 0.235 * 10) / 10} L/h</strong>
          </div>
        </div>
      </div>
    `;
  }

  // ── 4. Water Infrastructure Tab (Steps 15 - 20) ──
  function renderWaterTab(data) {
    const ws = data.waterSystem;
    return `
      <!-- Water Intake & Pumping (Steps 15 & 16) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#06b6d4; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
            <span>WATER INTAKE & LIFT PUMPS</span>
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">
            Source: ${ws.intakeSource}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-bottom:14px;">
          ${ws.pumps.map(pump => `
            <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:12px; font-family:var(--font-mono, monospace);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div>
                  <strong style="color:#e2e8f0; font-size:12px;">${pump.id}</strong>
                  <div style="font-size:10px; color:#94a3b8;">${pump.name}</div>
                </div>
                <div style="text-align:right;">
                  <span class="badge ${pump.status === 'ONLINE' ? 'badge-success' : pump.status === 'STARTING' ? 'badge-warning' : pump.status === 'FAULT' ? 'badge-danger' : 'badge-neutral'}" style="font-size:9px;">
                    ● ${pump.status}
                  </span>
                  <div style="font-size:9px; color:#64748b; margin-top:2px;">${pump.role}</div>
                </div>
              </div>

              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; font-size:10.5px; text-align:center; background:#0b1324; padding:8px; border-radius:4px;">
                <div>
                  <div style="color:#64748b; font-size:8.5px;">FLOW RATE</div>
                  <strong style="color:#38bdf8;">${pump.flowLpm} L/min</strong>
                </div>
                <div>
                  <div style="color:#64748b; font-size:8.5px;">PRESSURE</div>
                  <strong style="color:#fbbf24;">${pump.pressureBar} bar</strong>
                </div>
                <div>
                  <div style="color:#64748b; font-size:8.5px;">POWER</div>
                  <strong style="color:#f59e0b;">${pump.status === 'ONLINE' ? pump.powerKw : 0} kW</strong>
                </div>
              </div>

              <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8; margin-top:8px;">
                <span>Motor Load: ${pump.motorLoadPercent}%</span>
                <span>Runtime: ${pump.runtimeHours} h</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:10px 12px; font-family:var(--font-mono, monospace); font-size:11px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <div><span>Sub-Surface Intake Temp:</span> <strong style="color:#38bdf8;">${ws.intakeTempC}°C</strong></div>
          <div><span>Trace Heating Active:</span> <strong style="color:#34d399;">${ws.traceHeatingKw} kW Active</strong></div>
          <div><span>Intake Line Status:</span> <strong style="color:#10b981;">NO FRAZIL ICE OCCLUSION</strong></div>
        </div>
      </div>

      <!-- Water Filtration & Treatment (Step 17) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee;">
            WATER TREATMENT & PURIFICATION
          </div>
          <span class="badge ${ws.filtration.status === 'NORMAL' ? 'badge-success' : 'badge-warning'}" style="font-size:9.5px; font-family:var(--font-mono, monospace);">
            ● ${ws.filtration.treatmentStatus}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px; text-align:center; font-family:var(--font-mono, monospace);">
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">INPUT FLOW</div>
            <div style="font-size:17px; font-weight:800; color:#38bdf8; margin-top:2px;">${ws.filtration.inputFlowLpm} L/min</div>
            <div style="font-size:9px; color:#64748b;">Raw intake feed</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">OUTPUT FLOW</div>
            <div style="font-size:17px; font-weight:800; color:#10b981; margin-top:2px;">${ws.filtration.outputFlowLpm} L/min</div>
            <div style="font-size:9px; color:#64748b;">Permeate to tank</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#94a3b8;">PRESSURE</div>
            <div style="font-size:17px; font-weight:800; color:#fbbf24; margin-top:2px;">${ws.filtration.pressureBar} bar</div>
            <div style="font-size:9px; color:#64748b;">Operating pressure</div>
          </div>
          <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid ${ws.filtration.differentialPressureBar > 1.8 ? '#ef4444' : '#1e293b'};">
            <div style="font-size:9.5px; color:#94a3b8;">DIFF PRESSURE</div>
            <div style="font-size:17px; font-weight:800; color:${ws.filtration.differentialPressureBar > 1.8 ? '#ef4444' : '#34d399'}; margin-top:2px;">
              ${ws.filtration.differentialPressureBar} bar
            </div>
            <div style="font-size:9px; color:#64748b;">${ws.filtration.filterCondition}</div>
          </div>
        </div>
      </div>

      <!-- Fresh Water Storage Tank & Consumption (Step 18, 19, 20) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#06b6d4;">
            FRESH WATER TANK & STATION POWER COUPLING
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">
            Water Power: ${ws.totalWaterSystemPowerKw} kW Connected to Station Grid
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-family:var(--font-mono, monospace);">
          <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="color:#94a3b8; font-size:11px;">Current Tank Level:</span>
              <strong style="color:#06b6d4; font-size:14px;">${ws.freshWaterStorage.levelPercent}%</strong>
            </div>
            <div style="width:100%; height:12px; background:#1e293b; border-radius:6px; overflow:hidden; margin-bottom:8px;">
              <div style="width:${ws.freshWaterStorage.levelPercent}% ; height:100%; background:linear-gradient(90deg, #0284c7, #06b6d4);"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; color:#64748b;">
              <span>Current: ${ws.freshWaterStorage.currentLiters.toLocaleString()} L</span>
              <span>Capacity: ${ws.freshWaterStorage.capacityLiters.toLocaleString()} L</span>
            </div>
          </div>

          <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:12px; font-size:11px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:#94a3b8;">Inflow:</span>
              <strong style="color:#34d399;">${ws.freshWaterStorage.inflowLpm} L/min</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:#94a3b8;">Outflow:</span>
              <strong style="color:#fbbf24;">${ws.freshWaterStorage.outflowLpm} L/min</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:#94a3b8;">Daily Consumption:</span>
              <strong style="color:#e2e8f0;">${ws.freshWaterStorage.dailyConsumptionLiters.toLocaleString()} L/day</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-top:1px solid #1e293b; padding-top:4px;">
              <span style="color:#94a3b8;">Estimated Reserve:</span>
              <strong style="color:#38bdf8;">${ws.freshWaterStorage.reserveDaysRemaining} Days</strong>
            </div>
          </div>

          <!-- Step 20: Water System Energy -->
          <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:12px; font-size:11px;">
            <div style="font-weight:700; color:#f59e0b; margin-bottom:6px;">WATER SYSTEM ENERGY (${ws.totalWaterSystemPowerKw} kW)</div>
            <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:10.5px; margin-bottom:2px;">
              <span>Pumps:</span>
              <strong style="color:#e2e8f0;">${ws.pumpsPowerKw} kW</strong>
            </div>
            <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:10.5px; margin-bottom:2px;">
              <span>Filtration:</span>
              <strong style="color:#e2e8f0;">${ws.filtrationPowerKw} kW</strong>
            </div>
            <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:10.5px; margin-bottom:2px;">
              <span>Treatment:</span>
              <strong style="color:#e2e8f0;">${ws.treatmentPowerKw} kW</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── 5. Infrastructure Dependencies Tab (Step 22) ──
  function renderDependenciesTab(data) {
    return `
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M6 9v6"/><path d="M9 18h6"/></svg>
            <span>INFRASTRUCTURE DEPENDENCY MAP</span>
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">CLICK NODE TO OPEN ASSET DETAILS</span>
        </div>

        <div style="background:#070d19; border:1px solid #1e293b; border-radius:6px; padding:16px; font-family:var(--font-mono, monospace); font-size:11px;">
          <div style="display:flex; flex-direction:column; align-items:center;">
            <!-- Level 1: Fuel -->
            <div class="dep-tree-node" data-node="fuel" style="padding:6px 16px; border-radius:6px; background:#1e293b; border:1px solid #fbbf24; color:#fbbf24; cursor:pointer; font-weight:700;">
              FUEL STORAGE (${data.fuelSystem.currentLiters.toLocaleString()} L ATF-50)
            </div>
            <div style="color:#64748b; margin:4px 0;">↓</div>

            <!-- Level 2: Generators -->
            <div class="dep-tree-node" data-node="generators" style="padding:6px 16px; border-radius:6px; background:#1e293b; border:1px solid #38bdf8; color:#38bdf8; cursor:pointer; font-weight:700;">
              GENERATOR ARRAY (${data.totalGenerationKw} kW Active)
            </div>
            <div style="color:#64748b; margin:4px 0;">↓</div>

            <!-- Level 3: Power Bus -->
            <div class="dep-tree-node" data-node="bus" style="padding:6px 20px; border-radius:6px; background:#0e7490; border:1px solid #22d3ee; color:#fff; cursor:pointer; font-weight:800;">
              415V MAIN POWER BUS (${data.totalConsumptionKw} kW Load)
            </div>
          </div>

          <!-- Level 4: Downstream Distribution -->
          <div style="margin-top:14px; display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; text-align:center;">
            <!-- Branch A: Heating -->
            <div style="display:flex; flex-direction:column; align-items:center;">
              <div style="color:#64748b;">↓</div>
              <div class="dep-tree-node" data-node="heating" style="width:100%; padding:6px; border-radius:4px; background:#1e293b; border:1px solid #f59e0b; color:#f59e0b; cursor:pointer;">
                HEATING (${data.heatingPowerKw} kW)
              </div>
              <div style="color:#64748b; margin:4px 0;">↓</div>
              <div class="dep-tree-node" data-node="buildings" style="width:100%; padding:4px; border-radius:4px; background:#0b1324; border:1px solid #334155; color:#cbd5e1; font-size:10px; cursor:pointer;">
                STATION MODULES (7 ZONES)
              </div>
              <div style="color:#64748b; margin:4px 0;">↓</div>
              <div style="width:100%; padding:4px; border-radius:4px; background:#0b1324; border:1px solid #334155; color:#94a3b8; font-size:9.5px;">
                HOT WATER & LIFE SUPPORT
              </div>
            </div>

            <!-- Branch B: Water -->
            <div style="display:flex; flex-direction:column; align-items:center;">
              <div style="color:#64748b;">↓</div>
              <div class="dep-tree-node" data-node="water" style="width:100%; padding:6px; border-radius:4px; background:#1e293b; border:1px solid #06b6d4; color:#06b6d4; cursor:pointer;">
                WATER INFRASTRUCTURE (${data.waterSystem.totalWaterSystemPowerKw} kW)
              </div>
              <div style="color:#64748b; margin:4px 0;">↓</div>
              <div class="dep-tree-node" data-node="pumps" style="width:100%; padding:4px; border-radius:4px; background:#0b1324; border:1px solid #334155; color:#cbd5e1; font-size:10px; cursor:pointer;">
                LIFT PUMPS (${data.waterSystem.pumpsPowerKw} kW)
              </div>
              <div style="color:#64748b; margin:4px 0;">↓</div>
              <div class="dep-tree-node" data-node="filtration" style="width:100%; padding:4px; border-radius:4px; background:#0b1324; border:1px solid #334155; color:#cbd5e1; font-size:10px; cursor:pointer;">
                FILTRATION & TREATMENT
              </div>
              <div style="color:#64748b; margin:4px 0;">↓</div>
              <div class="dep-tree-node" data-node="tank" style="width:100%; padding:4px; border-radius:4px; background:#0b1324; border:1px solid #10b981; color:#10b981; font-size:9.5px; cursor:pointer;">
                FRESH WATER TANK (${data.waterSystem.freshWaterStorage.levelPercent}%)
              </div>
            </div>

            <!-- Branch C: Laboratories & Operations -->
            <div style="display:flex; flex-direction:column; align-items:center;">
              <div style="color:#64748b;">↓</div>
              <div class="dep-tree-node" data-node="labs" style="width:100%; padding:6px; border-radius:4px; background:#1e293b; border:1px solid #38bdf8; color:#38bdf8; cursor:pointer;">
                LABORATORIES & OPERATIONS (58 kW)
              </div>
              <div style="color:#64748b; margin:4px 0;">↓</div>
              <div style="width:100%; padding:4px; border-radius:4px; background:#0b1324; border:1px solid #334155; color:#cbd5e1; font-size:10px;">
                ATMOSPHERIC & GLACIOLOGY CORE
              </div>
              <div style="color:#64748b; margin:4px 0;">↓</div>
              <div style="width:100%; padding:4px; border-radius:4px; background:#0b1324; border:1px solid #334155; color:#94a3b8; font-size:9.5px;">
                SATELLITE & HF COMMS DOCK
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── 6. Maintenance Registry Tab (Step 29 & 30) ──
  function renderMaintenanceTab(data) {
    return `
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee;">
            INFRASTRUCTURE ASSET MAINTENANCE REGISTRY
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">
            ANTARCTIC PREVENTATIVE MAINTENANCE INTERVAL PROTOCOLS
          </span>
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-family:var(--font-mono, monospace); font-size:11px; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid #334155; color:#94a3b8; font-size:10px; text-transform:uppercase;">
                <th style="padding:8px;">Asset ID</th>
                <th style="padding:8px;">Asset Name</th>
                <th style="padding:8px;">Category</th>
                <th style="padding:8px;">Location</th>
                <th style="padding:8px;">Status</th>
                <th style="padding:8px;">Last Maint</th>
                <th style="padding:8px;">Next Maint</th>
                <th style="padding:8px;">Hours</th>
                <th style="padding:8px;">Condition</th>
              </tr>
            </thead>
            <tbody>
              ${data.allAssets.map(asset => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.1s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                  <td style="padding:8px; font-weight:700; color:#38bdf8;">${asset.id}</td>
                  <td style="padding:8px; color:#e2e8f0;">${asset.name}</td>
                  <td style="padding:8px; color:#94a3b8;">${asset.category}</td>
                  <td style="padding:8px; color:#cbd5e1;">${asset.location || 'Central Utility'}</td>
                  <td style="padding:8px;">
                    <span class="badge ${asset.status === 'ONLINE' || asset.status === 'NORMAL' ? 'badge-success' : asset.status === 'STANDBY' ? 'badge-neutral' : 'badge-danger'}" style="font-size:8.5px;">
                      ● ${asset.status || 'NORMAL'}
                    </span>
                  </td>
                  <td style="padding:8px; color:#94a3b8;">${asset.lastMaintenance || '2026-07-15'}</td>
                  <td style="padding:8px; color:#38bdf8;">${asset.nextMaintenance || '2026-10-15'}</td>
                  <td style="padding:8px; color:#cbd5e1;">${asset.runtimeHours ? asset.runtimeHours + ' h' : '—'}</td>
                  <td style="padding:8px;">
                    <span style="color:${asset.maintenanceStatus === 'GOOD' ? '#10b981' : '#f59e0b'}; font-weight:700;">
                      ${asset.maintenanceStatus || 'GOOD'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ── 7. Failure / What-If Simulation Tab (Steps 23 - 28) ──
  function renderSimulationTab(data) {
    const scenarios = [
      { id: 'NORMAL', title: 'Baseline Normal', desc: 'All station microgrids and life support systems in nominal state' },
      { id: 'GEN_FAILURE', title: 'Generator GEN-01 Trip', desc: 'Sudden loss of 82 kW generation capacity; tests automated load shedding' },
      { id: 'PUMP_FAILURE', title: 'Water Pump PUMP-W01 Fault', desc: 'Primary lift pump trip; tests automated failover to PUMP-W02' },
      { id: 'EXTREME_COLD', title: 'Extreme Cold & Gale Surge', desc: 'Ambient drop to -25°C with 35 m/s wind; surges heating power by +14 kW' },
      { id: 'HEATING_FAILURE', title: 'Heating Unit HEAT-01 Bypass', desc: 'Plate heat exchanger offline; indoor temperatures begin decay' },
      { id: 'LOW_FUEL', title: 'Low Fuel Emergency', desc: 'ATF-50 bunker reserves drop to 14%; triggers conservation protocols' },
      { id: 'LOW_WATER', title: 'Low Fresh Water Reserve', desc: 'Fresh water storage drops to 18%; station initiates rationing' },
      { id: 'FILTRATION_FAILURE', title: 'Water Filtration Pressure Spike', desc: 'Differential pressure surges to 2.4 bar; filter service required' }
    ];

    return `
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#ef4444; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>WHAT-IF & FAILURE CASCADE SIMULATION</span>
          </div>
          <span class="badge badge-warning" style="font-size:9.5px; font-family:var(--font-mono, monospace);">
            DEMO / SIMULATION MODE
          </span>
        </div>

        <div style="font-size:11px; color:#94a3b8; margin-bottom:12px;">
          Simulate station cascading faults to verify autonomous protection loops and decision-support guidance.
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-bottom:16px;">
          ${scenarios.map(sc => `
            <div class="btn-select-scenario" data-scenario="${sc.id}" style="background:${data.activeScenario === sc.id ? 'rgba(239,68,68,0.15)' : '#070d19'}; border:1px solid ${data.activeScenario === sc.id ? '#ef4444' : '#1e293b'}; border-radius:6px; padding:12px; cursor:pointer; transition:all 0.15s ease-out;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="color:${data.activeScenario === sc.id ? '#ef4444' : '#e2e8f0'}; font-size:11.5px;">${sc.title}</strong>
                ${data.activeScenario === sc.id ? '<span style="font-size:10px; color:#ef4444; font-weight:800;">ACTIVE</span>' : ''}
              </div>
              <p style="margin:0; font-size:10.5px; color:#94a3b8; line-height:1.4;">${sc.desc}</p>
            </div>
          `).join('')}
        </div>

        <!-- Scenario Comparison Panel (Step 24 & 26) -->
        ${data.isSimulationActive ? `
          <div style="background:#070d19; border:1px solid #ef4444; border-radius:6px; padding:14px; font-family:var(--font-mono, monospace); font-size:11.5px;">
            <div style="font-weight:800; color:#ef4444; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>CASCADE IMPACT ANALYSIS // BASELINE vs SCENARIO</span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-bottom:12px;">
              <div style="background:#0b1324; padding:8px 10px; border-radius:4px; border:1px solid #1e293b;">
                <div style="font-size:9.5px; color:#94a3b8;">GENERATION</div>
                <div style="font-size:15px; font-weight:800; color:#ef4444;">${data.totalGenerationKw} kW</div>
                <div style="font-size:9px; color:#64748b;">Baseline: 185 kW (Deficit: ${data.availableCapacityKw} kW)</div>
              </div>

              <div style="background:#0b1324; padding:8px 10px; border-radius:4px; border:1px solid #1e293b;">
                <div style="font-size:9.5px; color:#94a3b8;">HEATING IMPACT</div>
                <div style="font-size:15px; font-weight:800; color:#f59e0b;">${data.heatingStatus}</div>
                <div style="font-size:9px; color:#64748b;">Load shed on Priority 4 & 5</div>
              </div>

              <div style="background:#0b1324; padding:8px 10px; border-radius:4px; border:1px solid #1e293b;">
                <div style="font-size:9.5px; color:#94a3b8;">WATER STATUS</div>
                <div style="font-size:15px; font-weight:800; color:#38bdf8;">${data.waterSystem.intakeStatus}</div>
                <div style="font-size:9px; color:#64748b;">Tank Level: ${data.waterSystem.freshWaterStorage.levelPercent}%</div>
              </div>
            </div>

            <div style="font-size:10.5px; color:#cbd5e1; line-height:1.5;">
              <strong>System Impact Report:</strong> Digital Twin decision-support advises keeping living quarters sealed. Non-critical workshop heating has been automatically throttled to retain core operational margin.
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Configurable Thresholds Configuration (Step 27 & 28) -->
      <div class="card" style="background:#0b1324; border:1px solid #1e293b; border-radius:8px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#22d3ee;">
            CONFIGURABLE ALERT THRESHOLDS
          </div>
          <span style="font-size:10px; font-family:var(--font-mono, monospace); color:#94a3b8;">OPERATIONAL ENGINEERING LIMITS</span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-family:var(--font-mono, monospace); font-size:11px;">
          <div style="background:#070d19; padding:12px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-weight:700; color:#38bdf8; margin-bottom:8px;">LOW POWER RESERVE THRESHOLDS (%)</div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#94a3b8;">Caution Threshold:</span>
                <input type="number" class="input-threshold" data-type="powerReserve" data-key="caution" value="${data.alertThresholds.powerReserve.caution}" style="width:60px; padding:2px 6px; background:#0b1324; border:1px solid #334155; color:#fbbf24; border-radius:4px;" />
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#94a3b8;">Warning Threshold:</span>
                <input type="number" class="input-threshold" data-type="powerReserve" data-key="warning" value="${data.alertThresholds.powerReserve.warning}" style="width:60px; padding:2px 6px; background:#0b1324; border:1px solid #334155; color:#ef4444; border-radius:4px;" />
              </div>
            </div>
          </div>

          <div style="background:#070d19; padding:12px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-weight:700; color:#06b6d4; margin-bottom:8px;">LOW WATER LEVEL THRESHOLDS (%)</div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#94a3b8;">Caution Threshold:</span>
                <input type="number" class="input-threshold" data-type="waterLevel" data-key="caution" value="${data.alertThresholds.waterLevel.caution}" style="width:60px; padding:2px 6px; background:#0b1324; border:1px solid #334155; color:#fbbf24; border-radius:4px;" />
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#94a3b8;">Warning Threshold:</span>
                <input type="number" class="input-threshold" data-type="waterLevel" data-key="warning" value="${data.alertThresholds.waterLevel.warning}" style="width:60px; padding:2px 6px; background:#0b1324; border:1px solid #334155; color:#ef4444; border-radius:4px;" />
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Step 30: Common Component: InfrastructureAssetCard ──
  function renderGeneratorAssetCard(gen) {
    const isOnline = gen.status === 'ONLINE';
    const isFault = gen.status === 'FAULT';

    return `
      <div class="card btn-open-gen-detail" data-gen-id="${gen.id}" style="background:#070d19; border:1px solid ${isFault ? '#ef4444' : '#1e293b'}; border-radius:6px; padding:12px; cursor:pointer; font-family:var(--font-mono, monospace); transition:all 0.15s ease-out;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div>
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="color:#38bdf8; font-size:12.5px;">${gen.id}</strong>
              <span style="font-size:9.5px; color:#64748b;">(${gen.type})</span>
            </div>
            <div style="font-size:10px; color:#cbd5e1; margin-top:1px;">${gen.name}</div>
          </div>
          <span class="badge ${isOnline ? 'badge-success' : isFault ? 'badge-danger' : 'badge-neutral'}" style="font-size:8.5px;">
            ● ${gen.status}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:10px; margin-bottom:8px;">
          <div><span style="color:#64748b;">OUTPUT:</span> <strong style="color:#38bdf8;">${gen.outputKw} kW</strong></div>
          <div><span style="color:#64748b;">LOAD:</span> <strong>${gen.loadPercent}%</strong></div>
          <div><span style="color:#64748b;">TEMP:</span> <strong>${gen.engineTemp}°C</strong></div>
          <div><span style="color:#64748b;">FUEL:</span> <strong>${gen.fuelLevelPercent}%</strong></div>
          <div><span style="color:#64748b;">VOLTAGE:</span> <strong>${gen.voltage} V</strong></div>
          <div><span style="color:#64748b;">FREQ:</span> <strong>${gen.freq} Hz</strong></div>
        </div>

        <div style="display:flex; justify-content:space-between; border-top:1px solid #1e293b; padding-top:6px; font-size:9.5px; color:#94a3b8;">
          <span>Runtime: ${gen.runtimeHours} h</span>
          <span style="color:#38bdf8; font-weight:700;">Inspect Telemetry ➔</span>
        </div>
      </div>
    `;
  }

  // ── Step 6: Generator Detail Panel Modal (Tabs: Overview, Telemetry, Energy, Maintenance, Dependencies, Alerts, History) ──
  function renderGeneratorDetailModal(data) {
    const gen = data.generators.find(g => g.id === data.selectedGeneratorId) || data.generators[0];
    if (!gen) return '';

    return `
      <div id="modal-gen-detail-backdrop" style="position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.85); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:16px;">
        <div style="background:#0b1324; border:1px solid #22d3ee; border-radius:10px; width:100%; max-width:680px; padding:20px; box-shadow:0 20px 60px rgba(0,0,0,0.95); font-family:var(--font-sans, sans-serif); max-height:90vh; overflow-y:auto;">
          
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1e293b; padding-bottom:12px; margin-bottom:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h3 style="margin:0; font-size:16px; font-weight:800; color:#38bdf8;">
                  ${gen.id} — ${gen.name}
                </h3>
                <span class="badge ${gen.status === 'ONLINE' ? 'badge-success' : 'badge-neutral'}" style="font-size:9px;">
                  ● ${gen.status}
                </span>
              </div>
              <div style="font-size:11px; color:#94a3b8; font-family:var(--font-mono, monospace); margin-top:2px;">
                Location: ${gen.location} • Type: ${gen.type}
              </div>
            </div>
            <button id="btn-close-gen-detail" style="background:transparent; border:none; color:#cbd5e1; font-size:18px; cursor:pointer;">✕</button>
          </div>

          <!-- Generator Tabs -->
          <div style="display:flex; gap:4px; border-bottom:1px solid #1e293b; padding-bottom:8px; margin-bottom:14px; overflow-x:auto;">
            ${['overview', 'telemetry', 'energy', 'maintenance', 'dependencies', 'alerts', 'history'].map(tabId => `
              <button class="btn-gen-tab ${activeGenModalTab === tabId ? 'active' : ''}" data-gen-tab="${tabId}" style="padding:4px 10px; font-size:11px; border-radius:4px; border:1px solid ${activeGenModalTab === tabId ? '#22d3ee' : '#1e293b'}; background:${activeGenModalTab === tabId ? 'rgba(34,211,238,0.15)' : '#070d19'}; color:${activeGenModalTab === tabId ? '#22d3ee' : '#94a3b8'}; cursor:pointer; font-weight:700; text-transform:uppercase;">
                ${tabId}
              </button>
            `).join('')}
          </div>

          <!-- Modal Tab Content -->
          <div id="gen-modal-tab-content" style="font-family:var(--font-mono, monospace);">
            ${renderGenModalBody(gen, data)}
          </div>
        </div>
      </div>
    `;
  }

  function renderGenModalBody(gen, data) {
    switch (activeGenModalTab) {
      case 'telemetry':
        return `
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; text-align:center;">
            <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#94a3b8;">POWER OUTPUT</div>
              <div style="font-size:16px; font-weight:800; color:#38bdf8; margin-top:2px;">${gen.outputKw} kW</div>
            </div>
            <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#94a3b8;">VOLTAGE</div>
              <div style="font-size:16px; font-weight:800; color:#fbbf24; margin-top:2px;">${gen.voltage} V</div>
            </div>
            <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#94a3b8;">CURRENT</div>
              <div style="font-size:16px; font-weight:800; color:#34d399; margin-top:2px;">${gen.currentAmp} A</div>
            </div>
            <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#94a3b8;">FREQUENCY</div>
              <div style="font-size:16px; font-weight:800; color:#e2e8f0; margin-top:2px;">${gen.freq} Hz</div>
            </div>
            <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#94a3b8;">ENGINE TEMP</div>
              <div style="font-size:16px; font-weight:800; color:#f59e0b; margin-top:2px;">${gen.engineTemp}°C</div>
            </div>
            <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#94a3b8;">OIL PRESSURE</div>
              <div style="font-size:16px; font-weight:800; color:#38bdf8; margin-top:2px;">${gen.oilPressureBar} bar</div>
            </div>
          </div>
        `;
      case 'energy':
        return `
          <div style="background:#070d19; padding:12px; border-radius:6px; border:1px solid #1e293b; font-size:11px; line-height:1.6;">
            <div>Instantaneous Power: <strong style="color:#38bdf8;">${gen.outputKw} kW</strong></div>
            <div>Integrated Energy Today: <strong style="color:#10b981;">${Math.round(gen.outputKw * 24)} kWh</strong></div>
            <div>Specific Fuel Consumption: <strong style="color:#fbbf24;">0.235 L/kWh</strong></div>
            <div>Hourly Fuel Burn: <strong style="color:#f59e0b;">${gen.fuelBurnRateLph} L/h</strong></div>
          </div>
        `;
      case 'maintenance':
        return `
          <div style="background:#070d19; padding:12px; border-radius:6px; border:1px solid #1e293b; font-size:11px; line-height:1.6;">
            <div>Last Preventative Service: <strong>${gen.lastMaintenance}</strong></div>
            <div>Next Overhaul Due: <strong style="color:#38bdf8;">${gen.nextMaintenance}</strong></div>
            <div>Cumulative Running Hours: <strong>${gen.runtimeHours} h</strong></div>
            <div>Interval Threshold: <strong>${gen.maintenanceIntervalHours} h</strong></div>
            <div>Health Status: <strong style="color:#10b981;">${gen.maintenanceStatus}</strong></div>
          </div>
        `;
      case 'dependencies':
        return `
          <div style="background:#070d19; padding:12px; border-radius:6px; border:1px solid #1e293b; font-size:11px; line-height:1.6;">
            <div>Upstream Dependency: <strong style="color:#fbbf24;">Fuel Storage Bunker A (ATF-50)</strong></div>
            <div>Direct Feed: <strong style="color:#22d3ee;">415V Main Distribution Bus</strong></div>
            <div>Heat Recovery Loop: <strong style="color:#f59e0b;">CHP Exchanger Alpha (HEAT-01)</strong></div>
          </div>
        `;
      case 'alerts':
        return `
          <div style="background:#070d19; padding:12px; border-radius:6px; border:1px solid #1e293b; font-size:11px;">
            ${gen.status === 'FAULT' ? `
              <div style="color:#ef4444; font-weight:700; margin-bottom:4px;">⚠️ GENERATOR CASSETTE TRIP DETECTED</div>
              <div style="color:#fca5a5;">Excitation circuit breaker tripped. Manual inspection required before restart.</div>
            ` : `
              <div style="color:#10b981; font-weight:700;">● ZERO ACTIVE ALARMS</div>
              <div style="color:#94a3b8; margin-top:2px;">All diagnostic self-checks nominal. Vibration and bearing temps within limits.</div>
            `}
          </div>
        `;
      case 'history':
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-size:11px; color:#94a3b8;">Generator Load & Power History</div>
            <div style="display:flex; gap:4px;">
              ${['1H', '6H', '24H', '7D', '30D'].map(tf => `
                <button class="btn btn-sm btn-gen-tf ${activeGenModalTf === tf ? 'btn-primary' : 'btn-secondary'}" data-tf="${tf}" style="padding:2px 6px; font-size:9.5px;">${tf}</button>
              `).join('')}
            </div>
          </div>
          <div style="height:180px; position:relative;">
            <canvas id="gen-detail-chart"></canvas>
          </div>
        `;
      case 'overview':
      default:
        return `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:11px;">
            <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
              <div style="color:#94a3b8; font-size:10px;">OPERATING STATUS</div>
              <strong style="color:${gen.status === 'ONLINE' ? '#10b981' : '#f59e0b'}; font-size:14px;">● ${gen.status}</strong>
              <div style="color:#64748b; font-size:9.5px; margin-top:4px;">Load Factor: ${gen.loadPercent}%</div>
            </div>
            <div style="background:#070d19; padding:10px; border-radius:6px; border:1px solid #1e293b;">
              <div style="color:#94a3b8; font-size:10px;">GENERATOR CAPACITY</div>
              <strong style="color:#38bdf8; font-size:14px;">${gen.capacityKw} kW</strong>
              <div style="color:#64748b; font-size:9.5px; margin-top:4px;">Active Output: ${gen.outputKw} kW</div>
            </div>
          </div>
        `;
    }
  }

  // ── Event Handlers ──
  function bindEvents(container, data) {
    // Station Select
    const selectStation = container.querySelector('#select-infra-station');
    if (selectStation) {
      selectStation.addEventListener('change', (e) => {
        infrastructureService.setStation(e.target.value);
        render();
      });
    }

    // Quick Simulation Toggle
    const btnSimToggle = container.querySelector('#btn-quick-sim-toggle');
    if (btnSimToggle) {
      btnSimToggle.addEventListener('click', () => {
        if (data.isSimulationActive) {
          infrastructureService.setScenario('NORMAL');
        } else {
          infrastructureService.setScenario('GEN_FAILURE');
        }
        render();
      });
    }

    // Tab Navigation
    container.querySelectorAll('.btn-infra-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        infrastructureService.setActiveTab(btn.dataset.tab);
        render();
      });
    });

    // Timeframe Buttons
    container.querySelectorAll('.btn-infra-tf').forEach(btn => {
      btn.addEventListener('click', () => {
        infrastructureService.setTimeframe(btn.dataset.tf);
        render();
      });
    });

    // Generator Card Click
    container.querySelectorAll('.btn-open-gen-detail').forEach(card => {
      card.addEventListener('click', () => {
        infrastructureService.setSelectedGenerator(card.dataset.genId);
        activeGenModalTab = 'overview';
        render();
      });
    });

    // Close Generator Detail Modal
    const btnCloseModal = container.querySelector('#btn-close-gen-detail');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        infrastructureService.setSelectedGenerator(null);
        render();
      });
    }

    // Generator Modal Tabs
    container.querySelectorAll('.btn-gen-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeGenModalTab = btn.dataset.genTab;
        render();
      });
    });

    // Generator Modal History Timeframe
    container.querySelectorAll('.btn-gen-tf').forEach(btn => {
      btn.addEventListener('click', () => {
        activeGenModalTf = btn.dataset.tf;
        render();
      });
    });

    // Scenario Selection
    container.querySelectorAll('.btn-select-scenario').forEach(btn => {
      btn.addEventListener('click', () => {
        infrastructureService.setScenario(btn.dataset.scenario);
        render();
      });
    });

    // Weather Sliders
    const sliderTemp = container.querySelector('#slider-outdoor-temp');
    if (sliderTemp) {
      sliderTemp.addEventListener('input', (e) => {
        infrastructureService.setEnvironment({ outdoorTemp: parseFloat(e.target.value) });
        render();
      });
    }

    const sliderWind = container.querySelector('#slider-wind-speed');
    if (sliderWind) {
      sliderWind.addEventListener('input', (e) => {
        infrastructureService.setEnvironment({ windSpeed: parseFloat(e.target.value) });
        render();
      });
    }

    // Threshold Inputs
    container.querySelectorAll('.input-threshold').forEach(inp => {
      inp.addEventListener('change', (e) => {
        infrastructureService.setAlertThreshold(inp.dataset.type, inp.dataset.key, e.target.value);
      });
    });
  }

  // ── Charts Initialization ──
  function initCharts(data) {
    const canvas = container.querySelector('#infra-main-chart');
    if (canvas && data.history) {
      if (chartInstance) chartInstance.destroy();
      const ctx = canvas.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.history.labels,
          datasets: [
            {
              label: 'Generation Capacity (kW)',
              data: data.history.generation,
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.1
            },
            {
              label: 'Station Demand (kW)',
              data: data.history.totalPower,
              borderColor: '#fbbf24',
              backgroundColor: 'rgba(251, 191, 36, 0.12)',
              borderWidth: 2.2,
              fill: true,
              tension: 0.3
            },
            {
              label: 'Heating Power (kW)',
              data: data.history.heating,
              borderColor: '#f59e0b',
              backgroundColor: 'transparent',
              borderWidth: 1.8,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#94a3b8', font: { family: 'monospace', size: 10 } }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#64748b', font: { family: 'monospace', size: 9.5 } }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#64748b', font: { family: 'monospace', size: 9.5 } }
            }
          }
        }
      });
    }

    // Modal Chart
    const genModalCanvas = container.querySelector('#gen-detail-chart');
    if (genModalCanvas && activeGenModalTab === 'history') {
      if (genDetailChartInstance) genDetailChartInstance.destroy();
      const ctx = genModalCanvas.getContext('2d');
      genDetailChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['-55m', '-40m', '-30m', '-20m', '-10m', 'Now'],
          datasets: [{
            label: 'Load (%)',
            data: [65, 68, 72, 70, 69, 68],
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 9 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 9 } } }
          }
        }
      });
    }
  }

  render();
  return container;
}
