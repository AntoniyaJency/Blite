'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ForgeStrengthObjectProps {
  scrollProgress: React.MutableRefObject<number>;
  isMobile?: boolean;
}

export default function ForgeStrengthObject({
  scrollProgress,
  isMobile = false,
}: ForgeStrengthObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreBarRef = useRef<THREE.Mesh>(null);
  const leftPlatesRef = useRef<THREE.Group>(null);
  const rightPlatesRef = useRef<THREE.Group>(null);

  // Materials with tuned physical parameters for Blite dark luxury purple & magenta aesthetic
  const knurledSteelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ded6ed',
        metalness: 0.96,
        roughness: 0.2,
        envMapIntensity: 1.6,
      }),
    []
  );

  const castIronPlateMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f051c',
        metalness: 0.86,
        roughness: 0.34,
      }),
    []
  );

  const innerPlateMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a0830',
        metalness: 0.92,
        roughness: 0.24,
      }),
    []
  );

  const magentaAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ec1380',
        metalness: 0.9,
        roughness: 0.18,
        emissive: '#ec1380',
        emissiveIntensity: 0.45,
      }),
    []
  );

  const violetAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#9d4edd',
        metalness: 0.92,
        roughness: 0.2,
        emissive: '#8b2fc9',
        emissiveIntensity: 0.35,
      }),
    []
  );

  const collarClampMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#260f3c',
        metalness: 0.9,
        roughness: 0.24,
      }),
    []
  );

  const chromeTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        metalness: 0.98,
        roughness: 0.12,
      }),
    []
  );

  // Create atmospheric chalk/dust floating points
  const particleCount = isMobile ? 60 : 160;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [particleCount]);

  useFrame((state, delta) => {
    const p = scrollProgress.current || 0;

    if (groupRef.current) {
      // Idle levitation oscillation
      const idleY = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
      const idleRot = Math.cos(state.clock.elapsedTime * 0.8) * 0.03;

      // Scroll-driven position: transitions from center-right to macro close-up, then down
      const targetX = isMobile ? 0 : 0.85 * (1 - p * 0.7);
      const targetY = idleY - p * 0.45;
      const targetZ = p * 1.2;

      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetX,
        5,
        delta
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetY,
        5,
        delta
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetZ,
        5,
        delta
      );

      // Scroll-driven rotation (dramatic cinematic angles)
      const targetRotX = 0.25 + p * 0.85 + idleRot;
      const targetRotY = -0.55 + p * 2.1;
      const targetRotZ = 0.18 + Math.sin(p * Math.PI) * 0.4;

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        5,
        delta
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        5,
        delta
      );
      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        targetRotZ,
        5,
        delta
      );
    }
  });

  return (
    <group ref={groupRef} scale={isMobile ? 0.72 : 1}>
      {/* 1. CENTRAL KNURLED STEEL BARBELL SHAFT */}
      <mesh ref={coreBarRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 4.4, 32]} />
        <primitive object={knurledSteelMaterial} attach="material" />
      </mesh>

      {/* Knurled Grip Bands with Micro Diamond Texturing Ribs */}
      {[-0.65, 0.65].map((xOffset, idx) => (
        <group key={`grip-${idx}`} position={[xOffset, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.136, 0.136, 0.95, 32]} />
            <primitive object={knurledSteelMaterial} attach="material" />
          </mesh>
          {/* Subtle Magenta Ring Accents */}
          <mesh position={[-0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.138, 0.008, 16, 32]} />
            <primitive object={magentaAccentMaterial} attach="material" />
          </mesh>
          <mesh position={[0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.138, 0.008, 16, 32]} />
            <primitive object={magentaAccentMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Center Spec Badge Band */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.134, 0.134, 0.22, 32]} />
        <primitive object={collarClampMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.136, 0.006, 16, 32]} />
        <primitive object={chromeTrimMaterial} attach="material" />
      </mesh>

      {/* Bar Sleeve Stops / Inner Collars */}
      {[-1.35, 1.35].map((xOffset, idx) => (
        <group key={`inner-collar-${idx}`} position={[xOffset, 0, 0]}>
          {/* Heavy Inner Flange */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.12, 32]} />
            <primitive object={collarClampMaterial} attach="material" />
          </mesh>
          {/* Polished Chamfered Ring */}
          <mesh position={[idx === 0 ? 0.06 : -0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.26, 0.012, 16, 32]} />
            <primitive object={chromeTrimMaterial} attach="material" />
          </mesh>
          {/* Outer Rotating Sleeve Cylinder */}
          <mesh position={[idx === 0 ? -0.55 : 0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.19, 0.19, 1.0, 32]} />
            <primitive object={knurledSteelMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* 2. LEFT SIDE WEIGHT PLATE STACK */}
      <group ref={leftPlatesRef} position={[-1.55, 0, 0]}>
        {/* Primary 20KG Olympic Plate */}
        <group position={[-0.1, 0, 0]}>
          {/* Main Calibrated Outer Disk */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.38, 1.38, 0.16, 48]} />
            <primitive object={castIronPlateMaterial} attach="material" />
          </mesh>
          {/* Inner Recessed Face */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.18, 1.18, 0.19, 48]} />
            <primitive object={innerPlateMaterial} attach="material" />
          </mesh>
          {/* Laser-Polished Outer Lip Rim */}
          <mesh position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.36, 0.022, 16, 48]} />
            <primitive object={chromeTrimMaterial} attach="material" />
          </mesh>
          {/* Blite Signature Magenta Spec Ring Accent */}
          <mesh position={[-0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.82, 0.014, 16, 48]} />
            <primitive object={magentaAccentMaterial} attach="material" />
          </mesh>
        </group>

        {/* Secondary 10KG Precision Plate */}
        <group position={[-0.32, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.12, 1.12, 0.14, 48]} />
            <primitive object={castIronPlateMaterial} attach="material" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.96, 0.96, 0.16, 48]} />
            <primitive object={innerPlateMaterial} attach="material" />
          </mesh>
          <mesh position={[-0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.1, 0.018, 16, 48]} />
            <primitive object={violetAccentMaterial} attach="material" />
          </mesh>
        </group>

        {/* Tactical Quick-Lock Olympic Collar */}
        <group position={[-0.52, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.34, 0.34, 0.15, 32]} />
            <primitive object={collarClampMaterial} attach="material" />
          </mesh>
          {/* Anodized Magenta Release Lever */}
          <mesh position={[-0.02, 0.28, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.08, 0.32, 0.12]} />
            <primitive object={magentaAccentMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 3. RIGHT SIDE WEIGHT PLATE STACK */}
      <group ref={rightPlatesRef} position={[1.55, 0, 0]}>
        {/* Primary 20KG Olympic Plate */}
        <group position={[0.1, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.38, 1.38, 0.16, 48]} />
            <primitive object={castIronPlateMaterial} attach="material" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.18, 1.18, 0.19, 48]} />
            <primitive object={innerPlateMaterial} attach="material" />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.36, 0.022, 16, 48]} />
            <primitive object={chromeTrimMaterial} attach="material" />
          </mesh>
          <mesh position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.82, 0.014, 16, 48]} />
            <primitive object={magentaAccentMaterial} attach="material" />
          </mesh>
        </group>

        {/* Secondary 10KG Precision Plate */}
        <group position={[0.32, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.12, 1.12, 0.14, 48]} />
            <primitive object={castIronPlateMaterial} attach="material" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.96, 0.96, 0.16, 48]} />
            <primitive object={innerPlateMaterial} attach="material" />
          </mesh>
          <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.1, 0.018, 16, 48]} />
            <primitive object={violetAccentMaterial} attach="material" />
          </mesh>
        </group>

        {/* Tactical Quick-Lock Olympic Collar */}
        <group position={[0.52, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.34, 0.34, 0.15, 32]} />
            <primitive object={collarClampMaterial} attach="material" />
          </mesh>
          <mesh position={[0.02, 0.28, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.08, 0.32, 0.12]} />
            <primitive object={magentaAccentMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 4. FLOATING SPARKLING MAGENTA & VIOLET PARTICLES */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.03 : 0.045}
          color="#f0abfc"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
