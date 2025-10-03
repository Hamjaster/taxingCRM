import { verifyJWT } from './auth';

export interface TokenInfo {
  isValid: boolean;
  isExpired: boolean;
  expiresAt?: Date;
  timeUntilExpiry?: number; // in milliseconds
  user?: {
    id: string;
    role: string;
  };
}

/**
 * Decode JWT token without verification (for client-side expiry check)
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Get token expiry information
 */
export function getTokenInfo(token: string): TokenInfo {
  const decoded = decodeJWT(token);
  
  if (!decoded) {
    return {
      isValid: false,
      isExpired: true,
    };
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = decoded.exp < currentTime;
  const expiresAt = new Date(decoded.exp * 1000);
  const timeUntilExpiry = decoded.exp * 1000 - Date.now();

  return {
    isValid: true,
    isExpired,
    expiresAt,
    timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : 0,
    user: {
      id: decoded.id,
      role: decoded.role,
    },
  };
}

