"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Line,
} from "@react-three/drei";
import { TextureLoader } from "three";
import { useRef } from "react";
import * as THREE from "three";

export default function GlobalScene() {
  return (
    <div className="global-scene">
      <Canvas
        camera={{
          position: [0, 1.5, 13],
          fov: 42,
        }}
        dpr={[1, 2]}
      >
        {/* =========================
            SPACE
        ========================= */}

        <color
          attach="background"
          args={["#010306"]}
        />

        <fog
          attach="fog"
          args={["#010306", 12, 35]}
        />

        <Stars
          radius={90}
          depth={50}
          count={3500}
          factor={2}
          saturation={0}
          fade
          speed={0.15}
        />

        {/* =========================
            LIGHTING
        ========================= */}

        <ambientLight intensity={0.15} />

        {/* Sun light */}
        <pointLight
          position={[8, 4, -3]}
          intensity={12}
          distance={50}
          decay={1.5}
          color="#fff3d0"
        />

        {/* Small fill light */}
        <pointLight
          position={[-5, 2, 6]}
          intensity={1.5}
          distance={20}
          color="#5ec9ff"
        />

        {/* =========================
            EARTH
        ========================= */}

        <Earth />

        {/* =========================
            SUN
        ========================= */}

        <Sun />

        {/* =========================
            MOON
        ========================= */}

        <Moon />

        {/* =========================
            SATELLITES
        ========================= */}

        <Satellite
          radius={3.8}
          speed={0.45}
          offset={0}
          tilt={0.25}
        />

        <Satellite
          radius={4.8}
          speed={0.32}
          offset={Math.PI}
          tilt={-0.35}
        />

        <Satellite
          radius={5.7}
          speed={0.22}
          offset={Math.PI / 2}
          tilt={0.55}
        />

        {/* =========================
            ORBITS
        ========================= */}

        <Orbit
          radius={3.8}
          tilt={0.25}
        />

        <Orbit
          radius={4.8}
          tilt={-0.35}
        />

        <Orbit
          radius={5.7}
          tilt={0.55}
        />

        {/* =========================
            CAMERA
        ========================= */}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.08}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>
    </div>
  );
}


/* =================================================
   EARTH
================================================= */

function Earth() {
  const earth = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);

  const earthTexture = useLoader(
    TextureLoader,
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
  );

  const normalTexture = useLoader(
    TextureLoader,
    "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
  );

  useFrame((_, delta) => {
    if (earth.current) {
      earth.current.rotation.y += delta * 0.035;
    }

    if (clouds.current) {
      clouds.current.rotation.y += delta * 0.045;
    }
  });

  return (
    <group>

      {/* REAL EARTH */}

      <mesh ref={earth}>
        <sphereGeometry args={[2.2, 128, 128]} />

        <meshStandardMaterial
          map={earthTexture}
          normalMap={normalTexture}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          roughness={0.72}
          metalness={0.02}
        />
      </mesh>


      {/* CLOUD LAYER */}

      <mesh
        ref={clouds}
        scale={1.015}
      >
        <sphereGeometry args={[2.23, 128, 128]} />

        <meshBasicMaterial
          map={earthTexture}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>


      {/* ATMOSPHERE */}

      <mesh scale={1.09}>
        <sphereGeometry args={[2.35, 96, 96]} />

        <meshBasicMaterial
          color="#49dfe0"
          transparent
          opacity={0.13}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>


      {/* INNER ATMOSPHERIC GLOW */}

      <mesh scale={1.035}>
        <sphereGeometry args={[2.28, 96, 96]} />

        <meshBasicMaterial
          color="#8cefff"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

    </group>
  );
}


/* =================================================
   SUN
================================================= */

function Sun() {
  const sun = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (sun.current) {
      sun.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group
      ref={sun}
      position={[8, 4, -3]}
    >

      {/* CORE */}

      <mesh>
        <sphereGeometry args={[0.62, 48, 48]} />

        <meshBasicMaterial
          color="#fff8cf"
        />
      </mesh>


      {/* INNER GLOW */}

      <mesh scale={1.35}>
        <sphereGeometry args={[0.62, 48, 48]} />

        <meshBasicMaterial
          color="#ffd76a"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>


      {/* OUTER GLOW */}

      <mesh scale={2.1}>
        <sphereGeometry args={[0.62, 48, 48]} />

        <meshBasicMaterial
          color="#ffb83d"
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

    </group>
  );
}


/* =================================================
   MOON
================================================= */

function Moon() {
  const moon = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (moon.current) {
      moon.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group
      ref={moon}
      position={[-6, 3, -2]}
    >

      <mesh>
        <sphereGeometry args={[0.68, 64, 64]} />

        <meshStandardMaterial
          color="#b8c1c4"
          roughness={0.92}
          metalness={0}
        />
      </mesh>


      {/* Moon halo */}

      <mesh scale={1.35}>
        <sphereGeometry args={[0.68, 48, 48]} />

        <meshBasicMaterial
          color="#9bb8c2"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

    </group>
  );
}


/* =================================================
   SATELLITE
================================================= */

function Satellite({
  radius,
  speed,
  offset,
  tilt,
}: {
  radius: number;
  speed: number;
  offset: number;
  tilt: number;
}) {
  const satellite = useRef<THREE.Group>(null);

  const angle = useRef(offset);

  useFrame((_, delta) => {
    if (!satellite.current) return;

    angle.current += delta * speed;

    const t = angle.current;

    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 0.7) * 1.2;

    satellite.current.position.set(
      x,
      y,
      z
    );

    satellite.current.rotation.y += delta * 1.5;
  });

  return (
    <group
      ref={satellite}
      rotation={[tilt, 0, 0]}
    >

      {/* Satellite body */}

      <mesh>
        <boxGeometry
          args={[0.32, 0.18, 0.18]}
        />

        <meshStandardMaterial
          color="#dce7e9"
          emissive="#415b63"
          emissiveIntensity={0.35}
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>


      {/* Antenna */}

      <mesh
        position={[0, 0.17, 0]}
      >
        <cylinderGeometry
          args={[0.015, 0.015, 0.22, 12]}
        />

        <meshBasicMaterial
          color="#b9ffff"
        />
      </mesh>


      {/* LEFT SOLAR PANEL */}

      <mesh
        position={[-0.48, 0, 0]}
      >
        <boxGeometry
          args={[0.48, 0.045, 0.25]}
        />

        <meshStandardMaterial
          color="#173d58"
          emissive="#087c9c"
          emissiveIntensity={0.5}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>


      {/* RIGHT SOLAR PANEL */}

      <mesh
        position={[0.48, 0, 0]}
      >
        <boxGeometry
          args={[0.48, 0.045, 0.25]}
        />

        <meshStandardMaterial
          color="#173d58"
          emissive="#087c9c"
          emissiveIntensity={0.5}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>


      {/* Satellite beacon */}

      <mesh
        position={[0, 0, 0.12]}
      >
        <sphereGeometry
          args={[0.035, 16, 16]}
        />

        <meshBasicMaterial
          color="#55fff0"
        />
      </mesh>

    </group>
  );
}


/* =================================================
   ORBIT
================================================= */

function Orbit({
  radius,
  tilt,
}: {
  radius: number;
  tilt: number;
}) {
  const points = [];

  for (let i = 0; i <= 128; i++) {
    const angle =
      (i / 128) * Math.PI * 2;

    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    );
  }

  return (
    <group
      rotation={[tilt, 0, 0]}
    >
      <Line
        points={points}
        color="#2bd4d7"
        transparent
        opacity={0.28}
        lineWidth={1}
      />
    </group>
  );
}