/**
 * Verified Antarctic Research Stations & Key Scientific Waypoints
 * Source: National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Govt. of India
 * & Scientific Committee on Antarctic Research (SCAR) Composite Gazetteer
 */

export const VERIFIED_ANTARCTIC_STATIONS = [
  {
    id: 'MAITRI',
    name: 'Maitri Research Station',
    hindiName: 'मैत्री अनुसंधान केंद्र',
    country: 'India',
    operator: 'NCPOR / Ministry of Earth Sciences',
    wmoId: '89514',
    coordinates: {
      lat: -70.765833,
      lon: 11.735833,
      formatted: "70°45'57\"S, 11°44'09\"E"
    },
    elevationMeters: 117,
    region: 'Schirmacher Oasis, Queen Maud Land (Dronning Maud Land)',
    established: 1989,
    status: 'ACTIVE_YEAR_ROUND',
    population: { winter: 25, summer: 65 },
    freshwaterSource: 'Lake Priyadarshini (Glacial-fed oligotrophic freshwater)',
    convoyRole: 'Primary Hub for Inland Sledging & Wohlthat Geological Traverses',
    provenance: {
      source: 'NCPOR Official Station Catalog & SCAR Gazetteer',
      accuracy: 'Sub-meter Geodetic Survey Benchmark',
      dataStatus: 'VERIFIED DATA'
    }
  },
  {
    id: 'BHARATI',
    name: 'Bharati Research Station',
    hindiName: 'भारती अनुसंधान केंद्र',
    country: 'India',
    operator: 'NCPOR / Ministry of Earth Sciences',
    wmoId: '89512',
    coordinates: {
      lat: -69.407778,
      lon: 76.187222,
      formatted: "69°24'28\"S, 76°11'14\"E"
    },
    elevationMeters: 35,
    region: 'Larsemann Hills, Princess Elizabeth Land (Prydz Bay)',
    established: 2012,
    status: 'ACTIVE_YEAR_ROUND',
    population: { winter: 23, summer: 47 },
    freshwaterSource: 'Lake Bharati & Seawater Desalination Plant',
    convoyRole: 'Sea-Ice Offloading Hub, Coastal Traverses & Oceanographic Wharf',
    provenance: {
      source: 'NCPOR Station Dossier & Surveyor General of India Benchmark',
      accuracy: 'Dual-frequency GNSS Reference Station',
      dataStatus: 'VERIFIED DATA'
    }
  },
  {
    id: 'NOVO_RUNWAY',
    name: 'Novo Airfield (ALCI Blue Ice Runway)',
    country: 'International / ALCI Consortium',
    operator: 'Antarctic Logistics Centre International (ALCI)',
    coordinates: {
      lat: -70.821111,
      lon: 11.632222,
      formatted: "70°49'16\"S, 11°37'56\"E"
    },
    elevationMeters: 520,
    region: 'Blue Ice Moraine South of Schirmacher Oasis',
    status: 'SEASONAL_AIRPORT',
    runwayType: 'Blue Ice (3,000m x 60m, capable of IL-76TD-90VD heavy cargo)',
    convoyRole: 'Primary Intercontinental Airhead for Maitri Personnel & High-Priority Cargo',
    provenance: {
      source: 'ICAO Polar Aerodrome Registry',
      accuracy: 'Surveyed Runway Threshold Coordinates',
      dataStatus: 'VERIFIED DATA'
    }
  },
  {
    id: 'DAKSHIN_GANGOTRI',
    name: 'Dakshin Gangotri (Historical Base)',
    hindiName: 'दक्षिण गंगोत्री',
    country: 'India',
    operator: 'Historical Monument / HSM 44 under Antarctic Treaty',
    coordinates: {
      lat: -70.091667,
      lon: 12.008333,
      formatted: "70°05'30\"S, 12°00'30\"E"
    },
    elevationMeters: 20,
    region: 'Dakshin Gangotri Ice Shelf / Fimbul Ice Shelf Front',
    established: 1983,
    status: 'DECOMMISSIONED_HISTORICAL',
    convoyRole: 'Historical Shelf Base & Winter Traverse Waypoint',
    provenance: {
      source: 'Antarctic Treaty Secretariat Historic Sites and Monuments (HSM 44)',
      accuracy: 'Historical Survey Record (Submerged under ice shelf snow accumulation)',
      dataStatus: 'VERIFIED DATA'
    }
  },
  {
    id: 'ZHONGSHAN',
    name: 'Zhongshan Station (China)',
    country: 'China',
    operator: 'PRIC (Polar Research Institute of China)',
    coordinates: {
      lat: -69.373611,
      lon: 76.377778,
      formatted: "69°22'25\"S, 76°22'40\"E"
    },
    elevationMeters: 18,
    region: 'Larsemann Hills (Neighboring Station ~9.6 km NE of Bharati)',
    status: 'ACTIVE_YEAR_ROUND',
    convoyRole: 'Bilateral Emergency Mutual-Aid Corridor Partner',
    provenance: {
      source: 'SCAR Station Directory',
      accuracy: 'Geodetic Marker',
      dataStatus: 'VERIFIED DATA'
    }
  },
  {
    id: 'PROGRESS_II',
    name: 'Progress-II Station (Russia)',
    country: 'Russia',
    operator: 'AARI (Arctic and Antarctic Research Institute)',
    coordinates: {
      lat: -69.376667,
      lon: 76.386111,
      formatted: "69°22'36\"S, 76°23'10\"E"
    },
    elevationMeters: 15,
    region: 'Larsemann Hills (Traverse Hub for Vostok Station Supply)',
    status: 'ACTIVE_YEAR_ROUND',
    convoyRole: 'Deep Continental Sledge Traverse Departure Point',
    provenance: {
      source: 'AARI Station Network',
      accuracy: 'Published Coordinates',
      dataStatus: 'VERIFIED DATA'
    }
  }
];
