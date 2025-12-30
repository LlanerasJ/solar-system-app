import { create } from 'zustand';

const useSolarStore = create((set) => ({
  // selection & controls
  selectedId: null,
  controlsRef: null,      // { current: OrbitControls }
  followTarget: null,     // THREE.Object3D while focused

  // per-planet live world positions (id -> {x,y,z})
  planetPositions: {},

  setSelected: (id) => set({ selectedId: id }),
  setControls: (ref) => set({ controlsRef: ref }),
  setFollowTarget: (obj3d) => set({ followTarget: obj3d }),
  setPlanetPos: (id, vec3) =>
    set((s) => ({
      planetPositions: {
        ...s.planetPositions,
        [id]: { x: vec3.x, y: vec3.y, z: vec3.z },
      },
    })),
}));

export default useSolarStore;
