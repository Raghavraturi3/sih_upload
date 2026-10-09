/**
 * Station 3D Architectural Digital Twin Model Builder
 * Exact 3D Models & Geometries for Indian Antarctic Stations:
 * - MAITRI STATION (Schirmacher Oasis, 70°45'S, 11°44'E)
 * - BHARATI STATION (Larsemann Hills, 69°24'S, 76°11'E)
 * 
 * Replicated exactly from https://www.alphaeduhub.in/
 */

import * as THREE from 'three';

// -------------------------------------------------------------
// PROCEDURAL HIGH-RESOLUTION CANVAS TEXTURES
// -------------------------------------------------------------

export function createMaitriStationTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    for (let x = 32; x < 512; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    for (let x = 36; x < 480; x += 44) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, 140, 30, 24);
      ctx.fillStyle = 'rgba(253, 230, 138, 0.85)';
      ctx.fillRect(x + 3, 143, 24, 18);
    }
    const rx = 140, ry = 36, rw = 90, rh = 60;
    ctx.fillStyle = '#ff9933';
    ctx.fillRect(rx, ry, rw, rh / 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(rx, ry + rh / 3, rw, rh / 3);
    ctx.fillStyle = '#138808';
    ctx.fillRect(rx, ry + 2 * rh / 3, rw, rh / 3);
    ctx.strokeStyle = '#000080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rx + rw / 2, ry + rh / 2, rh / 6.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('MAITRI', 255, 80);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function createHelipadMaitriTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#262626';
    ctx.beginPath();
    ctx.arc(256, 256, 250, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#525252';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(256, 256, 175, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 160px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function createBharatiStationTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    for (let y = 30; y < 256; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    for (let x = 32; x < 512; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 45, 472, 35);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.fillRect(24, 48, 464, 29);
    for (let x = 30; x < 480; x += 45) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, 150, 32, 26);
      ctx.fillStyle = 'rgba(253, 230, 138, 0.9)';
      ctx.fillRect(x + 3, 153, 26, 20);
    }
    const rx = 35, ry = 92, rw = 85, rh = 50;
    ctx.fillStyle = '#ff9933';
    ctx.fillRect(rx, ry, rw, rh / 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(rx, ry + rh / 3, rw, rh / 3);
    ctx.fillStyle = '#138808';
    ctx.fillRect(rx, ry + 2 * rh / 3, rw, rh / 3);
    ctx.strokeStyle = '#000080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rx + rw / 2, ry + rh / 2, rh / 6.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('BHARATI', 140, 130);
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText("LARSEMANN HILLS • ANTARCTICA • 69°24'S, 76°11'E", 140, 146);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function createHelipadBharatiTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(256, 256, 250, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(256, 256, 175, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 160px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// -------------------------------------------------------------
// EXACT FACILITY HOTSPOTS & METADATA
// -------------------------------------------------------------

export const MAITRI_HOTSPOTS = [
  {
    id: "comms-tower",
    label: "Communication Tower",
    pos: [-16, 7.5, -1],
    category: "TELECOMMUNICATIONS",
    status: "OPERATIONAL",
    temp: "-12.4°C",
    power: "4.8 kW",
    description: "12m steel lattice tower carrying dual Ku-band satellite uplink, VHF air-to-ground transceiver, and HF Antarctic communications.",
    equipment: ["Ku-Band VSAT Uplink", "VHF Air-Band Transceiver", "Iridium Extreme Gateway", "Aviation Warning Beacon"]
  },
  {
    id: "power-plant",
    label: "Power Plant",
    pos: [-10, 2.5, 4],
    category: "ENERGY & MICROGRID",
    status: "OPTIMAL (4/4 CHP)",
    temp: "68.2°C",
    power: "128 kW Gen",
    description: "Main co-generation station power house featuring 4x 62.5 kVA diesel generators with waste-heat hydronic recovery loop.",
    equipment: ["CHP Generator #1 (Primary)", "CHP Generator #2 (Co-gen)", "CHP Generator #3 (Standby)", "Hydronic Heat Exchanger"]
  },
  {
    id: "fuel-storage",
    label: "Fuel Storage",
    pos: [-9, 2.8, -9],
    category: "LOGISTICS & RESERVES",
    status: "NORMAL (78% FULL)",
    temp: "-4.1°C",
    power: "1.2 kW Heaters",
    description: "Heated bulk fuel tank farm storing Arctic-grade aviation kerosene (ATF-50) with automated leak detection & trace heating.",
    equipment: ["Tank #1 (12,000L ATF-50)", "Tank #2 (12,000L ATF-50)", "Tank #3 (12,000L)", "Tank #4 (12,000L)", "Heated Transfer Manifold"]
  },
  {
    id: "main-building",
    label: "Main Building",
    pos: [-1, 3.8, -3],
    category: "COMMAND & RESIDENTIAL",
    status: "ACTIVE OCCUPANCY (25)",
    temp: "+21.5°C",
    power: "44 kW Load",
    description: "Two-story central station structure housing the command room, radio shacks, mess hall, library, medical infirmary, and boiler room.",
    equipment: ["Central PLC Station Automation", "Medical Surgery Infirmary", "415V Main Switchboard", "Pressurized Water Distribution"]
  },
  {
    id: "research-lab",
    label: "Research Lab",
    pos: [3, 3.2, 5],
    category: "SCIENCE & SENSORS",
    status: "CALIBRATED & ONLINE",
    temp: "+19.8°C",
    power: "18.4 kW Load",
    description: "Multidisciplinary research wing for atmospheric physics, geomagnetism, seismology, ozone spectrophotometry, and meteorology.",
    equipment: ["Proton Magnetometer", "Broadband Seismograph", "Brewer Ozone Spectrophotometer", "Riometer Aurora Monitor"]
  },
  {
    id: "living-quarters",
    label: "Living Quarters",
    pos: [9, 2.2, 0],
    category: "LIFE SUPPORT",
    status: "PRESSURIZED & NOMINAL",
    temp: "+20.8°C",
    power: "22 kW Load",
    description: "Insulated modular container blocks providing private cabins, sanitation units, laundry, air recycling, and water heaters for overwintering crew.",
    equipment: ["HVAC Air Recirculator", "Greywater Recycling Loop", "Fire Suppression Halon Array", "Emergency Battery Lighting"]
  },
  {
    id: "helipad",
    label: "Helipad",
    pos: [15, 1.2, -6],
    category: "AVIATION & LOGISTICS",
    status: "ACTIVE / LANDING CLEAR",
    temp: "-8.2°C",
    power: "2.5 kW Lighting",
    description: "Reinforced 18m circular arctic helicopter landing pad equipped with green perimeter guidance lights and parked rescue helicopter.",
    equipment: ["Antarctic Medical Evac Helicopter", "Green Perimeter Heli-Lights", "Approach Wind Direction Indicator", "Foam Fire Extinguisher Station"]
  },
  {
    id: "met-mast",
    label: "Meteorological Mast",
    pos: [19, 4.5, 6],
    category: "ATMOSPHERIC SENSING",
    status: "TRANSMITTING",
    temp: "-8.2°C",
    power: "0.4 kW",
    description: "10m WMO-standard synoptic weather mast with ultrasonic anemometers, pyranometers, barometric sensors, and snow accumulation gauges.",
    equipment: ["Sonic Anemometer (14.6 m/s E)", "Thermistor String (-8.2°C)", "Capacitive Barometer", "Campbell Scientific Data Logger"]
  }
];

export const BHARATI_HOTSPOTS = [
  {
    id: "main-complex",
    label: "Main Station Complex",
    pos: [0, 6.8, 0],
    category: "INTEGRATED COMMAND & LIVING",
    status: "OPERATIONAL (24 CREW)",
    temp: "+22.4°C",
    power: "65 kW Load",
    description: "Elevated 3-story aerodynamic modular monolith constructed of 134 ISO containers on 24 steel pilings to prevent katabatic snowdrift accumulation.",
    equipment: ["Mission Operations Center", "Pressurized Airlock Gantry", "Infirmary & Telemedicine Suite", "HVAC Air Recirculation Matrix"]
  },
  {
    id: "isro-earth-station",
    label: "ISRO Earth Station Radome",
    pos: [-14, 4.2, -6],
    category: "SPACE & SATELLITE COMMUNICATIONS",
    status: "ACTIVE TRACKING (IMGEOS)",
    temp: "+18.5°C",
    power: "28.5 kW Load",
    description: "National Remote Sensing Centre (NRSC / ISRO) ground station downlinking high-rate satellite telemetry from Cartosat, Oceansat, and RISAT constellations.",
    equipment: ["7.5m S/X-Band Tracking Dish", "Cryo-cooled Low Noise Amplifiers", "Ultra-High-Speed Fiber Terminal", "Geodesic RF Radome Enclosure"]
  },
  {
    id: "helipad",
    label: "Helipad & Flight Deck",
    pos: [16, 1.2, 8],
    category: "AVIATION & LOGISTICS",
    status: "ACTIVE / LANDING CLEAR",
    temp: "-10.4°C",
    power: "2.8 kW Lighting",
    description: "Raised circular aviation deck engineered for severe maritime katabatic winds, equipped with green omnidirectional perimeter lighting and foam fire monitors.",
    equipment: ["Antarctic Search & Rescue Helicopter", "Automated De-Icing Runway Grid", "Aviation Fuel Hydrant Pit", "Omnidirectional Runway Beacons"]
  },
  {
    id: "power-plant",
    label: "Power Generation Plant",
    pos: [-12, 2.5, 8],
    category: "ENERGY & MICROGRID",
    status: "OPTIMAL (3/3 CHP ONLINE)",
    temp: "72.1°C",
    power: "160 kW Gen",
    description: "Triple Combined Heat & Power (CHP) co-generation facility utilizing Arctic-grade diesel with 85% thermal heat recovery into station water loop.",
    equipment: ["Scania 100 kVA Co-gen #1", "Scania 100 kVA Co-gen #2", "Scania 100 kVA Standby #3", "Plate Heat Exchanger Manifold"]
  },
  {
    id: "fuel-storage",
    label: "Fuel Storage Farm",
    pos: [-14, 2.8, 16],
    category: "RESERVES & LOGISTICS",
    status: "NORMAL (82% CAPACITY)",
    temp: "-2.8°C",
    power: "1.8 kW Tracing",
    description: "Double-walled insulated bulk fuel tank farm storing 120,000L of Jet A-1 / ATF-50 with automated electronic leak detection and heat-traced pumping.",
    equipment: ["Tank #1 (30,000L ATF-50)", "Tank #2 (30,000L ATF-50)", "Tank #3 (30,000L ATF-50)", "Tank #4 (30,000L ATF-50)"]
  },
  {
    id: "research-labs",
    label: "Research Laboratories",
    pos: [8, 5, -4],
    category: "SCIENTIFIC RESEARCH",
    status: "CALIBRATED & RECORDING",
    temp: "+20.5°C",
    power: "22 kW Load",
    description: "Advanced laboratories for polar microbiology, atmospheric aerosol profiling, glaciological ice-core analysis, and Southern Ocean biogeochemistry.",
    equipment: ["Spectroradiometer Profiler", "Clean Air Aerosol Sampler", "Cryogenic Ice Core Vault", "Liquid Nitrogen Generator"]
  },
  {
    id: "living-modules",
    label: "Living Modules",
    pos: [0, 3.8, 0],
    category: "LIFE SUPPORT & CREW",
    status: "CLIMATE CONTROLLED",
    temp: "+21.8°C",
    power: "32 kW Load",
    description: "24 individual heated acoustic-insulated sleeping cabins, mess hall, lounge, sauna, gym, and medical surgery for overwintering expeditions.",
    equipment: ["Freshwater Reverse Osmosis Loop", "Acoustic Barrier Cladding", "Emergency Oxygen Cascade", "Hydroponic Salad Farm"]
  },
  {
    id: "met-mast",
    label: "Meteorological Mast",
    pos: [18, 4.5, -12],
    category: "SYNOPTIC WEATHER",
    status: "TRANSMITTING (WMO 89512)",
    temp: "-10.4°C",
    power: "0.6 kW",
    description: "15m WMO synoptic tower monitoring Larsemann Hills maritime weather, katabatic wind shear, surface ozone, and solar UV radiation.",
    equipment: ["Ultrasonic 3D Wind Vector Sensor", "Chilled-Mirror Hygrometer", "Net Solar Radiometer", "Barometric Pressure Transducer"]
  }
];

// -------------------------------------------------------------
// STATION 3D MODEL BUILDER CLASS
// -------------------------------------------------------------

export class StationModelBuilder {
  constructor(scene) {
    this.scene = scene;
    this.currentStationId = null;
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    this.moduleGroups = new Map();
    this.equipmentMeshes = new Map();
    this.originalPositions = new Map();
    this.originalMaterials = new Map();

    this.rotors = []; // Rotors that spin every frame
    this.beacons = []; // Beacons that pulse

    this.isExploded = false;
    this.isXRay = false;
    this.isolatedSubsystem = null;
  }

  clear() {
    while (this.rootGroup.children.length > 0) {
      const obj = this.rootGroup.children[0];
      this.rootGroup.remove(obj);
      obj.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
    }
    this.moduleGroups.clear();
    this.equipmentMeshes.clear();
    this.originalPositions.clear();
    this.originalMaterials.clear();
    this.rotors = [];
    this.beacons = [];
    this.isExploded = false;
    this.isXRay = false;
    this.isolatedSubsystem = null;
  }

  buildStation(stationId = 'MAITRI') {
    this.clear();
    this.currentStationId = stationId.toUpperCase();

    if (this.currentStationId === 'BHARATI') {
      this.buildBharatiStation();
    } else {
      this.buildMaitriStation();
    }

    // Cache original transforms
    this.rootGroup.traverse((child) => {
      if (child.isMesh) {
        this.originalPositions.set(child.uuid, child.position.clone());
        this.originalMaterials.set(child.uuid, child.material);
      }
    });

    return this.rootGroup;
  }

  // Update animated parts (rotors, beacons) on every animation frame
  updateAnimations(delta = 0.016) {
    // Spin helicopter rotors
    for (const r of this.rotors) {
      r.rotation.y += delta * 5;
    }
    // Pulse beacons
    const time = Date.now() * 0.003;
    for (const b of this.beacons) {
      if (b.material && b.material.emissiveIntensity !== undefined) {
        b.material.emissiveIntensity = 0.8 + Math.sin(time) * 0.6;
      }
    }
  }

  // -------------------------------------------------------------
  // MAITRI STATION 3D MODEL (Schirmacher Oasis, 70°45'S, 11°44'E)
  // -------------------------------------------------------------
  buildMaitriStation() {
    const maitriGroup = new THREE.Group();
    maitriGroup.name = 'MAITRI_STATION_ROOT';

    const maitriTex = createMaitriStationTexture();
    const helipadTex = createHelipadMaitriTexture();

    // 1. Distant Mountain Nunataks (Oie)
    const nunatakGeo = new THREE.BufferGeometry();
    const nPeaks = 40;
    const nunatakPositions = [];
    for (let i = 0; i < nPeaks; i++) {
      const angle = (i / nPeaks) * Math.PI * 1.4 + 0.8;
      const dist = 65 + Math.sin(i * 1.7) * 12;
      const x = Math.cos(angle) * dist;
      const z = -Math.sin(angle) * dist - 10;
      const peakH = 18 + Math.sin(i * 2.3) * 10 + Math.cos(i * 0.9) * 6;
      nunatakPositions.push(
        x - 4, 0, z - 4,
        x, peakH, z,
        x + 4, 0, z + 4
      );
    }
    nunatakGeo.setAttribute('position', new THREE.Float32BufferAttribute(nunatakPositions, 3));
    nunatakGeo.computeVertexNormals();
    const nunatakMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.65,
      metalness: 0.1,
      emissive: 0xffedd5,
      emissiveIntensity: 0.15
    });
    const nunatakMesh = new THREE.Mesh(nunatakGeo, nunatakMat);
    nunatakMesh.position.set(0, -0.5, 0);
    maitriGroup.add(nunatakMesh);

    // 2. Arctic Snow Ground & Station Plateau
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.05, 0);
    ground.receiveShadow = true;
    maitriGroup.add(ground);

    const plateauGeo = new THREE.PlaneGeometry(50, 42);
    const plateauMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.8, metalness: 0.05 });
    const plateau = new THREE.Mesh(plateauGeo, plateauMat);
    plateau.rotation.x = -Math.PI / 2;
    plateau.position.set(0, 0.01, 0);
    plateau.receiveShadow = true;
    maitriGroup.add(plateau);

    // 3. Main Central Building Block (at [-1, 0, -3])
    const mainGroup = new THREE.Group();
    mainGroup.position.set(-1, 0, -3);

    const mainHullGeo = new THREE.BoxGeometry(9.5, 4, 6);
    const mainHullMat = new THREE.MeshStandardMaterial({ map: maitriTex, roughness: 0.3, metalness: 0.3 });
    const mainHull = new THREE.Mesh(mainHullGeo, mainHullMat);
    mainHull.position.set(0, 2, 0);
    mainHull.castShadow = true;
    mainHull.receiveShadow = true;
    mainHull.userData = { assetId: 'main-building', subsystem: 'COMMAND & RESIDENTIAL', name: 'Main Building' };
    this.equipmentMeshes.set('main-building', mainHull);
    mainGroup.add(mainHull);

    const mainRoofGeo = new THREE.BoxGeometry(9.7, 0.15, 6.2);
    const mainRoofMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    const mainRoof = new THREE.Mesh(mainRoofGeo, mainRoofMat);
    mainRoof.position.set(0, 4.05, 0);
    mainRoof.castShadow = true;
    mainGroup.add(mainRoof);

    // HVAC Units on roof
    const hvacMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const hvac1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), hvacMat);
    hvac1.position.set(-2.5, 4.4, 1.2);
    hvac1.castShadow = true;
    mainGroup.add(hvac1);

    const hvac2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1), hvacMat);
    hvac2.position.set(2.5, 4.4, -1.2);
    hvac2.castShadow = true;
    mainGroup.add(hvac2);

    maitriGroup.add(mainGroup);

    // 4. Research Lab Annex (at [3, 0, 5])
    const labGroup = new THREE.Group();
    labGroup.position.set(3, 0, 5);

    const labHull = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 3.6, 4.8),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4, metalness: 0.4 })
    );
    labHull.position.set(0, 1.8, 0);
    labHull.castShadow = true;
    labHull.receiveShadow = true;
    labHull.userData = { assetId: 'research-lab', subsystem: 'SCIENCE & SENSORS', name: 'Research Lab' };
    this.equipmentMeshes.set('research-lab', labHull);
    labGroup.add(labHull);

    const labRoof = new THREE.Mesh(
      new THREE.BoxGeometry(7.3, 0.15, 4.9),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    labRoof.position.set(0, 3.65, 0);
    labRoof.castShadow = true;
    labGroup.add(labRoof);

    maitriGroup.add(labGroup);

    // 5. Living Quarters Modules (at [9, 0, 0])
    const livingGroup = new THREE.Group();
    livingGroup.position.set(9, 0, 0);
    [-1.5, 1.5].forEach((zOffset) => {
      const livingMod = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 2.2, 2.2),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.3 })
      );
      livingMod.position.set(0, 1.1, zOffset);
      livingMod.castShadow = true;
      livingMod.receiveShadow = true;
      livingMod.userData = { assetId: 'living-quarters', subsystem: 'LIFE SUPPORT', name: 'Living Quarters' };
      this.equipmentMeshes.set('living-quarters', livingMod);
      livingGroup.add(livingMod);
    });
    const vestMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.8, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    vestMesh.position.set(0, 0.9, 0);
    vestMesh.castShadow = true;
    livingGroup.add(vestMesh);
    maitriGroup.add(livingGroup);

    // 6. Heated Fuel Tank Farm (Cie at [-9, 0, -9])
    const fuelGroup = this.buildFuelStorageFarm(new THREE.Vector3(-9, 0, -9), 6.5);
    fuelGroup.userData = { assetId: 'fuel-storage', subsystem: 'LOGISTICS & RESERVES', name: 'Fuel Storage' };
    this.equipmentMeshes.set('fuel-storage', fuelGroup);
    maitriGroup.add(fuelGroup);

    // 7. Co-Gen Power Plant Block (at [-10, 0, 4])
    const powerGroup = new THREE.Group();
    powerGroup.position.set(-10, 0, 4);

    const powerHull = new THREE.Mesh(
      new THREE.BoxGeometry(6, 3.2, 4.2),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.6 })
    );
    powerHull.position.set(0, 1.6, 0);
    powerHull.castShadow = true;
    powerHull.receiveShadow = true;
    powerHull.userData = { assetId: 'power-plant', subsystem: 'ENERGY & MICROGRID', name: 'Power Plant' };
    this.equipmentMeshes.set('power-plant', powerHull);
    powerGroup.add(powerHull);

    // 4 exhaust chimneys
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    [-1.5, -0.5, 0.5, 1.5].forEach((xOff) => {
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.4, 8), chimneyMat);
      chimney.position.set(xOff, 3.8, -1);
      chimney.castShadow = true;
      powerGroup.add(chimney);
    });
    maitriGroup.add(powerGroup);

    // 8. 13m Lattice Communication Mast (Pie at [-16, 0, -1])
    const commsGroup = this.buildLatticeMast(new THREE.Vector3(-16, 0, -1), 13);
    commsGroup.userData = { assetId: 'comms-tower', subsystem: 'TELECOMMUNICATIONS', name: 'Communication Tower' };
    this.equipmentMeshes.set('comms-tower', commsGroup);
    maitriGroup.add(commsGroup);

    // 9. Helipad & Flight Deck (at [15, 0, -6])
    const heliDeckGroup = new THREE.Group();
    heliDeckGroup.position.set(15, 0, -6);

    const helipadMesh = new THREE.Mesh(
      new THREE.CircleGeometry(5.8, 32),
      new THREE.MeshStandardMaterial({ map: helipadTex, roughness: 0.8 })
    );
    helipadMesh.rotation.x = -Math.PI / 2;
    helipadMesh.position.set(0, 0.04, 0);
    helipadMesh.receiveShadow = true;
    helipadMesh.userData = { assetId: 'helipad', subsystem: 'AVIATION & LOGISTICS', name: 'Helipad' };
    this.equipmentMeshes.set('helipad', helipadMesh);
    heliDeckGroup.add(helipadMesh);

    // 8 perimeter green lights
    const greenLightMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.5
    });
    [0, 45, 90, 135, 180, 225, 270, 315].forEach((deg) => {
      const rad = (deg * Math.PI) / 180;
      const lx = Math.cos(rad) * 5.6;
      const lz = Math.sin(rad) * 5.6;
      const lightPin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 8), greenLightMat);
      lightPin.position.set(lx, 0.12, lz);
      heliDeckGroup.add(lightPin);
    });

    // Parked Red Rescue Helicopter (jie)
    const redHeli = this.buildHelicopter(new THREE.Vector3(0, 0, 0), -0.4, 0xdc2626);
    heliDeckGroup.add(redHeli);
    maitriGroup.add(heliDeckGroup);

    // 10. Satellite Dome / Weather Station (Rie at [4, 0, -8])
    const satDomeGroup = new THREE.Group();
    satDomeGroup.position.set(4, 0, -8);
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.5, 2.4, 12),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6, metalness: 0.5 })
    );
    pedestal.position.set(0, 1.2, 0);
    pedestal.castShadow = true;
    satDomeGroup.add(pedestal);

    const domeSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 })
    );
    domeSphere.position.set(0, 2.8, 0);
    domeSphere.castShadow = true;
    satDomeGroup.add(domeSphere);
    maitriGroup.add(satDomeGroup);

    // 11. Meteorological Mast (at [19, 0, 6])
    const metGroup = new THREE.Group();
    metGroup.position.set(19, 0, 6);
    const metPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.1, 7, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    metPole.position.set(0, 3.5, 0);
    metPole.castShadow = true;
    metGroup.add(metPole);

    const amberBeaconMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8
    });
    const amberBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), amberBeaconMat);
    amberBeacon.position.set(0, 7.1, 0);
    metGroup.add(amberBeacon);
    this.beacons.push(amberBeacon);

    metGroup.userData = { assetId: 'met-mast', subsystem: 'ATMOSPHERIC SENSING', name: 'Meteorological Mast' };
    this.equipmentMeshes.set('met-mast', metGroup);
    maitriGroup.add(metGroup);

    // 12. Parked PistenBully Snow Vehicles (i2)
    maitriGroup.add(this.buildSnowVehicle(new THREE.Vector3(-3.5, 0, 2.5), 0.6, 0xdc2626)); // Red
    maitriGroup.add(this.buildSnowVehicle(new THREE.Vector3(5, 0, -2.5), -0.3, 0x2563eb)); // Blue
    maitriGroup.add(this.buildSnowVehicle(new THREE.Vector3(-12, 0, 8), 1.4, 0xea580c)); // Orange

    this.rootGroup.add(maitriGroup);
  }

  // -------------------------------------------------------------
  // BHARATI STATION 3D MODEL (Larsemann Hills, 69°24'S, 76°11'E)
  // -------------------------------------------------------------
  buildBharatiStation() {
    const bharatiGroup = new THREE.Group();
    bharatiGroup.name = 'BHARATI_STATION_ROOT';

    const bharatiTex = createBharatiStationTexture();
    const helipadTex = createHelipadBharatiTexture();

    // 1. Coastal Terrain & Southern Ocean with Tabular Icebergs (zie)
    const coastalGroup = new THREE.Group();

    // 24 rocky moraine outcrops
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95, metalness: 0.1 });
    for (let n = 0; n < 24; n++) {
      const angle = (n / 24) * Math.PI * 2;
      const radius = 32 + (n % 5) * 6;
      const rx = Math.cos(angle) * radius;
      const rz = Math.sin(angle) * radius;
      const s0 = 3 + (n % 4) * 2;
      const s1 = 2 + (n % 3) * 1.5;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s0 * 0.6, 1), rockMat);
      rock.position.set(rx, s1 / 2 - 0.5, rz);
      rock.rotation.y = n * 0.4;
      rock.castShadow = true;
      rock.receiveShadow = true;
      coastalGroup.add(rock);
    }

    // Ocean plane
    const oceanGeo = new THREE.PlaneGeometry(140, 50);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.92
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(0, -0.35, -45);
    ocean.receiveShadow = true;
    coastalGroup.add(ocean);

    // 5 Tabular Icebergs floating on the ocean
    const icebergMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.3, metalness: 0.1 });
    const icebergs = [
      [-25, -0.1, -40, 8, 3, 10],
      [5, -0.1, -48, 12, 4, 14],
      [32, -0.1, -38, 7, 2.5, 8],
      [-12, -0.1, -55, 15, 5, 18],
      [20, -0.1, -52, 9, 3.2, 11]
    ];
    for (const [ix, iy, iz, iw, ih, id] of icebergs) {
      const berg = new THREE.Mesh(new THREE.BoxGeometry(iw, ih, id), icebergMat);
      berg.position.set(ix, iy + ih / 2, iz);
      berg.castShadow = true;
      berg.receiveShadow = true;
      coastalGroup.add(berg);
    }
    bharatiGroup.add(coastalGroup);

    // Ground Snow Field & Station Foundation Pad
    const groundGeo = new THREE.PlaneGeometry(130, 130);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.05, 0);
    ground.receiveShadow = true;
    bharatiGroup.add(ground);

    const padGeo = new THREE.PlaneGeometry(65, 50);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85, metalness: 0.1 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, 0.01, 0);
    pad.receiveShadow = true;
    bharatiGroup.add(pad);

    // 2. Main Station Monolith Complex (Elevated 3-story hull on 20 pilings)
    const mainStation = new THREE.Group();
    mainStation.position.set(0, 0, 0);

    // 20 steel pilings on concrete foundations
    const footingMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const stiltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const stiltCapMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });

    const pilingsCoords = [
      [-6.5, -4.5], [-3.5, -4.5], [0, -4.5], [3.5, -4.5], [6.5, -4.5],
      [-6.5, -1.5], [-3.5, -1.5], [0, -1.5], [3.5, -1.5], [6.5, -1.5],
      [-6.5, 1.5], [-3.5, 1.5], [0, 1.5], [3.5, 1.5], [6.5, 1.5],
      [-6.5, 4.5], [-3.5, 4.5], [0, 4.5], [3.5, 4.5], [6.5, 4.5]
    ];
    for (const [px, pz] of pilingsCoords) {
      const pGroup = new THREE.Group();
      pGroup.position.set(px, 0, pz);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.7), footingMat);
      foot.position.set(0, 0.2, 0);
      foot.castShadow = true;
      foot.receiveShadow = true;
      pGroup.add(foot);

      const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 2.2, 8), stiltMat);
      stilt.position.set(0, 1.3, 0);
      stilt.castShadow = true;
      pGroup.add(stilt);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.5), stiltCapMat);
      cap.position.set(0, 2.3, 0);
      cap.castShadow = true;
      pGroup.add(cap);

      mainStation.add(pGroup);
    }

    // Diagonal stilt cross braces
    const braceMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
    [-5, 0, 5].forEach((bx) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(bx, 1.2, 0);

      const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.4, 6), braceMat);
      b1.rotation.z = 0.4;
      b1.position.set(-0.7, 0, 0);
      bGroup.add(b1);

      const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.4, 6), braceMat);
      b2.rotation.z = -0.4;
      b2.position.set(0.7, 0, 0);
      bGroup.add(b2);

      mainStation.add(bGroup);
    });

    // Main station hull (15 x 3.6 x 10.5) mapped with canvas texture
    const hullMesh = new THREE.Mesh(
      new THREE.BoxGeometry(15, 3.6, 10.5),
      new THREE.MeshStandardMaterial({ map: bharatiTex, roughness: 0.35, metalness: 0.25 })
    );
    hullMesh.position.set(0, 4.2, 0);
    hullMesh.castShadow = true;
    hullMesh.receiveShadow = true;
    hullMesh.userData = { assetId: 'main-complex', subsystem: 'INTEGRATED COMMAND & LIVING', name: 'Main Station Complex' };
    this.equipmentMeshes.set('main-complex', hullMesh);
    mainStation.add(hullMesh);

    // Angled aerodynamic front and rear cladding strips
    const aeroMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.3, metalness: 0.3 });
    const aeroFront = new THREE.Mesh(new THREE.BoxGeometry(14.8, 3.4, 0.3), aeroMat);
    aeroFront.position.set(0, 4.2, 5.35);
    aeroFront.rotation.x = 0.2;
    aeroFront.castShadow = true;
    mainStation.add(aeroFront);

    const aeroRear = new THREE.Mesh(new THREE.BoxGeometry(14.8, 3.4, 0.3), aeroMat);
    aeroRear.position.set(0, 4.2, -5.35);
    aeroRear.rotation.x = -0.2;
    aeroRear.castShadow = true;
    mainStation.add(aeroRear);

    // 3rd floor upper command & observation deck
    const deckHull = new THREE.Mesh(
      new THREE.BoxGeometry(11, 1.2, 7),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 })
    );
    deckHull.position.set(0, 6.3, 0);
    deckHull.castShadow = true;
    deckHull.receiveShadow = true;
    deckHull.userData = { assetId: 'living-modules', subsystem: 'LIFE SUPPORT & CREW', name: 'Living Modules' };
    this.equipmentMeshes.set('living-modules', deckHull);
    mainStation.add(deckHull);

    // Panoramic Sky-Blue Windows front and rear
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    const winFront = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.8, 0.08), windowMat);
    winFront.position.set(0, 6.3, 3.52);
    mainStation.add(winFront);

    const winRear = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.8, 0.08), windowMat);
    winRear.position.set(0, 6.3, -3.52);
    mainStation.add(winRear);

    // 3 Tilted Rooftop Solar Arrays
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.7 });
    [-3.5, 0, 3.5].forEach((sx) => {
      const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 4.5), solarMat);
      solarPanel.position.set(sx, 7, 0);
      solarPanel.rotation.x = 0.2;
      solarPanel.castShadow = true;
      mainStation.add(solarPanel);
    });

    // Aerodynamic entrance gantry ramp (at [7.8, 1.2, 2])
    const gantryGroup = new THREE.Group();
    gantryGroup.position.set(7.8, 1.2, 2);

    const rampMesh = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.15, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 })
    );
    rampMesh.position.set(0, 0.8, 0);
    rampMesh.rotation.z = -0.4;
    rampMesh.castShadow = true;
    gantryGroup.add(rampMesh);

    const railMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
    [-0.65, 0.65].forEach((rz) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.05, 0.05), railMat);
      rail.position.set(0, 1.2, rz);
      rail.rotation.z = -0.4;
      gantryGroup.add(rail);
    });
    mainStation.add(gantryGroup);

    bharatiGroup.add(mainStation);

    // 3. ISRO Earth Station Radome & Tracking Dish (Fie at [-14, 0, -6])
    const isroGroup = this.buildISROEarthStation(new THREE.Vector3(-14, 0, -6));
    isroGroup.userData = { assetId: 'isro-earth-station', subsystem: 'SPACE & SATELLITE COMMUNICATIONS', name: 'ISRO Earth Station Radome' };
    this.equipmentMeshes.set('isro-earth-station', isroGroup);
    bharatiGroup.add(isroGroup);

    // 4. Helipad & Flight Deck (at [16, 0, 8])
    const flightDeckGroup = new THREE.Group();
    flightDeckGroup.position.set(16, 0, 8);

    const heliCircle = new THREE.Mesh(
      new THREE.CircleGeometry(6.2, 32),
      new THREE.MeshStandardMaterial({ map: helipadTex, roughness: 0.8 })
    );
    heliCircle.rotation.x = -Math.PI / 2;
    heliCircle.position.set(0, 0.06, 0);
    heliCircle.receiveShadow = true;
    heliCircle.userData = { assetId: 'helipad', subsystem: 'AVIATION & LOGISTICS', name: 'Helipad & Flight Deck' };
    this.equipmentMeshes.set('helipad', heliCircle);
    flightDeckGroup.add(heliCircle);

    // 8 perimeter green guidance lights
    const greenHeliMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.8
    });
    [0, 45, 90, 135, 180, 225, 270, 315].forEach((deg) => {
      const rad = (deg * Math.PI) / 180;
      const lx = Math.cos(rad) * 6;
      const lz = Math.sin(rad) * 6;
      const lightPin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.22, 8), greenHeliMat);
      lightPin.position.set(lx, 0.15, lz);
      flightDeckGroup.add(lightPin);
    });

    // Parked Blue Antarctic Helicopter (Uie)
    const blueHeli = this.buildHelicopter(new THREE.Vector3(0, 0.1, 0), -0.5, 0x0284c7);
    flightDeckGroup.add(blueHeli);
    bharatiGroup.add(flightDeckGroup);

    // 5. Power Generation Plant (at [-12, 0, 8])
    const powerGenGroup = new THREE.Group();
    powerGenGroup.position.set(-12, 0, 8);

    const powerGenHull = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 3.6, 4.8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.6 })
    );
    powerGenHull.position.set(0, 1.8, 0);
    powerGenHull.castShadow = true;
    powerGenHull.receiveShadow = true;
    powerGenHull.userData = { assetId: 'power-plant', subsystem: 'ENERGY & MICROGRID', name: 'Power Generation Plant' };
    this.equipmentMeshes.set('power-plant', powerGenHull);
    powerGenGroup.add(powerGenHull);

    // 3 generator exhaust chimneys with conical rain cowls
    const bChimneyMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    const bCowlMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    [-1.5, 0, 1.5].forEach((cx) => {
      const cGroup = new THREE.Group();
      cGroup.position.set(cx, 4.3, -1);

      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.8, 8), bChimneyMat);
      stack.castShadow = true;
      cGroup.add(stack);

      const cowl = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.15, 8), bCowlMat);
      cowl.position.set(0, 0.95, 0);
      cGroup.add(cowl);

      powerGenGroup.add(cGroup);
    });
    bharatiGroup.add(powerGenGroup);

    // 6. Bulk Fuel Storage Farm (Bie at [-14, 0, 16])
    const fuelFarmGroup = this.buildFuelStorageFarm(new THREE.Vector3(-14, 0, 16), 6.8);
    fuelFarmGroup.userData = { assetId: 'fuel-storage', subsystem: 'RESERVES & LOGISTICS', name: 'Fuel Storage Farm' };
    this.equipmentMeshes.set('fuel-storage', fuelFarmGroup);
    bharatiGroup.add(fuelFarmGroup);

    // 7. Research Laboratories Annex (at [8, 0, -4])
    const researchGroup = new THREE.Group();
    researchGroup.position.set(8, 0, -4);
    const labBox = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 3.2, 4.5),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.4 })
    );
    labBox.position.set(0, 1.6, 0);
    labBox.castShadow = true;
    labBox.receiveShadow = true;
    labBox.userData = { assetId: 'research-labs', subsystem: 'SCIENTIFIC RESEARCH', name: 'Research Laboratories' };
    this.equipmentMeshes.set('research-labs', labBox);
    researchGroup.add(labBox);
    bharatiGroup.add(researchGroup);

    // 8. Meteorological & Communication Mast (at [18, 0, -12])
    const metCommsGroup = new THREE.Group();
    metCommsGroup.position.set(18, 0, -12);

    const bMetPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.12, 9, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    bMetPole.position.set(0, 4.5, 0);
    bMetPole.castShadow = true;
    metCommsGroup.add(bMetPole);

    const bAmberBeacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1.2 })
    );
    bAmberBeacon.position.set(0, 9.2, 0);
    metCommsGroup.add(bAmberBeacon);
    this.beacons.push(bAmberBeacon);

    const beaconLight = new THREE.PointLight(0xf59e0b, 1.5, 10);
    beaconLight.position.set(0, 9.2, 0);
    metCommsGroup.add(beaconLight);

    metCommsGroup.userData = { assetId: 'met-mast', subsystem: 'SYNOPTIC WEATHER', name: 'Meteorological Mast' };
    this.equipmentMeshes.set('met-mast', metCommsGroup);
    bharatiGroup.add(metCommsGroup);

    // 9. 3 Parked PistenBully Snow Vehicles (a2)
    bharatiGroup.add(this.buildSnowVehicle(new THREE.Vector3(5, 0, 7), 0.4, 0x0284c7)); // Blue
    bharatiGroup.add(this.buildSnowVehicle(new THREE.Vector3(-3, 0, 8), -0.2, 0xdc2626)); // Red
    bharatiGroup.add(this.buildSnowVehicle(new THREE.Vector3(9, 0, -8), 1.2, 0xf97316)); // Orange

    this.rootGroup.add(bharatiGroup);
  }

  // -------------------------------------------------------------
  // HELPER MESH GENERATORS (Helicopter, Radome, Tanks, Mast, Snowcat)
  // -------------------------------------------------------------

  // Helicopter with spinning rotor (jie & Uie)
  buildHelicopter(position, rotationY = -0.3, bodyColor = 0xdc2626) {
    const heliGroup = new THREE.Group();
    heliGroup.position.copy(position);
    heliGroup.rotation.y = rotationY;

    // Fuselage
    const fuselage = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.8, 2.4),
      new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.4 })
    );
    fuselage.position.set(0, 0.7, 0);
    fuselage.castShadow = true;
    heliGroup.add(fuselage);

    // Cockpit windscreen
    const cockpit = new THREE.Mesh(
      new THREE.ConeGeometry(0.55, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.8 })
    );
    cockpit.position.set(0, 0.65, 1.4);
    cockpit.rotation.x = Math.PI / 2;
    cockpit.castShadow = true;
    heliGroup.add(cockpit);

    // Tail boom
    const tailBoom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.22, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    tailBoom.position.set(0, 0.8, -1.8);
    tailBoom.rotation.x = 0.08;
    tailBoom.castShadow = true;
    heliGroup.add(tailBoom);

    // Tail fin
    const tailFin = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.7, 0.4),
      new THREE.MeshStandardMaterial({ color: bodyColor })
    );
    tailFin.position.set(0, 1.1, -2.6);
    tailFin.castShadow = true;
    heliGroup.add(tailFin);

    // Landing skids
    const skidMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8 });
    [-0.55, 0.55].forEach((sx) => {
      const skidGroup = new THREE.Group();
      skidGroup.position.set(sx, 0.1, 0);

      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 8), skidMat);
      tube.rotation.x = Math.PI / 2;
      skidGroup.add(tube);

      const strut1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6), skidMat);
      strut1.position.set(0, 0.3, 0.5);
      strut1.rotation.z = (sx > 0 ? -1 : 1) * 0.2;
      skidGroup.add(strut1);

      const strut2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6), skidMat);
      strut2.position.set(0, 0.3, -0.5);
      strut2.rotation.z = (sx > 0 ? -1 : 1) * 0.2;
      skidGroup.add(strut2);

      heliGroup.add(skidGroup);
    });

    // Rotor Mast & Spinning Blades
    const rotorMastGroup = new THREE.Group();
    rotorMastGroup.position.set(0, 1.15, 0.2);

    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8),
      new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.9 })
    );
    rotorMastGroup.add(mast);

    const rotorBlades = new THREE.Group();
    rotorBlades.position.set(0, 0.16, 0);

    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.5 });
    const blade1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 4.4), bladeMat);
    rotorBlades.add(blade1);

    const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 4.4), bladeMat);
    blade2.rotation.y = Math.PI / 2;
    rotorBlades.add(blade2);

    rotorMastGroup.add(rotorBlades);
    heliGroup.add(rotorMastGroup);

    this.rotors.push(rotorBlades);
    return heliGroup;
  }

  // Steel Lattice Communication Mast (Pie)
  buildLatticeMast(position, height = 12) {
    const mastGroup = new THREE.Group();
    mastGroup.position.copy(position);

    // 4 vertical corner stanchions
    [[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]].forEach(([lx, lz], i) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.1, height, 6),
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0xef4444 : 0xffffff,
          metalness: 0.8,
          roughness: 0.3
        })
      );
      leg.position.set(lx * 0.6, height / 2, lz * 0.6);
      leg.castShadow = true;
      mastGroup.add(leg);
    });

    // Horizontal & diagonal lattice braces
    [2, 4, 6, 8, 10, 11.5].forEach((h, r) => {
      const brace = new THREE.Mesh(
        new THREE.BoxGeometry(1.2 * (1 - h / 16), 0.06, 0.06),
        new THREE.MeshStandardMaterial({ color: r % 2 === 0 ? 0xffffff : 0xef4444, metalness: 0.7 })
      );
      brace.position.set(0, h, 0);
      brace.rotation.y = (r % 2) * (Math.PI / 4);
      mastGroup.add(brace);
    });

    // Microwave dish
    const dish = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.1, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.6, side: THREE.DoubleSide })
    );
    dish.position.set(0.4, height * 0.7, 0);
    dish.rotation.set(0, 0.8, -0.2);
    mastGroup.add(dish);

    // Aviation Red Warning Beacon + Light
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 1.2 })
    );
    beacon.position.set(0, height + 0.3, 0);
    mastGroup.add(beacon);
    this.beacons.push(beacon);

    const light = new THREE.PointLight(0xff2222, 2.5, 15);
    light.position.set(0, height + 0.3, 0);
    mastGroup.add(light);

    return mastGroup;
  }

  // Bulk Fuel Storage Farm with 4 Dome-Capped Tanks (Cie & Bie)
  buildFuelStorageFarm(position, padSize = 6.5) {
    const farmGroup = new THREE.Group();
    farmGroup.position.copy(position);

    const tankMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.4 });
    const domeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.5 });
    const gaugeMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });

    const tankPositions = [
      [-1.8, -1.8, 1.4],
      [1.8, -1.8, 1.4],
      [-1.8, 1.8, 1.4],
      [1.8, 1.8, 1.4]
    ];

    for (const [tx, tz, radius] of tankPositions) {
      const tGroup = new THREE.Group();
      tGroup.position.set(tx, 0, tz);

      // Tank cylinder body
      const tankBody = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 3.6, 24), tankMat);
      tankBody.position.set(0, 1.8, 0);
      tankBody.castShadow = true;
      tankBody.receiveShadow = true;
      tGroup.add(tankBody);

      // Spherical dome roof
      const tankDome = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 0.98, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        domeMat
      );
      tankDome.position.set(0, 3.6, 0);
      tankDome.castShadow = true;
      tGroup.add(tankDome);

      // Vertical level gauge strip
      const gauge = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.6, 0.04), gaugeMat);
      gauge.position.set(0, 1.8, radius + 0.05);
      tGroup.add(gauge);

      farmGroup.add(tGroup);
    }

    // Interconnecting pipe manifolds
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const pipeX = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.2, 8), pipeMat);
    pipeX.position.set(0, 0.6, 0);
    pipeX.rotation.z = Math.PI / 2;
    farmGroup.add(pipeX);

    const pipeZ = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.2, 8), pipeMat);
    pipeZ.position.set(0, 0.6, 0);
    pipeZ.rotation.x = Math.PI / 2;
    farmGroup.add(pipeZ);

    // Containment foundation pad
    const bundPad = new THREE.Mesh(
      new THREE.BoxGeometry(padSize, 0.1, padSize),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 })
    );
    bundPad.position.set(0, 0.05, 0);
    bundPad.receiveShadow = true;
    farmGroup.add(bundPad);

    return farmGroup;
  }

  // ISRO Earth Station Radome & Parabolic Tracking Dish (Fie)
  buildISROEarthStation(position) {
    const isroGroup = new THREE.Group();
    isroGroup.position.copy(position);

    // Support pedestal
    const radomeBaseGroup = new THREE.Group();
    radomeBaseGroup.position.set(-2.5, 0, 0);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.5, 2.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7, metalness: 0.2 })
    );
    pedestal.position.set(0, 1.2, 0);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    radomeBaseGroup.add(pedestal);

    // Geodesic RF Radome sphere
    const radomeSphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 28, 28),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1 })
    );
    radomeSphere.position.set(0, 3.8, 0);
    radomeSphere.castShadow = true;
    radomeBaseGroup.add(radomeSphere);

    const footingRing = new THREE.Mesh(
      new THREE.CylinderGeometry(2.8, 2.8, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 })
    );
    footingRing.position.set(0, 0.1, 0);
    footingRing.receiveShadow = true;
    radomeBaseGroup.add(footingRing);

    isroGroup.add(radomeBaseGroup);

    // 7.5m S/X-Band Tracking Parabolic Dish Assembly
    const dishGroup = new THREE.Group();
    dishGroup.position.set(3.2, 0, -1);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.6, 3, 12),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
    );
    post.position.set(0, 1.5, 0);
    post.castShadow = true;
    dishGroup.add(post);

    const dishHead = new THREE.Group();
    dishHead.position.set(0, 3.2, 0);
    dishHead.rotation.set(0.4, 0.8, -0.2);

    const dishMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 0.2, 0.6, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.4, roughness: 0.3, side: THREE.DoubleSide })
    );
    dishMesh.castShadow = true;
    dishHead.add(dishMesh);

    const horn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })
    );
    horn.position.set(0, 0.9, 0);
    dishHead.add(horn);

    const lnaSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8 })
    );
    lnaSphere.position.set(0, 1.5, 0);
    dishHead.add(lnaSphere);

    dishGroup.add(dishHead);
    isroGroup.add(dishGroup);

    // Auxiliary Communication Mast
    const auxGroup = new THREE.Group();
    auxGroup.position.set(1.5, 0, 3.5);

    const auxMast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.15, 5, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    auxMast.position.set(0, 2.5, 0);
    auxMast.castShadow = true;
    auxGroup.add(auxMast);

    const auxAntenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.5 })
    );
    auxAntenna.position.set(0, 4.2, 0);
    auxAntenna.rotation.y = 0.5;
    auxGroup.add(auxAntenna);

    isroGroup.add(auxGroup);
    return isroGroup;
  }

  // PistenBully Tracked Snow Vehicle (i2 & a2)
  buildSnowVehicle(position, rotationY = 0, color = 0xdc2626) {
    const snowcatGroup = new THREE.Group();
    snowcatGroup.position.copy(position);
    snowcatGroup.rotation.y = rotationY;

    // Main cabin chassis
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.6, 2.4),
      new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.3 })
    );
    cabin.position.set(0, 0.45, 0);
    cabin.castShadow = true;
    snowcatGroup.add(cabin);

    // Upper cabin
    const cabUpper = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.6, 1.2),
      new THREE.MeshStandardMaterial({ color: color, roughness: 0.4 })
    );
    cabUpper.position.set(0, 0.95, 0.3);
    cabUpper.castShadow = true;
    snowcatGroup.add(cabUpper);

    // Windshield
    const windshield = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.4, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.7 })
    );
    windshield.position.set(0, 0.95, 0.92);
    snowcatGroup.add(windshield);

    // Left & Right caterpillar tracks
    const treadMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });
    [-0.8, 0.8].forEach((tx) => {
      const tread = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 2.5), treadMat);
      tread.position.set(tx, 0.2, 0);
      tread.castShadow = true;
      snowcatGroup.add(tread);
    });

    return snowcatGroup;
  }

  // -------------------------------------------------------------
  // CAD INTERACTION & EXPLODED / X-RAY / ISOLATION MODES
  // -------------------------------------------------------------

  setExplodedView(enable) {
    this.isExploded = enable;
    const factor = enable ? 1.4 : 1.0;
    this.rootGroup.traverse((child) => {
      if (child.isMesh && this.originalPositions.has(child.uuid)) {
        const orig = this.originalPositions.get(child.uuid);
        if (enable) {
          const dir = orig.clone().normalize();
          child.position.copy(orig.clone().add(dir.multiplyScalar(factor * 2)));
        } else {
          child.position.copy(orig);
        }
      }
    });
  }

  setXRayMode(enable) {
    this.isXRay = enable;
    this.rootGroup.traverse((child) => {
      if (child.isMesh) {
        if (enable) {
          child.material.transparent = true;
          child.material.opacity = 0.35;
        } else {
          const orig = this.originalMaterials.get(child.uuid);
          if (orig) {
            child.material.transparent = orig.transparent || false;
            child.material.opacity = orig.opacity !== undefined ? orig.opacity : 1.0;
          }
        }
      }
    });
  }

  isolateSubsystem(subsystemName) {
    this.isolatedSubsystem = subsystemName;
    const isAll = !subsystemName || subsystemName === 'ALL';

    this.rootGroup.traverse((child) => {
      if (child.isMesh) {
        if (isAll) {
          const orig = this.originalMaterials.get(child.uuid);
          if (orig) {
            child.material.transparent = orig.transparent || false;
            child.material.opacity = orig.opacity !== undefined ? orig.opacity : 1.0;
          }
        } else {
          const meshSub = child.userData?.subsystem;
          if (meshSub && meshSub.toUpperCase() === subsystemName.toUpperCase()) {
            child.material.transparent = false;
            child.material.opacity = 1.0;
          } else {
            child.material.transparent = true;
            child.material.opacity = 0.2;
          }
        }
      }
    });
  }

  highlightEquipment(assetId) {
    const mesh = this.equipmentMeshes.get(assetId);
    if (!mesh) return;

    const originalEmissive = mesh.material.emissive ? mesh.material.emissive.clone() : new THREE.Color(0x000000);
    const originalIntensity = mesh.material.emissiveIntensity || 0;

    if (mesh.material.emissive) {
      mesh.material.emissive.setHex(0x38bdf8);
      mesh.material.emissiveIntensity = 1.5;
    }

    setTimeout(() => {
      if (mesh.material && mesh.material.emissive) {
        mesh.material.emissive.copy(originalEmissive);
        mesh.material.emissiveIntensity = originalIntensity;
      }
    }, 2000);
  }
}
