import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import * as THREE from 'three';
import useSolarStore from '../store/solarStore';

export default function ZoomButtons() {
  const controlsRef = useSolarStore((s) => s.controlsRef);

  const step = (factor) => {
    const c = controlsRef?.current;
    if (!c) return;
    const cam = c.object;
    const tgt = c.target;

    const dist = cam.position.distanceTo(tgt);
    const newDist = THREE.MathUtils.clamp(dist * factor, 0.5, 500);

    const dir = new THREE.Vector3().subVectors(cam.position, tgt).normalize();
    const newPos = new THREE.Vector3().copy(tgt).add(dir.multiplyScalar(newDist));

    cam.position.copy(newPos);
    c.update?.();
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.toolbar}>
        <Pressable onPress={() => step(1.1)} style={styles.btn}>
          <Text style={styles.txt}>−</Text>
        </Pressable>
        <Pressable onPress={() => step(0.9)} style={styles.btn}>
          <Text style={styles.txt}>＋</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 16, alignItems: 'center' },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    padding: 6,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    //borderColor: 'rgba(255,255,255,0.25)',
  },
  txt: { color: 'white', fontSize: 18, fontWeight: '600' },
});
