/**
 * Computational Physics & Simulation Engine for Antarctic Digital Twin
 * 
 * Provides:
 * 1. Thermal Simulation: Heat dissipation, indoor module equilibrium, and external wall loss.
 * 2. Energy Simulation: Power generation (CHP/Diesel/Solar) vs station consumption load.
 * 3. HVAC Simulation: Ventilation airflow (CFM), return temp, and heat-exchange efficiency.
 * 
 * PROVENANCE REQUIREMENT:
 * All simulation outputs MUST be explicitly labeled: '● SIMULATED'
 */

export class SimulationEngine {
  constructor() {
    this.isActive = true;
    this.speedMultiplier = 1.0; // 1x | 5x | 10x
    this.modelName = 'Antarctic Coupled Energy & Thermal Model v2.4';
    this.subscribers = [];

    // State Variables
    this.simulatedState = {
      timestamp: new Date().toISOString(),
      ambientOutsideTempC: -22.4,
      windSpeedKmh: 48.0,
      indoorAvgTempC: 20.8,
      thermalLossKw: 42.5,
      heatingRequiredKw: 45.0,
      totalPowerGeneratedKw: 147.0,
      totalPowerConsumedKw: 118.5,
      batteryStateOfChargePercent: 91.5,
      hvacAirflowCfm: 4200,
      hvacReturnTempC: 19.5,
      hvacHeatRecoveryEfficiency: 0.86,
      provenance: '● SIMULATED (Coupled Model v2.4)'
    };

    this.timer = null;
    this.startSimulationLoop();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.simulatedState));
  }

  setSpeed(multiplier) {
    this.speedMultiplier = Math.max(0.5, Math.min(20, multiplier));
  }

  toggleActive() {
    this.isActive = !this.isActive;
    return this.isActive;
  }

  reset() {
    this.simulatedState.indoorAvgTempC = 20.8;
    this.simulatedState.totalPowerConsumedKw = 118.5;
    this.simulatedState.batteryStateOfChargePercent = 91.5;
    this.notify();
  }

  startSimulationLoop() {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      if (!this.isActive) return;

      const dt = 1.0 * this.speedMultiplier;
      const now = Date.now();

      // 1. Thermal Simulation: Newton's Law of Cooling + Heating Inflow
      // Heat loss = U * A * (T_in - T_out)
      const uFactor = 0.28; // Insulated structural wall coefficient (W/m²K)
      const deltaT = this.simulatedState.indoorAvgTempC - this.simulatedState.ambientOutsideTempC;
      const heatLossKw = Math.round((uFactor * 420 * deltaT / 1000) * 10) / 10;
      
      // Dynamic heating input maintains ~20.5 - 21.5°C
      const heatInputKw = heatLossKw + (21.0 - this.simulatedState.indoorAvgTempC) * 3.5;
      this.simulatedState.indoorAvgTempC = Math.round((this.simulatedState.indoorAvgTempC + (heatInputKw - heatLossKw) * 0.002 * dt) * 10) / 10;
      this.simulatedState.thermalLossKw = heatLossKw;
      this.simulatedState.heatingRequiredKw = Math.round(heatInputKw * 10) / 10;

      // 2. Energy Simulation: Power Balance & Battery Delta
      // Base load fluctuating with time
      const loadNoise = Math.sin(now / 4000) * 8.0;
      const totalLoadKw = Math.round((115.0 + loadNoise + (heatInputKw * 0.4)) * 10) / 10;
      const powerSurplus = this.simulatedState.totalPowerGeneratedKw - totalLoadKw;

      // Battery charging/discharging
      if (powerSurplus > 0) {
        this.simulatedState.batteryStateOfChargePercent = Math.min(100, Math.round((this.simulatedState.batteryStateOfChargePercent + powerSurplus * 0.0005 * dt) * 10) / 10);
      } else {
        this.simulatedState.batteryStateOfChargePercent = Math.max(20, Math.round((this.simulatedState.batteryStateOfChargePercent + powerSurplus * 0.0005 * dt) * 10) / 10);
      }
      this.simulatedState.totalPowerConsumedKw = totalLoadKw;

      // 3. HVAC Simulation
      const fanNoise = Math.cos(now / 5000) * 120;
      this.simulatedState.hvacAirflowCfm = Math.round(4200 + fanNoise);
      this.simulatedState.hvacReturnTempC = Math.round((this.simulatedState.indoorAvgTempC - 1.2) * 10) / 10;
      this.simulatedState.timestamp = new Date().toISOString();

      this.notify();
    }, 1000);
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
  }
}

export const simulationEngine = new SimulationEngine();
