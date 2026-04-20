"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 18;
const INNER_RADIUS = 2.2;
const OUTER_RADIUS = 3.6;
const TILE_W = 0.42;
const TILE_H = 0.28;

function makeTileShape(w: number, h: number, chamfer: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + chamfer, y);
  s.lineTo(x + w - chamfer, y);
  s.lineTo(x + w, y + chamfer);
  s.lineTo(x + w, y + h);
  s.lineTo(x + w - chamfer, y + h);
  s.lineTo(x + chamfer, y + h);
  s.lineTo(x, y + h - chamfer);
  s.lineTo(x, y + chamfer);
  s.closePath();
  return s;
}

export function OrbitalDebris() {
  const group = useRef<THREE.Group>(null);

  const tiles = useMemo(() => {
    const shape = makeTileShape(TILE_W, TILE_H, 0.06);
    const geom = new THREE.ShapeGeometry(shape);
    const items: { geom: THREE.ShapeGeometry; angle: number; radius: number; y: number; spin: number }[] = [];
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.1;
      const radius =
        INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS);
      const y = (Math.random() - 0.5) * 0.3;
      const spin = (Math.random() - 0.5) * 0.2;
      items.push({ geom, angle, radius, y, spin });
    }
    return items;
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.04;
    for (const child of group.current.children) {
      child.rotation.z += delta * (child.userData.spin ?? 0);
    }
  });

  return (
    <group ref={group}>
      {tiles.map((t, i) => {
        const x = Math.cos(t.angle) * t.radius;
        const z = Math.sin(t.angle) * t.radius;
        return (
          <mesh
            key={i}
            geometry={t.geom}
            position={[x, t.y, z]}
            rotation={[-Math.PI / 2, 0, t.angle + Math.PI / 2]}
            userData={{ spin: t.spin }}
          >
            <meshBasicMaterial
              color="#8A8476"
              transparent
              opacity={0.22}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}
