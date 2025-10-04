import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

interface UserPayload extends JwtPayload {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  }

export const generateToken = (payload: UserPayload): string => {
  return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): UserPayload => {
  try {
    return verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const setAuthCookies = async (token: string): Promise<Response> => {
  const cookieOptions = {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
  
  // Using document.cookie for client-side
  if (typeof window !== 'undefined') {
    document.cookie = `auth_token=${token}; ${Object.entries(cookieOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`;
    return new Response();
  } 
  
  // Server-side
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, cookieOptions);
  return new Response();
};

export const clearAuthCookies = async (): Promise<Response> => {
  // Client-side
  if (typeof window !== 'undefined') {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return new Response();
  }
  
  // Server-side
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    return new Response();
  } catch (error) {
    console.error('Error clearing auth cookies:', error);
    return new Response(null, { status: 500 });
  }
};

export const getAuthToken = async (): Promise<string | undefined> => {
  // Client-side
  if (typeof window !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; auth_token=`);
    return parts.length === 2 ? parts.pop()?.split(';').shift() : undefined;
  } 
  
  // Server-side
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return undefined;
  }
};