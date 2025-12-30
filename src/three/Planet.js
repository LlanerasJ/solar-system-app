import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import useSolarStore from '../store/solarStore';
import { AU } from '../data/planets';

export default function Planet({ data, timeScale = 1, onFocus }) {
  const ref = useRef();
  const setSelected  = useSolarStore((s) => s.setSelected);
  const setPlanetPos = useSolarStore((s) => s.setPlanetPos);

  const angularSpeed = useMemo(
    () => (2 * Math.PI) / (data.yearDays || 365),
    [data.yearDays]
  );
  const distance = data.distanceAU * AU;

  const tmpWorld = useRef(new THREE.Vector3()).current;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime() * timeScale;
    const angle = t * angularSpeed;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    if (ref.current) {
      ref.current.position.set(x, 0, z);
      ref.current.rotation.y += delta * 0.3;

      // publish live world position every frame
      ref.current.getWorldPosition(tmpWorld);
      setPlanetPos(data.id, tmpWorld);
    }
  });

  const onTap = (e) => {
    e.stopPropagation();
    setSelected(data.id);

    // robust tap-time world center from the hit mesh
    const worldCenter = new THREE.Vector3();
    e.object.getWorldPosition(worldCenter);

    // pass both the object (for continuous follow) and the exact world pos (for the smooth fly-in)
    onFocus?.(data, ref.current, worldCenter);
  };

  return (
    <group ref={ref} onClick={onTap} onPointerDown={(e) => e.stopPropagation()}>
      <mesh>
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshStandardMaterial color={data.color} metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  );
}
