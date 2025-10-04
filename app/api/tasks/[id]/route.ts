import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

interface TaskUpdate {
  status?: string;
  [key: string]: any;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const task = await db.collection('tasks').findOne({
      _id: new ObjectId(params.id),
      $or: [
        { assignedTo: session.user.email },
        { createdBy: session.user.email },
      ],
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data: TaskUpdate = await request.json();
    const { db } = await connectToDatabase();
    
    // Get the current task first to track changes
    const currentTask = await db.collection('tasks').findOne({
      _id: new ObjectId(params.id),
      $or: [
        { assignedTo: session.user.email },
        { createdBy: session.user.email },
      ],
    });

    if (!currentTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Prepare the update object
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
      $push: {
        history: {
          changedBy: session.user.email,
          changedAt: new Date(),
          changes: Object.entries(data).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: { from: currentTask[key], to: value }
          }), {})
        }
      }
    };

    // Perform the update
    const result = await db.collection('tasks').findOneAndUpdate(
      {
        _id: new ObjectId(params.id),
        $or: [
          { assignedTo: session.user.email },
          { createdBy: session.user.email },
        ],
      },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      );
    }

    const task = result.value;

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const task = await db.collection('tasks').findOneAndDelete({
      _id: new ObjectId(params.id),
      createdBy: session.user.email, // Only creator can delete
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
