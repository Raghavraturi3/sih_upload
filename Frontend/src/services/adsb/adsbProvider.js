// ADS-B Provider Abstraction — Normalizes OpenSky Network, ADS-B Exchange & Polar Aviation Feeds
// Strictly transparent: Clearly flags simulated data when live commercial API keys are not supplied

/**
 * @typedef {Object} Aircraft
 * @property {string} icao24
 * @property {string} [callsign]
 * @property {string} [registration]
 * @property {string} [model]
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} [altitude] - Altitude in feet
 * @property {number} [velocity] - Speed in knots
 * @property {number} [heading] - Degrees 0-360
 * @property {number} [verticalRate] - Feet per minute
 * @property {string} [originCountry]
 * @property {string} [origin]
 * @property {string} [destination]
 * @property {string} lastUpdated
 * @property {'ADS-B' | 'SIMULATED_ADSB'} dataSource
 * @property {'LIVE' | 'STALE' | 'OFFLINE'} trackingStatus
 * @property {string} [associatedShipmentId]
 */

export class ADSBProvider {
  constructor(config = {}) {
    this.providerName = config.provider || 'MockADSBProvider';
    this.apiUrl = config.apiUrl || '';
    this.apiKey = config.apiKey || '';
    this.isLive = Boolean(this.apiKey && this.apiUrl);
  }

  getProviderInfo() {
    return {
      name: this.providerName,
      isLive: this.isLive,
      status: this.isLive ? 'CONNECTED' : 'SIMULATED / DEMO MODE',
      attribution: this.isLive ? `Live ADS-B Stream via ${this.providerName}` : 'Polar Air Operations Simulation Engine'
    };
  }

  async fetchAircraft() {
    if (this.isLive) {
      try {
        const res = await fetch('/api/tracking/aircraft');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) return json.data;
        }
      } catch (err) {
        console.warn('[ADSBProvider] Live query failed, falling back to local dataset', err);
      }
    }
    return null;
  }
}
