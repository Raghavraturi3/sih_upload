# PROPOSED PRESENTATION LAYER EVOLUTIONS (NON-BREAKING)
**Bharat-Maitri Antarctic Digital Twin Platform**  
*Document Generated during Geospatial Operations Console Redesign*

---

The following architectural and presentation opportunities were identified during the Phase 0 audit and redesign. In strict adherence to **THE ONE HARD RULE: CONTENT PARITY**, none of these changes have been executed silently; all original fields and endpoints remain 100% active and untouched. These are submitted for operator and mission controller review:

### 1. Unified Split-Screen Layout for Station Sector Views
- **Current State:** The individual station sector views (`infrastructure`, `energy`, `logistics`, `environment`, `research`) currently render standard stacked dashboard cards.
- **Proposed Evolution:** Adopt the same 3-column split console layout as `digitalTwin` and `tracking` (Left: Subsystem tree / equipment list, Center: primary visual surface / spatial canvas, Right: contextual inspector drawer).
- **Benefit:** Creates an identical mental model across all 19 views for mission controllers.

### 2. Tabular Column Visibility & Resizing Controls
- **Current State:** The data tables in `inventory`, `maintenance`, `alerts`, `personnel`, and `roles` have static column layouts.
- **Proposed Evolution:** Provide an optional "Column Visibility" dropdown on table headers to allow analysts on smaller viewports (e.g. tablets or 1080p screens) to toggle optional columns without losing any underlying data.
- **Benefit:** Maximizes high-density visibility in mobile/field scenarios.

### 3. Server-Sent Events (SSE) or WebSocket Protocol for Telemetry
- **Current State:** Telemetry uses a client-side simulated engine with polling intervals (`3s` default in settings).
- **Proposed Evolution:** Upgrade the Express backend to push live MongoDB change streams or MQTT polar telemetry over a persistent WebSocket/SSE connection.
- **Benefit:** Sub-100ms real-time latency for emergency incident broadcasts and Convoy Cross-Track Error (XTE) warnings.

### 4. Direct SVG Vector Icons in Place of External Font Loads
- **Current State:** Lucide and Google Fonts (`Plus Jakarta Sans`, `JetBrains Mono`) are loaded via CDN in `index.html`.
- **Proposed Evolution:** Pre-bundle SVG glyphs and subset monospace WOFF2 files locally into `Frontend/public/fonts/`.
- **Benefit:** Ensures 100% offline air-gapped capability at actual polar stations where satellite internet latency exceeds 600ms or drops during geomagnetic storms.
