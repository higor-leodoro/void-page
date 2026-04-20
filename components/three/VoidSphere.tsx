"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useBeatState } from "@/components/beat/useBeatState";

const BREATHE_PERIOD = 7.0;
const BREATHE_AMPLITUDE = 0.006;
const IDLE_ROT = 0.018;
const TRANSITION_ROT = 0.05;

export function VoidSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isTransitioning } = useBeatState();

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (reducedMotion) {
      mesh.scale.setScalar(1);
      return;
    }
    const t = state.clock.elapsedTime;
    const breath =
      1 + Math.sin((t / BREATHE_PERIOD) * Math.PI * 2) * BREATHE_AMPLITUDE;
    mesh.scale.setScalar(breath);
    mesh.rotation.y += delta * (isTransitioning ? TRANSITION_ROT : IDLE_ROT);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0.6, 0.4, 0]}
      castShadow={false}
      receiveShadow={false}
    >
      <sphereGeometry args={[1.25, 96, 96]} />
      <meshPhysicalMaterial
        color="#040416"
        metalness={0.6}
        roughness={0.34}
        clearcoat={0.55}
        clearcoatRoughness={0.22}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}
