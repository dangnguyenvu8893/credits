import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/db/queries';
import { NewUser } from '@/lib/db/schema';
import { AIService } from '@/lib/services/ai-service';

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);
    
    if (!user || user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: user[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser || existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Validate phone number format if provided
    if (body.phoneNumber) {
      const phoneRegex = /^(\+84|84|0)[0-9]{9}$/;
      if (!phoneRegex.test(body.phoneNumber)) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }
    }

    // Validate salary is positive if provided
    if (body.salary !== undefined && body.salary <= 0) {
      return NextResponse.json(
        { error: 'Salary must be positive' },
        { status: 400 }
      );
    }

    // Get AI prediction if requested
    let aiPrediction = null;
    if (body.getPrediction) {
      try {
        const birthdate = new Date(existingUser[0].birthdate);
        const age = new Date().getFullYear() - birthdate.getFullYear();

        const userData = {
          age: age,
          married: body.maritalStatus || existingUser[0].maritalStatus,
          salary: body.salary !== undefined ? body.salary : existingUser[0].salary,
          cic: body.cicRank || existingUser[0].cicRank,
          job: body.occupation || existingUser[0].occupation,
        };
        
        aiPrediction = await AIService.predict(userData);
      } catch (error) {
        console.error('Error getting AI prediction:', error);
      }
    }

    const updateData: Partial<NewUser> = {};
    
    // Only include fields that are provided
    if (body.email) updateData.email = body.email;
    if (body.fullname) updateData.fullname = body.fullname;
    if (body.birthdate) updateData.birthdate = body.birthdate;
    if (body.idNumber) updateData.idNumber = body.idNumber;
    if (body.address) updateData.address = body.address;
    if (body.maritalStatus) updateData.maritalStatus = body.maritalStatus;
    if (body.phoneNumber) updateData.phoneNumber = body.phoneNumber;
    if (body.occupation) updateData.occupation = body.occupation;
    if (body.salary !== undefined) updateData.salary = body.salary;
    if (body.cicRank) updateData.cicRank = body.cicRank;

    // Add AI prediction results if available
    if (aiPrediction) {
      updateData.cardType = aiPrediction.data.predicted_card_type;
      updateData.creditLimit = aiPrediction.data.predicted_credit_limit;
      updateData.predictedAt = new Date();
    }

    const updatedUser = await updateUser(id, updateData);
    
    return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user:', error);
    
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
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser || existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await deleteUser(id);
    
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}