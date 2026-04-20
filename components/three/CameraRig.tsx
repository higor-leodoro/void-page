"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useBeatState } from "@/components/beat/useBeatState";
import type { BeatId } from "@/types/beat";

type Vec3 = [number, number, number];
type CameraBeat = { position: Vec3; lookAt: Vec3 };

// Whispering camera — small, intimate motion around the Void/Genesis axis.
// All beats look at the Void at (0.6, 0.4, 0). FOV is constant (34).
const CAMERA_BEATS: Record<BeatId, CameraBeat> = {
  0: { position: [0, 0, 5.8], lookAt: [0.6, 0.4, 0] },
  1: { position: [-0.2, 0.0, 5.6], lookAt: [0.6, 0.4, 0] },
  2: { position: [0.1, 0.2, 4.4], lookAt: [0.6, 0.4, 0] },
  3: { position: [0.4, 0.7, 5.6], lookAt: [0.6, 0.4, 0] },
  4: { position: [0.55, 0.45, 4.8], lookAt: [0.6, 0.4, 0] },
  5: { position: [0.6, 0.4, 3.6], lookAt: [0.6, 0.4, 0] },
};

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

function useReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

export function CameraRig() {
  const { camera } = useThree();
  const { current, previous, isTransitioning, cameraProgressRef } =
    useBeatState();
  const currentLookAt = useRef(new THREE.Vector3(0.6, 0.4, 0));
  const reduced = useReducedMotion();

  const targets = useMemo(() => {
    return {
      prevPos: new THREE.Vector3(...CAMERA_BEATS[previous].position),
      currPos: new THREE.Vector3(...CAMERA_BEATS[current].position),
      prevLook: new THREE.Vector3(...CAMERA_BEATS[previous].lookAt),
      currLook: new THREE.Vector3(...CAMERA_BEATS[current].lookAt),
    };
  }, [current, previous]);

  useFrame(() => {
    const persp = camera as THREE.PerspectiveCamera;
    if (reduced) {
      persp.position.copy(targets.currPos);
      currentLookAt.current.copy(targets.currLook);
      persp.lookAt(currentLookAt.current);
      return;
    }
    if (isTransitioning) {
      const t = THREE.MathUtils.clamp(cameraProgressRef.current.value, 0, 1);
      tmpPos.lerpVectors(targets.prevPos, targets.currPos, t);
      tmpLook.lerpVectors(targets.prevLook, targets.currLook, t);
      persp.position.copy(tmpPos);
      currentLookAt.current.copy(tmpLook);
    } else {
      persp.position.lerp(targets.currPos, 0.12);
      currentLookAt.current.lerp(targets.currLook, 0.12);
    }
    persp.lookAt(currentLookAt.current);
  });

  return null;
}
