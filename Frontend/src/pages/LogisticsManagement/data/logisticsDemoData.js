// DEMO / SIMULATED DATA — Replace with API response when endpoint is available.
// This file contains structured domain data for the Antarctic Logistics & Supply Operations Center.
// Clearly marked: Vessel tracking, cargo transit, and flight ETA data are simulated for decision-support modeling.

export const STATIONS = [
  { id: 'maitri', name: 'Maitri', location: 'Schirmacher Oasis', lat: '-70.7667° S', lon: '11.7333° E', supplyHub: 'Cape Town Gateway' },
  { id: 'bharati', name: 'Bharati', location: 'Larsemann Hills', lat: '-69.4083° S', lon: '76.1867° E', supplyHub: 'Mauritius / Goa Gateway' }
];

export const SUPPLY_OVERVIEW_KPIS = {
  totalInventoryItems: 428,
  criticalItems: 12,
  lowStock: 28,
  inTransit: 64,
  storageUtilizationPercent: 72,
  daysOfSupplyAvg: 46
};

export const SUPPLY_CATEGORIES = [
  { id: 'fuel', name: 'Fuel & Hydrocarbons', stockPercent: 64, daysRemaining: 21, criticalCount: 1, status: 'Healthy', icon: '🛢️' },
  { id: 'food', name: 'Rations & Nutrition', stockPercent: 72, daysRemaining: 46, criticalCount: 0, status: 'Healthy', icon: '🥫' },
  { id: 'spares', name: 'Mechanical & Electrical Spares', stockPercent: 28, daysRemaining: 14, criticalCount: 6, status: 'Attention', icon: '⚙️' },
  { id: 'medical', name: 'Medical & Pharmaceuticals', stockPercent: 81, daysRemaining: 58, criticalCount: 1, status: 'Healthy', icon: '💊' },
  { id: 'scientific', name: 'Scientific Materials & Cryogens', stockPercent: 54, daysRemaining: 32, criticalCount: 2, status: 'Normal', icon: '🔬' },
  { id: 'equipment', name: 'Essential Station Equipment', stockPercent: 41, daysRemaining: 18, criticalCount: 4, status: 'Attention', icon: '🚜' },
  { id: 'storage', name: 'Total Storage Capacity', stockPercent: 72, availablePercent: 28, criticalCount: 0, status: 'Normal', icon: '📦' }
];

export const STATION_INVENTORY_HEALTH = [
  {
    station: 'Maitri',
    healthPercent: 91,
    fuelStatus: 'Healthy',
    foodStatus: 'Healthy',
    medicalStatus: 'Healthy',
    sparesStatus: 'Attention',
    scientificStatus: 'Normal',
    storageUsedPercent: 72,
    storageCapacityUnits: 10000,
    storageUsedUnits: 7200,
    criticalCount: 4
  },
  {
    station: 'Bharati',
    healthPercent: 76,
    fuelStatus: 'Attention',
    foodStatus: 'Healthy',
    medicalStatus: 'Healthy',
    sparesStatus: 'Critical',
    scientificStatus: 'Normal',
    storageUsedPercent: 93,
    storageCapacityUnits: 8500,
    storageUsedUnits: 7900,
    criticalCount: 8
  }
];

export const CRITICAL_SUPPLIES = [
  {
    id: 'SP-BHA-008',
    item: 'Generator Electronic Control Module (ECM)',
    category: 'Spare Parts',
    station: 'Bharati',
    currentStock: 0,
    minRequired: 2,
    dailyConsumption: '0.0 / On Demand',
    daysRemaining: 0,
    nextResupply: '12 days (Ship ETA)',
    riskLevel: 'CRITICAL',
    actionRequired: 'Emergency air freight request initiated; generator on single-string backup.'
  },
  {
    id: 'SP-MAI-024',
    item: 'Polar Fuel Water-Separator Filter Assembly',
    category: 'Spare Parts',
    station: 'Maitri',
    currentStock: 4,
    minRequired: 8,
    dailyConsumption: '1.0 / day',
    daysRemaining: 4,
    nextResupply: '10 days (Overland convoy)',
    riskLevel: 'HIGH',
    actionRequired: 'Ration replacement interval; clean secondary reusable filter mesh.'
  },
  {
    id: 'MED-BHA-002',
    item: 'Extreme Cold Trauma & Hyperbaric Kits',
    category: 'Medical Supplies',
    station: 'Bharati',
    currentStock: 2,
    minRequired: 5,
    dailyConsumption: '0.1 / day',
    daysRemaining: 20,
    nextResupply: '14 days (Flight)',
    riskLevel: 'ATTENTION',
    actionRequired: 'Check sterile seal integrity; prioritize in upcoming LC-130 manifest.'
  },
  {
    id: 'SP-MAI-033',
    item: 'Cryogenic Vacuum O-Ring High-Vacuum Seals',
    category: 'Scientific Materials',
    station: 'Maitri',
    currentStock: 1,
    minRequired: 4,
    dailyConsumption: '0.2 / day',
    daysRemaining: 5,
    nextResupply: '12 days',
    riskLevel: 'HIGH',
    actionRequired: 'Deep ice-core drill maintenance buffer depleted; postpone non-critical sampling.'
  }
];

export const SUPPLY_COVERAGE = [
  { category: 'Fuel (Polar D-50 Diesel)', days: 21, threshold: 30, status: 'Attention', stockText: '74,240 L remaining' },
  { category: 'Food & Freeze-Dried Rations', days: 46, threshold: 30, status: 'Healthy', stockText: '1,380 Person-Days' },
  { category: 'Medical & Trauma Supplies', days: 58, threshold: 30, status: 'Healthy', stockText: '58 Days Autonomous' },
  { category: 'Mechanical & Generator Spares', days: 14, threshold: 25, status: 'Critical', stockText: 'Immediate Reorder Required' },
  { category: 'Scientific Reagents & Liquid N2', days: 32, threshold: 20, status: 'Normal', stockText: 'Adequate for Active Experiments' },
  { category: 'Cold-Weather Essential Gear', days: 18, threshold: 20, status: 'Attention', stockText: 'Extra Parkas & Boots Required' }
];

export const CONSUMPTION_TRENDS = {
  today: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    fuel: [34, 32, 38, 42, 45, 41, 36],
    food: [12, 10, 24, 30, 26, 28, 14],
    medical: [2, 1, 3, 2, 4, 2, 1],
    scientific: [8, 6, 12, 14, 15, 11, 7]
  },
  sevenDays: {
    labels: ['02 Sep', '03 Sep', '04 Sep', '05 Sep', '06 Sep', '07 Sep', '08 Sep'],
    fuel: [810, 825, 840, 830, 855, 870, 820],
    food: [140, 145, 150, 142, 148, 155, 144],
    medical: [14, 12, 18, 15, 12, 20, 16],
    scientific: [64, 70, 68, 72, 75, 80, 71]
  },
  thirtyDays: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    fuel: [5600, 5750, 5900, 6100, 5800],
    food: [980, 1020, 1010, 1050, 1008],
    medical: [95, 105, 98, 112, 102],
    scientific: [480, 510, 495, 530, 510]
  }
};

export const CONSUMPTION_BREAKDOWN = [
  { category: 'Fuel (Generators & Vehicles)', percent: 38, color: '#f97316' },
  { category: 'Food & Station Provisions', percent: 22, color: '#10b981' },
  { category: 'Scientific Materials & Cryogens', percent: 15, color: '#3b82f6' },
  { category: 'General Operations & Water Treatment', percent: 12, color: '#64748b' },
  { category: 'Spare Parts & Maintenance Hardware', percent: 8, color: '#8b5cf6' },
  { category: 'Medical & Surgical Supplies', percent: 5, color: '#06b6d4' }
];

export const STORAGE_FACILITIES = [
  {
    station: 'Maitri',
    facility: 'Central Supply Depot',
    totalCapacity: 10000,
    used: 7200,
    available: 2800,
    utilizationPercent: 72,
    status: 'Normal',
    breakdown: [
      { name: 'Fuel Storage (Tank Farm)', used: 3400, capacity: 4500, percent: 75 },
      { name: 'Food & Rations Vault', used: 1600, capacity: 2200, percent: 72 },
      { name: 'Spare Parts & Mechanical Bay', used: 1100, capacity: 1800, percent: 61 },
      { name: 'Medical & Clean Storage', used: 450, capacity: 600, percent: 75 },
      { name: 'Science Cryo Storage', used: 650, capacity: 900, percent: 72 }
    ]
  },
  {
    station: 'Bharati',
    facility: 'Integrated Logistics Complex',
    totalCapacity: 8500,
    used: 7900,
    available: 600,
    utilizationPercent: 93,
    status: 'Near Capacity',
    breakdown: [
      { name: 'Fuel Storage (Module B)', used: 3200, capacity: 3300, percent: 97 },
      { name: 'Food Storage Depot', used: 1900, capacity: 2000, percent: 95 },
      { name: 'Spares & Engineering Store', used: 1400, capacity: 1600, percent: 87 },
      { name: 'Medical Quarantine Bay', used: 550, capacity: 600, percent: 91 },
      { name: 'Scientific Sample Vault', used: 850, capacity: 1000, percent: 85 }
    ]
  }
];

export const STORAGE_ALERTS = [
  {
    type: 'WARNING',
    title: 'Bharati Station storage utilization at 93% capacity',
    detail: 'Warehouse modules B and C require consolidation prior to next seasonal resupply vessel arrival.',
    timestamp: '18 minutes ago',
    station: 'Bharati'
  },
  {
    type: 'CRITICAL',
    title: 'Bharati Fuel tank farm approaching operational maximum (97%)',
    detail: 'Secondary expansion bladder valve must be pre-heated to accept incoming shipment transfer.',
    timestamp: '34 minutes ago',
    station: 'Bharati'
  }
];

export const RESUPPLY_SCHEDULE = [
  {
    station: 'Maitri',
    nextResupplyDate: '18 Dec 2026',
    daysUntilArrival: 12,
    mode: 'Ice-class Vessel + PistenBully Convoy',
    vessel: 'MV Vasiliy Golovnin (India Charter)',
    supplies: ['Arctic Winter Fuel (35,000 L)', 'Freeze-Dried Provisions (90 Days)', 'Generator C9 Major Overhaul Kit', 'Medical Replenishment'],
    status: 'In Transit',
    progress: 78
  },
  {
    station: 'Bharati',
    nextResupplyDate: '20 Dec 2026',
    daysUntilArrival: 14,
    mode: 'Polar Icebreaker + Cargo Helicopter Airlift',
    vessel: 'R/V Nathaniel B. Palmer',
    supplies: ['Generator Control Module (ECM)', 'Bifacial Solar Spares', 'Atmospheric Lab Helium Gas Cylinders', 'Cold Trauma Surgery Kits'],
    status: 'Preparing Cargo',
    progress: 52
  }
];

export const INCOMING_SHIPMENTS = [
  {
    id: 'LOG-2026-021',
    vessel: 'MV Vasiliy Golovnin',
    origin: 'Cape Town (RSA)',
    destination: 'Maitri (via India Bay Shelf)',
    cargoSummary: 'Polar Fuel (35,000 L) + Food + C9 Generator Spares',
    eta: '18 Dec 2026',
    progress: 78,
    status: 'In Transit',
    trackingType: 'DEMO / SIMULATED TRACKING',
    position: 'Southern Ocean (58.4°S, 14.2°E)',
    seaState: 'Force 6 Winds (Iceberg Nav Active)',
    cargoStatus: 'Secure & Heated'
  },
  {
    id: 'LOG-2026-022',
    vessel: 'R/V Nathaniel B. Palmer',
    origin: 'Goa / Port Louis (Mauritius)',
    destination: 'Bharati (Larsemann Hills Quay)',
    cargoSummary: 'Scientific Reagents + ECM Modules + Cold Emergency Rations',
    eta: '20 Dec 2026',
    progress: 52,
    status: 'In Transit',
    trackingType: 'DEMO / SIMULATED TRACKING',
    position: 'Indian Ocean Sub-Antarctic (52.1°S, 68.4°E)',
    seaState: 'Force 4 Winds (Clear Seas)',
    cargoStatus: 'Temp-Controlled 4°C Vault OK'
  },
  {
    id: 'LOG-AIR-004',
    vessel: 'LC-130 Hercules (Ski-Equipped)',
    origin: 'Christchurch (NZ) via McMurdo',
    destination: 'Bharati Ice Runway',
    cargoSummary: 'Priority Generator Electronic Modules & Specialized Trauma Kits',
    eta: '10 Sep 2026 (Urgent Air Cargo)',
    progress: 45,
    status: 'Flight Preparing',
    trackingType: 'DEMO / SIMULATED TRACKING',
    position: 'Staged at McMurdo Airfield',
    seaState: 'Weather Window Awaiting Clear Ridge',
    cargoStatus: 'Fast-Track Dispatch'
  }
];

export const EMERGENCY_REQUESTS = [
  {
    id: 'EC-2026-018',
    station: 'Bharati',
    priority: 'CRITICAL',
    requiredItem: 'Generator Electronic Control Module (ECM) ×2',
    quantity: 2,
    reason: 'Generator 02 electrical fault; station running without hot-standby redundancy.',
    requiredBy: 'Within 48 Hours',
    requestedBy: 'ENG-EMP-001 (Arjun Sharma)',
    requestedDate: '08 Sep 2026 09:30 UTC',
    status: 'Preparing Air Dispatch',
    progress: 45
  },
  {
    id: 'EC-2026-017',
    station: 'Maitri',
    priority: 'HIGH',
    requiredItem: 'Fuel Water Separator Filter Elements ×6',
    quantity: 6,
    reason: 'Ice crystal buildup in primary day-tank feed line.',
    requiredBy: 'Within 5 Days',
    requestedBy: 'ENG-EMP-002 (Rahul Singh)',
    requestedDate: '07 Sep 2026 14:15 UTC',
    status: 'Dispatched on Overland Traverse',
    progress: 80
  }
];

export const SUPPLY_RISK_ANALYSIS = [
  {
    level: 'HIGH RISK',
    badgeClass: 'energy-badge-red',
    supply: 'Generator ECM & High-Pressure Injectors',
    station: 'Bharati',
    reason: 'Zero on-site spares. Subsystem operating on single prime generator.',
    daysRemaining: '0 Days Buffer',
    nextResupply: 'Emergency air flight expected in 48h.',
    recommendedAction: 'Limit lab heavy resistive heating loads until second generator is verified.'
  },
  {
    level: 'MEDIUM RISK',
    badgeClass: 'energy-badge-amber',
    supply: 'Polar Diesel Fuel Filter Elements',
    station: 'Maitri',
    reason: '4 units left with 1/day replacement rate in sub-zero blizzard conditions.',
    daysRemaining: '4 Days Remaining',
    nextResupply: 'Overland traverse arrival in 10 days.',
    recommendedAction: 'Engage secondary pre-heating loops to reduce filter wax accumulation.'
  },
  {
    level: 'LOW RISK',
    badgeClass: 'energy-badge-green',
    supply: 'Freeze-Dried Food Rations & Medical Kits',
    station: 'Maitri & Bharati',
    reason: 'Sufficient autonomous reserves covering all station personnel for 46–58 days.',
    daysRemaining: '46+ Days Remaining',
    nextResupply: 'Scheduled summer replenishment ship on course.',
    recommendedAction: 'Maintain routine temperature checks on cold storage bays.'
  }
];

export const INVENTORY_ITEMS = [
  {
    id: 'SP-BHA-008',
    item: 'Generator Electronic Control Module (ECM)',
    category: 'Spare Parts',
    station: 'Bharati',
    currentStock: 0,
    minStock: 2,
    dailyConsumption: '0.0 / Demand',
    daysRemaining: 0,
    status: 'Critical',
    storageLocation: 'Electronics Store B2',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'SP-MAI-024',
    item: 'Polar Fuel Water-Separator Filter Assembly',
    category: 'Spare Parts',
    station: 'Maitri',
    currentStock: 4,
    minStock: 8,
    dailyConsumption: '1.0 / day',
    daysRemaining: 4,
    status: 'Needs Attention',
    storageLocation: 'Mechanical Bay M1',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'MED-BHA-002',
    item: 'Extreme Cold Trauma & Surgical Kits',
    category: 'Medical Supplies',
    station: 'Bharati',
    currentStock: 2,
    minStock: 5,
    dailyConsumption: '0.1 / day',
    daysRemaining: 20,
    status: 'Needs Attention',
    storageLocation: 'Medical Bay Unit A',
    assignee: 'Priya Rawat'
  },
  {
    id: 'SP-MAI-033',
    item: 'Cryogenic Vacuum O-Ring Seals',
    category: 'Scientific Materials',
    station: 'Maitri',
    currentStock: 1,
    minStock: 4,
    dailyConsumption: '0.2 / day',
    daysRemaining: 5,
    status: 'Critical',
    storageLocation: 'Science Wing Lab 2',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'FUEL-MAI-001',
    item: 'Polar Grade Winter Diesel (D-50)',
    category: 'Fuel & Hydrocarbons',
    station: 'Maitri',
    currentStock: 42800,
    minStock: 20000,
    dailyConsumption: '420 L/day',
    daysRemaining: 102,
    status: 'Operational',
    storageLocation: 'Tank Farm Pods A1-A4',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'FUEL-BHA-001',
    item: 'Polar Grade Winter Diesel (D-50)',
    category: 'Fuel & Hydrocarbons',
    station: 'Bharati',
    currentStock: 31440,
    minStock: 18000,
    dailyConsumption: '400 L/day',
    daysRemaining: 78,
    status: 'Operational',
    storageLocation: 'Module B Fuel Bladder',
    assignee: 'Rahul Singh'
  },
  {
    id: 'FOOD-MAI-101',
    item: 'Freeze-Dried Balanced Polar Meal Packs',
    category: 'Rations & Nutrition',
    station: 'Maitri',
    currentStock: 1250,
    minStock: 500,
    dailyConsumption: '24 Packs/day',
    daysRemaining: 52,
    status: 'Operational',
    storageLocation: 'Cold Provision Room 1',
    assignee: 'Priya Rawat'
  },
  {
    id: 'FOOD-BHA-102',
    item: 'Nutritional Emergency Rations (High-Cal)',
    category: 'Rations & Nutrition',
    station: 'Bharati',
    currentStock: 980,
    minStock: 400,
    dailyConsumption: '20 Packs/day',
    daysRemaining: 49,
    status: 'Operational',
    storageLocation: 'Habitation Storage H3',
    assignee: 'Rahul Singh'
  },
  {
    id: 'SP-BHA-019',
    item: 'Desalination RO High-Pressure Membrane',
    category: 'Spare Parts',
    station: 'Bharati',
    currentStock: 1,
    minStock: 3,
    dailyConsumption: '0.2 / day',
    daysRemaining: 5,
    status: 'Needs Attention',
    storageLocation: 'Water Treatment Plant',
    assignee: 'Rahul Singh'
  },
  {
    id: 'SCI-MAI-201',
    item: 'Liquid Nitrogen Coolant Dewars (50L)',
    category: 'Scientific Materials',
    station: 'Maitri',
    currentStock: 8,
    minStock: 4,
    dailyConsumption: '0.3 / day',
    daysRemaining: 26,
    status: 'Operational',
    storageLocation: 'Cryo Vault Outer Ring',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'EQP-MAI-301',
    item: 'Extreme Weather Heated Parkas & Salopettes',
    category: 'Essential Equipment',
    station: 'Maitri',
    currentStock: 32,
    minStock: 25,
    dailyConsumption: '0.1 / day',
    daysRemaining: 320,
    status: 'Operational',
    storageLocation: 'Gear Locker G1',
    assignee: 'Arjun Sharma'
  },
  {
    id: 'EQP-BHA-302',
    item: 'PistenBully Hydraulic Track Replacement Pads',
    category: 'Essential Equipment',
    station: 'Bharati',
    currentStock: 3,
    minStock: 8,
    dailyConsumption: '0.4 / day',
    daysRemaining: 7,
    status: 'Needs Attention',
    storageLocation: 'Vehicle Maintenance Hangar',
    assignee: 'Rahul Singh'
  }
];

export const LOGISTICS_TEAM = [
  {
    id: 'LOG-EMP-001',
    name: 'Arjun Sharma',
    role: 'Logistics Operations Lead',
    station: 'Maitri',
    status: 'Online',
    assigned: 'Fuel Reserves · Mechanical Spares · Depot M1',
    avatar: 'AS',
    activeRequests: 12,
    assignedShipments: 2,
    commsChannel: 'VHF-14 (Logistics Net)',
    certifications: 'Polar Cargo Handling · Arctic HazMat Class 3'
  },
  {
    id: 'LOG-EMP-002',
    name: 'Rahul Singh',
    role: 'Station Supply Coordinator',
    station: 'Bharati',
    status: 'On Site',
    assigned: 'Helicopter Airlift · Water Spares · Warehouse B',
    avatar: 'RS',
    activeRequests: 8,
    assignedShipments: 3,
    commsChannel: 'VHF-10 (Bharati Supply)',
    certifications: 'IATA Dangerous Goods · Helideck Marshalling'
  },
  {
    id: 'LOG-EMP-003',
    name: 'Priya Rawat',
    role: 'Chief Inventory & Procurement Officer',
    station: 'HQ',
    status: 'Online',
    assigned: 'National Polar Supply Chain · Port Manifests',
    avatar: 'PR',
    activeRequests: 24,
    assignedShipments: 4,
    commsChannel: 'Inmarsat #804 (NCPOR)',
    certifications: 'Antarctic Treaty Logistics Protocol · Global Cold-Chain Lead'
  }
];

export const LOGISTICS_ALERTS = [
  {
    id: 'ALR-LOG-001',
    type: 'CRITICAL',
    title: 'Generator ECM module stock zero at Bharati Station',
    detail: 'Single-point-of-failure alert on station microgrid. Emergency air cargo requested.',
    station: 'Bharati',
    timestamp: '2 minutes ago',
    assetId: 'SP-BHA-008'
  },
  {
    id: 'ALR-LOG-002',
    type: 'WARNING',
    title: 'Fuel filter stock approaching threshold (4 units remaining)',
    detail: 'Consumption elevated due to continuous winter heating cycle.',
    station: 'Maitri',
    timestamp: '18 minutes ago',
    assetId: 'SP-MAI-024'
  },
  {
    id: 'ALR-LOG-003',
    type: 'WARNING',
    title: 'Bharati storage capacity reaches 93% operational ceiling',
    detail: 'Consolidation required before MV Vasiliy Golovnin offloading.',
    station: 'Bharati',
    timestamp: '32 minutes ago',
    assetId: 'STG-BHA-001'
  },
  {
    id: 'ALR-LOG-004',
    type: 'RESOLVED',
    title: 'Emergency Medical trauma kit stock verified and audited',
    detail: 'Cold inventory audit signed off by base medical officer.',
    station: 'Maitri',
    timestamp: '1 hour ago',
    assetId: 'MED-MAI-001'
  }
];

export const RECENT_LOGISTICS_ACTIVITY = [
  { time: '09:42', action: 'Generator ECM module marked critical zero inventory', person: 'Arjun Sharma', type: 'critical' },
  { time: '09:20', action: 'New vessel cargo manifest added for MV Vasiliy Golovnin', person: 'Priya Rawat', type: 'update' },
  { time: '08:50', action: 'Fuel tank level telemetry updated from SCADA pods', person: 'Rahul Singh', type: 'update' },
  { time: '08:20', action: 'Sterile seal check completed on Medical Trauma Kits', person: 'Base Medical Team', type: 'inspection' },
  { time: '07:15', action: 'Routine inventory reconciliation for 428 station SKUs', person: 'Arjun Sharma', type: 'completed' }
];

export const LOGISTICS_IMPACTS = [
  {
    title: 'Low Fuel Stock → Research Delay Cascade',
    steps: [
      'Fuel reserve drops below operational buffer during prolonged blizzard',
      'Non-essential microgrid power circuits automated load-shedding',
      'Heating loop in science wing throttled to maintain living quarter heat',
      'Deep ice-core sample analysis delayed until summer resupply arrives'
    ]
  },
  {
    title: 'Spare Part Stockout → Infrastructure Downtime',
    steps: [
      'Generator 02 ECM module failure with 0 spare units on station',
      'Station microgrid operates without hot-standby redundancy',
      'High-draw equipment (water desalination, rock drill) restricted to off-peak hours',
      'Preventive maintenance scheduled until emergency air drop arrives'
    ]
  }
];

export const LOGISTICS_PERFORMANCE = {
  inventoryAccuracyPercent: 98.2,
  onTimeResupplyPercent: 94.0,
  criticalSupplyAvailabilityPercent: 91.5,
  storageUtilizationPercent: 72.0,
  openSupplyRequests: 14,
  activeShipments: 3
};
