🌌 Solar System Explorer (React Native + Three.js)
A mobile 3D solar system experience built with React Native, Expo, and React Three Fiber, featuring real-time 3D rendering, smooth touch interaction, and a custom GPU-powered starfield with dynamic flickering “comet” effects.
This project focuses on performance, realism, and mobile compatibility—no DOM, no web-only libraries, and no shortcuts that break on native.

✨ Features
🌍 3D Solar System
Sun and planets rendered in real-time 3D
Orbital rings for visual clarity
Scaled distances using astronomical units (AU)

🌌 Custom GPU Starfield
Procedural star generation (no textures)
Per-star flickering computed in a shader
Rare comet-like stars with strong blue glow
Optimized for mobile GPUs

📱 Mobile-Optimized Controls
One-finger rotation
Two-finger gestures intelligently blocked to prevent camera glitches
Free-view and focus modes
Smooth zoom controls

⚡ Expo + Native Safe
No DOM access
No web-only Three.js extensions
Fully compatible with iOS & Android
🛠 Tech Stack
React Native
Expo
Three.js
@react-three/fiber
Custom GLSL shaders
JavaScript / ES6

🎮 Controls
One finger: Rotate the view
Zoom buttons: Camera zoom in/out
Free View button: Toggle camera behavior
Touch Guard: Prevents multi-touch camera lockups

🌠 Starfield System (Highlights)
The background sky is not a static image.
Instead, it uses:
A procedural star distribution
A custom shader that:
Calculates per-star flicker
Adds pulsing comet flares
Applies strong blue glow for visibility on mobile
No textures, no loaders, no performance bottlenecks
This approach guarantees:
Smooth animation
Consistent visuals across devices
Zero asset management headaches

📂 Project Structure (Simplified)
src/
├── three/
│   ├── Scene.jsx
│   ├── Planet.js
│   ├── Sun.js
│   ├── Orbits.js
│   ├── StarFieldShader.js
│
├── components/
│   └── SolarSystemCanvas.js
│
├── ui/
│   ├── FreeViewButton.js
│   └── ZoomButtons.js
│
├── data/
│   └── planets.js
│
assets/
└── (icons & app assets)

🚀 Getting Started
npm install
npx expo start

Tested with Expo Go and native simulators.
Designed to avoid web-only Three.js dependencies.

🧠 Design Philosophy
Mobile-first rendering decisions
Explicit control over performance
No hidden dependencies
Shader-based visuals over heavy assets
Readable, modular code

🔮 Roadmap / Ideas
Planet focus transitions with easing
Time scaling (fast-forward orbits)
Informational overlays per planet
Moving comets with tails
Subtle nebula bands
Audio-reactive space ambience

📸 Screenshots / Video
(Coming soon)

👤 Author
Built by Jonathan Llaneras
Full-stack developer focused on performance-oriented interactive experiences.
