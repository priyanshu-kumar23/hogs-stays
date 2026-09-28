// Section positions are measured from the DOM so editorial changes do not break the journey.
export const cameraPath = [
  { section: 'home', position: [0, 10, 27], target: [0, 4, -15], phase: 0 },
  { section: 'intro', position: [-3, 12, 22], target: [0, 4, -20], phase: 0.12 },
  { section: 'our-stay', position: [-10, 5, 13], target: [-6, 1.3, -3], phase: 0.3 },
  { section: 'boutique', position: [10, 4, 10], target: [7, 1.3, -8], phase: 0.45 },
  { section: 'features', position: [0, 12, 22], target: [0, 1, -10], phase: 0.55 },
  { section: 'gallery', position: [-7, 9, 20], target: [0, 3, -15], phase: 0.65 },
  { section: 'about-us', position: [0, 9, 24], target: [0, 8, -20], phase: 0.9 },
  { section: 'form', position: [0, 7, 18], target: [0, 8, -20], phase: 1 },
] as const;
export const sceneState = { x: 0, y: 10, z: 27, tx: 0, ty: 4, tz: -15, phase: 0, warmth: 0 };

