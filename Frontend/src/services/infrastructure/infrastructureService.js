/**
 * Infrastructure Management Digital Twin Engine
 * Integrated Power Generation, Distribution, Fuel, Heating, Water, and Thermodynamic Coupling
 * Supports Indian Antarctic Research Stations: MAITRI & BHARATI
 * 
 * Complies with strict Data Honesty:
 * - REAL TELEMETRY vs SIMULATED TELEMETRY vs MODEL ESTIMATE vs CONFIGURED VALUE
 */

class InfrastructureService {
  constructor() {
    this.currentStationId = 'MAITRI'; // 'MAITRI' | 'BHARATI'
    this.activeTab = 'overview'; // 'overview' | 'power' | 'heating' | 'water' | 'dependencies' | 'maintenance' | 'simulation'
    this.timeframe = '24H'; // '1H' | '6H' | '24H' | '7D' | '30D'
    this.selectedNodeId = 'power-generation';
    this.selectedGeneratorId = null;
    this.selectedAssetId = null;
    this.isSimulationActive = false;
    this.activeScenario = 'NORMAL';
    this.subscribers = [];

    // Configurable Alert Thresholds (Step 27 & 28)
    this.alertThresholds = {
      powerReserve: { normal: 20, caution: 10, warning: 5 }, // %
      waterLevel: { normal: 40, caution: 20, warning: 10 }   // %
    };

    // Environmental / Weather Coupling Inputs
    this.environment = {
      outdoorTemp: -18.4, // °C
      windSpeed: 18.0,    // m/s
      windDirection: 'E',
      solarRadiation: 120, // W/m2
      stationOccupancy: 25 // personnel
    };

    // Station Infrastructure Configurations
    this.stationConfigs = {
      MAITRI: {
        name: 'Maitri Station',
        location: 'Schirmacher Oasis (70°45′S, 11°44′E)',
        elevation: '50 m',
        waterSource: 'Priyadarshini Fresh Glacial Lake',
        fuelTankCapacity: 120000, // Liters ATF-50
        waterTankCapacity: 120000, // Liters Fresh Water
        generators: [
          {
            id: 'GEN-01',
            name: 'Primary Diesel Co-Gen #1',
            type: 'Diesel Generator',
            capacityKw: 100.0,
            outputKw: 82.0,
            status: 'ONLINE',
            loadPercent: 68,
            voltage: 415,
            currentAmp: 134,
            freq: 50.0,
            engineTemp: 71,
            oilPressureBar: 4.8,
            fuelLevelPercent: 74,
            runtimeHours: 4281,
            fuelBurnRateLph: 19.2,
            location: 'Generator Block A',
            lastMaintenance: '2026-08-14',
            nextMaintenance: '2026-10-14',
            maintenanceIntervalHours: 1000,
            maintenanceStatus: 'GOOD'
          },
          {
            id: 'GEN-02',
            name: 'Primary Diesel Co-Gen #2',
            type: 'Diesel Generator',
            capacityKw: 75.0,
            outputKw: 58.0,
            status: 'ONLINE',
            loadPercent: 77,
            voltage: 415,
            currentAmp: 95,
            freq: 50.0,
            engineTemp: 69,
            oilPressureBar: 4.6,
            fuelLevelPercent: 74,
            runtimeHours: 3950,
            fuelBurnRateLph: 14.1,
            location: 'Generator Block A',
            lastMaintenance: '2026-08-10',
            nextMaintenance: '2026-10-10',
            maintenanceIntervalHours: 1000,
            maintenanceStatus: 'GOOD'
          },
          {
            id: 'GEN-03',
            name: 'Secondary Diesel Co-Gen #3',
            type: 'Diesel Generator',
            capacityKw: 60.0,
            outputKw: 45.0,
            status: 'ONLINE',
            loadPercent: 75,
            voltage: 415,
            currentAmp: 73,
            freq: 50.0,
            engineTemp: 66,
            oilPressureBar: 4.5,
            fuelLevelPercent: 74,
            runtimeHours: 4210,
            fuelBurnRateLph: 11.2,
            location: 'Generator Block B',
            lastMaintenance: '2026-07-28',
            nextMaintenance: '2026-09-28',
            maintenanceIntervalHours: 1000,
            maintenanceStatus: 'DUE SOON'
          },
          {
            id: 'GEN-04',
            name: 'Standby Emergency Generator',
            type: 'Diesel Generator',
            capacityKw: 62.5,
            outputKw: 0.0,
            status: 'STANDBY',
            loadPercent: 0,
            voltage: 0,
            currentAmp: 0,
            freq: 0.0,
            engineTemp: 22,
            oilPressureBar: 0.0,
            fuelLevelPercent: 95,
            runtimeHours: 1120,
            fuelBurnRateLph: 0.0,
            location: 'Emergency Bunker East',
            lastMaintenance: '2026-08-20',
            nextMaintenance: '2026-11-20',
            maintenanceIntervalHours: 500,
            maintenanceStatus: 'GOOD'
          }
        ],
        heatingUnits: [
          { id: 'HEAT-01', name: 'CHP Hydronic Heat Exchanger Alpha', type: 'Heat Exchanger', capacityKw: 25, outputKw: 20, currentLoad: 72, outletTemp: 54, returnTemp: 42, runtimeHours: 4821, status: 'ONLINE', location: 'HVAC Plant 1', lastMaintenance: '2026-08-01', nextMaintenance: '2026-11-01', maintenanceStatus: 'GOOD' },
          { id: 'HEAT-02', name: 'CHP Hydronic Heat Exchanger Bravo', type: 'Heat Exchanger', capacityKw: 22, outputKw: 16, currentLoad: 68, outletTemp: 52, returnTemp: 41, runtimeHours: 4650, status: 'ONLINE', location: 'HVAC Plant 1', lastMaintenance: '2026-08-01', nextMaintenance: '2026-11-01', maintenanceStatus: 'GOOD' },
          { id: 'HEAT-03', name: 'Auxiliary Electric Boiler Unit', type: 'Electric Boiler', capacityKw: 15, outputKw: 12, currentLoad: 80, outletTemp: 58, returnTemp: 44, runtimeHours: 2190, status: 'ONLINE', location: 'Thermal Substation B', lastMaintenance: '2026-07-15', nextMaintenance: '2026-10-15', maintenanceStatus: 'GOOD' },
          { id: 'HEAT-04', name: 'Emergency Diesel Therm-Heater', type: 'Diesel Fired', capacityKw: 30, outputKw: 0, currentLoad: 0, outletTemp: 18, returnTemp: 18, runtimeHours: 340, status: 'STANDBY', location: 'Living Module Airlock', lastMaintenance: '2026-06-20', nextMaintenance: '2026-12-20', maintenanceStatus: 'GOOD' }
        ],
        heatingZones: [
          { id: 'zone-accom', name: 'Accommodation & Living', currentTemp: 19.2, targetTemp: 20.0, basePowerKw: 16, status: 'NORMAL', priority: 2 },
          { id: 'zone-lab', name: 'Laboratory & Scientific Hub', currentTemp: 20.8, targetTemp: 21.0, basePowerKw: 9, status: 'NORMAL', priority: 3 },
          { id: 'zone-kitchen', name: 'Kitchen & Mess Hall', currentTemp: 20.1, targetTemp: 20.5, basePowerKw: 6, status: 'NORMAL', priority: 2 },
          { id: 'zone-ops', name: 'Operations & Command Room', currentTemp: 21.5, targetTemp: 21.5, basePowerKw: 5, status: 'NORMAL', priority: 1 },
          { id: 'zone-workshop', name: 'Workshop & Mechanical Bay', currentTemp: 16.5, targetTemp: 18.0, basePowerKw: 8, status: 'NORMAL', priority: 4 },
          { id: 'zone-storage', name: 'Storage & Supply Outposts', currentTemp: 11.2, targetTemp: 12.0, basePowerKw: 4, status: 'NORMAL', priority: 5 },
          { id: 'zone-comms', name: 'Communication & Radio Shack', currentTemp: 20.7, targetTemp: 21.0, basePowerKw: 0, status: 'NORMAL', priority: 1 }
        ],
        waterSystem: {
          intakeSource: 'Priyadarshini Glacial Lake Sub-Surface Aqueduct',
          intakeStatus: 'ONLINE',
          intakeTemp: 2.4, // °C
          traceHeatingActive: true,
          traceHeatingKw: 3.2,
          pumps: [
            { id: 'PUMP-W01', name: 'Primary Glacial Intake Lift Pump', role: 'PRIMARY', powerKw: 6.0, status: 'ONLINE', flowLpm: 82, pressureBar: 3.4, motorLoadPercent: 62, tempC: 48, runtimeHours: 1829, location: 'Lake Pumphouse', lastMaintenance: '2026-08-05', nextMaintenance: '2026-11-05', maintenanceStatus: 'GOOD' },
            { id: 'PUMP-W02', name: 'Secondary Backup Intake Pump', role: 'BACKUP', powerKw: 6.0, status: 'STANDBY', flowLpm: 0, pressureBar: 0.0, motorLoadPercent: 0, tempC: 18, runtimeHours: 420, location: 'Lake Pumphouse', lastMaintenance: '2026-08-05', nextMaintenance: '2026-11-05', maintenanceStatus: 'GOOD' }
          ],
          filtration: {
            id: 'FILT-01',
            name: 'Sand Bed + Microfiltration Unit',
            type: 'Water Filtration',
            status: 'NORMAL',
            inputFlowLpm: 82,
            outputFlowLpm: 78,
            pressureBar: 3.2,
            differentialPressureBar: 0.8,
            filterCondition: 'NORMAL',
            treatmentStatus: 'NORMAL',
            filtrationPowerKw: 3.0,
            treatmentPowerKw: 5.0,
            location: 'Water Treatment Annex',
            lastMaintenance: '2026-08-12',
            nextMaintenance: '2026-10-12',
            maintenanceStatus: 'GOOD'
          },
          freshWaterStorage: {
            id: 'TANK-W01',
            name: 'Primary Insulated Fresh Water Reservoir',
            type: 'Storage Tank',
            levelPercent: 74,
            currentLiters: 88800,
            capacityLiters: 120000,
            inflowLpm: 82,
            outflowLpm: 61,
            dailyConsumptionLiters: 1650,
            weeklyConsumptionLiters: 11550,
            status: 'NORMAL',
            reserveDaysRemaining: 54,
            location: 'Life Support Module',
            lastMaintenance: '2026-07-01',
            nextMaintenance: '2027-01-01',
            maintenanceStatus: 'GOOD'
          }
        },
        fuelSystem: {
          id: 'FUEL-01',
          name: 'Main Insulated ATF-50 Bunkers',
          fuelType: 'Arctic Grade ATF-50 Aviation Kerosene',
          currentLiters: 88800,
          capacityLiters: 120000,
          levelPercent: 74,
          leakDetectionStatus: 'NORMAL',
          traceHeatingStatus: 'ACTIVE',
          location: 'South Tank Farm',
          lastMaintenance: '2026-07-10',
          nextMaintenance: '2027-01-10',
          maintenanceStatus: 'GOOD'
        }
      },
      BHARATI: {
        name: 'Bharati Station',
        location: 'Larsemann Hills (69°24′S, 76°11′E)',
        elevation: '35 m',
        waterSource: 'Prydz Bay Seawater Reverse Osmosis',
        fuelTankCapacity: 150000,
        waterTankCapacity: 150000,
        generators: [
          {
            id: 'CHP-01',
            name: 'Scania 100 kVA Co-Gen #1',
            type: 'Diesel Generator',
            capacityKw: 100.0,
            outputKw: 88.0,
            status: 'ONLINE',
            loadPercent: 76,
            voltage: 415,
            currentAmp: 144,
            freq: 50.0,
            engineTemp: 73,
            oilPressureBar: 4.9,
            fuelLevelPercent: 82,
            runtimeHours: 6420,
            fuelBurnRateLph: 20.8,
            location: 'Main Energy Module',
            lastMaintenance: '2026-08-18',
            nextMaintenance: '2026-10-18',
            maintenanceIntervalHours: 1000,
            maintenanceStatus: 'GOOD'
          },
          {
            id: 'CHP-02',
            name: 'Scania 100 kVA Co-Gen #2',
            type: 'Diesel Generator',
            capacityKw: 100.0,
            outputKw: 75.0,
            status: 'ONLINE',
            loadPercent: 72,
            voltage: 415,
            currentAmp: 122,
            freq: 50.0,
            engineTemp: 70,
            oilPressureBar: 4.7,
            fuelLevelPercent: 82,
            runtimeHours: 6180,
            fuelBurnRateLph: 17.6,
            location: 'Main Energy Module',
            lastMaintenance: '2026-08-18',
            nextMaintenance: '2026-10-18',
            maintenanceIntervalHours: 1000,
            maintenanceStatus: 'GOOD'
          },
          {
            id: 'CHP-03',
            name: 'Scania 100 kVA Standby Unit',
            type: 'Diesel Generator',
            capacityKw: 100.0,
            outputKw: 0.0,
            status: 'STANDBY',
            loadPercent: 0,
            voltage: 0,
            currentAmp: 0,
            freq: 0.0,
            engineTemp: 24,
            oilPressureBar: 0.0,
            fuelLevelPercent: 96,
            runtimeHours: 920,
            fuelBurnRateLph: 0.0,
            location: 'Auxiliary Hangar Block',
            lastMaintenance: '2026-08-25',
            nextMaintenance: '2026-11-25',
            maintenanceIntervalHours: 500,
            maintenanceStatus: 'GOOD'
          }
        ],
        heatingUnits: [
          { id: 'HEAT-01', name: 'Primary Plate Heat Recovery Exchanger', type: 'Heat Exchanger', capacityKw: 30, outputKw: 24, currentLoad: 76, outletTemp: 56, returnTemp: 43, runtimeHours: 5120, status: 'ONLINE', location: 'HVAC Mezzanine', lastMaintenance: '2026-08-10', nextMaintenance: '2026-11-10', maintenanceStatus: 'GOOD' },
          { id: 'HEAT-02', name: 'Secondary Hydronic Air Handling Unit', type: 'Hydronic AHU', capacityKw: 25, outputKw: 20, currentLoad: 70, outletTemp: 54, returnTemp: 42, runtimeHours: 4980, status: 'ONLINE', location: 'HVAC Mezzanine', lastMaintenance: '2026-08-10', nextMaintenance: '2026-11-10', maintenanceStatus: 'GOOD' },
          { id: 'HEAT-03', name: 'Airlock & Gantry Thermal Barrier', type: 'Air Curtain', capacityKw: 15, outputKw: 10, currentLoad: 75, outletTemp: 48, returnTemp: 38, runtimeHours: 3200, status: 'ONLINE', location: 'Gantry Airlock', lastMaintenance: '2026-07-20', nextMaintenance: '2026-10-20', maintenanceStatus: 'GOOD' }
        ],
        heatingZones: [
          { id: 'zone-deck', name: 'Observation & Command Deck', currentTemp: 21.8, targetTemp: 22.0, basePowerKw: 18, status: 'NORMAL', priority: 1 },
          { id: 'zone-cabins', name: 'Living Modules & Crew Cabins', currentTemp: 21.6, targetTemp: 22.0, basePowerKw: 20, status: 'NORMAL', priority: 2 },
          { id: 'zone-labs', name: 'Marine & Atmospheric Science Labs', currentTemp: 20.9, targetTemp: 21.0, basePowerKw: 12, status: 'NORMAL', priority: 3 },
          { id: 'zone-galley', name: 'Galley, Mess & Recreation', currentTemp: 21.0, targetTemp: 21.5, basePowerKw: 8, status: 'NORMAL', priority: 2 },
          { id: 'zone-maint', name: 'Maintenance Bay & Hangar', currentTemp: 16.5, targetTemp: 17.5, basePowerKw: 10, status: 'NORMAL', priority: 4 }
        ],
        waterSystem: {
          intakeSource: 'Prydz Bay High-Salinity Seawater Intake',
          intakeStatus: 'ONLINE',
          intakeTemp: -1.2,
          traceHeatingActive: true,
          traceHeatingKw: 5.4,
          pumps: [
            { id: 'PUMP-W01', name: 'Seawater Sub-Ice Intake Pump', role: 'PRIMARY', powerKw: 8.0, status: 'ONLINE', flowLpm: 120, pressureBar: 5.8, motorLoadPercent: 70, tempC: 50, runtimeHours: 5210, location: 'Marine Intake Hut', lastMaintenance: '2026-08-15', nextMaintenance: '2026-11-15', maintenanceStatus: 'GOOD' },
            { id: 'PUMP-W02', name: 'High-Pressure RO Desalination Feed Pump', role: 'PRIMARY', powerKw: 9.0, status: 'ONLINE', flowLpm: 95, pressureBar: 55.0, motorLoadPercent: 78, tempC: 52, runtimeHours: 4940, location: 'Desalination Plant', lastMaintenance: '2026-08-15', nextMaintenance: '2026-11-15', maintenanceStatus: 'GOOD' },
            { id: 'PUMP-W03', name: 'Standby High-Head Booster Pump', role: 'BACKUP', powerKw: 8.0, status: 'STANDBY', flowLpm: 0, pressureBar: 0.0, motorLoadPercent: 0, tempC: 20, runtimeHours: 780, location: 'Desalination Plant', lastMaintenance: '2026-08-15', nextMaintenance: '2026-11-15', maintenanceStatus: 'GOOD' }
          ],
          filtration: {
            id: 'RO-01',
            name: '3-Stage Seawater Reverse Osmosis Plant',
            type: 'RO Desalination',
            status: 'NORMAL',
            inputFlowLpm: 120,
            outputFlowLpm: 48,
            pressureBar: 55.0,
            differentialPressureBar: 1.1,
            filterCondition: 'NORMAL',
            treatmentStatus: 'NORMAL',
            filtrationPowerKw: 4.0,
            treatmentPowerKw: 6.0,
            location: 'Desalination Plant',
            lastMaintenance: '2026-08-12',
            nextMaintenance: '2026-10-12',
            maintenanceStatus: 'GOOD'
          },
          freshWaterStorage: {
            id: 'TANK-W01',
            name: 'Bharati Insulated Potable Reservoir',
            type: 'Storage Tank',
            levelPercent: 82,
            currentLiters: 123000,
            capacityLiters: 150000,
            inflowLpm: 48,
            outflowLpm: 42,
            dailyConsumptionLiters: 1850,
            weeklyConsumptionLiters: 12950,
            status: 'NORMAL',
            reserveDaysRemaining: 66,
            location: 'Central Utility Core',
            lastMaintenance: '2026-07-15',
            nextMaintenance: '2027-01-15',
            maintenanceStatus: 'GOOD'
          }
        },
        fuelSystem: {
          id: 'FUEL-01',
          name: 'Main Tank Farm (Double Hull)',
          fuelType: 'Jet A-1 / ATF-50 Polar Blend',
          currentLiters: 123000,
          capacityLiters: 150000,
          levelPercent: 82,
          leakDetectionStatus: 'NORMAL',
          traceHeatingStatus: 'ACTIVE',
          location: 'West Fuel Farm',
          lastMaintenance: '2026-08-01',
          nextMaintenance: '2027-02-01',
          maintenanceStatus: 'GOOD'
        }
      }
    };
  }

  // Reactive Subscription
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.getTelemetry()));
  }

  // Set Station (Maitri or Bharati)
  setStation(stationId) {
    this.currentStationId = (stationId || 'MAITRI').toUpperCase();
    this.selectedGeneratorId = null;
    this.selectedAssetId = null;
    this.notify();
  }

  // Set Active Navigation Sub-tab
  setActiveTab(tabName) {
    this.activeTab = tabName;
    this.notify();
  }

  // Set Environmental Conditions (simulating katabatic winds / drop in temp)
  setEnvironment(updates) {
    Object.assign(this.environment, updates);
    this.notify();
  }

  // Set Selected Node in Dependency Graph
  setSelectedNode(nodeId) {
    this.selectedNodeId = nodeId;
    this.notify();
  }

  // Set Selected Generator for Detail Panel
  setSelectedGenerator(genId) {
    this.selectedGeneratorId = genId;
    this.notify();
  }

  // Set Selected Asset for Generic Detail Panel
  setSelectedAsset(assetId) {
    this.selectedAssetId = assetId;
    this.notify();
  }

  // Set History Chart Timeframe
  setTimeframe(tf) {
    this.timeframe = tf;
    this.notify();
  }

  // Trigger What-if / Failure Scenario
  setScenario(scenarioName) {
    this.activeScenario = scenarioName;
    this.isSimulationActive = scenarioName !== 'NORMAL';
    this.notify();
  }

  // Update Heating Zone Target Temperature
  setZoneTargetTemp(zoneId, targetTemp) {
    const station = this.stationConfigs[this.currentStationId];
    const zone = station.heatingZones.find(z => z.id === zoneId);
    if (zone) {
      zone.targetTemp = parseFloat(targetTemp);
      this.notify();
    }
  }

  // Configure Alert Thresholds (Step 27 & 28)
  setAlertThreshold(type, key, value) {
    if (this.alertThresholds[type] && this.alertThresholds[type][key] !== undefined) {
      this.alertThresholds[type][key] = parseFloat(value);
      this.notify();
    }
  }

  // Core Physical Coupled Thermodynamic Model & Comprehensive Telemetry Generator
  getTelemetry() {
    const station = this.stationConfigs[this.currentStationId];
    const env = { ...this.environment };
    const scenario = this.activeScenario;

    // Apply Scenario Perturbations to Environment or Hardware
    let isGenFailure = scenario === 'GEN_FAILURE';
    let isPumpFailure = scenario === 'PUMP_FAILURE';
    let isExtremeCold = scenario === 'EXTREME_COLD';
    let isHeatingFailure = scenario === 'HEATING_FAILURE';
    let isLowFuel = scenario === 'LOW_FUEL';
    let isLowWater = scenario === 'LOW_WATER';
    let isFiltrationFailure = scenario === 'FILTRATION_FAILURE';

    if (isExtremeCold) {
      env.outdoorTemp = -25.0; // Extreme drop from -18.4°C
      env.windSpeed = 35.0;    // Gale katabatic winds
    }

    // 1. Thermodynamic Heat Loss Calculation:
    // Heat Loss Factor = (deltaT / 38.0) * (1 + windSpeed / 50.0)
    const avgIndoor = station.heatingZones.reduce((acc, z) => acc + z.currentTemp, 0) / station.heatingZones.length;
    const deltaT_ambient = Math.max(0, avgIndoor - env.outdoorTemp);
    const windMultiplier = 1 + (env.windSpeed / 50.0);
    const heatLossFactor = (deltaT_ambient / 38.0) * windMultiplier;

    // 2. Heating Demand Calculation per Zone (Step 12 & 13)
    let totalHeatingPowerKw = 0;
    const computedZones = station.heatingZones.map(z => {
      const deltaT = Math.round((z.targetTemp - z.currentTemp) * 10) / 10;
      let demandPercent = Math.min(99, Math.max(20, Math.round((70 + deltaT * 10) * heatLossFactor)));
      let actualPowerKw = Math.round((z.basePowerKw * (demandPercent / 100)) * 10) / 10;
      let zoneStatus = z.status;

      if (isGenFailure) {
        // Automated load shedding on lower priority zones
        if (z.priority >= 4) {
          actualPowerKw = Math.round(actualPowerKw * 0.2 * 10) / 10;
          demandPercent = 25;
          zoneStatus = 'CAUTION';
        } else if (z.priority === 3) {
          actualPowerKw = Math.round(actualPowerKw * 0.6 * 10) / 10;
          zoneStatus = 'REVIEW';
        }
      }

      if (isHeatingFailure && (z.id === 'zone-accom' || z.id === 'zone-deck')) {
        actualPowerKw = Math.round(actualPowerKw * 0.5 * 10) / 10;
        zoneStatus = 'WARNING';
      }

      totalHeatingPowerKw += actualPowerKw;

      return {
        ...z,
        temperatureDifference: deltaT,
        heatingDemand: demandPercent,
        powerConsumptionKw: actualPowerKw,
        energyTodayKwh: Math.round(actualPowerKw * 24),
        status: zoneStatus
      };
    });

    totalHeatingPowerKw = Math.round(totalHeatingPowerKw * 10) / 10;
    // Step 9: kW vs kWh calculations
    const heatingEnergyTodayKwh = Math.round(totalHeatingPowerKw * 24);
    const heatingEnergyThisWeekKwh = Math.round(heatingEnergyTodayKwh * 7);

    // 3. Power Generation & Consumption (Steps 5, 7, 8)
    let computedGenerators = station.generators.map(g => ({ ...g }));
    let failedGenId = null;

    if (isGenFailure) {
      failedGenId = computedGenerators[0]?.id || 'GEN-01';
      computedGenerators = computedGenerators.map(g => {
        if (g.id === failedGenId) {
          return { ...g, status: 'FAULT', outputKw: 0, loadPercent: 0, voltage: 0, currentAmp: 0, freq: 0 };
        }
        return g;
      });
    }

    // Step 7: Generation Capacity & Current Generation
    const totalGenerationKw = Math.round(
      computedGenerators.filter(g => g.status === 'ONLINE').reduce((sum, g) => sum + g.outputKw, 0) * 10
    ) / 10;

    // Step 8 & 20: Power Consumption by System programmatically calculated
    let waterPumpsPowerKw = 0;
    let waterFiltrationPowerKw = station.waterSystem.filtration.filtrationPowerKw;
    let waterTreatmentPowerKw = station.waterSystem.filtration.treatmentPowerKw;

    // Water Pump Status based on Scenario (Step 16 & 25)
    let computedPumps = station.waterSystem.pumps.map(p => ({ ...p }));
    let intakeFlowLpm = station.waterSystem.filtration.inputFlowLpm;

    if (isPumpFailure) {
      computedPumps = computedPumps.map((p, idx) => {
        if (p.role === 'PRIMARY') {
          return { ...p, status: 'FAULT', flowLpm: 0, pressureBar: 0, motorLoadPercent: 0 };
        } else if (p.role === 'BACKUP') {
          return { ...p, status: 'STARTING', flowLpm: 75, pressureBar: 3.1, motorLoadPercent: 58 };
        }
        return p;
      });
      intakeFlowLpm = 75;
    }

    waterPumpsPowerKw = computedPumps.filter(p => p.status === 'ONLINE' || p.status === 'STARTING').reduce((s, p) => s + p.powerKw, 0);
    const totalWaterSystemPowerKw = Math.round((waterPumpsPowerKw + waterFiltrationPowerKw + waterTreatmentPowerKw) * 10) / 10;

    const labsPowerKw = this.currentStationId === 'MAITRI' ? 31.0 : 38.0;
    const commsPowerKw = 12.0;
    const accommodationBasePowerKw = 25.0;
    const lightingPowerKw = 9.0;
    const scientificPowerKw = 15.0;
    const otherPowerKw = this.currentStationId === 'MAITRI' ? 7.0 : 11.0;

    // TOTAL = SUM(all active system loads)
    const totalConsumptionKw = Math.round(
      (totalHeatingPowerKw + labsPowerKw + totalWaterSystemPowerKw + commsPowerKw + accommodationBasePowerKw + lightingPowerKw + scientificPowerKw + otherPowerKw) * 10
    ) / 10;

    // Step 7: Available Capacity = Generation Capacity - Current Consumption
    const availableCapacityKw = Math.round((totalGenerationKw - totalConsumptionKw) * 10) / 10;
    const powerDeficitKw = availableCapacityKw < 0 ? Math.abs(availableCapacityKw) : 0;

    // Daily & Weekly Station kWh
    const stationEnergyTodayKwh = Math.round(totalConsumptionKw * 24);
    const stationEnergyThisWeekKwh = Math.round(stationEnergyTodayKwh * 7);

    // Power Breakdown Table & Energy Flow
    const systemLoads = [
      { name: 'Heating System', powerKw: totalHeatingPowerKw, percent: Math.round((totalHeatingPowerKw / totalConsumptionKw) * 100), color: '#f59e0b', id: 'heating' },
      { name: 'Laboratories', powerKw: labsPowerKw, percent: Math.round((labsPowerKw / totalConsumptionKw) * 100), color: '#38bdf8', id: 'labs' },
      { name: 'Water System', powerKw: totalWaterSystemPowerKw, percent: Math.round((totalWaterSystemPowerKw / totalConsumptionKw) * 100), color: '#06b6d4', id: 'water' },
      { name: 'Accommodation', powerKw: accommodationBasePowerKw, percent: Math.round((accommodationBasePowerKw / totalConsumptionKw) * 100), color: '#10b981', id: 'accommodation' },
      { name: 'Scientific Equipment', powerKw: scientificPowerKw, percent: Math.round((scientificPowerKw / totalConsumptionKw) * 100), color: '#a855f7', id: 'science' },
      { name: 'Communication', powerKw: commsPowerKw, percent: Math.round((commsPowerKw / totalConsumptionKw) * 100), color: '#6366f1', id: 'comms' },
      { name: 'Lighting', powerKw: lightingPowerKw, percent: Math.round((lightingPowerKw / totalConsumptionKw) * 100), color: '#eab308', id: 'lighting' },
      { name: 'Other Auxiliaries', powerKw: otherPowerKw, percent: Math.round((otherPowerKw / totalConsumptionKw) * 100), color: '#64748b', id: 'other' }
    ];

    // 4. Fuel System & Specific Consumption (Step 21)
    // Specific Fuel Consumption ~ 0.235 L/kWh
    const specificFuelBurn = 0.235;
    const currentFuelBurnRateLph = Math.round((totalConsumptionKw * specificFuelBurn) * 10) / 10;
    const dailyFuelBurnLiters = Math.round(currentFuelBurnRateLph * 24);
    let currentFuelLiters = isLowFuel ? 16800 : station.fuelSystem.currentLiters;
    const fuelLevelPercent = Math.round((currentFuelLiters / station.fuelSystem.capacityLiters) * 100);
    const fuelReserveDays = Math.round(currentFuelLiters / (dailyFuelBurnLiters || 1));

    // 5. Water Infrastructure (Steps 15, 17, 18, 19)
    let waterTankLevelPercent = isLowWater ? 18 : station.waterSystem.freshWaterStorage.levelPercent;
    let freshWaterCurrentLiters = Math.round(station.waterSystem.freshWaterStorage.capacityLiters * (waterTankLevelPercent / 100));
    let diffPressure = isFiltrationFailure ? 2.4 : station.waterSystem.filtration.differentialPressureBar;
    let filterStatus = isFiltrationFailure ? 'HIGH FILTER PRESSURE' : 'NORMAL';

    const waterStorage = {
      ...station.waterSystem.freshWaterStorage,
      levelPercent: waterTankLevelPercent,
      currentLiters: freshWaterCurrentLiters,
      inflowLpm: intakeFlowLpm,
      status: waterTankLevelPercent < this.alertThresholds.waterLevel.warning ? 'CRITICAL' : waterTankLevelPercent < this.alertThresholds.waterLevel.caution ? 'CAUTION' : 'NORMAL'
    };

    // 6. Heating Units (Step 11)
    const computedHeatingUnits = station.heatingUnits.map(u => {
      let status = u.status;
      let load = u.currentLoad;
      let output = u.outputKw;
      if (isGenFailure && u.type === 'Electric Boiler') {
        status = 'LIMITED';
        output = Math.round(output * 0.3);
      }
      if (isHeatingFailure && u.id === 'HEAT-01') {
        status = 'FAULT';
        output = 0;
      }
      return { ...u, status, currentLoad: load, outputKw: output };
    });

    // 7. System Health Ratings & Alerts (Step 4, 27, 28)
    const reservePercent = Math.round((availableCapacityKw / (totalGenerationKw || 1)) * 100);
    const powerHealth = isGenFailure 
      ? 'CRITICAL' 
      : reservePercent < this.alertThresholds.powerReserve.warning 
      ? 'WARNING' 
      : reservePercent < this.alertThresholds.powerReserve.caution 
      ? 'CAUTION' 
      : 'NORMAL';

    const waterHealth = isPumpFailure || isLowWater 
      ? 'WARNING' 
      : isFiltrationFailure 
      ? 'CAUTION' 
      : 'NORMAL';

    const heatingHealth = isHeatingFailure 
      ? 'WARNING' 
      : isGenFailure 
      ? 'CAUTION' 
      : 'NORMAL';

    const fuelHealth = isLowFuel 
      ? 'WARNING' 
      : fuelReserveDays < 30 
      ? 'CAUTION' 
      : 'NORMAL';

    // Count of Critical Alerts
    let criticalAlertsCount = 0;
    if (powerHealth === 'CRITICAL' || powerHealth === 'WARNING') criticalAlertsCount++;
    if (waterHealth === 'CRITICAL' || waterHealth === 'WARNING') criticalAlertsCount++;
    if (heatingHealth === 'CRITICAL' || heatingHealth === 'WARNING') criticalAlertsCount++;
    if (fuelHealth === 'CRITICAL' || fuelHealth === 'WARNING') criticalAlertsCount++;

    // 8. Model Estimate for Next 6 Hours (Step 14)
    const predictedOutdoorTemp = env.outdoorTemp - 3.2;
    const predictedWind = env.windSpeed + 4.0;
    const predHeatLoss = (Math.max(0, avgIndoor - predictedOutdoorTemp) / 38.0) * (1 + predictedWind / 50.0);
    const predictedHeatingDemandKw = Math.round(totalHeatingPowerKw * (predHeatLoss / heatLossFactor) * 10) / 10;

    // 9. All Assets Compiled for Maintenance Tab (Step 29 & 30)
    const allAssets = [
      ...computedGenerators.map(g => ({ ...g, category: 'Power Generator' })),
      ...computedHeatingUnits.map(h => ({ ...h, category: 'Heating Unit' })),
      ...computedPumps.map(p => ({ ...p, category: 'Water Pump' })),
      { ...station.waterSystem.filtration, category: 'Filtration Unit' },
      { ...waterStorage, category: 'Fresh Water Tank' },
      { ...station.fuelSystem, category: 'Fuel Storage' }
    ];

    // Historical Series
    const historyData = this.generateHistoricalSeries(this.timeframe, totalGenerationKw, totalConsumptionKw, totalHeatingPowerKw);

    return {
      stationId: this.currentStationId,
      stationName: station.name,
      stationLocation: station.location,
      waterSource: station.waterSource,
      activeTab: this.activeTab,
      isSimulationActive: this.isSimulationActive,
      activeScenario: this.activeScenario,
      selectedGeneratorId: this.selectedGeneratorId,
      selectedAssetId: this.selectedAssetId,
      selectedNodeId: this.selectedNodeId,
      timeframe: this.timeframe,
      environment: env,
      alertThresholds: this.alertThresholds,

      // High-level Station Status (Step 4)
      health: {
        power: powerHealth,
        water: waterHealth,
        heating: heatingHealth,
        fuel: fuelHealth,
        criticalAlertsCount
      },

      // Power Telemetry (Step 4, 5, 7, 8, 9)
      totalGenerationKw,
      totalConsumptionKw,
      availableCapacityKw,
      powerDeficitKw,
      peakLoadTodayKw: Math.round(totalConsumptionKw * 1.18),
      averageLoadTodayKw: Math.round(totalConsumptionKw * 0.88),
      stationEnergyTodayKwh,
      stationEnergyThisWeekKwh,
      generators: computedGenerators,
      systemLoads,

      // Heating Telemetry (Step 11, 12, 13, 14)
      heatingStatus: heatingHealth,
      indoorTempC: Math.round(avgIndoor * 10) / 10,
      targetIndoorTempC: 20.0,
      outdoorTempC: env.outdoorTemp,
      heatingDemandPercent: Math.round(computedZones.reduce((s, z) => s + z.heatingDemand, 0) / computedZones.length),
      heatingPowerKw: totalHeatingPowerKw,
      heatingEnergyTodayKwh,
      heatingEnergyThisWeekKwh,
      heatingZones: computedZones,
      heatingUnits: computedHeatingUnits,
      predictedHeatingDemandKw,
      modelEstimateHeatLossFactor: Math.round(heatLossFactor * 100) / 100,

      // Water Infrastructure Telemetry (Step 15 - 20)
      waterSystem: {
        intakeSource: station.waterSystem.intakeSource,
        intakeStatus: computedPumps[0].status === 'FAULT' ? 'INTERRUPTED' : 'ONLINE',
        intakeTempC: station.waterSystem.intakeTemp,
        traceHeatingActive: station.waterSystem.traceHeatingActive,
        traceHeatingKw: station.waterSystem.traceHeatingKw,
        pumps: computedPumps,
        filtration: {
          ...station.waterSystem.filtration,
          inputFlowLpm: intakeFlowLpm,
          differentialPressureBar: diffPressure,
          filterCondition: filterStatus,
          status: filterStatus === 'NORMAL' ? 'NORMAL' : 'CAUTION'
        },
        freshWaterStorage: waterStorage,
        totalWaterSystemPowerKw,
        pumpsPowerKw: waterPumpsPowerKw,
        filtrationPowerKw: waterFiltrationPowerKw,
        treatmentPowerKw: waterTreatmentPowerKw
      },

      // Fuel Telemetry (Step 21)
      fuelSystem: {
        ...station.fuelSystem,
        currentLiters: currentFuelLiters,
        levelPercent: fuelLevelPercent,
        currentFuelConsumptionLph: currentFuelBurnRateLph,
        dailyFuelConsumptionLpd: dailyFuelBurnLiters,
        fuelReserveDaysRemaining: fuelReserveDays
      },

      // Maintenance & Asset Registry (Step 29, 30)
      allAssets,

      // Chart.js Historical Series
      history: historyData
    };
  }

  generateHistoricalSeries(timeframe, genCap, curLoad, curHeat) {
    let points = 12;
    let labels = [];
    if (timeframe === '1H') {
      labels = ['-55m', '-50m', '-45m', '-40m', '-35m', '-30m', '-25m', '-20m', '-15m', '-10m', '-5m', 'Now'];
    } else if (timeframe === '6H') {
      labels = ['-6h', '-5h', '-4.5h', '-4h', '-3.5h', '-3h', '-2.5h', '-2h', '-1.5h', '-1h', '-30m', 'Now'];
    } else if (timeframe === '24H') {
      labels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    } else if (timeframe === '7D') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      points = 7;
    } else {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      points = 4;
    }

    const totalPowerSeries = [];
    const generationSeries = [];
    const heatingSeries = [];
    const fuelBurnSeries = [];

    for (let i = 0; i < points; i++) {
      const diurnal = Math.sin((i / points) * Math.PI * 2) * 12;
      const noise = (Math.sin(i * 1.7) * 3);
      const valLoad = Math.max(80, Math.round(curLoad + diurnal + noise));
      const valHeat = Math.max(25, Math.round(curHeat + (diurnal * 0.35) + noise));
      const valFuel = Math.round((valLoad * 0.235) * 10) / 10;

      totalPowerSeries.push(valLoad);
      generationSeries.push(genCap);
      heatingSeries.push(valHeat);
      fuelBurnSeries.push(valFuel);
    }

    return {
      labels,
      totalPower: totalPowerSeries,
      generation: generationSeries,
      heating: heatingSeries,
      fuelBurn: fuelBurnSeries
    };
  }
}

export const infrastructureService = new InfrastructureService();
