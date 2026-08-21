/**
 * AR Guide Types
 * Interfaces for AR overlay, mood analysis, and destination data
 */

import type { Destination, EmotionScores } from './moodAnalyzer';

export interface ARResult {
  detectedMood: string;
  confidence: number;
  emotions: EmotionScores;
  energyLevel: number;
  socialScore: number;
  adventureScore: number;
  recommendations: ARDestination[];
  reasoning: string;
}

export interface ARDestination extends Destination {
  arOverlayUrl?: string; // URL for AR asset if available
  matchScore: number;
  distance?: string; // Distance from user
}

export interface ARGuideResponse {
  success: boolean;
  data?: ARResult;
  error?: string;
}

export interface FacePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}
