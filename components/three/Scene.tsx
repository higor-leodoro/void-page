"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { BracketMesh } from "./BracketMesh";
import { CameraRig } from "./CameraRig";

export default function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 34, near: 0.1, far: 50, position: [0, 0, 7.5] }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={["#030308"]} />
        <fog attach="fog" args={["#030308", 6.5, 14]} />
        <ambientLight intensity={0.18} color="#8A8476" />
        <directionalLight
          position={[-3, 4, 5]}
          intensity={0.55}
          color="#ECE4D4"
        />
        <directionalLight
          position={[5, 2, 3]}
          intensity={0.28}
          color="#8A8476"
        />
        <pointLight
          position={[4, 3, 2]}
          intensity={2.1}
          distance={12}
          decay={1.8}
          color="#2B2BC2"
        />
        <pointLight
          position={[-4, -2, 3]}
          intensity={0.9}
          distance={10}
          decay={2}
          color="#2B2BC2"
        />
        <Suspense fallback={null}>
          <BracketMesh />
        </Suspense>
        <CameraRig />
      </Canvas>
    </div>
  );
}
