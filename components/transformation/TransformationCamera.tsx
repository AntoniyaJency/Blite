'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp, lerp, smoothstep } from '../../lib/animations/transformationTimeline';

interface TransformationCameraProps {
  scrollProgress: React.MutableRefObject<number>;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CINEMATIC TRANSFORMATION CAMERA
 * ─────────────────────────────────────────────────────────────────────────────
 * Strict requirement:
 * - 80-90% full-body visibility throughout the entire 90 days.
 * - Stable reference angle allowing direct comparison of waist, hips, abdomen,
 *   arms, thighs, and posture.
 * - Camera movement never obscures or hides the body transformation.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function TransformationCamera({
  scrollProgress,
  mousePos,
}: TransformationCameraProps) {
  const currentPos = useRef(new THREE.Vector3(0, 1.42, 4.8));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.15, 0));

  useFrame((state) => {
    const p = clamp(scrollProgress.current, 0, 1);

    // Camera coordinates:
    // Day 01: Distance 4.8m, stable frontal angle [0, 1.42, 4.8]
    // Day 30: Moves closer [0, 1.38, 4.4]
    // Day 60: Subtle three-quarter orbit [0.35, 1.35, 4.1]
    // Day 90: Centered hero framing [0, 1.32, 3.8]
    // Outro: Slight pull back into wide space [0, 1.38, 4.5]
    let targetX = 0;
    let targetY = 1.42;
    let targetZ = 4.8;
    let targetLookAtY = 1.15;

    if (p < 0.33) {
      const t = smoothstep(0, 0.33, p);
      targetX = lerp(0.0, -0.12, t);
      targetY = lerp(1.42, 1.38, t);
      targetZ = lerp(4.8, 4.4, t);
      targetLookAtY = lerp(1.15, 1.18, t);
    } else if (p < 0.66) {
      const t = smoothstep(0.33, 0.66, p);
      targetX = lerp(-0.12, 0.35, t);
      targetY = lerp(1.38, 1.35, t);
      targetZ = lerp(4.4, 4.1, t);
      targetLookAtY = lerp(1.18, 1.20, t);
    } else if (p < 0.92) {
      const t = smoothstep(0.66, 0.92, p);
      targetX = lerp(0.35, 0.0, t);
      targetY = lerp(1.35, 1.32, t);
      targetZ = lerp(4.1, 3.8, t);
      targetLookAtY = lerp(1.20, 1.20, t);
    } else {
      const t = smoothstep(0.92, 1.0, p);
      targetX = 0.0;
      targetY = lerp(1.32, 1.38, t);
      targetZ = lerp(3.8, 4.5, t);
      targetLookAtY = 1.20;
    }

    // Gentle micro-parallax offset from mouse (does not fight scroll)
    const mx = mousePos.current.x * 0.10;
    const my = mousePos.current.y * 0.06;

    currentPos.current.x += (targetX + mx - currentPos.current.x) * 0.08;
    currentPos.current.y += (targetY + my - currentPos.current.y) * 0.08;
    currentPos.current.z += (targetZ - currentPos.current.z) * 0.08;

    currentLookAt.current.y += (targetLookAtY - currentLookAt.current.y) * 0.08;

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(0, currentLookAt.current.y, 0);
  });

  return null;
}
