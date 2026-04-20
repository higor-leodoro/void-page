"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const RADII = [2.0, 3.2, 4.8];

export function MethodRings() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * 0.01;
  });

  return (
    <group ref={group} rotation={[-Math.PI / 2, 0, 0]}>
      {RADII.map((r, i) => (
        <mesh key={i}>
          <torusGeometry args={[r, 0.008, 8, 128]} />
          <meshBasicMaterial color="#2B2BC2" transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}
