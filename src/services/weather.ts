export type WeatherSnapshot = {
  tempC: number | null;
  feelsLikeC: number | null;
  humidity: number | null;
  description: string;
};

export type WeatherQuery =
  | string
  | {
      city?: string;
      state?: string;
      country?: string;
      lat?: number;
      lon?: number;
      name?: string;
    };

const weatherCache = new Map<string, WeatherSnapshot>();
const WEATHER_API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

function resolveQuery(query: WeatherQuery): { cacheKey: string; q: string } {
  if (typeof query === 'string') {
    const clean = query.trim();
    const fallback = clean || 'India';
    return { cacheKey: fallback.toLowerCase(), q: fallback };
  }

  const { lat, lon, city, state, country, name } = query;

  if (typeof lat === 'number' && typeof lon === 'number') {
    const coords = `${lat},${lon}`;
    return { cacheKey: coords, q: coords };
  }

  const place = [city ?? name, state, country].filter(Boolean).join(', ');
  const fallback = place || 'India';
  return { cacheKey: fallback.toLowerCase(), q: fallback };
}

export async function fetchLiveWeather(query: WeatherQuery): Promise<WeatherSnapshot> {
  const { cacheKey, q } = resolveQuery(query);

  if (weatherCache.has(cacheKey)) {
    return weatherCache.get(cacheKey)!;
  }

  if (!WEATHER_API_KEY) {
    throw new Error('Missing VITE_WEATHERAPI_KEY for weather lookup');
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(q)}&aqi=no`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`WeatherAPI lookup failed for ${q}`);
  }

  const data = await res.json();
  const current = data?.current;

  const snapshot: WeatherSnapshot = {
    tempC: typeof current?.temp_c === 'number' ? current.temp_c : null,
    feelsLikeC: typeof current?.feelslike_c === 'number' ? current.feelslike_c : null,
    humidity: typeof current?.humidity === 'number' ? current.humidity : null,
    description: current?.condition?.text || 'Weather update',
  };

  weatherCache.set(cacheKey, snapshot);
  return snapshot;
}
