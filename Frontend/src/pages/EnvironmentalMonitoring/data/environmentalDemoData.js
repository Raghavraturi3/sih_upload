// Environmental Monitoring Operations Center — Comprehensive Dataset
// Specifically tailored for Antarctic Research Stations: Maitri & Bharati
// Clearly marked as Simulated/Demo Polar Telemetry where live sensor streams are modeled.

export const ENVIRONMENTAL_DATA_METADATA = {
  dataSource: 'Simulated Antarctic Sensor Network & Numerical Weather Models',
  samplingIntervalSeconds: 60,
  lastCalibrationDate: '2026-08-15',
  groundStations: ['Maitri Station (Schirmacher Oasis)', 'Bharati Station (Larsemann Hills)']
};

export const ENVIRONMENTAL_OVERVIEW_KPIS = {
  temperature: {
    value: -27.4,
    unit: '°C',
    status: 'Stable',
    statusType: 'stable',
    subtext: 'Apparent Windchill -44.5°C',
    trend: '↓ 0.8°C / 3h'
  },
  windSpeed: {
    value: 51.2,
    unit: 'km/h',
    knots: 27.6,
    direction: 'NW (315°)',
    status: 'Strong',
    statusType: 'warning',
    subtext: 'Peak Gusts 68.4 km/h',
    trend: '↑ Rising Front'
  },
  visibility: {
    value: 1.2,
    unit: 'km',
    status: 'Low (Attention)',
    statusType: 'warning',
    subtext: 'Blowing Snow Ground Drift',
    trend: 'Reduced 75%'
  },
  atmosphericPressure: {
    value: 982.4,
    unit: 'hPa',
    status: 'Falling',
    statusType: 'warning',
    subtext: 'Catabatic Depression Front',
    trend: '↓ 3.8 hPa / 6h'
  },
  snowConditions: {
    value: 'Heavy Snow',
    accumulationCm: 34.2,
    precipitationRateMmHr: 4.2,
    status: 'Warning',
    statusType: 'danger',
    subtext: 'Surface Drift: High',
    trend: '+6.5 cm Today'
  },
  weatherStatus: {
    condition: 'Severe Weather',
    severity: 'Attention Required',
    statusType: 'warning',
    subtext: 'Field Restrictions Active',
    activeStation: 'Bharati Station'
  }
};

export const STATIONS_ENVIRONMENT = {
  maitri: {
    id: 'maitri',
    name: 'Maitri Station',
    region: 'Schirmacher Oasis, Queen Maud Land',
    coordinates: '70°45′58″S 11°43′56″E',
    elevationM: 117,
    overallStatus: 'NORMAL',
    statusColor: '#10b981',
    temperature: -24.1,
    apparentTemp: -36.2,
    windSpeedKmH: 32.4,
    windSpeedKnots: 17.5,
    windDirection: 'ESE (115°)',
    visibilityKm: 8.5,
    snowStatus: 'Light Surface Drift',
    snowAccumulationCm: 8.0,
    pressureHpa: 994.2,
    humidityPercent: 62,
    solarRadiationWm2: 185,
    uvIndex: 1.4,
    weatherStatus: 'Stable Polar Margin',
    weatherCode: 'STABLE',
    activeAlertsCount: 1,
    sensorsTotal: 20,
    sensorsOnline: 19
  },
  bharati: {
    id: 'bharati',
    name: 'Bharati Station',
    region: 'Larsemann Hills, Princess Elizabeth Land',
    coordinates: '69°24′28″S 76°11′14″E',
    elevationM: 35,
    overallStatus: 'ATTENTION',
    statusColor: '#f59e0b',
    temperature: -27.4,
    apparentTemp: -44.5,
    windSpeedKmH: 51.2,
    windSpeedKnots: 27.6,
    windDirection: 'NW (315°)',
    visibilityKm: 1.2,
    snowStatus: 'Heavy Snowfall & Drift',
    snowAccumulationCm: 34.2,
    pressureHpa: 982.4,
    humidityPercent: 78,
    solarRadiationWm2: 92,
    uvIndex: 0.8,
    weatherStatus: 'Severe Catabatic Front',
    weatherCode: 'SEVERE',
    activeAlertsCount: 3,
    sensorsTotal: 22,
    sensorsOnline: 20
  }
};

export const LIVE_ATMOSPHERIC_METRICS = [
  { label: 'Ambient Temperature', value: '-27.4', unit: '°C', icon: '🌡️', station: 'Bharati', status: 'normal' },
  { label: 'Wind Velocity', value: '51.2', unit: 'km/h', icon: '💨', station: 'Bharati', status: 'warning' },
  { label: 'Wind Vector', value: '315° NW', unit: 'Azimuth', icon: '🧭', station: 'Bharati', status: 'warning' },
  { label: 'Optical Visibility', value: '1.2', unit: 'km', icon: '👁️', station: 'Bharati', status: 'danger' },
  { label: 'Barometric Pressure', value: '982.4', unit: 'hPa', icon: '📉', station: 'Bharati', status: 'warning' },
  { label: 'Relative Humidity', value: '78', unit: '%', icon: '💧', station: 'Bharati', status: 'normal' },
  { label: 'Dew Point', value: '-31.2', unit: '°C', icon: '❄️', station: 'Bharati', status: 'normal' },
  { label: 'Surface Snow Drift', value: '34.2', unit: 'cm', icon: '🌨️', station: 'Bharati', status: 'danger' },
  { label: 'Stratospheric Ozone', value: '185', unit: 'DU', icon: '🌌', station: 'Maitri', status: 'normal' },
  { label: 'Solar Insolation', value: '142', unit: 'W/m²', icon: '☀️', station: 'Maitri', status: 'normal' },
  { label: 'Ice Tremor Seismicity', value: '0.14', unit: 'Mw', icon: '📊', station: 'Maitri', status: 'normal' },
  { label: 'Air Density', value: '1.38', unit: 'kg/m³', icon: '🔬', station: 'Bharati', status: 'normal' }
];

export const TEMPERATURE_TRENDS = {
  '24h': {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    maitri: [-22.5, -23.0, -24.8, -25.2, -23.4, -22.8, -23.9, -24.1],
    bharati: [-24.0, -25.5, -27.2, -28.5, -26.0, -26.4, -27.1, -27.4],
    windchill: [-38.0, -40.2, -43.5, -45.8, -42.0, -42.8, -43.9, -44.5],
    min: -28.5,
    max: -22.5,
    avg: -25.3
  },
  '7d': {
    labels: ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'],
    maitri: [-21.2, -22.0, -20.5, -23.1, -25.0, -24.4, -24.1],
    bharati: [-23.5, -24.0, -22.8, -26.0, -28.2, -27.8, -27.4],
    windchill: [-35.0, -36.5, -34.0, -41.0, -46.2, -45.0, -44.5],
    min: -28.2,
    max: -20.5,
    avg: -24.7
  },
  '30d': {
    labels: ['W1-D1', 'W1-D5', 'W2-D2', 'W2-D6', 'W3-D3', 'W3-D7', 'W4-D4', 'Current'],
    maitri: [-19.0, -20.5, -21.4, -23.0, -22.2, -24.5, -23.8, -24.1],
    bharati: [-21.0, -22.8, -23.5, -25.2, -24.8, -28.0, -26.9, -27.4],
    windchill: [-32.0, -35.0, -37.2, -40.5, -39.0, -46.5, -43.8, -44.5],
    min: -28.0,
    max: -19.0,
    avg: -23.9
  }
};

export const WIND_TRENDS = {
  labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  maitriSpeed: [28, 30, 34, 36, 31, 29, 33, 32.4],
  bharatiSpeed: [38, 42, 48, 56, 52, 49, 53, 51.2],
  bharatiGusts: [48, 54, 62, 68.4, 64, 59, 66, 65.0]
};

export const ENVIRONMENTAL_RISK_SUMMARY = {
  overallRiskScore: 64,
  overallLevel: 'MEDIUM',
  overallColor: '#f59e0b',
  factors: [
    { category: 'Ambient Temperature', level: 'NORMAL', score: 28, color: '#10b981', detail: 'Within nominal winter baseline range (-24°C to -28°C)' },
    { category: 'Wind Velocity & Gusts', level: 'ELEVATED', score: 72, color: '#f59e0b', detail: 'Catabatic wind gusts at Bharati approaching structural limits' },
    { category: 'Snow & Surface Drift', level: 'ELEVATED', score: 68, color: '#f59e0b', detail: '34.2 cm snow drift accumulation around module B & generator vents' },
    { category: 'Optical Visibility', level: 'HIGH RISK', score: 88, color: '#ef4444', detail: 'Visibility reduced to 1.2 km; field operations prohibited' },
    { category: 'Atmospheric Stability', level: 'NORMAL', score: 35, color: '#10b981', detail: 'Pressure drop rate stabilizing at 982 hPa' }
  ]
};

export const ENVIRONMENTAL_ALERTS = [
  {
    id: 'ENV-ALT-101',
    severity: 'CRITICAL',
    title: 'Catabatic Wind Velocity Above Safe Operational Threshold',
    station: 'Bharati Station',
    timestamp: '2 minutes ago',
    timeExact: '09:44 UTC',
    category: 'WIND',
    description: 'Continuous wind velocity clocked at 51.2 km/h with gusts exceeding 68.4 km/h on Ridge Anemometer #02. Outer perimeter movement halted.',
    status: 'ACTIVE',
    recommendedAction: 'Suspend exterior vehicle transits and secure outdoor research sensor masts.'
  },
  {
    id: 'ENV-ALT-102',
    severity: 'WARNING',
    title: 'Optical Visibility Significantly Reduced by Blizzard Drift',
    station: 'Bharati Station',
    timestamp: '12 minutes ago',
    timeExact: '09:34 UTC',
    category: 'VISIBILITY',
    description: 'Forward laser transmissometer reports visibility drop below 1.5 km threshold (current: 1.2 km). Surface contrast degraded.',
    status: 'ACTIVE',
    recommendedAction: 'Engage station navigation beacon arrays and restrict personnel to pressurized corridors.'
  },
  {
    id: 'ENV-ALT-103',
    severity: 'WARNING',
    title: 'Sub-Zero Thermal Gradient Accelerating Module Heating Draw',
    station: 'Maitri Station',
    timestamp: '28 minutes ago',
    timeExact: '09:18 UTC',
    category: 'TEMPERATURE',
    description: 'Exterior temperature -24.1°C combined with 32 km/h winds has driven thermal delta to 44.1°C against module interior.',
    status: 'ACTIVE',
    recommendedAction: 'Verify secondary glycol circulation pumps in Living Quarters Module.'
  },
  {
    id: 'ENV-ALT-104',
    severity: 'RESOLVED',
    title: 'Severe Katabatic Gust Alert Restored to Nominal Margin',
    station: 'Maitri Station',
    timestamp: '1 hour ago',
    timeExact: '08:45 UTC',
    category: 'WIND',
    description: 'Schirmacher Oasis plateau winds dropped from 44 km/h to 32 km/h. Sensor self-test verified.',
    status: 'RESOLVED',
    recommendedAction: 'Clear field survey team for scheduled acoustic ice inspection.'
  }
];

export const ENVIRONMENTAL_SENSORS = [
  {
    id: 'ENV-MAI-T01',
    name: 'Primary Ambient Platinum RTD #01',
    type: 'Temperature',
    station: 'Maitri',
    location: 'Meteorology Mast Alpha',
    reading: -24.1,
    unit: '°C',
    status: 'Online',
    health: 98,
    signalStrength: 'Strong (-62 dBm)',
    lastUpdated: '2 min ago',
    assignedEmployee: 'Rahul Singh',
    calibratedUntil: '2027-01-10'
  },
  {
    id: 'ENV-BHA-W02',
    name: 'Ultrasonic 3-Axis Anemometer #02',
    type: 'Wind',
    station: 'Bharati',
    location: 'Ridge Weather Tower',
    reading: 51.2,
    unit: 'km/h',
    status: 'Online',
    health: 96,
    signalStrength: 'Strong (-58 dBm)',
    lastUpdated: '1 min ago',
    assignedEmployee: 'Dr. Ananya Sharma',
    calibratedUntil: '2026-11-20'
  },
  {
    id: 'ENV-BHA-V01',
    name: 'Forward Scatter Optical Transmissometer',
    type: 'Visibility',
    station: 'Bharati',
    location: 'Helipad Approach Sensor Array',
    reading: 1.2,
    unit: 'km',
    status: 'Warning',
    health: 74,
    signalStrength: 'Degraded (-82 dBm)',
    lastUpdated: '15 min ago',
    assignedEmployee: 'Dr. Ananya Sharma',
    calibratedUntil: '2026-09-30'
  },
  {
    id: 'ENV-MAI-P01',
    name: 'High-Precision Silicon Barometer',
    type: 'Atmospheric Pressure',
    station: 'Maitri',
    location: 'Science Building Sensor Bay',
    reading: 994.2,
    unit: 'hPa',
    status: 'Online',
    health: 99,
    signalStrength: 'Strong (-54 dBm)',
    lastUpdated: '3 min ago',
    assignedEmployee: 'Rahul Singh',
    calibratedUntil: '2027-03-15'
  },
  {
    id: 'ENV-BHA-S01',
    name: 'Ultrasonic Snow Depth Gauge & SWE Sensor',
    type: 'Snow Conditions',
    station: 'Bharati',
    location: 'Module B Windward Ramp',
    reading: 34.2,
    unit: 'cm',
    status: 'Online',
    health: 91,
    signalStrength: 'Strong (-65 dBm)',
    lastUpdated: '4 min ago',
    assignedEmployee: 'Dr. Ananya Sharma',
    calibratedUntil: '2026-12-05'
  },
  {
    id: 'ENV-BHA-P02',
    name: 'Differential Barometric Micro-Sensor',
    type: 'Atmospheric Pressure',
    station: 'Bharati',
    location: 'Command Dome Apex',
    reading: 982.4,
    unit: 'hPa',
    status: 'Online',
    health: 95,
    signalStrength: 'Strong (-60 dBm)',
    lastUpdated: '1 min ago',
    assignedEmployee: 'Dr. Ananya Sharma',
    calibratedUntil: '2027-02-18'
  },
  {
    id: 'ENV-MAI-W01',
    name: 'Heated Sonic Anemometer #01',
    type: 'Wind',
    station: 'Maitri',
    location: 'Priyadarshini Lake Weather Post',
    reading: 32.4,
    unit: 'km/h',
    status: 'Online',
    health: 97,
    signalStrength: 'Strong (-59 dBm)',
    lastUpdated: '2 min ago',
    assignedEmployee: 'Rahul Singh',
    calibratedUntil: '2026-10-25'
  },
  {
    id: 'ENV-MAI-O01',
    name: 'Dobson Spectrophotometer Ozone Sensor',
    type: 'Atmospheric Observations',
    station: 'Maitri',
    location: 'Atmospheric Physics Lab',
    reading: 185,
    unit: 'DU',
    status: 'Online',
    health: 99,
    signalStrength: 'Fiber Optic Direct',
    lastUpdated: '5 min ago',
    assignedEmployee: 'Dr. Priya Rawat',
    calibratedUntil: '2027-06-01'
  },
  {
    id: 'ENV-BHA-T02',
    name: 'Cryo Surface Temperature Array',
    type: 'Temperature',
    station: 'Bharati',
    location: 'Ice Core Drill Site Beta',
    reading: -29.8,
    unit: '°C',
    status: 'Online',
    health: 94,
    signalStrength: 'Mesh Wireless (-70 dBm)',
    lastUpdated: '7 min ago',
    assignedEmployee: 'Dr. Ananya Sharma',
    calibratedUntil: '2026-11-12'
  },
  {
    id: 'ENV-MAI-H01',
    name: 'Capacitive Relative Humidity Sensor',
    type: 'Atmospheric Conditions',
    station: 'Maitri',
    location: 'Meteorology Mast Alpha',
    reading: 62,
    unit: '%',
    status: 'Online',
    health: 96,
    signalStrength: 'Strong (-63 dBm)',
    lastUpdated: '4 min ago',
    assignedEmployee: 'Rahul Singh',
    calibratedUntil: '2026-12-20'
  },
  {
    id: 'ENV-BHA-L01',
    name: 'Pyranometer Solar Flux Sensor',
    type: 'Solar Radiation',
    station: 'Bharati',
    location: 'Solar PV Array Platform',
    reading: 92,
    unit: 'W/m²',
    status: 'Online',
    health: 93,
    signalStrength: 'Strong (-61 dBm)',
    lastUpdated: '6 min ago',
    assignedEmployee: 'Dr. Ananya Sharma',
    calibratedUntil: '2027-01-30'
  },
  {
    id: 'ENV-MAI-S02',
    name: 'Broadband Borehole Seismometer',
    type: 'Seismic Observations',
    station: 'Maitri',
    location: 'Bedrock Vault Sub-Zero',
    reading: 0.14,
    unit: 'Mw',
    status: 'Online',
    health: 98,
    signalStrength: 'Fiber Direct',
    lastUpdated: '1 min ago',
    assignedEmployee: 'Dr. Priya Rawat',
    calibratedUntil: '2027-04-10'
  }
];

export const SENSOR_STATUS_SUMMARY = {
  total: 42,
  online: 39,
  offline: 1,
  warning: 2,
  dataDelayed: 3,
  availabilityPercent: 98.4,
  dataReliabilityPercent: 99.1
};

export const ENVIRONMENTAL_DIGITAL_TWIN_FLOW = [
  {
    step: '01',
    stage: 'WEATHER & ATMOSPHERE',
    detail: 'Severe blizzard front at Bharati; ambient temp -27.4°C, 51.2 km/h wind gusts, blowing snow.',
    metric: '-27.4°C // 51 km/h'
  },
  {
    step: '02',
    stage: 'SENSOR TELEMETRY',
    detail: '42 deployed telemetry sensors stream live thermal, optical, sonic, and barometric telemetry at 60s frequency.',
    metric: '39 / 42 Online'
  },
  {
    step: '03',
    stage: 'DIGITAL TWIN COMPUTATION',
    detail: 'Calculates thermal loss coefficient across living pods, wind load force on radar dome, and snow accumulation rate.',
    metric: 'ΔT = 47.4°C Load'
  },
  {
    step: '04',
    stage: 'STATION OPERATIONAL IMPACT',
    detail: 'Microgrid heating demand surges by 18.2%; outdoor field transits restricted; air resupply flight placed on hold.',
    metric: '+18.2% Power Demand'
  },
  {
    step: '05',
    stage: 'DECISION SUPPORT ADVISORY',
    detail: 'Autonomous mission advisories generated for Base Commander Dr. Kashish Sharma and NCPOR operations command.',
    metric: '4 Action Items'
  }
];

export const CROSS_DEPARTMENT_IMPACTS = [
  {
    department: 'Infrastructure',
    icon: '🏗️',
    title: 'HVAC Thermal Delta & Snow Load',
    status: 'MONITORING',
    statusColor: '#38bdf8',
    summary: 'Exterior temperature of -27.4°C with 51 km/h wind increases heat dissipation across living pods. Snow clearing required on Module B intake vents within 4 hours.',
    metrics: [
      { label: 'Thermal Delta', value: '47.4°C' },
      { label: 'Vent Clearance', value: '65% Remaining' },
      { label: 'Structural Load', value: 'Nominal (12% Cap)' }
    ]
  },
  {
    department: 'Energy & Power Microgrid',
    icon: '⚡',
    title: 'Auxiliary Thermal Heating Surge',
    status: 'ELEVATED LOAD',
    statusColor: '#f59e0b',
    summary: 'Sub-zero windchill accelerates glycol heating loop cycling. Combined station load increased to 207.0 kW, increasing daily diesel burn rate by +18%.',
    metrics: [
      { label: 'Heating Load', value: '84.2 kW (+18%)' },
      { label: 'Fuel Burn Rate', value: '540 L / Day' },
      { label: 'Battery Reserve', value: '48.5h Autonomy' }
    ]
  },
  {
    department: 'Logistics & Cargo Transport',
    icon: '🚢',
    title: 'Polar Air Flight & Icebreaker Routing',
    status: 'WEATHER DELAY',
    statusColor: '#ef4444',
    summary: 'Optical visibility of 1.2 km at Bharati helipad approach triggers FAA Class-IV Polar hold on incoming twin-otter resupply flight AF-IND-04.',
    metrics: [
      { label: 'Flight AF-IND-04', value: 'Holding at Cape Town' },
      { label: 'R/V Bharati', value: 'ETA 8 Days (Sea Ice OK)' },
      { label: 'Supply Risk', value: 'Moderate' }
    ]
  },
  {
    department: 'Scientific Research',
    icon: '🔬',
    title: 'Cryo-Lab & Field Expedition Status',
    status: 'PARTIALLY RESTRICTED',
    statusColor: '#f59e0b',
    summary: 'Outdoor glacier core sampling postponed due to blowing snow. Atmospheric physics and cosmic ray detectors continue full data acquisition.',
    metrics: [
      { label: 'Glaciology Survey', value: 'Postponed 24h' },
      { label: 'Atmospheric Physics', value: '100% Operational' },
      { label: 'Ozone Monitoring', value: 'Active (185 DU)' }
    ]
  }
];

export const FIELD_OPERATIONS_STATUS = {
  overallCondition: 'RESTRICTED',
  conditionColor: '#f59e0b',
  badge: 'CAUTION // RESTRICTED CONDITIONS',
  restrictions: [
    { activity: 'Helipad Flight Landing / Takeoff', status: 'PROHIBITED', reason: 'Visibility < 2 km and wind gusts > 65 km/h' },
    { activity: 'PistenBully Snowcat Perimeter Transit', status: 'RESTRICTED', reason: 'Authorized only with dual-vehicle convoy & GPS beacon' },
    { activity: 'Exterior Structural Maintenance', status: 'URGENT ONLY', reason: 'Extreme windchill (-44.5°C) limits exposure to 15 min max' },
    { activity: 'Inter-Module Tunnel Movement', status: 'CLEAR', reason: 'Pressurized heated corridors fully nominal' }
  ]
};

export const RESEARCH_PROJECTS_ENVIRONMENT = [
  {
    id: 'SCI-01',
    name: 'Deep Ice Core Paleoclimatology Survey',
    lead: 'Dr. Vivek Menon',
    station: 'Bharati',
    status: 'DEGRADED / DELAYED',
    statusColor: '#f59e0b',
    weatherImpact: 'High snow drift and cryo-chiller power throttling due to heating surge.',
    resumptionETA: '18 Hours'
  },
  {
    id: 'SCI-02',
    name: 'Antarctic Ozone & Stratospheric Physics',
    lead: 'Dr. Priya Rawat',
    station: 'Maitri',
    status: 'ACTIVE & NOMINAL',
    statusColor: '#10b981',
    weatherImpact: 'Spectrophotometer tracking active at 185 DU; stable atmospheric window.',
    resumptionETA: 'Ongoing'
  },
  {
    id: 'SCI-03',
    name: 'Magnetospheric Pulsation & Geomagnetic Array',
    lead: 'Dr. Tenzing Norbu',
    station: 'Maitri',
    status: 'ACTIVE & NOMINAL',
    statusColor: '#10b981',
    weatherImpact: 'Sub-surface induction coils isolated from surface blizzard winds.',
    resumptionETA: 'Ongoing'
  },
  {
    id: 'SCI-04',
    name: 'Glacier Mass Balance & Cryosphere Dynamics',
    lead: 'Dr. Ananya Sharma',
    station: 'Bharati',
    status: 'DELAYED',
    statusColor: '#ef4444',
    weatherImpact: 'GPS stakes traverse suspended due to 1.2 km blowing snow visibility.',
    resumptionETA: '24 Hours'
  }
];

export const ENVIRONMENTAL_7DAY_FORECAST = [
  { day: 'Today', date: '09 Sep', tempHigh: -24, tempLow: -29, wind: '51 km/h NW', snowProb: '90%', vis: '1.2 km', icon: '🌨️', condition: 'Blizzard & Severe Drift', status: 'warning' },
  { day: 'Tomorrow', date: '10 Sep', tempHigh: -22, tempLow: -27, wind: '42 km/h W', snowProb: '60%', vis: '3.5 km', icon: '☁️', condition: 'Decreasing Snow Drift', status: 'warning' },
  { day: 'Thu', date: '11 Sep', tempHigh: -19, tempLow: -25, wind: '28 km/h SW', snowProb: '20%', vis: '8.0 km', icon: '🌤️', condition: 'Partly Cloudy / Polar Sun', status: 'stable' },
  { day: 'Fri', date: '12 Sep', tempHigh: -18, tempLow: -24, wind: '24 km/h S', snowProb: '10%', vis: '12.0 km', icon: '☀️', condition: 'Clear Atmosphere', status: 'stable' },
  { day: 'Sat', date: '13 Sep', tempHigh: -20, tempLow: -26, wind: '32 km/h SE', snowProb: '30%', vis: '7.5 km', icon: '⛅', condition: 'Light High Cirrus', status: 'stable' },
  { day: 'Sun', date: '14 Sep', tempHigh: -23, tempLow: -28, wind: '38 km/h E', snowProb: '50%', vis: '5.0 km', icon: '☁️', condition: 'Approaching Front', status: 'stable' },
  { day: 'Mon', date: '15 Sep', tempHigh: -25, tempLow: -31, wind: '46 km/h NE', snowProb: '75%', vis: '2.4 km', icon: '🌨️', condition: 'Catabatic Wind Warning', status: 'warning' }
];

export const ENVIRONMENTAL_TEAM = [
  {
    id: 'EMP-ENV-01',
    name: 'Dr. Ananya Sharma',
    role: 'Lead Environmental Scientist',
    station: 'Bharati Station',
    status: 'Online',
    statusColor: '#10b981',
    avatar: 'AS',
    assignedSensorsCount: 14,
    specialization: 'Polar Meteorology & Cryosphere',
    email: 'ananya.sharma@ncpor.gov.in'
  },
  {
    id: 'EMP-ENV-02',
    name: 'Rahul Singh',
    role: 'Sensor Monitoring Technician',
    station: 'Maitri Station',
    status: 'On Site',
    statusColor: '#38bdf8',
    avatar: 'RS',
    assignedSensorsCount: 12,
    specialization: 'Meteorological Telemetry & Mast Calibrations',
    email: 'rahul.singh@ncpor.gov.in'
  },
  {
    id: 'EMP-ENV-03',
    name: 'Dr. Priya Rawat',
    role: 'Atmospheric Physics & Environmental Manager',
    station: 'NCPOR Polar HQ / Remote',
    status: 'Online',
    statusColor: '#10b981',
    avatar: 'PR',
    assignedSensorsCount: 16,
    specialization: 'Stratospheric Dynamics & Satellite Cross-Validation',
    email: 'priya.rawat@ncpor.gov.in'
  }
];

export const RECENT_ENVIRONMENTAL_ACTIVITY = [
  { time: '09:44 UTC', title: 'Catabatic wind velocity threshold exceeded (51.2 km/h)', type: 'ALERT', user: 'Ridge Anemometer #02', station: 'Bharati' },
  { time: '09:34 UTC', title: 'Laser transmissometer visibility warning triggered (1.2 km)', type: 'ALERT', user: 'Optical Transmissometer', station: 'Bharati' },
  { time: '09:18 UTC', title: 'Thermal delta surge advisory dispatched to Energy team', type: 'DECISION_SUPPORT', user: 'Dr. Ananya Sharma', station: 'System' },
  { time: '08:50 UTC', title: 'Scheduled optical window cleaning & heated lens verification', type: 'MAINTENANCE', user: 'Rahul Singh', station: 'Maitri' },
  { time: '08:15 UTC', title: 'Atmospheric ozone telemetry synced with IMD & WMO Network', type: 'SYNC', user: 'Dr. Priya Rawat', station: 'HQ' },
  { time: '07:30 UTC', title: 'Snow depth acoustic gauge baseline auto-calibrated', type: 'CALIBRATION', user: 'Snow Depth Gauge S01', station: 'Bharati' }
];

export const ENVIRONMENTAL_INSIGHTS = [
  {
    type: 'HIGH_PRIORITY',
    title: 'Blowing Snow & Wind Gust Dynamic Coupling',
    content: 'Ridge wind acceleration to 51.2 km/h is actively lifting surface dry snow crystals, degrading horizontal visibility by 75% while surface drift reaches 34.2 cm.',
    source: 'Digital Twin Micro-climate Model',
    confidence: '96%'
  },
  {
    type: 'THERMAL_CORRELATION',
    title: 'Cross-Domain Heating Demand Surge',
    content: 'Ambient temperature of -27.4°C combined with 28-knot winds creates a convective heat loss multiplier of 1.48x, increasing heating fuel burn by 540 L/day.',
    source: 'Energy-Environment Coupled Simulation',
    confidence: '94%'
  },
  {
    type: 'LOGISTICS_FORECAST',
    title: 'Optimum Resupply Flight Window on Thursday',
    content: 'Numerical models indicate wind will drop below 25 km/h with visibility expanding to 12.0 km on Thursday 11 Sep. Recommend scheduling resupply flight AF-IND-04 then.',
    source: 'Polar NWP Atmospheric Window Analysis',
    confidence: '88%'
  }
];

export const ALERT_THRESHOLDS = [
  { parameter: 'Wind Velocity (Continuous)', warningThreshold: '> 40 km/h', criticalThreshold: '> 60 km/h', currentBharati: '51.2 km/h (Warning)', currentMaitri: '32.4 km/h (Nominal)' },
  { parameter: 'Horizontal Optical Visibility', warningThreshold: '< 3.0 km', criticalThreshold: '< 1.0 km', currentBharati: '1.2 km (Warning)', currentMaitri: '8.5 km (Nominal)' },
  { parameter: 'Ambient Temperature Minimum', warningThreshold: '< -35.0 °C', criticalThreshold: '< -45.0 °C', currentBharati: '-27.4 °C (Nominal)', currentMaitri: '-24.1 °C (Nominal)' },
  { parameter: 'Snow Accumulation Rate', warningThreshold: '> 3.0 cm/hr', criticalThreshold: '> 6.0 cm/hr', currentBharati: '4.2 cm/hr (Warning)', currentMaitri: '0.8 cm/hr (Nominal)' },
  { parameter: 'Telemetry Signal Dropout Delay', warningThreshold: '> 10 min', criticalThreshold: '> 30 min', currentBharati: '1 min (Nominal)', currentMaitri: '2 min (Nominal)' }
];
