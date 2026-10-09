import express from 'express';
import { getDBStatus } from '../config/db.js';
import { Telemetry } from '../models/Telemetry.js';
import { DigitalTwinNode } from '../models/DigitalTwinNode.js';
import { Incident } from '../models/Incident.js';
import { Personnel } from '../models/Personnel.js';
import { Logistics } from '../models/Logistics.js';
import { Inventory } from '../models/Inventory.js';

const router = express.Router();

// ── Health & Connection Status ──
router.get('/health', async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    const stats = {
      telemetry: await Telemetry.countDocuments(),
      nodes: await DigitalTwinNode.countDocuments(),
      incidents: await Incident.countDocuments(),
      personnel: await Personnel.countDocuments(),
      logistics: await Logistics.countDocuments(),
      inventory: await Inventory.countDocuments()
    };

    res.json({
      status: 'online',
      mongodb: {
        ...dbStatus,
        uri: 'mongodb://localhost:27017',
        collections: stats
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Telemetry & KPIs ──
router.get('/telemetry', async (req, res) => {
  try {
    let telemetryDoc = await Telemetry.findOne().sort({ updatedAt: -1 });
    if (!telemetryDoc) {
      telemetryDoc = await Telemetry.create({});
    }

    const nodes = await DigitalTwinNode.find().lean();
    const incidents = await Incident.find().sort({ createdAt: -1 }).lean();
    const personnel = await Personnel.find().lean();
    const logistics = await Logistics.find().lean();
    const inventory = await Inventory.find().lean();

    res.json({
      timestamp: telemetryDoc.timestamp,
      station: telemetryDoc.station,
      kpis: telemetryDoc.kpis,
      digitalTwinNodes: nodes,
      incidents: incidents,
      personnel: personnel,
      logistics: logistics,
      inventory: inventory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/telemetry', async (req, res) => {
  try {
    const { kpis, station } = req.body;
    let telemetryDoc = await Telemetry.findOne().sort({ updatedAt: -1 });
    if (!telemetryDoc) {
      telemetryDoc = new Telemetry();
    }
    if (kpis) telemetryDoc.kpis = { ...telemetryDoc.kpis.toObject(), ...kpis };
    if (station) telemetryDoc.station = { ...telemetryDoc.station.toObject(), ...station };
    telemetryDoc.timestamp = new Date();
    await telemetryDoc.save();
    res.json(telemetryDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Digital Twin Nodes ──
router.get('/nodes', async (req, res) => {
  try {
    const nodes = await DigitalTwinNode.find();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/nodes/:nodeId', async (req, res) => {
  try {
    const updated = await DigitalTwinNode.findOneAndUpdate(
      { nodeId: req.params.nodeId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Incidents ──
router.get('/incidents', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/incidents', async (req, res) => {
  try {
    const { title, severity, sector, assignee, description } = req.body;
    const incidentId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newIncident = await Incident.create({
      incidentId,
      title,
      severity: severity || 'MEDIUM',
      sector: sector || 'Command Sector',
      timestamp: 'Just now',
      status: 'INVESTIGATING',
      assignee: assignee || 'Duty Officer',
      description: description || ''
    });

    // Increment active alerts count in telemetry
    await Telemetry.updateOne({}, { $inc: { 'kpis.activeAlertsCount': 1 } });

    res.status(201).json(newIncident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/incidents/:incidentId', async (req, res) => {
  try {
    const updated = await Incident.findOneAndUpdate(
      { incidentId: req.params.incidentId },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Personnel ──
router.get('/personnel', async (req, res) => {
  try {
    const personnel = await Personnel.find();
    res.json(personnel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Logistics ──
router.get('/logistics', async (req, res) => {
  try {
    const logistics = await Logistics.find();
    res.json(logistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Inventory ──
router.get('/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
