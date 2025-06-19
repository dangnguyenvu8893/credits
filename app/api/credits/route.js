import { NextResponse } from 'next/server';
import { getModels, setupAssociations } from '../../../models';

// GET /api/credits - Lấy danh sách credits
export async function GET(request) {
  try {
    // Setup models and associations
    setupAssociations();
    const { Credit, User } = getModels();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const offset = (page - 1) * limit;

    const { count, rows: credits } = await Credit.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'email'],
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'username', 'fullName'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return NextResponse.json({
      credits,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });

  } catch (error) {
    console.error('Get credits error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/credits - Tạo credit mới
export async function POST(request) {
  try {
    // Setup models and associations
    setupAssociations();
    const { Credit } = getModels();
    
    const body = await request.json();
    const { amount, interestRate, term, purpose, userId } = body;

    // Validation
    if (!amount || !term || !purpose) {
      return NextResponse.json(
        { error: 'Amount, term, and purpose are required' },
        { status: 400 }
      );
    }

    if (amount <= 0 || term <= 0) {
      return NextResponse.json(
        { error: 'Amount and term must be positive' },
        { status: 400 }
      );
    }

    // Calculate monthly payment and total amount
    const monthlyRate = (interestRate || 0) / 100 / 12;
    const monthlyPayment = monthlyRate > 0 
      ? (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
      : amount / term;
    
    const totalAmount = monthlyPayment * term;

    // Create credit
    const credit = await Credit.create({
      userId: userId || null,
      amount,
      interestRate: interestRate || 0,
      term,
      purpose,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    });

    return NextResponse.json({
      message: 'Credit application submitted successfully',
      credit,
    }, { status: 201 });

  } catch (error) {
    console.error('Create credit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 