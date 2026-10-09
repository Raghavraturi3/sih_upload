// Expedition & Convoy Route Intelligence — Comprehensive Dataset
// Specifically designed for Antarctic Stations: Maitri & Bharati
// Clearly designated as Demonstration & Decision-Support data

export const EXPEDITIONS_METADATA = {
  dataSource: 'Simulated Antarctic GIS Corridor Model & Polar Fleet Tracking',
  satelliteSources: ['Sentinel-1 SAR C-Band', 'Sentinel-2 MSI Optical', 'Landsat-9 OLI-2'],
  coordinateReferenceSystem: 'WGS 84 / Antarctic Polar Stereographic (EPSG:3031)',
  lastUpdated: '12 Sept 2026, 14:32 UTC',
  dataFreshness: '2h 12m',
  status: 'DEMONSTRATION DATA'
};

export const STATIONS = [
  {
    id: 'MAITRI',
    name: 'Maitri Station',
    region: 'Schirmacher Oasis, Queen Maud Land',
    coordinates: { lat: -70.7658, lon: 11.7358 },
    mapCoords: { x: 260, y: 320 },
    elevation: '117 m',
    activeExpeditions: 4,
    convoyStatus: 'OPERATIONAL',
    temperature: -18,
    windSpeed: 31,
    visibility: 5.2
  },
  {
    id: 'BHARATI',
    name: 'Bharati Station',
    region: 'Larsemann Hills, East Antarctica',
    coordinates: { lat: -69.4078, lon: 76.1872 },
    mapCoords: { x: 680, y: 280 },
    elevation: '35 m',
    activeExpeditions: 4,
    convoyStatus: 'CAUTION',
    temperature: -22,
    windSpeed: 42,
    visibility: 3.8
  }
];

export const CONFIGURED_ROUTES = [
  {
    id: 'M-01',
    code: 'M-01',
    name: 'Maitri → Novolazarevskaya Airfield Corridor',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'CONVOY',
    typeName: 'Primary Convoy Route',
    status: 'NORMAL',
    distanceKm: 16.4,
    estimatedTravelHours: 1.5,
    waypointsCount: 4,
    lastObservationDate: '12 Sept 2026, 13:45 UTC',
    dataAge: '0h 47m',
    isStale: false,
    lineStyle: 'solid-cyan',
    pathCoordinates: [
      { x: 260, y: 320, name: 'Maitri Base' },
      { x: 280, y: 290, name: 'WP-01 Schirmacher Pass' },
      { x: 305, y: 260, name: 'WP-02 Ice Sheet Margin' },
      { x: 330, y: 230, name: 'Novo Blue Ice Runway' }
    ],
    conditions: {
      temperature: -16,
      windSpeed: 22,
      visibility: 9.5,
      precipitation: 'None',
      snowCondition: 'Firm / Compact',
      surfaceCondition: 'Stable Ice Track',
      windDirection: 'SSE 160°'
    },
    risk: {
      score: 18,
      status: 'NORMAL',
      recommendation: 'Corridor nominal. Standard convoy protocols in effect.'
    },
    satellite: {
      source: 'Optical',
      observationDate: '12 Sept 2026',
      cloudCoverage: 12,
      usableArea: 88,
      changeDetected: false,
      confidence: 94
    },
    logistics: {
      cargo: 'Flight Crew & Aviation Kerosene Transfer',
      fuel: 'Assigned (1,200 L)',
      medical: 'First-Aid Kit Alpha',
      emergency: 'Standard Snowcat Kit',
      vehicle: 'PistenBully 300 Polar Convoy'
    },
    weatherProfile: [
      { label: 'Maitri', temp: '-16°C', wind: '20 km/h', vis: '10 km' },
      { label: 'WP-01', temp: '-17°C', wind: '22 km/h', vis: '9.5 km' },
      { label: 'WP-02', temp: '-18°C', wind: '24 km/h', vis: '9.0 km' },
      { label: 'Novo Airfield', temp: '-19°C', wind: '26 km/h', vis: '8.5 km' }
    ],
    history: [
      { date: '12 Sept 2026', status: 'NORMAL', note: 'Clear sky, high surface grip' },
      { date: '10 Sept 2026', status: 'NORMAL', note: 'Runway sweep completed' },
      { date: '07 Sept 2026', status: 'CAUTION', note: 'Blowing snow, 35 km/h gusts' },
      { date: '02 Sept 2026', status: 'NORMAL', note: 'Routine cargo transit' }
    ],
    plannedVsActual: {
      deviationDetected: false,
      plannedPath: 'Maitri → WP-01 → WP-02 → Novo Runway',
      actualPath: 'Maitri → WP-01 → WP-02 → Novo Runway',
      notes: 'No deviation. Track aligned within ±15 m of configured corridor.'
    }
  },
  {
    id: 'M-03',
    code: 'M-03',
    name: 'Maitri → Field Site A (Wohlthat Mountains)',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'SCIENTIFIC',
    typeName: 'Scientific Expedition Route',
    status: 'CAUTION',
    distanceKm: 42.6,
    estimatedTravelHours: 5.3,
    waypointsCount: 7,
    lastObservationDate: '12 Sept 2026, 12:20 UTC',
    dataAge: '2h 12m',
    isStale: false,
    lineStyle: 'solid-orange',
    pathCoordinates: [
      { x: 260, y: 320, name: 'Maitri Base' },
      { x: 235, y: 350, name: 'WP-01 Moraine Point' },
      { x: 210, y: 380, name: 'WP-02 Crevasse Gate' },
      { x: 195, y: 410, name: 'WP-03 Nunatak South' },
      { x: 180, y: 445, name: 'WP-04 Glacier Ridge' },
      { x: 165, y: 475, name: 'WP-05 Sastrugi Plain' },
      { x: 150, y: 505, name: 'Field Site A (Drilling Camp)' }
    ],
    conditions: {
      temperature: -21,
      windSpeed: 38,
      visibility: 4.8,
      precipitation: 'Moderate Snow Drift',
      snowCondition: 'Fresh Powder over Hard Sastrugi',
      surfaceCondition: 'Recent Subsurface Rifting Detected',
      windDirection: 'WNW 290°'
    },
    risk: {
      score: 62,
      status: 'CAUTION',
      recommendation: 'Review current route conditions and consider alternate corridor M-04 prior to expedition dispatch.'
    },
    satellite: {
      source: 'SAR',
      observationDate: '12 Sept 2026, 12:20 UTC',
      cloudCoverage: 46,
      usableArea: 92,
      changeDetected: true,
      confidence: 84,
      changeDetails: 'Surface coherence drop near WP-02 indicating snowpack shift / crevasse bridge thinning.'
    },
    logistics: {
      cargo: 'Ice-Core Drilling Rig & Core Refrigeration Chamber',
      fuel: 'Assigned (2,800 L Polar Diesel)',
      medical: 'Class-3 Hypothermia Trauma Kit Assigned',
      emergency: 'Satellite Distress Beacon & Survival Igloo Kit',
      vehicle: '2x Kassbohrer Heavy Snowcat + Sled Train'
    },
    weatherProfile: [
      { label: 'Maitri', temp: '-18°C', wind: '28 km/h', vis: '8.0 km' },
      { label: 'WP-02', temp: '-20°C', wind: '34 km/h', vis: '5.2 km' },
      { label: 'WP-04', temp: '-22°C', wind: '38 km/h', vis: '4.8 km' },
      { label: 'Field Site A', temp: '-24°C', wind: '42 km/h', vis: '3.5 km' }
    ],
    history: [
      { date: '12 Sept 2026', status: 'CAUTION', note: 'Surface change detected via SAR coherence drop' },
      { date: '10 Sept 2026', status: 'NORMAL', note: 'Visual ground survey confirmed open path' },
      { date: '07 Sept 2026', status: 'NORMAL', note: 'Glaciology crew returned safely' },
      { date: '02 Sept 2026', status: 'REVIEW', note: 'Pre-season crevasse radar sweep' }
    ],
    plannedVsActual: {
      deviationDetected: true,
      plannedPath: 'Maitri → WP-01 → WP-02 → WP-03 → Field Site A',
      actualPath: 'Maitri → WP-01 → Alternate Corridor Bypass (+3.2 km)',
      notes: 'Convoy scout diverted 400 m East of WP-02 to bypass active ice fracture.'
    },
    alternateRouteId: 'M-04'
  },
  {
    id: 'M-04',
    code: 'M-04',
    name: 'Maitri → Field Site A (Western Nunatak Alternate)',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'SCIENTIFIC',
    typeName: 'Configured Alternate Route',
    status: 'NORMAL',
    distanceKm: 51.0,
    estimatedTravelHours: 6.2,
    waypointsCount: 6,
    lastObservationDate: '12 Sept 2026, 11:30 UTC',
    dataAge: '3h 02m',
    isStale: false,
    lineStyle: 'dashed-green',
    pathCoordinates: [
      { x: 260, y: 320, name: 'Maitri Base' },
      { x: 275, y: 365, name: 'WP-A1 East Ridge' },
      { x: 260, y: 410, name: 'WP-A2 Solid Bedrock Bench' },
      { x: 230, y: 450, name: 'WP-A3 Nunatak Valley' },
      { x: 190, y: 485, name: 'WP-A4 Southern Plateau' },
      { x: 150, y: 505, name: 'Field Site A' }
    ],
    conditions: {
      temperature: -20,
      windSpeed: 24,
      visibility: 8.2,
      precipitation: 'None',
      snowCondition: 'Hard Packed Windcrust',
      surfaceCondition: 'Firm Bedrock-Supported Ice',
      windDirection: 'NE 045°'
    },
    risk: {
      score: 41,
      status: 'NORMAL',
      recommendation: 'Stable alternate corridor. Recommended over M-03 if wind gusts exceed 35 km/h.'
    },
    satellite: {
      source: 'SAR',
      observationDate: '12 Sept 2026, 11:30 UTC',
      cloudCoverage: 15,
      usableArea: 95,
      changeDetected: false,
      confidence: 91
    },
    logistics: {
      cargo: 'Alternate Route Payload Transfer',
      fuel: 'Assigned (3,400 L)',
      medical: 'Standard Medical Pack',
      emergency: 'Mountain Rescue Kit',
      vehicle: '2x Snowcat Convoy'
    },
    weatherProfile: [
      { label: 'Maitri', temp: '-18°C', wind: '22 km/h', vis: '8.5 km' },
      { label: 'WP-A2', temp: '-19°C', wind: '24 km/h', vis: '8.2 km' },
      { label: 'WP-A4', temp: '-21°C', wind: '26 km/h', vis: '7.8 km' },
      { label: 'Field Site A', temp: '-22°C', wind: '28 km/h', vis: '7.5 km' }
    ],
    history: [
      { date: '12 Sept 2026', status: 'NORMAL', note: 'SAR scan shows no surface rifting' },
      { date: '08 Sept 2026', status: 'NORMAL', note: 'Survey markers validated' }
    ],
    plannedVsActual: {
      deviationDetected: false,
      plannedPath: 'Maitri → WP-A1 → WP-A2 → WP-A3 → Field Site A',
      actualPath: 'Nominal baseline track',
      notes: 'No historical deviation.'
    }
  },
  {
    id: 'M-02',
    code: 'M-02',
    name: 'Maitri → South Polar Fuel Cache Delta',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'LOGISTICS',
    typeName: 'Logistics Heavy Resupply',
    status: 'REVIEW_REQUIRED',
    distanceKm: 68.2,
    estimatedTravelHours: 8.5,
    waypointsCount: 8,
    lastObservationDate: '12 Sept 2026, 10:15 UTC',
    dataAge: '4h 17m',
    isStale: false,
    lineStyle: 'dashed-yellow',
    pathCoordinates: [
      { x: 260, y: 320, name: 'Maitri Base' },
      { x: 290, y: 350, name: 'WP-01 Schirmacher South' },
      { x: 320, y: 380, name: 'WP-02 Nunatak Cluster' },
      { x: 340, y: 420, name: 'WP-03 Blue Ice Basin' },
      { x: 360, y: 460, name: 'WP-04 Mid-Traverse Depot' },
      { x: 375, y: 500, name: 'WP-05 Sastrugi Wall' },
      { x: 390, y: 540, name: 'Fuel Cache Delta' }
    ],
    conditions: {
      temperature: -26,
      windSpeed: 44,
      visibility: 3.2,
      precipitation: 'Blowing Snow Drift',
      snowCondition: 'Deep Snowpack Accumulation (+22cm)',
      surfaceCondition: 'Obscured Sastrugi Ruts',
      windDirection: 'SSW 200°'
    },
    risk: {
      score: 71,
      status: 'REVIEW_REQUIRED',
      recommendation: 'Review route conditions with station logistics lead. Hold heavy tankers until wind drops below 35 km/h.'
    },
    satellite: {
      source: 'Optical',
      observationDate: '12 Sept 2026, 10:15 UTC',
      cloudCoverage: 62,
      usableArea: 38,
      changeDetected: true,
      confidence: 76,
      changeDetails: 'Cloud obstruction limiting optical evaluation; recent drift deposition obscuring markers.'
    },
    logistics: {
      cargo: '30,000 Litres Aviation Turbine Kerosene (ATK-50)',
      fuel: 'Convoy Consumption: 3,200 L',
      medical: 'Field Clinic Sled Active',
      emergency: 'Heated Mobile Survival Pod Attached',
      vehicle: '4x Challenger Tractor + 6x Sled Tankers'
    },
    weatherProfile: [
      { label: 'Maitri', temp: '-20°C', wind: '32 km/h', vis: '6.0 km' },
      { label: 'WP-02', temp: '-23°C', wind: '38 km/h', vis: '4.5 km' },
      { label: 'WP-04', temp: '-25°C', wind: '44 km/h', vis: '3.2 km' },
      { label: 'Cache Delta', temp: '-28°C', wind: '48 km/h', vis: '2.5 km' }
    ],
    history: [
      { date: '12 Sept 2026', status: 'REVIEW', note: 'Drift buildup across Mid-Traverse' },
      { date: '05 Sept 2026', status: 'NORMAL', note: 'Fuel drop successful' }
    ],
    plannedVsActual: {
      deviationDetected: true,
      plannedPath: 'Maitri → WP-01 → WP-02 → Mid-Traverse → Cache Delta',
      actualPath: 'Holding at WP-02 pending storm clearing',
      notes: 'Station lead instructed convoy to hold position at WP-02.'
    }
  },
  {
    id: 'M-05',
    code: 'M-05',
    name: 'Willy Field Glacier Emergency Traverse',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'EMERGENCY',
    typeName: 'Emergency Evacuation Route',
    status: 'HIGH_ATTENTION',
    distanceKm: 28.5,
    estimatedTravelHours: 3.2,
    waypointsCount: 5,
    lastObservationDate: '11 Sept 2026, 08:30 UTC',
    dataAge: '30h 02m',
    isStale: true,
    lineStyle: 'dash-dot-red',
    pathCoordinates: [
      { x: 260, y: 320, name: 'Maitri Base' },
      { x: 230, y: 300, name: 'WP-E1 Quick Exit Gate' },
      { x: 200, y: 280, name: 'WP-E2 Lake Priyadarshini West' },
      { x: 170, y: 260, name: 'WP-E3 High Ridge Shelter' },
      { x: 140, y: 240, name: 'Willy Field Emergency Strip' }
    ],
    conditions: {
      temperature: -24,
      windSpeed: 52,
      visibility: 1.8,
      precipitation: 'Severe Blizzard',
      snowCondition: 'Zero Visibility Whiteout Pockets',
      surfaceCondition: 'Severe Drift & Hidden Bridged Cracks',
      windDirection: 'S 180°'
    },
    risk: {
      score: 88,
      status: 'HIGH_ATTENTION',
      recommendation: 'HIGH RISK: Blizzard whiteout conditions along corridor. Emergency dispatch only with radar-guided lead vehicle.'
    },
    satellite: {
      source: 'SAR',
      observationDate: '11 Sept 2026, 08:30 UTC',
      cloudCoverage: 90,
      usableArea: 85,
      changeDetected: true,
      confidence: 72,
      changeDetails: 'Warning: Observation data age > 24 hours. SAR coherence shows significant snow deposition.'
    },
    logistics: {
      cargo: 'Emergency Evacuation Pod & Oxygen Generators',
      fuel: 'Pre-fueled Emergency Snowcats (full)',
      medical: 'Intensive Care Transport Unit Ready',
      emergency: 'Search & Rescue Transponders Active',
      vehicle: '2x Hägglunds BV-206 All-Terrain Tracked Carrier'
    },
    weatherProfile: [
      { label: 'Maitri', temp: '-22°C', wind: '45 km/h', vis: '2.5 km' },
      { label: 'WP-E2', temp: '-24°C', wind: '52 km/h', vis: '1.8 km' },
      { label: 'Willy Strip', temp: '-26°C', wind: '58 km/h', vis: '1.0 km' }
    ],
    history: [
      { date: '11 Sept 2026', status: 'HIGH_ATTENTION', note: 'Blizzard front swept Schirmacher' },
      { date: '04 Sept 2026', status: 'NORMAL', note: 'Quarterly emergency drill completed' }
    ],
    plannedVsActual: {
      deviationDetected: false,
      plannedPath: 'Direct emergency vector',
      actualPath: 'No active deployment',
      notes: 'Route currently armed on standby.'
    }
  },
  {
    id: 'B-01',
    code: 'B-01',
    name: 'Bharati → Prydz Bay Fast-Ice Route',
    stationId: 'BHARATI',
    stationName: 'Bharati',
    type: 'SEA_ICE',
    typeName: 'Sea-Ice Access Route',
    status: 'CAUTION',
    distanceKm: 14.8,
    estimatedTravelHours: 1.8,
    waypointsCount: 5,
    lastObservationDate: '12 Sept 2026, 13:10 UTC',
    dataAge: '1h 22m',
    isStale: false,
    lineStyle: 'dotted-cyan',
    pathCoordinates: [
      { x: 680, y: 280, name: 'Bharati Station' },
      { x: 700, y: 250, name: 'WP-B1 Landing Point Beach' },
      { x: 720, y: 220, name: 'WP-B2 Fast-Ice Transition' },
      { x: 740, y: 190, name: 'WP-B3 Tide-Crack Gate' },
      { x: 760, y: 160, name: 'Offshore Sea-Ice Anchorage' }
    ],
    conditions: {
      temperature: -23,
      windSpeed: 34,
      visibility: 6.0,
      precipitation: 'Light Ice Flurries',
      snowCondition: 'Thin Snow Layer on Fast-Ice (1.8m thick)',
      surfaceCondition: 'Tide Crack Active (Movement Detected)',
      windDirection: 'NE 030°'
    },
    risk: {
      score: 58,
      status: 'CAUTION',
      recommendation: 'Check tide table and sonic ice thickness probe at WP-B3 before traversing vehicles over 8 tonnes.'
    },
    satellite: {
      source: 'SAR',
      observationDate: '12 Sept 2026, 13:10 UTC',
      cloudCoverage: 28,
      usableArea: 94,
      changeDetected: true,
      confidence: 89,
      changeDetails: 'SAR interferometry shows 4 cm tidal hinge displacement along coastal fast-ice boundary.'
    },
    logistics: {
      cargo: 'Oceanographic Sampling Sensors & Hydrophone Rig',
      fuel: 'Assigned (800 L)',
      medical: 'Cold-Water Immersion Survival Suits Required',
      emergency: 'Amphibious Inflatable Rescue Sled Attached',
      vehicle: '2x Arctic Cat Snowmobiles + 1x Light Snowcat'
    },
    weatherProfile: [
      { label: 'Bharati', temp: '-22°C', wind: '30 km/h', vis: '7.0 km' },
      { label: 'WP-B2', temp: '-23°C', wind: '34 km/h', vis: '6.0 km' },
      { label: 'Anchorage', temp: '-24°C', wind: '38 km/h', vis: '5.5 km' }
    ],
    history: [
      { date: '12 Sept 2026', status: 'CAUTION', note: 'Tidal crack widening 12 cm during spring tide' },
      { date: '09 Sept 2026', status: 'NORMAL', note: 'Ice thickness core validated at 1.84m' },
      { date: '04 Sept 2026', status: 'NORMAL', note: 'Clear route to resupply ship' }
    ],
    plannedVsActual: {
      deviationDetected: false,
      plannedPath: 'Bharati → Landing Beach → Fast-Ice Gate → Anchorage',
      actualPath: 'Followed flagged stake line',
      notes: 'No deviation.'
    }
  },
  {
    id: 'B-02',
    code: 'B-02',
    name: 'Bharati → Resupply Ship Heavy Logistics Route',
    stationId: 'BHARATI',
    stationName: 'Bharati',
    type: 'LOGISTICS',
    typeName: 'Ship-to-Station Cargo Route',
    status: 'NORMAL',
    distanceKm: 11.2,
    estimatedTravelHours: 1.2,
    waypointsCount: 4,
    lastObservationDate: '12 Sept 2026, 14:00 UTC',
    dataAge: '0h 32m',
    isStale: false,
    lineStyle: 'dashed-blue',
    pathCoordinates: [
      { x: 680, y: 280, name: 'Bharati Station' },
      { x: 665, y: 240, name: 'WP-S1 Fuel Pipeline Junction' },
      { x: 650, y: 200, name: 'WP-S2 Ice Shelf Ramp' },
      { x: 635, y: 160, name: 'MV Vasiliy Golovnin Mooring' }
    ],
    conditions: {
      temperature: -21,
      windSpeed: 26,
      visibility: 9.0,
      precipitation: 'None',
      snowCondition: 'Firm / Groomed Sled Track',
      surfaceCondition: 'Stable Grounded Ice Ramp',
      windDirection: 'E 090°'
    },
    risk: {
      score: 22,
      status: 'NORMAL',
      recommendation: 'Corridor fully stable. Resupply offloading authorized.'
    },
    satellite: {
      source: 'Optical',
      observationDate: '12 Sept 2026, 14:00 UTC',
      cloudCoverage: 8,
      usableArea: 92,
      changeDetected: false,
      confidence: 96
    },
    logistics: {
      cargo: 'Dry Provisions Container #204 & Scientific Spares',
      fuel: 'Offloading 50,000 L Marine Gas Oil via heated hose',
      medical: 'Standard Escort Pack',
      emergency: 'Icebreaker Support Team on Standby',
      vehicle: 'Liebherr Rough-Terrain Crane & 3x Sled Tugs'
    },
    weatherProfile: [
      { label: 'Bharati', temp: '-21°C', wind: '24 km/h', vis: '9.5 km' },
      { label: 'WP-S2', temp: '-21°C', wind: '26 km/h', vis: '9.0 km' },
      { label: 'Mooring', temp: '-22°C', wind: '28 km/h', vis: '8.8 km' }
    ],
    history: [
      { date: '12 Sept 2026', status: 'NORMAL', note: 'Optimal sea-ice thickness for cargo sleds' },
      { date: '11 Sept 2026', status: 'NORMAL', note: 'Mooring lines inspected and secured' }
    ],
    plannedVsActual: {
      deviationDetected: false,
      plannedPath: 'Bharati → Pipeline → Ramp → Mooring',
      actualPath: 'Nominal track',
      notes: 'No deviation.'
    }
  },
  {
    id: 'B-03',
    code: 'B-03',
    name: 'Bharati → Amery Ice Shelf Research Traverse',
    stationId: 'BHARATI',
    stationName: 'Bharati',
    type: 'SCIENTIFIC',
    typeName: 'Scientific Expedition Route',
    status: 'NORMAL',
    distanceKm: 84.5,
    estimatedTravelHours: 9.8,
    waypointsCount: 9,
    lastObservationDate: '12 Sept 2026, 12:45 UTC',
    dataAge: '1h 47m',
    isStale: false,
    lineStyle: 'solid-purple',
    pathCoordinates: [
      { x: 680, y: 280, name: 'Bharati Station' },
      { x: 695, y: 320, name: 'WP-A1 Larsemann South' },
      { x: 710, y: 360, name: 'WP-A2 Polar Plateau Incline' },
      { x: 730, y: 400, name: 'WP-A3 Crevasse Bypass' },
      { x: 755, y: 440, name: 'WP-A4 Stornes Peninsula View' },
      { x: 780, y: 480, name: 'WP-A5 Midpoint Refueling Cache' },
      { x: 805, y: 520, name: 'WP-A6 Glacial Basin' },
      { x: 830, y: 560, name: 'Amery Ice Shelf Outpost' }
    ],
    conditions: {
      temperature: -28,
      windSpeed: 30,
      visibility: 7.5,
      precipitation: 'Clear Cold',
      snowCondition: 'Hard Windcrust',
      surfaceCondition: 'Scouted Crevasse-Free Corridor',
      windDirection: 'SE 140°'
    },
    risk: {
      score: 34,
      status: 'NORMAL',
      recommendation: 'Long-range scientific route nominal. Maintain hourly satellite communications check-ins.'
    },
    satellite: {
      source: 'SAR',
      observationDate: '12 Sept 2026, 12:45 UTC',
      cloudCoverage: 18,
      usableArea: 92,
      changeDetected: false,
      confidence: 88
    },
    logistics: {
      cargo: 'Seismic Depth Sounder & Magnetotelluric System',
      fuel: 'Assigned (4,800 L)',
      medical: 'Expedition Medical Doctor Attached',
      emergency: 'Twin-Otter Ski Aircraft on 2h Rescue Standby',
      vehicle: '3x Prinoth Everest Polar Snowcats + Living Caboose'
    },
    weatherProfile: [
      { label: 'Bharati', temp: '-22°C', wind: '26 km/h', vis: '8.5 km' },
      { label: 'WP-A2', temp: '-25°C', wind: '28 km/h', vis: '8.0 km' },
      { label: 'WP-A5', temp: '-28°C', wind: '30 km/h', vis: '7.5 km' },
      { label: 'Amery Outpost', temp: '-32°C', wind: '35 km/h', vis: '7.0 km' }
    ],
    history: [
      { date: '12 Sept 2026', status: 'NORMAL', note: 'Satellite SAR verified stable ice sheet' },
      { date: '06 Sept 2026', status: 'NORMAL', note: 'Crevasse radar survey passed' }
    ],
    plannedVsActual: {
      deviationDetected: false,
      plannedPath: 'Nominal charted corridor',
      actualPath: 'Traverse proceeding on scheduled track',
      notes: 'Convoy currently at WP-A4.'
    }
  }
];

export const ACTIVE_EXPEDITIONS = [
  {
    id: 'EXP-021',
    title: 'Wohlthat Ice-Core Climate Survey',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    routeId: 'M-03',
    routeCode: 'M-03',
    destination: 'Field Site A (Dronning Maud Ice Shelf)',
    type: 'SCIENTIFIC',
    team: 'Research Group Alpha (NCPOR Glaciology)',
    leader: 'Dr. Priya Sharma',
    status: 'PLANNED',
    departureDate: '18 Sept 2026, 06:00 UTC',
    estimatedDuration: '2 Days',
    riskScore: 62,
    riskStatus: 'CAUTION',
    crewCount: 6,
    vehicles: ['PistenBully 300 #04', 'Kassbohrer Sled #02'],
    updated: '2h ago',
    objectives: 'Extract 80-meter continuous firn cores for paleoclimate atmospheric gas analysis.',
    checklist: {
      fuel: true,
      food: true,
      scientificEquipment: true,
      medicalKit: true,
      emergencyEquipment: false,
      satelliteComms: true
    }
  },
  {
    id: 'EXP-022',
    title: 'Amery Deep Seismic Exploration Traverse',
    stationId: 'BHARATI',
    stationName: 'Bharati',
    routeId: 'B-03',
    routeCode: 'B-03',
    destination: 'Amery Ice Shelf Outpost',
    type: 'RESEARCH',
    team: 'National Polar Seismic Taskforce',
    leader: 'Dr. Rajesh Nair',
    status: 'ACTIVE',
    departureDate: '14 Sept 2026, 08:30 UTC',
    estimatedDuration: '5 Days',
    riskScore: 34,
    riskStatus: 'NORMAL',
    crewCount: 8,
    vehicles: ['Prinoth Everest #01', 'Prinoth Everest #02', 'Living Caboose #B'],
    updated: '1h ago',
    objectives: 'Conduct active vibroseis imaging of sub-ice bathymetry and oceanic circulation cavities.',
    checklist: {
      fuel: true,
      food: true,
      scientificEquipment: true,
      medicalKit: true,
      emergencyEquipment: true,
      satelliteComms: true
    }
  },
  {
    id: 'EXP-023',
    title: 'Polar Plateau Winter Fuel Resupply Convoy',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    routeId: 'M-02',
    routeCode: 'M-02',
    destination: 'South Polar Fuel Cache Delta',
    type: 'LOGISTICS',
    team: 'Maitri Heavy Convoy Brigade',
    leader: 'Cmdr. Vikram Singh (Retd.)',
    status: 'REVIEW',
    departureDate: '19 Sept 2026, 04:00 UTC',
    estimatedDuration: '1 Day',
    riskScore: 71,
    riskStatus: 'REVIEW_REQUIRED',
    crewCount: 5,
    vehicles: ['4x Caterpillar Challenger Tractors', '6x Heavy Sled Tankers'],
    updated: '3h ago',
    objectives: 'Deliver 30,000 L aviation turbine fuel to inland cache prior to seasonal closure.',
    checklist: {
      fuel: true,
      food: true,
      scientificEquipment: false,
      medicalKit: true,
      emergencyEquipment: false,
      satelliteComms: true
    }
  },
  {
    id: 'EXP-024',
    title: 'Prydz Bay Sea-Ice Core & Ecological Audit',
    stationId: 'BHARATI',
    stationName: 'Bharati',
    routeId: 'B-01',
    routeCode: 'B-01',
    destination: 'Prydz Bay Fast-Ice Zone 3',
    type: 'RESEARCH',
    team: 'Marine Ecosystem & Cryosphere Unit',
    leader: 'Dr. Ananya Roy',
    status: 'ACTIVE',
    departureDate: '15 Sept 2026, 09:00 UTC',
    estimatedDuration: '3 Days',
    riskScore: 58,
    riskStatus: 'CAUTION',
    crewCount: 4,
    vehicles: ['2x Arctic Cat Snowmobiles', 'Light Snowcat Utility'],
    updated: '45m ago',
    objectives: 'Sample microalgae blooms under fast-ice and calibrate acoustic sounders for whale migration.',
    checklist: {
      fuel: true,
      food: true,
      scientificEquipment: true,
      medicalKit: true,
      emergencyEquipment: true,
      satelliteComms: true
    }
  },
  {
    id: 'EXP-025',
    title: 'Novolazarevskaya Airstrip Runway Maintenance',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    routeId: 'M-01',
    routeCode: 'M-01',
    destination: 'Novo Blue Ice Runway',
    type: 'LOGISTICS',
    team: 'DROMLAN Joint Aviation Liaison',
    leader: 'Eng. Suresh Patil',
    status: 'COMPLETED',
    departureDate: '10 Sept 2026, 07:00 UTC',
    estimatedDuration: '1 Day',
    riskScore: 18,
    riskStatus: 'NORMAL',
    crewCount: 4,
    vehicles: ['PistenBully 300 Polar Convoy'],
    updated: '2d ago',
    objectives: 'Grade blue ice friction grooves and calibrate ILS radar reflectors for incoming IL-76 cargo.',
    checklist: {
      fuel: true,
      food: true,
      scientificEquipment: false,
      medicalKit: true,
      emergencyEquipment: true,
      satelliteComms: true
    }
  }
];

export const ROUTE_ALERTS = [
  {
    id: 'ALT-R-01',
    routeId: 'M-03',
    routeCode: 'M-03',
    severity: 'WARNING',
    type: 'REDUCED_VISIBILITY',
    title: 'Reduced Visibility Detected along M-03 Corridor',
    description: 'Visibility dropped from 8.4 km to 4.8 km (-43%) due to sudden ground-drift snow front near WP-02 Moraine Point.',
    observed: '12 Sept 2026, 12:20 UTC',
    dataAge: '2h 12m',
    actionRequired: 'Review conditions and consider alternate route M-04.'
  },
  {
    id: 'ALT-R-02',
    routeId: 'M-03',
    routeCode: 'M-03',
    severity: 'CAUTION',
    type: 'SATELLITE_CHANGE',
    title: 'SAR Surface Coherence Drop Detected',
    description: 'Sentinel-1 SAR interferogram detected 350m surface coherence loss near Crevasse Gate (WP-02). Subsurface bridging may have weakened.',
    observed: '12 Sept 2026, 12:20 UTC',
    dataAge: '2h 12m',
    actionRequired: 'Deploy ground-penetrating radar scout prior to heavy vehicles.'
  },
  {
    id: 'ALT-R-03',
    routeId: 'B-01',
    routeCode: 'B-01',
    severity: 'WARNING',
    type: 'SEA_ICE_TIDAL_HINGE',
    title: 'Active Tidal Hinge Fracture along Fast-Ice Corridor',
    description: 'Tidal crack WP-B3 opened 14 cm during spring tidal surge. Fast-ice vehicle transit limited to <8 tonnes.',
    observed: '12 Sept 2026, 13:10 UTC',
    dataAge: '1h 22m',
    actionRequired: 'Inspect bridging ramps before authorizing heavy cargo convoys.'
  },
  {
    id: 'ALT-R-04',
    routeId: 'M-05',
    routeCode: 'M-05',
    severity: 'DANGER',
    type: 'SEVERE_BLIZZARD',
    title: 'Severe Katabatic Gale Front across Willy Field Corridor',
    description: 'Sustained winds 52 km/h with gusts exceeding 75 km/h. Zero visibility whiteout pockets reported by remote AWS-09.',
    observed: '11 Sept 2026, 08:30 UTC',
    dataAge: '30h 02m (OUTDATED)',
    actionRequired: 'Corridor closed for non-emergency transits.'
  },
  {
    id: 'ALT-R-05',
    routeId: 'M-02',
    routeCode: 'M-02',
    severity: 'ATTENTION',
    type: 'SNOW_ACCUMULATION',
    title: 'Deep Snow Drift Accumulation at Mid-Traverse Depot',
    description: 'Fresh snowpack accumulation +22cm across Sastrugi Plain causing heavy drag on fuel sleds.',
    observed: '12 Sept 2026, 10:15 UTC',
    dataAge: '4h 17m',
    actionRequired: 'Hold heavy fuel tankers until wind clears loose drift.'
  }
];

export const SATELLITE_COMPARISON_DATA = {
  routeId: 'M-03',
  routeName: 'M-03 Corridor (Schirmacher to Wohlthat)',
  sensor: 'Sentinel-1 SAR C-Band & Sentinel-2 MSI',
  baselineDate: '05 Sept 2026',
  currentDate: '12 Sept 2026',
  changeType: 'Crevasse Bridge Thinning & Sastrugi Morphometry',
  changeConfidence: 84,
  affectedCorridorKm: 3.8,
  usableOpticalArea: 82,
  cloudCoverage: 18,
  observations: [
    {
      date: '05 Sept 2026',
      source: 'Sentinel-1 SAR (Coherence: 0.88)',
      status: 'Stable Baseline',
      features: 'Intact firn pack, minimal backscatter anomalies.'
    },
    {
      date: '12 Sept 2026',
      source: 'Sentinel-1 SAR (Coherence: 0.51)',
      status: 'Surface Shift Detected',
      features: 'Localized backscatter fringe shift indicating 8-12 cm compaction and crevasse lip rifting.'
    }
  ]
};
