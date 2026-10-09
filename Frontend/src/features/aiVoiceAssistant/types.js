// AI Voice Assistant & Admin Copilot Types & Constants

export const LANGUAGES = {
  AUTO: 'auto',
  EN: 'en',
  HI: 'hi',
  HINGLISH: 'hinglish'
};

export const LANGUAGE_LABELS = {
  auto: 'Auto Detect',
  en: 'English (EN)',
  hi: 'हिन्दी (Hindi)',
  hinglish: 'Hinglish (Mix)'
};

export const ASSISTANT_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  EXECUTING: 'executing',
  CONFIRMATION: 'confirmation',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const STATE_LABELS = {
  en: {
    idle: 'IDLE',
    listening: 'LISTENING...',
    processing: 'ANALYZING...',
    executing: 'EXECUTING...',
    confirmation: 'CONFIRMATION REQUIRED',
    success: 'COMPLETED',
    error: 'NOTICE'
  },
  hi: {
    idle: 'तैयार',
    listening: 'सुन रहा हूँ...',
    processing: 'विश्लेषण जारी...',
    executing: 'निष्पादित हो रहा है...',
    confirmation: 'पुष्टि आवश्यक है',
    success: 'कार्य पूरा हुआ',
    error: 'सूचना'
  },
  hinglish: {
    idle: 'READY',
    listening: 'LISTENING...',
    processing: 'ANALYZING DATA...',
    executing: 'EXECUTING ACTION...',
    confirmation: 'CONFIRMATION REQUIRED',
    success: 'COMPLETED',
    error: 'NOTICE'
  }
};

export const COMMAND_RISK = {
  LOW: 'low',       // Auto-execute (read, filter, chart, navigation, summary)
  MEDIUM: 'medium', // Confirmation recommended (task creation, status change)
  HIGH: 'high'      // Mandatory explicit confirmation & audit log (emergency requests, overrides, critical shutdowns)
};

export const DATA_BADGES = {
  LIVE: { label: 'LIVE TELEMETRY', labelHi: 'लाइव टेलीमेट्री', color: '#10b981' },
  SIMULATED: { label: 'SIMULATED DATA', labelHi: 'सिम्युलेटेड डेटा', color: '#64748b' },
  CALCULATED: { label: 'CALCULATED KPI', labelHi: 'गणित मेट्रिक्स', color: '#38bdf8' },
  AI_INSIGHT: { label: 'AI INSIGHT / REASONING', labelHi: 'एआई अंतर्दृष्टि / विश्लेषण', color: '#a855f7' },
  USER_ACTION: { label: 'AUTHORIZED ACTION', labelHi: 'अधिकृत कार्रवाई', color: '#f59e0b' }
};

export const STATIONS = {
  MAITRI: {
    id: 'maitri',
    name: 'Maitri Station',
    code: 'IND-MAITRI-01',
    region: 'Schirmacher Oasis, Queen Maud Land',
    coordinates: '70°45′58″S 11°44′09″E',
    established: 1989,
    crewOnSite: 25,
    maxCapacity: 40,
    healthScore: 88,
    status: 'OPERATIONAL',
    powerSource: 'Hybrid Diesel Microgrid + Polar Solar Array',
    currentPowerKw: 88.4,
    powerCapacityKw: 120.0,
    fuelReserveLiters: 48500,
    fuelDaysRemaining: 112,
    ambientTemp: -24.6,
    windSpeedKnots: 28,
    windChill: -36.2,
    activeAlerts: 1,
    departments: {
      infrastructure: 'NOMINAL',
      energy: 'STABLE',
      logistics: 'NORMAL',
      environment: 'MODERATE_WINDS',
      research: 'ACTIVE',
      maintenance: 'ON_SCHEDULE'
    }
  },
  BHARATI: {
    id: 'bharati',
    name: 'Bharati Station',
    code: 'IND-BHARATI-02',
    region: 'Larsemann Hills, East Antarctica',
    coordinates: '69°24′28″S 76°11′14″E',
    established: 2012,
    crewOnSite: 23,
    maxCapacity: 47,
    healthScore: 74, // Lower due to generator issue
    status: 'ATTENTION_REQUIRED',
    powerSource: 'Triple Combined Heat & Power (CHP) Units',
    currentPowerKw: 118.6,
    powerCapacityKw: 140.0,
    fuelReserveLiters: 32100,
    fuelDaysRemaining: 68,
    ambientTemp: -29.8,
    windSpeedKnots: 46,
    windChill: -44.5,
    activeAlerts: 3,
    departments: {
      infrastructure: 'ATTENTION',
      energy: 'WARNING',
      logistics: 'CRITICAL',
      environment: 'HIGH_WINDS',
      research: 'DEGRADED',
      maintenance: 'OVERDUE'
    }
  }
};
