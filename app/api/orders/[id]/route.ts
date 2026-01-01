import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import User from '@/app/models/User';
import { requireAuth, authorizeRole } from '@/lib/auth';

// GET /api/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    const order = await Order.findById(params.id)
      .populate('user', 'name email phone')
      .populate('items.product')
      .populate('items.customization.threadColor items.customization.threadType items.customization.kundanType items.customization.kundanShape items.customization.kundanColor');

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (user.role === 'user' && order.user._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to view this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update order status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    if (!authorizeRole(user, ['admin', 'superadmin'])) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update orders' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, note } = body;

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`,
    });

    await order.save();

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
