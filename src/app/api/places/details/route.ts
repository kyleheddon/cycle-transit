import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCache } from '@/lib/server-cache';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour (place details rarely change)

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const place_id = searchParams.get('place_id');
  const address = searchParams.get('address'); // Accept address as fallback

  if (!place_id && !address) {
    return NextResponse.json({ error: 'place_id or address required' }, { status: 400 });
  }

  const cacheKey = `place_details:${place_id || address}`;
  const cached = getCached(cacheKey, CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  // Use Directions API Geocode which is always enabled
  const params = new URLSearchParams({
    key: API_KEY!,
  });

  if (address) {
    params.set('address', address);
  } else {
    params.set('place_id', place_id!);
  }

  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Geocoding API request failed:', res.status, errorText);
    return NextResponse.json({ error: 'Geocoding request failed' }, { status: res.status });
  }

  const data = await res.json();

  if (data.status !== 'OK' || !data.results?.[0]) {
    console.error('Geocoding API error:', {
      status: data.status,
      error_message: data.error_message,
      place_id,
      address,
      results_count: data.results?.length || 0
    });

    // Return empty result instead of error to not break the flow
    const emptyResult = {
      result: {
        place_id: place_id || '',
        name: address?.split(',')[0] || '',
        formatted_address: address || '',
        geometry: { location: {} },
      },
    };

    return NextResponse.json(emptyResult);
  }

  console.log('Geocoding success:', {
    status: data.status,
    place_id,
    address,
    location: data.results[0]?.geometry?.location
  });

  const result = data.results[0];

  const transformedData = {
    result: {
      place_id: result.place_id,
      name: result.formatted_address?.split(',')[0] || '',
      formatted_address: result.formatted_address || '',
      geometry: {
        location: result.geometry?.location || {},
      },
    },
  };

  setCache(cacheKey, transformedData);
  return NextResponse.json(transformedData);
}
