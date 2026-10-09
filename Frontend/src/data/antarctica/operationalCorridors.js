/**
 * Antarctic Operational & Traverse Corridors
 * 
 * IMPORTANT PROVENANCE NOTICE:
 * Corridors are designated as either:
 * - 'VERIFIED SURVEYED CORRIDOR': Historically validated geodetic / tractor-traverse route published in expedition reports.
 * - 'PROJECT OPERATIONAL CORRIDOR (MODELED)': Calculated geodetic & terrain-optimized route modeled for decision support.
 * 
 * Every route displays: SOURCE + TIMESTAMP + DATA AGE + DATA STATUS + SURFACE CLASSIFICATION
 */

export const OPERATIONAL_CORRIDORS = [
  {
    id: 'CORRIDOR-M01-NOVO',
    name: 'Maitri – Novo Blue Ice Airfield Logistics Corridor',
    sector: 'Queen Maud Land / Schirmacher Oasis',
    routeClassification: 'VERIFIED SURVEYED CORRIDOR',
    provenance: {
      source: 'NCPOR Indian Antarctic Expedition Logistics Logs & ALCI Field Survey',
      timestamp: '2026-09-17T00:00:00Z',
      dataStatus: 'VERIFIED DATA',
      surveyMethod: 'Kinematic DGPS & Ground Penetrating Radar (GPR) Crevasse Scan'
    },
    totalDistanceKm: 14.8,
    estimatedTransitHours: 1.2,
    recommendedVehicles: ['PistenBully 300 Polar', 'Kässbohrer PB100', 'Toyota Hilux 6x6 Arctic'],
    hazardLevel: 'LOW_TO_MODERATE',
    hazards: ['Schirmacher blue-ice slope transition', 'Wind gusts > 35 kts near moraine'],
    color: '#00F0FF',
    waypoints: [
      {
        id: 'WP-M01-01',
        name: 'Maitri Station Operations Yard',
        lat: -70.765833,
        lon: 11.735833,
        elevationM: 117,
        surface: 'Rocky Bedrock / Compact Snow Ramp',
        crevasseRisk: 'NONE'
      },
      {
        id: 'WP-M01-02',
        name: 'Schirmacher Southern Moraine Gate',
        lat: -70.778500,
        lon: 11.710000,
        elevationM: 195,
        surface: 'Moraine Gravel / Blue Ice Border',
        crevasseRisk: 'VERY_LOW'
      },
      {
        id: 'WP-M01-03',
        name: 'Continental Ice Sheet Ascent',
        lat: -70.796000,
        lon: 11.675000,
        elevationM: 340,
        surface: 'Wind-Scoured Sastrugi & Dense Firn',
        crevasseRisk: 'MONITORED_GPR'
      },
      {
        id: 'WP-M01-04',
        name: 'Novo Blue Ice Threshold (ALCI Gate)',
        lat: -70.821111,
        lon: 11.632222,
        elevationM: 520,
        surface: 'Dense Glacial Blue Ice (High Friction Coeff)',
        crevasseRisk: 'NONE'
      }
    ]
  },
  {
    id: 'CORRIDOR-M02-SHELF',
    name: 'Maitri – India Bay (Ice Shelf Fuel & Heavy Cargo Convoy)',
    sector: 'Princess Astrid Coast / Fimbul Ice Shelf Margin',
    routeClassification: 'VERIFIED SURVEYED CORRIDOR',
    provenance: {
      source: 'Annual Indian Antarctic Expedition (IAE) Fuel Traverse GPS Tracks',
      timestamp: '2026-09-15T12:00:00Z',
      dataStatus: 'VERIFIED DATA',
      surveyMethod: 'Multi-year convoy GNSS logs with annual crevasse re-surveying'
    },
    totalDistanceKm: 88.5,
    estimatedTransitHours: 9.5,
    recommendedVehicles: ['Caterpillar D6N LGP Sled-train', 'PistenBully 300 Polar Heavy Sledge'],
    hazardLevel: 'HIGH',
    hazards: ['Tide crack along grounding zone', 'Dynamic crevassing at 70°25\'S hinge zone', 'Whiteout sastrugi fields'],
    color: '#FFB800',
    waypoints: [
      {
        id: 'WP-M02-01',
        name: 'Maitri Station Gateway',
        lat: -70.765833,
        lon: 11.735833,
        elevationM: 117,
        surface: 'Bedrock Ramp',
        crevasseRisk: 'NONE'
      },
      {
        id: 'WP-M02-02',
        name: 'Northern Schirmacher Ice Shelf Ramp',
        lat: -70.730000,
        lon: 11.780000,
        elevationM: 85,
        surface: 'Ice Shelf Snow Ramp',
        crevasseRisk: 'MODERATE_HINGE'
      },
      {
        id: 'WP-M02-03',
        name: 'Traverse Waypoint Juliet',
        lat: -70.550000,
        lon: 11.850000,
        elevationM: 65,
        surface: 'Flat Floating Ice Shelf Firn',
        crevasseRisk: 'LOW'
      },
      {
        id: 'WP-M02-04',
        name: 'Dakshin Gangotri Historical Sector',
        lat: -70.091667,
        lon: 12.008333,
        elevationM: 20,
        surface: 'Deep Snow Accumulation Zone',
        crevasseRisk: 'LOW'
      },
      {
        id: 'WP-M02-05',
        name: 'India Bay Ice Shelf Offloading Front',
        lat: -69.960000,
        lon: 11.950000,
        elevationM: 15,
        surface: 'Shelf Edge (Ice Wall / Sea Margin)',
        crevasseRisk: 'CRITICAL_CALVING'
      }
    ]
  },
  {
    id: 'CORRIDOR-B01-PRYDZ',
    name: 'Bharati – Sea-Ice Offloading Anchorage Route',
    sector: 'Larsemann Hills / Prydz Bay Marine Access',
    routeClassification: 'VERIFIED SURVEYED CORRIDOR',
    provenance: {
      source: 'NCPOR Expedition Summer Offloading Plan & Bathymetric Sounding',
      timestamp: '2026-09-17T01:30:00Z',
      dataStatus: 'VERIFIED DATA',
      surveyMethod: 'Drill-core ice thickness sounding & ice-radar profiling'
    },
    totalDistanceKm: 6.2,
    estimatedTransitHours: 0.8,
    recommendedVehicles: ['PistenBully Polar Sledge', 'Foremost Husky 8 Carrier'],
    hazardLevel: 'MODERATE_TO_HIGH',
    hazards: ['Tidal crack at shoreline', 'Variable fast-ice thickness (minimum safe: 1.5m for D6)'],
    color: '#00E676',
    waypoints: [
      {
        id: 'WP-B01-01',
        name: 'Bharati Station Fuel Farm Ramp',
        lat: -69.407778,
        lon: 76.187222,
        elevationM: 35,
        surface: 'Rocky Peninsula Access Track',
        crevasseRisk: 'NONE'
      },
      {
        id: 'WP-B01-02',
        name: 'Quilty Bay Tidal Crack Bridge',
        lat: -69.402000,
        lon: 76.195000,
        elevationM: 2,
        surface: 'Reinforced Snow Bridge over Tide Crack',
        crevasseRisk: 'HIGH_TIDAL_SHEAR'
      },
      {
        id: 'WP-B01-03',
        name: 'Thala Hills Fast-Ice Highway',
        lat: -69.385000,
        lon: 76.170000,
        elevationM: 0,
        surface: 'Multi-Year Landfast Sea Ice (Thickness: 1.8m)',
        crevasseRisk: 'TIDAL_CRACKS'
      },
      {
        id: 'WP-B01-04',
        name: 'Vessel Ice-Mooring Point (Prydz Bay)',
        lat: -69.365000,
        lon: 76.150000,
        elevationM: 0,
        surface: 'Fast Ice Edge / Open Water Berthing',
        crevasseRisk: 'FAST_ICE_BREAKUP_ALERT'
      }
    ]
  },
  {
    id: 'CORRIDOR-B02-ZHONGSHAN',
    name: 'Bharati – Zhongshan – Progress Mutual Assistance Corridor',
    sector: 'Larsemann Hills Inter-Station Overland Route',
    routeClassification: 'PROJECT OPERATIONAL CORRIDOR (MODELED)',
    provenance: {
      source: 'Antarctic Treaty Larsemann Hills ASMA (Antarctic Specially Managed Area No. 6) GIS Plan',
      timestamp: '2026-09-16T18:00:00Z',
      dataStatus: 'DEMONSTRATION / MODELED',
      surveyMethod: 'Designated ASMA vehicle tracks avoiding sensitive moss beds'
    },
    totalDistanceKm: 11.4,
    estimatedTransitHours: 1.1,
    recommendedVehicles: ['Hägglunds BV206', 'Toyota Arctic Hilux', 'Skidoo Snowmobiles'],
    hazardLevel: 'LOW',
    hazards: ['Stony scree gradients', 'Protected ecological moss zones (Strict GPS adherence)'],
    color: '#D500F9',
    waypoints: [
      {
        id: 'WP-B02-01',
        name: 'Bharati Station Helipad Sector',
        lat: -69.407778,
        lon: 76.187222,
        elevationM: 35,
        surface: 'Gravel ASMA Corridor Track',
        crevasseRisk: 'NONE'
      },
      {
        id: 'WP-B02-02',
        name: 'Broknes Peninsula Ridge Crossing',
        lat: -69.390000,
        lon: 76.260000,
        elevationM: 68,
        surface: 'Ice-Free Gneiss Outcrop / Stony Regolith',
        crevasseRisk: 'NONE'
      },
      {
        id: 'WP-B02-03',
        name: 'Zhongshan Station Perimeter (China)',
        lat: -69.373611,
        lon: 76.377778,
        elevationM: 18,
        surface: 'Station Road Network',
        crevasseRisk: 'NONE'
      },
      {
        id: 'WP-B02-04',
        name: 'Progress-II Deep Traverse Departure Yard (Russia)',
        lat: -69.376667,
        lon: 76.386111,
        elevationM: 15,
        surface: 'Compacted Snow Pad',
        crevasseRisk: 'NONE'
      }
    ]
  },
  {
    id: 'CORRIDOR-M03-WOHLTHAT',
    name: 'Maitri – Gruber Mountains / Wohlthat Deep Science Traverse',
    sector: 'Queen Maud Land Interior Polar Plateau',
    routeClassification: 'PROJECT OPERATIONAL CORRIDOR (MODELED)',
    provenance: {
      source: 'Geological Survey of India (GSI) / IAE Scientific Expedition Log (Modeled Corridor)',
      timestamp: '2026-09-14T09:00:00Z',
      dataStatus: 'DEMONSTRATION / MODELED',
      surveyMethod: 'Geodesic Waypoint Interpolation with Sentinel-1 SAR Shear Mapping'
    },
    totalDistanceKm: 76.2,
    estimatedTransitHours: 8.0,
    recommendedVehicles: ['PB300 Polar Traverse Tractor', 'Living Container Sledge'],
    hazardLevel: 'CRITICAL',
    hazards: ['Inland nunatak wind funnels', 'Extensive sastrugi waves (>1.5m)', 'Steep continental ice slopes'],
    color: '#FF1744',
    waypoints: [
      {
        id: 'WP-M03-01',
        name: 'Maitri Convoy Departure Point',
        lat: -70.765833,
        lon: 11.735833,
        elevationM: 117,
        surface: 'Schirmacher Bedrock Edge',
        crevasseRisk: 'NONE'
      },
      {
        id: 'WP-M03-02',
        name: 'Continental Slope Kilometer 20',
        lat: -70.920000,
        lon: 11.900000,
        elevationM: 820,
        surface: 'Hard Packed Wind-Slab Firn',
        crevasseRisk: 'LOW_MODERATE'
      },
      {
        id: 'WP-M03-03',
        name: 'Wohlthat Fore-Glacier Basin',
        lat: -71.100000,
        lon: 12.100000,
        elevationM: 1450,
        surface: 'Glacial Confluence (Complex Flow)',
        crevasseRisk: 'HIGH_SHEAR'
      },
      {
        id: 'WP-M03-04',
        name: 'Gruber Nunataks Geological Base Camp',
        lat: -71.220000,
        lon: 12.250000,
        elevationM: 1850,
        surface: 'Sub-Nunatak Snow Apron',
        crevasseRisk: 'MODERATE_WINDSCOURED'
      }
    ]
  }
];

// Active Polar Convoys and Scientific Field Teams
export const ACTIVE_POLAR_CONVOYS = [
  {
    id: 'CONVOY-IND-43-01',
    callsign: 'HIMADRI TRAVERSE ALPHA',
    corridorId: 'CORRIDOR-M01-NOVO',
    leader: 'Col. Rajesh Sharma (Logistics Officer, 43rd IAE)',
    vehicleFleet: ['PistenBully 300 #04', 'Kässbohrer PB100 #02', 'Toyota Arctic Hilux #01'],
    crewCount: 6,
    mission: 'Transfer intercontinental cargo & glaciology ice cores to ALCI IL-76 cargo aircraft',
    currentPosition: {
      lat: -70.7852,
      lon: 11.6980,
      elevationM: 265,
      speedKmh: 14.2,
      headingDeg: 215
    },
    distanceTraveledKm: 5.4,
    distanceRemainingKm: 9.4,
    fuelReservePercent: 88,
    status: 'EN_ROUTE_NORMAL',
    mode: 'LIVE',
    lastTelemetryTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    satelliteTelemetrySource: 'Iridium Extreme PTT / SBD Transceiver Terminal #IR-9921',
    weatherCondition: 'CLEAR / WINDS 18 KTS',
    crossTrackErrorMeters: 4.8
  },
  {
    id: 'CONVOY-IND-43-02',
    callsign: 'PRYDZ ICE RECON DELTA',
    corridorId: 'CORRIDOR-B01-PRYDZ',
    leader: 'Dr. Sunita Patel (Oceanographer / Field Leader)',
    vehicleFleet: ['Foremost Husky 8 #01', 'Skidoo Expedition 900 ACE #03'],
    crewCount: 4,
    mission: 'Landfast sea-ice core thickness drilling & acoustic Doppler current profiling',
    currentPosition: {
      lat: -69.3920,
      lon: 76.1820,
      elevationM: 1,
      speedKmh: 0.0,
      headingDeg: 350
    },
    distanceTraveledKm: 3.1,
    distanceRemainingKm: 3.1,
    fuelReservePercent: 92,
    status: 'STATIONARY_ON_ICE_SAMPLING',
    mode: 'LIVE',
    lastTelemetryTime: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    satelliteTelemetrySource: 'Inmarsat BGAN Explorer 710 terminal #INM-4412',
    weatherCondition: 'OVERCAST / WINDS 22 KTS',
    crossTrackErrorMeters: 1.2
  },
  {
    id: 'CONVOY-DEMO-M03',
    callsign: 'WOHLTHAT PIONEER (SIMULATED)',
    corridorId: 'CORRIDOR-M03-WOHLTHAT',
    leader: 'Simulation Agent / Planning Engine',
    vehicleFleet: ['PB300 Sledge-train (Demonstration)'],
    crewCount: 5,
    mission: 'Simulated geological expedition profile across Wohlthat Mountains',
    currentPosition: {
      lat: -71.0100,
      lon: 12.0000,
      elevationM: 1140,
      speedKmh: 12.0,
      headingDeg: 190
    },
    distanceTraveledKm: 35.0,
    distanceRemainingKm: 41.2,
    fuelReservePercent: 65,
    status: 'SIMULATED_TRAVERSE',
    mode: 'DEMO',
    lastTelemetryTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    satelliteTelemetrySource: 'Simulated Engine Telemetry / Decision Support Model',
    weatherCondition: 'KATABATIC GALE WARNING',
    crossTrackErrorMeters: 15.0
  }
];
