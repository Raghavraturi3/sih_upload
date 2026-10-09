# GEOSPATIAL OPERATIONS CONSOLE — DESIGN SYSTEM SPECIFICATION
**Bharat-Maitri Antarctic Digital Twin Platform**  
*Document Version: 2.0 | Instrument-Grade Geospatial & Telemetry Design System*

---

## 1. VISUAL RATIONALE (5 SENTENCES)
1. This application is an instrument-grade mission console engineered for polar operations and satellite analysts who require immediate situational clarity under high cognitive load.
2. The imagery and spatial data are the primary focal surfaces; therefore, the interface recedes into a low-chroma, deep-slate shell with a faint cyan-tinted baseline rather than competing with high-contrast SAR or map layers.
3. Color is strictly functional rather than decorative, using a single signal accent for focus and interaction states, paired with an accessible, glyph-backed semantic scale for certainty and risk levels.
4. Structural clarity is achieved through crisp hairline dividers, a rigorous 4px rhythmic grid, and background step hierarchy rather than diffuse drop shadows or blurred glass surfaces.
5. High-density numeric readouts utilize tabular monospace figures across all coordinates, power loads, timestamps, and sensor telemetry to eliminate row shimmer and provide terminal-grade precision.

---

## 2. DESIGN TOKENS ARCHITECTURE (`tokens.css`)

### 2.1 Surfaces & Depth (Dark Shell Default + Light Theme Parity)
```css
/* Dark Shell (Default) */
:root {
  --bg-base: #080c10;       /* Deepest canvas, faint green-cyan cast */
  --bg-subtle: #0b1118;     /* Inset surfaces, table headers */
  --bg-raised: #0f1722;     /* Cards, inspector panels, drawers */
  --bg-overlay: #15202e;    /* Modals, dropdown menus, popovers */
  --bg-hover: #1b283a;      /* Interactive hover step */
  --bg-active: #223249;     /* Pressed / active selection */

  /* Hairline Borders — Structural, Not Shadows */
  --line-subtle: rgba(255, 255, 255, 0.07);
  --line-medium: rgba(255, 255, 255, 0.12);
  --line-strong: rgba(255, 255, 255, 0.22);
  --line-accent: rgba(0, 229, 255, 0.5);

  /* Typography Colors (3 Levels) */
  --text-primary: #f0f4f8;   /* Primary headings and critical values */
  --text-secondary: #94a3b8; /* Secondary copy, table headers, labels */
  --text-muted: #64748b;     /* Inactive hints, timestamps, units */

  /* The Single Decisive Accent */
  --accent-signal: #00e5ff;       /* Signal cyan for focus, active routes, primary targets */
  --accent-signal-hover: #33ebff;
  --accent-signal-dim: rgba(0, 229, 255, 0.12);
  --accent-signal-border: rgba(0, 229, 255, 0.35);

  /* Semantic Scale (Colorblind-Safe & Grayscale-Distinguishable with Glyphs) */
  --sev-confirmed: #10b981;     /* Nominal / Verified / Safe */
  --sev-confirmed-bg: rgba(16, 185, 129, 0.12);
  --sev-probable: #f59e0b;      /* Warning / Caution / Advisory */
  --sev-probable-bg: rgba(245, 158, 11, 0.12);
  --sev-emergency: #ef4444;     /* Critical / Incident / Denied */
  --sev-emergency-bg: rgba(239, 68, 68, 0.12);
  --sev-stale: #64748b;         /* Stale data / Offline / Archived */
  --sev-stale-bg: rgba(100, 116, 139, 0.12);

  /* Shadows — Overlays & Popovers Only */
  --shadow-overlay: 0 12px 32px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px var(--line-medium);
  --shadow-popover: 0 6px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--line-subtle);
}

/* Light Theme Mode (Dual Definition using Identical Token Names) */
[data-theme="light"] {
  --bg-base: #edf2f7;
  --bg-subtle: #e2e8f0;
  --bg-raised: #ffffff;
  --bg-overlay: #f8fafc;
  --bg-hover: #e2e8f0;
  --bg-active: #cbd5e1;

  --line-subtle: rgba(0, 0, 0, 0.08);
  --line-medium: rgba(0, 0, 0, 0.16);
  --line-strong: rgba(0, 0, 0, 0.28);
  --line-accent: rgba(0, 150, 180, 0.6);

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;

  --accent-signal: #0088a3;
  --accent-signal-hover: #006f85;
  --accent-signal-dim: rgba(0, 136, 163, 0.1);
  --accent-signal-border: rgba(0, 136, 163, 0.35);

  --sev-confirmed: #059669;
  --sev-confirmed-bg: rgba(5, 150, 105, 0.1);
  --sev-probable: #d97706;
  --sev-probable-bg: rgba(217, 119, 6, 0.1);
  --sev-emergency: #dc2626;
  --sev-emergency-bg: rgba(220, 38, 38, 0.1);
  --sev-stale: #475569;
  --sev-stale-bg: rgba(71, 85, 105, 0.1);

  --shadow-overlay: 0 12px 32px -4px rgba(15, 23, 42, 0.16), 0 0 0 1px var(--line-medium);
  --shadow-popover: 0 6px 20px -2px rgba(15, 23, 42, 0.12), 0 0 0 1px var(--line-subtle);
}
```

---

## 3. TYPOGRAPHY SPECIFICATION
- **Families:**
  - UI Text: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Numeric & Geodetic Data: `'JetBrains Mono', 'SF Mono', Consolas, monospace`
- **Tabular Numerics:** All numeric spans and table cells declare `font-variant-numeric: tabular-nums`.
- **Type Scale:**
  - Micro (10px): Footers, projection codes, copyright.
  - Caption (11px): Small caps section headers, metadata tags (`letter-spacing: 0.05em; text-transform: uppercase`).
  - Small (12px): Table secondary cells, tooltips, axis labels.
  - Body UI (13.5px): Standard label, table primary text, button text (`letter-spacing: -0.005em`).
  - Medium (15px): Panel subheadings, card titles.
  - Large (18px): Top bar title, key metric displays.
  - H1 / Page Heading (22px): Page title (`font-weight: 700; letter-spacing: -0.015em`).

---

## 4. SPACING, GEOMETRY & DENSITY
- **Base Grid:** Strict 4px rhythm (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`).
- **Radii:** Restrained 4px to 6px maximum. No pill cards. Badges and chips use 3px or 4px with a square semantic status dot.
- **Table Density:** Row height 34px–36px. Cell padding `8px 12px`.
- **Persistent Density Toggle:**
  - `data-density="compact"`: 28px row height, 6px 8px padding, 12px font.
  - `data-density="comfortable"` (default): 36px row height, 8px 12px padding, 13px font.

---

## 5. APPLICATION SHELL ARCHITECTURE
- **Top Bar (48px):**
  - Left: Product mark (`BHARAT MATRI // OPERATIONS`), station selector, active geodetic reference pill (`EPSG:3031 / WGS84`).
  - Center: Live telemetry synchronization status (`● TELEMETRY NOMINAL`), MongoDB database status pill.
  - Right: Command Palette trigger (`Ctrl+K`), Incident Broadcast trigger, Admin AI Copilot trigger, Theme switch (`Dark / Light`), User avatar chip.
- **Left Rail (56px Collapsed / 220px Expanded):**
  - Section headers in uppercase 10px tracked type.
  - Active route: 2px accent indicator along the left edge + `--bg-active` step.
  - Icons: Crisp 16px geometric stroke icons (1.5px consistent stroke width).
- **Split Region:**
  - Primary Surface: Map / 3D Canvas / Operations Table.
  - Inspector: Collapsible right rail with zero layout shift (slide/crossfade via transform/opacity).
  - Bottom Drawer: Collapsible incident feed or corridor waypoint profile.

---

## 6. MOTION TIMINGS & EASING CONTRACT
- Micro-state transitions (buttons, hovers): `120ms ease-out`
- Panels & drawers open/close: `180ms cubic-bezier(0.2, 0, 0, 1)`
- Route change cross-fade: `240ms cubic-bezier(0.2, 0, 0, 1)`
- Never animate `width`, `height`, `top`, `left`, `right`, or `bottom`. Animate `transform` and `opacity` exclusively.
- Respect `prefers-reduced-motion: reduce`: instantly set `transition: none; animation: none;`.

---

## 7. ANTI-GENERIC CHECKLIST VALIDATION
- [x] Zero purple-to-pink gradients.
- [x] Zero glassmorphic translucent blurs (`backdrop-filter: blur()`).
- [x] Zero floating drop shadows on cards.
- [x] Zero emojis in headers or icons; clean SVG icons and deliberate mono glyphs only.
- [x] Tabular figures (`tabular-nums`) on all numeric columns.
- [x] Full keyboard navigation (`Tab`, `Enter`, `Esc`, `Ctrl+K`).
