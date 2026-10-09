// Comprehensive Geospatial Tracking Dataset
// Covers India (Goa Mormugao) → Cape Town Gateway → Southern Ocean → Maitri & Bharati Stations

export const TRACKING_STATIONS = [
  {
    id: 'MAITRI',
    name: 'Maitri Station',
    country: 'India',
    region: 'Schirmacher Oasis, Queen Maud Land',
    latitude: -70.7658,
    longitude: 11.7358,
    elevation: '117 m',
    status: 'OPERATIONAL',
    activePersonnel: 25,
    incomingShipments: 3
  },
  {
    id: 'BHARATI',
    name: 'Bharati Station',
    country: 'India',
    region: 'Larsemann Hills, East Antarctica',
    latitude: -69.4078,
    longitude: 76.1872,
    elevation: '35 m',
    status: 'OPERATIONAL',
    activePersonnel: 22,
    incomingShipments: 3
  }
];

export const TRACKING_GATEWAYS = [
  {
    id: 'PORT_CAPE_TOWN',
    name: 'Cape Town Logistics Gateway',
    country: 'South Africa',
    code: 'CPT-GATE',
    latitude: -33.9249,
    longitude: 18.4241,
    type: 'PRIMARY_MARITIME_AIR_HUB',
    activeShips: 4,
    activeShipments: 6,
    departures: 2,
    arrivals: 1
  },
  {
    id: 'PORT_MORMUGAO',
    name: 'Mormugao Port (Goa)',
    country: 'India',
    code: 'IN-MRM',
    latitude: 15.4026,
    longitude: 73.8055,
    type: 'NATIONAL_POLAR_BASE_NCPOR',
    activeShips: 2,
    activeShipments: 4,
    departures: 1,
    arrivals: 0
  }
];

export const TRACKING_ROUTES = [
  {
    id: 'CORRIDOR_INDIA_CPT',
    name: 'India (Mormugao) → Cape Town Maritime Corridor',
    type: 'PLANNED',
    origin: 'Mormugao Port (Goa)',
    destination: 'Cape Town Gateway',
    distanceNm: 4620,
    coordinates: [
      [73.8055, 15.4026],
      [71.5000, 10.0000],
      [65.0000, 0.0000],
      [58.0000, -10.0000],
      [50.0000, -20.0000],
      [38.0000, -28.0000],
      [25.0000, -32.5000],
      [18.4241, -33.9249]
    ]
  },
  {
    id: 'CORRIDOR_CPT_MAITRI',
    name: 'Cape Town → Maitri Polar Sea Corridor',
    type: 'PLANNED',
    origin: 'Cape Town Gateway',
    destination: 'Maitri Station (Dronning Maud Land)',
    distanceNm: 2480,
    coordinates: [
      [18.4241, -33.9249],
      [17.0000, -42.0000],
      [15.0000, -50.0000],
      [13.5000, -58.0000],
      [12.2000, -65.0000],
      [11.7358, -70.7658]
    ]
  },
  {
    id: 'CORRIDOR_CPT_BHARATI',
    name: 'Cape Town → Bharati Maritime Corridor',
    type: 'PLANNED',
    origin: 'Cape Town Gateway',
    destination: 'Bharati Station (Prydz Bay)',
    distanceNm: 3120,
    coordinates: [
      [18.4241, -33.9249],
      [30.0000, -45.0000],
      [45.0000, -52.0000],
      [60.0000, -58.0000],
      [70.0000, -64.0000],
      [76.1872, -69.4078]
    ]
  },
  {
    id: 'CORRIDOR_ACTUAL_GOLOVNIN',
    name: 'MV Vasiliy Golovnin Recorded Track',
    type: 'ACTUAL',
    origin: 'Cape Town Gateway',
    destination: 'Maitri Station',
    coordinates: [
      [18.4241, -33.9249],
      [17.4000, -41.2000],
      [15.8000, -49.5000],
      [14.2000, -57.8000],
      [13.1000, -61.4000] // Current location
    ]
  },
  {
    id: 'CORRIDOR_AIR_DROMLAN',
    name: 'DROMLAN Polar Aviation Corridor (IL-76)',
    type: 'PLANNED',
    origin: 'Cape Town International Airport',
    destination: 'Novolazarevskaya Blue Ice Runway (Novo)',
    distanceNm: 2260,
    coordinates: [
      [18.6020, -33.9715],
      [16.5000, -44.0000],
      [14.0000, -54.0000],
      [12.5000, -63.0000],
      [11.8300, -70.8500]
    ]
  }
];

export const INITIAL_VESSELS = [
  {
    mmsi: '273456890',
    imo: '8603406',
    name: 'MV Vasiliy Golovnin',
    vesselType: 'ICEBREAKER',
    flag: 'Russia (Indian Expedition Charter)',
    latitude: -61.4200,
    longitude: 13.1000,
    speedKnots: 13.2,
    course: 182,
    heading: 180,
    navigationStatus: 'Underway Using Engine',
    destination: 'Maitri Station',
    departurePort: 'Cape Town Gateway',
    eta: '21 Sep 2026 • 11:00 UTC',
    lastUpdated: '12 sec ago',
    dataSource: 'SIMULATED_AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-LOG-2026-0182',
    cargoSummary: 'Heavy Polar Fuel & Glaciology Drilling Rig'
  },
  {
    mmsi: '273111220',
    imo: '8813908',
    name: 'MV Ivan Papanin',
    vesselType: 'CARGO',
    flag: 'India (Charter)',
    latitude: -18.2500,
    longitude: 51.6000,
    speedKnots: 14.5,
    course: 228,
    heading: 226,
    navigationStatus: 'Underway Using Engine',
    destination: 'Cape Town Gateway',
    departurePort: 'Mormugao Port (Goa)',
    eta: '25 Sep 2026 • 16:30 UTC',
    lastUpdated: '25 sec ago',
    dataSource: 'SIMULATED_AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-SPARE-2026-0112',
    cargoSummary: 'Modular Station Prefab Modules & Spares'
  },
  {
    mmsi: '419000180',
    imo: '9120034',
    name: 'INS Sagardhwani',
    vesselType: 'RESEARCH',
    flag: 'India (Indian Navy / DRDO)',
    latitude: -56.8000,
    longitude: 54.2000,
    speedKnots: 10.4,
    course: 165,
    heading: 162,
    navigationStatus: 'Engaged in Oceanographic Survey',
    destination: 'Bharati Station',
    departurePort: 'Cape Town Gateway',
    eta: '23 Sep 2026 • 08:00 UTC',
    lastUpdated: '8 sec ago',
    dataSource: 'SIMULATED_AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-SCI-2026-0094',
    cargoSummary: 'Acoustic Sounders & Marine Magnetometers'
  },
  {
    mmsi: '636018992',
    imo: '9345511',
    name: 'MT Polar Pride',
    vesselType: 'TANKER',
    flag: 'Liberia (Charter)',
    latitude: -48.1000,
    longitude: 16.4000,
    speedKnots: 11.8,
    course: 184,
    heading: 185,
    navigationStatus: 'Underway Using Engine',
    destination: 'Maitri Fuel Cache',
    departurePort: 'Cape Town Gateway',
    eta: '24 Sep 2026 • 14:00 UTC',
    lastUpdated: '40 sec ago',
    dataSource: 'SIMULATED_AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-FUEL-2026-0440',
    cargoSummary: '150,000 L Aviation Turbine Fuel ATK-50'
  },
  {
    mmsi: '257002340',
    imo: '9481234',
    name: 'MV Antarctic Explorer',
    vesselType: 'SUPPLY',
    flag: 'Norway / India Joint Ops',
    latitude: -63.5000,
    longitude: 68.8000,
    speedKnots: 12.6,
    course: 148,
    heading: 147,
    navigationStatus: 'Underway in Sea Ice Margin',
    destination: 'Bharati Station',
    departurePort: 'Cape Town Gateway',
    eta: '19 Sep 2026 • 18:00 UTC',
    lastUpdated: '18 sec ago',
    dataSource: 'SIMULATED_AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-FOOD-2026-0205',
    cargoSummary: 'Cold-Chain Organic Stores & Medical Supplies'
  }
];

export const INITIAL_AIRCRAFT = [
  {
    icao24: '15408C',
    callsign: 'DROMLAN-1',
    registration: 'RA-76952',
    model: 'Ilyushin IL-76TD-90VD',
    latitude: -52.4000,
    longitude: 14.8000,
    altitude: 31000,
    velocity: 440,
    heading: 186,
    verticalRate: 0,
    originCountry: 'South Africa / DROMLAN',
    origin: 'Cape Town International (CPT)',
    destination: 'Novo Blue Ice Runway (Maitri)',
    lastUpdated: '6 sec ago',
    dataSource: 'SIMULATED_ADSB',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-AIR-2026-0012',
    cargoSummary: 'Wintering Research Scientists & Sensitive Sensors'
  },
  {
    icao24: 'C02A8B',
    callsign: 'KENBORE-04',
    registration: 'C-GEAJ',
    model: 'Basler BT-67 (Turbo DC-3 Ski)',
    latitude: -70.1500,
    longitude: 42.6000,
    altitude: 12500,
    velocity: 195,
    heading: 88,
    verticalRate: 150,
    originCountry: 'Canada (Kenn Borek Air)',
    origin: 'Maitri Station Air Strip',
    destination: 'Bharati Station',
    lastUpdated: '4 sec ago',
    dataSource: 'SIMULATED_ADSB',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-MED-2026-0031',
    cargoSummary: 'Emergency Medical Serum & Glaciology Instruments'
  },
  {
    icao24: 'A1B2C3',
    callsign: 'POLAR-2',
    registration: 'VP-FAZ',
    model: 'DHC-6 Twin Otter Ski',
    latitude: -69.2000,
    longitude: 74.5000,
    altitude: 4800,
    velocity: 142,
    heading: 260,
    verticalRate: 0,
    originCountry: 'United Kingdom (BAS Logistics)',
    origin: 'Amery Ice Shelf Camp',
    destination: 'Bharati Station',
    lastUpdated: '14 sec ago',
    dataSource: 'SIMULATED_ADSB',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-RAD-2026-0088',
    cargoSummary: 'Aerial Ice Penetrating Radar Core Data'
  }
];

export const INITIAL_SHIPMENTS = [
  {
    shipmentId: 'ANT-LOG-2026-0182',
    title: 'Maitri Polar Diesel & Drilling Payload',
    category: 'Fuel',
    items: [
      { name: 'Arctic Diesel Fuel', quantity: 120000, unit: 'Liters' },
      { name: 'Drilling Rig Spares', quantity: 18, unit: 'Crates' }
    ],
    vesselMmsi: '273456890',
    transportType: 'VESSEL',
    carrierName: 'MV Vasiliy Golovnin',
    origin: 'Cape Town Gateway',
    destination: 'Maitri Station',
    status: 'IN_TRANSIT',
    priority: 'HIGH',
    eta: '21 Sep 2026 • 11:00 UTC',
    loadingDate: '10 Sep 2026',
    progressPercent: 68
  },
  {
    shipmentId: 'ANT-MED-2026-0031',
    title: 'Emergency Medical Serum & Defibrillators',
    category: 'Medical',
    items: [
      { name: 'Blood Plasma & Anti-Frostbite Serum', quantity: 50, unit: 'Vials' },
      { name: 'Automated External Defibrillators', quantity: 4, unit: 'Units' }
    ],
    vesselMmsi: null,
    aircraftIcao: 'C02A8B',
    transportType: 'AIRCRAFT',
    carrierName: 'Basler BT-67 (KENBORE-04)',
    origin: 'Maitri Station Air Strip',
    destination: 'Bharati Station',
    status: 'IN_FLIGHT',
    priority: 'CRITICAL',
    eta: 'Today • 15:45 UTC',
    loadingDate: '17 Sep 2026',
    progressPercent: 55
  },
  {
    shipmentId: 'ANT-SCI-2026-0094',
    title: 'Deep Oceanographic & Seismic Array',
    category: 'Scientific Equipment',
    items: [
      { name: 'Magnetotelluric Ocean Probes', quantity: 12, unit: 'Units' },
      { name: 'Hydrographic Transponders', quantity: 24, unit: 'Units' }
    ],
    vesselMmsi: '419000180',
    transportType: 'VESSEL',
    carrierName: 'INS Sagardhwani',
    origin: 'Cape Town Gateway',
    destination: 'Bharati Station',
    status: 'IN_TRANSIT',
    priority: 'MEDIUM',
    eta: '23 Sep 2026 • 08:00 UTC',
    loadingDate: '11 Sep 2026',
    progressPercent: 48
  },
  {
    shipmentId: 'ANT-FUEL-2026-0440',
    title: 'Strategic Aviation Turbine Fuel Resupply',
    category: 'Fuel',
    items: [
      { name: 'Aviation Kerosene ATK-50', quantity: 150000, unit: 'Liters' }
    ],
    vesselMmsi: '636018992',
    transportType: 'VESSEL',
    carrierName: 'MT Polar Pride',
    origin: 'Cape Town Gateway',
    destination: 'Maitri Station',
    status: 'IN_TRANSIT',
    priority: 'HIGH',
    eta: '24 Sep 2026 • 14:00 UTC',
    loadingDate: '12 Sep 2026',
    progressPercent: 38
  },
  {
    shipmentId: 'ANT-SPARE-2026-0112',
    title: 'Microgrid Generator Turbines & Prefab Hubs',
    category: 'Spare Parts',
    items: [
      { name: 'Caterpillar Generator Overhaul Kit', quantity: 6, unit: 'Pallets' },
      { name: 'Wind Turbine Bearings', quantity: 8, unit: 'Units' }
    ],
    vesselMmsi: '273111220',
    transportType: 'VESSEL',
    carrierName: 'MV Ivan Papanin',
    origin: 'Mormugao Port (Goa)',
    destination: 'Cape Town Gateway',
    status: 'IN_TRANSIT',
    priority: 'MEDIUM',
    eta: '25 Sep 2026 • 16:30 UTC',
    loadingDate: '08 Sep 2026',
    progressPercent: 42
  },
  {
    shipmentId: 'ANT-FOOD-2026-0205',
    title: 'Cold-Chain Organic Rations & Provisions',
    category: 'Food',
    items: [
      { name: 'Vacuum Sealed Winter Provisions', quantity: 12000, unit: 'Kg' },
      { name: 'Vitamin & Nutrient Supplements', quantity: 300, unit: 'Boxes' }
    ],
    vesselMmsi: '257002340',
    transportType: 'VESSEL',
    carrierName: 'MV Antarctic Explorer',
    origin: 'Cape Town Gateway',
    destination: 'Bharati Station',
    status: 'IN_TRANSIT',
    priority: 'MEDIUM',
    eta: '19 Sep 2026 • 18:00 UTC',
    loadingDate: '09 Sep 2026',
    progressPercent: 82
  }
];

export const TRACKING_ALERTS = [
  {
    id: 'TRK-ALT-01',
    severity: 'WARNING',
    type: 'ROUTE_DEVIATION',
    title: 'Route Deviation Detected (18.4 NM)',
    vesselMmsi: '273456890',
    vesselName: 'MV Vasiliy Golovnin',
    details: 'Vessel diverted 18.4 nautical miles West of planned corridor to bypass multi-year pack ice ridge.',
    timestamp: '04:22 UTC'
  },
  {
    id: 'TRK-ALT-02',
    severity: 'DANGER',
    type: 'EMERGENCY_LOGISTICS',
    title: 'Critical Emergency Flight Enroute (ANT-MED-2026-0031)',
    aircraftIcao: 'C02A8B',
    aircraftCallsign: 'KENBORE-04',
    details: 'Priority medical serum transport to Bharati Station. Polar air-traffic clear vector assigned.',
    timestamp: '05:10 UTC'
  },
  {
    id: 'TRK-ALT-03',
    severity: 'CAUTION',
    type: 'WEATHER_WARNING',
    title: 'Gale Warning in Roaring Forties Corridor',
    vesselMmsi: '636018992',
    vesselName: 'MT Polar Pride',
    details: 'Heavy swell (6.5 m) and 45 kn winds crossing 48°S corridor. Speed reduced by 2.4 knots.',
    timestamp: '03:45 UTC'
  }
];
