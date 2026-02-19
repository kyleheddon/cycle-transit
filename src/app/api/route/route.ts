import { NextRequest, NextResponse } from 'next/server';
import { calculateRoutes } from '@/lib/route';
import { RouteRequestSchema } from '@/lib/api-schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request with Zod
    const validation = RouteRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { origin, destination } = validation.data;
    console.log('Route request:', { origin, destination });

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
