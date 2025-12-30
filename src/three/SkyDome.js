import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber/native';
import { TextureLoader } from 'three';

export default function SkyDome({ radius = 500 }) {
  // Put your image in: /assets/textures/space.jpg (example path)
  const texture = useLoader(TextureLoader, require('../assets/textures/space.jpg'));

  useMemo(() => {
    // Makes it look nicer
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }, [texture]);

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
