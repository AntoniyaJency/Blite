'use client';

import React from 'react';
import * as THREE from 'three';
import {
  calculateTransformationState,
  TransformationState,
} from '../../lib/animations/transformationTimeline';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * HUMAN MORPH CONTROLLER
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable transformation controller:
 *   scrollProgress -> TransformationState -> Body Morph Targets -> Digital Human
 *
 * Exposes pure deformation mapping independent of UI components.
 * Can be hooked into:
 * 1. Drei/GLTF models with blend shapes (`blite-digital-human.glb`)
 * 2. Anatomical mesh topology
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface HumanMorphControllerProps {
  progress: number;
}

export function applyMorphTargetsToGLTF(
  gltfRoot: THREE.Object3D,
  state: TransformationState,
) {
  gltfRoot.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) {
      const mesh = node as THREE.Mesh;
      if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        const dict = mesh.morphTargetDictionary;
        const inf = mesh.morphTargetInfluences;

        // Apply morph targets if present on the mesh
        if ('bodyFat' in dict) inf[dict['bodyFat']] = state.bodyFat;
        if ('fatReduction' in dict) inf[dict['fatReduction']] = 1 - state.bodyFat;
        if ('abdomenFat' in dict) inf[dict['abdomenFat']] = state.abdomenFat;
        if ('abdomenReduction' in dict) inf[dict['abdomenReduction']] = 1 - state.abdomenFat;
        if ('waistWidth' in dict) inf[dict['waistWidth']] = state.waistWidth;
        if ('waistReduction' in dict) inf[dict['waistReduction']] = 1 - state.waistWidth;
        if ('hipWidth' in dict) inf[dict['hipWidth']] = state.hipWidth;
        if ('armSoftness' in dict) inf[dict['armSoftness']] = state.armSoftness;
        if ('armDefinition' in dict) inf[dict['armDefinition']] = 1 - state.armSoftness;
        if ('thighSoftness' in dict) inf[dict['thighSoftness']] = state.thighSoftness;
        if ('legDefinition' in dict) inf[dict['legDefinition']] = 1 - state.thighSoftness;
        if ('faceFullness' in dict) inf[dict['faceFullness']] = state.faceFullness;
        if ('faceDefinition' in dict) inf[dict['faceDefinition']] = 1 - state.faceFullness;
        if ('muscleDefinition' in dict) inf[dict['muscleDefinition']] = state.muscleDefinition;
        if ('posture' in dict) inf[dict['posture']] = state.posture;
      }
    }
  });
}

export { calculateTransformationState };
