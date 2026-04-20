"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useMemo } from "react";
import type { MutableRefObject } from "react";
import { Vector3 } from "three";
import { useSunRef, useSunScreen } from "../sunRef";
import { GravityLensEffect } from "./GravityLensEffect";

type Props = {
  strength?: number;
  ringIntensity?: number;
  ringWidth?: number;
  radiusScale?: number;
  ringIntensityRef?: MutableRefObject<number | null>;
};

export const GravityLens = forwardRef<GravityLensEffect, Props>(function GravityLens(
  {
    strength = 0.18,
    ringIntensity = 0.9,
    ringWidth = 0.012,
    radiusScale = 1,
    ringIntensityRef,
  },
  ref,
) {
  const effect = useMemo(() => new GravityLensEffect(), []);
  const sunRef = useSunRef();
  const sunScreenRef = useSunScreen();
  const size = useThree((s) => s.size);

  const tmpCenter = useMemo(() => new Vector3(), []);
  const tmpEdge = useMemo(() => new Vector3(), []);
  const tmpScale = useMemo(() => new Vector3(), []);

  useFrame(({ camera }) => {
    const mesh = sunRef?.current;
    if (!mesh) return;

    mesh.getWorldPosition(tmpCenter);
    mesh.getWorldScale(tmpScale);

    const geom = mesh.geometry as { parameters?: { radius?: number } } & typeof mesh.geometry;
    const localRadius = geom?.parameters?.radius ?? 1;
    const worldRadius =
      localRadius * Math.max(tmpScale.x, tmpScale.y, tmpScale.z);

    tmpEdge.copy(tmpCenter);
    const right = tmpEdge.set(1, 0, 0).applyQuaternion(camera.quaternion).multiplyScalar(worldRadius);
    tmpEdge.copy(tmpCenter).add(right);

    tmpCenter.project(camera);
    tmpEdge.project(camera);

    const ndcX = (tmpCenter.x + 1) * 0.5;
    const ndcY = (tmpCenter.y + 1) * 0.5;
    const aspect = size.width / size.height;
    const dx = (tmpEdge.x - tmpCenter.x) * 0.5 * aspect;
    const dy = (tmpEdge.y - tmpCenter.y) * 0.5;
    const apparentR = Math.sqrt(dx * dx + dy * dy) * radiusScale;

    const liveRing =
      ringIntensityRef && ringIntensityRef.current !== null
        ? ringIntensityRef.current
        : ringIntensity;

    const u = effect.uniforms;
    (u.get("uSphereNdc")!.value as { set: (x: number, y: number) => void }).set(ndcX, ndcY);
    u.get("uSphereRadius")!.value = apparentR;
    u.get("uAspect")!.value = aspect;
    u.get("uLensStrength")!.value = strength;
    u.get("uRingWidth")!.value = ringWidth;
    u.get("uRingIntensity")!.value = liveRing;

    if (sunScreenRef?.current) {
      sunScreenRef.current.x = ndcX;
      sunScreenRef.current.y = ndcY;
      sunScreenRef.current.r = apparentR;
      sunScreenRef.current.visible = tmpCenter.z < 1 && tmpCenter.z > -1;
    }
  });

  return <primitive ref={ref} object={effect} dispose={null} />;
});
