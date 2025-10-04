import { NextResponse } from 'next/server';
import { getAuthToken, verifyToken } from '@/lib/utils/jwt';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';

type UserDocument = {
  _id: any;
  email: string;
  firstName: string;
  lastName: string;
  image?: string | null;
};

interface UserResponse {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export async function GET() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    if (typeof decoded === 'string' || !('userId' in decoded)) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Get user from database
    const user = await User.findById(decoded.userId).lean<UserDocument>();
    
    if (!user?._id) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data (excluding sensitive information)
    const userData: UserResponse = {
      id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      ...(user.image && { image: user.image }), // Only include image if it exists
    };

    return NextResponse.json(userData);

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { message: 'Session check failed' },
      { status: 401 }
    );
  }
}
