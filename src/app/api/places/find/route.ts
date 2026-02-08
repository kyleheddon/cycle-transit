import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCache } from '@/lib/server-cache';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const input = searchParams.get('input');

  if (!input) {
    return NextResponse.json({ error: 'input required' }, { status: 400 });
  }

  const cacheKey = `find_place:${input}`;
  const cached = getCached(cacheKey, CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  // Use new Places API (New)
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY!,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
    },
    body: JSON.stringify({
      textQuery: input,
      locationBias: {
        circle: {
          center: { latitude: 33.7489954, longitude: -84.3879824 },
          radius: 30000.0,
        },
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Google Places Find API request failed:', res.status, errorText);
    return NextResponse.json({ error: 'Google API request failed' }, { status: res.status });
  }

  const data = await res.json();

  // Transform new API format to match old format for backward compatibility
  const transformedData = {
    candidates: data.places?.map((place: any) => ({
      place_id: place.id?.replace('places/', '') || '',
      name: place.displayName?.text || '',
      formatted_address: place.formattedAddress || '',
      geometry: {
        location: place.location ? {
          lat: place.location.latitude,
          lng: place.location.longitude,
        } : {},
      },
    })) || [],
  };

  setCache(cacheKey, transformedData);
  return NextResponse.json(transformedData);
}
