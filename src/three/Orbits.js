import React from 'react';
import * as THREE from 'three';
import { PLANETS, AU } from '../data/planets';

export default function Orbits() {
  return (
    <group>
      {PLANETS.map((p) => (
        <mesh key={`orbit-${p.id}`} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[p.distanceAU * AU - 0.02, p.distanceAU * AU + 0.02, 128]}
          />
          <meshBasicMaterial
            color="#444444"
            side={THREE.DoubleSide}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
