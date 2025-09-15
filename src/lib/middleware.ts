import { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { AuthUser } from '@/types';

export function getAuthUser(request: NextRequest): AuthUser | null {
  try {
    // take token from bearer token from headers
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return null;
    }

    return verifyJWT(token);
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

export function requireAuth(request: NextRequest): AuthUser {
  const user = getAuthUser(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export function requireAdmin(request: NextRequest): AuthUser {
  const user = requireAuth(request);
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}

export function requireClient(request: NextRequest): AuthUser {
  const user = requireAuth(request);
  
  if (user.role !== 'client') {
    throw new Error('Client access required');
  }
  
  return user;
}
