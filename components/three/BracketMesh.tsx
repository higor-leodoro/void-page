"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { useBeatState } from "@/components/beat/useBeatState";

const BRACKET_SVG = `
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M25.6 0V6.4L9.6 6.4C7.83 6.4 6.4 7.83 6.4 9.6L6.4 25.6H0L0 12.8L12.8 0L25.6 0Z"/>
  <path d="M6.4 32L6.4 25.6L22.4 25.6C24.17 25.6 25.6 24.17 25.6 22.4L25.6 6.4L32 6.4L32 19.2L19.2 32H6.4Z"/>
</svg>
`;

function useBracketGeometry() {
  return useMemo(() => {
    const loader = new SVGLoader();
    const data = loader.parse(BRACKET_SVG);
    const shapes: THREE.Shape[] = [];
    for (const path of data.paths) {
      for (const shape of SVGLoader.createShapes(path)) {
        shapes.push(shape);
      }
    }
    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: 2.4,
      curveSegments: 18,
      bevelEnabled: true,
      bevelSize: 0.35,
      bevelThickness: 0.35,
      bevelSegments: 4,
    });
    geometry.scale(1, -1, 1);
    geometry.center();
    geometry.scale(1 / 32, 1 / 32, 1 / 32);
    geometry.computeVertexNormals();
    return geometry;
  }, []);
}

const BREATHE_PERIOD = 6;
const BREATHE_AMPLITUDE = 0.008;
const IDLE_ROT_SPEED = 0.0018;

export function BracketMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useBracketGeometry();
  const { isTransitioning } = useBeatState();

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    if (reducedMotion) {
      meshRef.current.scale.setScalar(1);
      return;
    }
    const breath =
      1 + Math.sin((time / BREATHE_PERIOD) * Math.PI * 2) * BREATHE_AMPLITUDE;
    meshRef.current.scale.setScalar(breath);
    if (!isTransitioning) {
      meshRef.current.rotation.y += delta * IDLE_ROT_SPEED * 0.5;
    } else {
      meshRef.current.rotation.y += delta * IDLE_ROT_SPEED * 2.2;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[2.2, 0.2, 0]}
      rotation={[0, -0.15, 0]}
      scale={2.6}
      castShadow={false}
      receiveShadow={false}
    >
      <meshStandardMaterial
        color="#4A463F"
        metalness={0.72}
        roughness={0.28}
        envMapIntensity={0.9}
        emissive="#0A0A18"
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}
