// Antarctic Geospatial Projection & Geodesic Calculation Engine
// Implements EPSG:3031 (WGS84 / Antarctic Polar Stereographic) via Proj4

import proj4 from 'proj4';

// EPSG:3031 definition standard for Scientific Committee on Antarctic Research (SCAR) & BAS
export const EPSG3031_DEF = '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs';
proj4.defs('EPSG:3031', EPSG3031_DEF);

/**
 * Converts WGS84 latitude/longitude to EPSG:3031 polar stereographic meters [x, y].
 * @param {number} lat - Latitude in degrees (-90 to 0)
 * @param {number} lon - Longitude in degrees (-180 to 180)
 * @returns {[number, number]} [x, y] in meters
 */
export function toEPSG3031(lat, lon) {
  try {
    return proj4('EPSG:4326', 'EPSG:3031', [lon, lat]);
  } catch (err) {
    console.error('Projection conversion error:', err);
    return [0, 0];
  }
}

/**
 * Converts EPSG:3031 polar stereographic meters [x, y] to WGS84 [lat, lon].
 * @param {number} x - Easting in meters
 * @param {number} y - Northing in meters
 * @returns {[number, number]} [lat, lon] in degrees
 */
export function toWGS84(x, y) {
  try {
    const [lon, lat] = proj4('EPSG:3031', 'EPSG:4326', [x, y]);
    return [lat, lon];
  } catch (err) {
    console.error('Inverse projection conversion error:', err);
    return [-90, 0];
  }
}

/**
 * Formats decimal latitude/longitude into professional DMS polar strings.
 * e.g. 70°45′57″S, 11°44′09″E
 */
export function formatPolarCoordinates(lat, lon) {
  const latHem = lat >= 0 ? 'N' : 'S';
  const lonHem = lon >= 0 ? 'E' : 'W';

  const absLat = Math.abs(lat);
  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);
  const latSec = Math.round(((absLat - latDeg) * 60 - latMin) * 60);

  const absLon = Math.abs(lon);
  const lonDeg = Math.floor(absLon);
  const lonMin = Math.floor((absLon - lonDeg) * 60);
  const lonSec = Math.round(((absLon - lonDeg) * 60 - lonMin) * 60);

  return {
    dms: `${latDeg}°${latMin.toString().padStart(2, '0')}′${latSec.toString().padStart(2, '0')}″${latHem}, ${lonDeg}°${lonMin.toString().padStart(2, '0')}′${lonSec.toString().padStart(2, '0')}″${lonHem}`,
    decimal: `${lat.toFixed(5)}°, ${lon.toFixed(5)}°`
  };
}

/**
 * Calculates geodesic Great-Circle distance in kilometers along a route geometry.
 * Uses the spherical Haversine formula (Earth mean radius = 6371.0 km).
 * @param {Array<[number, number]>} coordinates - Array of [lon, lat] or [lat, lon] points
 * @param {boolean} isLonLat - True if GeoJSON format [lon, lat], false if Leaflet [lat, lon]
 * @returns {number} Distance in kilometers rounded to 1 decimal place
 */
export function calculateGeodesicDistanceKm(coordinates, isLonLat = true) {
  if (!coordinates || coordinates.length < 2) return 0;
  let totalKm = 0;
  const R = 6371.0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const pt1 = coordinates[i];
    const pt2 = coordinates[i + 1];

    const lat1 = (isLonLat ? pt1[1] : pt1[0]) * (Math.PI / 180);
    const lon1 = (isLonLat ? pt1[0] : pt1[1]) * (Math.PI / 180);
    const lat2 = (isLonLat ? pt2[1] : pt2[0]) * (Math.PI / 180);
    const lon2 = (isLonLat ? pt2[0] : pt2[1]) * (Math.PI / 180);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    totalKm += R * c;
  }

  return Math.round(totalKm * 10) / 10;
}

/**
 * Calculates cross-track error distance (in nautical miles) from an observed point to a corridor segment.
 */
export function calculateCrossTrackErrorNm(obsLat, obsLon, startLat, startLon, endLat, endLon) {
  const R = 3440.065; // Earth radius in nautical miles
  const toRad = Math.PI / 180;

  const phi1 = startLat * toRad;
  const lambda1 = startLon * toRad;
  const phi2 = endLat * toRad;
  const lambda2 = endLon * toRad;
  const phi3 = obsLat * toRad;
  const lambda3 = obsLon * toRad;

  // Angular distance from start to point
  const delta13 = 2 * Math.asin(Math.sqrt(
    Math.sin((phi3 - phi1) / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi3) * Math.sin((lambda3 - lambda1) / 2) ** 2
  ));

  // Initial bearing from start to end
  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  const theta12 = Math.atan2(y, x);

  // Initial bearing from start to point
  const y3 = Math.sin(lambda3 - lambda1) * Math.cos(phi3);
  const x3 = Math.cos(phi1) * Math.sin(phi3) - Math.sin(phi1) * Math.cos(phi3) * Math.cos(lambda3 - lambda1);
  const theta13 = Math.atan2(y3, x3);

  // Cross-track distance
  const dxt = Math.asin(Math.sin(delta13) * Math.sin(theta13 - theta12));
  return Math.abs(Math.round(dxt * R * 10) / 10);
}
