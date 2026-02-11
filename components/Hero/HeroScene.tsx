"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export function HeroScene() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <mesh ref={meshRef} scale={2} position={[0, 0, -5]}>
      <torusKnotGeometry args={[0.5, 0.18, 48, 12]} />
      <meshBasicMaterial
        color="#262626"
        wireframe
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}
