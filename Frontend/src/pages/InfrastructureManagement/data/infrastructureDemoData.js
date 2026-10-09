// DEMO DATA — replace with API response when endpoint is available
// This file contains mock data for the Infrastructure Management page prototype.
// When real API endpoints become available, replace each export with actual API calls.

export const STATIONS = [
  { id: 'maitri', name: 'Maitri', location: 'Schirmacher Oasis', lat: '-70.7667', lon: '11.7333' },
  { id: 'bharati', name: 'Bharati', location: 'Larsemann Hills', lat: '-69.4083', lon: '76.1867' }
];

export const INFRASTRUCTURE_KPIS = {
  totalAssets: 128,
  operational: 112,
  needsAttention: 10,
  critical: 6,
  underMaintenance: 8
};

export const CATEGORY_HEALTH = [
  { id: 'buildings', name: 'Buildings', health: 96, icon: '🏗️' },
  { id: 'laboratories', name: 'Laboratories', health: 94, icon: '🔬' },
  { id: 'generators', name: 'Generators', health: 87, icon: '⚡' },
  { id: 'heating', name: 'Heating Systems', health: 91, icon: '🔥' },
  { id: 'communication', name: 'Communication', health: 98, icon: '📡' },
  { id: 'storage', name: 'Storage', health: 93, icon: '📦' },
  { id: 'vehicles', name: 'Vehicles', health: 86, icon: '🚜' },
  { id: 'scientific', name: 'Scientific Equipment', health: 90, icon: '🧪' }
];

export const ASSET_CATEGORIES = [
  { id: 'buildings', name: 'Buildings', total: 12, operational: 11, attention: 1, critical: 0, maintenance: 0 },
  { id: 'laboratories', name: 'Laboratories', total: 14, operational: 13, attention: 1, critical: 0, maintenance: 0 },
  { id: 'generators', name: 'Generators', total: 8, operational: 7, attention: 0, critical: 1, maintenance: 0 },
  { id: 'heating', name: 'Heating Systems', total: 16, operational: 15, attention: 1, critical: 0, maintenance: 0 },
  { id: 'communication', name: 'Communication', total: 9, operational: 9, attention: 0, critical: 0, maintenance: 0 },
  { id: 'storage', name: 'Storage', total: 18, operational: 17, attention: 1, critical: 0, maintenance: 0 },
  { id: 'vehicles', name: 'Vehicles', total: 21, operational: 18, attention: 0, critical: 0, maintenance: 3 },
  { id: 'scientific', name: 'Scientific Equipment', total: 44, operational: 41, attention: 3, critical: 0, maintenance: 0 }
];

export const ASSETS = [
  { id: 'GEN-MAI-001', name: 'Generator 01', category: 'Generators', station: 'Maitri', location: 'Power Facility A', status: 'Operational', health: 95, lastInspection: '05 Sep 2026', nextMaintenance: '15 Sep 2026', assignee: 'Arjun Sharma' },
  { id: 'GEN-MAI-002', name: 'Generator 02', category: 'Generators', station: 'Maitri', location: 'Power Facility A', status: 'Needs Attention', health: 72, lastInspection: '08 Sep 2026', nextMaintenance: '10 Sep 2026', assignee: 'Arjun Sharma' },
  { id: 'GEN-BHA-001', name: 'Generator 03', category: 'Generators', station: 'Bharati', location: 'Power Module B', status: 'Operational', health: 94, lastInspection: '04 Sep 2026', nextMaintenance: '14 Sep 2026', assignee: 'Rahul Singh' },
  { id: 'HTG-BHA-004', name: 'Heating System 04', category: 'Heating Systems', station: 'Bharati', location: 'Habitation Block C', status: 'Critical', health: 48, lastInspection: '07 Sep 2026', nextMaintenance: '08 Sep 2026', assignee: 'Rahul Singh' },
  { id: 'HTG-MAI-001', name: 'Heating System 01', category: 'Heating Systems', station: 'Maitri', location: 'Main Block', status: 'Operational', health: 96, lastInspection: '06 Sep 2026', nextMaintenance: '16 Sep 2026', assignee: 'Arjun Sharma' },
  { id: 'COM-MAI-001', name: 'Communication Unit 01', category: 'Communication', station: 'Maitri', location: 'Comm Tower', status: 'Operational', health: 98, lastInspection: '08 Sep 2026', nextMaintenance: '18 Sep 2026', assignee: 'Priya Rawat' },
  { id: 'COM-BHA-001', name: 'Communication Unit 02', category: 'Communication', station: 'Bharati', location: 'Comm Array', status: 'Operational', health: 97, lastInspection: '07 Sep 2026', nextMaintenance: '17 Sep 2026', assignee: 'Priya Rawat' },
  { id: 'LAB-MAI-001', name: 'Atmospheric Lab', category: 'Laboratories', station: 'Maitri', location: 'Science Wing A', status: 'Operational', health: 94, lastInspection: '05 Sep 2026', nextMaintenance: '20 Sep 2026', assignee: 'Arjun Sharma' },
  { id: 'LAB-BHA-002', name: 'Glaciology Lab', category: 'Laboratories', station: 'Bharati', location: 'Science Wing B', status: 'Needs Attention', health: 78, lastInspection: '03 Sep 2026', nextMaintenance: '12 Sep 2026', assignee: 'Rahul Singh' },
  { id: 'BLD-MAI-001', name: 'Main Living Quarters', category: 'Buildings', station: 'Maitri', location: 'Central Complex', status: 'Operational', health: 97, lastInspection: '06 Sep 2026', nextMaintenance: '20 Sep 2026', assignee: 'Arjun Sharma' },
  { id: 'BLD-BHA-001', name: 'Bharati Station Core', category: 'Buildings', station: 'Bharati', location: 'Main Module', status: 'Operational', health: 95, lastInspection: '04 Sep 2026', nextMaintenance: '18 Sep 2026', assignee: 'Rahul Singh' },
  { id: 'VEH-MAI-001', name: 'PistenBully 300 Polar', category: 'Vehicles', station: 'Maitri', location: 'Vehicle Bay', status: 'Under Maintenance', health: 65, lastInspection: '02 Sep 2026', nextMaintenance: '09 Sep 2026', assignee: 'Rahul Singh' },
  { id: 'VEH-MAI-002', name: 'Snowcat Utility', category: 'Vehicles', station: 'Maitri', location: 'Vehicle Bay', status: 'Operational', health: 88, lastInspection: '05 Sep 2026', nextMaintenance: '15 Sep 2026', assignee: 'Arjun Sharma' },
  { id: 'VEH-BHA-001', name: 'Tracked Cargo Hauler', category: 'Vehicles', station: 'Bharati', location: 'Logistics Bay', status: 'Under Maintenance', health: 58, lastInspection: '01 Sep 2026', nextMaintenance: '09 Sep 2026', assignee: 'Rahul Singh' },
  { id: 'STG-MAI-001', name: 'Fuel Storage Tank A', category: 'Storage', station: 'Maitri', location: 'Tank Farm', status: 'Operational', health: 93, lastInspection: '06 Sep 2026', nextMaintenance: '16 Sep 2026', assignee: 'Arjun Sharma' },
  { id: 'STG-BHA-001', name: 'Cold Storage Unit', category: 'Storage', station: 'Bharati', location: 'Supply Depot', status: 'Needs Attention', health: 74, lastInspection: '03 Sep 2026', nextMaintenance: '11 Sep 2026', assignee: 'Rahul Singh' },
  { id: 'SCI-MAI-001', name: 'Magnetometer Array', category: 'Scientific Equipment', station: 'Maitri', location: 'Observatory', status: 'Operational', health: 96, lastInspection: '07 Sep 2026', nextMaintenance: '21 Sep 2026', assignee: 'Priya Rawat' },
  { id: 'SCI-BHA-001', name: 'Seismograph Station', category: 'Scientific Equipment', station: 'Bharati', location: 'Geo Lab', status: 'Needs Attention', health: 81, lastInspection: '04 Sep 2026', nextMaintenance: '13 Sep 2026', assignee: 'Priya Rawat' },
  { id: 'SCI-MAI-002', name: 'Weather Radar System', category: 'Scientific Equipment', station: 'Maitri', location: 'Met Tower', status: 'Operational', health: 92, lastInspection: '06 Sep 2026', nextMaintenance: '19 Sep 2026', assignee: 'Arjun Sharma' },
  { id: 'VEH-BHA-002', name: 'Zodiac Inflatable Boat', category: 'Vehicles', station: 'Bharati', location: 'Marine Bay', status: 'Under Maintenance', health: 60, lastInspection: '01 Sep 2026', nextMaintenance: '10 Sep 2026', assignee: 'Rahul Singh' }
];

export const CRITICAL_ASSETS = ASSETS.filter(a => a.status === 'Critical' || a.status === 'Needs Attention' || a.health < 75);

export const TEAM_MEMBERS = [
  { id: 'EMP-001', name: 'Arjun Sharma', role: 'Infrastructure Engineer', station: 'Maitri', status: 'Online', assignedAssets: 12, avatar: 'AS' },
  { id: 'EMP-002', name: 'Rahul Singh', role: 'Maintenance Technician', station: 'Bharati', status: 'On Site', assignedAssets: 8, avatar: 'RS' },
  { id: 'EMP-003', name: 'Priya Rawat', role: 'Infrastructure Manager', station: 'HQ', status: 'Online', assignedAssets: 0, teamMembers: 14, avatar: 'PR' },
  { id: 'EMP-004', name: 'Vikram Mehta', role: 'Electrical Specialist', station: 'Maitri', status: 'Off Duty', assignedAssets: 6, avatar: 'VM' },
  { id: 'EMP-005', name: 'Sneha Iyer', role: 'Communications Engineer', station: 'Bharati', status: 'Online', assignedAssets: 5, avatar: 'SI' }
];

export const MAINTENANCE_OPS = {
  due: [
    { assetId: 'GEN-MAI-002', name: 'Generator 02', station: 'Maitri', dueText: 'Maintenance due in 2 days', priority: 'high' },
    { assetId: 'STG-BHA-001', name: 'Cold Storage Unit', station: 'Bharati', dueText: 'Maintenance due in 3 days', priority: 'medium' }
  ],
  overdue: [
    { assetId: 'HTG-BHA-004', name: 'Heating System 04', station: 'Bharati', dueText: 'Maintenance overdue by 1 day', priority: 'critical' }
  ],
  inProgress: [
    { assetId: 'VEH-MAI-001', name: 'PistenBully 300 Polar', station: 'Maitri', dueText: 'Scheduled maintenance in progress', priority: 'medium' },
    { assetId: 'VEH-BHA-001', name: 'Tracked Cargo Hauler', station: 'Bharati', dueText: 'Engine overhaul underway', priority: 'medium' }
  ],
  completed: [
    { assetId: 'LAB-MAI-001', name: 'Atmospheric Lab', station: 'Maitri', dueText: 'Maintenance completed yesterday', priority: 'done' },
    { assetId: 'COM-MAI-001', name: 'Communication Unit 01', station: 'Maitri', dueText: 'Antenna alignment completed', priority: 'done' }
  ]
};

export const ALERTS = [
  { id: 'ALR-001', type: 'CRITICAL', title: 'Generator 02 abnormal vibration detected', station: 'Maitri', timestamp: '2 minutes ago', assetId: 'GEN-MAI-002' },
  { id: 'ALR-002', type: 'WARNING', title: 'Heating System 04 maintenance overdue', station: 'Bharati', timestamp: '18 minutes ago', assetId: 'HTG-BHA-004' },
  { id: 'ALR-003', type: 'INFO', title: 'Cold Storage Unit temperature rising slowly', station: 'Bharati', timestamp: '45 minutes ago', assetId: 'STG-BHA-001' },
  { id: 'ALR-004', type: 'RESOLVED', title: 'Communication Unit 01 antenna realigned', station: 'Maitri', timestamp: '1 hour ago', assetId: 'COM-MAI-001' },
  { id: 'ALR-005', type: 'RESOLVED', title: 'Atmospheric Lab HVAC filter replaced', station: 'Maitri', timestamp: '3 hours ago', assetId: 'LAB-MAI-001' }
];

export const RECENT_ACTIVITY = [
  { time: '09:42', action: 'Generator inspection started', person: 'Arjun Sharma', type: 'inspection' },
  { time: '09:15', action: 'Heating system marked for maintenance', person: 'Rahul Singh', type: 'maintenance' },
  { time: '08:50', action: 'Laboratory equipment sensors updated', person: 'Priya Rawat', type: 'update' },
  { time: '08:20', action: 'Generator 03 maintenance completed', person: 'Maintenance Team', type: 'completed' },
  { time: '07:45', action: 'Vehicle bay pre-flight check done', person: 'Vikram Mehta', type: 'inspection' },
  { time: '07:10', action: 'Communication Unit 02 firmware update', person: 'Sneha Iyer', type: 'update' }
];

export const IMPACT_CHAINS = [
  {
    title: 'Generator Failure Cascade',
    steps: ['Generator Failure', 'Power availability reduced by 30%', 'HVAC & heating load-shedding triggered', 'Laboratory cryo-systems at risk', 'Research operations may be delayed']
  },
  {
    title: 'Communication System Outage',
    steps: ['Communication Failure', 'Satellite uplink disrupted', 'Remote monitoring data loss', 'Logistics coordination affected', 'Emergency response delayed']
  }
];

export const DIGITAL_TWIN_NODES = [
  { id: 'GEN-MAI-001', name: 'Generator 01', status: 'Operational', x: 120, y: 140, category: 'Generators' },
  { id: 'GEN-MAI-002', name: 'Generator 02', status: 'Needs Attention', x: 170, y: 140, category: 'Generators' },
  { id: 'HTG-BHA-004', name: 'Heating System 04', status: 'Critical', x: 480, y: 200, category: 'Heating Systems' },
  { id: 'COM-MAI-001', name: 'Comm Unit 01', status: 'Operational', x: 300, y: 80, category: 'Communication' },
  { id: 'BLD-MAI-001', name: 'Main Living Quarters', status: 'Operational', x: 200, y: 220, category: 'Buildings' },
  { id: 'LAB-MAI-001', name: 'Atmospheric Lab', status: 'Operational', x: 350, y: 160, category: 'Laboratories' },
  { id: 'VEH-MAI-001', name: 'PistenBully 300', status: 'Under Maintenance', x: 100, y: 280, category: 'Vehicles' },
  { id: 'STG-BHA-001', name: 'Cold Storage Unit', status: 'Needs Attention', x: 520, y: 120, category: 'Storage' },
  { id: 'SCI-MAI-001', name: 'Magnetometer Array', status: 'Operational', x: 420, y: 280, category: 'Scientific Equipment' },
  { id: 'BLD-BHA-001', name: 'Bharati Station Core', status: 'Operational', x: 560, y: 240, category: 'Buildings' }
];
