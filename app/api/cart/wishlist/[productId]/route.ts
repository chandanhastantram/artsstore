import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { requireAuth } from '@/lib/auth';

// POST /api/cart/wishlist/[productId] - Add to wishlist
export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    const fullUser = await User.findById(user._id);

    if (fullUser.wishlist.includes(params.productId)) {
      return NextResponse.json(
        { success: false, message: 'Product already in wishlist' },
        { status: 400 }
      );
    }

    fullUser.wishlist.push(params.productId);
    await fullUser.save();

    return NextResponse.json({
      success: true,
      wishlist: fullUser.wishlist,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/wishlist/[productId] - Remove from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    const fullUser = await User.findById(user._id);

    fullUser.wishlist = fullUser.wishlist.filter(
      (id: any) => id.toString() !== params.productId
    );
    await fullUser.save();

    return NextResponse.json({
      success: true,
      wishlist: fullUser.wishlist,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
