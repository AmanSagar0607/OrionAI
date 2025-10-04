import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/utils/jwt';

export async function POST() {
  try {
    // Clear the auth cookie
    clearAuthCookies();
    
    return new NextResponse(JSON.stringify({ message: 'Logged out successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Set cookie to expire
        'Set-Cookie': 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Failed to log out' },
      { status: 500 }
    );
  }
}
