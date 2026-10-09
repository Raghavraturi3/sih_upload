// Centralized Polar Geospatial Tracking Service
// Orchestrates WebSocket stream, AIS / ADS-B feeds, shipment-to-vessel linking, and state updates

import {
  TRACKING_STATIONS,
  TRACKING_GATEWAYS,
  TRACKING_ROUTES,
  INITIAL_VESSELS,
  INITIAL_AIRCRAFT,
  INITIAL_SHIPMENTS,
  TRACKING_ALERTS
} from './trackingData.js';
import { AISProvider } from '../ais/aisProvider.js';
import { ADSBProvider } from '../adsb/adsbProvider.js';

class TrackingService {
  constructor() {
    this.stations = [...TRACKING_STATIONS];
    this.gateways = [...TRACKING_GATEWAYS];
    this.routes = JSON.parse(JSON.stringify(TRACKING_ROUTES));
    this.vessels = JSON.parse(JSON.stringify(INITIAL_VESSELS));
    this.aircraft = JSON.parse(JSON.stringify(INITIAL_AIRCRAFT));
    this.shipments = JSON.parse(JSON.stringify(INITIAL_SHIPMENTS));
    this.alerts = JSON.parse(JSON.stringify(TRACKING_ALERTS));

    this.aisProvider = new AISProvider({ provider: 'Commercial AIS Aggregator / Simulation' });
    this.adsbProvider = new ADSBProvider({ provider: 'OpenSky Network / Polar ADS-B Simulation' });

    this.connectionStatus = {
      ais: 'CONNECTED',
      adsb: 'CONNECTED',
      map: 'ONLINE',
      weather: 'CONNECTED',
      websocket: 'DISCONNECTED',
      lastUpdate: new Date().toLocaleTimeString()
    };

    this.subscribers = [];
    this.socket = null;
    this.reconnectTimer = null;
    this.simulationTimer = null;

    this.initWebSocket();
    this.startLiveSimulationTicker();
  }

  subscribe(cb) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.getState()));
  }

  getState() {
    return {
      stations: this.stations,
      gateways: this.gateways,
      routes: this.routes,
      vessels: this.vessels,
      aircraft: this.aircraft,
      shipments: this.shipments,
      alerts: this.alerts,
      status: this.connectionStatus,
      aisInfo: this.aisProvider.getProviderInfo(),
      adsbInfo: this.adsbProvider.getProviderInfo()
    };
  }

  initWebSocket() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = '5000'; // Backend server port
      const wsUrl = `${protocol}//${host}:${port}/ws/tracking`;

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.connectionStatus.websocket = 'CONNECTED';
        this.notify();
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.handleWebSocketEvent(payload);
        } catch {
          // Parsing error ignored
        }
      };

      this.socket.onclose = () => {
        this.connectionStatus.websocket = 'DISCONNECTED';
        this.notify();
        // Retry connection after 5 seconds
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.initWebSocket();
          }, 5000);
        }
      };

      this.socket.onerror = () => {
        this.connectionStatus.websocket = 'ERROR';
      };
    } catch {
      this.connectionStatus.websocket = 'FALLBACK_LOCAL';
    }
  }

  handleWebSocketEvent(event) {
    if (event.type === 'VESSEL_POSITION_UPDATED' && event.data) {
      const v = this.vessels.find(item => item.mmsi === event.data.mmsi);
      if (v) {
        v.latitude = event.data.latitude;
        v.longitude = event.data.longitude;
        if (event.data.speed) v.speedKnots = event.data.speed;
        if (event.data.heading) v.heading = event.data.heading;
        v.lastUpdated = '1 sec ago';
        v.trackingStatus = 'LIVE';
      }
      this.connectionStatus.lastUpdate = new Date().toLocaleTimeString();
      this.notify();
    } else if (event.type === 'AIRCRAFT_POSITION_UPDATED' && event.data) {
      const a = this.aircraft.find(item => item.icao24 === event.data.icao24);
      if (a) {
        a.latitude = event.data.latitude;
        a.longitude = event.data.longitude;
        if (event.data.altitude) a.altitude = event.data.altitude;
        if (event.data.heading) a.heading = event.data.heading;
        a.lastUpdated = '1 sec ago';
        a.trackingStatus = 'LIVE';
      }
      this.connectionStatus.lastUpdate = new Date().toLocaleTimeString();
      this.notify();
    }
  }

  // Smooth live position delta ticker (moves vessels & aircraft along genuine polar courses)
  startLiveSimulationTicker() {
    if (this.simulationTimer) clearInterval(this.simulationTimer);

    this.simulationTimer = setInterval(() => {
      // Advance vessels incrementally along their heading
      this.vessels.forEach(v => {
        const speedFactor = 0.00015 * (v.speedKnots || 12);
        const rad = (v.heading || v.course || 180) * (Math.PI / 180);
        v.latitude += Math.cos(rad) * speedFactor;
        v.longitude += Math.sin(rad) * speedFactor;
        v.lastUpdated = '3 sec ago';
      });

      // Advance aircraft faster along their heading
      this.aircraft.forEach(a => {
        const speedFactor = 0.0008 * ((a.velocity || 300) / 100);
        const rad = (a.heading || 180) * (Math.PI / 180);
        a.latitude += Math.cos(rad) * speedFactor;
        a.longitude += Math.sin(rad) * speedFactor;
        a.lastUpdated = '2 sec ago';
      });

      this.connectionStatus.lastUpdate = new Date().toLocaleTimeString();
      this.notify();
    }, 4000);
  }

  findVesselByShipment(shipmentId) {
    const sh = this.shipments.find(s => s.shipmentId === shipmentId);
    if (!sh) return null;
    if (sh.vesselMmsi) {
      return {
        type: 'VESSEL',
        object: this.vessels.find(v => v.mmsi === sh.vesselMmsi)
      };
    }
    if (sh.aircraftIcao) {
      return {
        type: 'AIRCRAFT',
        object: this.aircraft.find(a => a.icao24 === sh.aircraftIcao)
      };
    }
    return null;
  }

  findShipmentByVessel(mmsi) {
    return this.shipments.find(s => s.vesselMmsi === mmsi);
  }

  findShipmentByAircraft(icao24) {
    return this.shipments.find(s => s.aircraftIcao === icao24);
  }

  getVesselByMmsi(mmsi) {
    return this.vessels.find(v => v.mmsi === mmsi);
  }

  getAircraftByIcao(icao) {
    return this.aircraft.find(a => a.icao24 === icao);
  }

  getCounters() {
    const liveVessels = this.vessels.filter(v => v.trackingStatus === 'LIVE').length;
    const liveAircraft = this.aircraft.filter(a => a.trackingStatus === 'LIVE').length;
    const inTransitShipments = this.shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'IN_FLIGHT').length;
    const alertCount = this.alerts.length;

    return {
      vessels: liveVessels,
      aircraft: liveAircraft,
      shipments: inTransitShipments,
      alerts: alertCount
    };
  }

  destroy() {
    if (this.simulationTimer) clearInterval(this.simulationTimer);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.socket) this.socket.close();
  }
}

export const trackingService = new TrackingService();
