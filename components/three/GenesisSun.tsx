"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
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
uniform float uTime;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  float facing = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
  float rim = 1.0 - facing;
  float alpha = pow(rim, 2.0 + sin(uTime * 4.0) * 0.8); 
  float angle = atan(vNormal.y, vNormal.x);
  float n = vnoise(vec2(angle * 3.0, uTime * 1.5)) * 2.0 - 1.0;
  alpha *= 1.0 + n * 0.7;
  float colMix = smoothstep(0.35, 1.0, rim);
  vec3 col = mix(uInnerColor, uOuterColor, colMix);
  gl_FragColor = vec4(col, alpha * uOpacity);
}
`;

function makeCoreMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: SUN_VERT,
    fragmentShader: CORE_FRAG,
    uniforms: {
      uCenterColor: { value: new THREE.Color("#FFF") },
      uSurfaceColor: { value: new THREE.Color("#FFF") },
      uIntensity: { value: 3.0 },
    },
    toneMapped: false,
  });
}

function makeCoronaMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: SUN_VERT,
    fragmentShader: CORONA_FRAG,
    uniforms: {
      uInnerColor: { value: new THREE.Color("#2B2BC2") },
      uOuterColor: { value: new THREE.Color("#14145C") },
      uOpacity: { value: 1.0 },
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}

export function GenesisSun() {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const coronaMeshRef = useRef<THREE.Mesh>(null);
  const sunRef = useSunRef();

  const coreMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const coronaMatRef = useRef<THREE.ShaderMaterial | null>(null);

  useLayoutEffect(() => {
    const coreMat = makeCoreMaterial();
    const coronaMat = makeCoronaMaterial();
    coreMatRef.current = coreMat;
    coronaMatRef.current = coronaMat;
    const coreMesh = coreMeshRef.current;
    const coronaMesh = coronaMeshRef.current;
    if (coreMesh) {
      (coreMesh.material as THREE.Material | undefined)?.dispose?.();
      coreMesh.material = coreMat;
    }
    if (coronaMesh) {
      (coronaMesh.material as THREE.Material | undefined)?.dispose?.();
      coronaMesh.material = coronaMat;
    }
    return () => {
      coreMat.dispose();
      coronaMat.dispose();
    };
  }, []);

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

  useFrame((state) => {
    const group = groupRef.current;
    const coreMat = coreMatRef.current;
    const coronaMat = coronaMatRef.current;
    if (!group || !coreMat || !coronaMat) return;

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

    coreMat.uniforms.uIntensity.value = intensity * CORE_INTENSITY_SCALE;
    coronaMat.uniforms.uOpacity.value = intensity * CORONA_OPACITY_SCALE;
    coronaMat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreMeshRef}>
        <sphereGeometry args={[CORE_RADIUS, 64, 64]} />
      </mesh>
      <mesh ref={coronaMeshRef}>
        <sphereGeometry args={[CORE_RADIUS * CORONA_RADIUS_MULT, 64, 64]} />
      </mesh>
    </group>
  );
}
