"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useBeatState } from "@/components/beat/useBeatState";
import type { BeatId } from "@/types/beat";

type Vec3 = [number, number, number];

type CameraBeat = { position: Vec3; lookAt: Vec3 };

const CAMERA_BEATS: Record<BeatId, CameraBeat> = {
  0: { position: [0, 0, 7.5], lookAt: [2.2, 0.2, 0] },
  1: { position: [-1.8, 0.8, 6.2], lookAt: [0, 0, 0] },
  2: { position: [1.6, -1.2, 5.8], lookAt: [0, 0, 0] },
  3: { position: [-2.4, 1.4, 7.0], lookAt: [0, 0, 0] },
  4: { position: [2.0, 1.8, 6.5], lookAt: [0, 0, 0] },
  5: { position: [0.2, -0.6, 8.4], lookAt: [0, 0, 0] },
};

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

export function CameraRig() {
  const { camera } = useThree();
  const { current, previous, isTransitioning, cameraProgressRef } =
    useBeatState();
  const currentLookAt = useRef(new THREE.Vector3(2.2, 0.2, 0));

  const targets = useMemo(() => {
    return {
      prevPos: new THREE.Vector3(...CAMERA_BEATS[previous].position),
      currPos: new THREE.Vector3(...CAMERA_BEATS[current].position),
      prevLook: new THREE.Vector3(...CAMERA_BEATS[previous].lookAt),
      currLook: new THREE.Vector3(...CAMERA_BEATS[current].lookAt),
    };
  }, [current, previous]);

  useFrame(() => {
    if (isTransitioning) {
      const t = THREE.MathUtils.clamp(cameraProgressRef.current.value, 0, 1);
      tmpPos.lerpVectors(targets.prevPos, targets.currPos, t);
      tmpLook.lerpVectors(targets.prevLook, targets.currLook, t);
      camera.position.copy(tmpPos);
      currentLookAt.current.copy(tmpLook);
    } else {
      camera.position.lerp(targets.currPos, 0.12);
      currentLookAt.current.lerp(targets.currLook, 0.12);
    }
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
