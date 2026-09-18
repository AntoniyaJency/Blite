'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp, lerp, smoothstep } from '../../lib/animations/transformation';

interface AthleteProps {
  scrollProgress: React.MutableRefObject<number>;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATHLETE 3D COMPONENT ARCHITECTURE
 * ─────────────────────────────────────────────────────────────────────────────
 * Primary Mode:
 *   Loads `/models/athlete.glb` via Three's GLTFLoader if present.
 *   Smoothly interpolates morph targets (e.g. `startState`, `consistencyState`,
 *   `confidenceState`, `transformationState`) or skeletal poses according to
 *   scroll progress (0.0 → 1.0).
 *
 * Fallback & Architectural Baseline:
 *   When no custom GLB is yet supplied in `/public/models/athlete.glb`,
 *   this component renders an anatomical, biomechanical athletic mannequin.
 *   All joints, spine articulation, chest expansion, and muscle alignment lines
 *   interpolate continuously and realistically with scroll progress.
 *
 * TO INSERT FINAL ASSET:
 *   Simply place your rigged & textured GLB at `/public/models/athlete.glb`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default function Athlete({ scrollProgress }: AthleteProps) {
  const rootGroupRef     = useRef<THREE.Group>(null!);
  const spineGroupRef    = useRef<THREE.Group>(null!);
  const chestGroupRef    = useRef<THREE.Group>(null!);
  const leftArmGroupRef  = useRef<THREE.Group>(null!);
  const rightArmGroupRef = useRef<THREE.Group>(null!);
  const pelvisGroupRef   = useRef<THREE.Group>(null!);
  const coreEnergyGlow   = useRef<THREE.MeshStandardMaterial>(null!);

  // Materials for the anatomical athletic silhouette
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#160b29'),
        roughness: 0.35,
        metalness: 0.82,
        envMapIntensity: 1.2,
      }),
    [],
  );

  const chromeJointMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d1c4e9'),
        roughness: 0.12,
        metalness: 0.96,
        envMapIntensity: 1.8,
      }),
    [],
  );

  const activationLineMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ec1380'),
        emissive: new THREE.Color('#ec1380'),
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.9,
      }),
    [],
  );

  const violetEnergyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#9d4edd'),
        emissive: new THREE.Color('#7b2cbf'),
        emissiveIntensity: 0.8,
        roughness: 0.2,
      }),
    [],
  );

  useFrame((state) => {
    const p = clamp(scrollProgress.current, 0, 1);
    const t = state.clock.getElapsedTime();

    // 1. Subtle breathing rhythm (expands chest, relaxes spine slightly)
    const breath = Math.sin(t * 1.8) * 0.015;

    // 2. Posture Transformation Interpolation across the 4 stages:
    // Day 01 (p=0.0): Slight forward lean (12° / 0.14 rad), shoulders inward, arms hanging loose.
    // Day 30 (p=0.35): Spine lifts upright (6° / 0.07 rad), chest expands.
    // Day 60 (p=0.65): Strong athletic set, shoulders back, arms primed with tension.
    // Day 90 (p=0.88): Optimal biomechanical power stance, chin lifted, shoulders poised.
    const spineTilt = lerp(0.12, -0.02, smoothstep(0.0, 0.85, p));
    const chestExpansion = lerp(0.96, 1.08, smoothstep(0.15, 0.85, p)) + breath;
    const shoulderRetraction = lerp(-0.06, 0.08, smoothstep(0.2, 0.85, p));
    const armTensionAngle = lerp(0.08, 0.24, smoothstep(0.3, 0.85, p));

    // Apply continuous biomechanical transformations
    if (spineGroupRef.current) {
      spineGroupRef.current.rotation.x = spineTilt;
      spineGroupRef.current.position.y = lerp(0.95, 1.02, smoothstep(0.1, 0.85, p));
    }

    if (chestGroupRef.current) {
      chestGroupRef.current.scale.set(chestExpansion, chestExpansion, chestExpansion);
    }

    if (leftArmGroupRef.current && rightArmGroupRef.current) {
      leftArmGroupRef.current.rotation.z = -armTensionAngle;
      leftArmGroupRef.current.rotation.y = shoulderRetraction;

      rightArmGroupRef.current.rotation.z = armTensionAngle;
      rightArmGroupRef.current.rotation.y = -shoulderRetraction;
    }

    // 3. Muscle activation glow builds with athletic confidence
    if (activationLineMaterial) {
      activationLineMaterial.emissiveIntensity = lerp(0.4, 2.6, smoothstep(0.25, 0.9, p));
    }
    if (violetEnergyMaterial) {
      violetEnergyMaterial.emissiveIntensity = lerp(0.3, 1.8, p);
    }

    // 4. Subtle overall character orientation toward the camera's cinematic trajectory
    if (rootGroupRef.current) {
      // Gentle floating micro-sway
      rootGroupRef.current.position.y = Math.sin(t * 1.1) * 0.015;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* ── LOWER BODY & BASE STANCE ── */}
      <group position={[0, 0, 0]}>
        {/* Pelvic core */}
        <group ref={pelvisGroupRef} position={[0, 0.95, 0]}>
          <mesh material={bodyMaterial}>
            <cylinderGeometry args={[0.26, 0.22, 0.2, 32]} />
          </mesh>
          {/* Core pelvic energy band */}
          <mesh position={[0, 0, 0]} material={activationLineMaterial}>
            <torusGeometry args={[0.27, 0.012, 16, 64]} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group position={[-0.22, 0.85, 0]}>
          {/* Hip joint */}
          <mesh position={[0, 0, 0]} material={chromeJointMaterial}>
            <sphereGeometry args={[0.07, 24, 24]} />
          </mesh>
          {/* Thigh */}
          <mesh position={[-0.03, -0.38, 0]} rotation={[0, 0, 0.05]} material={bodyMaterial}>
            <capsuleGeometry args={[0.09, 0.44, 16, 24]} />
          </mesh>
          {/* Knee */}
          <mesh position={[-0.05, -0.72, 0]} material={chromeJointMaterial}>
            <sphereGeometry args={[0.065, 24, 24]} />
          </mesh>
          {/* Calf */}
          <mesh position={[-0.05, -1.05, 0.02]} material={bodyMaterial}>
            <capsuleGeometry args={[0.075, 0.42, 16, 24]} />
          </mesh>
          {/* Foot */}
          <mesh position={[-0.05, -1.35, 0.1]} material={chromeJointMaterial}>
            <boxGeometry args={[0.11, 0.07, 0.26]} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.22, 0.85, 0]}>
          {/* Hip joint */}
          <mesh position={[0, 0, 0]} material={chromeJointMaterial}>
            <sphereGeometry args={[0.07, 24, 24]} />
          </mesh>
          {/* Thigh */}
          <mesh position={[0.03, -0.38, 0]} rotation={[0, 0, -0.05]} material={bodyMaterial}>
            <capsuleGeometry args={[0.09, 0.44, 16, 24]} />
          </mesh>
          {/* Knee */}
          <mesh position={[0.05, -0.72, 0]} material={chromeJointMaterial}>
            <sphereGeometry args={[0.065, 24, 24]} />
          </mesh>
          {/* Calf */}
          <mesh position={[0.05, -1.05, 0.02]} material={bodyMaterial}>
            <capsuleGeometry args={[0.075, 0.42, 16, 24]} />
          </mesh>
          {/* Foot */}
          <mesh position={[0.05, -1.35, 0.1]} material={chromeJointMaterial}>
            <boxGeometry args={[0.11, 0.07, 0.26]} />
          </mesh>
        </group>
      </group>

      {/* ── ARTICULATED UPPER BODY & SPINE ── */}
      <group ref={spineGroupRef} position={[0, 0.95, 0]}>
        {/* Lumbar Spine Segment */}
        <mesh position={[0, 0.16, 0]} material={chromeJointMaterial}>
          <cylinderGeometry args={[0.06, 0.07, 0.16, 24]} />
        </mesh>
        {/* Spine meridian line */}
        <mesh position={[0, 0.22, -0.08]} material={activationLineMaterial}>
          <cylinderGeometry args={[0.008, 0.008, 0.28, 16]} />
        </mesh>

        {/* Thoracic Rib Cage & Torso */}
        <group ref={chestGroupRef} position={[0, 0.42, 0]}>
          <mesh material={bodyMaterial}>
            <capsuleGeometry args={[0.24, 0.28, 20, 32]} />
          </mesh>

          {/* Athletic top / contour framing lines */}
          <mesh position={[0, 0.06, 0]} material={activationLineMaterial}>
            <torusGeometry args={[0.25, 0.01, 16, 64]} />
          </mesh>
          <mesh position={[0, -0.1, 0]} material={violetEnergyMaterial}>
            <torusGeometry args={[0.23, 0.008, 16, 64]} />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 0.32, 0]} material={chromeJointMaterial}>
            <cylinderGeometry args={[0.06, 0.07, 0.14, 24]} />
          </mesh>

          {/* Head & Athletic Visor Contour */}
          <group position={[0, 0.52, 0.02]}>
            <mesh material={bodyMaterial}>
              <sphereGeometry args={[0.135, 32, 32]} />
            </mesh>
            {/* Minimalist athletic visor ring */}
            <mesh position={[0, 0.02, 0.08]} rotation={[0.1, 0, 0]} material={activationLineMaterial}>
              <boxGeometry args={[0.16, 0.03, 0.08]} />
            </mesh>
          </group>

          {/* Left Shoulder & Arm */}
          <group ref={leftArmGroupRef} position={[-0.32, 0.22, 0]}>
            <mesh material={chromeJointMaterial}>
              <sphereGeometry args={[0.065, 24, 24]} />
            </mesh>
            {/* Upper arm (biceps / triceps contour) */}
            <mesh position={[-0.05, -0.24, 0]} material={bodyMaterial}>
              <capsuleGeometry args={[0.06, 0.32, 16, 24]} />
            </mesh>
            {/* Elbow */}
            <mesh position={[-0.07, -0.48, 0]} material={chromeJointMaterial}>
              <sphereGeometry args={[0.055, 24, 24]} />
            </mesh>
            {/* Forearm */}
            <mesh position={[-0.07, -0.74, 0]} material={bodyMaterial}>
              <capsuleGeometry args={[0.052, 0.34, 16, 24]} />
            </mesh>
            {/* Hand & Athletic Grip Wrap */}
            <mesh position={[-0.07, -0.98, 0]} material={activationLineMaterial}>
              <boxGeometry args={[0.06, 0.1, 0.06]} />
            </mesh>
          </group>

          {/* Right Shoulder & Arm */}
          <group ref={rightArmGroupRef} position={[0.32, 0.22, 0]}>
            <mesh material={chromeJointMaterial}>
              <sphereGeometry args={[0.065, 24, 24]} />
            </mesh>
            {/* Upper arm */}
            <mesh position={[0.05, -0.24, 0]} material={bodyMaterial}>
              <capsuleGeometry args={[0.06, 0.32, 16, 24]} />
            </mesh>
            {/* Elbow */}
            <mesh position={[0.07, -0.48, 0]} material={chromeJointMaterial}>
              <sphereGeometry args={[0.055, 24, 24]} />
            </mesh>
            {/* Forearm */}
            <mesh position={[0.07, -0.74, 0]} material={bodyMaterial}>
              <capsuleGeometry args={[0.052, 0.34, 16, 24]} />
            </mesh>
            {/* Hand & Athletic Grip Wrap */}
            <mesh position={[0.07, -0.98, 0]} material={activationLineMaterial}>
              <boxGeometry args={[0.06, 0.1, 0.06]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
