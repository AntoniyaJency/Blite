'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import TransformationAthlete from './TransformationAthlete';
import {
  getCameraCoordinates,
  getLightingParameters,
  clamp,
} from '../../lib/animations/transformation';

interface TransformationSceneProps {
  scrollProgress: React.MutableRefObject<number>;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

/* ─────────────────────────────────────────────
   CAMERA RIG
   Keeps focus directly on the female athlete,
   dolly closer, and executes subtle orbit.
───────────────────────────────────────────── */
function CameraRig({
  scrollProgress,
  mousePos,
}: {
  scrollProgress: React.MutableRefObject<number>;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const currentPos = useRef(new THREE.Vector3(0, 1.45, 4.8));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.15, 0));

  useFrame((state) => {
    const p = clamp(scrollProgress.current, 0, 1);
    const target = getCameraCoordinates(p);

    // Subtle pointer parallax (does not fight scroll)
    const mx = mousePos.current.x * 0.12;
    const my = mousePos.current.y * 0.08;

    currentPos.current.x += (target.x + mx - currentPos.current.x) * 0.08;
    currentPos.current.y += (target.y + my - currentPos.current.y) * 0.08;
    currentPos.current.z += (target.z - currentPos.current.z) * 0.08;

    currentLookAt.current.y += (target.lookAtY - currentLookAt.current.y) * 0.08;

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(0, currentLookAt.current.y, 0);
  });

  return null;
}

/* ─────────────────────────────────────────────
   LIGHTING RIG
   Evolves from soft subdued to studio perfection.
───────────────────────────────────────────── */
function LightingRig({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const keyLightRef       = useRef<THREE.DirectionalLight>(null!);
  const fillLightRef      = useRef<THREE.PointLight>(null!);
  const violetRimRef      = useRef<THREE.PointLight>(null!);
  const magentaRimRef     = useRef<THREE.PointLight>(null!);
  const floorBounceRef    = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const p = clamp(scrollProgress.current, 0, 1);
    const lights = getLightingParameters(p);

    if (keyLightRef.current)    keyLightRef.current.intensity    = lights.keyIntensity;
    if (fillLightRef.current)   fillLightRef.current.intensity   = lights.fillIntensity;
    if (violetRimRef.current)   violetRimRef.current.intensity   = lights.violetRimIntensity;
    if (magentaRimRef.current)  magentaRimRef.current.intensity  = lights.magentaRimIntensity;
    if (floorBounceRef.current) floorBounceRef.current.intensity = lights.floorBounceIntensity;
  });

  return (
    <>
      <ambientLight intensity={0.25} />

      {/* Primary Key Spotlight */}
      <directionalLight
        ref={keyLightRef}
        position={[2.0, 4.0, 3.5]}
        color="#ffffff"
        intensity={2.0}
      />

      {/* Soft Ambient Fill */}
      <pointLight
        ref={fillLightRef}
        position={[-3.0, 2.2, 2.0]}
        color="#d1c4e9"
        intensity={0.6}
        distance={15}
      />

      {/* Electric Violet Left Rim */}
      <pointLight
        ref={violetRimRef}
        position={[-3.2, 2.0, -1.5]}
        color="#a855f7"
        intensity={1.8}
        distance={12}
      />

      {/* Radiant Hot Magenta Right Rim */}
      <pointLight
        ref={magentaRimRef}
        position={[3.2, 1.8, -1.2]}
        color="#ec1380"
        intensity={1.2}
        distance={12}
      />

      {/* Floor Underglow */}
      <pointLight
        ref={floorBounceRef}
        position={[0, 0.05, 0]}
        color="#8b2fc9"
        intensity={0.4}
        distance={5}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   MINIMAL LUXURY STUDIO ENVIRONMENT
───────────────────────────────────────────── */
function StudioEnvironment() {
  return (
    <group>
      {/* High-gloss dark obsidian floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial
          color="#07030e"
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Concentric staging ring on the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[1.35, 1.37, 64]} />
        <meshBasicMaterial color="#9d4edd" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[1.85, 1.87, 64]} />
        <meshBasicMaterial color="#ec1380" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   MAIN CANVAS EXPORT
───────────────────────────────────────────── */
export default function TransformationScene({
  scrollProgress,
  mousePos,
}: TransformationSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.45, 4.8], fov: 44, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{ background: 'transparent' }}
    >
      <CameraRig scrollProgress={scrollProgress} mousePos={mousePos} />
      <LightingRig scrollProgress={scrollProgress} />
      <StudioEnvironment />
      <TransformationAthlete scrollProgress={scrollProgress} />
    </Canvas>
  );
}
