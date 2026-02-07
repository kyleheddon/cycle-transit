import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCache } from '@/lib/server-cache';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour (place details rarely change)

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const place_id = searchParams.get('place_id');

  if (!place_id) {
    return NextResponse.json({ error: 'place_id required' }, { status: 400 });
  }

  const cacheKey = `place_details:${place_id}`;
  const cached = getCached(cacheKey, CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  const params = new URLSearchParams({
    place_id,
    key: API_KEY!,
    fields: 'place_id,name,formatted_address,geometry',
  });

  const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params}`);
  const data = await res.json();

  setCache(cacheKey, data);
  return NextResponse.json(data);
}
