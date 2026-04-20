"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";

export type NormalizedMouse = { x: number; y: number };

export function useNormalizedMouse(): MutableRefObject<NormalizedMouse> {
  const ref = useRef<NormalizedMouse>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: PointerEvent) => {
      ref.current.x = e.clientX / window.innerWidth;
      ref.current.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return ref;
}
