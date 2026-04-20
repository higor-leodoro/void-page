"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AdditiveBlending } from "three";
import { useBeatState } from "@/components/beat/useBeatState";
import { useSunRef } from "./sunRef";
import type { BeatId } from "@/types/beat";

const BASE_RADIUS = 1.42;
const LIMB_COLOR_HEX = "#3D3DE0";
const CORE_COLOR_HEX = "#F5F0FF";
const IDLE_ROT = 0.005;

type Keyframe = {
  pos: THREE.Vector3;
  scale: number;
  intensity: number;
};

const KEYFRAMES: Record<BeatId, Keyframe> = {
  0: { pos: new THREE.Vector3(1.6, 0.1, -1.2), scale: 0.55, intensity: 0.45 },
  1: { pos: new THREE.Vector3(1.1, 0.2, -1.0), scale: 0.65, intensity: 0.65 },
  2: { pos: new THREE.Vector3(0.5, 0.3, -0.9), scale: 0.70, intensity: 0.80 },
  3: { pos: new THREE.Vector3(0.1, 0.4, -0.8), scale: 0.75, intensity: 0.95 },
  4: { pos: new THREE.Vector3(-0.1, 0.4, -0.7), scale: 0.85, intensity: 1.25 },
  5: { pos: new THREE.Vector3(1.8, 0.3, -1.1), scale: 0.60, intensity: 0.90 },
};

const VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uLimbColor;
  uniform vec3 uCoreColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  void main() {
    float n = clamp(vNormal.z, 0.0, 1.0);
    float coreMix = pow(n, 3.5);
    vec3 col = mix(uLimbColor, uCoreColor, coreMix);
    float brightness = pow(n, 1.2) * uIntensity * 1.9;
    float alpha = pow(n, 1.6);
    gl_FragColor = vec4(col * brightness, alpha);
  }
`;

function applyLerp(
  a: Keyframe,
  b: Keyframe,
  t: number,
  outPos: THREE.Vector3,
): { scale: number; intensity: number } {
  outPos.lerpVectors(a.pos, b.pos, t);
  return {
    scale: THREE.MathUtils.lerp(a.scale, b.scale, t),
    intensity: THREE.MathUtils.lerp(a.intensity, b.intensity, t),
  };
}

export function GenesisSun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { current, previous, isTransitioning, cameraProgressRef } =
    useBeatState();
  const sunRef = useSunRef();

  const uniforms = useMemo(
    () => ({
      uLimbColor: { value: new THREE.Color(LIMB_COLOR_HEX) },
      uCoreColor: { value: new THREE.Color(CORE_COLOR_HEX) },
      uIntensity: { value: 1.0 },
    }),
    [],
  );
  const workPos = useMemo(() => new THREE.Vector3(), []);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (sunRef && sunRef.current !== mesh) {
      sunRef.current = mesh;
    }

    if (reducedMotion) {
      const k = KEYFRAMES[current];
      mesh.position.copy(k.pos);
      mesh.scale.setScalar(k.scale);
      uniforms.uIntensity.value = k.intensity;
      return;
    }

    const t = THREE.MathUtils.clamp(cameraProgressRef.current.value, 0, 1);
    let scale: number;
    let intensity: number;

    if (isTransitioning) {
      const inner = applyLerp(KEYFRAMES[previous], KEYFRAMES[current], t, workPos);
      scale = inner.scale;
      intensity = inner.intensity;
    } else {
      const k = KEYFRAMES[current];
      workPos.copy(k.pos);
      scale = k.scale;
      intensity = k.intensity;
    }

    mesh.position.copy(workPos);
    mesh.scale.setScalar(scale);
    mesh.rotation.z += delta * IDLE_ROT;
    uniforms.uIntensity.value = intensity;
  });

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      <sphereGeometry args={[BASE_RADIUS, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
