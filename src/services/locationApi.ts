export interface LocationSuggestion {
  id: string;
  name: string;
  state: string;
  type: string;
  value: string;
}

const DATA_URL = '/data/india-locations.json';

// Minimal offline fallback so UI keeps working if the dataset is unreachable.
const FALLBACK_LOCATIONS: LocationSuggestion[] = [
  { id: 'delhi', name: 'New Delhi', state: 'Delhi', type: 'city', value: 'New Delhi, Delhi' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', type: 'city', value: 'Mumbai, Maharashtra' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', type: 'city', value: 'Jaipur, Rajasthan' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', type: 'city', value: 'Bengaluru, Karnataka' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', type: 'city', value: 'Kolkata, West Bengal' },
  { id: 'goa', name: 'Goa', state: 'Goa', type: 'state', value: 'Goa' },
];

let cache: LocationSuggestion[] | null = null;
let inflightRequest: Promise<LocationSuggestion[]> | null = null;

const normalize = (value: string): string => value.trim().toLowerCase();

const loadLocations = async (): Promise<LocationSuggestion[]> => {
  if (cache) {
    return cache;
  }

  if (inflightRequest) {
    return inflightRequest;
  }

  inflightRequest = fetch(DATA_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load locations (${response.status})`);
      }
      const data = (await response.json()) as LocationSuggestion[];
      cache = data;
      return data;
    })
    .catch((error) => {
      console.error('Failed to fetch location dataset, using fallback:', error);
      cache = FALLBACK_LOCATIONS;
      return FALLBACK_LOCATIONS;
    })
    .finally(() => {
      inflightRequest = null;
    });

  return inflightRequest;
};

export const searchLocations = async (
  query: string,
  limit = 8
): Promise<LocationSuggestion[]> => {
  const normalized = normalize(query);
  if (!normalized) {
    return [];
  }

  try {
    const locations = await loadLocations();
    const matcher = normalized.replace(/[,*+?^${}()|[\]\\]/g, '');

    const results = locations
      .map((location) => ({
        location,
        score: scoreMatch(location, matcher),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => entry.location);

    return results;
  } catch (error) {
    console.error('Location search failed:', error);
    return [];
  }
};

const scoreMatch = (location: LocationSuggestion, query: string): number => {
  const haystack = `${location.name} ${location.state} ${location.type}`.toLowerCase();

  if (!query) {
    return 0;
  }

  const exact = haystack === query;
  if (exact) {
    return 100;
  }

  const startsWith = haystack.startsWith(query);
  if (startsWith) {
    return 90;
  }

  const includes = haystack.includes(query);
  if (includes) {
    return 70;
  }

  return 0;
};

export const formatLocationLabel = (location: LocationSuggestion): string => {
  const chunks = [location.name];
  if (location.state) {
    chunks.push(location.state);
  }
  return chunks.join(', ');
};
