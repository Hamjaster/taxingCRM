import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAdmin(request);

    const clients = await User.find({ 
      role: 'client', 
      isActive: true 
    })
    .select('firstName lastName email phone isEmailVerified isPhoneVerified lastLogin createdAt')
    .sort({ createdAt: -1 });

    return NextResponse.json({ clients });

  } catch (error) {
    console.error('Get clients error:', error);
    
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
