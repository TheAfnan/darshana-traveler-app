import { getBackendUrl } from '../config/api';

const resolveBackendOrigin = (): string => {
  const envUrl = import.meta.env.VITE_BACKEND_URL?.trim();
  const candidate = envUrl || getBackendUrl() || 'http://localhost:3001';
  return candidate.replace(/\/+$/, '');
};

const API_BASE_URL = `${resolveBackendOrigin()}/api`;

const fallbackQuestions: Record<string, string[]> = {
  itinerary: [
    'Plan a 7-day North India itinerary',
    'Best South India tour route',
    'How many days per destination?',
    'Best time to visit Rajasthan?',
    'Budget itinerary for 5 days'
  ],
  safety: [
    'Safety tips for solo travelers',
    'Is it safe to travel at night?',
    'Areas to avoid in major cities',
    'Stay safe using public transport',
    'Emergency precautions'
  ],
  emergency: [
    'Emergency numbers in India',
    'How to contact the police',
    'Medical emergency services',
    'Tourist helpline numbers',
    'Report a crime or incident'
  ],
  culture: [
    'Essential Hindi phrases',
    'Major festivals in India',
    'Indian dining etiquette',
    'Religious sites significance',
    'Regional Indian cuisines'
  ],
  experience: [
    'Best adventure activities',
    'Top 10 must-visit destinations',
    'Best trekking routes',
    'Water sports and beaches',
    'Cultural experiences'
  ],
  practical: [
    'Required travel documents',
    'Train vs Bus vs Flight',
    'Currency and payment methods',
    'Accommodation options',
    'Visa requirements'
  ],
};

const defaultQuestions = Object.entries(fallbackQuestions).flatMap(([category, questions]) =>
  questions.map(question => ({ category, question }))
);

export async function fetchQuestionsFromDB(category?: string) {
  try {
    const url = category
      ? `${API_BASE_URL}/questions/category/${category}`
      : `${API_BASE_URL}/questions`;

    // Short timeout to avoid noisy console errors when backend is down
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.info('[questions] Using fallback; backend unavailable:', message);
    if (category) {
      return fallbackQuestions[category]?.map(question => ({ category, question })) || [];
    }
    return defaultQuestions;
  }
}

export async function saveChatToDB(userId: string, messages: any[], category?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        conversation: messages,
        category
      })
    });
    if (!response.ok) throw new Error('Failed to save chat');
    return await response.json();
  } catch (error) {
    console.error('Error saving chat:', error);
    return null;
  }
}

export async function getChatHistory(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/history/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

export async function saveFeedback(userId: string, feedback: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...feedback
      })
    });
    if (!response.ok) throw new Error('Failed to save feedback');
    return await response.json();
  } catch (error) {
    console.error('Error saving feedback:', error);
    return null;
  }
}

export async function searchQuestions(q: string, category?: string) {
  try {
    const params = new URLSearchParams({ q });
    if (category) params.append('category', category);
    const response = await fetch(`${API_BASE_URL}/questions/search?${params}`);
    if (!response.ok) throw new Error('Failed to search questions');
    return await response.json();
  } catch (error) {
    console.error('Error searching questions:', error);
    return [];
  }
}

export async function getStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/stats/analytics`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}
