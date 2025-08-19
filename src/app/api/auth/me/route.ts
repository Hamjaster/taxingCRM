import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Client from '@/models/Client';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get token from bearer token in headers
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Find user in both collections
    const [admin, client] = await Promise.all([
      Admin.findById(decoded.id),
      Client.findById(decoded.id)
    ]);

    const user = admin || client;
    const userRole = admin ? 'admin' : 'client';

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is active (different field for admin vs client)
    const isUserActive = admin ? user.isActive : (user as any).status === 'Active';
    if (!isUserActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Return user data
    // const userData = {
    //   id: user._id,
    //   email: user.email,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   role: userRole,
    //   isPhoneVerified: user.isPhoneVerified,
    //   isEmailVerified: user.isEmailVerified,
    //   lastLogin: user.lastLogin,
    //   // Include role-specific data
    //   ...(userRole === 'admin' && { 
    //     clients: (user as any).clients || [],
    //     permissions: (user as any).permissions || [],
    //     department: (user as any).department,
    //     employeeId: (user as any).employeeId,
    //   }),
    //   ...(userRole === 'client' && { 
    //     assignedAdminId: (user as any).assignedAdminId,
    //     clientType: (user as any).clientType,
    //     status: (user as any).status,
    //   }),
    // };

    return NextResponse.json({ user, token });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
