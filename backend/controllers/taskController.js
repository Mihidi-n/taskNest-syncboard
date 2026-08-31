import Task from '../models/Task.js'
import Column from '../models/Column.js'
import { serializeTask } from '../serialize.js'

/**
 * OWNER: Task API
 * Routes already wired in routes/taskRoutes.js (all behind `protect`):
 *   GET    /api/tasks/board/:boardId        — every task on the board
 *   POST   /api/tasks/column/:columnId      { title, description?, startDate?, dueDate?, labels?, assignee? }
 *   PATCH  /api/tasks/:id                   { title?, description?, startDate?, dueDate?, labels?, assignee? }
 *   PATCH  /api/tasks/:id/move              { columnId, order }
 *   DELETE /api/tasks/:id
 *
 * labels is an array of { name, color } objects, e.g.
 * [{ name: 'High', color: '#2563eb' }] — not plain strings.
 *
 * Corresponds to the frontend's TaskDetailModal (start date, due date,
 * description) and LabelBadge features — once both sides are done,
 * TaskDetailModal's onSave callback calls PATCH /api/tasks/:id with
 * whatever fields changed.
 *
 * Worked example for creating a task (update/delete are one-liners —
 * see columnController.js for the same findByIdAndUpdate /
 * findByIdAndDelete pattern):
 *
 *   export async function createTask(req, res) {
 *     const { columnId } = req.params
 *     const { title, description, startDate, dueDate, labels, assignee } = req.body
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
 *       startDate: startDate || null,
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
    const { title, description, startDate, dueDate, labels, assignee } = req.body

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
  startDate: startDate || null,
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
    const { title, description, startDate, dueDate, labels, assignee } = req.body
    const updates = {}

    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ error: 'title cannot be empty' })
      updates.title = title.trim()
    }
    if (description !== undefined) updates.description = description
    if (startDate !== undefined) updates.startDate = startDate
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
  const { id } = req.params
  const { columnId, order } = req.body

  // Find the task
  const task = await Task.findById(id)
  if (!task) return res.status(404).json({ error: 'task not found' })

  // Find destination column
  const destColumn = await Column.findById(columnId)
  if (!destColumn) return res.status(404).json({ error: 'column not found' })

  const srcColumnId = task.columnId
  const isMovingWithinColumn = srcColumnId.equals(columnId)

  if (isMovingWithinColumn) {
    // Moving within the same column: reorder only
    const tasks = await Task.find({ columnId: srcColumnId }).sort('order')
    const currentIndex = tasks.findIndex((t) => t._id.equals(id))
    tasks.splice(currentIndex, 1)

    // Clamp the requested order to valid range [0, tasks.length]
    const newOrder = Math.max(0, Math.min(order, tasks.length))
    tasks.splice(newOrder, 0, task)

    // Renumber all tasks sequentially
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].order = i
      await tasks[i].save()
    }
  } else {
    // Moving to a different column
    // 1. Renumber tasks in source column (remove current task)
    const srcTasks = await Task.find({ columnId: srcColumnId }).sort('order')
    const srcIndex = srcTasks.findIndex((t) => t._id.equals(id))
    srcTasks.splice(srcIndex, 1)

    for (let i = 0; i < srcTasks.length; i++) {
      srcTasks[i].order = i
      await srcTasks[i].save()
    }

    // 2. Prepare destination column tasks and insert the moved task
    const destTasks = await Task.find({ columnId: columnId }).sort('order')

    // Clamp the requested order to valid range [0, destTasks.length]
    const newOrder = Math.max(0, Math.min(order, destTasks.length))

    // Update the task's destination column and board
    task.columnId = destColumn._id
    task.boardId = destColumn.boardId
    task.order = newOrder

    // Renumber destination tasks (insert moved task at newOrder)
    for (let i = 0; i < destTasks.length; i++) {
      if (i < newOrder) {
        destTasks[i].order = i
      } else {
        destTasks[i].order = i + 1
      }
      await destTasks[i].save()
    }

    await task.save()
  }

  res.json(serializeTask(task))
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