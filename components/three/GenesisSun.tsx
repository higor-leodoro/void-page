"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useBeatState } from "@/components/beat/useBeatState";
import { useSunRef } from "./sunRef";
import type { BeatId } from "@/types/beat";

const BASE_RADIUS = 0.8;
const CORE_RADIUS = 0.5;
const CORONA_RADIUS_MULT = 1.1;
const CORE_INTENSITY_SCALE = 4.5;
const CORONA_OPACITY_SCALE = 1.9;

type Keyframe = {
  pos: THREE.Vector3;
  scale: number;
  intensity: number;
};

const KEYFRAMES: Record<BeatId, Keyframe> = {
  0: { pos: new THREE.Vector3(2.3, 0.1, -1.2), scale: 0.55, intensity: 0.45 },
  1: { pos: new THREE.Vector3(1.1, 0.2, -1.0), scale: 0.65, intensity: 0.65 },
  2: { pos: new THREE.Vector3(0.5, 0.3, -0.9), scale: 0.7, intensity: 0.8 },
  3: { pos: new THREE.Vector3(0.1, 0.4, -0.8), scale: 0.75, intensity: 0.95 },
  4: { pos: new THREE.Vector3(-0.1, 0.4, -0.7), scale: 0.85, intensity: 1.25 },
  5: { pos: new THREE.Vector3(1.8, 0.3, -1.1), scale: 0.6, intensity: 0 },
};

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

const SUN_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const CORE_FRAG = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
uniform vec3 uCenterColor;
uniform vec3 uSurfaceColor;
uniform float uIntensity;
void main() {
  float facing = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
  float t = smoothstep(0.7, 1.0, facing);
  vec3 col = mix(uSurfaceColor, uCenterColor, t);
  gl_FragColor = vec4(col * uIntensity, 1.0);
}
`;

const CORONA_FRAG = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;
uniform float uOpacity;
void main() {
  float facing = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
  float rim = 1.0 - facing;
  float alpha = pow(rim, 2.2);
  float colMix = smoothstep(0.35, 1.0, rim);
  vec3 col = mix(uInnerColor, uOuterColor, colMix);
  gl_FragColor = vec4(col, alpha * uOpacity);
}
`;

export function GenesisSun() {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const coronaMeshRef = useRef<THREE.Mesh>(null);
  const sunRef = useSunRef();

  const coreUniforms = useMemo(
    () => ({
      uCenterColor: { value: new THREE.Color("#FFF") },
      uSurfaceColor: { value: new THREE.Color("#FFF") },
      uIntensity: { value: 3.0 },
    }),
    [],
  );

  const coronaUniforms = useMemo(
    () => ({
      uInnerColor: { value: new THREE.Color("#2B2BC2") },
      uOuterColor: { value: new THREE.Color("#14145C") },
      uOpacity: { value: 1.0 },
    }),
    [],
  );

  useEffect(() => {
    if (sunRef && coreMeshRef.current) {
      sunRef.current = coreMeshRef.current;
    }
    return () => {
      if (sunRef) sunRef.current = null;
    };
  }, [sunRef]);

  const { current, previous, isTransitioning, cameraProgressRef } =
    useBeatState();
  const workPos = useMemo(() => new THREE.Vector3(), []);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame(() => {
    const group = groupRef.current;
    const coreMesh = coreMeshRef.current;
    const coronaMesh = coronaMeshRef.current;
    if (!group || !coreMesh || !coronaMesh) return;

    let scale: number;
    let intensity: number;

    if (reducedMotion) {
      const k = KEYFRAMES[current];
      workPos.copy(k.pos);
      scale = k.scale;
      intensity = k.intensity;
    } else {
      const t = THREE.MathUtils.clamp(cameraProgressRef.current.value, 0, 1);
      if (isTransitioning) {
        const inner = applyLerp(
          KEYFRAMES[previous],
          KEYFRAMES[current],
          t,
          workPos,
        );
        scale = inner.scale;
        intensity = inner.intensity;
      } else {
        const k = KEYFRAMES[current];
        workPos.copy(k.pos);
        scale = k.scale;
        intensity = k.intensity;
      }
    }

    group.position.copy(workPos);
    group.scale.setScalar(scale * BASE_RADIUS);

    const coreMat = coreMesh.material as THREE.ShaderMaterial;
    const coronaMat = coronaMesh.material as THREE.ShaderMaterial;
    coreMat.uniforms.uIntensity.value = intensity * CORE_INTENSITY_SCALE;
    coronaMat.uniforms.uOpacity.value = intensity * CORONA_OPACITY_SCALE;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreMeshRef}>
        <sphereGeometry args={[CORE_RADIUS, 64, 64]} />
        <shaderMaterial
          vertexShader={SUN_VERT}
          fragmentShader={CORE_FRAG}
          uniforms={coreUniforms}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={coronaMeshRef}>
        <sphereGeometry args={[CORE_RADIUS * CORONA_RADIUS_MULT, 64, 64]} />
        <shaderMaterial
          vertexShader={SUN_VERT}
          fragmentShader={CORONA_FRAG}
          uniforms={coronaUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
