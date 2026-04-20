"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const RADIUS = 3.0;
const VESSEL_R = 0.35;

type Vessel = { phase: number };

const VESSELS: Vessel[] = [
  { phase: 0 },
  { phase: Math.PI / 2 },
  { phase: Math.PI },
  { phase: (3 * Math.PI) / 2 },
];

export function DemoVessels() {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * 0.2;
    for (let i = 0; i < VESSELS.length; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const a = t + VESSELS[i].phase;
      m.position.set(Math.cos(a) * RADIUS, Math.sin(a * 0.5) * 0.3, Math.sin(a) * RADIUS);
      m.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group}>
      <mesh
        ref={(el) => {
          refs.current[0] = el;
        }}
      >
        <sphereGeometry args={[VESSEL_R, 48, 48]} />
        <meshPhysicalMaterial color="#ECE4D4" roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh
        ref={(el) => {
          refs.current[1] = el;
        }}
      >
        <sphereGeometry args={[VESSEL_R, 48, 48]} />
        <meshPhysicalMaterial
          color="#2B2BC2"
          clearcoat={0.9}
          clearcoatRoughness={0.2}
          metalness={0.3}
          roughness={0.35}
        />
      </mesh>
      <mesh
        ref={(el) => {
          refs.current[2] = el;
        }}
      >
        <sphereGeometry args={[VESSEL_R, 48, 48]} />
        <meshPhysicalMaterial
          color="#0A0A18"
          transmission={0.9}
          ior={1.4}
          thickness={0.5}
          roughness={0.1}
          metalness={0}
          transparent
        />
      </mesh>
      <mesh
        ref={(el) => {
          refs.current[3] = el;
        }}
      >
        <sphereGeometry args={[VESSEL_R, 24, 24]} />
        <meshBasicMaterial color="#8A8476" wireframe />
      </mesh>
    </group>
  );
}
