// Polar Route Risk Assessment Engine — Decision-Support Algorithm
// Modular, pluggable implementation for Antarctic corridor evaluations

/**
 * @typedef {'NORMAL' | 'CAUTION' | 'REVIEW_REQUIRED' | 'HIGH_ATTENTION' | 'NO_RECENT_DATA'} RouteStatus
 * 
 * @typedef {Object} RiskFactor
 * @property {string} name - The factor name (e.g. 'Reduced Visibility')
 * @property {string} severity - 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
 * @property {string} impact - Human-readable operational description
 * @property {number} weight - Relative contribution to risk score
 * 
 * @typedef {Object} RouteRiskInput
 * @property {number} visibility - Visibility in km (e.g. 5.2)
 * @property {number} windSpeed - Wind speed in km/h (e.g. 38)
 * @property {number} precipitation - Precipitation scale (0: None, 1: Light, 2: Moderate, 3: Heavy blizzard)
 * @property {number} snowCondition - Surface snowpack drift (0: Hard/Compact, 1: Thin drift, 2: Moderate drift, 3: Deep whiteout accumulation)
 * @property {number} surfaceChange - Satellite change index (0: No change, 1: Minor change, 2: Detected shift, 3: Critical rifting)
 * @property {number} [seaIceCondition] - Sea-ice risk index (0: Thick landfast ice, 1: Minor tidal cracks, 2: Active hinge movement, 3: Breakup imminent)
 * @property {number} dataFreshness - Data age in minutes (e.g. 132 for 2h 12m)
 * 
 * @typedef {Object} RouteRiskResult
 * @property {number} score - Overall risk score between 0 and 100
 * @property {RouteStatus} status - Operational status categorization
 * @property {RiskFactor[]} factors - List of contributing risk factors
 * @property {string} recommendation - Clear operational guidance for mission controller
 * @property {string} disclaimer - Decision-support advisory notice
 */

/**
 * Calculates decision-support risk assessment for an Antarctic corridor.
 * @param {RouteRiskInput} input
 * @returns {RouteRiskResult}
 */
export function calculateRouteRisk(input) {
  const factors = [];
  let score = 0;

  // 1. Data Freshness Penalty (If data > 24 hours / 1440 min)
  if (input.dataFreshness > 1440) {
    factors.push({
      name: 'Stale Observation Data',
      severity: 'CRITICAL',
      impact: `Sensor/satellite observation is ${Math.round(input.dataFreshness / 60)}h old. Route conditions may have altered.`,
      weight: 35
    });
    score += 35;
  } else if (input.dataFreshness > 360) {
    factors.push({
      name: 'Aging Observation Data',
      severity: 'MEDIUM',
      impact: `Observation data is over 6 hours old (${Math.round(input.dataFreshness / 60)}h).`,
      weight: 15
    });
    score += 15;
  }

  // 2. Visibility Evaluation (< 2 km is severe in polar terrain)
  if (input.visibility <= 2.0) {
    factors.push({
      name: 'Severe Reduced Visibility',
      severity: 'HIGH',
      impact: `Visibility ${input.visibility} km creates high whiteout risk and terrain obstacle concealment.`,
      weight: 25
    });
    score += 25;
  } else if (input.visibility <= 5.0) {
    factors.push({
      name: 'Moderate Reduced Visibility',
      severity: 'MEDIUM',
      impact: `Visibility ${input.visibility} km limits long-range visual horizon across sastrugi.`,
      weight: 15
    });
    score += 15;
  } else if (input.visibility <= 8.0) {
    factors.push({
      name: 'Sub-Optimal Visibility',
      severity: 'LOW',
      impact: `Visibility ${input.visibility} km requires radar navigation check-ins.`,
      weight: 5
    });
    score += 5;
  }

  // 3. Wind Speed Evaluation (> 50 km/h is gale force in Antarctica)
  if (input.windSpeed >= 50) {
    factors.push({
      name: 'Katabatic Gale Wind',
      severity: 'HIGH',
      impact: `Sustained wind ${input.windSpeed} km/h causes severe drift and vehicle drag.`,
      weight: 25
    });
    score += 25;
  } else if (input.windSpeed >= 35) {
    factors.push({
      name: 'Elevated Wind Gusts',
      severity: 'MEDIUM',
      impact: `Wind ${input.windSpeed} km/h induces blowing ground snow and drifting across tracks.`,
      weight: 15
    });
    score += 15;
  } else if (input.windSpeed >= 25) {
    factors.push({
      name: 'Moderate Polar Breeze',
      severity: 'LOW',
      impact: `Wind ${input.windSpeed} km/h within normal operating envelope for tracked snowcats.`,
      weight: 5
    });
    score += 5;
  }

  // 4. Precipitation & Blizzard Severity
  if (input.precipitation >= 3) {
    factors.push({
      name: 'Blizzard Front Active',
      severity: 'CRITICAL',
      impact: 'Heavy polar precipitation combined with katabatic airflow.',
      weight: 25
    });
    score += 25;
  } else if (input.precipitation === 2) {
    factors.push({
      name: 'Moderate Snow Deposition',
      severity: 'MEDIUM',
      impact: 'Falling snow obscuring ground markers and optical tracks.',
      weight: 12
    });
    score += 12;
  }

  // 5. Snowpack Condition & Drift Accumulation
  if (input.snowCondition >= 3) {
    factors.push({
      name: 'Deep Unconsolidated Snowpack',
      severity: 'HIGH',
      impact: 'Excessive snow drift depth (>20cm) risk of vehicle bogging and hidden crevasses.',
      weight: 20
    });
    score += 20;
  } else if (input.snowCondition === 2) {
    factors.push({
      name: 'Fresh Powder on Sastrugi',
      severity: 'MEDIUM',
      impact: 'Uneven surface creates high rolling resistance and mechanical vibration.',
      weight: 10
    });
    score += 10;
  }

  // 6. Satellite Surface Change Detection (Crevasses & Rifting)
  if (input.surfaceChange >= 3) {
    factors.push({
      name: 'Active Crevasse Rifting',
      severity: 'CRITICAL',
      impact: 'Satellite radar interferometry detected major shear fracture displacement across route.',
      weight: 35
    });
    score += 35;
  } else if (input.surfaceChange === 2) {
    factors.push({
      name: 'Surface Coherence Drop Detected',
      severity: 'MEDIUM',
      impact: 'SAR coherence loss indicates localized snowpack shift or snow bridge thinning.',
      weight: 18
    });
    score += 18;
  } else if (input.surfaceChange === 1) {
    factors.push({
      name: 'Minor Surface Shift',
      severity: 'LOW',
      impact: 'Subtle thermal or roughness changes within safe operational margin.',
      weight: 5
    });
    score += 5;
  }

  // 7. Sea-Ice Specific Assessment (if applicable)
  if (typeof input.seaIceCondition === 'number' && input.seaIceCondition > 0) {
    if (input.seaIceCondition >= 3) {
      factors.push({
        name: 'Imminent Sea-Ice Breakup',
        severity: 'CRITICAL',
        impact: 'Offshore swell or warm currents causing floe detachment risk.',
        weight: 35
      });
      score += 35;
    } else if (input.seaIceCondition === 2) {
      factors.push({
        name: 'Active Tidal Hinge Movement',
        severity: 'HIGH',
        impact: 'Tidal crack dilation detected. Strict axle-weight limits must be enforced.',
        weight: 20
      });
      score += 20;
    } else {
      factors.push({
        name: 'Tidal Crack Monitoring Active',
        severity: 'LOW',
        impact: 'Routine daily crack monitoring required before crossing.',
        weight: 8
      });
      score += 8;
    }
  }

  // Clamp score between 0 and 100
  score = Math.min(100, Math.max(0, score));

  // Determine Operational Route Status
  let status = 'NORMAL';
  let recommendation = 'Route corridor nominal. Standard convoy departure procedures authorized.';

  if (input.dataFreshness > 1440) {
    status = 'NO_RECENT_DATA';
    recommendation = 'Observation data outdated (>24h). Acquire new satellite or aerial scout data prior to dispatch.';
  } else if (score >= 80) {
    status = 'HIGH_ATTENTION';
    recommendation = 'DANGER: Critical risk conditions along corridor. Suspend non-emergency operations. Emergency transit requires lead radar vehicle.';
  } else if (score >= 65) {
    status = 'REVIEW_REQUIRED';
    recommendation = 'Hold expedition departure. Review conditions with station logistics and glaciology leads before authorization.';
  } else if (score >= 45) {
    status = 'CAUTION';
    recommendation = 'Proceed with elevated caution. Deploy ground radar scout and maintain 30-minute comms checks. Consider alternative corridor if available.';
  }

  return {
    score,
    status,
    factors,
    recommendation,
    disclaimer: 'Decision-Support Risk Score (Simulated Model). Final operational dispatch requires human station commander approval.'
  };
}
