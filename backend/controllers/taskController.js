import Task from '../models/Task.js'
import Column from '../models/Column.js'
import { serializeTask } from '../serialize.js'

/**
 * OWNER: Task API
 * Routes already wired in routes/taskRoutes.js (all behind `protect`):
 *   GET    /api/tasks/board/:boardId        — every task on the board
 *   POST   /api/tasks/column/:columnId      { title, description?, dueDate?, labels?, assignee? }
 *   PATCH  /api/tasks/:id                   { title?, description?, dueDate?, labels?, assignee? }
 *   PATCH  /api/tasks/:id/move              { columnId, order }
 *   DELETE /api/tasks/:id
 *
 * Corresponds to the frontend's TaskDetailModal (due date + description)
 * and LabelBadge features — once both sides are done, TaskDetailModal's
 * onSave callback calls PATCH /api/tasks/:id with whatever fields
 * changed.
 *
 * Worked example for creating a task (update/delete are one-liners —
 * see columnController.js for the same findByIdAndUpdate /
 * findByIdAndDelete pattern):
 *
 *   export async function createTask(req, res) {
 *     const { columnId } = req.params
 *     const { title, description, dueDate, labels, assignee } = req.body
 *     if (!title?.trim()) return res.status(400).json({ error: 'title is required' })
 *
 *     const column = await Column.findById(columnId)
 *     if (!column) return res.status(404).json({ error: 'column not found' })
 *
 *     const count = await Task.countDocuments({ columnId })
 *     const task = await Task.create({
 *       columnId,
 *       boardId: column.boardId,
 *       title: title.trim(),
 *       description: description || '',
 *       dueDate: dueDate || null,
 *       labels: labels || [],
 *       assignee: assignee || '',
 *       order: count,
 *     })
 *     res.status(201).json(serializeTask(task))
 *   }
 *
 * Notes on "move":
 *   Moving a task changes its columnId AND needs to renumber `order`
 *   for every other task in the destination column, same idea as
 *   reordering a to-do list. Pull all tasks in the target column,
 *   splice the moved one into place at req.body.order, then resave
 *   every task's order field. See server-starter examples from the M2
 *   planning doc if your group still has that reference around, or
 *   ask in the group chat — this one's fiddlier than the others.
 */

export async function listTasksForBoard(req, res) {
  // TODO(Owner: Task API) — Task.find({ boardId: req.params.boardId })
  // (this handler is mounted at GET /api/tasks/board/:boardId)
  res.status(501).json({ error: 'listTasksForBoard not implemented yet — see controllers/taskController.js' })
}

export async function createTask(req, res) {
  // TODO(Owner: Task API) — see worked example above.
  res.status(501).json({ error: 'createTask not implemented yet — see controllers/taskController.js' })
}

export async function updateTask(req, res) {
  // TODO(Owner: Task API) — Task.findByIdAndUpdate(req.params.id, req.body fields that were provided)
  res.status(501).json({ error: 'updateTask not implemented yet — see controllers/taskController.js' })
}

export async function moveTask(req, res) {
  // TODO(Owner: Task API) — see "Notes on move" above.
  res.status(501).json({ error: 'moveTask not implemented yet — see controllers/taskController.js' })
}

export async function deleteTask(req, res) {
  // TODO(Owner: Task API) — Task.findByIdAndDelete(req.params.id)
  res.status(501).json({ error: 'deleteTask not implemented yet — see controllers/taskController.js' })
}
