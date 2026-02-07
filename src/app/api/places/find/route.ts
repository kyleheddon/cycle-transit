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

  const params = new URLSearchParams({
    input,
    inputtype: 'textquery',
    key: API_KEY!,
    fields: 'place_id,name,formatted_address,geometry',
  });

  const res = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${params}`);
  const data = await res.json();

  setCache(cacheKey, data);
  return NextResponse.json(data);
}
