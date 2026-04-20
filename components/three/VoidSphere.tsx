"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";
import { useBeatState } from "@/components/beat/useBeatState";
import { useSphereRef } from "./sphereRef";

const BREATHE_PERIOD = 7.0;
const BREATHE_AMPLITUDE = 0.006;
const IDLE_ROT = 0.018;
const TRANSITION_ROT = 0.05;

export function VoidSphere() {
  const sharedRef = useSphereRef();
  const localRef = useRef<THREE.Mesh | null>(null);
  const setRef = useCallback(
    (mesh: THREE.Mesh | null) => {
      localRef.current = mesh;
      if (sharedRef) sharedRef.current = mesh;
    },
    [sharedRef],
  );
  const { isTransitioning } = useBeatState();

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const mobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  }, []);

  useFrame((state, delta) => {
    const mesh = localRef.current;
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
      ref={setRef}
      position={[0.6, 0.4, 0]}
      castShadow={false}
      receiveShadow={false}
    >
      <sphereGeometry args={[1.25, 96, 96]} />
      <MeshTransmissionMaterial
        color="#0b0b2a"
        transmission={1}
        thickness={1.2}
        ior={1.8}
        chromaticAberration={0.06}
        distortion={0.35}
        distortionScale={0.4}
        temporalDistortion={0.08}
        roughness={0.08}
        samples={mobile ? 3 : 6}
        resolution={mobile ? 256 : 512}
        anisotropy={0.35}
        backside={false}
      />
    </mesh>
  );
}
