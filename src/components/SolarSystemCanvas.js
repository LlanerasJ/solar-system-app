import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import Scene from '../three/Scene';
import FreeViewButton from '../ui/FreeViewButton';
import ZoomButtons from '../ui/ZoomButtons';

/**
 * MultiTouchGuard:
 * - Watches touches. If it sees 2+ fingers, it enables a transparent blocker
 *   that swallows events until all fingers are lifted.
 * - When 0 fingers remain, it disables the blocker so single-finger rotate works again.
 * - It NEVER captures single-finger input.
 */
function MultiTouchGuard() {
  const [blockActive, setBlockActive] = React.useState(false);

  // Detector: never blocks; just watches for 2+ fingers to toggle the blocker.
  const onTouchStart = (e) => {
    const n = e?.nativeEvent?.touches ? e.nativeEvent.touches.length : 1;
    if (!blockActive && n > 1) setBlockActive(true);
  };
  const onTouchEnd = (e) => {
    const n = e?.nativeEvent?.touches ? e.nativeEvent.touches.length : 0;
    // when all touches are up, release the blocker
    if (blockActive && n === 0) setBlockActive(false);
  };

  return (
    <>
      {/* Passive detector (does NOT block single-finger). */}
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      />

      {/* Active blocker (only when 2+ fingers detected). */}
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={blockActive ? 'auto' : 'none'}
        // Become responder immediately and swallow everything while active
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderMove={() => {}}
        onResponderRelease={() => setBlockActive(false)}
        onResponderTerminate={() => setBlockActive(false)}
        onResponderTerminationRequest={() => true}
      />
    </>
  );
}

export default function SolarSystemCanvas() {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <Canvas camera={{ position: [18, 12, 18], fov: 45 }}>
        <Scene />
      </Canvas>

      {/* Overlays */}
      <FreeViewButton />
      <ZoomButtons />

      {/* Ignore ALL two-finger gestures; keep one-finger rotation perfect */}
      <MultiTouchGuard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
});
