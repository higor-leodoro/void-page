"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useBeatState } from "@/components/beat/useBeatState";

type LayerConfig = {
  count: number;
  radius: number;
  sizeMin: number;
  sizeMax: number;
  opacity: number;
  ultramarineRatio: number;
  paperDimRatio: number;
  parallax: number; // 1 = no drift, 0 = full drift
  twinkleFreq: [number, number];
};

const LAYERS: LayerConfig[] = [
  {
    count: 2200,
    radius: 45,
    sizeMin: 0.18,
    sizeMax: 0.45,
    opacity: 0.45,
    ultramarineRatio: 0.04,
    paperDimRatio: 0.08,
    parallax: 1.0,
    twinkleFreq: [0.25, 0.45],
  },
  {
    count: 600,
    radius: 20,
    sizeMin: 0.25,
    sizeMax: 0.8,
    opacity: 0.6,
    ultramarineRatio: 0.04,
    paperDimRatio: 0.08,
    parallax: 0.6,
    twinkleFreq: [0.3, 0.55],
  },
  {
    count: 120,
    radius: 8,
    sizeMin: 0.4,
    sizeMax: 1.3,
    opacity: 0.85,
    ultramarineRatio: 0.15,
    paperDimRatio: 0.1,
    parallax: 0.3,
    twinkleFreq: [0.35, 0.6],
  },
];

const PAPER = new THREE.Color("#ECE4D4");
const PAPER_DIM = new THREE.Color("#8A8476");
const ULTRAMARINE_DESAT = new THREE.Color("#5C5CB0");

const STAR_VERT = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute float aFreq;
attribute vec3 aColor;
varying vec3 vColor;
varying float vTwinkle;
uniform float uTime;
uniform float uReduced;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(aSize * (300.0 / -mv.z), 0.4, 2.6);
  float tw = 0.85 + 0.15 * sin(uTime * aFreq * 6.2831 + aPhase);
  vTwinkle = mix(1.0, tw, 1.0 - uReduced);
  vColor = aColor;
}
`;

const STAR_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vTwinkle;
uniform float uOpacity;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, a * uOpacity * vTwinkle);
}
`;

function makeLayer(cfg: LayerConfig) {
  const pos = new Float32Array(cfg.count * 3);
  const sizes = new Float32Array(cfg.count);
  const phases = new Float32Array(cfg.count);
  const freqs = new Float32Array(cfg.count);
  const colors = new Float32Array(cfg.count * 3);
  for (let i = 0; i < cfg.count; i++) {
    // uniform point on sphere
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = cfg.radius * (0.85 + Math.random() * 0.15);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin);
    phases[i] = Math.random() * Math.PI * 2;
    freqs[i] =
      cfg.twinkleFreq[0] +
      Math.random() * (cfg.twinkleFreq[1] - cfg.twinkleFreq[0]);
    const roll = Math.random();
    let c: THREE.Color;
    if (roll < cfg.ultramarineRatio) c = ULTRAMARINE_DESAT;
    else if (roll < cfg.ultramarineRatio + cfg.paperDimRatio) c = PAPER_DIM;
    else c = PAPER;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geom.setAttribute("aFreq", new THREE.BufferAttribute(freqs, 1));
  geom.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  return geom;
}

export function Starfield() {
  const { camera } = useThree();
  const { isTransitioning } = useBeatState();
  const groupEl = useRef<THREE.Group>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      mouseTarget.current.x = e.clientX / window.innerWidth - 0.5;
      mouseTarget.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  const layers = useMemo(
    () =>
      LAYERS.map((cfg) => ({
        cfg,
        geom: makeLayer(cfg),
        material: new THREE.ShaderMaterial({
          vertexShader: STAR_VERT,
          fragmentShader: STAR_FRAG,
          uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: cfg.opacity },
            uReduced: { value: reducedMotion ? 1 : 0 },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      })),
    [reducedMotion],
  );

  const groupRefs = useRef<Array<THREE.Object3D | null>>([]);
  const anchor = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  useFrame((state) => {
    if (!initialized.current) {
      anchor.current.copy(camera.position);
      initialized.current = true;
    }
    const t = state.clock.elapsedTime;
    for (let i = 0; i < layers.length; i++) {
      const l = layers[i];
      l.material.uniforms.uTime.value = t;
      const pts = groupRefs.current[i];
      if (!pts) continue;
      if (reducedMotion) {
        pts.position.set(0, 0, 0);
        continue;
      }
      // parallax: farther layers drift less relative to camera motion
      const drift = 1 - l.cfg.parallax;
      pts.position.x = (camera.position.x - anchor.current.x) * drift;
      pts.position.y = (camera.position.y - anchor.current.y) * drift;
      pts.position.z = (camera.position.z - anchor.current.z) * drift;
    }

    const g = groupEl.current;
    if (g && !reducedMotion) {
      const targetRotY = mouseTarget.current.x * 0.025;
      const targetRotX = mouseTarget.current.y * 0.025;
      g.rotation.y += (targetRotY - g.rotation.y) * 0.04;
      g.rotation.x += (targetRotX - g.rotation.x) * 0.04;
    }
    // noop read to keep lint happy
    void isTransitioning;
  });

  return (
    <group ref={groupEl}>
      {layers.map((l, i) => (
        <points
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          geometry={l.geom}
          material={l.material}
          frustumCulled={false}
        />
      ))}
    </group>
  );
}
