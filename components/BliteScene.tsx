'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, Sparkles, TorusKnot } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function PowerObject() {
  const knot = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (knot.current) {
      knot.current.rotation.x += delta * 0.18;
      knot.current.rotation.y += delta * 0.34;
      knot.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
    }
    if (halo.current) {
      halo.current.rotation.z -= delta * 0.1;
      halo.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.035);
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.55}>
      <group scale={1.15}>
        <mesh ref={halo} rotation={[Math.PI / 2.4, 0.15, 0]}>
          <torusGeometry args={[1.72, 0.012, 16, 128]} />
          <meshBasicMaterial color="#d5a8ff" transparent opacity={0.5} />
        </mesh>
        <TorusKnot ref={knot} args={[1.15, 0.34, 220, 36, 2, 3]}>
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.65}
            chromaticAberration={0.09}
            anisotropy={0.35}
            distortion={0.28}
            distortionScale={0.35}
            temporalDistortion={0.16}
            color="#a052ff"
            roughness={0.12}
            transmission={0.98}
          />
        </TorusKnot>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.47}>
          <torusGeometry args={[1.15, 0.012, 12, 96]} />
          <meshBasicMaterial color="#ff8de0" transparent opacity={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

export default function BliteScene() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5.2], fov: 42 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.4} color="#af7bff" />
      <pointLight position={[3, 3, 4]} intensity={16} color="#f8b5ff" />
      <pointLight position={[-4, -2, 2]} intensity={9} color="#5f20d4" />
      <PowerObject />
      <Sparkles count={90} scale={6} size={2} speed={0.35} color="#d4a7ff" />
      <Environment preset="night" />
    </Canvas>
  );
}
