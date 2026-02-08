import type { AutocompleteResult, DirectionsRoute, Place, RouteResult } from './types';
import { logDebug } from './client-logger';

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min for most things
const DIRECTIONS_CACHE_TTL_MS = 2 * 60 * 1000; // 2 min for directions (time-sensitive)

// Clear cache on load to avoid stale data after code updates
if (typeof window !== 'undefined') {
  cache.clear();
}

function getCached<T>(key: string, ttl: number = CACHE_TTL_MS): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttl) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function searchPlaces(query: string): Promise<AutocompleteResult[]> {
  if (!query || query.length < 2) return [];

  const cacheKey = `autocomplete:${query}`;
  const cached = getCached<AutocompleteResult[]>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(query)}`);
  if (!res.ok) {
    console.error('Autocomplete API request failed:', res.status, res.statusText);
    throw new Error('Autocomplete failed');
  }
  const data = await res.json();

  // Check for Google API errors
  if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    console.error('Google Places API error:', data.status, data.error_message);
    throw new Error(`Google API error: ${data.status}`);
  }

  const results = data.predictions?.map((p: any) => ({
    placeId: p.place_id,
    description: p.description,
    mainText: p.structured_formatting?.main_text ?? p.description,
    secondaryText: p.structured_formatting?.secondary_text ?? '',
  })) ?? [];

  setCache(cacheKey, results);
  return results;
}

export async function getPlaceDetails(placeId: string, description?: string): Promise<Place> {
  const cacheKey = `place:${placeId}`;
  const cached = getCached<Place>(cacheKey);
  if (cached) return cached;

  // Try with place_id first, fallback to address if provided
  let url = `/api/places/details?place_id=${encodeURIComponent(placeId)}`;
  if (description) {
    url += `&address=${encodeURIComponent(description)}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('Place details failed');
  const data = await res.json();
  const result = data.result;
  const loc = result.geometry?.location;
  const place: Place = {
    placeId: result.place_id,
    name: result.name,
    address: result.formatted_address,
    location: loc && typeof loc.lat === 'number' && typeof loc.lng === 'number' ? loc : undefined,
  };

  setCache(cacheKey, place);
  return place;
}

export async function calculateRoute(
  origin: string,
  destination: string
): Promise<RouteResult> {
  const cacheKey = `route:${origin}:${destination}`;
  const cached = getCached<RouteResult>(cacheKey, DIRECTIONS_CACHE_TTL_MS);
  if (cached) {
    logDebug('Using cached route');
    return cached;
  }

  const res = await fetch('/api/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination }),
  });
  if (!res.ok) throw new Error('Route calculation failed');
  const result = await res.json();

  setCache(cacheKey, result);
  return result;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const cacheKey = `geocode:${lat.toFixed(4)}:${lng.toFixed(4)}`;
  const cached = getCached<string>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
  if (!res.ok) throw new Error('Reverse geocode failed');
  const data = await res.json();
  const address = data.results?.[0]?.formatted_address ?? '';

  setCache(cacheKey, address);
  return address;
}
