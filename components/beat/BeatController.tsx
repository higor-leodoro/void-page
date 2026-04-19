"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useBeatState } from "./useBeatState";
import type { BeatId } from "@/types/beat";
import { MAX_BEAT } from "@/types/beat";

const TOUCH_THRESHOLD_PX = 40;
const WHEEL_DELTA_THRESHOLD = 10;

export function BeatController() {
  const {
    current,
    isTransitioning,
    advance,
    reverse,
    jumpTo,
    cameraProgressRef,
    setTransitionComplete,
  } = useBeatState();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < WHEEL_DELTA_THRESHOLD) return;
      if (e.deltaY > 0) advance();
      else reverse();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA"
      ) {
        return;
      }
      switch (e.key) {
        case " ":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          advance();
          return;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          reverse();
          return;
      }
      if (e.key.length === 1 && e.key >= "0" && e.key <= "5") {
        e.preventDefault();
        jumpTo(Number(e.key) as BeatId);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      if (startY === null) return;
      const endY = e.changedTouches[0]?.clientY ?? startY;
      const dy = endY - startY;
      if (Math.abs(dy) < TOUCH_THRESHOLD_PX) return;
      if (dy < 0) advance();
      else reverse();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [advance, reverse, jumpTo]);

  useGSAP(
    () => {
      if (!isTransitioning) return;
      const target = cameraProgressRef.current;
      target.value = 0;

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        target.value = 1;
        const t = window.setTimeout(setTransitionComplete, 280);
        return () => window.clearTimeout(t);
      }

      const tl = gsap.timeline({ onComplete: setTransitionComplete });
      tl.to(target, {
        value: 1,
        duration: 0.52,
        delay: 0.28,
        ease: "expo.out",
      });

      return () => {
        tl.kill();
      };
    },
    { dependencies: [current, isTransitioning], scope: scopeRef },
  );

  return <div ref={scopeRef} aria-hidden hidden />;
}

export { MAX_BEAT };
