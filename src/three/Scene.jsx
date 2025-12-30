import React, { useEffect, useMemo, useRef } from 'react';
import { OrbitControls } from '@react-three/drei/native';
import Sun from './Sun';
import Planet from './Planet';
import Orbits from './Orbits';
import { PLANETS } from '../data/planets';
import useSolarStore from '../store/solarStore';
import useFocusCamera from '../util/useFocusCamera';

export default function Scene() {
  const controlsRef   = useRef();
  const setControls   = useSolarStore((s) => s.setControls);
  const selectedId    = useSolarStore((s) => s.selectedId);
  const controlsEpoch = useSolarStore((s) => s.controlsEpoch);
  const { startFollow } = useFocusCamera(controlsRef);

  // expose controls to overlays
  useEffect(() => { setControls(controlsRef); }, [setControls]);

  const isFocus = !!selectedId;

  // We do NOT use native pinch zoom at all (buttons handle zoom).
  // Gestures:
  //  - Focus: one-finger rotate; two-finger rotate (no pan)
  //  - Free : one-finger rotate; two-finger pan (still no zoom)
  const touches = useMemo(
    () => (isFocus ? { ONE: 0, TWO: 0 } : { ONE: 0, TWO: 1 }),
    [isFocus]
  );

  // Configure capabilities per mode
  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;

    c.enableZoom   = false;         // pinch zoom disabled globally — use +/- buttons
    c.enableRotate = true;
    c.enablePan    = !isFocus;      // no pan in focus mode

    c.update?.();
  }, [isFocus]);

  // Remount controls when:
  //  - mode changes (focus <-> free)
  //  - GestureResetter bumps epoch after a multi-touch gesture ends
  const controlsKey = `${isFocus ? 'focus' : 'free'}-${controlsEpoch}`;

  return (
    <>
      <color attach="background" args={['#000000']} />

      <Sun />
      <Orbits />

      {PLANETS.map((p) => (
        <Planet key={p.id} data={p} timeScale={0.8} onFocus={startFollow} />
      ))}

      <ambientLight intensity={0.2} />
      <OrbitControls
        key={controlsKey}
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={120}
        touches={touches}
      />
    </>
  );
}
