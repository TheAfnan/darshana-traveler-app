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
  imageUrl?: string;
  nearbySpots?: string[];
  travelHubTag?: string;
}
