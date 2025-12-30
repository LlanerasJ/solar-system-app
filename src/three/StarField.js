import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function StarField({
  count = 6000,
  radius = 900,
  size = 3.0,       // <- make it obvious
  cometRate = 0.02, // 2% “comets”
}) {
  const pointsRef = useRef();
  const materialRef = useRef();

  const { positions, aBase, aAmp, aSpeed, aPhase, aComet } = useMemo(() => {
    const positions = new Float32Array(count * 3);

    const aBase = new Float32Array(count);
    const aAmp = new Float32Array(count);
    const aSpeed = new Float32Array(count);
    const aPhase = new Float32Array(count);
    const aComet = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // random direction on sphere
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      // bias outward (sky shell)
      const r = radius * (0.75 + 0.25 * Math.random());

      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const isComet = Math.random() < cometRate ? 1.0 : 0.0;
      aComet[i] = isComet;

      // Normal stars: subtle twinkle
      // Comets: stronger pulse
      aBase[i] = isComet ? 0.35 + Math.random() * 0.15 : 0.65 + Math.random() * 0.2;
      aAmp[i] = isComet ? 0.75 + Math.random() * 0.25 : 0.20 + Math.random() * 0.25;
      aSpeed[i] = isComet ? 100.0 + Math.random() * 3.0 : 0.8 + Math.random() * 2.0;
      aPhase[i] = Math.random() * Math.PI * 2;
    }

    return { positions, aBase, aAmp, aSpeed, aPhase, aComet };
  }, [count, radius, cometRate]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;

        attribute float aBase;
        attribute float aAmp;
        attribute float aSpeed;
        attribute float aPhase;
        attribute float aComet;

        varying float vBrightness;
        varying float vComet;

        void main() {
          // Per-star twinkle
          float s = 0.5 + 0.5 * sin(uTime * aSpeed + aPhase);

          // Comets: peaky flare
          float flare = pow(s, 6.0);

          float twinkle = mix(s, flare, aComet);
          float b = clamp(aBase + (aAmp * 1.25) * twinkle, 0.0, 1.0);

          vBrightness = b;
          vComet = aComet;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Constant screen-space size (works well for “sky”)
          float cometBoost = mix(1.0, 1.8, aComet);   // comets ~80% larger
          gl_PointSize = uSize * cometBoost;
        }
      `,
      fragmentShader: `
        varying float vBrightness;
        varying float vComet;

        void main() {
          // Make points circular (soft edge)
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          float core = smoothstep(0.35, 0.0, d);     // bright center
          float halo = smoothstep(0.55, 0.25, d);    // soft outer glow
          float alpha = max(core, halo * 0.6);

          // Slight blue tint for comets
          vec3 normalColor = vec3(1.0);
          vec3 cometColor = vec3(0.45, 0.65, 1.35);
          vec3 col = mix(normalColor, cometColor, vComet);

          vec3 glow = col * (vBrightness * (1.2 + core)); // boost brightness
          gl_FragColor = vec4(glow, alpha);
        }
      `,
    });
  }, [size]);

  // attach ref for uniform updates
  useMemo(() => {
    materialRef.current = material;
  }, [material]);

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-aBase" array={aBase} count={aBase.length} itemSize={1} />
        <bufferAttribute attach="attributes-aAmp" array={aAmp} count={aAmp.length} itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed" array={aSpeed} count={aSpeed.length} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" array={aPhase} count={aPhase.length} itemSize={1} />
        <bufferAttribute attach="attributes-aComet" array={aComet} count={aComet.length} itemSize={1} />
      </bufferGeometry>

      <primitive object={material} attach="material" />
    </points>
  );
}
