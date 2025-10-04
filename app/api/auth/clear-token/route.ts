import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Token cleared successfully' },
      { status: 200 }
    );

    // Clear the auth_token cookie
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
      expires: new Date(0), // Set to past date
    });

    // Also clear the NextAuth session
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');

    return response;
  } catch (error) {
    console.error('Error clearing auth token:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear token' },
      { status: 500 }
    );
  }
}
