'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import TransformationCamera from './TransformationCamera';
import TransformationLighting from './TransformationLighting';
import TransformationEnvironment from './TransformationEnvironment';
import {
  calculateTransformationState,
  TransformationState,
} from '../../lib/animations/transformationTimeline';
import { lerp } from '../../lib/animations/transformationTimeline';

interface DigitalHumanProps {
  scrollProgress: React.MutableRefObject<number>;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PHOTOREALISTIC DIGITAL HUMAN — CONTINUOUS BODY MORPHING
 * ─────────────────────────────────────────────────────────────────────────────
 * Same woman throughout all 90 days:
 * - Same facial structure & features
 * - Same hairstyle: sleek dark athletic bun
 * - Same realistic skin tone with natural PBR roughness
 * - Same fitted black workout crop top & dark high-waisted compression leggings
 * - Same height and identity
 *
 * Continuous anatomical body deformation:
 * - Waist width: 1.22x (Day 01) -> 0.86x (Day 90)
 * - Abdomen depth & volume: soft rounded protrusion -> flat, toned core
 * - Upper arms: soft, relaxed -> firm, athletic definition
 * - Thighs & hips: fuller soft curves -> sculpted, lean athletic lines
 * - Posture: forward pelvic lean (Day 01) -> tall, proud athletic alignment (Day 90)
 * ─────────────────────────────────────────────────────────────────────────────
 */
function FemaleDigitalHuman({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const spineRef           = useRef<THREE.Group>(null!);
  const abdomenRef         = useRef<THREE.Mesh>(null!);
  const waistRef           = useRef<THREE.Mesh>(null!);
  const chestRef           = useRef<THREE.Group>(null!);
  const hipsRef            = useRef<THREE.Mesh>(null!);
  const leggingsWaistRef   = useRef<THREE.Mesh>(null!);
  const athleticTopRef     = useRef<THREE.Mesh>(null!);

  const leftUpperArmRef    = useRef<THREE.Mesh>(null!);
  const rightUpperArmRef   = useRef<THREE.Mesh>(null!);
  const leftThighRef       = useRef<THREE.Mesh>(null!);
  const rightThighRef      = useRef<THREE.Mesh>(null!);
  const leftCalfRef        = useRef<THREE.Mesh>(null!);
  const rightCalfRef       = useRef<THREE.Mesh>(null!);

  // ── PHOTOREALISTIC PBR SKIN & MATERIALS ──
  // Natural realistic female skin tone (warm peach undertone, PBR roughness variation)
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d49f85'),
        roughness: 0.52,
        metalness: 0.05,
        envMapIntensity: 0.8,
      }),
    [],
  );

  // Natural dark brown hair material
  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1c1311'),
        roughness: 0.75,
        metalness: 0.1,
      }),
    [],
  );

  // Fitted black athletic compression top (matte athletic fabric)
  const athleticTopMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#131315'),
        roughness: 0.84,
        metalness: 0.06,
      }),
    [],
  );

  // High-waisted black training compression leggings (smooth elastane)
  const leggingsMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0d0d0f'),
        roughness: 0.68,
        metalness: 0.1,
      }),
    [],
  );

  // Subtle BLITE magenta accent trim
  const accentTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ec1380'),
        emissive: new THREE.Color('#ec1380'),
        emissiveIntensity: 0.5,
        roughness: 0.35,
      }),
    [],
  );

  useFrame((state) => {
    const p = scrollProgress.current;
    const m: TransformationState = calculateTransformationState(p);
    const t = state.clock.getElapsedTime();

    // Physiological breathing rhythm (subtle ribcage expansion)
    const breath = Math.sin(t * 1.5) * 0.012;

    // 1. Posture & Spinal Alignment:
    // Day 01: relaxed pelvic forward tilt (spine tilted 0.08 rad), chest slightly dropped
    // Day 90: tall, aligned athletic posture (spine -0.01 rad, chest lifted +0.06m)
    if (spineRef.current) {
      spineRef.current.rotation.x = lerp(0.08, -0.01, m.posture);
      spineRef.current.position.y = lerp(0.92, 0.98, m.posture);
    }

    if (chestRef.current) {
      const chestExpansion = lerp(0.98, 1.05, m.posture) + breath;
      chestRef.current.scale.set(chestExpansion, chestExpansion, chestExpansion);
    }

    // 2. Abdominal Volume & Waist Width (Physical Geometry Deformation):
    // Day 01: wider waist (1.22x), soft abdominal curve forward (Z scale 1.28x)
    // Day 90: athletic tapered waist (0.86x), flat defined core (Z scale 0.82x)
    const waistX = lerp(1.22, 0.86, 1 - m.waistWidth);
    const waistZ = lerp(1.26, 0.82, 1 - m.abdomenFat);

    if (waistRef.current) {
      waistRef.current.scale.set(waistX, 1.0, waistZ);
    }

    if (abdomenRef.current) {
      abdomenRef.current.scale.set(waistX * 1.02, 1.0, waistZ * 1.03);
      abdomenRef.current.position.z = lerp(0.04, -0.01, 1 - m.abdomenFat);
    }

    // High-waisted leggings waistband morphs seamlessly with waist
    if (leggingsWaistRef.current) {
      leggingsWaistRef.current.scale.set(waistX * 1.01, 1.0, waistZ * 1.01);
    }

    // Fitted athletic top morphs with ribcage & waist
    if (athleticTopRef.current) {
      athleticTopRef.current.scale.set(
        lerp(1.18, 0.90, 1 - m.waistWidth),
        1.0 + breath,
        lerp(1.20, 0.88, 1 - m.abdomenFat),
      );
    }

    // 3. Hips & Thighs Geometry Deformation:
    // Day 01: fuller, softer hips (1.18x) and thighs (1.20x)
    // Day 90: lean, sculpted athletic hips (0.92x) and thighs (0.88x)
    const hipScale = lerp(1.18, 0.92, 1 - m.hipWidth);
    if (hipsRef.current) {
      hipsRef.current.scale.set(hipScale, 1.0, lerp(1.16, 0.90, 1 - m.hipWidth));
    }

    const thighWidth = lerp(1.20, 0.88, 1 - m.thighSoftness);
    if (leftThighRef.current && rightThighRef.current) {
      leftThighRef.current.scale.set(thighWidth, 1.0, thighWidth);
      rightThighRef.current.scale.set(thighWidth, 1.0, thighWidth);
    }

    const calfWidth = lerp(1.10, 0.93, 1 - m.thighSoftness);
    if (leftCalfRef.current && rightCalfRef.current) {
      leftCalfRef.current.scale.set(calfWidth, 1.0, calfWidth);
      rightCalfRef.current.scale.set(calfWidth, 1.0, calfWidth);
    }

    // 4. Upper Arms Geometry Deformation:
    // Day 01: softer upper arms (1.20x) -> Day 90: firm, toned athletic arms (0.88x)
    const armWidth = lerp(1.20, 0.88, 1 - m.armSoftness);
    if (leftUpperArmRef.current && rightUpperArmRef.current) {
      leftUpperArmRef.current.scale.set(armWidth, 1.0, armWidth);
      rightUpperArmRef.current.scale.set(armWidth, 1.0, armWidth);
    }

    // Subtle skin roughness refinement as athletic sheen develops
    skinMaterial.roughness = lerp(0.52, 0.42, m.muscleDefinition);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── LOWER BODY (LEGS & PELVIS) ── */}
      <group position={[0, 0, 0]}>
        {/* Pelvic base & Hips */}
        <group position={[0, 0.92, 0]}>
          <mesh ref={hipsRef} material={leggingsMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.27, 0.24, 0.22, 32]} />
          </mesh>
          {/* High-waisted leggings waistband */}
          <mesh ref={leggingsWaistRef} position={[0, 0.11, 0]} material={leggingsMaterial}>
            <cylinderGeometry args={[0.26, 0.26, 0.06, 32]} />
          </mesh>
          {/* Subtle magenta hip branding accent */}
          <mesh position={[-0.24, 0.05, 0.06]} material={accentTrimMaterial}>
            <boxGeometry args={[0.015, 0.04, 0.02]} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group position={[-0.20, 0.82, 0]}>
          <mesh ref={leftThighRef} position={[-0.02, -0.36, 0]} rotation={[0, 0, 0.04]} material={leggingsMaterial} castShadow>
            <capsuleGeometry args={[0.105, 0.46, 16, 24]} />
          </mesh>
          <mesh ref={leftCalfRef} position={[-0.04, -0.96, 0.02]} material={leggingsMaterial} castShadow>
            <capsuleGeometry args={[0.082, 0.42, 16, 24]} />
          </mesh>
          {/* Training Footwear */}
          <mesh position={[-0.04, -1.28, 0.1]} material={athleticTopMaterial} castShadow>
            <boxGeometry args={[0.10, 0.065, 0.26]} />
          </mesh>
          <mesh position={[-0.04, -1.31, 0.1]} material={accentTrimMaterial}>
            <boxGeometry args={[0.105, 0.015, 0.265]} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.20, 0.82, 0]}>
          <mesh ref={rightThighRef} position={[0.02, -0.36, 0]} rotation={[0, 0, -0.04]} material={leggingsMaterial} castShadow>
            <capsuleGeometry args={[0.105, 0.46, 16, 24]} />
          </mesh>
          <mesh ref={rightCalfRef} position={[0.04, -0.96, 0.02]} material={leggingsMaterial} castShadow>
            <capsuleGeometry args={[0.082, 0.42, 16, 24]} />
          </mesh>
          {/* Training Footwear */}
          <mesh position={[0.04, -1.28, 0.1]} material={athleticTopMaterial} castShadow>
            <boxGeometry args={[0.10, 0.065, 0.26]} />
          </mesh>
          <mesh position={[0.04, -1.31, 0.1]} material={accentTrimMaterial}>
            <boxGeometry args={[0.105, 0.015, 0.265]} />
          </mesh>
        </group>
      </group>

      {/* ── ARTICULATED UPPER BODY & SPINE ── */}
      <group ref={spineRef} position={[0, 0.95, 0]}>
        {/* Abdomen / Midsection (Visibly morphs from soft to lean) */}
        <mesh
          ref={abdomenRef}
          position={[0, 0.14, 0.02]}
          material={skinMaterial}
          castShadow
        >
          <cylinderGeometry args={[0.24, 0.25, 0.18, 32]} />
        </mesh>

        {/* Waist transition */}
        <mesh
          ref={waistRef}
          position={[0, 0.25, 0.01]}
          material={skinMaterial}
          castShadow
        >
          <cylinderGeometry args={[0.25, 0.24, 0.14, 32]} />
        </mesh>

        {/* Thoracic Ribcage & Fitted Athletic Top */}
        <group ref={chestRef} position={[0, 0.46, 0]}>
          {/* Torso core skin */}
          <mesh material={skinMaterial} castShadow>
            <capsuleGeometry args={[0.23, 0.26, 20, 32]} />
          </mesh>

          {/* Fitted black athletic crop top */}
          <mesh ref={athleticTopRef} position={[0, 0.04, 0]} material={athleticTopMaterial} castShadow>
            <cylinderGeometry args={[0.24, 0.235, 0.28, 32]} />
          </mesh>
          {/* Racerback collar */}
          <mesh position={[0, 0.22, -0.04]} material={athleticTopMaterial}>
            <cylinderGeometry args={[0.13, 0.16, 0.12, 24]} />
          </mesh>
          {/* Subtle BLITE logo mark */}
          <mesh position={[0, 0.10, 0.235]} material={accentTrimMaterial}>
            <boxGeometry args={[0.035, 0.012, 0.01]} />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 0.32, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.065, 0.075, 0.14, 24]} />
          </mesh>

          {/* ── HEAD & SAME FACIAL IDENTITY ── */}
          <group position={[0, 0.52, 0.03]}>
            {/* Cranium & Realistic Facial Base */}
            <mesh material={skinMaterial} castShadow>
              <sphereGeometry args={[0.135, 32, 32]} />
            </mesh>

            {/* Jaw & Chin contour */}
            <mesh position={[0, -0.06, 0.05]} material={skinMaterial} castShadow>
              <sphereGeometry args={[0.085, 24, 24]} />
            </mesh>

            {/* Nose bridge */}
            <mesh position={[0, 0.01, 0.13]} material={skinMaterial}>
              <coneGeometry args={[0.016, 0.04, 16]} />
            </mesh>

            {/* Dark Natural Hair (Clean athletic ponytail bun) */}
            <group position={[0, 0.06, -0.03]}>
              <mesh material={hairMaterial} castShadow>
                <sphereGeometry args={[0.142, 32, 32]} />
              </mesh>
              <mesh position={[0, 0.04, -0.13]} rotation={[0.4, 0, 0]} material={hairMaterial} castShadow>
                <capsuleGeometry args={[0.045, 0.16, 16, 20]} />
              </mesh>
              {/* Hair tie band */}
              <mesh position={[0, 0.07, -0.09]} material={accentTrimMaterial}>
                <torusGeometry args={[0.042, 0.008, 12, 32]} />
              </mesh>
            </group>
          </group>

          {/* ── LEFT ARM ── */}
          <group position={[-0.30, 0.22, 0]}>
            <mesh material={skinMaterial} castShadow>
              <sphereGeometry args={[0.065, 20, 20]} />
            </mesh>
            <mesh
              ref={leftUpperArmRef}
              position={[-0.04, -0.24, 0]}
              material={skinMaterial}
              castShadow
            >
              <capsuleGeometry args={[0.065, 0.32, 16, 24]} />
            </mesh>
            <mesh position={[-0.06, -0.48, 0]} material={skinMaterial}>
              <sphereGeometry args={[0.052, 16, 16]} />
            </mesh>
            <mesh position={[-0.06, -0.74, 0]} material={skinMaterial} castShadow>
              <capsuleGeometry args={[0.052, 0.32, 16, 24]} />
            </mesh>
            {/* Hand & Athletic Wrist Wrap */}
            <mesh position={[-0.06, -0.96, 0]} material={skinMaterial}>
              <boxGeometry args={[0.04, 0.08, 0.06]} />
            </mesh>
            <mesh position={[-0.06, -0.88, 0]} material={accentTrimMaterial}>
              <cylinderGeometry args={[0.048, 0.048, 0.02, 20]} />
            </mesh>
          </group>

          {/* ── RIGHT ARM ── */}
          <group position={[0.30, 0.22, 0]}>
            <mesh material={skinMaterial} castShadow>
              <sphereGeometry args={[0.065, 20, 20]} />
            </mesh>
            <mesh
              ref={rightUpperArmRef}
              position={[0.04, -0.24, 0]}
              material={skinMaterial}
              castShadow
            >
              <capsuleGeometry args={[0.065, 0.32, 16, 24]} />
            </mesh>
            <mesh position={[0.06, -0.48, 0]} material={skinMaterial}>
              <sphereGeometry args={[0.052, 16, 16]} />
            </mesh>
            <mesh position={[0.06, -0.74, 0]} material={skinMaterial} castShadow>
              <capsuleGeometry args={[0.052, 0.32, 16, 24]} />
            </mesh>
            {/* Hand & Athletic Wrist Wrap */}
            <mesh position={[0.06, -0.96, 0]} material={skinMaterial}>
              <boxGeometry args={[0.04, 0.08, 0.06]} />
            </mesh>
            <mesh position={[0.06, -0.88, 0]} material={accentTrimMaterial}>
              <cylinderGeometry args={[0.048, 0.048, 0.02, 20]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────
   MAIN DIGITAL HUMAN CANVAS EXPORT
───────────────────────────────────────────── */
export default function DigitalHuman({
  scrollProgress,
  mousePos,
}: DigitalHumanProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.42, 4.8], fov: 44, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
      }}
      style={{ background: 'transparent' }}
    >
      <TransformationCamera
        scrollProgress={scrollProgress}
        mousePos={mousePos}
      />
      <TransformationLighting scrollProgress={scrollProgress} />
      <TransformationEnvironment />
      <Suspense fallback={null}>
        <FemaleDigitalHuman scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}
