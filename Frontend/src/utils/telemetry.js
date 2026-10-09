// Real-time Telemetry Data Engine for Antarctic Operations Digital Twin
// Connected to MongoDB (mongodb://localhost:27017/antarctic_digital_twin) via Backend API

export class TelemetryEngine {
  constructor() {
    this.subscribers = [];
    this.dbStatus = {
      isConnected: false,
      state: 'connecting',
      host: 'localhost',
      port: 27017,
      dbName: 'antarctic_digital_twin',
      uri: 'mongodb://localhost:27017'
    };

    this.state = {
      timestamp: new Date().toISOString(),
      station: {
        name: 'Amundsen-Scott Base Alpha / Maitri',
        code: 'ASB-01',
        latitude: '-90.0000° S',
        longitude: '0.0000° E',
        elevation: '2,835m',
        status: 'OPERATIONAL',
        latency: 18, // ms
        syncQuality: 100 // %
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
      },
      digitalTwinNodes: [
        { id: 'node-1', name: 'Primary Life Support Hub', type: 'HABITATION', temp: 21.5, pressure: 101.3, o2Level: 20.9, status: 'NORMAL', load: 64, x: 280, y: 160 },
        { id: 'node-2', name: 'Microgrid Nuclear Reactor', type: 'POWER', temp: 68.4, pressure: 240.5, o2Level: 0, status: 'NORMAL', load: 78, x: 450, y: 120 },
        { id: 'node-3', name: 'Wind Turbine Array Alpha', type: 'ENERGY', temp: -32.0, pressure: 0, o2Level: 0, status: 'NORMAL', load: 88, x: 580, y: 220 },
        { id: 'node-4', name: 'Cryogenic Ice Core Vault', type: 'RESEARCH', temp: -54.0, pressure: 98.2, o2Level: 19.5, status: 'WARNING', load: 92, x: 180, y: 240 },
        { id: 'node-5', name: 'Hydroponic Biomass Chamber', type: 'AGRICULTURE', temp: 24.0, pressure: 102.0, o2Level: 22.1, status: 'NORMAL', load: 50, x: 340, y: 280 },
        { id: 'node-6', name: 'Deep Space Telecom Array', type: 'COMMUNICATIONS', temp: -18.2, pressure: 100.8, o2Level: 0, status: 'NORMAL', load: 42, x: 490, y: 310 }
      ],
      incidents: [
        { id: 'INC-2026-089', title: 'Cryo-Vault Secondary Chiller Thermal Spike', severity: 'HIGH', sector: 'Research Sector B', timestamp: '10 mins ago', status: 'INVESTIGATING', assignee: 'Dr. E. Vance' },
        { id: 'INC-2026-088', title: 'Wind Turbine #3 Gearbox Ice Accumulation', severity: 'MEDIUM', sector: 'Energy Array Outer Ring', timestamp: '42 mins ago', status: 'IN_PROGRESS', assignee: 'K. Schmidt' },
        { id: 'INC-2026-087', title: 'Satellite Uplink Frequency Hopping Drift', severity: 'LOW', sector: 'Telecom Mast', timestamp: '2 hours ago', status: 'MONITORING', assignee: 'S. Patel' }
      ],
      personnel: [
        { id: 'PER-01', name: 'Dr. Kashish Sharma', role: 'System Administrator & Base Commander', sector: 'Command Center', duty: 'ON_DUTY', medical: 'CLEARED', contact: 'Sat-Ext #101' },
        { id: 'PER-02', name: 'Ing. Elena Rostova', role: 'Lead Power & Microgrid Specialist', sector: 'Reactor Hub', duty: 'ON_DUTY', medical: 'CLEARED', contact: 'Sat-Ext #204' },
        { id: 'PER-03', name: 'Dr. Marcus Vance', role: 'Chief Cryo Glaciologist', sector: 'Ice Vault', duty: 'ON_CALL', medical: 'CLEARED', contact: 'Sat-Ext #312' },
        { id: 'PER-04', name: 'Tarek Al-Mansoor', role: 'Life Support Logistics Lead', sector: 'Habitation Unit A', duty: 'ON_DUTY', medical: 'CLEARED', contact: 'Sat-Ext #118' },
        { id: 'PER-05', name: 'Sven Lindqvist', role: 'Structural Mechanical Engineer', sector: 'Maintenance Bay', duty: 'RESTING', medical: 'RESTRICTED', contact: 'Sat-Ext #405' }
      ],
      logistics: [
        { id: 'LOG-881', vehicle: 'LC-130 Hercules (NY-804)', type: 'AIRFLIGHT', cargo: 'Medical Rations & Fuel Cells', origin: 'Christchurch (NZ)', ETA: '14 hrs', status: 'IN_FLIGHT', tempMonitored: true },
        { id: 'LOG-882', vehicle: 'R/V Nathaniel B. Palmer', type: 'ICEBREAKER', cargo: 'Heavy Drilling Equipment', origin: 'McMurdo Station', ETA: '2 Days', status: 'EN_ROUTE', tempMonitored: false },
        { id: 'LOG-883', vehicle: 'Snowcat Convoy Bravo', type: 'OVERLAND', cargo: 'Ozone Sensor Calibration Kits', origin: 'Outpost Dome C', ETA: '5 hrs', status: 'ARRIVING', tempMonitored: true }
      ],
      inventory: [
        { id: 'INV-101', name: 'Polar Grade Jet-A1 Fuel', qty: '84,500 L', capacity: '100,000 L', percentage: 84, status: 'NORMAL', category: 'Fuel' },
        { id: 'INV-102', name: 'Emergency Medical Trauma Kits', qty: '42 Units', capacity: '50 Units', percentage: 84, status: 'NORMAL', category: 'Medical' },
        { id: 'INV-103', name: 'High-Calorie Freeze Dried Rations', qty: '1,250 Days', capacity: '1,500 Days', percentage: 83, status: 'NORMAL', category: 'Provisions' },
        { id: 'INV-104', name: 'Liquid Nitrogen Coolant Canisters', qty: '12 Cylinders', capacity: '40 Cylinders', percentage: 30, status: 'WARNING', category: 'Research Supplies' },
        { id: 'INV-105', name: 'Thermal Insulation Seals (Type-IV)', qty: '8 Spare Packs', capacity: '30 Spare Packs', percentage: 26, status: 'WARNING', category: 'Maintenance' }
      ]
    };

    this.initDatabaseConnection();
    this.startSimulation();
  }

  async initDatabaseConnection() {
    await this.checkDBHealth();
    await this.fetchInitialData();
    // Poll DB Health every 10 seconds
    setInterval(() => this.checkDBHealth(), 10000);
  }

  async checkDBHealth() {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        this.dbStatus = {
          isConnected: data.mongodb?.isConnected ?? true,
          state: data.mongodb?.state ?? 'connected',
          host: data.mongodb?.host ?? 'localhost',
          port: data.mongodb?.port ?? 27017,
          dbName: data.mongodb?.dbName ?? 'antarctic_digital_twin',
          uri: data.mongodb?.uri ?? 'mongodb://localhost:27017',
          collections: data.mongodb?.collections
        };
      } else {
        this.dbStatus.isConnected = false;
        this.dbStatus.state = 'error';
      }
    } catch {
      this.dbStatus.isConnected = false;
      this.dbStatus.state = 'disconnected';
    }
    this.notify();
  }

  async fetchInitialData() {
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const data = await res.json();
        if (data.station) this.state.station = { ...this.state.station, ...data.station };
        if (data.kpis) this.state.kpis = { ...this.state.kpis, ...data.kpis };
        if (data.digitalTwinNodes && data.digitalTwinNodes.length) {
          this.state.digitalTwinNodes = data.digitalTwinNodes.map(n => ({
            id: n.nodeId || n.id,
            name: n.name,
            type: n.type,
            temp: n.temp,
            pressure: n.pressure,
            o2Level: n.o2Level,
            status: n.status,
            load: n.load,
            x: n.x,
            y: n.y
          }));
        }
        if (data.incidents && data.incidents.length) {
          this.state.incidents = data.incidents.map(inc => ({
            id: inc.incidentId || inc.id,
            title: inc.title,
            severity: inc.severity,
            sector: inc.sector,
            timestamp: inc.timestamp,
            status: inc.status,
            assignee: inc.assignee
          }));
        }
        this.notify();
      }
    } catch (e) {
      console.warn('[TelemetryEngine] API fetch fallback to local cache:', e.message);
    }
  }

  getDBStatus() {
    return this.dbStatus;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.state, this.dbStatus));
  }

  startSimulation() {
    setInterval(() => {
      // Simulate micro fluctuations
      const pDelta = (Math.random() - 0.48) * 1.5;
      const tDelta = (Math.random() - 0.5) * 0.4;
      const wDelta = (Math.random() - 0.5) * 2;

      this.state.kpis.powerKw = parseFloat((this.state.kpis.powerKw + pDelta).toFixed(1));
      this.state.kpis.tempAmbient = parseFloat((this.state.kpis.tempAmbient + tDelta).toFixed(1));
      this.state.kpis.windSpeedKnots = Math.max(10, Math.min(80, Math.round(this.state.kpis.windSpeedKnots + wDelta)));
      this.state.timestamp = new Date().toISOString();

      // Update one of the node temperatures randomly
      const randomNode = this.state.digitalTwinNodes[Math.floor(Math.random() * this.state.digitalTwinNodes.length)];
      if (randomNode && randomNode.type !== 'ENERGY') {
        randomNode.temp = parseFloat((randomNode.temp + (Math.random() - 0.5) * 0.3).toFixed(1));
      }

      this.notify();
    }, 3000);
  }

  async addIncident(incident) {
    const tempId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newIncident = {
      id: tempId,
      timestamp: 'Just now',
      status: 'INVESTIGATING',
      ...incident
    };

    // Optimistic UI update
    this.state.incidents.unshift(newIncident);
    this.state.kpis.activeAlertsCount++;
    this.notify();

    // Persist to MongoDB via Backend API
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: incident.title,
          severity: incident.severity,
          sector: incident.sector,
          assignee: incident.assignee || 'Duty Officer',
          description: incident.description || ''
        })
      });
      if (res.ok) {
        const saved = await res.json();
        newIncident.id = saved.incidentId || newIncident.id;
        console.log('[MongoDB] Incident saved successfully with ID:', saved.incidentId);
      }
    } catch (err) {
      console.warn('[MongoDB] Could not persist incident to MongoDB:', err.message);
    }
  }

  getState() {
    return this.state;
  }
}

export const telemetry = new TelemetryEngine();
