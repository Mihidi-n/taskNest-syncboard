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
  try {
    const { id } = req.params
    const { columnId, order } = req.body

    if (columnId === undefined || order === undefined) {
      return res.status(400).json({ error: 'columnId and order are required' })
    }

    // Find the task to move
    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ error: 'task not found' })

    // Verify the target column exists and get its boardId
    const targetColumn = await Column.findById(columnId)
    if (!targetColumn) return res.status(404).json({ error: 'target column not found' })

    const oldColumnId = task.columnId.toString()
    const newColumnId = columnId.toString()
    const isSameColumn = oldColumnId === newColumnId

    // Get all tasks in the target column (will include the moved task if same column)
    const tasksInNewColumn = await Task.find({ columnId: newColumnId }).sort('order')

    // Remove the moved task from the new column list if it's already there (same column move)
    let orderedTasks = isSameColumn
      ? tasksInNewColumn.filter(t => t._id.toString() !== id)
      : tasksInNewColumn

    // Validate the new order is within bounds
    if (order < 0 || order > orderedTasks.length) {
      return res.status(400).json({ error: `order must be between 0 and ${orderedTasks.length}` })
    }

    // Insert the task at the new position
    orderedTasks.splice(order, 0, task)

    // Update all tasks in the target column with new order values
    const updatePromises = orderedTasks.map((t, index) => {
      t.order = index
      t.columnId = columnId
      t.boardId = targetColumn.boardId
      return t.save()
    })

    // If moving to a different column, renumber the old column's tasks
    if (!isSameColumn) {
      const tasksInOldColumn = await Task.find({ columnId: oldColumnId }).sort('order')
      const updateOldColumnPromises = tasksInOldColumn.map((t, index) => {
        t.order = index
        return t.save()
      })
      updatePromises.push(...updateOldColumnPromises)
    }

    // Execute all updates
    await Promise.all(updatePromises)

    // Fetch the updated task to ensure we have the latest state
    const updatedTask = await Task.findById(id)
    res.json(serializeTask(updatedTask))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to move task' })
  }
}

export async function deleteTask(req, res) {
  // TODO(Owner: Task API) — Task.findByIdAndDelete(req.params.id)
  res.status(501).json({ error: 'deleteTask not implemented yet — see controllers/taskController.js' })
}
