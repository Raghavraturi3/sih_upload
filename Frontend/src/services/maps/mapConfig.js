// Map Configuration & Tile Layers — Real Geospatial Infrastructure
// Supports Global, Indian Ocean, Southern Ocean, and Antarctic corridor operations

export const MAP_TILE_PROVIDERS = {
  dark: {
    id: 'dark',
    name: 'CartoDB Dark Matter (Tactical)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    options: {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 2
    }
  },
  satellite: {
    id: 'satellite',
    name: 'ESRI World Imagery (Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18,
      minZoom: 2
    }
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap (Standard)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 2
    }
  },
  nautical: {
    id: 'nautical',
    name: 'OpenSeaMap (Nautical Marks)',
    url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
    options: {
      attribution: 'Map data &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
      maxZoom: 18,
      minZoom: 2
    }
  }
};

export const VIEWPORT_PRESETS = {
  GLOBAL: {
    name: 'Global Corridor (India ↔ Antarctica)',
    center: [-26.0, 52.0],
    zoom: 3
  },
  INDIAN_OCEAN: {
    name: 'Indian Ocean Basin',
    center: [-12.0, 68.0],
    zoom: 4
  },
  SOUTHERN_OCEAN: {
    name: 'Southern Ocean (40°S - 65°S)',
    center: [-54.0, 38.0],
    zoom: 4
  },
  ANTARCTIC_REGION: {
    name: 'Antarctic Continental Shelf',
    center: [-68.5, 45.0],
    zoom: 4
  },
  MAITRI_STATION: {
    name: 'Maitri Station Sector (Schirmacher Oasis)',
    center: [-70.7658, 11.7358],
    zoom: 7
  },
  BHARATI_STATION: {
    name: 'Bharati Station Sector (Larsemann Hills)',
    center: [-69.4078, 76.1872],
    zoom: 7
  },
  CAPE_TOWN: {
    name: 'Cape Town Gateway (South Africa)',
    center: [-33.9249, 18.4241],
    zoom: 7
  },
  INDIA_GOA: {
    name: 'Indian Polar Gateway (Mormugao Port / Goa)',
    center: [15.4026, 73.8055],
    zoom: 7
  }
};
