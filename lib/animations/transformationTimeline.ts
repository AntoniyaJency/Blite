/**
 * BLITE — Photorealistic Digital Human Transformation Timeline
 * Decoupled animation math, 7 milestone thresholds, and continuous morph parameters.
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
 * Normalized 7-Milestone Progress Thresholds:
 * 0.00 = DAY 01
 * 0.16 = DAY 15
 * 0.33 = DAY 30
 * 0.50 = DAY 45
 * 0.66 = DAY 60
 * 0.83 = DAY 75
 * 1.00 = DAY 90
 */
export const MILESTONES = [
  {
    day: '01',
    progress: 0.00,
    title: 'START',
    subtitle: 'Every transformation begins with showing up.',
    statement: 'ONE DECISION.\nONE START.',
    body: 'Starting point',
    strength: 'Beginning',
    consistency: 'Building',
  },
  {
    day: '15',
    progress: 0.16,
    title: 'SHOWING UP',
    subtitle: 'Small choices become stronger habits.',
    statement: 'SHOWING UP.\nFINDING RHYTHM.',
    body: 'Early adaptation',
    strength: 'Foundational',
    consistency: 'Active',
  },
  {
    day: '30',
    progress: 0.33,
    title: 'BUILDING HABITS',
    subtitle: 'Consistency creates the first visible shift.',
    statement: 'SMALL CHOICES.\nBUILDING HABITS.',
    body: 'Progress showing',
    strength: 'Building',
    consistency: 'Consistent',
  },
  {
    day: '45',
    progress: 0.50,
    title: 'FEELING STRONGER',
    subtitle: 'The internal drive matches the physical change.',
    statement: 'FEELING STRONGER.\nVISIBLE CHANGE.',
    body: 'Visibly changing',
    strength: 'Growing',
    consistency: 'Deepening',
  },
  {
    day: '60',
    progress: 0.66,
    title: 'SEEING CHANGE',
    subtitle: 'Strength changes more than your body.',
    statement: 'SEEING CHANGE.\nCORE STABILITY.',
    body: 'Stronger',
    strength: 'Growing',
    consistency: 'Empowered',
  },
  {
    day: '75',
    progress: 0.83,
    title: 'BECOMING STRONGER',
    subtitle: 'Athletic power emerging with every movement.',
    statement: 'BECOMING STRONGER.\nATHLETIC FORM.',
    body: 'Athletic silhouette',
    strength: 'Capable',
    consistency: 'Unshakable',
  },
  {
    day: '90',
    progress: 1.00,
    title: 'TRANSFORMED',
    subtitle: 'Stronger. More confident. Still becoming.',
    statement: 'TRANSFORMED.\nPOWER UNLOCKED.',
    body: 'Transformed',
    strength: 'Stronger',
    consistency: 'Elevated',
  },
] as const;

export interface TransformationState {
  bodyFat: number;          // 1.00 (Day 01) -> 0.35 (Day 90)
  abdomenFat: number;       // 1.00 (Day 01) -> 0.25 (Day 90)
  waistWidth: number;       // 1.00 (Day 01) -> 0.72 (Day 90)
  hipWidth: number;         // 1.00 (Day 01) -> 0.78 (Day 90)
  armSoftness: number;      // 1.00 (Day 01) -> 0.40 (Day 90)
  thighSoftness: number;    // 1.00 (Day 01) -> 0.45 (Day 90)
  faceFullness: number;     // 1.00 (Day 01) -> 0.70 (Day 90)
  muscleDefinition: number; // 0.05 (Day 01) -> 0.75 (Day 90)
  posture: number;          // 0.00 (Day 01) -> 1.00 (Day 90)
}

/**
 * Calculates continuous anatomical deformation state from scroll progress (0.0 -> 1.0).
 */
export function calculateTransformationState(progress: number): TransformationState {
  const p = clamp(progress, 0, 1);

  return {
    bodyFat: lerp(1.00, 0.35, smoothstep(0.04, 0.94, p)),
    abdomenFat: lerp(1.00, 0.25, smoothstep(0.06, 0.92, p)),
    waistWidth: lerp(1.00, 0.72, smoothstep(0.08, 0.90, p)),
    hipWidth: lerp(1.00, 0.78, smoothstep(0.10, 0.92, p)),
    armSoftness: lerp(1.00, 0.40, smoothstep(0.12, 0.90, p)),
    thighSoftness: lerp(1.00, 0.45, smoothstep(0.10, 0.92, p)),
    faceFullness: lerp(1.00, 0.70, smoothstep(0.20, 0.88, p)),
    muscleDefinition: lerp(0.05, 0.75, smoothstep(0.18, 0.95, p)),
    posture: smoothstep(0.02, 0.88, p),
  };
}

/**
 * Smooth Day counter calculation (1 to 90)
 * Reaches 90 by progress ~0.92, just before the outro overlay at 0.93
 */
export function getCurrentDayNumber(progress: number): number {
  const p = clamp(progress, 0, 1);
  if (p < 0.15) return Math.round(lerp(1, 15, p / 0.15));
  if (p < 0.30) return Math.round(lerp(15, 30, (p - 0.15) / 0.15));
  if (p < 0.45) return Math.round(lerp(30, 45, (p - 0.30) / 0.15));
  if (p < 0.58) return Math.round(lerp(45, 60, (p - 0.45) / 0.13));
  if (p < 0.72) return Math.round(lerp(60, 75, (p - 0.58) / 0.14));
  if (p < 0.92) return Math.round(lerp(75, 90, (p - 0.72) / 0.20));
  return 90;
}

/**
 * Returns the current active milestone data
 */
export function getActiveMilestoneData(progress: number) {
  const p = clamp(progress, 0, 1);
  if (p < 0.08) return MILESTONES[0];
  if (p < 0.24) return MILESTONES[1];
  if (p < 0.41) return MILESTONES[2];
  if (p < 0.58) return MILESTONES[3];
  if (p < 0.74) return MILESTONES[4];
  if (p < 0.88) return MILESTONES[5];
  return MILESTONES[6];
}
