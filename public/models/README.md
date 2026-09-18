# PRODUCTION DIGITAL HUMAN ASSET SPECIFICATION

Target Asset Path:
`/public/models/blite-digital-human.glb`

## 1. Character & Visual Quality
- **Standard**: MetaHuman / photogrammetry-quality adult female digital human
- **Anatomy**: Photorealistic facial anatomy, eyes, eyelashes, hair, hands, fingers, feet, and believable human body proportions
- **Materials**: Physically based skin with subsurface scattering, roughness variation, subtle pores, natural skin color variation, and realistic specular response. Realistic fabric on fitted black athletic gym wear.
- **Single Identity**: Overweight and fit states must share identical facial structure, eyes, nose, lips, hair, skin tone, height, and clothing.

## 2. Technical Quality & Rigging
- **Format**: Binary GLTF (.glb)
- **Geometry**: Clean, continuous manifold quad/tri topology shared between all transformation states.
- **Morph Targets (Blend Shapes)**:
  - `bodyFat`: 1.00 (Day 01, higher body fat) -> 0.35 (Day 90, athletic lean)
  - `abdomenFat`: 1.00 (Day 01, soft rounded curve) -> 0.25 (Day 90, flat defined core)
  - `waistWidth`: 1.00 (Day 01, fuller waist) -> 0.72 (Day 90, tapered waist)
  - `hipWidth`: 1.00 (Day 01, fuller hips) -> 0.78 (Day 90, athletic hips)
  - `armSoftness`: 1.00 (Day 01, soft upper arms) -> 0.40 (Day 90, firm toned arms)
  - `thighSoftness`: 1.00 (Day 01, softer thighs) -> 0.45 (Day 90, sculpted legs)
  - `faceFullness`: 1.00 (Day 01) -> 0.70 (Day 90, subtly leaner)
  - `muscleDefinition`: 0.05 (Day 01) -> 0.75 (Day 90, natural definition)
  - `posture`: 0.00 (Day 01, forward lean) -> 1.00 (Day 90, tall athletic alignment)
- **Clothing**: Fitted black workout crop top and high-waisted leggings rigged to follow the identical body deformation.

The `HumanMorphController.tsx` and `DigitalHuman.tsx` components automatically bind to these morph target names upon placing the model in this directory.
