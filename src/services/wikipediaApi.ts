/**
 * Wikipedia & Wikimedia Commons REST API Service
 * Fetches verified historical summaries, high-resolution Wikimedia photography, and cultural context.
 * 100% Free & Public REST API (No API keys required).
 */

export interface WikipediaSummary {
  title: string;
  extract: string;
  description?: string;
  thumbnailUrl?: string;
  originalImageUrl?: string;
  wikipediaUrl: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

/**
 * Fetch verified Wikipedia summary for a monument or heritage site
 */
export async function fetchWikipediaMonumentData(monumentName: string): Promise<WikipediaSummary | null> {
  if (!monumentName || !monumentName.trim()) return null;

  const cleanQuery = monumentName
    .replace(/\s*\([^)]*\)/g, '') // Remove parentheses e.g. "(Turkish Gate)"
    .replace(/Monument|Memorial|Complex|Palace/gi, '')
    .trim() || monumentName;

  // 1. Direct Page Summary API
  try {
    const directUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(monumentName.trim())}`;
    const res = await fetch(directUrl, {
      headers: {
        'Api-User-Agent': 'DarShanaTravelApp/1.0 (https://darshana-traveler-app.vercel.app; support@darshana.app)'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.type !== 'disambiguation' && data.extract) {
        return {
          title: data.titles?.display || data.title,
          extract: data.extract,
          description: data.description,
          thumbnailUrl: data.thumbnail?.source,
          originalImageUrl: data.originalimage?.source,
          wikipediaUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
          coordinates: data.coordinates ? { lat: data.coordinates.lat, lon: data.coordinates.lon } : undefined
        };
      }
    }
  } catch {
    // Continue to search fallback
  }

  // 2. OpenSearch Query Fallback (finds best matching Wikipedia article)
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery + ' India monument')}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const topHit = searchData.query?.search?.[0];

      if (topHit?.title) {
        const hitUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topHit.title)}`;
        const hitRes = await fetch(hitUrl, {
          headers: {
            'Api-User-Agent': 'DarShanaTravelApp/1.0'
          }
        });

        if (hitRes.ok) {
          const hitData = await hitRes.json();
          if (hitData.extract) {
            return {
              title: hitData.titles?.display || hitData.title,
              extract: hitData.extract,
              description: hitData.description,
              thumbnailUrl: hitData.thumbnail?.source,
              originalImageUrl: hitData.originalimage?.source,
              wikipediaUrl: hitData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(hitData.title)}`,
              coordinates: hitData.coordinates ? { lat: hitData.coordinates.lat, lon: hitData.coordinates.lon } : undefined
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn('Wikipedia API lookup warning:', err);
  }

  return null;
}
