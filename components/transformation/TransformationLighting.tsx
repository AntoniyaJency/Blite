'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp, lerp, smoothstep } from '../../lib/animations/transformationTimeline';

interface TransformationLightingProps {
  scrollProgress: React.MutableRefObject<number>;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICALLY BELIEVABLE STUDIO LIGHTING
 * ─────────────────────────────────────────────────────────────────────────────
 * Large soft key light, soft fill, subtle rim, and soft floor shadow.
 * Form-revealing, neutral-warm studio lighting that makes skin look like skin.
 * Zero neon, zero cyberpunk, zero gaming lights.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function TransformationLighting({
  scrollProgress,
}: TransformationLightingProps) {
  const keyLightRef   = useRef<THREE.DirectionalLight>(null!);
  const fillLightRef  = useRef<THREE.PointLight>(null!);
  const rimLightRef   = useRef<THREE.DirectionalLight>(null!);
  const softBounceRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const p = clamp(scrollProgress.current, 0, 1);

    // Studio lighting evolves from soft & subdued (Day 01) to crisp & dimensional (Day 90)
    const keyIntensity   = lerp(1.8, 3.8, p);
    const fillIntensity  = lerp(0.6, 1.4, p);
    const rimIntensity   = lerp(0.8, 3.2, smoothstep(0.2, 0.9, p));
    const bounceIntensity= lerp(0.4, 1.0, p);

    if (keyLightRef.current)   keyLightRef.current.intensity   = keyIntensity;
    if (fillLightRef.current)  fillLightRef.current.intensity  = fillIntensity;
    if (rimLightRef.current)   rimLightRef.current.intensity   = rimIntensity;
    if (softBounceRef.current) softBounceRef.current.intensity = bounceIntensity;
  });

  return (
    <>
      {/* Neutral ambient studio base */}
      <ambientLight intensity={0.35} color="#f8f4f9" />

      {/* Large Soft Key Light (high-angle studio softbox, casts soft directional shadow) */}
      <directionalLight
        ref={keyLightRef}
        position={[2.5, 4.2, 3.2]}
        color="#fff9f5"
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Soft Fill Light (cool studio bounce opposite to key light) */}
      <pointLight
        ref={fillLightRef}
        position={[-3.0, 2.0, 2.5]}
        color="#eae5f2"
        intensity={0.6}
        distance={14}
      />

      {/* Realistic Contour Rim Light (reveals muscular definition and waist curve) */}
      <directionalLight
        ref={rimLightRef}
        position={[-2.8, 2.4, -2.2]}
        color="#f5e6ff"
        intensity={0.8}
      />

      {/* Gentle Studio Floor Bounce */}
      <pointLight
        ref={softBounceRef}
        position={[0, 0.1, 0.5]}
        color="#d8cce6"
        intensity={0.4}
        distance={4}
      />
    </>
  );
}
