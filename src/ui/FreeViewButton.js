import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import useSolarStore from '../store/solarStore';

export default function FreeViewButton() {
  const controlsRef     = useSolarStore((s) => s.controlsRef);
  const selectedId      = useSolarStore((s) => s.selectedId);
  const setSelected     = useSolarStore((s) => s.setSelected);
  const setFollowTarget = useSolarStore((s) => s.setFollowTarget);

  if (!selectedId) return null;

  const onPress = () => {
    setSelected(null);
    setFollowTarget(null);
    controlsRef?.current?.reset?.();
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable onPress={onPress} style={styles.btn}>
        <Text style={styles.txt}>Free View</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: 16, top: 16 },
  btn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  txt: { color: 'white', fontSize: 14 },
});
