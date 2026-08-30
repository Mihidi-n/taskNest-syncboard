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
  try {
    const tasks = await Task.find({ boardId: req.params.boardId }).sort({ order: 1 })
    res.status(200).json(tasks.map(serializeTask))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createTask(req, res) {
  try {
    const { columnId } = req.params
    const { title, description, dueDate, labels, assignee } = req.body

    if (!title?.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }

    const column = await Column.findById(columnId)
    if (!column) {
      return res.status(404).json({ error: 'column not found' })
    }

    const count = await Task.countDocuments({ columnId })
    const task = await Task.create({
      columnId,
      boardId: column.boardId,
      title: title.trim(),
      description: description || '',
      dueDate: dueDate || null,
      labels: labels || [],
      assignee: assignee || '',
      order: count,
    })

    res.status(201).json(serializeTask(task))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateTask(req, res) {
  try {
    const { title, description, dueDate, labels, assignee } = req.body
    const updates = {}

    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ error: 'title cannot be empty' })
      updates.title = title.trim()
    }
    if (description !== undefined) updates.description = description
    if (dueDate !== undefined) updates.dueDate = dueDate
    if (labels !== undefined) updates.labels = labels
    if (assignee !== undefined) updates.assignee = assignee

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!task) {
      return res.status(404).json({ error: 'task not found' })
    }

    res.status(200).json(serializeTask(task))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
export async function moveTask(req, res) {
  // TODO(Owner: Task API) — see "Notes on move" above.
  res.status(501).json({ error: 'moveTask not implemented yet — see controllers/taskController.js' })
}

export async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) {
      return res.status(404).json({ error: 'task not found' })
    }
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}