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

  const params = new URLSearchParams({
    input,
    key: API_KEY!,
    location: '33.7489954,-84.3879824',
    radius: '50000',
    components: 'country:us',
  });

  const res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`);
  const data = await res.json();

  setCache(cacheKey, data);
  return NextResponse.json(data);
}
