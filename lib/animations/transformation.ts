/**
 * Animation math, 7-milestone thresholds, camera splines,
 * and anatomical morph parameters for the BLITE 3D Human Transformation.
 */

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * 7 Milestone Thresholds:
 * 0.00 = DAY 01
 * 0.16 = DAY 15
 * 0.33 = DAY 30
 * 0.50 = DAY 45
 * 0.66 = DAY 60
 * 0.83 = DAY 75
 * 1.00 = DAY 90
 */
export const MILESTONES = [
  { day: '01', progress: 0.0,  title: 'START',             body: 'Starting Point',    movement: 'Getting Started',    mindset: 'Make The Decision' },
  { day: '15', progress: 0.16, title: 'SHOWING UP',        body: 'Early Adaptation',  movement: 'Finding Rhythm',      mindset: 'Consistency Begins' },
  { day: '30', progress: 0.33, title: 'BUILDING HABITS',   body: 'Progress Showing',  movement: 'Building Strength',   mindset: 'Building Consistency' },
  { day: '45', progress: 0.50, title: 'FEELING STRONGER',  body: 'Visible Changes',   movement: 'Higher Endurance',    mindset: 'Internal Drive' },
  { day: '60', progress: 0.66, title: 'SEEING CHANGE',     body: 'Stronger',          movement: 'More Capable',        mindset: 'More Confident' },
  { day: '75', progress: 0.83, title: 'BECOMING STRONGER', body: 'Athletic Form',     movement: 'Peak Power',          mindset: 'Unshakable Focus' },
  { day: '90', progress: 1.0,  title: 'TRANSFORMED',       body: 'Transformed',       movement: 'Stronger',            mindset: 'Confident' },
] as const;

export interface MorphParameters {
  fatReduction: number;       // 0 (overweight/softer) -> 1 (lean/toned)
  waistTaper: number;         // 0 (wide waist) -> 1 (slender, defined waist)
  abdomenDefinition: number;  // 0 (soft rounded curve) -> 1 (flat, toned core)
  armFirmness: number;        // 0 (soft upper arms) -> 1 (firm, athletic definition)
  thighFirmness: number;      // 0 (softer hips/thighs) -> 1 (sculpted athletic legs)
  muscleTone: number;         // 0 (baseline) -> 1 (natural athletic definition)
  posture: number;            // 0 (relaxed, forward pelvic lean) -> 1 (tall, athletic alignment)
}

/**
 * Computes the continuous anatomical morph parameters for any scroll progress (0 -> 1).
 * The transformation starts subtle, becomes noticeable around Day 30, and matures through Day 90.
 */
export function getMorphParameters(progress: number): MorphParameters {
  const p = clamp(progress, 0, 1);

  return {
    fatReduction: smoothstep(0.04, 0.94, p),
    waistTaper: smoothstep(0.08, 0.90, p),
    abdomenDefinition: smoothstep(0.12, 0.92, p),
    armFirmness: smoothstep(0.15, 0.90, p),
    thighFirmness: smoothstep(0.10, 0.92, p),
    muscleTone: smoothstep(0.20, 0.95, p),
    posture: smoothstep(0.02, 0.85, p),
  };
}

/**
 * Smooth Day counter calculation (interpolates smoothly between 1 and 90)
 */
export function getCurrentDay(progress: number): number {
  const p = clamp(progress, 0, 1);
  if (p < 0.16) return Math.round(lerp(1, 15, p / 0.16));
  if (p < 0.33) return Math.round(lerp(15, 30, (p - 0.16) / 0.17));
  if (p < 0.50) return Math.round(lerp(30, 45, (p - 0.33) / 0.17));
  if (p < 0.66) return Math.round(lerp(45, 60, (p - 0.50) / 0.16));
  if (p < 0.83) return Math.round(lerp(60, 75, (p - 0.66) / 0.17));
  return Math.round(lerp(75, 90, (p - 0.83) / 0.17));
}

/**
 * Returns the current active milestone data
 */
export function getActiveMilestone(progress: number) {
  const p = clamp(progress, 0, 1);
  if (p < 0.10) return MILESTONES[0];
  if (p < 0.25) return MILESTONES[1];
  if (p < 0.42) return MILESTONES[2];
  if (p < 0.58) return MILESTONES[3];
  if (p < 0.74) return MILESTONES[4];
  if (p < 0.88) return MILESTONES[5];
  return MILESTONES[6];
}

/**
 * Cinematic Camera Spline:
 * - Medium/full-body framing centered on the woman throughout.
 * - Day 01: Slightly distant, straight-on [0, 1.45, 4.8].
 * - Day 30: Gradually moves closer [0, 1.40, 4.4].
 * - Day 60: Subtle cinematic orbit angle [0.4, 1.35, 4.0].
 * - Day 90: Premium centered final angle [0, 1.32, 3.8].
 * - Outro: Pulls back slightly into the community horizon [0, 1.40, 4.6].
 */
export function getCameraCoordinates(progress: number): { x: number; y: number; z: number; lookAtY: number } {
  const p = clamp(progress, 0, 1);

  if (p < 0.33) {
    const t = smoothstep(0, 0.33, p);
    return {
      x: lerp(0.0, -0.15, t),
      y: lerp(1.45, 1.40, t),
      z: lerp(4.8, 4.4, t),
      lookAtY: lerp(1.15, 1.18, t),
    };
  } else if (p < 0.66) {
    const t = smoothstep(0.33, 0.66, p);
    return {
      x: lerp(-0.15, 0.35, t),
      y: lerp(1.40, 1.35, t),
      z: lerp(4.4, 4.0, t),
      lookAtY: lerp(1.18, 1.20, t),
    };
  } else if (p < 0.92) {
    const t = smoothstep(0.66, 0.92, p);
    return {
      x: lerp(0.35, 0.0, t),
      y: lerp(1.35, 1.32, t),
      z: lerp(4.0, 3.8, t),
      lookAtY: lerp(1.20, 1.20, t),
    };
  } else {
    const t = smoothstep(0.92, 1.0, p);
    return {
      x: 0.0,
      y: lerp(1.32, 1.40, t),
      z: lerp(3.8, 4.6, t),
      lookAtY: 1.20,
    };
  }
}

/**
 * Lighting parameters:
 * Day 01: Soft, subdued lighting.
 * Day 30: Slightly brighter.
 * Day 60: More dimensional lighting.
 * Day 90: Strong premium studio lighting with controlled highlights.
 */
export function getLightingParameters(progress: number) {
  const p = clamp(progress, 0, 1);

  return {
    keyIntensity: lerp(1.6, 4.2, p),
    fillIntensity: lerp(0.5, 1.6, p),
    violetRimIntensity: lerp(1.2, 5.0, smoothstep(0.15, 0.85, p)),
    magentaRimIntensity: lerp(0.6, 5.8, smoothstep(0.35, 0.90, p)),
    floorBounceIntensity: lerp(0.3, 1.5, p),
  };
}
