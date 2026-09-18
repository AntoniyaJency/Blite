'use client';

import React from 'react';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MINIMALIST BLITE STUDIO ENVIRONMENT
 * ─────────────────────────────────────────────────────────────────────────────
 * Subdued dark luxury gym floor with soft shadows and subtle architectural lines.
 * Never distracts from the female human subject.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function TransformationEnvironment() {
  return (
    <group>
      {/* High-grade matte dark studio floor with subtle reflections */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0b0614"
          roughness={0.28}
          metalness={0.75}
        />
      </mesh>

      {/* Subtle floor contact shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} />
      </mesh>

      {/* Understated concentric staging rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.30, 1.32, 64]} />
        <meshBasicMaterial color="#9d4edd" transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.80, 1.82, 64]} />
        <meshBasicMaterial color="#ec1380" transparent opacity={0.14} />
      </mesh>
    </group>
  );
}
