'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ForgeStrengthObject from './ForgeStrengthObject';

interface HeroCanvasProps {
  scrollProgress: React.MutableRefObject<number>;
}

function CameraRig({
  scrollProgress,
  isMobile,
}: {
  scrollProgress: React.MutableRefObject<number>;
  isMobile: boolean;
}) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0, isMobile ? 6.2 : 5.4));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const p = scrollProgress.current || 0;

    // Cinematic camera positions along scrub timeline:
    // 0.0 -> Wide heroic stance
    // 0.5 -> Macro push-in on the precision knurled grip & collar
    // 1.0 -> Transition sweep down into next section
    const targetZ = isMobile
      ? 6.2 - p * 1.8
      : 5.4 - Math.sin(p * Math.PI * 0.9) * 2.1;
    const targetX = isMobile ? 0 : (1 - p) * 0.2 + p * 0.6;
    const targetY = (1 - p) * 0.1 - p * 0.45;

    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetX, 4.5, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetY, 4.5, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetZ, 4.5, delta);

    const lookTargetX = isMobile ? 0 : (1 - p) * 0.5;
    const lookTargetY = -p * 0.2;
    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, lookTargetX, 4.5, delta);
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, lookTargetY, 4.5, delta);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

function LightingRig({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const rimLeftRef = useRef<THREE.PointLight>(null);
  const rimRightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    const p = scrollProgress.current || 0;

    // Shift lighting as user scrolls: rim and specular intensity increase dramatically
    if (rimLeftRef.current) {
      rimLeftRef.current.intensity = 35 + p * 45;
      rimLeftRef.current.position.set(-4.5 + p * 1.5, 3.5, 3.0);
    }

    if (rimRightRef.current) {
      rimRightRef.current.intensity = 20 + p * 50;
      rimRightRef.current.position.set(4.5, 2.0 - p * 2.0, 2.5);
    }

    if (spotLightRef.current) {
      spotLightRef.current.intensity = 55 + (1 - p) * 35;
    }
  });

  return (
    <>
      {/* Deep Studio Ambient Violet Darkness */}
      <ambientLight intensity={0.75} color="#0c051a" />

      {/* Main Overhead Key Spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[0, 6.5, 4.5]}
        angle={0.65}
        penumbra={0.85}
        intensity={80}
        color="#ffffff"
        castShadow={false}
      />

      {/* Radiant Electric Violet Rim Light (Left) */}
      <pointLight
        ref={rimLeftRef}
        position={[-5, 3.5, 3]}
        intensity={45}
        color="#a855f7"
        distance={20}
      />

      {/* Blite Signature Hot Magenta Rim Light (Right) */}
      <pointLight
        ref={rimRightRef}
        position={[5, 2, 2.5]}
        intensity={35}
        color="#ec1380"
        distance={18}
      />

      {/* Under-glow Deep Amethyst Fill Light */}
      <directionalLight position={[0, -4, 2]} intensity={1.2} color="#2b0a48" />
    </>
  );
}

export default function HeroCanvas({ scrollProgress }: HeroCanvasProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <LightingRig scrollProgress={scrollProgress} />
          <CameraRig scrollProgress={scrollProgress} isMobile={isMobile} />
          <ForgeStrengthObject scrollProgress={scrollProgress} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
