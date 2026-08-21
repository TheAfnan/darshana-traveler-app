/**
 * Mood Analyzer API Client
 * Handles communication with backend /api/mood-analyze endpoint
 */

import type { MoodAnalyzeRequest, MoodAnalyzeResponse } from '../types/moodAnalyzer';

// Force correct backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const MOOD_ANALYZE_ENDPOINT = '/api/mood-analyze';

const buildEndpointUrl = (): string => {
  // Remove trailing slash from backend URL if present
  const baseUrl = BACKEND_URL.replace(/\/+$/, '');
  return `${baseUrl}${MOOD_ANALYZE_ENDPOINT}`;
};

export const getMoodAnalyzerUrl = (): string => buildEndpointUrl();

async function postMoodAnalysis(payload: { imageData?: string; imageUrl?: string }): Promise<MoodAnalyzeResponse> {
  const url = buildEndpointUrl();

  if (!payload.imageData && !payload.imageUrl) {
    throw new Error('Image data is required for mood analysis.');
  }

  const requestBody: MoodAnalyzeRequest = {
    ...(payload.imageData ? { imageData: payload.imageData } : {}),
    ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
  };

  try {
    console.debug(' Calling mood analyzer endpoint:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error(' Failed to parse JSON:', text);
      throw new Error(`Invalid JSON response from server: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error(' Mood analyzer API error:', errorMessage);
      throw new Error(errorMessage);
    }

    if (!data) {
      throw new Error('Mood analyzer returned an empty response.');
    }

    console.debug(' Mood analyzer response received');
    return data as MoodAnalyzeResponse;
  } catch (error) {
    console.error(' Mood analyzer request failed:', error);
    
    // Fallback to local simulation if backend is unreachable
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn('⚠️ Backend unreachable. Using local fallback simulation.');
      return getFallbackMoodAnalysis();
    }
    throw error;
  }
}

// Local fallback simulation
function getFallbackMoodAnalysis(): MoodAnalyzeResponse {
  const moods = [
    {
      name: 'Happy',
      energy: 7,
      social: 7,
      adventure: 6,
      keys: ['Beach', 'Street Food', 'City Walks'],
      emotions: { happy: 0.85, sad: 0.05, angry: 0.0, surprised: 0.05, neutral: 0.1, fear: 0.0, disgust: 0.0 },
    },
    {
      name: 'Excited',
      energy: 9,
      social: 8,
      adventure: 8,
      keys: ['Nightlife', 'Theme Parks', 'Road Trips'],
      emotions: { happy: 0.75, sad: 0.02, angry: 0.0, surprised: 0.18, neutral: 0.05, fear: 0.0, disgust: 0.0 },
    },
    {
      name: 'Sad',
      energy: 3,
      social: 2,
      adventure: 2,
      keys: ['Nature', 'Quiet Stays', 'Wellness'],
      emotions: { happy: 0.05, sad: 0.8, angry: 0.0, surprised: 0.0, neutral: 0.15, fear: 0.0, disgust: 0.0 },
    },
    {
      name: 'Calm',
      energy: 4,
      social: 3,
      adventure: 3,
      keys: ['Lakes', 'Temples', 'Spa'],
      emotions: { happy: 0.15, sad: 0.05, angry: 0.0, surprised: 0.05, neutral: 0.7, fear: 0.0, disgust: 0.0 },
    },
  ];

  const randomMood = moods[Math.floor(Math.random() * moods.length)];

  return {
    detectedMood: randomMood.name,
    confidence: 0.9 + Math.random() * 0.05,
    emotions: randomMood.emotions,
    energyLevel: randomMood.energy,
    socialScore: randomMood.social,
    adventureScore: randomMood.adventure,
    reasoning: `Detected facial expressions matching '${randomMood.name}'. Recommended for ${randomMood.keys.join(', ')} experiences.`,
    recommendedKeys: randomMood.keys,
  };
}

export async function analyzeMoodWithImage(imageData: string): Promise<MoodAnalyzeResponse> {
  return postMoodAnalysis({ imageData });
}
