import React from 'react';
import * as THREE from 'three';
import { PLANETS, AU } from '../data/planets';

const ORBIT_SPACING = 2.5; // <-- tweak this (2.0–4.0 looks good)

export default function Orbits() {
  return (
    <group>
      {PLANETS.map((p) => {
        const r = p.distanceAU * AU * ORBIT_SPACING;

        return (
          <mesh key={`orbit-${p.id}`} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.02, r + 0.02, 128]} />
            <meshBasicMaterial
              color="#444444"
              side={THREE.DoubleSide}
              transparent
              opacity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}
