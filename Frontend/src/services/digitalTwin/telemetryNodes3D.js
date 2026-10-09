/**
 * 3D Telemetry Nodes, Flow Paths, and Connection Lines Engine
 * Renders interactive status billboards directly at 3D equipment coordinates.
 * Supports: NORMAL, WARNING, CRITICAL, OFFLINE, MAINTENANCE, NO_DATA
 */

import * as THREE from 'three';

export class TelemetryNodes3D {
  constructor(scene) {
    this.scene = scene;
    this.nodesGroup = new THREE.Group();
    this.nodesGroup.name = 'TELEMETRY_NODES_ROOT';
    this.scene.add(this.nodesGroup);

    this.flowLinesGroup = new THREE.Group();
    this.flowLinesGroup.name = 'FLOW_LINES_ROOT';
    this.scene.add(this.flowLinesGroup);

    this.nodeSprites = new Map(); // assetId -> Sprite
    this.pulseParticles = [];
    this.visibleOverlays = {
      nodes: true,
      energyFlow: false,
      hvacFlow: false
    };

    this.animTime = 0;
  }

  clear() {
    while (this.nodesGroup.children.length > 0) {
      const obj = this.nodesGroup.children[0];
      this.nodesGroup.remove(obj);
      if (obj.material) obj.material.dispose();
      if (obj.geometry) obj.geometry.dispose();
    }
    while (this.flowLinesGroup.children.length > 0) {
      const obj = this.flowLinesGroup.children[0];
      this.flowLinesGroup.remove(obj);
      if (obj.material) obj.material.dispose();
      if (obj.geometry) obj.geometry.dispose();
    }
    this.nodeSprites.clear();
    this.pulseParticles = [];
  }

  // Create Canvas Texture for a 3D Telemetry Node Marker
  createNodeTexture(node) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const status = node.status || 'NORMAL';
    let statusColor = '#22c55e'; // Green

    if (status === 'WARNING') {
      statusColor = '#f59e0b'; // Amber
    } else if (status === 'CRITICAL') {
      statusColor = '#ef4444'; // Red
    } else if (status === 'OFFLINE') {
      statusColor = '#64748b'; // Slate
    } else if (status === 'MAINTENANCE') {
      statusColor = '#3b82f6'; // Blue
    }

    // Pill background
    ctx.fillStyle = 'rgba(10, 18, 32, 0.88)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 240, 112, 16);
    ctx.fill();

    // Border
    ctx.strokeStyle = statusColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(8, 8, 240, 112, 16);
    ctx.stroke();

    // Status beacon dot
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(32, 38, 10, 0, Math.PI * 2);
    ctx.fill();

    // Node Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(node.assetId || node.id, 52, 46);

    // Primary Metric Value if available
    const metricKeys = Object.keys(node.metrics || {});
    let metricText = status;
    if (metricKeys.length > 0) {
      const firstKey = metricKeys[0];
      const val = node.metrics[firstKey];
      metricText = `${firstKey}: ${val}`;
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(metricText, 20, 88);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Build Telemetry Nodes for Station Assets
  renderNodes(assets) {
    this.clear();
    if (!assets || assets.length === 0) return;

    assets.forEach(asset => {
      const pos = asset.position || { x: 0, y: 3, z: 0 };
      const texture = this.createNodeTexture(asset);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        depthTest: false,
        transparent: true
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(pos.x, pos.y + 2.4, pos.z);
      sprite.scale.set(4.2, 2.1, 1.0);
      sprite.userData = {
        assetId: asset.id || asset.assetId,
        nodeId: asset.telemetryNodeId,
        subsystem: asset.subsystem
      };

      // Thin anchor stem connecting node to physical equipment
      const stemGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pos.x, pos.y, pos.z),
        new THREE.Vector3(pos.x, pos.y + 1.6, pos.z)
      ]);
      const stemMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.6 });
      const stem = new THREE.Line(stemGeo, stemMat);

      this.nodesGroup.add(sprite);
      this.nodesGroup.add(stem);
      this.nodeSprites.set(asset.id || asset.assetId, sprite);
    });

    this.nodesGroup.visible = this.visibleOverlays.nodes;
  }

  // Render 3D Animated Energy Flow Paths
  renderEnergyFlow(stationId = 'MAITRI') {
    // Clear old flow lines
    while (this.flowLinesGroup.children.length > 0) {
      this.flowLinesGroup.remove(this.flowLinesGroup.children[0]);
    }

    const isMaitri = stationId === 'MAITRI';

    // Energy flow curves (Generator -> Distribution -> Consumers)
    const energyPaths = isMaitri ? [
      [new THREE.Vector3(-14, 2.5, 9), new THREE.Vector3(-8, 3.0, 5), new THREE.Vector3(0, 3.5, 0)], // Gen to PDB
      [new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(3, 8.5, 2)], // PDB to HVAC
      [new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(8, 3.0, -4)], // PDB to Habitation
      [new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(16, 2.5, 5)], // PDB to Research Lab
      [new THREE.Vector3(0, 7.6, 0), new THREE.Vector3(0, 3.5, 0)], // Solar to PDB
      [new THREE.Vector3(-10, 1.8, 6), new THREE.Vector3(0, 3.5, 0)] // Battery to PDB
    ] : [
      [new THREE.Vector3(-16, 5.0, 8), new THREE.Vector3(0, 6.0, 0)], // CHP-01 to Main PDB
      [new THREE.Vector3(-16, 5.0, 12), new THREE.Vector3(0, 6.0, 0)], // CHP-02 to Main PDB
      [new THREE.Vector3(0, 6.0, 0), new THREE.Vector3(4, 8.0, 0)], // PDB to AHU
      [new THREE.Vector3(0, 6.0, 0), new THREE.Vector3(13, 7.5, 0)], // PDB to Bridge
      [new THREE.Vector3(0, 6.0, 0), new THREE.Vector3(-12, 2.0, -8)] // PDB to Desal Plant
    ];

    energyPaths.forEach(pts => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.12, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.75 });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      this.flowLinesGroup.add(tube);
    });

    this.flowLinesGroup.visible = this.visibleOverlays.energyFlow;
  }

  // Update specific telemetry node on live delta
  updateNodeStatus(assetId, updatedNode) {
    const sprite = this.nodeSprites.get(assetId);
    if (sprite) {
      sprite.material.map = this.createNodeTexture(updatedNode);
      sprite.material.needsUpdate = true;
    }
  }

  // Toggle Visibility Layers
  toggleLayer(layerName, visible) {
    if (layerName === 'nodes') {
      this.visibleOverlays.nodes = visible;
      this.nodesGroup.visible = visible;
    } else if (layerName === 'energyFlow') {
      this.visibleOverlays.energyFlow = visible;
      this.flowLinesGroup.visible = visible;
    }
  }

  // Subtle pulsing animation
  animate() {
    this.animTime += 0.02;
    const pulse = 1.0 + Math.sin(this.animTime * 3) * 0.05;
    this.nodeSprites.forEach(sprite => {
      sprite.scale.set(4.2 * pulse, 2.1 * pulse, 1.0);
    });
  }
}
