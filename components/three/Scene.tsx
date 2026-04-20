"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { MutableRefObject } from "react";
import { CameraRig } from "./CameraRig";
import { GenesisSun } from "./GenesisSun";
import { PostProcess } from "./PostProcess";
import { SpaceBackground } from "./SpaceBackground";
import {
  SunRefContext,
  SunScreenContext,
  type SunRef,
  type SunScreenRef,
} from "./sunRef";
import { Starfield } from "./Starfield";

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

type SceneProps = {
  sunRef: SunRef;
  sunScreenRef: SunScreenRef;
  ringIntensityRef: MutableRefObject<number | null>;
};

function RingOscillator({
  baseRef,
  amplitude,
  targetRef,
}: {
  baseRef: MutableRefObject<number>;
  amplitude: number;
  targetRef: MutableRefObject<number | null>;
}) {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    targetRef.current = baseRef.current + Math.sin(t * 0.6) * amplitude;
  });
  return null;
}

export default function Scene({ sunRef, sunScreenRef, ringIntensityRef }: SceneProps) {
  const mobile = useIsMobile();
  const baseRingRef = useMemo(() => ({ current: mobile ? 0.55 : 0.95 }), [mobile]);
  useEffect(() => {
    baseRingRef.current = mobile ? 0.55 : 0.95;
  }, [mobile, baseRingRef]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={mobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 34, near: 0.1, far: 120, position: [0, 0, 5.8] }}
      >
        <SunRefContext.Provider value={sunRef}>
          <SunScreenContext.Provider value={sunScreenRef}>
            <color attach="background" args={["#030308"]} />
            <ambientLight intensity={0.08} color="#8A8476" />
            <directionalLight position={[-4.5, 2.8, -3]} intensity={0.9} color="#2B2BC2" />
            <directionalLight position={[2, 3, 6]} intensity={0.25} color="#ECE4D4" />
            <pointLight
              position={[0.6, 0.4, -5]}
              intensity={3.5}
              distance={9}
              decay={2}
              color="#2B2BC2"
            />
            <Suspense fallback={null}>
              <SpaceBackground />
              <Starfield />
              <GenesisSun />
            </Suspense>
            <CameraRig />
            <RingOscillator
              baseRef={baseRingRef}
              amplitude={mobile ? 0.04 : 0.08}
              targetRef={ringIntensityRef}
            />
            <PostProcess ringIntensityRef={ringIntensityRef} />
          </SunScreenContext.Provider>
        </SunRefContext.Provider>
      </Canvas>
    </div>
  );
}
