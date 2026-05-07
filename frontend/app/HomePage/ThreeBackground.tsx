"use client";

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";

import {
  forwardRef,
  MutableRefObject,
} from "react";

interface AnimationState {
  x: number;
  scale: number;
}

interface AnimatedRProps {
  animationState: AnimationState;
}

const AnimatedR = forwardRef<
  THREE.Group,
  AnimatedRProps
>(({ animationState }, ref) => {
  useFrame((state) => {
    // 🔥 safety checks
    if (!ref || typeof ref === "function") return;

    const mesh = (
      ref as MutableRefObject<THREE.Group | null>
    ).current;

    if (!mesh) return;

    // 🔥 smooth GSAP sync
    mesh.position.x +=
      (animationState.x - mesh.position.x) *
      0.06;

    const scale =
      mesh.scale.x +
      (animationState.scale - mesh.scale.x) *
        0.06;

    mesh.scale.set(scale, scale, scale);

    // 🔥 floating effect
    mesh.position.y =
      Math.sin(state.clock.elapsedTime) * 0.1;

    // 🔥 slow rotation
    mesh.rotation.y += 0.01;
  });

  return (
    <group ref={ref} position={[2.5, 0, 0]}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={1.5}
          height={0.4}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.04}
          bevelSegments={8}
        >
          R

          <meshPhysicalMaterial
            color="#4ADE80"
            emissive="#4ADE80"
            emissiveIntensity={0.2}
            transmission={0.9}
            thickness={0.5}
            roughness={0.15}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.85}
          />
        </Text3D>
      </Center>
    </group>
  );
});

AnimatedR.displayName = "AnimatedR";

interface ThreeBackgroundProps {
  sphereRef: MutableRefObject<THREE.Group | null>;
  animationState: AnimationState;
}

export default function ThreeBackground({
  sphereRef,
  animationState,
}: ThreeBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6] }}>
        {/* 🔥 lighting */}
        <ambientLight intensity={0.2} />

        <pointLight
          position={[5, 5, 5]}
          intensity={1.5}
        />

        <pointLight
          position={[-5, -5, -5]}
          intensity={1}
        />

        <directionalLight
          position={[0, 5, 5]}
          intensity={1}
        />

        <pointLight
          position={[-4, -4, -4]}
          intensity={1}
        />

        <AnimatedR
          ref={sphereRef}
          animationState={animationState}
        />
      </Canvas>
    </div>
  );
}