import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/services/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['email', 'fullname', 'birthdate', 'idNumber', 'address', 'maritalStatus', 'phoneNumber', 'occupation', 'salary', 'cicRank'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Call AI service with mock data for now
    const prediction = await AIService.predictMock(body);
    
    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Prediction API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 