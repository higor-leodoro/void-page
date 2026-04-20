"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, type MutableRefObject } from "react";
import { useBeatState } from "@/components/beat/useBeatState";
import { BEAT_LAYOUTS, type OrbitSlot } from "./beatChoreography";

type SlotTransform = {
  angleDeg: number;
  radiusScale: number;
  opacity: number;
  // data-angle/data-radius give the "target" values; these are live multipliers.
};

export function useOrbitTransition(
  slotRefs: MutableRefObject<Map<string, HTMLElement>>,
  transformRef: MutableRefObject<Map<string, SlotTransform>>,
) {
  const { current, previous, isTransitioning } = useBeatState();

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useGSAP(
    () => {
      const prevLayout = BEAT_LAYOUTS[previous];
      const currLayout = BEAT_LAYOUTS[current];

      // Ensure every current-beat slot has an initial transform entry
      for (const slot of currLayout.slots) {
        if (!transformRef.current.has(slot.id)) {
          transformRef.current.set(slot.id, {
            angleDeg: slot.angle,
            radiusScale: 1,
            opacity: 0,
          });
        }
      }

      if (!isTransitioning) {
        // Snap current slots in, drop previous
        const staleIds = new Set(transformRef.current.keys());
        for (const slot of currLayout.slots) {
          staleIds.delete(slot.id);
          const t = transformRef.current.get(slot.id)!;
          t.angleDeg = slot.angle;
          t.radiusScale = 1;
          t.opacity = 1;
        }
        for (const id of staleIds) {
          transformRef.current.delete(id);
        }
        return;
      }

      const tl = gsap.timeline();

      // Outgoing: previous-beat slots not in current beat fade + sweep forward
      const currIds = new Set(currLayout.slots.map((s) => s.id));
      for (const slot of prevLayout.slots) {
        if (currIds.has(slot.id)) continue;
        const t = transformRef.current.get(slot.id);
        if (!t) continue;
        const exitAngle = slot.exitTo ?? slot.angle + 45;
        if (reducedMotion) {
          tl.to(
            t,
            { opacity: 0, duration: 0.3, ease: "power1.out" },
            0,
          );
        } else {
          tl.to(
            t,
            {
              angleDeg: exitAngle,
              radiusScale: 1.15,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
            },
            0,
          );
        }
      }

      // Incoming: current-beat slots sweep in from enterFrom
      for (const slot of currLayout.slots as OrbitSlot[]) {
        const t = transformRef.current.get(slot.id)!;
        const startAngle = slot.enterFrom ?? slot.angle - 45;
        // Seed start state only if slot wasn't already visible
        const wasVisible = prevLayout.slots.some((s) => s.id === slot.id);
        if (!wasVisible) {
          t.angleDeg = startAngle;
          t.radiusScale = 1.2;
          t.opacity = 0;
        }
        if (reducedMotion) {
          tl.to(
            t,
            { angleDeg: slot.angle, radiusScale: 1, opacity: 1, duration: 0.5, ease: "power1.out" },
            0.2,
          );
        } else {
          tl.to(
            t,
            {
              angleDeg: slot.angle,
              radiusScale: 1,
              opacity: 1,
              duration: 0.55,
              ease: "expo.out",
            },
            0.25,
          );
        }
      }

      return () => {
        tl.kill();
      };
    },
    { dependencies: [current, previous, isTransitioning, reducedMotion] },
  );

  // Keep ref parameter referenced so React doesn't warn about unused arg.
  void slotRefs;
}

export type { SlotTransform };
