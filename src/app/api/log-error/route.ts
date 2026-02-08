import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, stack, level = 'error', context } = body;

    const timestamp = new Date().toISOString();
    const logMessage = `[CLIENT ${level.toUpperCase()}] ${timestamp}`;

    console.error('='.repeat(80));
    console.error(logMessage);
    console.error('Message:', message);
    if (stack) console.error('Stack:', stack);
    if (context) console.error('Context:', JSON.stringify(context, null, 2));
    console.error('='.repeat(80));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log client error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
