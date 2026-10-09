/**
 * Three.js WebGL 3D Scene Manager for Antarctic Station Digital Twin
 * Exact lighting rig, camera, and controls replicating https://www.alphaeduhub.in/
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ThreeSceneManager {
  constructor(canvasContainer, options = {}) {
    this.container = canvasContainer;
    this.options = options;
    this.onSelectObject = options.onSelectObject || null;
    this.onMeasureDistance = options.onMeasureDistance || null;
    this.onAngleChange = options.onAngleChange || null;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.modelBuilder = null; // Bound externally

    // Lighting
    this.ambientLight = null;
    this.sunLight = null;
    this.fillLight = null;
    this.isNightMode = false;
    this.currentStationId = 'MAITRI';

    // Section Clipping Planes
    this.clippingPlanes = {
      x: new THREE.Plane(new THREE.Vector3(-1, 0, 0), 100),
      y: new THREE.Plane(new THREE.Vector3(0, -1, 0), 100),
      z: new THREE.Plane(new THREE.Vector3(0, 0, -1), 100)
    };
    this.activeSectionAxis = null;

    // Measuring Tool
    this.isMeasuring = false;
    this.measureStart = null;
    this.measureLine = null;

    this.clock = new THREE.Clock();
    this.animId = null;
    this.resizeObserver = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 620;

    // 1. Scene setup with exact alphaeduhub background & fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1322);
    this.scene.fog = new THREE.Fog(0x0f1c30, 25, 80);

    // 2. Camera with FOV 42
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 500);
    this.camera.position.set(16, 18, 28);

    // 3. WebGL Renderer with ACES Filmic Tone Mapping and Soft Shadows
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.localClippingEnabled = true;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.outline = 'none';

    // 4. OrbitControls with exact polar limits
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 70;
    this.controls.maxPolarAngle = Math.PI / 2.05;
    this.controls.target.set(0, 1.5, 0);

    // 5. Lighting rig
    this.setupLighting();

    // 6. DOM Events
    this.bindEvents();

    // 7. Start Render Loop
    this.animate();
  }

  setupLighting() {
    // Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xcbd5e1, 0.9);
    this.scene.add(this.ambientLight);

    // Main Sun Directional Light
    this.sunLight = new THREE.DirectionalLight(0xfff1e6, 2.2);
    this.sunLight.position.set(35, 24, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.left = -30;
    this.sunLight.shadow.camera.right = 30;
    this.sunLight.shadow.camera.top = 30;
    this.sunLight.shadow.camera.bottom = -30;
    this.sunLight.shadow.bias = -0.0002;
    this.scene.add(this.sunLight);

    // Polar Fill Light
    this.fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.65);
    this.fillLight.position.set(-30, 18, -25);
    this.scene.add(this.fillLight);
  }

  // Switch between Maitri & Bharati Station viewports
  setStationAtmosphere(stationId) {
    this.currentStationId = stationId.toUpperCase();
    if (this.currentStationId === 'BHARATI') {
      this.scene.background.set(0x091321);
      this.scene.fog = new THREE.Fog(0x0e1d32, 30, 95);
      this.camera.position.set(28, 18, 32);
      this.controls.target.set(0, 3, 0);
    } else {
      this.scene.background.set(0x0a1322);
      this.scene.fog = new THREE.Fog(0x0f1c30, 25, 80);
      this.camera.position.set(16, 18, 28);
      this.controls.target.set(0, 1.5, 0);
    }
    this.controls.update();
  }

  setCameraPreset(presetName) {
    if (!this.camera || !this.controls) return;
    const isBharati = this.currentStationId === 'BHARATI';
    const targetY = isBharati ? 3 : 1.5;

    switch (presetName.toUpperCase()) {
      case 'ISOMETRIC':
      case 'RESET':
        if (isBharati) {
          this.camera.position.set(28, 18, 32);
        } else {
          this.camera.position.set(16, 18, 28);
        }
        this.controls.target.set(0, targetY, 0);
        break;
      case 'TOP':
        this.camera.position.set(0, 55, 0.1);
        this.controls.target.set(0, 0, 0);
        break;
      case 'FRONT':
        this.camera.position.set(0, 12, 45);
        this.controls.target.set(0, targetY, 0);
        break;
      case 'SIDE':
        this.camera.position.set(45, 12, 0);
        this.controls.target.set(0, targetY, 0);
        break;
    }
    this.controls.update();
  }

  setDayNightMode(isNight) {
    this.isNightMode = isNight;
    if (isNight) {
      this.scene.background.set(0x03060c);
      if (this.scene.fog) this.scene.fog.color.set(0x03060c);
      this.ambientLight.intensity = 0.25;
      this.sunLight.intensity = 0.4;
      this.fillLight.intensity = 0.2;
    } else {
      this.setStationAtmosphere(this.currentStationId);
      this.ambientLight.intensity = 0.9;
      this.sunLight.intensity = 2.2;
      this.fillLight.intensity = 0.65;
    }
  }

  setSectionClipping(axis, distance = 0) {
    this.activeSectionAxis = axis;
    if (!axis) {
      this.renderer.clippingPlanes = [];
      return;
    }
    const plane = this.clippingPlanes[axis];
    if (plane) {
      plane.constant = distance;
      this.renderer.clippingPlanes = [plane];
    }
  }

  toggleMeasureTool(active) {
    this.isMeasuring = active;
    this.measureStart = null;
    if (this.measureLine) {
      this.scene.remove(this.measureLine);
      this.measureLine = null;
    }
  }

  captureScreenshot() {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  bindEvents() {
    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;

      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);

      if (intersects.length > 0) {
        let selectedObj = null;
        for (const hit of intersects) {
          if (hit.object.userData && hit.object.userData.assetId) {
            selectedObj = hit.object;
            break;
          }
          // Search parent
          let p = hit.object.parent;
          while (p && p !== this.scene) {
            if (p.userData && p.userData.assetId) {
              selectedObj = p;
              break;
            }
            p = p.parent;
          }
          if (selectedObj) break;
        }

        if (this.isMeasuring) {
          const pt = intersects[0].point;
          if (!this.measureStart) {
            this.measureStart = pt.clone();
          } else {
            const dist = this.measureStart.distanceTo(pt);
            if (this.onMeasureDistance) this.onMeasureDistance(dist.toFixed(2));

            if (this.measureLine) this.scene.remove(this.measureLine);
            const lineGeo = new THREE.BufferGeometry().setFromPoints([this.measureStart, pt]);
            const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2 });
            this.measureLine = new THREE.Line(lineGeo, lineMat);
            this.scene.add(this.measureLine);
            this.measureStart = null;
          }
        } else if (selectedObj && this.onSelectObject) {
          this.onSelectObject(selectedObj.userData.assetId);
        }
      }
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.container);
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();

    if (this.controls) this.controls.update();

    // Pass azimuth angle to HUD Compass
    if (this.camera && this.onAngleChange) {
      const angle = Math.atan2(this.camera.position.x, this.camera.position.z) * (180 / Math.PI);
      this.onAngleChange(angle);
    }

    // Update animations (helicopter spinning rotor, pulsing beacons)
    if (this.modelBuilder) {
      this.modelBuilder.updateAnimations(delta);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
