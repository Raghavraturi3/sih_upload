// Antarctic Logistics Command Center & Live Tracking Dataset
// Comprehensive live tracking data for maritime resupply vessels, emergency polar air cargo,
// itemized cargo manifests, geospatial route waypoints, and Digital Twin inventory integration.

export const COMMAND_CENTER_METADATA = {
  facility: 'NCPOR Polar Logistics & Resupply Command Center',
  callsign: 'POLAR-OPS-CONTROL',
  trackingFrequencySeconds: 30,
  activeVesselsCount: 4,
  activeAirMissionsCount: 2,
  activeEmergencyRequestsCount: 1,
  lastSatelliteSync: '2026-09-09T01:15:00Z'
};

export const TRACKED_VESSELS = [
  {
    id: 'VES-ANT-01',
    name: 'MV Antarctic Support',
    type: 'Heavy Polar Resupply Vessel',
    iceClass: 'DNV Ice-1A Super / Polar Class 6',
    flag: 'India (IN)',
    captain: 'Capt. Vikramaditya Sen',
    route: 'Mormugao Port (India) → Cape Town → Maitri Station',
    currentLocationName: 'Southern Ocean (Furious Fifties)',
    coordinates: { lat: -52.418, lng: 24.812 },
    destination: 'Maitri Station (Schirmacher Oasis)',
    destCoordinates: { lat: -70.766, lng: 11.732 },
    status: 'IN_TRANSIT',
    statusLabel: 'In Transit',
    statusColor: '#10b981',
    departureDate: '25 Nov 2026',
    expectedArrival: '18 Dec 2026',
    etaDays: 10,
    etaHours: 240,
    progressPercent: 78,
    speedKnots: 15.4,
    headingDeg: 198,
    distanceRemainingKm: 2840,
    totalRouteDistanceKm: 12900,
    etaConfidence: 'High (94%)',
    weatherCondition: 'Moderate Swell (3.2m), Wind 24 kts WSW',
    seaIceConcentration: '2/10 Marginal Ice Zone',
    cargoSummary: '45,000L Fuel, 2,400kg Food, 850kg Spares, 1,200kg Materials',
    totalCargoWeightKg: 51950,
    cargoManifest: [
      { category: 'Fuel & Hydrocarbons', icon: '⛽', item: 'Polar Grade-A Kerosene & Jet-A1', qty: '45,000 Liters', weightKg: 36000, priority: 'HIGH', storageClass: 'Bunkered Heated Tanks' },
      { category: 'Food & Rations', icon: '🥫', item: 'Freeze-Dried Rations & Canned Provisions', qty: '120 Crates', weightKg: 2400, priority: 'MEDIUM', storageClass: 'Dry Hold Alpha' },
      { category: 'Mechanical Spares', icon: '🔧', item: 'Generator #01 Overhaul Gaskets & Filters', qty: '34 Units', weightKg: 850, priority: 'HIGH', storageClass: 'Secure Crate Hold' },
      { category: 'Research Equipment', icon: '🧪', item: 'Deep Ice Core Sampling Cryo-Drill Heads', qty: '6 Crates', weightKg: 320, priority: 'MEDIUM', storageClass: 'Climate-Controlled (+4°C)' },
      { category: 'Medical Supplies', icon: '💊', item: 'Surgical Trauma Packs & Antibiotics', qty: '12 Packs', weightKg: 180, priority: 'CRITICAL', storageClass: 'Medical Locker A' },
      { category: 'Station Materials', icon: '🏗️', item: 'Insulated Cladding Panels & Fasteners', qty: '45 Bundles', weightKg: 1200, priority: 'MEDIUM', storageClass: 'Open Deck Lashing' }
    ]
  },
  {
    id: 'VES-ANT-02',
    name: 'R/V Bharati Polar Explorer',
    type: 'Scientific Research & Icebreaking Vessel',
    iceClass: 'Polar Class 4 (2.0m Solid Ice)',
    flag: 'India (IN)',
    captain: 'Capt. Rajesh Nair',
    route: 'Cape Town (South Africa) → Bharati Station (Larsemann Hills)',
    currentLocationName: 'Prydz Bay Approaches',
    coordinates: { lat: -64.215, lng: 72.481 },
    destination: 'Bharati Station',
    destCoordinates: { lat: -69.407, lng: 76.187 },
    status: 'IN_TRANSIT',
    statusLabel: 'In Transit',
    statusColor: '#10b981',
    departureDate: '28 Nov 2026',
    expectedArrival: '14 Dec 2026',
    etaDays: 6,
    etaHours: 144,
    progressPercent: 88,
    speedKnots: 14.8,
    headingDeg: 165,
    distanceRemainingKm: 1420,
    totalRouteDistanceKm: 9800,
    etaConfidence: 'Very High (98%)',
    weatherCondition: 'Dense Pack Ice (1.4m), Clear Atmosphere',
    seaIceConcentration: '6/10 Pack Ice (Icebreaker Escort Active)',
    cargoSummary: '60,000L Diesel, 3,200kg Food, 1,400kg Lab Reagents',
    totalCargoWeightKg: 64600,
    cargoManifest: [
      { category: 'Fuel & Hydrocarbons', icon: '⛽', item: 'Low-Pour Polar Diesel Fuel', qty: '60,000 Liters', weightKg: 51000, priority: 'HIGH', storageClass: 'Double-Hull Bunkers' },
      { category: 'Food & Rations', icon: '🥫', item: 'Fresh Frozen Meats, Vegetables & Dairy', qty: '180 Boxes', weightKg: 3200, priority: 'MEDIUM', storageClass: 'Freezer Hold (-20°C)' },
      { category: 'Research Equipment', icon: '🧪', item: 'Mass Spectrometer Cryo-Gas Cylinders', qty: '14 Cylinders', weightKg: 1400, priority: 'HIGH', storageClass: 'Hazardous Cargo Bay' },
      { category: 'Safety & Cold Gear', icon: '🧥', item: 'Polar Extreme Thermal Parkas & Boots', qty: '25 Kits', weightKg: 450, priority: 'MEDIUM', storageClass: 'Dry Hold Beta' }
    ]
  },
  {
    id: 'VES-ANT-03',
    name: 'MV Maitri Resupply Vessel',
    type: 'Heavy Ice-Strengthened Cargo Carrier',
    iceClass: 'Ice-1A Standard',
    flag: 'India (IN)',
    captain: 'Capt. Sunil Kulkarni',
    route: 'Goa Port → Roaring Forties → Maitri Station',
    currentLocationName: 'Roaring Forties Storm Front (46°S 18°E)',
    coordinates: { lat: -46.124, lng: 18.349 },
    destination: 'Maitri Station',
    destCoordinates: { lat: -70.766, lng: 11.732 },
    status: 'DELAYED',
    statusLabel: 'Delayed (Storm Front)',
    statusColor: '#f59e0b',
    departureDate: '15 Nov 2026',
    expectedArrival: '23 Dec 2026 (Original: 18 Dec)',
    etaDays: 15,
    etaHours: 360,
    progressPercent: 42,
    speedKnots: 11.2,
    headingDeg: 190,
    distanceRemainingKm: 5820,
    totalRouteDistanceKm: 13400,
    etaConfidence: 'Medium (72% due to gale)',
    weatherCondition: 'Severe Gale 48 kts, 6.5m Wave Swell, Heavy Rolling',
    seaIceConcentration: 'Open Ocean / Sea Spray Glaze',
    cargoSummary: 'Heavy Prefab Modules, Structural Steel, 20,000L Fuel',
    totalCargoWeightKg: 85000,
    cargoManifest: [
      { category: 'Station Materials', icon: '🏗️', item: 'Modular Living Pod Structural Steel Frames', qty: '8 Modules', weightKg: 42000, priority: 'MEDIUM', storageClass: 'Main Cargo Hold' },
      { category: 'Fuel & Hydrocarbons', icon: '⛽', item: 'Arctic Turbine Lubricant & Fuel Drums', qty: '20,000 Liters', weightKg: 18000, priority: 'HIGH', storageClass: 'Sealed Drum Bay' },
      { category: 'Infrastructure', icon: '⚙️', item: 'Water Recycling Membrane Replacement Units', qty: '4 Assemblies', weightKg: 2400, priority: 'HIGH', storageClass: 'Dry Hold' }
    ]
  },
  {
    id: 'VES-ANT-04',
    name: 'SA Agulhas II Polar Expedition',
    type: 'Deep Sea Research & Supply Icebreaker',
    iceClass: 'Polar Class 5',
    flag: 'South Africa / Joint NCPOR Charter',
    captain: 'Capt. David Mthembu',
    route: 'Cape Town Logistics Berth → Dronning Maud Land Coast',
    currentLocationName: 'Antarctic Convergence Zone (58°S)',
    coordinates: { lat: -58.491, lng: 14.112 },
    destination: 'Maitri Logistics Drop Point',
    destCoordinates: { lat: -70.766, lng: 11.732 },
    status: 'IN_TRANSIT',
    statusLabel: 'In Transit',
    statusColor: '#10b981',
    departureDate: '01 Dec 2026',
    expectedArrival: '16 Dec 2026',
    etaDays: 8,
    etaHours: 192,
    progressPercent: 64,
    speedKnots: 16.0,
    headingDeg: 182,
    distanceRemainingKm: 2180,
    totalRouteDistanceKm: 6800,
    etaConfidence: 'High (92%)',
    weatherCondition: 'Moderate Iceberg Drift, Winds 18 kts SSW',
    seaIceConcentration: '3/10 Iceberg Alley',
    cargoSummary: 'Meteorological Radar Masts, Scientific Arrays',
    totalCargoWeightKg: 32000,
    cargoManifest: [
      { category: 'Research Equipment', icon: '🧪', item: 'Doppler Weather Radar Replacement Array', qty: '2 Assemblies', weightKg: 1800, priority: 'HIGH', storageClass: 'Heated Hold' },
      { category: 'Mechanical Spares', icon: '🔧', item: 'Snowcat PistenBully Track Replacement Kits', qty: '4 Sets', weightKg: 1600, priority: 'MEDIUM', storageClass: 'Deck Crate' }
    ]
  }
];

export const EMERGENCY_AIR_MISSIONS = [
  {
    missionId: 'AIR-EMG-2026-018',
    flightNumber: 'AF-IND-04 Polar Express',
    aircraftType: 'DHC-6 Twin-Otter Ski-Equipped Turboprop',
    tailNumber: 'VU-ANT-04',
    pilotInCommand: 'Wg Cdr S. Rathore (Retd.)',
    priority: 'CRITICAL',
    priorityColor: '#ef4444',
    status: 'IN_TRANSIT',
    statusLabel: 'In Transit (Approaching Larsemann Hills)',
    statusColor: '#10b981',
    origin: 'Cape Town Air Logistics Terminal',
    intermediateStop: 'Novo Airfield Blue Ice Runway (Refueling Complete)',
    destination: 'Bharati Station Blue Ice Skiway',
    coordinates: { lat: -68.12, lng: 74.35 },
    altitudeFt: 14500,
    groundSpeedKnots: 172,
    departureTime: '08 Sep 06:30 UTC',
    estimatedArrival: '10 Sep 14:00 UTC',
    etaHoursRemaining: 36,
    totalCargoWeightKg: 185,
    requestedBy: 'Dr. Kashish Sharma (Base Commander) / LOG-002',
    requestReason: 'Generator #02 Turbo Bearing failure; zero stock on site. Severe heating power deficit risk.',
    cargoManifest: [
      { item: 'Generator #02 High-Temp Turbo Bearings & Seal Kit', qty: 2, weightKg: 42, critical: true, icon: '⚙️' },
      { item: 'Digital Electronic Governor Control Module', qty: 1, weightKg: 18, critical: true, icon: '🎛️' },
      { item: 'Emergency Medical Surgical Plasma & Antibiotics Pack', qty: 1, weightKg: 25, critical: false, icon: '💊' },
      { item: 'Iridium Extreme High-Gain Satellite Transceiver Unit', qty: 1, weightKg: 15, critical: false, icon: '📡' },
      { item: 'Polar Cold-Start Glycol Primer Fluid (Pressurized Canisters)', qty: 4, weightKg: 85, critical: true, icon: '🛢️' }
    ]
  },
  {
    missionId: 'AIR-EMG-2026-019',
    flightNumber: 'AF-IND-02 Skibird',
    aircraftType: 'Lockheed LC-130H Hercules (Ski-Equipped)',
    tailNumber: 'VU-ANT-02',
    pilotInCommand: 'Sqn Ldr R. Verma',
    priority: 'HIGH',
    priorityColor: '#f59e0b',
    status: 'PREPARING_TAKEOFF',
    statusLabel: 'Preparing for Departure',
    statusColor: '#f59e0b',
    origin: 'Punta Arenas Gateway (Chile)',
    intermediateStop: 'Union Glacier Camp',
    destination: 'Maitri Station Blue Ice Skiway',
    coordinates: { lat: -53.16, lng: -70.91 },
    altitudeFt: 0,
    groundSpeedKnots: 0,
    departureTime: '11 Sep 04:00 UTC',
    estimatedArrival: '12 Sep 18:00 UTC',
    etaHoursRemaining: 72,
    totalCargoWeightKg: 4200,
    requestedBy: 'Arjun Sharma (Energy Engineer) / ENG-001',
    requestReason: 'Scheduled seasonal glycol heating fluid replenishment and solar PV inverter array.',
    cargoManifest: [
      { item: 'Non-Toxic Low-Temp Glycol Fluid Replacement Drums', qty: 12, weightKg: 2800, critical: false, icon: '🧪' },
      { item: 'Polar Inverter Replacement Power Banks (30 kW)', qty: 2, weightKg: 950, critical: true, icon: '⚡' },
      { item: 'Atmospheric Physics UV Spectrophotometer Spare Tubes', qty: 4, weightKg: 450, critical: false, icon: '🌌' }
    ]
  }
];

export const EMERGENCY_DECISION_ENGINE_DATA = {
  station: 'Bharati Station',
  riskLevel: 'CRITICAL_RISK',
  incidentSummary: 'Generator #02 mechanical bearing strain has degraded generation capacity by 34%, forcing auxiliary burner activation and increasing daily fuel burn by +18%.',
  rootCause: 'Zero on-site spare bearings in station inventory. Primary supply vessel MV Antarctic Support is 10 days out.',
  criticalWindowHours: 72,
  decisionAnalysis: [
    { factor: 'On-Site Stock', value: '0 Units (Depleted)', status: 'CRITICAL', color: '#ef4444' },
    { factor: 'Normal Ship ETA', value: '10 Days (Too Slow)', status: 'WARNING', color: '#f59e0b' },
    { factor: 'Safe Operating Window', value: '3 Days Maximum', status: 'CRITICAL', color: '#ef4444' },
    { factor: 'Emergency Air Cargo ETA', value: '36 Hours (Within Window)', status: 'RESOLVING', color: '#10b981' }
  ],
  aiRecommendation: {
    title: 'Emergency Air Resupply Execution Authorized',
    text: 'Normal sea logistics (10-day ETA) exceeds the safe operational failure window of 3 days. Initiating emergency polar air resupply Flight AF-IND-04 guarantees spare delivery within 36 hours, preventing unrecoverable deep freeze of station research water lines.',
    confidenceScore: 98,
    actionTaken: 'Flight AF-IND-04 Dispatched with 2x Bearing Kits',
    projectedStockAfterDelivery: 2,
    projectedStationHealthAfterFix: '98% (Nominal)'
  }
};

export const INVENTORY_SUPPLY_GAP_CORRELATION = [
  {
    item: 'Generator #02 High-Temp Turbo Bearings',
    station: 'Bharati',
    category: 'Mechanical Spares',
    currentStock: 0,
    requiredBaseline: 2,
    seaShipmentIncomingQty: 4,
    seaShipmentETA: '10 Days (MV Antarctic Support)',
    emergencyAirIncomingQty: 2,
    emergencyAirETA: '36 Hours (Flight AF-IND-04)',
    gapStatus: 'AIR_INTERVENTION_ACTIVE',
    gapStatusLabel: 'Air Mission En Route (+2)',
    gapColor: '#10b981',
    downstreamSystem: 'Microgrid Generator 02'
  },
  {
    item: 'Glycol Low-Temp Thermal Circulation Fluid',
    station: 'Maitri',
    category: 'Heating & Thermal',
    currentStock: 140,
    requiredBaseline: 500,
    seaShipmentIncomingQty: 1000,
    seaShipmentETA: '10 Days (MV Antarctic Support)',
    emergencyAirIncomingQty: 600,
    emergencyAirETA: '72 Hours (Flight AF-IND-02)',
    gapStatus: 'MONITORING',
    gapStatusLabel: 'Adequate for 14 Days',
    gapColor: '#38bdf8',
    downstreamSystem: 'HVAC Glycol Loop'
  },
  {
    item: 'Deep Ice Core Cryo-Chiller Filter Elements',
    station: 'Bharati',
    category: 'Research Consumables',
    currentStock: 1,
    requiredBaseline: 4,
    seaShipmentIncomingQty: 8,
    seaShipmentETA: '6 Days (R/V Bharati)',
    emergencyAirIncomingQty: 0,
    emergencyAirETA: 'None Required',
    gapStatus: 'SEA_RESOLVING',
    gapStatusLabel: 'Arriving via Sea (6 Days)',
    gapColor: '#f59e0b',
    downstreamSystem: 'Paleoclimatology Lab'
  }
];

export const GEOSPATIAL_ROUTE_WAYPOINTS = [
  { name: 'Mormugao Port (India)', lat: 15.41, lng: 73.80, type: 'ORIGIN' },
  { name: 'Equatorial Crossing Waypoint', lat: 0.00, lng: 60.00, type: 'WAYPOINT' },
  { name: 'Cape Town Logistics Terminal', lat: -33.92, lng: 18.42, type: 'GATEWAY' },
  { name: 'Roaring Forties Waypoint', lat: -44.00, lng: 20.00, type: 'WAYPOINT' },
  { name: 'Furious Fifties Current Position (MV Antarctic Support)', lat: -52.418, lng: 24.812, type: 'LIVE_VESSEL' },
  { name: 'Antarctic Convergence Ice Boundary', lat: -60.00, lng: 20.00, type: 'ICE_EDGE' },
  { name: 'Maitri Station (Schirmacher Oasis)', lat: -70.766, lng: 11.732, type: 'DESTINATION' },
  { name: 'Prydz Bay Current Position (R/V Bharati)', lat: -64.215, lng: 72.481, type: 'LIVE_VESSEL' },
  { name: 'Bharati Station (Larsemann Hills)', lat: -69.407, lng: 76.187, type: 'DESTINATION' }
];

export const LOGISTICS_COMMAND_KPIS = {
  vesselsAtSea: 4,
  activeAirCargoFlights: 2,
  totalCargoTonnageKg: 233550,
  averageETAAccuracy: '96.2%',
  criticalCargoAlerts: 1,
  fuelInTransitLiters: 125000,
  emergencyResupplyFulfillmentRate: '100% (36h vs 48h SLA)'
};

export const RECENT_LOGISTICS_COMMAND_ACTIVITY = [
  { time: '09:44 UTC', event: 'Flight AF-IND-04 entered Antarctic Airspace (FL145, Ground Speed 172 kts)', type: 'AIR_TRACK', user: 'Polar Radar Center' },
  { time: '09:30 UTC', event: 'MV Antarctic Support passed Waypoint Delta-4 (ETA confirmed 18 Dec)', type: 'VESSEL_SYNC', user: 'AIS Satellite Stream' },
  { time: '09:12 UTC', event: 'Emergency cargo manifest EC-2026-018 verified & locked for customs', type: 'MANIFEST', user: 'Dr. Kashish Sharma' },
  { time: '08:45 UTC', event: 'R/V Bharati engaged icebreaker bow thrusters in Prydz Bay pack ice', type: 'NAVIGATION', user: 'Capt. Rajesh Nair' },
  { time: '08:00 UTC', event: 'Automated fuel reconciliation logged: 125,000L in transit across fleet', type: 'INVENTORY_SYNC', user: 'SCADA Telemetry Engine' }
];
