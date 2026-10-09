// DEMO / SIMULATED DATA — Replace with API response when endpoint is available.
// This file contains structured domain data for the Antarctic Energy Operations Center (Maitri & Bharati).
// All values are clearly separated and marked as simulated operational telemetry.

export const STATIONS = [
  { id: 'maitri', name: 'Maitri', location: 'Schirmacher Oasis', lat: '-70.7667° S', lon: '11.7333° E', primarySource: 'Diesel Generators + Solar PV' },
  { id: 'bharati', name: 'Bharati', location: 'Larsemann Hills', lat: '-69.4083° S', lon: '76.1867° E', primarySource: 'Combined Heat & Power (CHP) Microgrid' }
];

export const ENERGY_OVERVIEW_KPIS = {
  totalGenerationKw: 820,
  totalConsumptionKw: 710,
  availablePowerKw: 110,
  batteryLevelPercent: 82,
  fuelReservePercent: 64,
  solarGenerationKw: 145,
  peakLoadKw: 860,
  peakTime: '18:40 UTC',
  totalCapacityKw: 1000
};

export const STATION_ENERGY_HEALTH = [
  {
    station: 'Maitri',
    healthPercent: 92,
    generationStatus: 'Normal',
    consumptionStatus: 'Normal',
    batteryStatus: 'Healthy',
    fuelStatus: 'Healthy',
    solarStatus: 'Active',
    loadKw: 395,
    capacityKw: 520,
    fuelReserveL: 42800,
    batteryKwh: 220
  },
  {
    station: 'Bharati',
    healthPercent: 78,
    generationStatus: 'Normal',
    consumptionStatus: 'High',
    batteryStatus: 'Attention',
    fuelStatus: 'Healthy',
    solarStatus: 'Limited',
    loadKw: 315,
    capacityKw: 480,
    fuelReserveL: 31400,
    batteryKwh: 190
  }
];

export const GENERATOR_UNITS = [
  {
    id: 'GEN-MAI-001',
    name: 'Generator 01 (Base Prime)',
    station: 'Maitri',
    model: 'Caterpillar C9 Marine Genset (Polar Tier 4)',
    outputKw: 420,
    ratedKw: 500,
    loadPercent: 72,
    fuelConsumptionLh: 18.2,
    runtimeHours: 2840,
    healthPercent: 96,
    status: 'Operational',
    oilPressureBar: 4.8,
    coolantTempC: 82,
    vibrationMmS: 1.1,
    lastMaintenance: '05 Sep 2026',
    nextMaintenance: '20 Sep 2026',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'GEN-MAI-002',
    name: 'Generator 02 (Auxiliary Standby)',
    station: 'Maitri',
    model: 'Caterpillar C9 Marine Genset',
    outputKw: 380,
    ratedKw: 500,
    loadPercent: 81,
    fuelConsumptionLh: 22.4,
    runtimeHours: 3120,
    healthPercent: 72,
    status: 'Needs Attention',
    oilPressureBar: 3.9,
    coolantTempC: 88,
    vibrationMmS: 3.8,
    lastMaintenance: '22 Aug 2026',
    nextMaintenance: '10 Sep 2026',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'GEN-BHA-001',
    name: 'Generator 03 (CHP Main)',
    station: 'Bharati',
    model: 'Volvo Penta D13 Tier-4 Microgrid',
    outputKw: 410,
    ratedKw: 480,
    loadPercent: 74,
    fuelConsumptionLh: 19.1,
    runtimeHours: 1980,
    healthPercent: 94,
    status: 'Operational',
    oilPressureBar: 4.9,
    coolantTempC: 80,
    vibrationMmS: 1.2,
    lastMaintenance: '02 Sep 2026',
    nextMaintenance: '18 Sep 2026',
    assignee: 'Rahul Singh'
  },
  {
    id: 'GEN-BHA-002',
    name: 'Generator 04 (Cold Backup)',
    station: 'Bharati',
    model: 'Volvo Penta D13 Tier-4 Microgrid',
    outputKw: 0,
    ratedKw: 480,
    loadPercent: 0,
    fuelConsumptionLh: 0.0,
    runtimeHours: 1420,
    healthPercent: 98,
    status: 'Standby',
    oilPressureBar: 0.0,
    coolantTempC: 24,
    vibrationMmS: 0.0,
    lastMaintenance: '28 Aug 2026',
    nextMaintenance: '25 Sep 2026',
    assignee: 'Rahul Singh'
  }
];

export const SOLAR_SYSTEM = {
  station: 'Maitri & Bharati Hybrid Arrays',
  dailyGenerationKwh: 145,
  currentOutputKw: 38.4,
  installedCapacityKw: 60.0,
  renewableContributionPercent: 17,
  status: 'Active',
  irradianceWm2: 480,
  panelEfficiencyPercent: 19.4,
  snowClearingStatus: 'All Arrays Clear',
  ambientTempC: -28.4
};

export const BATTERY_STORAGE = {
  batteryLevelPercent: 82,
  storedEnergyKwh: 410,
  totalCapacityKwh: 500,
  availableCapacityPercent: 90,
  chargingState: 'Float Charging (Active)',
  chargeRateKw: +14.2,
  cellVoltageAvgV: 3.42,
  internalTempC: 18.2,
  estimatedBackupHours: 8.4
};

export const FUEL_MANAGEMENT = {
  fuelReservePercent: 64,
  totalCapacityLitres: 116000,
  availableLitres: 74240,
  dailyConsumptionLitres: 820,
  estimatedDaysRemaining: 90.5,
  operationalSafetyThresholdDays: 30,
  warningDaysThreshold: 45,
  fuelGrade: 'Polar Winter Diesel Grade -50°C (D-50)',
  status: 'Healthy',
  warningNotice: 'Fuel reserve is healthy for winterover operations (90.5 days remaining).'
};

export const CONSUMPTION_BREAKDOWN = [
  { category: 'Heating & Thermal Loops', percent: 38, kw: 269.8, color: '#f97316' },
  { category: 'Laboratories & Clean Rooms', percent: 18, kw: 127.8, color: '#3b82f6' },
  { category: 'Scientific Equipment & Sensors', percent: 15, kw: 106.5, color: '#8b5cf6' },
  { category: 'Satellite & Radio Comms', percent: 10, kw: 71.0, color: '#06b6d4' },
  { category: 'Station Lighting & Exterior Beacons', percent: 8, kw: 56.8, color: '#eab308' },
  { category: 'Living Quarters & Galley', percent: 7, kw: 49.7, color: '#10b981' },
  { category: 'Auxiliary & Water Treatment', percent: 4, kw: 28.4, color: '#64748b' }
];

export const ENERGY_TRENDS = {
  today: {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    generation: [740, 720, 750, 810, 840, 830, 860, 790],
    consumption: [680, 660, 690, 730, 750, 760, 820, 710],
    solar: [0, 0, 10, 32, 38, 35, 18, 0],
    battery: [85, 84, 83, 84, 88, 86, 82, 82]
  },
  sevenDays: {
    labels: ['02 Sep', '03 Sep', '04 Sep', '05 Sep', '06 Sep', '07 Sep', '08 Sep'],
    generation: [780, 795, 810, 805, 820, 835, 820],
    consumption: [690, 705, 715, 710, 725, 740, 710],
    solar: [120, 130, 142, 138, 140, 152, 145],
    battery: [80, 81, 82, 81, 83, 84, 82]
  },
  thirtyDays: {
    labels: ['W1 (Aug)', 'W2 (Aug)', 'W3 (Aug)', 'W4 (Aug)', 'Current (Sep)'],
    generation: [760, 775, 790, 805, 820],
    consumption: [670, 685, 700, 715, 710],
    solar: [110, 122, 135, 140, 145],
    battery: [78, 80, 82, 83, 82]
  }
};

export const ENERGY_ALERTS = [
  {
    id: 'ALR-ENG-001',
    type: 'CRITICAL',
    title: 'Generator 02 abnormal harmonic vibration and high fuel rate',
    station: 'Maitri',
    timestamp: '2 minutes ago',
    assetId: 'GEN-MAI-002',
    impact: 'Load redistribution to Generator 01 recommended'
  },
  {
    id: 'ALR-ENG-002',
    type: 'WARNING',
    title: 'Bharati station heating load 12% above seasonal baseline',
    station: 'Bharati',
    timestamp: '18 minutes ago',
    assetId: 'HTG-BHA-001',
    impact: 'External blizzard (-38°C) causing higher thermostatic demand'
  },
  {
    id: 'ALR-ENG-003',
    type: 'WARNING',
    title: 'BESS Battery bank discharge rate elevated in Sector 2',
    station: 'Maitri',
    timestamp: '32 minutes ago',
    assetId: 'BAT-MAI-BESS',
    impact: 'Reserve estimated buffer reduced to 8.4 hours'
  },
  {
    id: 'ALR-ENG-004',
    type: 'RESOLVED',
    title: 'Generator 01 preventive injector service & test run completed',
    station: 'Maitri',
    timestamp: '1 hour ago',
    assetId: 'GEN-MAI-001',
    impact: 'Nominal efficiency restored'
  }
];

export const ENERGY_TEAM = [
  {
    id: 'ENG-EMP-001',
    name: 'Arjun Sharma',
    role: 'Lead Energy Engineer',
    station: 'Maitri',
    status: 'Online',
    assigned: 'Generators 01, 02 · Microgrid Sync',
    avatar: 'AS',
    commsChannel: 'VHF-16 (Energy Ops)',
    polarExperience: '40th & 42nd Indian Antarctic Expeditions'
  },
  {
    id: 'ENG-EMP-002',
    name: 'Rahul Singh',
    role: 'Energy Monitoring Officer',
    station: 'Bharati',
    status: 'On Site',
    assigned: 'CHP Units 03, 04 · Solar PV Array',
    avatar: 'RS',
    commsChannel: 'VHF-09 (Bharati Substation)',
    polarExperience: '41st Indian Antarctic Expedition'
  },
  {
    id: 'ENG-EMP-003',
    name: 'Priya Rawat',
    role: 'Energy & Infrastructure Manager',
    station: 'HQ',
    status: 'Online',
    assigned: 'National Polar Operations Command',
    avatar: 'PR',
    commsChannel: 'Inmarsat FleetBroadband #802',
    polarExperience: 'NCPOR Polar Logistics Director'
  }
];

export const ENERGY_PERFORMANCE_METRICS = {
  generationEfficiencyPercent: 92,
  energyUtilizationPercent: 86,
  renewableContributionPercent: 17,
  avgDailyConsumptionKwh: 710,
  peakDemandKw: 860,
  systemAvailabilityPercent: 98.4
};

export const ENERGY_INSIGHTS = [
  {
    id: 'INS-01',
    title: 'Heating Thermal Load Dominance',
    text: 'Habitation and lab heating currently represents 38% of total station load due to exterior winds (-34°C).',
    type: 'info'
  },
  {
    id: 'INS-02',
    title: 'Solar PV Peak Offset',
    text: 'Clear polar daylight is contributing 38 kW peak solar generation, saving ~18 L of diesel fuel per hour.',
    type: 'positive'
  },
  {
    id: 'INS-03',
    title: 'Generator 02 Load Imbalance',
    text: 'Generator 02 is running at 81% load with elevated vibration. Balancing 45 kW to Gen 01 will extend engine life.',
    type: 'warning'
  },
  {
    id: 'INS-04',
    title: 'Adequate Winterover Fuel Reserve',
    text: '74,240 Litres of Arctic D-50 fuel provides a 90.5-day burn buffer, exceeding the 45-day contingency baseline.',
    type: 'positive'
  }
];

export const CROSS_DEPARTMENT_IMPACTS = [
  {
    title: 'High Thermal Demand → Fuel Depletion Risk',
    steps: [
      'Severe Blizzard (-42°C ambient) triggers maximum heating draw',
      'Diesel generator fuel burn increases from 18 L/h to 24 L/h',
      'Daily fuel consumption rises to 940 L/day (15% above forecast)',
      'Supply flight or icebreaker convoy re-supply priority escalates'
    ]
  },
  {
    title: 'Generator Anomaly → Research Activity Delay',
    steps: [
      'Generator 02 thermal tripping or vibration trip',
      'Automated load shedding halts non-essential scientific experiments',
      'Deep ice-core drill and atmospheric radar enter idle standby',
      'Research timeline delayed by 18–36 hours pending technician sign-off'
    ]
  }
];

export const ENERGY_RISK = {
  level: 'MEDIUM',
  badgeClass: 'infra-badge-amber',
  reasons: [
    'Station energy consumption is currently 12% above the seasonal baseline at Bharati.',
    'Generator 02 exhibits vibration drift (3.8 mm/s) requiring technician service.',
    'Fuel reserves remain comfortably adequate (90.5 days remaining).'
  ],
  recommendedAction: 'Execute scheduled vibration balancing on Generator 02 within 48 hours; maintain solar array snow clearing.'
};

export const ENERGY_ASSETS = [
  {
    id: 'GEN-MAI-001',
    name: 'Generator 01 (Caterpillar C9)',
    type: 'Diesel Generator',
    station: 'Maitri',
    output: '420 kW',
    health: 96,
    status: 'Operational',
    lastMaintenance: '05 Sep 2026',
    nextMaintenance: '20 Sep 2026',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'GEN-MAI-002',
    name: 'Generator 02 (Caterpillar C9)',
    type: 'Diesel Generator',
    station: 'Maitri',
    output: '380 kW',
    health: 72,
    status: 'Needs Attention',
    lastMaintenance: '22 Aug 2026',
    nextMaintenance: '10 Sep 2026',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'GEN-BHA-001',
    name: 'Generator 03 (Volvo Penta D13)',
    type: 'Diesel Generator',
    station: 'Bharati',
    output: '410 kW',
    health: 94,
    status: 'Operational',
    lastMaintenance: '02 Sep 2026',
    nextMaintenance: '18 Sep 2026',
    assignee: 'Rahul Singh'
  },
  {
    id: 'GEN-BHA-002',
    name: 'Generator 04 (Volvo Penta D13)',
    type: 'Diesel Generator',
    station: 'Bharati',
    output: '0 kW (Standby)',
    health: 98,
    status: 'Standby',
    lastMaintenance: '28 Aug 2026',
    nextMaintenance: '25 Sep 2026',
    assignee: 'Rahul Singh'
  },
  {
    id: 'SOL-MAI-001',
    name: 'Maitri Polar Solar Array Alpha',
    type: 'Solar PV Array',
    station: 'Maitri',
    output: '22 kW',
    health: 94,
    status: 'Operational',
    lastMaintenance: '01 Sep 2026',
    nextMaintenance: '15 Sep 2026',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'SOL-BHA-001',
    name: 'Bharati Rooftop Bifacial Solar Array',
    type: 'Solar PV Array',
    station: 'Bharati',
    output: '16.4 kW',
    health: 91,
    status: 'Operational',
    lastMaintenance: '02 Sep 2026',
    nextMaintenance: '16 Sep 2026',
    assignee: 'Rahul Singh'
  },
  {
    id: 'BAT-MAI-BESS',
    name: 'Maitri Lithium BESS Bank',
    type: 'Battery Storage',
    station: 'Maitri',
    output: '220 kWh',
    health: 89,
    status: 'Operational',
    lastMaintenance: '26 Aug 2026',
    nextMaintenance: '14 Sep 2026',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'BAT-BHA-BESS',
    name: 'Bharati Smart Microgrid BESS',
    type: 'Battery Storage',
    station: 'Bharati',
    output: '190 kWh',
    health: 76,
    status: 'Needs Attention',
    lastMaintenance: '18 Aug 2026',
    nextMaintenance: '12 Sep 2026',
    assignee: 'Rahul Singh'
  },
  {
    id: 'SWG-MAI-001',
    name: 'Central 415V Switchgear & Busbar',
    type: 'Power Distribution',
    station: 'Maitri',
    output: '650 kVA',
    health: 97,
    status: 'Operational',
    lastMaintenance: '04 Sep 2026',
    nextMaintenance: '24 Sep 2026',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'SWG-BHA-001',
    name: 'Bharati Microgrid SCADA Controller',
    type: 'Power Distribution',
    station: 'Bharati',
    output: '500 kVA',
    health: 95,
    status: 'Operational',
    lastMaintenance: '03 Sep 2026',
    nextMaintenance: '22 Sep 2026',
    assignee: 'Rahul Singh'
  }
];

export const ENERGY_MAINTENANCE = {
  due: [
    { assetId: 'GEN-MAI-002', name: 'Generator 02', station: 'Maitri', dueText: 'Vibration & injector overhaul in 2 days', priority: 'high' },
    { assetId: 'BAT-BHA-BESS', name: 'Bharati Smart BESS', station: 'Bharati', dueText: 'Cell balance calibration in 4 days', priority: 'medium' }
  ],
  overdue: [
    { assetId: 'HTG-BHA-001', name: 'Thermal Exchanger 01', station: 'Bharati', dueText: 'Heating loop inspection overdue by 1 day', priority: 'critical' }
  ],
  inProgress: [
    { assetId: 'SOL-BHA-001', name: 'Bharati Solar Array', station: 'Bharati', dueText: 'Angle adjustment & snow defrosting in progress', priority: 'medium' }
  ],
  completed: [
    { assetId: 'GEN-MAI-001', name: 'Generator 01', station: 'Maitri', dueText: 'Lube filter & oil flush completed yesterday', priority: 'done' },
    { assetId: 'SWG-MAI-001', name: 'Switchgear Busbar', station: 'Maitri', dueText: 'Thermal imaging scan completed', priority: 'done' }
  ]
};

export const RECENT_ENERGY_ACTIVITY = [
  { time: '09:42', action: 'Generator 02 harmonic sensor alert logged', person: 'Arjun Sharma', type: 'warning' },
  { time: '09:15', action: 'Solar generation peak reached 38.4 kW', person: 'Rahul Singh', type: 'update' },
  { time: '08:50', action: 'BESS battery charging state changed to Float', person: 'SCADA System', type: 'update' },
  { time: '08:20', action: 'Generator 01 test run and maintenance sign-off', person: 'Arjun Sharma', type: 'completed' },
  { time: '07:10', action: 'Morning microgrid frequency sync check OK (50.02 Hz)', person: 'Priya Rawat', type: 'inspection' }
];

export const ENERGY_FLOW_NODES = [
  { id: 'gen-source', label: 'Diesel Generators', kw: '800 kW', type: 'generation' },
  { id: 'sol-source', label: 'Solar PV Array', kw: '38 kW', type: 'generation' },
  { id: 'dist-hub', label: 'Microgrid Busbar', kw: '838 kW', type: 'distribution' },
  { id: 'bat-storage', label: 'BESS Battery Bank', kw: '410 kWh', type: 'storage' },
  { id: 'load-heating', label: 'Heating & Thermal', kw: '270 kW', type: 'load' },
  { id: 'load-labs', label: 'Science Labs', kw: '128 kW', type: 'load' },
  { id: 'load-comms', label: 'Satellite Comms', kw: '71 kW', type: 'load' },
  { id: 'load-living', label: 'Living & Life Support', kw: '107 kW', type: 'load' }
];
