/**
 * AR Monument Guide Types
 * Interfaces for Monument Image Recognition, Architecture Analysis & Historical Insights
 */

export interface MonumentResult {
  name: string;
  location: string;
  era: string;
  builtBy: string;
  architectureStyle: string;
  history: string;
  funFacts: string[];
  confidence: 'high' | 'medium' | 'low';
  isLiveAI: boolean;
  isIdentified?: boolean;
  errorReason?: string;
  imageUrl?: string;
  nearbySpots?: string[];
  travelHubTag?: string;
  wikipediaUrl?: string;
  wikipediaExtract?: string;
  wikipediaDescription?: string;
}
