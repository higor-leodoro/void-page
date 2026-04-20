"use client";

import { forwardRef, useMemo } from "react";
import { Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const fragment = /* glsl */ `
  uniform vec2 uMouse;
  uniform float uStrength;
  uniform float uRadius;
  uniform float uAspect;

  void mainUv(inout vec2 uv) {
    vec2 diff = uv - uMouse;
    diff.x *= uAspect;
    float dist = length(diff);

    float influence = 1.0 - smoothstep(0.0, uRadius, dist);
    influence = pow(influence, 1.0);

    vec2 dir = normalize(uv - uMouse + vec2(1e-6));
    uv -= dir * influence * uStrength;
  }
`;

export class CursorLensEffectImpl extends Effect {
  constructor() {
    super("CursorLensEffect", fragment, {
      uniforms: new Map<string, Uniform>([
        ["uMouse", new Uniform(new Vector2(0.5, 0.5))],
        ["uStrength", new Uniform(0.0)],
        ["uRadius", new Uniform(0.25)],
        ["uAspect", new Uniform(1.0)],
      ]),
    });
  }
}

export const CursorLensEffect = forwardRef<CursorLensEffectImpl>(
  function CursorLensEffect(_props, ref) {
    const effect = useMemo(() => new CursorLensEffectImpl(), []);
    return <primitive ref={ref} object={effect} dispose={null} />;
  },
);
