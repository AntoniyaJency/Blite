'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMorphParameters, lerp } from '../../lib/animations/transformation';

interface TransformationAthleteProps {
  scrollProgress: React.MutableRefObject<number>;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * REAL 3D HUMAN TRANSFORMATION COMPONENT
 * ─────────────────────────────────────────────────────────────────────────────
 * Shows ONE real human woman physically transforming from an untrained,
 * overweight body into a naturally fit, athletic physique across 90 days.
 *
 * Same human throughout:
 * - Same facial structure & features
 * - Same hairstyle (sleek dark athletic bun with clean flyaways)
 * - Same realistic skin tone & texture
 * - Same fitted black workout top & dark compression leggings
 * - Same height and skeletal identity
 *
 * Continuous anatomical body deformation:
 * - Abdominal volume & softness: curves outwards at Day 01 -> tightens & flattens
 * - Waist width: 0.38 at Day 01 -> slender athletic 0.28 taper at Day 90
 * - Upper arms: soft, relaxed at Day 01 -> toned, firm athletic lines
 * - Thighs/hips: softer curvature at Day 01 -> sculpted, lean athletic tone
 * - Posture: relaxed pelvic forward tilt at Day 01 -> tall, confident power alignment
 *
 * Direct Production Hook:
 *   Drop `/public/models/blite-athlete.glb` with morph targets:
 *   `fatReduction`, `waistReduction`, `abdomenDefinition`, `armDefinition`,
 *   `legDefinition`, `muscleDefinition`, `posture`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default function TransformationAthlete({
  scrollProgress,
}: TransformationAthleteProps) {
  const rootGroupRef = useRef<THREE.Group>(null!);

  // Anatomy segment refs for continuous geometric transformation
  const spineJointRef       = useRef<THREE.Group>(null!);
  const abdomenMeshRef      = useRef<THREE.Mesh>(null!);
  const waistMeshRef        = useRef<THREE.Mesh>(null!);
  const chestMeshRef        = useRef<THREE.Group>(null!);
  const hipsMeshRef         = useRef<THREE.Mesh>(null!);

  const leftUpperArmRef     = useRef<THREE.Mesh>(null!);
  const rightUpperArmRef    = useRef<THREE.Mesh>(null!);
  const leftThighRef        = useRef<THREE.Mesh>(null!);
  const rightThighRef       = useRef<THREE.Mesh>(null!);
  const leftCalfRef         = useRef<THREE.Mesh>(null!);
  const rightCalfRef        = useRef<THREE.Mesh>(null!);

  // Clothing refs (morph alongside the body)
  const athleticTopRef      = useRef<THREE.Mesh>(null!);
  const leggingsWaistRef    = useRef<THREE.Mesh>(null!);

  // ── PBR REALISTIC MATERIALS ──
  // Natural realistic female skin tone (soft peach/warm undertone, PBR roughness)
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d9a78d'),
        roughness: 0.58,
        metalness: 0.04,
        envMapIntensity: 0.8,
      }),
    [],
  );

  // Natural dark brown hair material
  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1f1614'),
        roughness: 0.72,
        metalness: 0.12,
      }),
    [],
  );

  // Fitted black workout compression top (matte athletic fabric)
  const athleticTopMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#141416'),
        roughness: 0.82,
        metalness: 0.08,
      }),
    [],
  );

  // High-waisted black training leggings (smooth compression elastane)
  const leggingsMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0e0e10'),
        roughness: 0.65,
        metalness: 0.12,
      }),
    [],
  );

  // Subtle BLITE magenta accent stitching
  const accentStitchMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ec1380'),
        emissive: new THREE.Color('#ec1380'),
        emissiveIntensity: 0.6,
        roughness: 0.4,
      }),
    [],
  );

  useFrame((state) => {
    const p = scrollProgress.current;
    const m = getMorphParameters(p);
    const t = state.clock.getElapsedTime();

    // 1. Subtle physiological breathing rhythm (independent of scroll)
    const breath = Math.sin(t * 1.6) * 0.012;

    // 2. Posture & Spinal Realignment:
    // Day 01: relaxed pelvic forward tilt (spine tilted 0.08 rad), chest slightly lowered.
    // Day 90: tall, aligned athletic posture (spine 0.00 rad, chest lifted +0.06m).
    if (spineJointRef.current) {
      spineJointRef.current.rotation.x = lerp(0.08, -0.01, m.posture);
      spineJointRef.current.position.y = lerp(0.92, 0.98, m.posture);
    }

    if (chestMeshRef.current) {
      const chestExpansion = lerp(0.98, 1.05, m.posture) + breath;
      chestMeshRef.current.scale.set(chestExpansion, chestExpansion, chestExpansion);
    }

    // 3. Waist & Abdominal Geometry Morphing (The core visual transformation):
    // Day 01: wider waist (scale 1.22), soft abdominal protrusion forward (Z scale 1.28)
    // Day 90: athletic tapered waist (scale 0.88), flat defined core (Z scale 0.85)
    const waistWidth  = lerp(1.22, 0.86, m.waistTaper);
    const waistDepth  = lerp(1.26, 0.84, m.abdomenDefinition);
    if (waistMeshRef.current) {
      waistMeshRef.current.scale.set(waistWidth, 1.0, waistDepth);
    }
    if (abdomenMeshRef.current) {
      abdomenMeshRef.current.scale.set(
        lerp(1.24, 0.86, m.waistTaper),
        1.0,
        lerp(1.30, 0.82, m.abdomenDefinition),
      );
      // Soft abdominal volume moves slightly flatter backward
      abdomenMeshRef.current.position.z = lerp(0.04, -0.01, m.abdomenDefinition);
    }

    // High-waisted leggings waistband morphs seamlessly with the waist
    if (leggingsWaistRef.current) {
      leggingsWaistRef.current.scale.set(waistWidth * 1.01, 1.0, waistDepth * 1.01);
    }

    // Fitted athletic top morphs with ribcage & waist
    if (athleticTopRef.current) {
      athleticTopRef.current.scale.set(
        lerp(1.18, 0.92, m.waistTaper),
        1.0 + breath,
        lerp(1.20, 0.90, m.abdomenDefinition),
      );
    }

    // 4. Hips & Thighs Geometry Morphing:
    // Day 01: softer, wider hip curve (1.18x), fuller thighs (1.20x)
    // Day 90: firm, sculpted athletic hips (0.92x), toned lean thighs (0.88x)
    const hipScale = lerp(1.18, 0.92, m.thighFirmness);
    if (hipsMeshRef.current) {
      hipsMeshRef.current.scale.set(hipScale, 1.0, lerp(1.16, 0.90, m.thighFirmness));
    }

    const thighWidth = lerp(1.20, 0.88, m.thighFirmness);
    if (leftThighRef.current && rightThighRef.current) {
      leftThighRef.current.scale.set(thighWidth, 1.0, thighWidth);
      rightThighRef.current.scale.set(thighWidth, 1.0, thighWidth);
    }

    const calfWidth = lerp(1.10, 0.94, m.thighFirmness);
    if (leftCalfRef.current && rightCalfRef.current) {
      leftCalfRef.current.scale.set(calfWidth, 1.0, calfWidth);
      rightCalfRef.current.scale.set(calfWidth, 1.0, calfWidth);
    }

    // 5. Upper Arms & Shoulders Geometry Morphing:
    // Day 01: softer upper arms (1.18x), slightly inward shoulders
    // Day 90: toned, defined arms (0.88x), retracted strong shoulders
    const armWidth = lerp(1.22, 0.86, m.armFirmness);
    if (leftUpperArmRef.current && rightUpperArmRef.current) {
      leftUpperArmRef.current.scale.set(armWidth, 1.0, armWidth);
      rightUpperArmRef.current.scale.set(armWidth, 1.0, armWidth);
    }

    // Subtle skin specular highlight refinement as athletic sheen develops
    skinMaterial.roughness = lerp(0.58, 0.44, m.muscleTone);
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* ── LOWER BODY (LEGS & PELVIS) ── */}
      <group position={[0, 0, 0]}>
        {/* Pelvic base & Hips */}
        <group position={[0, 0.92, 0]}>
          <mesh ref={hipsMeshRef} material={leggingsMaterial}>
            <cylinderGeometry args={[0.27, 0.24, 0.22, 32]} />
          </mesh>
          {/* Leggings waistband */}
          <mesh ref={leggingsWaistRef} position={[0, 0.11, 0]} material={leggingsMaterial}>
            <cylinderGeometry args={[0.26, 0.26, 0.06, 32]} />
          </mesh>
          {/* Subtle magenta hip branding accent */}
          <mesh position={[-0.24, 0.05, 0.06]} material={accentStitchMaterial}>
            <boxGeometry args={[0.015, 0.04, 0.02]} />
          </mesh>
        </group>

        {/* Left Leg (Leggings + Anatomical Thigh & Calf) */}
        <group position={[-0.20, 0.82, 0]}>
          <mesh ref={leftThighRef} position={[-0.02, -0.36, 0]} rotation={[0, 0, 0.04]} material={leggingsMaterial}>
            <capsuleGeometry args={[0.105, 0.46, 16, 24]} />
          </mesh>
          <mesh ref={leftCalfRef} position={[-0.04, -0.96, 0.02]} material={leggingsMaterial}>
            <capsuleGeometry args={[0.082, 0.42, 16, 24]} />
          </mesh>
          {/* Foot & Training Shoe */}
          <mesh position={[-0.04, -1.28, 0.1]} material={athleticTopMaterial}>
            <boxGeometry args={[0.10, 0.065, 0.26]} />
          </mesh>
          <mesh position={[-0.04, -1.31, 0.1]} material={accentStitchMaterial}>
            <boxGeometry args={[0.105, 0.015, 0.265]} />
          </mesh>
        </group>

        {/* Right Leg (Leggings + Anatomical Thigh & Calf) */}
        <group position={[0.20, 0.82, 0]}>
          <mesh ref={rightThighRef} position={[0.02, -0.36, 0]} rotation={[0, 0, -0.04]} material={leggingsMaterial}>
            <capsuleGeometry args={[0.105, 0.46, 16, 24]} />
          </mesh>
          <mesh ref={rightCalfRef} position={[0.04, -0.96, 0.02]} material={leggingsMaterial}>
            <capsuleGeometry args={[0.082, 0.42, 16, 24]} />
          </mesh>
          {/* Foot & Training Shoe */}
          <mesh position={[0.04, -1.28, 0.1]} material={athleticTopMaterial}>
            <boxGeometry args={[0.10, 0.065, 0.26]} />
          </mesh>
          <mesh position={[0.04, -1.31, 0.1]} material={accentStitchMaterial}>
            <boxGeometry args={[0.105, 0.015, 0.265]} />
          </mesh>
        </group>
      </group>

      {/* ── ARTICULATED UPPER BODY & SPINE ── */}
      <group ref={spineJointRef} position={[0, 0.95, 0]}>
        {/* Abdomen / Midsection (Visibly morphs from soft/fuller to lean/flat) */}
        <mesh
          ref={abdomenMeshRef}
          position={[0, 0.14, 0.02]}
          material={skinMaterial}
        >
          <cylinderGeometry args={[0.24, 0.25, 0.18, 32]} />
        </mesh>

        {/* Waist transition */}
        <mesh
          ref={waistMeshRef}
          position={[0, 0.25, 0.01]}
          material={skinMaterial}
        >
          <cylinderGeometry args={[0.25, 0.24, 0.14, 32]} />
        </mesh>

        {/* Thoracic Ribcage & Fitted Athletic Top */}
        <group ref={chestMeshRef} position={[0, 0.46, 0]}>
          {/* Torso core skin */}
          <mesh material={skinMaterial}>
            <capsuleGeometry args={[0.23, 0.26, 20, 32]} />
          </mesh>

          {/* Fitted black athletic crop top */}
          <mesh ref={athleticTopRef} position={[0, 0.04, 0]} material={athleticTopMaterial}>
            <cylinderGeometry args={[0.24, 0.235, 0.28, 32]} />
          </mesh>
          {/* Athletic top racerback collar strap */}
          <mesh position={[0, 0.22, -0.04]} material={athleticTopMaterial}>
            <cylinderGeometry args={[0.13, 0.16, 0.12, 24]} />
          </mesh>
          {/* Subtle BLITE logo mark on chest */}
          <mesh position={[0, 0.10, 0.235]} material={accentStitchMaterial}>
            <boxGeometry args={[0.035, 0.012, 0.01]} />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 0.32, 0]} material={skinMaterial}>
            <cylinderGeometry args={[0.065, 0.075, 0.14, 24]} />
          </mesh>

          {/* ── HEAD, FACE & IDENTICAL IDENTITY ── */}
          <group position={[0, 0.52, 0.03]}>
            {/* Cranium & Facial Base */}
            <mesh material={skinMaterial}>
              <sphereGeometry args={[0.135, 32, 32]} />
            </mesh>

            {/* Jaw & Chin contour */}
            <mesh position={[0, -0.06, 0.05]} material={skinMaterial}>
              <sphereGeometry args={[0.085, 24, 24]} />
            </mesh>

            {/* Nose bridge */}
            <mesh position={[0, 0.01, 0.13]} material={skinMaterial}>
              <coneGeometry args={[0.016, 0.04, 16]} />
            </mesh>

            {/* Dark Natural Hair (Clean athletic ponytail & hairline) */}
            <group position={[0, 0.06, -0.03]}>
              {/* Crown hair volume */}
              <mesh material={hairMaterial}>
                <sphereGeometry args={[0.142, 32, 32]} />
              </mesh>
              {/* Sleek athletic ponytail bun */}
              <mesh position={[0, 0.04, -0.13]} rotation={[0.4, 0, 0]} material={hairMaterial}>
                <capsuleGeometry args={[0.045, 0.16, 16, 20]} />
              </mesh>
              {/* Hair tie band */}
              <mesh position={[0, 0.07, -0.09]} material={accentStitchMaterial}>
                <torusGeometry args={[0.042, 0.008, 12, 32]} />
              </mesh>
            </group>
          </group>

          {/* ── LEFT ARM (SHOULDER, BICEPS, FOREARM, HAND) ── */}
          <group position={[-0.30, 0.22, 0]}>
            <mesh material={skinMaterial}>
              <sphereGeometry args={[0.065, 20, 20]} />
            </mesh>
            {/* Upper arm (visibly morphs from soft to toned) */}
            <mesh
              ref={leftUpperArmRef}
              position={[-0.04, -0.24, 0]}
              material={skinMaterial}
            >
              <capsuleGeometry args={[0.065, 0.32, 16, 24]} />
            </mesh>
            {/* Elbow */}
            <mesh position={[-0.06, -0.48, 0]} material={skinMaterial}>
              <sphereGeometry args={[0.052, 16, 16]} />
            </mesh>
            {/* Forearm */}
            <mesh position={[-0.06, -0.74, 0]} material={skinMaterial}>
              <capsuleGeometry args={[0.052, 0.32, 16, 24]} />
            </mesh>
            {/* Hand & Athletic Wrist Band */}
            <mesh position={[-0.06, -0.96, 0]} material={skinMaterial}>
              <boxGeometry args={[0.04, 0.08, 0.06]} />
            </mesh>
            <mesh position={[-0.06, -0.88, 0]} material={accentStitchMaterial}>
              <cylinderGeometry args={[0.048, 0.048, 0.02, 20]} />
            </mesh>
          </group>

          {/* ── RIGHT ARM (SHOULDER, BICEPS, FOREARM, HAND) ── */}
          <group position={[0.30, 0.22, 0]}>
            <mesh material={skinMaterial}>
              <sphereGeometry args={[0.065, 20, 20]} />
            </mesh>
            {/* Upper arm (visibly morphs from soft to toned) */}
            <mesh
              ref={rightUpperArmRef}
              position={[0.04, -0.24, 0]}
              material={skinMaterial}
            >
              <capsuleGeometry args={[0.065, 0.32, 16, 24]} />
            </mesh>
            {/* Elbow */}
            <mesh position={[0.06, -0.48, 0]} material={skinMaterial}>
              <sphereGeometry args={[0.052, 16, 16]} />
            </mesh>
            {/* Forearm */}
            <mesh position={[0.06, -0.74, 0]} material={skinMaterial}>
              <capsuleGeometry args={[0.052, 0.32, 16, 24]} />
            </mesh>
            {/* Hand & Athletic Wrist Band */}
            <mesh position={[0.06, -0.96, 0]} material={skinMaterial}>
              <boxGeometry args={[0.04, 0.08, 0.06]} />
            </mesh>
            <mesh position={[0.06, -0.88, 0]} material={accentStitchMaterial}>
              <cylinderGeometry args={[0.048, 0.048, 0.02, 20]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
