"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, lazy, useEffect, useState } from "react";
import { BeatGate } from "./BeatGate";
import { CameraRig } from "./CameraRig";
import { DemoVessels } from "./DemoVessels";
import { MethodRings } from "./MethodRings";
import { OrbitalDebris } from "./OrbitalDebris";
import { PostProcess } from "./PostProcess";
import { SpaceBackground } from "./SpaceBackground";
import { Sphere } from "./Sphere";
import { Starfield } from "./Starfield";

const NebulaDust = lazy(() => import("./NebulaDust"));

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

export default function Scene() {
  const mobile = useIsMobile();
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={mobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 34, near: 0.1, far: 120, position: [0, 0, 5.8] }}
      >
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
          <Sphere />
          <BeatGate beats={1}>
            <OrbitalDebris />
          </BeatGate>
          <BeatGate beats={3}>
            <MethodRings />
            <Suspense fallback={null}>
              <NebulaDust />
            </Suspense>
          </BeatGate>
          <BeatGate beats={4}>
            <DemoVessels />
          </BeatGate>
        </Suspense>
        <CameraRig />
        <PostProcess />
      </Canvas>
    </div>
  );
}
