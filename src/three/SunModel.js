import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei/native';

export default function SunSphere({
  position = [0, 0, 0],
  radius = 4,
  rotation = [0, 0, 0],
}) {
  const tex = useTexture(require('./models/sun.jpg'));

  useEffect(() => {
    if (!tex) return;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.flipY = false;          // try true if it looks upside-down
    tex.needsUpdate = true;
  }, [tex]);

  return (
    <mesh position={position} rotation={rotation}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial map={tex} />
    </mesh>
  );
}
