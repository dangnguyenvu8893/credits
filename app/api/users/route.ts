import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/db/queries';
import { NewUser } from '@/lib/db/schema';

// GET /api/users - List all users
export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['email', 'fullname', 'birthdate', 'idNumber', 'address', 'maritalStatus', 'phoneNumber', 'occupation', 'salary', 'cicRank'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number format (Vietnamese format)
    const phoneRegex = /^(\+84|84|0)[0-9]{9}$/;
    if (!phoneRegex.test(body.phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate salary is positive
    if (body.salary <= 0) {
      return NextResponse.json(
        { error: 'Salary must be positive' },
        { status: 400 }
      );
    }

    const userData: NewUser = {
      email: body.email,
      fullname: body.fullname,
      birthdate: body.birthdate,
      idNumber: body.idNumber,
      address: body.address,
      maritalStatus: body.maritalStatus,
      phoneNumber: body.phoneNumber,
      occupation: body.occupation,
      salary: body.salary,
      cicRank: body.cicRank,
    };

    const newUser = await createUser(userData);
    
    return NextResponse.json(
      { message: 'User created successfully', user: newUser[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle unique constraint violations
    if (error.code === '23505') {
      if (error.constraint === 'users_email_unique') {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
      if (error.constraint === 'users_id_number_unique') {
        return NextResponse.json(
          { error: 'ID number already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 