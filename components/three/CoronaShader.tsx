"use client";

import { useMemo } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
varying vec2 vUv;
uniform vec3 uColor;
void main() {
  vec2 p = vUv - 0.5;
  float d = length(p);
  float inner = smoothstep(0.45, 0.12, d);
  float outer = smoothstep(0.45, 0.5, d);
  float a = inner * (1.0 - outer);
  gl_FragColor = vec4(uColor, a);
}
`;

export function CoronaShader() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: { uColor: { value: new THREE.Color("#2B2BC2") } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  return (
    <mesh position={[0.6, 0.4, -2]} material={material}>
      <planeGeometry args={[3.2, 3.2]} />
    </mesh>
  );
}
