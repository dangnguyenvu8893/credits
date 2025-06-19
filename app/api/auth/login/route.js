import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json({ error: 'Login is disabled.' }, { status: 403 });
} 