/**
 * Antarctic Base Spatial Digital Twin Inspection Module
 * Replicated exactly from https://www.alphaeduhub.in/
 * 
 * Supports:
 * - Interactive 3D WebGL Digital Twin for MAITRI & BHARATI Stations
 * - Procedural architectural materials, textures, and geometries
 * - Live camera-tracked 3D Hotspot POIs
 * - Dynamic 3D Azimuth Compass Rose
 * - Station Telemetry & Data Streams drawer
 * - Polar Simulation Engine & Scenario Injection drawer
 * - Station Resources & Reserves drawer
 * - Facility Detail Inspector card with active subsystem breakdown
 * - Global Search & Facility Filter (Ctrl+K)
 * - CAD Inspection Tools (Exploded View, X-Ray Mode, Section Planes, 3D Measurement)
 */

import * as THREE from 'three';
import { ThreeSceneManager } from '../services/digitalTwin/threeSceneManager.js';
import { StationModelBuilder, MAITRI_HOTSPOTS, BHARATI_HOTSPOTS } from '../services/digitalTwin/stationModels.js';

export function renderDigitalTwinView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'digital-twin-root-container';
  container.style.cssText = 'position:relative; width:100%; height:calc(100vh - var(--topbar-height, 48px)); min-height:680px; background:#070d19; overflow:hidden; font-family:var(--font-sans, "Plus Jakarta Sans", sans-serif); color:#fff; user-select:none;';

  let sceneManager = null;
  let modelBuilder = null;

  // View state
  let currentStation = 'MAITRI'; // 'MAITRI' | 'BHARATI'
  let activeTab = 'stations'; // 'stations' | 'data' | 'simulation' | 'resources'
  let isStationDropdownOpen = false;
  let isSearchModalOpen = false;
  let searchQuery = '';
  let selectedFacility = null; // Facility hotspot object
  let cameraHeading = 0; // Degrees for 3D compass
  let userRole = 'COMMANDER';
  let simSpeed = 1;
  let simRunning = true;
  let activeScenario = 'NORMAL CONDITIONS';
  let isCadToolbarOpen = false;
  let isExploded = false;
  let isXRay = false;
  let activeSectionAxis = null;
  let isMeasuring = false;
  let measuredDistance = null;

  // Clock state
  let timeString = '';
  function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    timeString = `Mon, 8 Sep 2026 ${time} IST`;
    const clockEl = container.querySelector('#twin-live-clock');
    if (clockEl) clockEl.textContent = timeString;
  }
  const clockInterval = setInterval(updateTime, 1000);
  updateTime();

  function getCurrentHotspots() {
    return currentStation === 'BHARATI' ? BHARATI_HOTSPOTS : MAITRI_HOTSPOTS;
  }

  // -------------------------------------------------------------
  // HTML SHELL CONSTRUCTION
  // -------------------------------------------------------------
  container.innerHTML = `
    <!-- 3D WebGL Canvas Layer -->
    <div id="twin-canvas-viewport" style="position:absolute; inset:0; z-index:1; cursor:grab;"></div>

    <!-- 3D Hotspot Projected Pins Layer -->
    <div id="twin-hotspots-layer" style="position:absolute; inset:0; z-index:15; pointer-events:none; overflow:hidden;"></div>

    <!-- TOP GLASS NAVIGATION BAR -->
    <header id="twin-top-header" style="position:absolute; top:0; left:0; right:0; z-index:30; padding:10px 20px; background:rgba(7, 13, 25, 0.85); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border-bottom:1px solid rgba(51, 65, 85, 0.6); display:flex; align-items:center; justify-content:space-between; gap:12px; font-size:12px;">
      
      <!-- Left: Global Search Pill -->
      <div style="position:relative; display:flex; align-items:center;">
        <div id="btn-open-search" style="display:flex; align-items:center; gap:8px; padding:6px 12px; border-radius:10px; background:rgba(15, 23, 42, 0.9); border:1px solid rgba(71, 85, 105, 0.8); color:#94a3b8; width:220px; cursor:pointer; transition:border-color 0.2s; box-shadow:inset 0 1px 3px rgba(0,0,0,0.5);">
          <svg style="width:14px; height:14px; color:#94a3b8; flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <span style="font-size:11.5px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" id="search-pill-label">Search systems, buildings...</span>
          <span style="margin-left:auto; padding:2px 5px; border-radius:4px; background:#1e293b; border:1px solid #334155; font-size:9.5px; font-family:monospace; color:#94a3b8;">Ctrl K</span>
        </div>

        <!-- Ctrl+K Search Modal Dropdown -->
        <div id="twin-search-modal" style="display:none; position:absolute; top:42px; left:0; width:320px; background:rgba(15, 23, 42, 0.96); border:1px solid rgba(34, 211, 238, 0.4); border-radius:12px; box-shadow:0 20px 40px rgba(0,0,0,0.9); padding:10px; z-index:60; backdrop-filter:blur(20px);">
          <div style="display:flex; align-items:center; justify-content:space-between; padding:2px 6px 8px 6px; border-bottom:1px solid #1e293b;">
            <input type="text" id="input-facility-search" placeholder="Type to filter station facilities..." style="width:100%; background:transparent; border:none; color:#fff; font-size:12px; outline:none;" />
            <button id="btn-close-search" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:14px; padding:2px;">✕</button>
          </div>
          <div id="search-results-list" style="max-height:220px; overflow-y:auto; padding-top:6px; display:flex; flex-direction:column; gap:3px;"></div>
        </div>
      </div>

      <!-- Center: Navigation Tabs (Stations, Data, Simulation, Resources) -->
      <nav style="display:flex; align-items:center; gap:24px; font-size:12px; font-weight:600; letter-spacing:0.3px;">
        
        <!-- Stations Selector Dropdown -->
        <div style="position:relative;">
          <button id="btn-stations-menu" style="background:transparent; border:none; color:#fff; font-weight:700; display:flex; align-items:center; gap:5px; padding-bottom:3px; border-bottom:2px solid #22d3ee; filter:drop-shadow(0 0 6px rgba(34,211,238,0.7)); cursor:pointer;">
            <span>Stations</span>
            <svg id="stations-arrow-icon" style="width:13px; height:13px; transition:transform 0.2s;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          <!-- Stations Dropdown Menu -->
          <div id="twin-stations-dropdown" style="display:none; position:absolute; top:36px; left:50%; transform:translateX(-50%); width:320px; background:rgba(15, 23, 42, 0.96); border:1px solid rgba(34, 211, 238, 0.4); border-radius:14px; box-shadow:0 24px 50px rgba(0,0,0,0.95); padding:10px; z-index:60; backdrop-filter:blur(24px);">
            <div style="padding:4px 8px 8px 8px; font-size:9.5px; font-family:monospace; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; font-weight:700; border-bottom:1px solid #1e293b;">
              Select Antarctic Station (3D Twin)
            </div>
            <div style="padding-top:6px; display:flex; flex-direction:column; gap:4px;">
              <!-- Maitri Option -->
              <button id="btn-select-maitri" style="width:100%; display:flex; align-items:center; justify-content:space-between; padding:10px; border-radius:10px; text-align:left; cursor:pointer; background:${currentStation === 'MAITRI' ? 'rgba(37, 99, 235, 0.28)' : 'transparent'}; border:${currentStation === 'MAITRI' ? '1px solid rgba(59, 130, 246, 0.6)' : '1px solid transparent'}; transition:all 0.15s;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px; font-weight:700; font-size:12px; color:#fff;">
                    <span style="font-size:14px;">🇮🇳</span>
                    <span>MAITRI STATION</span>
                    <span id="badge-maitri-active" style="display:${currentStation === 'MAITRI' ? 'inline-block' : 'none'}; padding:2px 5px; border-radius:4px; background:#2563eb; font-size:8.5px; font-weight:900; color:#fff;">ACTIVE</span>
                  </div>
                  <div style="font-size:10px; color:#94a3b8; font-family:monospace; margin-top:2px;">
                    70°45'S, 11°44'E • Schirmacher Oasis • Est. 1988
                  </div>
                </div>
              </button>

              <!-- Bharati Option -->
              <button id="btn-select-bharati" style="width:100%; display:flex; align-items:center; justify-content:space-between; padding:10px; border-radius:10px; text-align:left; cursor:pointer; background:${currentStation === 'BHARATI' ? 'rgba(8, 145, 178, 0.28)' : 'transparent'}; border:${currentStation === 'BHARATI' ? '1px solid rgba(34, 211, 238, 0.6)' : '1px solid transparent'}; transition:all 0.15s;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px; font-weight:700; font-size:12px; color:#fff;">
                    <span style="font-size:14px;">🇮🇳</span>
                    <span>BHARATI STATION</span>
                    <span id="badge-bharati-active" style="display:${currentStation === 'BHARATI' ? 'inline-block' : 'none'}; padding:2px 5px; border-radius:4px; background:#06b6d4; font-size:8.5px; font-weight:900; color:#0f172a;">ACTIVE</span>
                  </div>
                  <div style="font-size:10px; color:#94a3b8; font-family:monospace; margin-top:2px;">
                    69°24'S, 76°11'E • Larsemann Hills • 2012
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <button id="btn-nav-data" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; padding-bottom:3px; border-bottom:2px solid transparent; transition:color 0.2s;">Data</button>
        <button id="btn-nav-simulation" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; padding-bottom:3px; border-bottom:2px solid transparent; transition:color 0.2s;">Simulation</button>
        <button id="btn-nav-resources" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; padding-bottom:3px; border-bottom:2px solid transparent; transition:color 0.2s;">Resources</button>
        <button id="btn-nav-cad" style="background:transparent; border:none; color:#38bdf8; cursor:pointer; padding-bottom:3px; border-bottom:2px solid transparent; transition:color 0.2s; font-size:11px;">CAD Tools</button>
      </nav>

      <!-- Right: Weather, Live IST Clock, Role Selector & User Profile -->
      <div style="display:flex; align-items:center; gap:14px;">
        <div style="display:flex; align-items:center; gap:6px; font-family:monospace; font-size:11.5px; color:#e2e8f0;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          <span id="header-temp-val" style="font-weight:700;">-8.2°C</span>
          <span style="font-size:10.5px; color:#94a3b8;">Clear Sky</span>
        </div>

        <div id="twin-live-clock" style="font-family:monospace; font-size:11px; color:#cbd5e1;">${timeString}</div>

        <div style="display:flex; align-items:center; gap:6px; padding:5px 10px; border-radius:10px; background:#0f172a; border:1px solid rgba(71,85,105,0.8);">
          <svg style="width:13px; height:13px; color:#38bdf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <select id="select-twin-role" style="background:transparent; border:none; color:#fff; font-weight:800; font-size:11px; cursor:pointer; outline:none; text-transform:uppercase;">
            <option value="COMMANDER" style="background:#0f172a;">COMMANDER</option>
            <option value="ADMIN" style="background:#0f172a;">ADMIN</option>
            <option value="OPERATOR" style="background:#0f172a;">OPERATOR</option>
            <option value="SCIENTIST" style="background:#0f172a;">SCIENTIST</option>
            <option value="VIEWER" style="background:#0f172a;">VIEWER</option>
          </select>
        </div>

        <div style="display:flex; align-items:center; gap:8px; padding-left:8px; border-left:1px solid #1e293b;">
          <div style="width:28px; height:28px; border-radius:50%; background:#059669; color:#fff; font-weight:900; font-size:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.5);">
            B
          </div>
          <div style="display:flex; flex-direction:column; line-height:1.2;">
            <span style="font-weight:700; font-size:11.5px; color:#fff;">Bilal</span>
            <span style="font-size:9.5px; color:#34d399; display:flex; align-items:center; gap:4px;">
              <span style="width:5px; height:5px; border-radius:50%; background:#34d399; display:inline-block; animation:pulse 1.5s infinite;"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- TOP-LEFT STATION IDENTITY OVERLAY -->
    <div id="twin-station-identity" style="position:absolute; top:68px; left:24px; z-index:20; pointer-events:none; filter:drop-shadow(0 2px 8px rgba(0,0,0,0.85));">
      <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; letter-spacing:2px; color:#7dd3fc; text-transform:uppercase;">
        <span style="width:12px; height:12px; border-radius:50%; border:1.5px solid #38bdf8; display:flex; align-items:center; justify-content:center;">
          <span style="width:5px; height:5px; border-radius:50%; background:#38bdf8;"></span>
        </span>
        <span>INDIA</span>
      </div>
      <h1 id="twin-station-name" style="margin:2px 0 2px 0; font-size:32px; font-weight:900; letter-spacing:-0.5px; text-transform:uppercase; color:#fff; text-shadow:0 2px 14px rgba(0,0,0,0.9);">
        MAITRI STATION
      </h1>
      <div id="twin-station-region" style="font-size:12px; color:#cbd5e1; font-weight:500;">Queen Maud Land, East Antarctica</div>
      <div id="twin-station-coords" style="font-size:11.5px; color:#94a3b8; font-family:monospace; margin-top:2px;">
        70°45'S, 11°44'E • Elevation: ~50 m (NCPOR Profile)
      </div>
      <div style="padding-top:4px;">
        <span style="display:inline-flex; align-items:center; gap:6px; padding:2px 8px; border-radius:6px; background:rgba(6, 78, 59, 0.85); border:1px solid #10b981; color:#34d399; font-size:9.5px; font-family:monospace; font-weight:800; letter-spacing:0.5px; box-shadow:0 2px 8px rgba(0,0,0,0.5);">
          <span style="width:5px; height:5px; border-radius:50%; background:#34d399; animation:pulse 1.5s infinite;"></span>
          OPERATIONAL
        </span>
      </div>
      <div id="twin-station-quote" style="font-size:11px; color:#94a3b8; font-style:italic; font-family:serif; padding-top:4px; max-width:320px; line-height:1.3;">
        “Science beyond boundaries for a sustainable planet.”
      </div>
    </div>

    <!-- TOP-RIGHT HUD: WEATHER WIDGET & 3D COMPASS -->
    <div style="position:absolute; top:68px; right:24px; z-index:20; display:flex; flex-direction:column; align-items:flex-end; gap:12px; pointer-events:auto;">
      <!-- Local Weather Card -->
      <div style="background:rgba(15, 23, 42, 0.7); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(51, 65, 85, 0.7); border-radius:16px; padding:14px 16px; width:220px; box-shadow:0 12px 30px rgba(0,0,0,0.75);">
        <div style="display:flex; align-items:center; gap:6px; font-size:10.5px; font-weight:700; color:#7dd3fc; margin-bottom:6px;">
          <span style="width:6px; height:6px; border-radius:50%; background:#38bdf8; animation:pulse 1.5s infinite;"></span>
          <span>Local Weather</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; padding-bottom:8px; border-bottom:1px solid rgba(51, 65, 85, 0.7);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 8px rgba(251,191,36,0.6));"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          <div>
            <div id="hud-weather-temp" style="font-size:22px; font-weight:900; font-family:monospace; line-height:1;">-8.2°C</div>
            <div style="font-size:10px; color:#94a3b8; margin-top:2px;">Clear Sky</div>
          </div>
        </div>
        <div style="padding-top:8px; display:flex; flex-direction:column; gap:5px; font-size:10.5px; font-family:monospace; color:#cbd5e1;">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#94a3b8;">Wind</span>
            <span id="hud-weather-wind" style="font-weight:700;">14.6 m/s (E)</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#94a3b8;">Humidity</span>
            <span id="hud-weather-humidity" style="font-weight:700;">68%</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#94a3b8;">Visibility</span>
            <span id="hud-weather-vis" style="font-weight:700;">15 km</span>
          </div>
        </div>
      </div>

      <!-- 3D Dynamic Azimuth Compass Dial -->
      <div style="position:relative; width:48px; height:48px; border-radius:50%; background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(8px); border:1px solid rgba(71, 85, 105, 0.8); box-shadow:0 6px 16px rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center;">
        <span style="position:absolute; top:2px; font-size:8.5px; font-weight:900; color:#38bdf8; font-family:monospace;">N</span>
        <div id="twin-compass-needle" style="width:24px; height:24px; transition:transform 0.05s ease-out;">
          <svg viewBox="0 0 24 24" style="width:100%; height:100%; filter:drop-shadow(0 0 4px rgba(56,189,248,0.8));">
            <polygon points="12,2 16,14 12,11" fill="#38bdf8"></polygon>
            <polygon points="12,2 8,14 12,11" fill="#0284c7"></polygon>
            <polygon points="12,22 16,13 12,14" fill="#64748b"></polygon>
            <polygon points="12,22 8,13 12,14" fill="#475569"></polygon>
          </svg>
        </div>
      </div>
    </div>

    <!-- BOTTOM HELPER PILL -->
    <div style="position:absolute; bottom:16px; left:0; right:0; z-index:20; display:flex; justify-content:center; pointer-events:none;">
      <div style="background:rgba(7, 13, 25, 0.8); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(71, 85, 105, 0.7); border-radius:9999px; padding:8px 20px; box-shadow:0 12px 30px rgba(0,0,0,0.8); font-size:11.5px; font-weight:500; color:#cbd5e1; display:flex; align-items:center; gap:16px;">
        <div style="display:flex; align-items:center; gap:5px;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>
          <span>Click on a building to view details</span>
        </div>
        <span style="color:#475569;">•</span>
        <div style="display:flex; align-items:center; gap:5px;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
          <span>Hold and drag to rotate</span>
        </div>
        <span style="color:#475569;">•</span>
        <div style="display:flex; align-items:center; gap:5px;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Scroll to zoom</span>
        </div>
      </div>
    </div>

    <!-- FACILITY DETAIL DRAWER (SLIDE-OVER CARD) -->
    <div id="twin-facility-drawer" style="display:none; position:absolute; top:72px; right:24px; z-index:45; width:360px; background:rgba(7, 13, 25, 0.94); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(34, 211, 238, 0.5); border-radius:18px; padding:18px; box-shadow:0 16px 60px rgba(0,0,0,0.95); animation:fadeIn 0.2s ease-out;">
      <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid #1e293b;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:8px; height:8px; border-radius:50%; background:#34d399; box-shadow:0 0 8px #34d399; animation:pulse 1.5s infinite;"></span>
          <h3 id="drawer-facility-title" style="margin:0; font-size:13.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#fff;">Facility Title</h3>
        </div>
        <button id="btn-close-drawer" style="background:transparent; border:none; color:#94a3b8; font-size:16px; cursor:pointer; padding:2px 6px;">✕</button>
      </div>

      <div style="margin-top:12px; display:flex; flex-direction:column; gap:10px; font-size:11.5px;">
        <div style="display:flex; justify-content:space-between; align-items:center; font-family:monospace; font-size:10.5px;">
          <span style="color:#94a3b8;">CATEGORY</span>
          <span id="drawer-facility-category" style="padding:2px 7px; border-radius:4px; background:rgba(14, 165, 233, 0.15); border:1px solid rgba(14, 165, 233, 0.5); color:#38bdf8; font-weight:700;">SCIENCE</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-family:monospace; font-size:10.5px;">
          <span style="color:#94a3b8;">OPERATIONAL STATUS</span>
          <span id="drawer-facility-status" style="color:#34d399; font-weight:700;">OPERATIONAL</span>
        </div>

        <div id="drawer-facility-desc" style="padding:10px; border-radius:10px; background:rgba(15, 23, 42, 0.9); border:1px solid rgba(51, 65, 85, 0.7); color:#cbd5e1; line-height:1.45; font-size:11.5px;">
          Detailed technical description of this facility...
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-family:monospace; text-align:center;">
          <div style="padding:8px; border-radius:10px; background:#0f172a; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#64748b;">OPERATING TEMP</div>
            <div id="drawer-facility-temp" style="font-size:15px; font-weight:800; color:#22d3ee; margin-top:2px;">-8.2°C</div>
          </div>
          <div style="padding:8px; border-radius:10px; background:#0f172a; border:1px solid #1e293b;">
            <div style="font-size:9.5px; color:#64748b;">POWER / TELEMETRY</div>
            <div id="drawer-facility-power" style="font-size:15px; font-weight:800; color:#fbbf24; margin-top:2px;">4.8 kW</div>
          </div>
        </div>

        <div>
          <div style="font-size:9.5px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
            ACTIVE SUBSYSTEMS & ASSETS
          </div>
          <div id="drawer-facility-equipment" style="display:flex; flex-direction:column; gap:4px;"></div>
        </div>
      </div>
    </div>

    <!-- DATA MODAL (LIVE 10 Hz TELEMETRY) -->
    <div id="modal-twin-data" style="display:none; position:absolute; top:64px; left:50%; transform:translateX(-50%); z-index:50; width:92%; max-width:620px; background:rgba(7, 13, 25, 0.95); backdrop-filter:blur(24px); border:1px solid rgba(34, 211, 238, 0.5); border-radius:18px; padding:18px; box-shadow:0 20px 60px rgba(0,0,0,0.95);">
      <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid #1e293b;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:8px; height:8px; border-radius:50%; background:#22d3ee; box-shadow:0 0 8px #22d3ee; animation:pulse 1.5s infinite;"></span>
          <span style="font-weight:800; font-size:13px; text-transform:uppercase;">Station Telemetry & Data Streams</span>
          <span style="padding:2px 6px; border-radius:4px; background:rgba(8,145,178,0.2); border:1px solid #0891b2; color:#22d3ee; font-size:9.5px; font-family:monospace;">LIVE 10 Hz</span>
        </div>
        <button id="btn-close-data-modal" style="background:transparent; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">✕</button>
      </div>

      <div style="margin-top:14px; display:flex; flex-direction:column; gap:14px; font-size:11.5px;">
        <div>
          <div style="font-size:10px; font-family:monospace; text-transform:uppercase; color:#94a3b8; font-weight:700; margin-bottom:6px;">
            Atmospheric & Meteorological Sensors
          </div>
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; font-family:monospace; text-align:center;">
            <div style="padding:10px; border-radius:10px; background:#0f172a; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#64748b;">AMBIENT TEMP</div>
              <div id="data-ambient-temp" style="font-size:14px; font-weight:700; color:#fbbf24; margin-top:2px;">-8.2°C</div>
            </div>
            <div style="padding:10px; border-radius:10px; background:#0f172a; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#64748b;">WIND SPEED</div>
              <div id="data-wind-speed" style="font-size:14px; font-weight:700; color:#38bdf8; margin-top:2px;">14.6 m/s</div>
            </div>
            <div style="padding:10px; border-radius:10px; background:#0f172a; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#64748b;">HUMIDITY</div>
              <div id="data-humidity" style="font-size:14px; font-weight:700; color:#34d399; margin-top:2px;">68%</div>
            </div>
            <div style="padding:10px; border-radius:10px; background:#0f172a; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#64748b;">PRESSURE</div>
              <div id="data-pressure" style="font-size:14px; font-weight:700; color:#a5b4fc; margin-top:2px;">984 hPa</div>
            </div>
          </div>
        </div>

        <div>
          <div style="font-size:10px; font-family:monospace; text-transform:uppercase; color:#94a3b8; font-weight:700; margin-bottom:6px;">
            Energy & Microgrid Distribution
          </div>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; font-family:monospace; text-align:center;">
            <div style="padding:10px; border-radius:10px; background:#0f172a; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#64748b;">CHP DIESEL GEN</div>
              <div id="data-chp-gen" style="font-size:14px; font-weight:700; color:#22d3ee; margin-top:2px;">128 kW</div>
            </div>
            <div style="padding:10px; border-radius:10px; background:#0f172a; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#64748b;">SOLAR PV YIELD</div>
              <div id="data-solar-yield" style="font-size:14px; font-weight:700; color:#fbbf24; margin-top:2px;">24.5 kW</div>
            </div>
            <div style="padding:10px; border-radius:10px; background:#0f172a; border:1px solid #1e293b;">
              <div style="font-size:9.5px; color:#64748b;">BATTERY BANK SOC</div>
              <div id="data-battery-soc" style="font-size:14px; font-weight:700; color:#34d399; margin-top:2px;">92%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SIMULATION MODAL (SCENARIO STRESS LAB) -->
    <div id="modal-twin-sim" style="display:none; position:absolute; top:64px; left:50%; transform:translateX(-50%); z-index:50; width:92%; max-width:620px; background:rgba(7, 13, 25, 0.95); backdrop-filter:blur(24px); border:1px solid rgba(192, 132, 252, 0.5); border-radius:18px; padding:18px; box-shadow:0 20px 60px rgba(0,0,0,0.95);">
      <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid #1e293b;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:8px; height:8px; border-radius:50%; background:#c084fc; box-shadow:0 0 8px #c084fc; animation:pulse 1.5s infinite;"></span>
          <span style="font-weight:800; font-size:13px; text-transform:uppercase;">Polar Simulation Engine</span>
          <span id="sim-status-badge" style="padding:2px 6px; border-radius:4px; background:rgba(126,34,206,0.2); border:1px solid #7e22ce; color:#c084fc; font-size:9.5px; font-family:monospace;">NORMAL CONDITIONS</span>
        </div>
        <button id="btn-close-sim-modal" style="background:transparent; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">✕</button>
      </div>

      <div style="margin-top:14px; display:flex; flex-direction:column; gap:14px;">
        <div style="padding:12px; border-radius:12px; background:#0f172a; border:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; font-size:12px; color:#fff;">Simulation Engine State</div>
            <div style="font-size:10.5px; color:#94a3b8;">Control clock progression rate across digital twin models</div>
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-family:monospace;">
            <button id="btn-sim-toggle" style="padding:4px 10px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#cbd5e1; font-size:11px; cursor:pointer;">Pause</button>
            <button class="btn-sim-rate ${simSpeed === 1 ? 'active' : ''}" data-speed="1" style="padding:4px 8px; border-radius:6px; background:${simSpeed === 1 ? '#7e22ce' : '#1e293b'}; border:1px solid #334155; color:#fff; font-size:11px; cursor:pointer;">1x</button>
            <button class="btn-sim-rate ${simSpeed === 5 ? 'active' : ''}" data-speed="5" style="padding:4px 8px; border-radius:6px; background:${simSpeed === 5 ? '#7e22ce' : '#1e293b'}; border:1px solid #334155; color:#fff; font-size:11px; cursor:pointer;">5x</button>
            <button class="btn-sim-rate ${simSpeed === 20 ? 'active' : ''}" data-speed="20" style="padding:4px 8px; border-radius:6px; background:${simSpeed === 20 ? '#7e22ce' : '#1e293b'}; border:1px solid #334155; color:#fff; font-size:11px; cursor:pointer;">20x</button>
          </div>
        </div>

        <div>
          <div style="font-size:10px; font-family:monospace; text-transform:uppercase; color:#94a3b8; font-weight:700; margin-bottom:8px;">
            1-Click Antarctic Scenario Injection
          </div>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; font-size:11px;">
            <button class="btn-inject-scenario" data-scenario="normal" style="padding:10px; border-radius:10px; background:rgba(6,78,59,0.25); border:1px solid #059669; color:#a7f3d0; text-align:left; cursor:pointer;">
              <div style="font-weight:700; display:flex; align-items:center; gap:5px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>Baseline Normal</span>
              </div>
              <div style="font-size:9.5px; color:#6ee7b7; margin-top:2px;">Restore all nominals</div>
            </button>
            <button class="btn-inject-scenario" data-scenario="blizzard" style="padding:10px; border-radius:10px; background:rgba(12,74,110,0.25); border:1px solid #0284c7; color:#bae6fd; text-align:left; cursor:pointer;">
              <div style="font-weight:700; display:flex; align-items:center; gap:5px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4-4"/></svg>
                <span>Blizzard Surge</span>
              </div>
              <div style="font-size:9.5px; color:#7dd3fc; margin-top:2px;">65 kt winds & whiteout</div>
            </button>
            <button class="btn-inject-scenario" data-scenario="generator_failure" style="padding:10px; border-radius:10px; background:rgba(136,19,55,0.25); border:1px solid #e11d48; color:#fecdd3; text-align:left; cursor:pointer;">
              <div style="font-weight:700; display:flex; align-items:center; gap:5px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
                <span>DG Generator Trip</span>
              </div>
              <div style="font-size:9.5px; color:#fda4af; margin-top:2px;">Auto-failover to backup</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- RESOURCES MODAL (STATION RESERVES & LOGISTICS) -->
    <div id="modal-twin-resources" style="display:none; position:absolute; top:64px; left:50%; transform:translateX(-50%); z-index:50; width:92%; max-width:620px; background:rgba(7, 13, 25, 0.95); backdrop-filter:blur(24px); border:1px solid rgba(52, 211, 153, 0.5); border-radius:18px; padding:18px; box-shadow:0 20px 60px rgba(0,0,0,0.95);">
      <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid #1e293b;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:8px; height:8px; border-radius:50%; background:#34d399; box-shadow:0 0 8px #34d399; animation:pulse 1.5s infinite;"></span>
          <span style="font-weight:800; font-size:13px; text-transform:uppercase;">Station Resources & Reserves</span>
          <span style="padding:2px 6px; border-radius:4px; background:rgba(5,150,105,0.2); border:1px solid #059669; color:#34d399; font-size:9.5px; font-family:monospace;">OVERWINTER RESERVES</span>
        </div>
        <button id="btn-close-resources-modal" style="background:transparent; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">✕</button>
      </div>

      <div style="margin-top:14px; display:grid; grid-template-columns:1fr 1fr; gap:10px; font-family:monospace; font-size:11.5px;">
        <div style="padding:12px; border-radius:10px; background:#0f172a; border:1px solid #1e293b; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#94a3b8; font-weight:700; display:flex; align-items:center; gap:5px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/><path d="M7 10V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><line x1="3" y1="22" x2="19" y2="22"/></svg>
              <span>ATF-50 Fuel</span>
            </span>
            <span style="color:#34d399; font-weight:700;">78%</span>
          </div>
          <div style="width:100%; height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
            <div style="width:78%; height:100%; background:#10b981;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8;">
            <span>Capacity: 120,000 L</span>
            <span style="color:#fff; font-weight:700;">195 Days Left</span>
          </div>
        </div>

        <div style="padding:12px; border-radius:10px; background:#0f172a; border:1px solid #1e293b; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#94a3b8; font-weight:700; display:flex; align-items:center; gap:5px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
              <span>Freshwater Storage</span>
            </span>
            <span style="color:#38bdf8; font-weight:700;">88%</span>
          </div>
          <div style="width:100%; height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
            <div style="width:88%; height:100%; background:#0ea5e9;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8;">
            <span>Melter: 1,200 L/d</span>
            <span style="color:#fff; font-weight:700;">Loop: 82%</span>
          </div>
        </div>

        <div style="padding:12px; border-radius:10px; background:#0f172a; border:1px solid #1e293b; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#94a3b8; font-weight:700; display:flex; align-items:center; gap:5px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/></svg>
              <span>Battery Storage</span>
            </span>
            <span style="color:#fbbf24; font-weight:700;">92%</span>
          </div>
          <div style="width:100%; height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
            <div style="width:92%; height:100%; background:#eab308;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8;">
            <span>LiFePO4 240 kWh</span>
            <span style="color:#fff; font-weight:700;">14.2 Hours</span>
          </div>
        </div>

        <div style="padding:12px; border-radius:10px; background:#0f172a; border:1px solid #1e293b; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#94a3b8; font-weight:700; display:flex; align-items:center; gap:5px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              <span>Crew Rations</span>
            </span>
            <span style="color:#34d399; font-weight:700;">96%</span>
          </div>
          <div style="width:100%; height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
            <div style="width:96%; height:100%; background:#10b981;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8;">
            <span>O2: 18 Cylinders</span>
            <span style="color:#fff; font-weight:700;">210 Days Food</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FLOATING CAD TOOLBAR (Presets, Exploded, X-Ray, Section, Measure) -->
    <div id="twin-cad-toolbar" style="display:none; position:absolute; bottom:64px; left:50%; transform:translateX(-50%); z-index:30; background:rgba(15, 23, 42, 0.9); backdrop-filter:blur(16px); border:1px solid rgba(51, 65, 85, 0.8); border-radius:12px; padding:6px 12px; display:flex; align-items:center; gap:6px; box-shadow:0 8px 30px rgba(0,0,0,0.8);">
      <button class="btn-cad-cam" data-cam="RESET" style="padding:4px 8px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#fff; font-size:10.5px; cursor:pointer;">RESET</button>
      <button class="btn-cad-cam" data-cam="ISOMETRIC" style="padding:4px 8px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#fff; font-size:10.5px; cursor:pointer;">ISO</button>
      <button class="btn-cad-cam" data-cam="TOP" style="padding:4px 8px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#fff; font-size:10.5px; cursor:pointer;">TOP</button>
      <button class="btn-cad-cam" data-cam="FRONT" style="padding:4px 8px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#fff; font-size:10.5px; cursor:pointer;">FRONT</button>
      <button class="btn-cad-cam" data-cam="SIDE" style="padding:4px 8px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#fff; font-size:10.5px; cursor:pointer;">SIDE</button>
      <span style="color:#475569;">|</span>
      <button id="btn-toggle-exploded" style="padding:4px 8px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#fff; font-size:10.5px; cursor:pointer;">EXPLODED</button>
      <button id="btn-toggle-xray" style="padding:4px 8px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#fff; font-size:10.5px; cursor:pointer;">X-RAY</button>
      <button id="btn-toggle-measure" style="padding:4px 8px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#fff; font-size:10.5px; cursor:pointer;">MEASURE</button>
      <button id="btn-take-screenshot" style="padding:4px 8px; border-radius:6px; background:#1e293b; border:1px solid #334155; color:#38bdf8; font-size:10.5px; cursor:pointer;">PNG</button>
    </div>
  `;

  // -------------------------------------------------------------
  // THREE.JS INITIALIZATION
  // -------------------------------------------------------------
  function initScene() {
    const canvasContainer = container.querySelector('#twin-canvas-viewport');
    if (!canvasContainer) return;

    // Create Scene Manager with Heading callback for 3D Compass
    sceneManager = new ThreeSceneManager(canvasContainer, {
      onAngleChange: (heading) => {
        cameraHeading = heading;
        const needle = container.querySelector('#twin-compass-needle');
        if (needle) {
          needle.style.transform = `rotate(${-heading}deg)`;
        }
        updateProjectedHotspots();
      },
      onSelectObject: (assetId) => {
        const hotspots = getCurrentHotspots();
        const found = hotspots.find(h => h.id === assetId);
        if (found) {
          openFacilityDrawer(found);
        }
      },
      onMeasureDistance: (dist) => {
        measuredDistance = dist;
        alert(`Measured 3D Euclidean Distance: ${dist} meters`);
      }
    });

    // Create Model Builder
    modelBuilder = new StationModelBuilder(sceneManager.scene);
    sceneManager.modelBuilder = modelBuilder;
    modelBuilder.buildStation(currentStation);
    sceneManager.setStationAtmosphere(currentStation);

    // Initial Hotspots Projection
    renderHotspots();
  }

  // -------------------------------------------------------------
  // 3D POI HOTSPOT PROJECTION (Screen Overlay)
  // -------------------------------------------------------------
  function renderHotspots() {
    const layer = container.querySelector('#twin-hotspots-layer');
    if (!layer) return;

    const hotspots = getCurrentHotspots();
    layer.innerHTML = hotspots.map(h => `
      <div class="twin-hotspot-pin" data-hotspot-id="${h.id}" style="position:absolute; transform:translate(-50%, -50%); pointer-events:auto; cursor:pointer; display:flex; align-items:center; gap:6px; padding:4px 10px; border-radius:9999px; background:rgba(7, 13, 25, 0.85); backdrop-filter:blur(10px); border:1px solid rgba(34, 211, 238, 0.5); box-shadow:0 8px 24px rgba(0,0,0,0.85); transition:transform 0.15s ease, border-color 0.15s; white-space:nowrap; font-size:11px; font-weight:600; color:#fff;">
        <span style="width:7px; height:7px; border-radius:50%; background:#34d399; box-shadow:0 0 8px #34d399; animation:pulse 1.5s infinite; flex-shrink:0;"></span>
        <span style="text-shadow:0 1px 3px rgba(0,0,0,0.8);">${h.label}</span>
      </div>
    `).join('');

    layer.querySelectorAll('.twin-hotspot-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = pin.getAttribute('data-hotspot-id');
        const h = hotspots.find(item => item.id === id);
        if (h) openFacilityDrawer(h);
      });
      pin.addEventListener('mouseenter', () => {
        pin.style.transform = 'translate(-50%, -50%) scale(1.08)';
        pin.style.borderColor = '#38bdf8';
      });
      pin.addEventListener('mouseleave', () => {
        pin.style.transform = 'translate(-50%, -50%) scale(1)';
        pin.style.borderColor = 'rgba(34, 211, 238, 0.5)';
      });
    });

    updateProjectedHotspots();
  }

  function updateProjectedHotspots() {
    if (!sceneManager || !sceneManager.camera || !sceneManager.renderer) return;

    const layer = container.querySelector('#twin-hotspots-layer');
    if (!layer) return;

    const width = layer.clientWidth;
    const height = layer.clientHeight;
    if (!width || !height) return;

    const hotspots = getCurrentHotspots();
    const tempVec = new THREE.Vector3();

    hotspots.forEach(h => {
      const el = layer.querySelector(`[data-hotspot-id="${h.id}"]`);
      if (!el) return;

      tempVec.set(h.pos[0], h.pos[1], h.pos[2]);
      tempVec.project(sceneManager.camera);

      // Check if in front of camera
      if (tempVec.z > 1) {
        el.style.display = 'none';
        return;
      }

      el.style.display = 'flex';
      const screenX = ((tempVec.x + 1) * width) / 2;
      const screenY = ((-tempVec.y + 1) * height) / 2;
      el.style.left = `${screenX}px`;
      el.style.top = `${screenY}px`;
    });
  }

  // -------------------------------------------------------------
  // OPEN & POPULATE FACILITY DRAWER
  // -------------------------------------------------------------
  function openFacilityDrawer(facility) {
    selectedFacility = facility;
    const drawer = container.querySelector('#twin-facility-drawer');
    if (!drawer) return;

    drawer.querySelector('#drawer-facility-title').textContent = facility.label;
    drawer.querySelector('#drawer-facility-category').textContent = facility.category;
    drawer.querySelector('#drawer-facility-status').textContent = facility.status;
    drawer.querySelector('#drawer-facility-desc').textContent = facility.description;
    drawer.querySelector('#drawer-facility-temp').textContent = facility.temp;
    drawer.querySelector('#drawer-facility-power').textContent = facility.power;

    const eqList = drawer.querySelector('#drawer-facility-equipment');
    eqList.innerHTML = facility.equipment.map(eq => `
      <div style="display:flex; align-items:center; gap:6px; font-family:monospace; font-size:10.5px; color:#cbd5e1; padding:2px 0;">
        <svg style="width:12px; height:12px; color:#34d399; flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <span>${eq}</span>
      </div>
    `).join('');

    drawer.style.display = 'block';

    // Highlight equipment mesh in 3D
    if (modelBuilder) modelBuilder.highlightEquipment(facility.id);
  }

  // -------------------------------------------------------------
  // SWITCH STATION (MAITRI <-> BHARATI)
  // -------------------------------------------------------------
  function switchStation(newStation) {
    currentStation = newStation;

    // Update Top-Left Station Header
    const nameEl = container.querySelector('#twin-station-name');
    const regionEl = container.querySelector('#twin-station-region');
    const coordsEl = container.querySelector('#twin-station-coords');
    const quoteEl = container.querySelector('#twin-station-quote');
    const tempEl = container.querySelector('#header-temp-val');
    const hudTemp = container.querySelector('#hud-weather-temp');
    const hudWind = container.querySelector('#hud-weather-wind');
    const hudHum = container.querySelector('#hud-weather-humidity');
    const hudVis = container.querySelector('#hud-weather-vis');

    const mActiveBadge = container.querySelector('#badge-maitri-active');
    const bActiveBadge = container.querySelector('#badge-bharati-active');
    const mBtn = container.querySelector('#btn-select-maitri');
    const bBtn = container.querySelector('#btn-select-bharati');

    if (currentStation === 'BHARATI') {
      if (nameEl) nameEl.textContent = 'BHARATI STATION';
      if (regionEl) regionEl.textContent = 'Larsemann Hills, East Antarctica';
      if (coordsEl) coordsEl.textContent = "69°24'S, 76°11'E • Elevation: 35 m";
      if (quoteEl) quoteEl.textContent = '“Pioneering Earth observation and polar frontiers for tomorrow.”';
      if (tempEl) tempEl.textContent = '-10.4°C';
      if (hudTemp) hudTemp.textContent = '-10.4°C';
      if (hudWind) hudWind.textContent = '16.2 m/s (NE)';
      if (hudHum) hudHum.textContent = '62%';
      if (hudVis) hudVis.textContent = '18 km';

      if (mActiveBadge) mActiveBadge.style.display = 'none';
      if (bActiveBadge) bActiveBadge.style.display = 'inline-block';
      if (mBtn) {
        mBtn.style.background = 'transparent';
        mBtn.style.borderColor = 'transparent';
      }
      if (bBtn) {
        bBtn.style.background = 'rgba(8, 145, 178, 0.28)';
        bBtn.style.borderColor = 'rgba(34, 211, 238, 0.6)';
      }
    } else {
      if (nameEl) nameEl.textContent = 'MAITRI STATION';
      if (regionEl) regionEl.textContent = 'Queen Maud Land, East Antarctica';
      if (coordsEl) coordsEl.textContent = "70°45'S, 11°44'E • Elevation: ~50 m (NCPOR Profile)";
      if (quoteEl) quoteEl.textContent = '“Science beyond boundaries for a sustainable planet.”';
      if (tempEl) tempEl.textContent = '-8.2°C';
      if (hudTemp) hudTemp.textContent = '-8.2°C';
      if (hudWind) hudWind.textContent = '14.6 m/s (E)';
      if (hudHum) hudHum.textContent = '68%';
      if (hudVis) hudVis.textContent = '15 km';

      if (mActiveBadge) mActiveBadge.style.display = 'inline-block';
      if (bActiveBadge) bActiveBadge.style.display = 'none';
      if (mBtn) {
        mBtn.style.background = 'rgba(37, 99, 235, 0.28)';
        mBtn.style.borderColor = 'rgba(59, 130, 246, 0.6)';
      }
      if (bBtn) {
        bBtn.style.background = 'transparent';
        bBtn.style.borderColor = 'transparent';
      }
    }

    // Close drawer
    const drawer = container.querySelector('#twin-facility-drawer');
    if (drawer) drawer.style.display = 'none';

    // Update 3D Models and Atmosphere
    if (modelBuilder) modelBuilder.buildStation(currentStation);
    if (sceneManager) sceneManager.setStationAtmosphere(currentStation);

    // Re-render Hotspots
    renderHotspots();
  }

  // -------------------------------------------------------------
  // EVENT BINDINGS
  // -------------------------------------------------------------
  function bindEvents() {
    // Stations Menu Dropdown Toggle
    const btnStations = container.querySelector('#btn-stations-menu');
    const stationsDropdown = container.querySelector('#twin-stations-dropdown');
    const arrowIcon = container.querySelector('#stations-arrow-icon');
    if (btnStations && stationsDropdown) {
      btnStations.addEventListener('click', (e) => {
        e.stopPropagation();
        isStationDropdownOpen = !isStationDropdownOpen;
        stationsDropdown.style.display = isStationDropdownOpen ? 'block' : 'none';
        if (arrowIcon) arrowIcon.style.transform = isStationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    }

    // Select Maitri / Bharati
    const btnMaitri = container.querySelector('#btn-select-maitri');
    if (btnMaitri) {
      btnMaitri.addEventListener('click', () => {
        isStationDropdownOpen = false;
        if (stationsDropdown) stationsDropdown.style.display = 'none';
        if (arrowIcon) arrowIcon.style.transform = 'rotate(0deg)';
        switchStation('MAITRI');
      });
    }

    const btnBharati = container.querySelector('#btn-select-bharati');
    if (btnBharati) {
      btnBharati.addEventListener('click', () => {
        isStationDropdownOpen = false;
        if (stationsDropdown) stationsDropdown.style.display = 'none';
        if (arrowIcon) arrowIcon.style.transform = 'rotate(0deg)';
        switchStation('BHARATI');
      });
    }

    // Modal Triggers: Data, Sim, Resources
    const modalData = container.querySelector('#modal-twin-data');
    const modalSim = container.querySelector('#modal-twin-sim');
    const modalResources = container.querySelector('#modal-twin-resources');
    const cadToolbar = container.querySelector('#twin-cad-toolbar');

    function closeAllModals() {
      if (modalData) modalData.style.display = 'none';
      if (modalSim) modalSim.style.display = 'none';
      if (modalResources) modalResources.style.display = 'none';
      if (cadToolbar) cadToolbar.style.display = 'none';
    }

    const btnData = container.querySelector('#btn-nav-data');
    if (btnData) {
      btnData.addEventListener('click', () => {
        const isShown = modalData.style.display === 'block';
        closeAllModals();
        if (!isShown) modalData.style.display = 'block';
      });
    }
    const btnCloseData = container.querySelector('#btn-close-data-modal');
    if (btnCloseData) btnCloseData.addEventListener('click', () => modalData.style.display = 'none');

    const btnSim = container.querySelector('#btn-nav-simulation');
    if (btnSim) {
      btnSim.addEventListener('click', () => {
        const isShown = modalSim.style.display === 'block';
        closeAllModals();
        if (!isShown) modalSim.style.display = 'block';
      });
    }
    const btnCloseSim = container.querySelector('#btn-close-sim-modal');
    if (btnCloseSim) btnCloseSim.addEventListener('click', () => modalSim.style.display = 'none');

    const btnRes = container.querySelector('#btn-nav-resources');
    if (btnRes) {
      btnRes.addEventListener('click', () => {
        const isShown = modalResources.style.display === 'block';
        closeAllModals();
        if (!isShown) modalResources.style.display = 'block';
      });
    }
    const btnCloseRes = container.querySelector('#btn-close-resources-modal');
    if (btnCloseRes) btnCloseRes.addEventListener('click', () => modalResources.style.display = 'none');

    const btnCad = container.querySelector('#btn-nav-cad');
    if (btnCad) {
      btnCad.addEventListener('click', () => {
        isCadToolbarOpen = !isCadToolbarOpen;
        cadToolbar.style.display = isCadToolbarOpen ? 'flex' : 'none';
      });
    }

    // Close Facility Drawer
    const btnCloseDrawer = container.querySelector('#btn-close-drawer');
    const drawer = container.querySelector('#twin-facility-drawer');
    if (btnCloseDrawer && drawer) {
      btnCloseDrawer.addEventListener('click', () => {
        drawer.style.display = 'none';
      });
    }

    // Ctrl+K Global Search Modal
    const searchModal = container.querySelector('#twin-search-modal');
    const btnOpenSearch = container.querySelector('#btn-open-search');
    const btnCloseSearch = container.querySelector('#btn-close-search');
    const inputSearch = container.querySelector('#input-facility-search');
    const searchResults = container.querySelector('#search-results-list');

    function populateSearchResults(q = '') {
      if (!searchResults) return;
      const hotspots = getCurrentHotspots();
      const filtered = q ? hotspots.filter(h => h.label.toLowerCase().includes(q.toLowerCase()) || h.category.toLowerCase().includes(q.toLowerCase())) : hotspots;

      searchResults.innerHTML = filtered.map(h => `
        <button class="search-item-btn" data-hotspot-id="${h.id}" style="width:100%; display:flex; align-items:center; justify-content:space-between; padding:6px 8px; border-radius:8px; background:transparent; border:none; text-align:left; cursor:pointer; color:#fff; transition:background 0.15s;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="width:6px; height:6px; border-radius:50%; background:#34d399;"></span>
            <span style="font-weight:700; font-size:11.5px;">${h.label}</span>
          </div>
          <span style="font-size:9.5px; font-family:monospace; color:#94a3b8;">${h.category}</span>
        </button>
      `).join('');

      searchResults.querySelectorAll('.search-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-hotspot-id');
          const found = hotspots.find(h => h.id === id);
          if (found) {
            openFacilityDrawer(found);
            searchModal.style.display = 'none';
          }
        });
        btn.addEventListener('mouseenter', () => btn.style.background = '#1e293b');
        btn.addEventListener('mouseleave', () => btn.style.background = 'transparent');
      });
    }

    if (btnOpenSearch && searchModal) {
      btnOpenSearch.addEventListener('click', () => {
        searchModal.style.display = 'block';
        populateSearchResults();
        if (inputSearch) {
          inputSearch.value = '';
          inputSearch.focus();
        }
      });
    }
    if (btnCloseSearch && searchModal) {
      btnCloseSearch.addEventListener('click', () => searchModal.style.display = 'none');
    }
    if (inputSearch) {
      inputSearch.addEventListener('input', (e) => {
        populateSearchResults(e.target.value);
      });
    }

    // Ctrl+K Keydown Handler
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchModal) {
          const isShown = searchModal.style.display === 'block';
          searchModal.style.display = isShown ? 'none' : 'block';
          if (!isShown) {
            populateSearchResults();
            if (inputSearch) {
              inputSearch.value = '';
              inputSearch.focus();
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // CAD Toolbar Buttons (Presets, Exploded, X-Ray, Measure, Screenshot)
    container.querySelectorAll('.btn-cad-cam').forEach(btn => {
      btn.addEventListener('click', () => {
        const camPreset = btn.getAttribute('data-cam');
        if (sceneManager) sceneManager.setCameraPreset(camPreset);
      });
    });

    const btnExploded = container.querySelector('#btn-toggle-exploded');
    if (btnExploded) {
      btnExploded.addEventListener('click', () => {
        isExploded = !isExploded;
        if (modelBuilder) modelBuilder.setExplodedView(isExploded);
        btnExploded.style.background = isExploded ? '#0284c7' : '#1e293b';
      });
    }

    const btnXRay = container.querySelector('#btn-toggle-xray');
    if (btnXRay) {
      btnXRay.addEventListener('click', () => {
        isXRay = !isXRay;
        if (modelBuilder) modelBuilder.setXRayMode(isXRay);
        btnXRay.style.background = isXRay ? '#0284c7' : '#1e293b';
      });
    }

    const btnMeasure = container.querySelector('#btn-toggle-measure');
    if (btnMeasure) {
      btnMeasure.addEventListener('click', () => {
        isMeasuring = !isMeasuring;
        if (sceneManager) sceneManager.toggleMeasureTool(isMeasuring);
        btnMeasure.style.background = isMeasuring ? '#0284c7' : '#1e293b';
        if (isMeasuring) alert('Measure Mode Active: Click two points in the 3D scene to measure euclidean distance.');
      });
    }

    const btnScreenshot = container.querySelector('#btn-take-screenshot');
    if (btnScreenshot) {
      btnScreenshot.addEventListener('click', () => {
        if (sceneManager) {
          const url = sceneManager.captureScreenshot();
          const link = document.createElement('a');
          link.download = `${currentStation}_Digital_Twin.png`;
          link.href = url;
          link.click();
        }
      });
    }

    // Close Dropdowns when clicking outside
    container.addEventListener('click', (e) => {
      if (isStationDropdownOpen && !e.target.closest('#btn-stations-menu') && !e.target.closest('#twin-stations-dropdown')) {
        isStationDropdownOpen = false;
        if (stationsDropdown) stationsDropdown.style.display = 'none';
        if (arrowIcon) arrowIcon.style.transform = 'rotate(0deg)';
      }
    });

    // Cleanup on remove
    container.cleanup = () => {
      clearInterval(clockInterval);
      window.removeEventListener('keydown', handleKeyDown);
      if (sceneManager) sceneManager.destroy();
    };
  }

  // -------------------------------------------------------------
  // MOUNT INITIAL SCENE
  // -------------------------------------------------------------
  setTimeout(() => {
    initScene();
    bindEvents();
  }, 40);

  return container;
}
