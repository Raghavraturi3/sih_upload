import express from 'express';
import {
  DIGITAL_TWIN_STATIONS,
  getStationInfo,
  getStationAssets,
  getAssetById,
  getAssetHistory,
  calibrateSensor
} from '../services/digitalTwinService.js';

const router = express.Router();

// List stations
router.get('/stations', (req, res) => {
  res.json({
    success: true,
    count: DIGITAL_TWIN_STATIONS.length,
    data: DIGITAL_TWIN_STATIONS
  });
});

// Station details
router.get('/stations/:stationId', (req, res) => {
  const station = getStationInfo(req.params.stationId);
  res.json({
    success: true,
    data: station
  });
});

// Assets for station
router.get('/assets/:stationId', (req, res) => {
  const assets = getStationAssets(req.params.stationId);
  res.json({
    success: true,
    count: assets.length,
    stationId: req.params.stationId.toUpperCase(),
    data: assets
  });
});

// Single asset lookup
router.get('/asset/:assetId', (req, res) => {
  const asset = getAssetById(req.params.assetId);
  if (!asset) {
    return res.status(404).json({ success: false, error: 'Asset not found' });
  }
  res.json({ success: true, data: asset });
});

// Current Telemetry
router.get('/telemetry/:assetId', (req, res) => {
  const asset = getAssetById(req.params.assetId);
  if (!asset) {
    return res.status(404).json({ success: false, error: 'Asset not found' });
  }
  res.json({
    success: true,
    assetId: asset.assetId,
    status: asset.status,
    metrics: asset.metrics,
    dataSource: asset.dataSource,
    updatedAt: asset.updatedAt
  });
});

// Historical Telemetry Time-Series
router.get('/telemetry/:assetId/history', (req, res) => {
  const timeframe = req.query.timeframe || '24H';
  const history = getAssetHistory(req.params.assetId, timeframe);
  res.json({
    success: true,
    assetId: req.params.assetId,
    timeframe,
    count: history.length,
    data: history
  });
});

// Calibrate Telemetry Node
router.post('/calibrate', (req, res) => {
  const { nodeId, referenceValue, operatorId } = req.body;
  if (!nodeId || referenceValue === undefined) {
    return res.status(400).json({ success: false, error: 'nodeId and referenceValue required' });
  }

  const result = calibrateSensor(nodeId, parseFloat(referenceValue), operatorId || 'rahul');
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json(result);
});

// Simulation snapshot for a station
router.get('/simulation/:stationId', (req, res) => {
  const stationId = (req.params.stationId || 'MAITRI').toUpperCase();
  const isMaitri = stationId === 'MAITRI';

  res.json({
    success: true,
    stationId,
    model: 'Station Energy + Thermal Conduction v2.4',
    status: 'ACTIVE',
    simulationTime: new Date().toISOString(),
    metrics: {
      thermalLossKw: isMaitri ? 42.5 : 38.0,
      totalPowerGeneratedKw: isMaitri ? 147.0 : 310.0,
      totalPowerConsumedKw: isMaitri ? 112.5 : 248.0,
      indoorAvgTempC: isMaitri ? 20.4 : 21.2,
      ambientTempC: isMaitri ? -15.2 : -13.8,
      hvacAirflowEfficiency: 0.92
    },
    provenance: {
      source: 'Antarctic Digital Twin Computational Model',
      dataStatus: 'SIMULATED'
    }
  });
});

export default router;
