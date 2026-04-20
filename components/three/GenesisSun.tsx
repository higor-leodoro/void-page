"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AdditiveBlending } from "three";
import { useBeatState } from "@/components/beat/useBeatState";
import type { BeatId } from "@/types/beat";

const BASE_RADIUS = 1.42;
const LIMB_COLOR_HEX = "#3D3DE0";
const CORE_COLOR_HEX = "#F5F0FF";

type Keyframe = {
  pos: THREE.Vector3;
  scale: number;
  intensity: number;
};

const KEYFRAMES: Record<BeatId, Keyframe> = {
  0: { pos: new THREE.Vector3(-1.8, 0.55, -1.6), scale: 0.75, intensity: 0.35 },
  1: { pos: new THREE.Vector3(-0.9, 0.5, -1.3), scale: 0.85, intensity: 0.55 },
  2: { pos: new THREE.Vector3(-0.05, 0.45, -1.05), scale: 0.95, intensity: 0.75 },
  3: { pos: new THREE.Vector3(0.3, 0.42, -0.9), scale: 1.02, intensity: 0.9 },
  4: { pos: new THREE.Vector3(0.52, 0.41, -0.82), scale: 1.08, intensity: 1.05 },
  5: { pos: new THREE.Vector3(0.6, 0.4, -0.8), scale: 1.15, intensity: 1.25 },
};

const BEAT_5_EXIT: Keyframe = {
  pos: new THREE.Vector3(1.9, 0.38, -1.05),
  scale: 1.0,
  intensity: 0.7,
};

const POST_TRANSIT_DRIFT_RATE = 0.018;

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
  const driftStartRef = useRef<number | null>(null);
  const { current, previous, isTransitioning, cameraProgressRef } =
    useBeatState();

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

  useFrame((state) => {
    const mesh = meshRef.current;
    const mat = materialRef.current;
    if (!mesh || !mat) return;

    if (reducedMotion) {
      const k = KEYFRAMES[5];
      mesh.position.copy(k.pos);
      mesh.scale.setScalar(k.scale);
      uniforms.uIntensity.value = k.intensity;
      return;
    }

    const t = THREE.MathUtils.clamp(cameraProgressRef.current.value, 0, 1);
    let scale: number;
    let intensity: number;

    if (current === 5 && isTransitioning) {
      if (t < 0.5) {
        const inner = applyLerp(KEYFRAMES[previous], KEYFRAMES[5], t * 2, workPos);
        scale = inner.scale;
        intensity = inner.intensity;
      } else {
        const inner = applyLerp(KEYFRAMES[5], BEAT_5_EXIT, (t - 0.5) * 2, workPos);
        scale = inner.scale;
        intensity = inner.intensity;
      }
      driftStartRef.current = null;
    } else if (current === 5 && !isTransitioning) {
      if (driftStartRef.current === null) {
        driftStartRef.current = state.clock.elapsedTime;
      }
      const driftT = state.clock.elapsedTime - driftStartRef.current;
      workPos.copy(BEAT_5_EXIT.pos);
      workPos.x += driftT * POST_TRANSIT_DRIFT_RATE;
      scale = BEAT_5_EXIT.scale;
      intensity = BEAT_5_EXIT.intensity;
    } else if (isTransitioning) {
      const inner = applyLerp(KEYFRAMES[previous], KEYFRAMES[current], t, workPos);
      scale = inner.scale;
      intensity = inner.intensity;
      driftStartRef.current = null;
    } else {
      const k = KEYFRAMES[current];
      workPos.copy(k.pos);
      scale = k.scale;
      intensity = k.intensity;
      driftStartRef.current = null;
    }

    mesh.position.copy(workPos);
    mesh.scale.setScalar(scale);
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
