import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCache } from '@/lib/server-cache';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour (addresses don't change)

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  const cacheKey = `geocode:${parseFloat(lat).toFixed(4)}:${parseFloat(lng).toFixed(4)}`;
  const cached = getCached(cacheKey, CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  const params = new URLSearchParams({
    latlng: `${lat},${lng}`,
    key: API_KEY!,
  });

  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
  const data = await res.json();

  setCache(cacheKey, data);
  return NextResponse.json(data);
}
