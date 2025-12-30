import React from 'react';

export default function Sun() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[2.5, 48, 48]} />
        <meshStandardMaterial emissive="#ffcc55" emissiveIntensity={2} color="#ffdd88" />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={4} distance={200} />
    </group>
  );
}
