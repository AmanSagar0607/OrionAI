import { NextResponse } from 'next/server';
import { generateToken, setAuthCookies } from '@/lib/utils/jwt';
import User from '@/models/User';

type UserDocument = {
  _id: any;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string | null;
};
import { connectToDatabase } from '@/lib/mongodb';
import { compare } from 'bcryptjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as LoginRequest;
    
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password').lean<UserDocument>();
    
    if (!user?._id) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Create response with user data
    const response = NextResponse.json({
      id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      ...(user.image && { image: user.image }),
    });

    // Set HTTP-only cookie
    const cookieResponse = await setAuthCookies(token);
    const cookieHeader = cookieResponse.headers.get('Set-Cookie');
    if (cookieHeader) {
      response.headers.set('Set-Cookie', cookieHeader);
    }

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
