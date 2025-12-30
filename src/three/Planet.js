// Planet.js (edited to support per-planet textures in Expo/RN)
// REQUIREMENT: in your PLANETS data, add `texture: require('...')` for each planet.
// Example in planets data:
// { id:'earth', radius:1, color:'#fff', yearDays:365, distanceAU:1, texture: require('../../assets/textures/earth.jpg') }

import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei/native';
import useSolarStore from '../store/solarStore';
import { AU } from '../data/planets';

export default function Planet({ data, timeScale = 1, onFocus }) {
  const ref = useRef();
  const setSelected = useSolarStore((s) => s.setSelected);
  const setPlanetPos = useSolarStore((s) => s.setPlanetPos);

  // ✅ Load the planet texture (Expo-safe). If data.texture is missing, this will be null.
  const texture = data.texture ? useTexture(data.texture) : null;

  // ✅ Make texture look correct on mobile
  useEffect(() => {
    if (!texture) return;

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false; // helps on Expo/EXGL + reduces warnings
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // RepeatWrapping is OK too, but ClampToEdge avoids seams unless you want repeating
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.needsUpdate = true;
  }, [texture]);

  const angularSpeed = useMemo(
    () => (2 * Math.PI) / (data.yearDays || 365),
    [data.yearDays]
  );
  const ORBIT_SPACING = 2.5;
  const distance = data.distanceAU * AU * ORBIT_SPACING;

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

        {/* ✅ If texture exists, use it. Otherwise fall back to color. */}
        {texture ? (
          <meshStandardMaterial map={texture} metalness={0.1} roughness={0.9} />
        ) : (
          <meshStandardMaterial color={data.color} metalness={0.1} roughness={0.8} />
        )}
      </mesh>
    </group>
  );
}
