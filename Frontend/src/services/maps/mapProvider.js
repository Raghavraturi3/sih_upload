// Unified Map Provider Abstraction (Leaflet Engine)
// Decouples UI from the underlying mapping engine, supporting tile switching, markers, and GeoJSON layers

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_TILE_PROVIDERS, VIEWPORT_PRESETS } from './mapConfig.js';
import { createVesselIcon, createAircraftIcon, createStationIcon, createPortIcon } from './layers.js';

export class PolarMapEngine {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = options;
    this.map = null;
    this.currentTileLayer = null;
    this.nauticalLayer = null;
    this.vesselMarkers = new Map();
    this.aircraftMarkers = new Map();
    this.routeLayers = new Map();
    this.stationMarkers = [];
    this.portMarkers = [];
  }

  initialize(defaultPreset = 'GLOBAL') {
    const preset = VIEWPORT_PRESETS[defaultPreset] || VIEWPORT_PRESETS.GLOBAL;
    
    // Fix default marker icon asset paths if standard leaflet pins are used
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    this.map = L.map(this.containerId, {
      center: preset.center,
      zoom: preset.zoom,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true
    });

    // Custom top-right zoom control
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Set initial tactical dark basemap
    this.setTileLayer('dark');

    return this.map;
  }

  setTileLayer(layerKey) {
    if (!this.map) return;
    const provider = MAP_TILE_PROVIDERS[layerKey] || MAP_TILE_PROVIDERS.dark;

    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }

    this.currentTileLayer = L.tileLayer(provider.url, provider.options).addTo(this.map);
  }

  toggleNauticalOverlay(enable) {
    if (!this.map) return;
    if (enable) {
      if (!this.nauticalLayer) {
        const p = MAP_TILE_PROVIDERS.nautical;
        this.nauticalLayer = L.tileLayer(p.url, p.options);
      }
      this.nauticalLayer.addTo(this.map);
    } else if (this.nauticalLayer) {
      this.map.removeLayer(this.nauticalLayer);
    }
  }

  setViewport(presetKey) {
    if (!this.map) return;
    const preset = VIEWPORT_PRESETS[presetKey];
    if (preset) {
      this.map.flyTo(preset.center, preset.zoom, { duration: 1.5 });
    }
  }

  flyTo(lat, lon, zoom = 7) {
    if (!this.map) return;
    this.map.flyTo([lat, lon], zoom, { duration: 1.2 });
  }

  addStationMarkers(stations, onSelect) {
    if (!this.map) return;
    this.stationMarkers.forEach(m => this.map.removeLayer(m));
    this.stationMarkers = [];

    stations.forEach(st => {
      const marker = L.marker([st.latitude, st.longitude], {
        icon: createStationIcon(st),
        zIndexOffset: 1000
      }).addTo(this.map);

      marker.on('click', () => {
        if (onSelect) onSelect(st);
      });

      this.stationMarkers.push(marker);
    });
  }

  addPortMarkers(ports, onSelect) {
    if (!this.map) return;
    this.portMarkers.forEach(m => this.map.removeLayer(m));
    this.portMarkers = [];

    ports.forEach(pt => {
      const marker = L.marker([pt.latitude, pt.longitude], {
        icon: createPortIcon(pt),
        zIndexOffset: 900
      }).addTo(this.map);

      marker.on('click', () => {
        if (onSelect) onSelect(pt);
      });

      this.portMarkers.push(marker);
    });
  }

  updateVessels(vessels, selectedMMSI, onSelect) {
    if (!this.map) return;

    // Track existing IDs to prune removed ones
    const currentMmsis = new Set(vessels.map(v => v.mmsi));

    this.vesselMarkers.forEach((marker, mmsi) => {
      if (!currentMmsis.has(mmsi)) {
        this.map.removeLayer(marker);
        this.vesselMarkers.delete(mmsi);
      }
    });

    vessels.forEach(v => {
      const isSelected = v.mmsi === selectedMMSI;
      const icon = createVesselIcon(v, isSelected);

      if (this.vesselMarkers.has(v.mmsi)) {
        const marker = this.vesselMarkers.get(v.mmsi);
        marker.setLatLng([v.latitude, v.longitude]);
        marker.setIcon(icon);
      } else {
        const marker = L.marker([v.latitude, v.longitude], {
          icon,
          zIndexOffset: isSelected ? 800 : 500
        }).addTo(this.map);

        marker.on('click', () => {
          if (onSelect) onSelect(v);
        });

        this.vesselMarkers.set(v.mmsi, marker);
      }
    });
  }

  updateAircraft(aircraftList, selectedIcao, onSelect) {
    if (!this.map) return;

    const currentIcaos = new Set(aircraftList.map(a => a.icao24));

    this.aircraftMarkers.forEach((marker, icao) => {
      if (!currentIcaos.has(icao)) {
        this.map.removeLayer(marker);
        this.aircraftMarkers.delete(icao);
      }
    });

    aircraftList.forEach(a => {
      const isSelected = a.icao24 === selectedIcao;
      const icon = createAircraftIcon(a, isSelected);

      if (this.aircraftMarkers.has(a.icao24)) {
        const marker = this.aircraftMarkers.get(a.icao24);
        marker.setLatLng([a.latitude, a.longitude]);
        marker.setIcon(icon);
      } else {
        const marker = L.marker([a.latitude, a.longitude], {
          icon,
          zIndexOffset: isSelected ? 850 : 600
        }).addTo(this.map);

        marker.on('click', () => {
          if (onSelect) onSelect(a);
        });

        this.aircraftMarkers.set(a.icao24, marker);
      }
    });
  }

  addCorridorRoutes(routes, activeRouteId) {
    if (!this.map) return;

    this.routeLayers.forEach(layer => this.map.removeLayer(layer));
    this.routeLayers.clear();

    routes.forEach(route => {
      const isSelected = route.id === activeRouteId;
      const isDeviation = route.type === 'DEVIATION';
      const isActual = route.type === 'ACTUAL';

      let color = '#38bdf8'; // Planned Blue
      let dashArray = '6, 6';
      let weight = 2.5;

      if (isActual) {
        color = '#22c55e'; // Actual Green
        dashArray = null;
        weight = 3;
      } else if (isDeviation) {
        color = '#ef4444'; // Deviation Red
        dashArray = '4, 4';
        weight = 3;
      }

      if (isSelected) {
        weight += 1.5;
      }

      // GeoJSON LineString coordinates: [lon, lat] -> Leaflet: [lat, lon]
      const latLngs = route.coordinates.map(c => [c[1], c[0]]);

      const polyline = L.polyline(latLngs, {
        color,
        weight,
        dashArray,
        opacity: isSelected ? 0.95 : 0.65,
        smoothFactor: 1.5
      }).addTo(this.map);

      this.routeLayers.set(route.id, polyline);
    });
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
