"use client";

import { useMemo } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
varying vec3 vViewPos;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
varying vec3 vViewPos;
uniform vec3 uInner;
uniform vec3 uMid;
uniform vec3 uOuter;
void main() {
  vec3 dir = normalize(vViewPos);
  // fresnel-ish term based on view z
  float t = clamp(-dir.z, 0.0, 1.0);
  vec3 col = mix(uOuter, uMid, smoothstep(0.0, 0.55, t));
  col = mix(col, uInner, smoothstep(0.55, 1.0, t));
  gl_FragColor = vec4(col, 1.0);
}
`;

export function SpaceBackground() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uInner: { value: new THREE.Color("#0A0A18") },
        uMid: { value: new THREE.Color("#080818") },
        uOuter: { value: new THREE.Color("#030308") },
      },
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh material={material} renderOrder={-1}>
      <icosahedronGeometry args={[40, 3]} />
    </mesh>
  );
}
