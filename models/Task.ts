import mongoose, { Document, Schema } from 'mongoose';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  labels?: string[];
  project?: string;
  // For task dependencies
  dependsOn?: mongoose.Types.ObjectId[];
  // For sub-tasks
  parentTask?: mongoose.Types.ObjectId;
  // For task history/audit
  history: Array<{
    changedBy: mongoose.Types.ObjectId;
    changedAt: Date;
    changes: Record<string, { from: any; to: any }>;
  }>;
  // For soft delete
  isDeleted: boolean;
  deletedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'in_review', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: { type: Date },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    labels: [{ type: String }],
    project: { type: String },
    dependsOn: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    parentTask: { type: Schema.Types.ObjectId, ref: 'Task' },
    history: [
      {
        changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        changedAt: { type: Date, default: Date.now },
        changes: { type: Map, of: Schema.Types.Mixed },
      },
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes for better query performance
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ project: 1 });
TaskSchema.index({ isDeleted: 1 });

// Middleware for soft delete
TaskSchema.pre('find', function () {
  this.where({ isDeleted: { $ne: true } });
});

TaskSchema.pre('findOne', function () {
  this.where({ isDeleted: { $ne: true } });
});

// Prevent model overwrite in development
const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
