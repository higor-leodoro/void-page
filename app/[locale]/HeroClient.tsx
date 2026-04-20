"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type { Mesh } from "three";
import { BeatProvider } from "@/components/beat/BeatContext";
import { BeatController } from "@/components/beat/BeatController";
import { BeatStage } from "@/components/beat/BeatStage";
import { RunningHead } from "@/components/chrome/RunningHead";
import { ChapterNav } from "@/components/chrome/ChapterNav";
import { ScrollPrompt } from "@/components/chrome/ScrollPrompt";
import type { SunScreenSample } from "@/components/three/sunRef";

const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
  loading: () => null,
});

export function HeroClient() {
  const sunRef = useRef<Mesh | null>(null);
  const sunScreenRef = useRef<SunScreenSample>({
    x: 0.78,
    y: 0.52,
    r: 0.06,
    visible: true,
  });
  const ringIntensityRef = useRef<number | null>(null);

  return (
    <BeatProvider>
      <Scene
        sunRef={sunRef}
        sunScreenRef={sunScreenRef}
        ringIntensityRef={ringIntensityRef}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-10"
        style={{
          height: "62%",
          background:
            "linear-gradient(to top, rgba(3,3,8,0.92) 0%, rgba(3,3,8,0.55) 38%, rgba(3,3,8,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-25 h-20"
        style={{ background: "linear-gradient(to bottom, transparent, #000)" }}
      />
      <BeatStage />
      <RunningHead />
      <ChapterNav />
      <ScrollPrompt />
      <BeatController />
    </BeatProvider>
  );
}
