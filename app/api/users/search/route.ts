import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getUserByIdNumber } from '@/lib/db/queries';

// GET /api/users/search?email=... or ?idNumber=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const idNumber = searchParams.get('idNumber');

    if (!email && !idNumber) {
      return NextResponse.json(
        { error: 'Please provide either email or idNumber parameter' },
        { status: 400 }
      );
    }

    let user = null;

    if (email) {
      const result = await getUserByEmail(email);
      user = result[0] || null;
    } else if (idNumber) {
      const result = await getUserByIdNumber(idNumber);
      user = result[0] || null;
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error searching user:', error);
    return NextResponse.json(
      { error: 'Failed to search user' },
      { status: 500 }
    );
  }
} 