import { NextResponse } from 'next/server';
import { getModels, setupAssociations } from '../../../../models';

// GET /api/credits/[id] - Lấy thông tin credit cụ thể
export async function GET(request, { params }) {
  try {
    // Setup models and associations
    setupAssociations();
    const { Credit, User, Payment } = getModels();
    
    const { id } = params;

    const credit = await Credit.findByPk(id, {
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
        {
          model: Payment,
          as: 'payments',
          order: [['paymentDate', 'DESC']],
        },
      ],
    });

    if (!credit) {
      return NextResponse.json(
        { error: 'Credit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ credit });

  } catch (error) {
    console.error('Get credit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/credits/[id] - Cập nhật credit
export async function PUT(request, { params }) {
  try {
    // Setup models and associations
    setupAssociations();
    const { Credit } = getModels();
    
    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    const credit = await Credit.findByPk(id);

    if (!credit) {
      return NextResponse.json(
        { error: 'Credit not found' },
        { status: 404 }
      );
    }

    // Update credit
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // If status is being approved, set approval details
    if (status === 'approved' && credit.status === 'pending') {
      updateData.approvedAt = new Date();
      updateData.approvedBy = null; // Không có user đăng nhập
      updateData.startDate = new Date();
      
      // Calculate end date
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + credit.term);
      updateData.endDate = endDate;
    }

    await credit.update(updateData);

    return NextResponse.json({
      message: 'Credit updated successfully',
      credit,
    });

  } catch (error) {
    console.error('Update credit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/credits/[id] - Xóa credit
export async function DELETE(request, { params }) {
  try {
    // Setup models and associations
    setupAssociations();
    const { Credit } = getModels();
    
    const { id } = params;

    const credit = await Credit.findByPk(id);

    if (!credit) {
      return NextResponse.json(
        { error: 'Credit not found' },
        { status: 404 }
      );
    }

    // Only allow deletion of pending credits
    if (credit.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending credits can be deleted' },
        { status: 400 }
      );
    }

    await credit.destroy();

    return NextResponse.json({
      message: 'Credit deleted successfully',
    });

  } catch (error) {
    console.error('Delete credit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 