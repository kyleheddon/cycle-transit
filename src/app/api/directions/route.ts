import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCache } from '@/lib/server-cache';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const CACHE_TTL = 2 * 60 * 1000; // 2 min for directions (time-sensitive)

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const mode = searchParams.get('mode') || 'bicycling';
  const transit_mode = searchParams.get('transit_mode');
  const departure_time = searchParams.get('departure_time');

  if (!origin || !destination) {
    return NextResponse.json({ error: 'origin and destination required' }, { status: 400 });
  }

  const cacheKey = `directions:${origin}:${destination}:${mode}:${transit_mode}:${departure_time}`;
  const cached = getCached(cacheKey, CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  const params = new URLSearchParams({
    origin,
    destination,
    mode,
    key: API_KEY!,
  });
  if (transit_mode) params.set('transit_mode', transit_mode);
  if (departure_time) params.set('departure_time', departure_time);

  const res = await fetch(`https://maps.googleapis.com/maps/api/directions/json?${params}`);
  const data = await res.json();

  setCache(cacheKey, data);
  return NextResponse.json(data);
}
