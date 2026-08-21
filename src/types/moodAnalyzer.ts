/**
 * AI Mood Analyzer Types
 * Types for facial emotion detection, mood mapping, and recommendation
 */

/**
 * Destination interface (imported from destinations.ts)
 */
export type DestinationLocation = {
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lon?: number;
};

export interface Destination {
  id: string;
  title: string;
  img: string;
  label: string;
  tags: string[];
  mood: number[];
  energy: [number, number];
  social: [number, number];
  adventure: [number, number];
  description?: string;
  state?: string;
  bestTime?: string;
  pricePerDay?: number;
  location?: DestinationLocation;
}

/**
 * Raw emotion detection output from face-api.js
 * Each emotion has a confidence score 0-1
 */
export interface EmotionScores {
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  neutral: number;
  fear: number;
  disgust: number;
}

/**
 * Detected face data with position and emotions
 */
export interface DetectedFace {
  x: number;
  y: number;
  width: number;
  height: number;
  emotions: EmotionScores;
  confidence: number;
}

/**
 * Backend API request for mood analysis
 */
export interface MoodAnalyzeRequest {
  imageData?: string; // base64 encoded image (optional if imageUrl provided)
  imageUrl?: string; // optional URL instead of base64
}

/**
 * Backend API response for mood analysis
 */
export interface MoodAnalyzeResponse {
  detectedMood: string; // e.g., "Happy & Excited"
  confidence: number; // 0-1
  emotions: EmotionScores;
  energyLevel: number; // 1-10
  socialScore: number; // 1-10
  adventureScore: number; // 1-10
  reasoning: string; // explanation of mood detection
  recommendedKeys: string[]; // ["adventure", "beach", "mountains"]
  error?: string; // error message if analysis failed
}

/**
 * Frontend AI result with filtered destinations
 */
export interface AIAnalysisResult {
  detectedMood: string;
  confidence: number;
  emotions: EmotionScores;
  reasoning: string;
  energyLevel: number;
  socialScore: number;
  adventureScore: number;
  recommendations: any[]; // Destination[]
}

/**
 * Mood mapping categories for travel recommendations
 */
export type MoodCategory =
  | "happy_excited"
  | "calm_peaceful"
  | "curious_explorative"
  | "energetic"
  | "reflective_thoughtful"
  | "neutral_balanced";

/**
 * Mood mapping configuration
 */
export interface MoodMappingConfig {
  category: MoodCategory;
  detectedMood: string;
  energyRange: [number, number];
  socialRange: [number, number];
  adventureRange: [number, number];
  recommendedTags: string[];
  reasoning: string;
}

/**
 * Hook return type for useFaceDetection
 */
export interface UseFaceDetectionReturn {
  loading: boolean;
  error: string | null;
  analyzeFromVideo: (videoElement: HTMLVideoElement) => Promise<DetectedFace[] | null>;
  analyzeFromImage: (imageData: string) => Promise<DetectedFace[] | null>;
  loadModels: () => Promise<void>;
}
