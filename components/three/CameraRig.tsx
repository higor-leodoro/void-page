"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useBeatState } from "@/components/beat/useBeatState";
import type { BeatId } from "@/types/beat";

type Vec3 = [number, number, number];
type CameraBeat = { position: Vec3; lookAt: Vec3; fov: number };

const CAMERA_BEATS: Record<BeatId, CameraBeat> = {
  0: { position: [0, 0, 5.8], lookAt: [0.6, 0.4, 0], fov: 34 },
  1: { position: [-2.4, -0.2, 6.5], lookAt: [0, 0, 0], fov: 34 },
  2: { position: [1.3, 0.4, 2.6], lookAt: [0, 0, 0], fov: 34 },
  3: { position: [0, 3.8, 9.5], lookAt: [0, 0, 0], fov: 34 },
  4: { position: [-3.2, 0.8, 5.4], lookAt: [0, 0, 0], fov: 34 },
  5: { position: [0, 0, 0.35], lookAt: [0, 0, 0], fov: 75 },
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
      prevFov: CAMERA_BEATS[previous].fov,
      currFov: CAMERA_BEATS[current].fov,
    };
  }, [current, previous]);

  useFrame(() => {
    const persp = camera as THREE.PerspectiveCamera;
    if (reduced) {
      persp.position.copy(targets.currPos);
      currentLookAt.current.copy(targets.currLook);
      if (persp.fov !== targets.currFov) {
        persp.fov = targets.currFov;
        persp.updateProjectionMatrix();
      }
      persp.lookAt(currentLookAt.current);
      return;
    }
    if (isTransitioning) {
      const t = THREE.MathUtils.clamp(cameraProgressRef.current.value, 0, 1);
      tmpPos.lerpVectors(targets.prevPos, targets.currPos, t);
      tmpLook.lerpVectors(targets.prevLook, targets.currLook, t);
      persp.position.copy(tmpPos);
      currentLookAt.current.copy(tmpLook);
      const nextFov = THREE.MathUtils.lerp(targets.prevFov, targets.currFov, t);
      if (Math.abs(persp.fov - nextFov) > 0.01) {
        persp.fov = nextFov;
        persp.updateProjectionMatrix();
      }
    } else {
      persp.position.lerp(targets.currPos, 0.12);
      currentLookAt.current.lerp(targets.currLook, 0.12);
      if (Math.abs(persp.fov - targets.currFov) > 0.01) {
        persp.fov = THREE.MathUtils.lerp(persp.fov, targets.currFov, 0.12);
        persp.updateProjectionMatrix();
      }
    }
    persp.lookAt(currentLookAt.current);
  });

  return null;
}
