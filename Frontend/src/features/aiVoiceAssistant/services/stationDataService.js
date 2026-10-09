// Antarctic Stations Data Service (Maitri & Bharati Operations)
import { STATIONS } from '../types.js';

class StationDataService {
  constructor() {
    this.stations = JSON.parse(JSON.stringify(STATIONS));

    this.infrastructureAssets = [
      { id: 'ASSET-BH-GEN02', station: 'bharati', name: 'Combined Heat & Power Generator #02', type: 'ENERGY', status: 'CRITICAL', health: 48, location: 'Power Plant Bay B', lastInspection: '2026-09-02', notes: 'Bearing vibration exceeding threshold. Turbocharger seal degradation.' },
      { id: 'ASSET-BH-GEN01', station: 'bharati', name: 'Primary CHP Generator #01', type: 'ENERGY', status: 'NOMINAL', health: 94, location: 'Power Plant Bay A', lastInspection: '2026-08-28', notes: 'Operating normally at 72kW load.' },
      { id: 'ASSET-BH-HEAT04', station: 'bharati', name: 'Central Hydronic Habitat Heating Unit #04', type: 'INFRASTRUCTURE', status: 'ATTENTION', health: 65, location: 'Living Module Sub-deck', lastInspection: '2026-09-04', notes: 'Secondary heat exchange loop throttled by 25% due to reduced thermal output from Gen #02.' },
      { id: 'ASSET-BH-COM01', station: 'bharati', name: 'High-Latitude Ku-Band Satcom Terminal', type: 'COMMUNICATIONS', status: 'NOMINAL', health: 98, location: 'Radome Roof Array', lastInspection: '2026-09-01', notes: 'Uplink latency 540ms.' },
      { id: 'ASSET-MT-GEN01', station: 'maitri', name: 'Maitri Heavy Duty Diesel Generator #01', type: 'ENERGY', status: 'NOMINAL', health: 91, location: 'Generator House', lastInspection: '2026-08-30', notes: 'Continuous prime power operation.' },
      { id: 'ASSET-MT-WIND02', station: 'maitri', name: 'Polar Wind Turbine Mast #02', type: 'ENERGY', status: 'ATTENTION', health: 78, location: 'Ridge Crest 300m', lastInspection: '2026-08-25', notes: 'Ice accumulation on nacelle. Mast lubrication due.' },
      { id: 'ASSET-MT-WATER', station: 'maitri', name: 'Lake Priyadarshini Water Extraction Pump Station', type: 'LIFE_SUPPORT', status: 'NOMINAL', health: 92, location: 'Priyadarshini Shore', lastInspection: '2026-09-05', notes: 'Thermal tracing active. Flow rate 14.2 L/min.' }
    ];

    this.inventoryItems = [
      { id: 'INV-SP-042', station: 'bharati', name: 'Generator #02 High-Temp Turbo Bearings & Seal Kit', category: 'Spare Parts', stockQty: 0, minStock: 2, unit: 'Kit', status: 'OUT_OF_STOCK', critical: true },
      { id: 'INV-FL-001', station: 'bharati', name: 'Polar Jet-A1 Fuel (Special Antarctic Blend)', category: 'Fuel', stockQty: 32100, minStock: 25000, unit: 'Liters', status: 'LOW_WARNING', critical: true },
      { id: 'INV-MED-012', station: 'bharati', name: 'Emergency Trauma & Frostbite Plasma Packs', category: 'Medical', stockQty: 18, minStock: 15, unit: 'Units', status: 'NORMAL', critical: false },
      { id: 'INV-FL-002', station: 'maitri', name: 'Polar Grade Diesel Fuel', category: 'Fuel', stockQty: 48500, minStock: 25000, unit: 'Liters', status: 'NORMAL', critical: true },
      { id: 'INV-SP-018', station: 'maitri', name: 'Wind Turbine De-Icing Fluid & Seals', category: 'Spare Parts', stockQty: 4, minStock: 6, unit: 'Drums', status: 'BELOW_MINIMUM', critical: false },
      { id: 'INV-MED-009', station: 'maitri', name: 'Broad Spectrum Antibiotic & Surgical Kits', category: 'Medical', stockQty: 34, minStock: 20, unit: 'Units', status: 'NORMAL', critical: false }
    ];

    this.logisticsShipments = [
      { id: 'LOG-IND-901', station: 'bharati', vessel: 'R/V Bharati (Icebreaker)', type: 'ICEBREAKER', cargo: 'Bulk Fuel, Fresh Provisions & Station Spares', origin: 'Cape Town (RSA)', eta: '8 Days', status: 'EN_ROUTE', delayed: false },
      { id: 'LOG-IND-904', station: 'bharati', vessel: 'Polar Air Cargo LC-130 (Flight IA-884)', type: 'AIRCRAFT', cargo: 'Critical Generator Turbo Spares & Scientific Sensors', origin: 'Novo Airbase', eta: '48 hrs (DELAYED)', status: 'WEATHER_DELAY', delayed: true },
      { id: 'LOG-IND-898', station: 'maitri', vessel: 'Ivan Papanin Resupply Convoy', type: 'OVERLAND', cargo: 'Heavy Mechanical Equipment & Winter Rations', origin: 'Indian Bay Ice Shelf', eta: '18 hrs', status: 'APPROACHING', delayed: false }
    ];

    this.researchProjects = [
      { id: 'RES-BH-01', station: 'bharati', title: 'Deep Ice Core Paleoclimate Analysis', lead: 'Dr. Neha Verma (NCPOR)', status: 'DEGRADED', impactReason: 'Cryo-storage temperature fluctuation and lab heating throttling due to Generator #02' },
      { id: 'RES-BH-02', station: 'bharati', title: 'Atmospheric Aerosol & Ozone Monitoring', lead: 'Dr. Ankit Mukherjee', status: 'OPERATIONAL', impactReason: 'Nominal solar sensor operation' },
      { id: 'RES-MT-01', station: 'maitri', title: 'Schirmacher Oasis Hydro-biological Survey', lead: 'Dr. Rajesh Nair', status: 'OPERATIONAL', impactReason: 'Continuous water testing in Lake Priyadarshini' },
      { id: 'RES-MT-02', station: 'maitri', title: 'Geomagnetic Storms & Ionospheric Scintillation', lead: 'Dr. Sunita Kulkarni', status: 'OPERATIONAL', impactReason: 'Maitri magnetometers fully active' }
    ];

    this.maintenanceTasks = [
      { id: 'MAINT-BH-104', station: 'bharati', assetId: 'ASSET-BH-GEN02', title: 'Generator #02 Turbo Bearing Overhaul', priority: 'CRITICAL', status: 'OVERDUE', overdueDays: 4, assignee: 'Lead Eng. Vikram Joshi', blockedBy: 'INV-SP-042 (No replacement bearing on site)' },
      { id: 'MAINT-MT-088', station: 'maitri', assetId: 'ASSET-MT-WIND02', title: 'Wind Turbine Nacelle De-Icing & Bearing Grease', priority: 'MEDIUM', status: 'SCHEDULED', dueDate: 'Tomorrow 09:00 UTC', assignee: 'Eng. Devendra Rathore' }
    ];

    this.alerts = [
      {
        id: 'ALT-BH-001',
        station: 'bharati',
        level: 'CRITICAL',
        title: 'Generator #02 Thermal Overheating & Bearing Stress',
        department: 'ENERGY / INFRASTRUCTURE',
        timestamp: '14 mins ago',
        description: 'CHP Generator #02 bearing vibration exceeds 8.4 mm/s; exhaust manifold temp reached 490°C.',
        downstream: 'Reduces heat supply to habitat heating loop #04; forces station to run auxiliary diesel heaters; increases daily fuel burn rate by 18%.'
      },
      {
        id: 'ALT-BH-002',
        station: 'bharati',
        level: 'CRITICAL',
        title: 'Zero Stock for Generator #02 Replacement Bearing',
        department: 'INVENTORY / LOGISTICS',
        timestamp: '1 hour ago',
        description: 'Inventory query confirmed stock is 0. Replacement bearing shipment delayed on Flight IA-884.',
        downstream: 'Maintenance cannot proceed until emergency supply arrives.'
      },
      {
        id: 'ALT-MT-001',
        station: 'maitri',
        level: 'WARNING',
        title: 'Catabatic Storm Warning - Schirmacher Oasis',
        department: 'ENVIRONMENT',
        timestamp: '3 hours ago',
        description: 'Forecasted wind gusts up to 55 knots over next 18 hours. Wind chill dropping to -42°C.',
        downstream: 'External field research travel restricted. Station outdoor operations locked down.'
      }
    ];

    this.emergencyRequests = [
      {
        id: 'ESR-2026-014',
        station: 'Bharati',
        item: 'Generator #02 High-Temp Turbo Bearings & Seal Kit',
        qty: '2 Kits',
        priority: 'CRITICAL',
        status: 'PENDING_LOGISTICS_REVIEW',
        timestamp: '2026-09-08 18:30 UTC',
        requester: 'Admin AI Copilot (Authorized by Dr. Kashish Sharma)'
      }
    ];

    this.auditLog = [
      {
        id: 'AUD-001',
        timestamp: '2026-09-08 14:15:02',
        user: 'Dr. Kashish Sharma (Base Commander)',
        command: 'System Boot & Telemetry Diagnostics',
        action: 'system_health_check',
        result: 'SUCCESS',
        risk: 'LOW',
        confirmationRequired: false
      }
    ];
  }

  // Getters
  getStations() {
    return this.stations;
  }

  getStation(stationId) {
    const key = stationId.toLowerCase().includes('maitri') ? 'MAITRI' :
                stationId.toLowerCase().includes('bharati') ? 'BHARATI' : null;
    return key ? this.stations[key] : null;
  }

  getAlerts(stationId = null) {
    if (!stationId) return this.alerts;
    const s = stationId.toLowerCase();
    return this.alerts.filter(a => a.station.includes(s));
  }

  getCriticalAlerts() {
    return this.alerts.filter(a => a.level === 'CRITICAL');
  }

  getAssets(stationId = null) {
    if (!stationId) return this.infrastructureAssets;
    const s = stationId.toLowerCase();
    return this.infrastructureAssets.filter(a => a.station.includes(s));
  }

  getLowStockItems() {
    return this.inventoryItems.filter(i => i.stockQty <= i.minStock || i.status === 'OUT_OF_STOCK');
  }

  getLogistics(stationId = null) {
    if (!stationId) return this.logisticsShipments;
    const s = stationId.toLowerCase();
    return this.logisticsShipments.filter(l => l.station.includes(s));
  }

  getResearchProjects(stationId = null) {
    if (!stationId) return this.researchProjects;
    const s = stationId.toLowerCase();
    return this.researchProjects.filter(r => r.station.includes(s));
  }

  getMaintenanceTasks(stationId = null) {
    if (!stationId) return this.maintenanceTasks;
    const s = stationId.toLowerCase();
    return this.maintenanceTasks.filter(m => m.station.includes(s));
  }

  getAuditLog() {
    return this.auditLog;
  }

  // Authorized Action: Create Emergency Supply Request
  createEmergencySupplyRequest({ station, item, qty, priority = 'CRITICAL', user = 'Dr. Kashish Sharma' }) {
    const id = `ESR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newRequest = {
      id,
      station: station || 'Bharati',
      item: item || 'Generator Spare Part & Turbo Bearings',
      qty: qty || '2 Units',
      priority,
      status: 'SUBMITTED_TO_AIRLIFT_COMMAND',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      requester: `Authorized by ${user}`
    };

    this.emergencyRequests.unshift(newRequest);

    // Record in Audit Log
    this.recordAudit({
      user,
      command: `Create Emergency Supply Request for ${newRequest.item} (${newRequest.station})`,
      action: 'createSupplyRequest',
      result: 'SUCCESS',
      risk: 'HIGH',
      confirmationRequired: true,
      details: newRequest
    });

    return newRequest;
  }

  // Authorized Action: Schedule Maintenance Task
  scheduleMaintenanceTask({ station, assetId, title, priority = 'HIGH', user = 'Dr. Kashish Sharma' }) {
    const id = `MAINT-${station.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const task = {
      id,
      station: station || 'bharati',
      assetId: assetId || 'ASSET-BH-GEN02',
      title: title || 'Emergency Generator Overhaul Inspection',
      priority,
      status: 'SCHEDULED',
      dueDate: 'Immediate Priority',
      assignee: 'Rapid Response Engineering Team'
    };

    this.maintenanceTasks.unshift(task);

    this.recordAudit({
      user,
      command: `Schedule Maintenance: ${task.title}`,
      action: 'scheduleMaintenanceTask',
      result: 'SUCCESS',
      risk: 'MEDIUM',
      confirmationRequired: true,
      details: task
    });

    return task;
  }

  // Record Audit Entry
  recordAudit(entry) {
    this.auditLog.unshift({
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: entry.user || 'Admin',
      command: entry.command || 'Unknown Command',
      action: entry.action || 'general_query',
      result: entry.result || 'SUCCESS',
      risk: entry.risk || 'LOW',
      confirmationRequired: entry.confirmationRequired || false,
      details: entry.details || null
    });
  }
}

export const stationData = new StationDataService();
