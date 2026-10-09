import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import { Telemetry } from './models/Telemetry.js';
import { DigitalTwinNode } from './models/DigitalTwinNode.js';
import { Incident } from './models/Incident.js';
import { Personnel } from './models/Personnel.js';
import { Logistics } from './models/Logistics.js';
import { Inventory } from './models/Inventory.js';
import { User } from './models/User.js';
import { AuditLog } from './models/AuditLog.js';

export const initialTelemetry = {
  station: {
    name: 'Amundsen-Scott Base Alpha / Maitri Station',
    code: 'ASB-01',
    latitude: '-90.0000° S',
    longitude: '0.0000° E',
    elevation: '2,835m',
    status: 'OPERATIONAL',
    latency: 18,
    syncQuality: 100
  },
  kpis: {
    powerKw: 142.8,
    powerCapacityKw: 180.0,
    tempAmbient: -34.2,
    windChill: -48.5,
    windSpeedKnots: 42,
    activePersonnel: 48,
    totalCapacity: 60,
    activeAlertsCount: 3,
    solarOutputKw: 48.2,
    windOutputKw: 74.6,
    batteryChargePercent: 94
  }
};

export const initialNodes = [
  { nodeId: 'node-1', name: 'Primary Life Support Hub', type: 'HABITATION', temp: 21.5, pressure: 101.3, o2Level: 20.9, status: 'NORMAL', load: 64, x: 280, y: 160 },
  { nodeId: 'node-2', name: 'Microgrid Nuclear Reactor', type: 'POWER', temp: 68.4, pressure: 240.5, o2Level: 0, status: 'NORMAL', load: 78, x: 450, y: 120 },
  { nodeId: 'node-3', name: 'Wind Turbine Array Alpha', type: 'ENERGY', temp: -32.0, pressure: 0, o2Level: 0, status: 'NORMAL', load: 88, x: 580, y: 220 },
  { nodeId: 'node-4', name: 'Cryogenic Ice Core Vault', type: 'RESEARCH', temp: -54.0, pressure: 98.2, o2Level: 19.5, status: 'WARNING', load: 92, x: 180, y: 240 },
  { nodeId: 'node-5', name: 'Hydroponic Biomass Chamber', type: 'AGRICULTURE', temp: 24.0, pressure: 102.0, o2Level: 22.1, status: 'NORMAL', load: 50, x: 340, y: 280 },
  { nodeId: 'node-6', name: 'Deep Space Telecom Array', type: 'COMMUNICATIONS', temp: -18.2, pressure: 100.8, o2Level: 0, status: 'NORMAL', load: 42, x: 490, y: 310 }
];

export const initialIncidents = [
  { incidentId: 'INC-2026-089', title: 'Cryo-Vault Secondary Chiller Thermal Spike', severity: 'HIGH', sector: 'Research Sector B', timestamp: '10 mins ago', status: 'INVESTIGATING', assignee: 'Dr. E. Vance' },
  { incidentId: 'INC-2026-088', title: 'Wind Turbine #3 Gearbox Ice Accumulation', severity: 'MEDIUM', sector: 'Energy Array Outer Ring', timestamp: '42 mins ago', status: 'IN_PROGRESS', assignee: 'K. Schmidt' },
  { incidentId: 'INC-2026-087', title: 'Satellite Uplink Frequency Hopping Drift', severity: 'LOW', sector: 'Telecom Mast', timestamp: '2 hours ago', status: 'MONITORING', assignee: 'S. Patel' }
];

export const initialPersonnel = [
  { personnelId: 'PER-01', name: 'Dr. Kashish Sharma', role: 'System Administrator & Base Commander', sector: 'Command Center', duty: 'ON_DUTY', medical: 'CLEARED', contact: 'Sat-Ext #101' },
  { personnelId: 'PER-02', name: 'Ing. Elena Rostova', role: 'Lead Power & Microgrid Specialist', sector: 'Reactor Hub', duty: 'ON_DUTY', medical: 'CLEARED', contact: 'Sat-Ext #204' },
  { personnelId: 'PER-03', name: 'Dr. Marcus Vance', role: 'Chief Cryo Glaciologist', sector: 'Ice Vault', duty: 'ON_CALL', medical: 'CLEARED', contact: 'Sat-Ext #312' },
  { personnelId: 'PER-04', name: 'Tarek Al-Mansoor', role: 'Life Support Logistics Lead', sector: 'Habitation Unit A', duty: 'ON_DUTY', medical: 'CLEARED', contact: 'Sat-Ext #118' },
  { personnelId: 'PER-05', name: 'Sven Lindqvist', role: 'Structural Mechanical Engineer', sector: 'Maintenance Bay', duty: 'RESTING', medical: 'RESTRICTED', contact: 'Sat-Ext #405' }
];

export const initialLogistics = [
  { logisticsId: 'LOG-881', vehicle: 'LC-130 Hercules (NY-804)', type: 'AIRFLIGHT', cargo: 'Medical Rations & Fuel Cells', origin: 'Christchurch (NZ)', ETA: '14 hrs', status: 'IN_FLIGHT', tempMonitored: true },
  { logisticsId: 'LOG-882', vehicle: 'R/V Nathaniel B. Palmer', type: 'ICEBREAKER', cargo: 'Heavy Drilling Equipment', origin: 'McMurdo Station', ETA: '2 Days', status: 'EN_ROUTE', tempMonitored: false },
  { logisticsId: 'LOG-883', vehicle: 'Snowcat Convoy Bravo', type: 'OVERLAND', cargo: 'Ozone Sensor Calibration Kits', origin: 'Outpost Dome C', ETA: '5 hrs', status: 'ARRIVING', tempMonitored: true }
];

export const initialInventory = [
  { itemId: 'INV-101', name: 'Polar Grade Jet-A1 Fuel', qty: '84,500 L', capacity: '100,000 L', percentage: 84, status: 'NORMAL', category: 'Fuel' },
  { itemId: 'INV-102', name: 'Emergency Medical Trauma Kits', qty: '42 Units', capacity: '50 Units', percentage: 84, status: 'NORMAL', category: 'Medical' },
  { itemId: 'INV-103', name: 'High-Calorie Freeze Dried Rations', qty: '1,250 Days', capacity: '1,500 Days', percentage: 83, status: 'NORMAL', category: 'Provisions' },
  { itemId: 'INV-104', name: 'Liquid Nitrogen Coolant Canisters', qty: '12 Cylinders', capacity: '40 Cylinders', percentage: 30, status: 'WARNING', category: 'Research Supplies' },
  { itemId: 'INV-105', name: 'Thermal Insulation Seals (Type-IV)', qty: '8 Spare Packs', capacity: '30 Spare Packs', percentage: 26, status: 'WARNING', category: 'Maintenance' }
];

export async function getHashedUsers() {
  const salt = await bcrypt.genSalt(10);
  return [
    {
      employeeId: 'ADM001',
      name: 'Dr. Kashish Sharma',
      email: 'admin@antarctic.gov.in',
      passwordHash: await bcrypt.hash('Admin@2026', salt),
      role: 'ADMIN',
      department: 'ALL',
      station: 'ALL',
      permissions: ['admin.all', 'users.manage', 'system.config', 'telemetry.override', 'incidents.broadcast'],
      status: 'ACTIVE'
    },
    {
      employeeId: 'ENG001',
      name: 'Ing. Elena Rostova',
      email: 'energy@antarctic.gov.in',
      passwordHash: await bcrypt.hash('Energy@2026', salt),
      role: 'EMPLOYEE',
      department: 'ENERGY',
      station: 'MAITRI',
      permissions: ['energy.view', 'energy.manage', 'energy.alerts', 'energy.reports'],
      status: 'ACTIVE'
    },
    {
      employeeId: 'LOG001',
      name: 'Tarek Al-Mansoor',
      email: 'logistics@antarctic.gov.in',
      passwordHash: await bcrypt.hash('Logistics@2026', salt),
      role: 'EMPLOYEE',
      department: 'LOGISTICS',
      station: 'BHARATI',
      permissions: ['logistics.view', 'logistics.manage', 'logistics.tracking', 'logistics.inventory', 'logistics.reports'],
      status: 'ACTIVE'
    },
    {
      employeeId: 'ENV001',
      name: 'Dr. Ananya Roy',
      email: 'environment@antarctic.gov.in',
      passwordHash: await bcrypt.hash('Env@2026', salt),
      role: 'EMPLOYEE',
      department: 'ENVIRONMENT',
      station: 'MAITRI',
      permissions: ['environment.view', 'environment.sensors', 'environment.alerts', 'environment.reports'],
      status: 'ACTIVE'
    },
    {
      employeeId: 'INF001',
      name: 'Sven Lindqvist',
      email: 'infra@antarctic.gov.in',
      passwordHash: await bcrypt.hash('Infra@2026', salt),
      role: 'EMPLOYEE',
      department: 'INFRASTRUCTURE',
      station: 'MAITRI',
      permissions: ['infrastructure.view', 'infrastructure.manage', 'infrastructure.maintenance', 'infrastructure.reports'],
      status: 'ACTIVE'
    },
    {
      employeeId: 'RES001',
      name: 'Dr. Marcus Vance',
      email: 'research@antarctic.gov.in',
      passwordHash: await bcrypt.hash('Research@2026', salt),
      role: 'EMPLOYEE',
      department: 'RESEARCH',
      station: 'BHARATI',
      permissions: ['research.view', 'research.experiments', 'research.reports'],
      status: 'ACTIVE'
    }
  ];
}

export async function autoSeedIfEmpty() {
  const telemetryCount = await Telemetry.countDocuments();
  if (telemetryCount === 0) {
    await Telemetry.create(initialTelemetry);
    console.log('[Seed] Telemetry collection seeded.');
  }

  const nodesCount = await DigitalTwinNode.countDocuments();
  if (nodesCount === 0) {
    await DigitalTwinNode.insertMany(initialNodes);
    console.log('[Seed] DigitalTwinNodes collection seeded.');
  }

  const incidentsCount = await Incident.countDocuments();
  if (incidentsCount === 0) {
    await Incident.insertMany(initialIncidents);
    console.log('[Seed] Incidents collection seeded.');
  }

  const personnelCount = await Personnel.countDocuments();
  if (personnelCount === 0) {
    await Personnel.insertMany(initialPersonnel);
    console.log('[Seed] Personnel collection seeded.');
  }

  const logisticsCount = await Logistics.countDocuments();
  if (logisticsCount === 0) {
    await Logistics.insertMany(initialLogistics);
    console.log('[Seed] Logistics collection seeded.');
  }

  const inventoryCount = await Inventory.countDocuments();
  if (inventoryCount === 0) {
    await Inventory.insertMany(initialInventory);
    console.log('[Seed] Inventory collection seeded.');
  }

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const defaultUsers = await getHashedUsers();
    await User.insertMany(defaultUsers);
    console.log('[Seed] Initial RBAC users seeded into MongoDB.');

    await AuditLog.create({
      employeeId: 'SYSTEM',
      userName: 'System Initialization',
      action: 'USER_CREATED',
      details: 'Initial system users and RBAC roles seeded successfully',
      station: 'ALL'
    });
  }
}

// Standalone runner
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      console.log('[Seed] Connected to MongoDB. Seeding collections...');
      
      await Telemetry.deleteMany({});
      await DigitalTwinNode.deleteMany({});
      await Incident.deleteMany({});
      await Personnel.deleteMany({});
      await Logistics.deleteMany({});
      await Inventory.deleteMany({});
      await User.deleteMany({});

      await Telemetry.create(initialTelemetry);
      await DigitalTwinNode.insertMany(initialNodes);
      await Incident.insertMany(initialIncidents);
      await Personnel.insertMany(initialPersonnel);
      await Logistics.insertMany(initialLogistics);
      await Inventory.insertMany(initialInventory);
      
      const defaultUsers = await getHashedUsers();
      await User.insertMany(defaultUsers);

      await AuditLog.create({
        employeeId: 'SYSTEM',
        userName: 'System Administrator',
        action: 'USER_CREATED',
        details: 'Initial database collections and secure RBAC user accounts reset and seeded.',
        station: 'ALL'
      });

      console.log('✅ [Seed] Successfully seeded all collections and RBAC users into MongoDB (database: antarctic_digital_twin)!');
      process.exit(0);
    } catch (err) {
      console.error('❌ [Seed] Error during seeding:', err);
      process.exit(1);
    }
  })();
}
