# PHASE 0 — UI INVENTORY & CONTENT CONTRACT
**Bharat-Maitri Antarctic Digital Twin & Geospatial Operations Console**  
*Document Generated: Phase 0 Audit | Baseline for Content Parity Enforcement*

---

## 1. ROUTES & PAGE PURPOSE DIRECTORY

| Route Identifier | Page Title in Navigation | Purpose in One Line |
|---|---|---|
| `login` | Mission Control Secure Login | Authenticates operators via credentials/employee ID with biometric station identity. |
| `unauthorized` | Clearance Level Insufficient | Denies unauthorized sector access and directs operators to valid workspaces. |
| `dashboard` | Base Operations Overview | High-level tactical summary of microgrid, polar weather, 2D twin nodes, and active alerts. |
| `digitalTwin` | Station Digital Twin Inspection | Interactive 3D WebGL (Three.js) CAD/physics visualization and telemetry inspection for Maitri and Bharati. |
| `tracking` / `liveTracking` | Antarctic Maritime & Polar Aviation Live Tracking | Geospatial operations map tracking vessel AIS, aircraft ADS-B, sea corridors, and cold-chain airbills. |
| `expeditions` / `routeIntelligence` | Expedition & Convoy Route Intelligence | Polar traverse GIS interface integrating SCAR ADD v7.x layers, EPSG:3031, Sentinel-1 SAR swaths, and convoy telemetry. |
| `infrastructure` | Station Infrastructure & Facilities | Environmental control and life support monitoring (HVAC, water recycling, structural foundation strain). |
| `energy` | Polar Microgrid & Power Generation | Microgrid power balancing between wind turbines, solar PV tilt arrays, BESS battery, and diesel standby. |
| `logistics` | Polar Logistics & Resupply Operations | Inbound cargo flight/convoy schedules and cold-chain manifest status tracking. |
| `environment` | Polar Environment & Meteorology | Real-time meteorological indices (wind velocity, barometric pressure, UV/ozone, seismic sensors). |
| `research` | Scientific Research & Telemetry Experiments | Deep ice-core drilling progress (3,240m) and South Pole IceCube neutrino observatory event streams. |
| `inventory` | Station Inventory & Supply Reserves | Real-time reserves stock ledger (survival gear, fuel reserves, rations, spare parts). |
| `maintenance` | Preventive & Emergency Maintenance | Active work order ticketing, equipment assignment, de-icing tasks, and maintenance history. |
| `alerts` | Incident Triage & Alert Management | Live triage queue for station telemetry warnings, high-priority emergency alerts, and resolutions. |
| `personnel` | Base Station Personnel Roster | Personnel roster detailing deployment, shift status, medical clearance, and sat-com channels. |
| `roles` | User Management & RBAC Security | Administrative directory, ISO-27001 role permission matrix, and immutable defense audit log. |
| `reports` | Station Analytics & Historical Reports | Historical data exporter, 7-day efficiency comparisons, and PDF report generator. |
| `settings` | Station Settings & Operator Profile | Operator profile picture upload to MongoDB, sat-com configuration, API keys, and failovers. |
| `help` | Station SOP & Operating Manuals | Emergency procedures, blizzard lockdown protocols, and live satellite transponder diagnostics. |

---

## 2. PAGE-BY-PAGE DATA FIELD SPECIFICATION & LIFECYCLE STATES

### Route 1: `dashboard` (Base Operations Overview)
- **Data Fields & Sources:**
  - `state.kpis.powerKw`: Total microgrid power load (kW). Format: `###.# kW`. Tabular numeric.
  - `state.kpis.powerCapacityKw`: Power capacity threshold (kW). Format: `###.# kW`.
  - `state.kpis.tempAmbient`: Ambient outdoor polar temperature (°C). Format: `-##.# °C`.
  - `state.kpis.windChill`: Windchill equivalent temperature (°C). Format: `-##.# °C`.
  - `state.kpis.activePersonnel`: Active personnel count. Format: `## Crew` / `## On-Site`.
  - `state.kpis.activeAlertsCount`: Active incidents count. Format: `# Active`.
  - `state.digitalTwinNodes`: Array of module nodes (`name`, `status`, `temp`, `load`, `x`, `y`). Format: string, status badge, mono temp `##°C`, mono load `##%`.
  - `state.incidents`: Array of active incidents (`id`, `title`, `sector`, `severity`, `timestamp`, `assignee`).
  - Active routes summary: Wohlthat Survey (42.6 km, `CAUTION`), Ship-to-Station (11.2 km, `NORMAL`), Willy Field Evac (28.5 km, `REVIEW REQUIRED`).
- **States:**
  - *Loading:* Canvas renders dark grid background; metrics show previous telemetry state or `--`.
  - *Nominal:* Real-time websocket/interval updates to KPIs and canvas pulse nodes.
  - *Warning/Alert:* Nodes transition to amber/red pulsing rings.

### Route 2: `digitalTwin` (Station Digital Twin Inspection)
- **Data Fields & Sources:**
  - `currentStation`: Active station selection (`MAITRI` | `BHARATI`).
  - `activeSubsystem`: Filter selection (`ALL`, `ENERGY`, `HVAC`, `HABITATION`, `RESEARCH`, `LOGISTICS`, `COMMUNICATION`, `SAFETY`, `ENVIRONMENT`).
  - Station KPIs (7 Metrics):
    1. Power Generation: `147.0 kW` (Maitri) / `310.0 kW` (Bharati) + `50.04 Hz`.
    2. Energy Load: `68.2%` (Maitri) / `74.5%` (Bharati).
    3. HVAC Status: `NORMAL`, airflow `4,200 CFM`.
    4. Network & Comms: `99.8%` (VSAT / BGAN Dual-Link).
    5. Active Alerts: `01 WARN` / `00 NOMINAL`.
    6. Telemetry Nodes: `17 / 18` (Maitri) / `19 / 20` (Bharati) (94.4% Online).
    7. Structural Integrity: `99.2% Nominal`.
  - Selected Asset Inspector: `selectedAssetId`, `name`, `assetId`, `subsystem`, `status`, `health`, `metrics` (`tempC`, `loadPct`, `vibrationMmS`, `pressureKPa`), `powerKw`, `maintenance` (`lastService`, `nextDue`, `assignedTech`), `liveTelemetryStream`.
  - Physical Simulation: Thermal flow vectors, microgrid bus routing, HVAC CFD air currents, permafrost thermal gradients.
- **States:**
  - *WebGL Loading:* Three.js loading overlay with progress.
  - *Interactive Inspection:* OrbitControls rotate/pan/zoom; mesh highlight on hover; inspector syncs on click.
  - *Exploded / X-Ray / Section Clipping:* Subsystem meshes animate translation/opacity without DOM reflow.

### Route 3: `tracking` / `liveTracking` (Antarctic Maritime & Polar Aviation Live Tracking)
- **Data Fields & Sources:**
  - Counters: `counters.vessels` (live AIS), `counters.aircraft` (live ADS-B), `counters.shipments` (active logistics), `counters.alerts` (corridor warnings).
  - Vessel List & Inspector: `mmsi`, `name`, `type`, `flag`, `lat`, `lon`, `speedKnots`, `courseDeg`, `destination`, `eta`, `iceClass`, `callsign`, `source`.
  - Aircraft List & Inspector: `icao24`, `callsign`, `type`, `operator`, `lat`, `lon`, `altitudeFt`, `groundSpeedKnots`, `trackDeg`, `destination`, `eta`, `fuelHours`, `squawk`.
  - Cold-Chain Cargo Manifest: `shipmentId`, `title`, `category`, `carrierName`, `temperatureReq`, `currentTemp`, `status`, `destination`.
  - Feed Status: AIS feed (`CONNECTED` / `DISCONNECTED`), ADS-B feed (`CONNECTED` / `DISCONNECTED`), Map engine (`ONLINE`).
- **States:**
  - *Loading:* Basemap tiles load progressively; entity markers populated asynchronously.
  - *Empty Search:* "No vessels/aircraft/shipments match search filter."
  - *Connected:* Status pill pulses green; real-time lat/lon updates.

### Route 4: `expeditions` / `routeIntelligence` (Expedition & Convoy Route Intelligence)
- **Data Fields & Sources:**
  - Verified Stations: Station name, SCAR country, WGS84 coordinates, EPSG:3031 polar stereographic projected easting/northing, status, elevation.
  - Operational Corridors: Corridor ID, origin station, destination station, surface type, total distance (km), hazard level, verified waypoints array.
  - Active Polar Convoys: Convoy ID, lead vehicle, callsign, current coordinate, heading, speed (km/h), Cross-Track Error (XTE in nautical miles), payload, crew complement.
  - Copernicus Sentinel-1 SAR Observations: Pass ID, orbit direction (Ascending/Descending), sensor mode (IW GRD), acquisition timestamp, swath footprint polygon, change detection delta.
  - Weather Station Corridors: `temperatureC`, `apparentTempC`, `windChillC`, `windSpeedKnots`, `windSpeedKmh`, `windGustsKmh`, `pressureHpa`, `threat.alertLevel`, `threat.hazardDescription`, `threat.katabaticRisk`, `provenance`.
  - Geospatial Metadata: SCAR ADD v7.x attribution, EPSG:3031 geodetic parameters, geodetic distance calculator.
- **States:**
  - *Loading:* Spinner on map container while GeoJSON layers and weather API fetch.
  - *Offline Fallback:* Displays verified climatological baseline with clear provenance pill.
  - *Measurement Mode:* Dynamic line drawing with real-time geodesic distance readout in km and nautical miles.

### Route 5: `infrastructure` (Station Infrastructure & Facilities)
- **Data Fields & Sources:**
  - HVAC Circulation Rate: `4,200 CFM` (`Nominal`, HEPA Filter Integrity: `98%`).
  - Greywater Recycling: `91.4% Eff` (`↑ 1.8%`, Reservoir Volume: `14,200 L`).
  - Structural Foundation Strain: `12.4 MPa` (`Safe Threshold`, Permafrost Anchor Temp: `-18.4°C`).
  - Thermal Containment: `99.1%` (`Loss: < 0.4°/hr`, Vacuum Insulation Active).
  - Subsystems Table: Subsystem Name, Location Sector, Primary Sensor, Current Reading, Target Setpoint, Regulation Mode, Health Status, On/Off Controls.

### Route 6: `energy` (Polar Microgrid & Power Generation)
- **Data Fields & Sources:**
  - Wind Turbine Generation: `${state.kpis.windOutputKw} kW` (`52% Share`, `8 / 8 Turbines Operational`).
  - Solar PV Polar Tilt: `${state.kpis.solarOutputKw} kW` (`34% Share`, Sun Elevation: `14.2°`).
  - Battery Reserves (BESS): `${state.kpis.batteryChargePercent}%` (`Full Reserve`, Estimated Backup: `48.5 Hours`).
  - Diesel Backup Generators: `STANDBY` (`0.0 kW`, Fuel Consumption: `0 L/hr`).
  - Charts: 24h Generation vs Demand line chart (kW), Power Distribution Share doughnut chart (Wind, Solar, Fuel Cells, Emergency Diesel).

### Route 7: `logistics` (Polar Logistics & Resupply Operations)
- **Data Fields & Sources:**
  - Fleet cards: `${state.logistics}` array (`id`, `vehicle`, `cargo`, `origin`, `destination`, `ETA`, `status`).
  - Cold-Chain Supply Manifest Tracker: Tracking ID, Container Description, Carrier, Weight (kg), Temp Requirement, Current Temp, Destination Sector, Status.

### Route 8: `environment` (Polar Environment & Meteorology)
- **Data Fields & Sources:**
  - Wind Velocity: `${state.kpis.windSpeedKnots} Knots` (`Gale Force`, Direction: `210° SW | Gusts 58 kts`).
  - Barometric Pressure: `982 hPa` (`↓ Falling 4hPa`, `Storm Front Approaching`).
  - Stratospheric Ozone: `185 DU` (`Dobson Units`, UV Index: `1.2 (Low Solar Angle)`).
  - Ice Shelf Seismic Tremors: `0.12 Mw` (`Quiet`, Crevasse Acoustic Sensors Normal).
  - 24h Ambient Temp & Windchill Chart: Multi-line chart (`Ambient Air Temp (°C)` vs `Windchill (°C)`).

### Route 9: `research` (Scientific Research & Telemetry Experiments)
- **Data Fields & Sources:**
  - Project Deep-Ice Core Stratigraphy: Drilling Active (`3,240m`), Ancient atmospheric gas 800,000 BP, Current Core Depth (`3,241.8 Meters`), Core Temp (`-54.2 °C`), Target Depth (`3,400.0 Meters`), Progress (`95%`).
  - South Pole IceCube Neutrino Array: Collecting Data (`5,160 optical sensors at 2.5km depth`), Detection Events Today (`1,482 Triggers`), DOM Sensor Health (`99.8% Nominal`), Data Transmission (`24.2 GB / hr`), Progress (`99%`).

### Route 10: `inventory` (Station Inventory & Supply Reserves)
- **Data Fields & Sources:**
  - Stock Ledger Table: `state.inventory` (`id`, `name`, `category`, `qty`, `capacity`, `percentage`, `status`).

### Route 11: `maintenance` (Preventive & Emergency Maintenance)
- **Data Fields & Sources:**
  - Active Work Order Tickets: Ticket ID, Task Summary, Equipment System, Priority (`HIGH`, `MEDIUM`, `LOW`), Assigned Tech, Scheduled Time, Status (`IN PROGRESS`, `SCHEDULED`, `RESOLVED`), Action.

### Route 12: `alerts` (Incident Triage & Alert Management)
- **Data Fields & Sources:**
  - Live Triage Stream: `state.incidents` (`id`, `title`, `sector`, `severity`, `timestamp`, `assignee`, `status`).

### Route 13: `personnel` (Base Station Personnel Roster)
- **Data Fields & Sources:**
  - Station On-Site Roster: `state.personnel` (`id`, `name`, `role`, `sector`, `duty`, `medical`, `contact`).

### Route 14: `roles` (User Management & RBAC Security)
- **Data Fields & Sources:**
  - Personnel Directory: Operator (`name`, `email`, avatar), Employee ID, Role (`ADMIN`, `EMPLOYEE`), Department, Station, Status (`ACTIVE`, `SUSPENDED`), Last Active, Actions (`Toggle Status`, `Reset Pwd`).
  - Role Permissions Matrix: Permission scopes vs 6 system roles.
  - Defense & Security Audit Logs: `timestamp`, `action`, `employeeId`, `userName`, `station`, `details`.
  - Modals: Register New Operator form (`name`, `employeeId`, `email`, `password`, `role`, `department`, `station`).

### Route 15: `reports` (Station Analytics & Historical Reports)
- **Data Fields & Sources:**
  - Subsystem metric selector, Timeframe window selector, Historical efficiency bar chart (`Green Energy Used` vs `Thermal Losses`).

### Route 16: `settings` (Station Settings & Operator Profile)
- **Data Fields & Sources:**
  - Operator Identity: `name`, `employeeId`, `email`, `role`, `department`, `station`, avatar preview.
  - Image upload with canvas compression and MongoDB synchronization (`/api/auth/profile`).
  - System configuration: Satellite IP, Telemetry poll rate, MongoDB gateway URI, Failover toggle, P1 Webhook URL, Station API key, Biometric 2FA toggle.

### Route 17: `help` (Station SOP & Operating Manuals)
- **Data Fields & Sources:**
  - SOP guides (Blizzard Protocol, Cryo Vault Thermal Recovery, Satellite Transponder Realignment) + Satellite Transponder Diagnostic Tool.

### Route 18: `login` (Mission Control Secure Login)
- **Data Fields & Sources:**
  - Official Email or Employee ID, Security Password, Quick demo account buttons, Security compliance notes.

### Route 19: `unauthorized` (Clearance Level Insufficient)
- **Data Fields & Sources:**
  - Target route identifier, Authenticated operator name, Employee ID, Security role, Assigned department, Base station, Navigation buttons.

---

## 3. SHARED COMPONENTS & INTERACTIVE CONTROLS

1. **Global App Shell Header (`header.js`):**
   - Breadcrumbs: `Antarctic Operations / {currentRouteTitle}`
   - Telemetry status pill: `Telemetry Nominal`
   - MongoDB live status pill: `MongoDB: Connected (localhost:27017)` / `MongoDB: Offline`
   - Global Search / Command Palette trigger: `Search telemetry, nodes...` (with `⌘K` badge)
   - Admin AI Copilot launcher button (rendered strictly if `user.role === 'ADMIN'`)
   - Export telemetry snapshot button
   - Report Incident trigger button
   - User profile avatar chip (`name`, `role`, avatar image or initial)

2. **Global App Shell Sidebar (`sidebar.js`):**
   - Brand block: `Bharat Matri` / `{station} Station`
   - Command & Control: `dashboard`, `digitalTwin`, `aiCopilotAction` (Admin only), `expeditions`, `tracking`, `logisticsCommand` (external), `envMonitoring` (external)
   - Station Sectors: `infrastructure`, `energy`, `logistics`, `environment`, `research`
   - Operations & Maintenance: `inventory`, `maintenance`, `alerts`, `personnel`
   - Admin & Config: `roles`, `reports`, `settings`, `help`
   - Footer: User profile card + Sign Out button

3. **Global Modals (`modals.js`):**
   - Command Palette (`Ctrl+K` / `Cmd+K`): Instant search and route jump across 15+ operational modules.
   - Incident Broadcast Modal: Emergency submission with title, sector, severity classification, and assignee.

---

## 4. CONTENT PARITY CONTRACT VALIDATION RULES
1. No telemetry metrics, coordinate readouts, units, or status badges may be removed.
2. Domain-specific Antarctic terminology (e.g. `Maitri`, `Bharati`, `Prydz Mooring`, `SCAR ADD v7.x`, `EPSG:3031`, `Cross-Track Error (XTE)`, `katabatic surge`, `LC-130 Hercules`, `HEPA Scrubber`, `Dobson Units`) must be preserved identically.
3. Every numeric column must be right-aligned with monospace tabular figures (`font-variant-numeric: tabular-nums`).
