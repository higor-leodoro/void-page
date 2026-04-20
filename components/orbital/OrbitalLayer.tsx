"use client";

import { useEffect, useMemo, useRef } from "react";
import { useBeatState } from "@/components/beat/useBeatState";
import type { SunScreenRef } from "@/components/three/sunRef";
import { BEAT_LAYOUTS, type OrbitSlot as OrbitSlotData } from "./beatChoreography";
import { OrbitSlot } from "./OrbitSlot";
import { useOrbitTransition, type SlotTransform } from "./useOrbitTransition";

type Props = {
  sunScreenRef: SunScreenRef;
};

export function OrbitalLayer({ sunScreenRef }: Props) {
  const { current, previous, isTransitioning } = useBeatState();
  const slotRefs = useRef<Map<string, HTMLElement>>(new Map());
  const transformRef = useRef<Map<string, SlotTransform>>(new Map());
  const centerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  }, []);
  const radiusMultiplier = isMobile ? 0.7 : 1;

  useOrbitTransition(slotRefs, transformRef);

  // Render union of previous + current beat slots so outgoing ones can animate out.
  const renderedSlots = useMemo<OrbitSlotData[]>(() => {
    const map = new Map<string, OrbitSlotData>();
    for (const s of BEAT_LAYOUTS[previous].slots) map.set(s.id, s);
    for (const s of BEAT_LAYOUTS[current].slots) map.set(s.id, s);
    return Array.from(map.values());
  }, [current, previous]);

  useEffect(() => {
    let raf = 0;
    let startTime = performance.now();
    const tick = (now: number) => {
      const t = (now - startTime) / 1000;
      const sample = sunScreenRef.current;
      const center = centerRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (center && sample) {
        // NDC (0..1) — flip Y (WebGL y-up → DOM y-down)
        const x = sample.x * vw;
        const y = (1 - sample.y) * vh;
        center.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      }

      for (const [id, el] of slotRefs.current) {
        const tr = transformRef.current.get(id);
        if (!tr) {
          el.style.opacity = "0";
          continue;
        }
        const data = el.dataset;
        const baseRadiusFrac = parseFloat(data.radius ?? "0");
        const targetAngle = tr.angleDeg;
        const driftDeg = reducedMotion
          ? 0
          : Math.sin(t * 0.3 + id.length) * 0.3;
        const angleRad = ((targetAngle + driftDeg) * Math.PI) / 180;
        const r = baseRadiusFrac * radiusMultiplier * tr.radiusScale * vh;
        const dx = Math.cos(angleRad) * r;
        const dy = -Math.sin(angleRad) * r; // invert so angle=90 goes UP on screen
        // Anchor: center text block so it orbits around its mid-line
        el.style.transform = `translate3d(calc(${dx.toFixed(2)}px - 50%), calc(${dy.toFixed(2)}px - 50%), 0)`;
        el.style.opacity = String(tr.opacity);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sunScreenRef, reducedMotion, radiusMultiplier]);

  // Suppress unused warning
  void isTransitioning;

  return (
    <div
      aria-hidden={false}
      className="pointer-events-none fixed inset-0 z-20"
      style={{ overflow: "visible" }}
    >
      <div
        ref={centerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          willChange: "transform",
        }}
      >
        {renderedSlots.map((slot) => (
          <OrbitSlot
            key={slot.id}
            slot={slot}
            ref={(el) => {
              if (el) slotRefs.current.set(slot.id, el);
              else slotRefs.current.delete(slot.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
