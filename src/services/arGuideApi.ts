/**
 * AR Guide API Service
 * Handles communication with backend /api/ar-guide endpoint
 */

import type { ARGuideResponse, ARResult } from '../types/arGuide';

// Force correct backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const AR_GUIDE_ENDPOINT = '/api/ar-guide';

const buildEndpointUrl = (): string => {
  const baseUrl = BACKEND_URL.replace(/\/+$/, '');
  return `${baseUrl}${AR_GUIDE_ENDPOINT}`;
};

export const getARGuideUrl = (): string => buildEndpointUrl();

async function postARAnalysis(payload: { imageData?: string; imageUrl?: string; location?: { lat: number; lng: number } }): Promise<ARResult> {
  const url = buildEndpointUrl();

  if (!payload.imageData && !payload.imageUrl) {
    throw new Error('Image data is required for AR analysis.');
  }

  try {
    console.debug('📨 Calling AR Guide endpoint:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data: ARGuideResponse;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('❌ Failed to parse JSON:', text);
      throw new Error(`Invalid JSON response from server: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      const errorMessage = data?.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error('❌ AR Guide API error:', errorMessage);
      throw new Error(errorMessage);
    }

    if (!data.data) {
      throw new Error('AR Guide returned an empty response.');
    }

    console.debug('✅ AR Guide response received');
    return data.data;
  } catch (error) {
    console.error('❌ AR Guide request failed:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn('⚠️ Backend unreachable for AR Guide. Using simulated smart AR result.');
      return getFallbackARAnalysis();
    }
    return getFallbackARAnalysis();
  }
}

function getFallbackARAnalysis(): ARResult {
  return {
    detectedMood: 'Inspired Explorer',
    energyLevel: 8,
    socialScore: 7,
    adventureScore: 9,
    recommendations: [
      {
        id: 'ladakh',
        title: 'Ladakh, J&K',
        description: 'High-altitude desert with stunning monasteries and adventure.',
        state: 'Jammu & Kashmir',
        pricePerDay: 3500,
        matchScore: 94,
        highlight: 'Magnetic Hill & Pangong Lake',
      },
      {
        id: 'rishikesh',
        title: 'Rishikesh, Uttarakhand',
        description: 'Yoga capital of India with spiritual and river rafting vibes.',
        state: 'Uttarakhand',
        pricePerDay: 2000,
        matchScore: 89,
        highlight: 'Ganga Aarti & Cliff Jumping',
      },
      {
        id: 'kerala',
        title: 'Kerala Backwaters',
        description: 'Serene houseboats, lush coconut palms, and wellness spas.',
        state: 'Kerala',
        pricePerDay: 3000,
        matchScore: 85,
        highlight: 'Alleppey Houseboat Cruise',
      },
    ],
  };
}

export async function analyzeARScene(imageData: string, location?: { lat: number; lng: number }): Promise<ARResult> {
  return postARAnalysis({ imageData, location });
}
