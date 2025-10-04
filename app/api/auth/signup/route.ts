import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User, { IUser } from '@/models/User';

export async function POST(request: Request) {
  console.log('Signup request received');
  try {
    // Parse the request body
    const body = await request.json();
    const { firstName, lastName, email, password, confirmPassword } = body;

    console.log('Request body:', {
      ...body,
      password: password ? '[REDACTED]' : undefined,
      confirmPassword: confirmPassword ? '[REDACTED]' : undefined
    });

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      const error = 'All fields are required';
      console.error('Validation error:', error);
      return NextResponse.json(
        { message: error },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      const error = 'Passwords do not match';
      console.error('Validation error:', error);
      return NextResponse.json(
        { message: error },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await dbConnect();
    console.log('Successfully connected to MongoDB');

    // Check if user already exists
    console.log(`Checking for existing user with email: ${email}`);
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      const error = 'User already exists with this email';
      console.error('Signup error:', error);
      return NextResponse.json(
        { message: error },
        { status: 400 }
      );
    }

    console.log('Creating new user...');
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();
    console.log('User created successfully:', user.email);

    // Don't send back the password in the response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    let errorMessage = 'An error occurred during signup';
    let statusCode = 500;
    
    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
      statusCode = 400;
    } else if (error.code === 11000) {
      errorMessage = 'Email already in use';
      statusCode = 400;
    } else if (error.message.includes('buffering timed out')) {
      errorMessage = 'Database operation timed out. Please try again.';
    }
    
    return NextResponse.json(
      { 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: statusCode }
    );
  }}
