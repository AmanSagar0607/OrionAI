import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import Task from '@/models/Task';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const tasks = await db.collection('tasks').find({
      $or: [
        { assignedTo: session.user.email },
        { createdBy: session.user.email },
      ],
    }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const { db } = await connectToDatabase();
    const result = await db.collection('tasks').insertOne({
      ...data,
      createdBy: session.user.email,
      assignedTo: data.assignedTo || session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'todo',
      history: []
    });
    
    const task = await db.collection('tasks').findOne({ _id: result.insertedId });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
