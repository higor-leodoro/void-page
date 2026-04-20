"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useBeatState } from "@/components/beat/useBeatState";
import { useSunRef } from "./sunRef";

const SEED: Record<number, { pos: [number, number, number]; scale: number; intensity: number }> = {
  0: { pos: [2.3, 0.1, -1.2], scale: 0.55, intensity: 0.45 },
  1: { pos: [1.1, 0.2, -1.0], scale: 0.65, intensity: 0.65 },
  2: { pos: [0.5, 0.3, -0.9], scale: 0.70, intensity: 0.80 },
  3: { pos: [0.1, 0.4, -0.8], scale: 0.75, intensity: 0.95 },
  4: { pos: [-0.1, 0.4, -0.7], scale: 0.85, intensity: 1.25 },
  5: { pos: [1.8, 0.3, -1.1], scale: 0.60, intensity: 0.90 },
};

export function TuneMode() {
  const sunRef = useSunRef();
  const { camera } = useThree();
  const { current } = useBeatState();
  const state = useRef({ x: 0, y: 0, z: 0, s: 1 });
  const keys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const seed = SEED[current] ?? SEED[0];
    state.current = { x: seed.pos[0], y: seed.pos[1], z: seed.pos[2], s: seed.scale };
    console.log(
      `%c[tune] beat ${current} — WASD move xy, QE move z, [ ] scale, P print keyframe, R reset`,
      "color:#8A8CFF",
    );
  }, [current]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current.add(k);
      if (k === "p") {
        const s = state.current;
        const seed = SEED[current];
        const line = `  ${current}: { pos: new THREE.Vector3(${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)}), scale: ${s.s.toFixed(2)}, intensity: ${seed.intensity} },`;
        console.log(`%c${line}`, "color:#7CFFB2; font-family:monospace");
      }
      if (k === "r") {
        const seed = SEED[current] ?? SEED[0];
        state.current = { x: seed.pos[0], y: seed.pos[1], z: seed.pos[2], s: seed.scale };
        console.log(`%c[tune] beat ${current} reset`, "color:#FFB27C");
      }
      if (k === "c") {
        console.log(
          `%c[tune] camera pos: [${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}]`,
          "color:#FFE07C",
        );
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    console.log(
      "%c[tune mode on] scroll/arrows = change beat · drag = orbit camera · WASD/QE nudge sphere · [ ] scale · P print · C camera · R reset",
      "color:#FFE07C; font-weight:bold",
    );
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [camera, current]);

  useFrame((_, delta) => {
    const k = keys.current;
    const step = delta * 1.8;
    const sstep = delta * 0.8;
    if (k.has("a")) state.current.x -= step;
    if (k.has("d")) state.current.x += step;
    if (k.has("w")) state.current.y += step;
    if (k.has("s")) state.current.y -= step;
    if (k.has("q")) state.current.z -= step;
    if (k.has("e")) state.current.z += step;
    if (k.has("[")) state.current.s = Math.max(0.05, state.current.s - sstep);
    if (k.has("]")) state.current.s += sstep;
    const mesh = sunRef?.current;
    if (mesh) {
      mesh.position.set(state.current.x, state.current.y, state.current.z);
      mesh.scale.setScalar(state.current.s);
    }
  }, 1);

  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.08}
      target={new THREE.Vector3(0.6, 0.4, 0)}
      makeDefault
    />
  );
}
