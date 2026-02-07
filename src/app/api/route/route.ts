import { NextRequest, NextResponse } from 'next/server';
import { calculateRoutes } from '@/lib/route';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin, destination } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'origin and destination are required' },
        { status: 400 }
      );
    }

    const result = await calculateRoutes(origin, destination);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Route calculation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Route calculation failed' },
      { status: 500 }
    );
  }
}
