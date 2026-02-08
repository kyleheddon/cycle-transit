import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCache } from '@/lib/server-cache';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const CACHE_TTL = 10 * 60 * 1000; // 10 min (place names don't change)

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const input = searchParams.get('input');

  if (!input) {
    return NextResponse.json({ error: 'input required' }, { status: 400 });
  }

  const cacheKey = `autocomplete:${input}`;
  const cached = getCached(cacheKey, CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  // Use new Places API (New) instead of legacy API
  const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY!,
    },
    body: JSON.stringify({
      input,
      locationBias: {
        circle: {
          center: {
            latitude: 33.7489954,
            longitude: -84.3879824,
          },
          radius: 50000.0,
        },
      },
      includedRegionCodes: ['us'],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Google Maps API request failed:', res.status, res.statusText, errorText);
    return NextResponse.json({ error: 'Google API request failed' }, { status: res.status });
  }

  const data = await res.json();

  // Transform new API format to match old format for backward compatibility
  const transformedData = {
    predictions: data.suggestions?.map((suggestion: any) => {
      const pred = suggestion.placePrediction;
      return {
        place_id: pred.placeId,
        description: pred.text?.text || '',
        structured_formatting: {
          main_text: pred.structuredFormat?.mainText?.text || pred.text?.text || '',
          secondary_text: pred.structuredFormat?.secondaryText?.text || '',
        },
      };
    }) || [],
  };

  setCache(cacheKey, transformedData);
  return NextResponse.json(transformedData);
}
