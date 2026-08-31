import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
    // Denormalized on purpose: lets the task routes filter/list "all
    // tasks on this board" with one query instead of joining through
    // Column first. Keep it in sync whenever a task moves — see
    // moveTask in controllers/taskController.js.
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    labels: [
    {
    name: { type: String },
    color: { type: String },
   },
], // e.g. [{ name: 'High', color: '#2563eb' }]
    assignee: { type: String, default: '' },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
