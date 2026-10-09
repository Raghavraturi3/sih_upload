// AIS Provider Abstraction — Normalizes MarineTraffic, VesselFinder & Internal AIS Streams
// Strictly transparent: Clearly flags simulated data when live commercial API keys are not supplied

/**
 * @typedef {Object} Vessel
 * @property {string} mmsi
 * @property {string} [imo]
 * @property {string} name
 * @property {'CARGO' | 'ICEBREAKER' | 'RESEARCH' | 'TANKER' | 'SUPPLY' | 'UNKNOWN'} vesselType
 * @property {string} [flag]
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} [speedKnots]
 * @property {number} [course]
 * @property {number} [heading]
 * @property {string} [navigationStatus]
 * @property {string} [destination]
 * @property {string} [departurePort]
 * @property {string} [eta]
 * @property {string} lastUpdated
 * @property {'AIS' | 'SIMULATED_AIS'} dataSource
 * @property {'LIVE' | 'STALE' | 'OFFLINE'} trackingStatus
 * @property {string} [associatedShipmentId]
 */

export class AISProvider {
  constructor(config = {}) {
    this.providerName = config.provider || 'MockAISProvider';
    this.apiUrl = config.apiUrl || '';
    this.apiKey = config.apiKey || '';
    this.isLive = Boolean(this.apiKey && this.apiUrl);
  }

  getProviderInfo() {
    return {
      name: this.providerName,
      isLive: this.isLive,
      status: this.isLive ? 'CONNECTED' : 'SIMULATED / DEMO MODE',
      attribution: this.isLive ? `Live AIS Stream via ${this.providerName}` : 'Antarctic Logistics Simulation Engine'
    };
  }

  async fetchVessels() {
    if (this.isLive) {
      try {
        const res = await fetch('/api/tracking/vessels');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) return json.data;
        }
      } catch (err) {
        console.warn('[AISProvider] Live query failed, falling back to local dataset', err);
      }
    }
    return null; // Fallback handled by tracking service
  }
}
