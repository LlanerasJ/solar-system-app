import React from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import useSolarStore from '../store/solarStore';

/**
 * Smooth focus:
 * - Immediately pivot around the planet (set controls.target)
 * - Smoothly fly camera to a nice offset
 * - After the fly-in, follow the planet by translating camera & target by its delta
 * Falls back to the store's last known planet position if a stale (0,0,0) sneaks in.
 */
export default function useFocusCamera(controlsRef) {
  const { camera } = useThree();
  const followTarget = useSolarStore((s) => s.followTarget);
  const setFollowTarget = useSolarStore((s) => s.setFollowTarget);

  const stateRef = React.useRef({
    _lastTarget: new THREE.Vector3(),
    _initialized: false,
  });

  // follow loop: translate camera & target by planet movement
  useFrame(() => {
    const c = controlsRef.current;
    const obj = followTarget;
    if (!c || !obj) {
      stateRef.current._initialized = false;
      return;
    }

    const pos = obj.position;

    if (!stateRef.current._initialized) {
      stateRef.current._lastTarget.copy(pos);
      stateRef.current._initialized = true;
    }

    const delta = new THREE.Vector3().copy(pos).sub(stateRef.current._lastTarget);
    camera.position.add(delta);
    c.target.add(delta);
    c.update();

    stateRef.current._lastTarget.copy(pos);
  });

  // smooth fly helper
  const flyTo = React.useCallback((toPos, toTarget, duration = 750) => {
    const c = controlsRef.current;
    const fromPos = camera.position.clone();
    const fromTarget = c?.target?.clone?.() || new THREE.Vector3();

    let t0;
    function step(ts) {
      if (t0 === undefined) t0 = ts;
      const t = Math.min(1, (ts - t0) / duration);
      camera.position.lerpVectors(fromPos, toPos, t);
      if (c?.target) {
        c.target.lerpVectors(fromTarget, toTarget, t);
        c.update?.();
      }
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [camera, controlsRef]);

  const startFollow = React.useCallback((planetData, obj3d, worldPosAtTap) => {
    if (!obj3d) return;
    const c = controlsRef.current;
    if (!c) return;

    // 1) Resolve a safe, non-zero planet world position
    let pos = (worldPosAtTap && worldPosAtTap.clone()) || obj3d.position.clone();
    if (pos.lengthSq() < 1e-8) {
      const byId = useSolarStore.getState().planetPositions[planetData.id];
      if (byId) pos = new THREE.Vector3(byId.x, byId.y, byId.z);
    }

    // 2) Choose a comfortable view offset: from current camera toward/away from planet
    const radius = planetData?.radius ?? 1;
    const dist = radius * 6 + 4;
    const offsetDir = new THREE.Vector3().subVectors(camera.position, pos).normalize();
    if (!isFinite(offsetDir.x) || !isFinite(offsetDir.y) || !isFinite(offsetDir.z)) {
      offsetDir.set(1, 0.2, 1).normalize();
    }
    const toTarget = pos.clone();
    const toPos = pos.clone().add(offsetDir.multiplyScalar(dist));
    toPos.y += radius * 0.2;

    // 3) Pivot immediately around the planet so rotation feels correct during the fly-in
    c.target.copy(toTarget);
    c.update?.();

    // 4) Smooth fly-in
    setFollowTarget(null);
    flyTo(toPos, toTarget, 750);

    // 5) Begin follow after the animation
    setTimeout(() => {
      stateRef.current._lastTarget.copy(obj3d.position);
      stateRef.current._initialized = true;
      setFollowTarget(obj3d);
    }, 760);
  }, [camera, controlsRef, flyTo, setFollowTarget]);

  return { startFollow };
}
