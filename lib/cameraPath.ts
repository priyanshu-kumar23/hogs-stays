// Real terrain coordinates: 1 unit = 100 m; north is -Z; altitude origin = 1,500 m.
// Camera flights and property markers are art-directed, not surveyed property positions.
export const cameraPath = [
 {section:'home',position:[-52,12,158],target:[-67,20,-45],phase:0},
 {section:'intro',position:[-46,12,123],target:[-13,23,10],phase:.16},
 {section:'our-stay',position:[-40,19,115],target:[-50,15,80],phase:.32},
 {section:'cafe',position:[-48,21,84],target:[-61,18,62],phase:.46},
 {section:'features',position:[-25,34,110],target:[-25,29,-65],phase:.56},
 {section:'gallery',position:[-12,42,90],target:[5,35,-90],phase:.7},
 {section:'about-us',position:[-35,28,127],target:[-40,28,-70],phase:.88},
 {section:'form',position:[-47,7,106],target:[-50,4.8,100],phase:1},
] as const;
export const sceneState={x:-52,y:12,z:158,tx:-67,ty:20,tz:-45,phase:0,warmth:0};
