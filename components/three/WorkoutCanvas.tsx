'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────────
   KINETIC RING CLUSTER
   A procedural double-torus orbital structure
   that reacts to scroll progress.
───────────────────────────────────────────── */
function KineticRings({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const ring3Ref = useRef<THREE.Mesh>(null!);
  const coreRef  = useRef<THREE.Mesh>(null!);

  // Purple-family material for outer rings
  const outerRingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9d4edd'),
    emissive: new THREE.Color('#6a0dad'),
    emissiveIntensity: 0.6,
    metalness: 0.88,
    roughness: 0.12,
    envMapIntensity: 1.2,
  }), []);

  // Magenta accent ring
  const accentRingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ec1380'),
    emissive: new THREE.Color('#b0005c'),
    emissiveIntensity: 0.9,
    metalness: 0.92,
    roughness: 0.08,
    envMapIntensity: 1.4,
  }), []);

  // Dark core sphere
  const coreMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#170c2c'),
    emissive: new THREE.Color('#4b0082'),
    emissiveIntensity: 0.35,
    metalness: 0.7,
    roughness: 0.3,
  }), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = scrollProgress.current; // 0 → 1

    if (!groupRef.current) return;

    // Slow global rotation
    groupRef.current.rotation.y = t * 0.08;
    groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.12;

    // Ring 1 — slow orbital tilt
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.22;
      ring1Ref.current.rotation.z = t * 0.14;
    }
    // Ring 2 — medium orbit, scroll-reactive tilt
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.18;
      ring2Ref.current.rotation.z = -t * 0.28 + p * Math.PI * 0.5;
    }
    // Ring 3 — fast orbit
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.32;
      ring3Ref.current.rotation.y = t * 0.12;
    }

    // Core — breathe + scroll-driven scale
    if (coreRef.current) {
      const breathe = 1 + Math.sin(t * 1.2) * 0.04;
      const scrollScale = 1 + p * 0.3;
      coreRef.current.scale.setScalar(breathe * scrollScale);
    }

    // Scroll-driven group position: drift slightly upward and pull back Z
    groupRef.current.position.y = p * 0.4 - 0.2;
    groupRef.current.position.z = p * 0.6;
  });

  return (
    <group ref={groupRef}>
      {/* Outer orbit — violet torus */}
      <mesh ref={ring1Ref} material={outerRingMat}>
        <torusGeometry args={[1.8, 0.05, 20, 180]} />
      </mesh>

      {/* Mid orbit — magenta torus, rotated 60° */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]} material={accentRingMat}>
        <torusGeometry args={[1.45, 0.04, 20, 180]} />
      </mesh>

      {/* Inner orbit — violet torus, rotated 45° other axis */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 6]} material={outerRingMat}>
        <torusGeometry args={[1.1, 0.035, 20, 160]} />
      </mesh>

      {/* Core sphere */}
      <mesh ref={coreRef} material={coreMat}>
        <sphereGeometry args={[0.42, 64, 64]} />
      </mesh>

      {/* Inner glow sphere (additive blending) */}
      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          color="#6a0dad"
          emissive="#9d4edd"
          emissiveIntensity={2.2}
          transparent
          opacity={0.18}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   PARTICLE FIELD
   Scattered violet motes that drift gently
───────────────────────────────────────────── */
function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const COUNT = 120;
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const positions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      arr.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
      ));
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = scrollProgress.current;
    if (!meshRef.current) return;

    for (let i = 0; i < COUNT; i++) {
      const pos = positions[i];
      dummy.position.set(
        pos.x + Math.sin(t * 0.3 + i * 0.8) * 0.15,
        pos.y + Math.cos(t * 0.25 + i * 0.6) * 0.12 + p * 0.5,
        pos.z,
      );
      dummy.scale.setScalar(0.5 + Math.sin(t * 0.9 + i) * 0.25);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.018, 6, 6]} />
      <meshStandardMaterial
        color="#f0abfc"
        emissive="#c084fc"
        emissiveIntensity={3.5}
        transparent
        opacity={0.75}
      />
    </instancedMesh>
  );
}

/* ─────────────────────────────────────────────
   CAMERA RIG
───────────────────────────────────────────── */
function CameraRig({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = scrollProgress.current;
    // Gentle sway + scroll-driven push
    state.camera.position.x = Math.sin(t * 0.12) * 0.3;
    state.camera.position.y = Math.cos(t * 0.09) * 0.15 + p * 0.2;
    state.camera.position.z = 4.5 - p * 0.8;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─────────────────────────────────────────────
   LIGHTING RIG
───────────────────────────────────────────── */
function LightingRig({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const leftRef  = useRef<THREE.PointLight>(null!);
  const rightRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const p = scrollProgress.current;
    if (leftRef.current)  leftRef.current.intensity  = 3.5 + p * 2.5;
    if (rightRef.current) rightRef.current.intensity = 2.8 + p * 2.0;
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      {/* Electric violet left rim */}
      <pointLight ref={leftRef}  position={[-4, 3, 2]} color="#a855f7" intensity={3.5} distance={18} />
      {/* Hot magenta right rim */}
      <pointLight ref={rightRef} position={[4, -2, 2]} color="#ec1380" intensity={2.8} distance={16} />
      {/* Cool deep fill */}
      <pointLight position={[0, -4, -3]} color="#1e0a3c" intensity={1.2} distance={12} />
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
interface WorkoutCanvasProps {
  scrollProgress: React.MutableRefObject<number>;
  phase: number; // 0–3 representing which category is active
}

export default function WorkoutCanvas({ scrollProgress, phase }: WorkoutCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.5], fov: 52, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      style={{ background: 'transparent' }}
    >
      <CameraRig scrollProgress={scrollProgress} />
      <LightingRig scrollProgress={scrollProgress} />
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
        <KineticRings scrollProgress={scrollProgress} />
      </Float>
      <ParticleField scrollProgress={scrollProgress} />
    </Canvas>
  );
}
