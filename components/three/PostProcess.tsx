"use client";

import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { useEffect, useMemo, useState } from "react";
import type { MutableRefObject } from "react";
import { Vector2 } from "three";
import { useBeatState } from "@/components/beat/useBeatState";

type PostProcessProps = {
  ringIntensityRef?: MutableRefObject<number | null>;
};

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setM(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return m;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setR(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return r;
}

const DOF_BEATS = new Set([2]);

export function PostProcess(_props: PostProcessProps = {}) {
  const { current } = useBeatState();
  void _props;
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  const caOffset = useMemo<Vector2>(() => new Vector2(0.0009, 0.0007), []);

  if (reduced) return null;

  const dofOn = !mobile && DOF_BEATS.has(current);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.6}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.45}
        mipmapBlur
        radius={0.85}
        kernelSize={mobile ? KernelSize.SMALL : KernelSize.LARGE}
      />
      <ChromaticAberration
        offset={caOffset}
        radialModulation
        modulationOffset={0.42}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette offset={0.32} darkness={0.62} eskil={false} />
      <Noise opacity={mobile ? 0.04 : 0.075} premultiply />
      {dofOn ? (
        <DepthOfField focusDistance={0.02} focalLength={0.04} bokehScale={2.8} />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
