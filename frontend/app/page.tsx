"use client";

import GlobalScene from "../components/scenes/GlobalScene";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  ChevronRight,
  CloudSnow,
  Cpu,
  Gauge,
  Radio,
  Satellite,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";

const TwinScene = dynamic(
  () => import("@/components/polar/TwinScene"),
  {
    ssr: false,
  }
);

const stations = [
  {
    name: "Maitri",
    code: "MAI-01",
    health: 92,
    status: "NORMAL",
    temperature: "-31°C",
  },
  {
    name: "Bharati",
    code: "BHA-02",
    health: 87,
    status: "WARNING",
    temperature: "-28°C",
  },
  {
    name: "Dakshin Gangotri",
    code: "DGS-03",
    health: 96,
    status: "NORMAL",
    temperature: "-34°C",
  },
];

export default function Home() {
  return (
    <main className="polar-shell">

      {/* BACKGROUND 3D WORLD */}
      <div className="world-layer">
        <GlobalScene />
      </div>

      {/* ATMOSPHERIC OVERLAY */}
      <div className="scanlines" />
      <div className="vignette" />

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-symbol">
            <div />
          </div>

          <div>
            <div className="brand-name">POLAR TWIN</div>
            <div className="brand-subtitle">
              ANTARCTIC DIGITAL SYSTEM
            </div>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-label">OPERATIONS</div>

          <NavItem
            icon={<Activity size={16} />}
            label="Dashboard"
            active
          />

          <NavItem
            icon={<Radio size={16} />}
            label="Stations"
          />

          <NavItem
            icon={<Cpu size={16} />}
            label="Equipment"
          />

          <NavItem
            icon={<Zap size={16} />}
            label="Energy"
          />

          <NavItem
            icon={<Satellite size={16} />}
            label="Satellites"
          />

          <NavItem
            icon={<CloudSnow size={16} />}
            label="Environment"
          />
        </div>

        <div className="nav-section">
          <div className="nav-label">INTELLIGENCE</div>

          <NavItem
            icon={<AlertTriangle size={16} />}
            label="Alerts"
            alert
          />

          <NavItem
            icon={<Gauge size={16} />}
            label="AI Insights"
          />
        </div>

        <div className="sidebar-bottom">

          <div className="connection">
            <span className="pulse-dot" />
            <span>NETWORK ONLINE</span>
          </div>

          <div className="system-id">
            SYSTEM ID
            <strong>PT-ANT-001</strong>
          </div>

        </div>

      </aside>

      {/* MAIN INTERFACE */}
      <section className="interface">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <div className="eyebrow">
              ANTARCTIC OPERATIONS CENTER
            </div>

            <h1>
              Station Overview
            </h1>
          </div>

          <div className="top-status">

            <div className="live-indicator">
              <span />
              LIVE
            </div>

            <div className="utc">
              UTC 14:32:08
            </div>

          </div>

        </header>

        {/* 3D WORLD CONTROLS */}
        <div className="world-controls">

          <button className="world-control active">
            GLOBAL
          </button>

          <button className="world-control">
            STATIONS
          </button>

          <button className="world-control">
            WEATHER
          </button>

          <button className="world-control">
            SATELLITES
          </button>

        </div>

        {/* STATION HUD */}
        <div className="station-hud">

          <div className="hud-title">
            <span className="hud-line" />
            STATION NETWORK
          </div>

          <div className="station-grid">

            {stations.map((station, index) => (
              <StationCard
                key={station.code}
                station={station}
                index={index}
              />
            ))}

          </div>

        </div>

        {/* TELEMETRY */}
        <div className="telemetry">

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                LIVE TELEMETRY
              </span>

              <h2>
                Environmental Conditions
              </h2>
            </div>

            <div className="telemetry-source">
              <span />
              SATELLITE FEED
            </div>
          </div>

          <div className="metrics">

            <Metric
              icon={<Thermometer size={18} />}
              label="TEMPERATURE"
              value="-31.4"
              unit="°C"
              trend="-2.4%"
            />

            <Metric
              icon={<Wind size={18} />}
              label="WIND SPEED"
              value="24.8"
              unit="km/h"
              trend="+4.1%"
            />

            <Metric
              icon={<Gauge size={18} />}
              label="PRESSURE"
              value="982"
              unit="hPa"
              trend="-0.8%"
            />

            <Metric
              icon={<BatteryCharging size={18} />}
              label="GRID LOAD"
              value="68"
              unit="%"
              trend="+2.2%"
            />

          </div>

        </div>

        {/* BOTTOM INTELLIGENCE */}
        <div className="bottom-grid">

          <div className="panel energy-panel">

            <PanelHeader
              title="ENERGY SYSTEM"
              subtitle="24H LOAD PROFILE"
            />

            <div className="energy-chart">

              <div className="chart-bars">
                {Array.from({ length: 28 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="chart-bar"
                    initial={{ height: 0 }}
                    animate={{
                      height: `${25 + Math.sin(i * 0.7) * 20 + Math.random() * 35}%`,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.025,
                    }}
                  />
                ))}
              </div>

              <div className="chart-labels">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00</span>
              </div>

            </div>

          </div>

          <div className="panel alert-panel">

            <PanelHeader
              title="ACTIVE ALERTS"
              subtitle="SYSTEM MONITOR"
            />

            <div className="alert-item warning">

              <div className="alert-icon">
                <AlertTriangle size={17} />
              </div>

              <div className="alert-content">
                <strong>
                  Bharati power fluctuation
                </strong>

                <span>
                  Grid load exceeded expected threshold.
                </span>
              </div>

              <ChevronRight size={17} />

            </div>

            <div className="alert-item normal">

              <div className="alert-icon">
                <Satellite size={17} />
              </div>

              <div className="alert-content">
                <strong>
                  Satellite connection stable
                </strong>

                <span>
                  All orbital feeds operational.
                </span>
              </div>

              <ChevronRight size={17} />

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}


/* -------------------------------- */
/* SMALL COMPONENTS                 */
/* -------------------------------- */

function NavItem({
  icon,
  label,
  active = false,
  alert = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  alert?: boolean;
}) {
  return (
    <div className={`nav-item ${active ? "active" : ""}`}>

      <span className="nav-icon">
        {icon}
      </span>

      <span>{label}</span>

      {alert && (
        <span className="alert-count">
          03
        </span>
      )}

    </div>
  );
}


function Metric({
  icon,
  label,
  value,
  unit,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  trend: string;
}) {
  return (
    <motion.div
      className="metric"
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
    >

      <div className="metric-icon">
        {icon}
      </div>

      <div className="metric-label">
        {label}
      </div>

      <div className="metric-value">
        {value}
        <span>{unit}</span>
      </div>

      <div className="metric-trend">
        {trend}
      </div>

    </motion.div>
  );
}


function PanelHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="panel-header">

      <div>
        <div className="panel-title">
          {title}
        </div>

        <div className="panel-subtitle">
          {subtitle}
        </div>
      </div>

      <div className="panel-status">
        ● LIVE
      </div>

    </div>
  );
}


function StationCard({
  station,
  index,
}: {
  station: {
    name: string;
    code: string;
    health: number;
    status: string;
    temperature: string;
  };
  index: number;
}) {
  const healthy = station.status === "NORMAL";

  return (
    <motion.div
      className={`station-card ${healthy ? "" : "warning"
        }`}
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.12,
      }}
      whileHover={{
        y: -5,
      }}
    >

      <div className="station-top">

        <div>
          <div className="station-name">
            {station.name}
          </div>

          <div className="station-code">
            {station.code}
          </div>
        </div>

        <div className={`station-status ${healthy ? "healthy" : "warning-status"
          }`}>
          <span />
          {station.status}
        </div>

      </div>

      <div className="health-row">

        <span>SYSTEM HEALTH</span>

        <strong>
          {station.health}%
        </strong>

      </div>

      <div className="health-track">
        <motion.div
          className="health-fill"
          initial={{ width: 0 }}
          animate={{
            width: `${station.health}%`,
          }}
          transition={{
            duration: 1.2,
            delay: index * 0.1,
          }}
        />
      </div>

      <div className="station-footer">
        <span>{station.temperature}</span>
        <span>ONLINE</span>
      </div>

    </motion.div>
  );
}