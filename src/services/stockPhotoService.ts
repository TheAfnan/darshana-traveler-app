// src/services/stockPhotoService.ts

export interface StockPhoto {
  url: string;
  thumbUrl: string;
  photographerName: string;
  photographerUrl: string;
  platform: 'Unsplash' | 'Pexels' | 'Curated Editorial';
  platformUrl: string;
}

const STOCK_CACHE_KEY = 'darshana_stock_photos_cache';

// In-memory cache for ultra-fast instant lookups
const inMemoryCache: Record<string, StockPhoto> = {};

// Load cache from localStorage
function getPersistentCache(): Record<string, StockPhoto> {
  try {
    const raw = localStorage.getItem(STOCK_CACHE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load stock photo cache:', err);
  }
  return {};
}

function savePersistentCache(cache: Record<string, StockPhoto>): void {
  try {
    localStorage.setItem(STOCK_CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn('Failed to save stock photo cache:', err);
  }
}

// Curated authentic verified editorial photography with photographer attributions
export const CURATED_HERITAGE_STOCK: Record<string, StockPhoto> = {
  'agra': {
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Aman Upadhyay',
    photographerUrl: 'https://unsplash.com/@amanupadhyay',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'varanasi': {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Christina @ wocintechchat.com',
    photographerUrl: 'https://unsplash.com/@wocintechchat',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'jaipur': {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Joseph Gonzalez',
    photographerUrl: 'https://unsplash.com/@miracletwentyone',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'lucknow': {
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Jurica Koletić',
    photographerUrl: 'https://unsplash.com/@juricakoletic',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'delhi': {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Aiony Haust',
    photographerUrl: 'https://unsplash.com/@aiony',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'kerala': {
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Michael Dam',
    photographerUrl: 'https://unsplash.com/@michaeldam',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'goa': {
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Albert Dera',
    photographerUrl: 'https://unsplash.com/@albertdera',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'hampi': {
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Gift Habeshaw',
    photographerUrl: 'https://unsplash.com/@introspectivedsgn',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'kolkata': {
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Christian Buehner',
    photographerUrl: 'https://unsplash.com/@christianbuehner',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'manali': {
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Ali Morshedlou',
    photographerUrl: 'https://unsplash.com/@alimorshedlou',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  },
  'default': {
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=70',
    photographerName: 'Aman Upadhyay',
    photographerUrl: 'https://unsplash.com/@amanupadhyay',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  }
};

/**
 * Fetch a high-quality stock photo for a location/topic using Unsplash/Pexels API or Cached Curated Editorial
 */
export async function getStockPhotoForLocation(query: string): Promise<StockPhoto> {
  const normalizedKey = query.toLowerCase().trim();

  // 1. Check in-memory cache
  if (inMemoryCache[normalizedKey]) {
    return inMemoryCache[normalizedKey];
  }

  // 2. Check localStorage cache
  const stored = getPersistentCache();
  if (stored[normalizedKey]) {
    inMemoryCache[normalizedKey] = stored[normalizedKey];
    return stored[normalizedKey];
  }

  // 3. Try Unsplash API if VITE_UNSPLASH_ACCESS_KEY is configured
  const unsplashKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY?.trim();
  if (unsplashKey && unsplashKey.length > 5) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query + ' Indian person portrait'
        )}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashKey}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const item = data.results[0];
          const photo: StockPhoto = {
            url: item.urls.regular,
            thumbUrl: item.urls.thumb || item.urls.small,
            photographerName: item.user?.name || 'Unsplash Contributor',
            photographerUrl: item.user?.links?.html || 'https://unsplash.com',
            platform: 'Unsplash',
            platformUrl: 'https://unsplash.com'
          };
          inMemoryCache[normalizedKey] = photo;
          stored[normalizedKey] = photo;
          savePersistentCache(stored);
          return photo;
        }
      }
    } catch (err) {
      console.warn('Unsplash API fetch failed, trying Pexels or curated fallback:', err);
    }
  }

  // 4. Try Pexels API if VITE_PEXELS_API_KEY is configured
  const pexelsKey = import.meta.env.VITE_PEXELS_API_KEY?.trim();
  if (pexelsKey && pexelsKey.length > 5) {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          query + ' Indian tour guide'
        )}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: pexelsKey
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const item = data.photos[0];
          const photo: StockPhoto = {
            url: item.src.large,
            thumbUrl: item.src.tiny || item.src.small,
            photographerName: item.photographer || 'Pexels Contributor',
            photographerUrl: item.photographer_url || 'https://pexels.com',
            platform: 'Pexels',
            platformUrl: 'https://pexels.com'
          };
          inMemoryCache[normalizedKey] = photo;
          stored[normalizedKey] = photo;
          savePersistentCache(stored);
          return photo;
        }
      }
    } catch (err) {
      console.warn('Pexels API fetch failed:', err);
    }
  }

  // 5. Match Curated Editorial Database
  for (const [cityKey, photo] of Object.entries(CURATED_HERITAGE_STOCK)) {
    if (normalizedKey.includes(cityKey)) {
      inMemoryCache[normalizedKey] = photo;
      stored[normalizedKey] = photo;
      savePersistentCache(stored);
      return photo;
    }
  }

  // Default fallback
  const defaultPhoto = CURATED_HERITAGE_STOCK['default'];
  inMemoryCache[normalizedKey] = defaultPhoto;
  return defaultPhoto;
}
