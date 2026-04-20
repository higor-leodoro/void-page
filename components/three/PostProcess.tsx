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
import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector2 } from "three";
import { useBeatState } from "@/components/beat/useBeatState";
import { useNormalizedMouse } from "@/hooks/useNormalizedMouse";
import {
  CursorLensEffect,
  CursorLensEffectImpl,
} from "./effects/CursorLensEffect";

const CURSOR_LENS_STRENGTH = 0.08;
const CURSOR_LENS_RADIUS = 0.25;

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
  const bloomThreshold = current === 4 ? 0.78 : 0.1;

  const mouseRef = useNormalizedMouse();
  const lensRef = useRef<CursorLensEffectImpl>(null);

  useFrame((state) => {
    const effect = lensRef.current;
    if (!effect) return;
    const u = effect.uniforms;
    const uMouse = u.get("uMouse")!.value as Vector2;
    uMouse.set(mouseRef.current.x, mouseRef.current.y);
    u.get("uAspect")!.value = state.size.width / state.size.height;
    u.get("uStrength")!.value = reduced ? 0 : CURSOR_LENS_STRENGTH;
    u.get("uRadius")!.value = CURSOR_LENS_RADIUS;
  });

  if (reduced) return null;

  const dofOn = !mobile && DOF_BEATS.has(current);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.2}
        mipmapBlur
        radius={0.7}
        kernelSize={KernelSize.MEDIUM}
      />
      <CursorLensEffect ref={lensRef} />
      <ChromaticAberration
        offset={caOffset}
        radialModulation
        modulationOffset={0.42}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette offset={0.32} darkness={0.62} eskil={false} />
      <Noise opacity={mobile ? 0.04 : 0.075} premultiply />
      {dofOn ? (
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.04}
          bokehScale={2.8}
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
