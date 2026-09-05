import Task from '../models/Task.js'
import Column from '../models/Column.js'
import Board from '../models/Board.js'
import { serializeTask } from '../serialize.js'
import { roleOnBoard, canEdit } from '../permissions.js'

export async function listTasksForBoard(req, res) {
  try {
    const { boardId } = req.params
    const board = await Board.findById(boardId)
    if (!board || !roleOnBoard(board, req.userId)) {
      return res.status(404).json({ error: 'Board not found' })
    }

    const tasks = await Task.find({ boardId }).sort({ order: 1 })
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

    const board = await Board.findById(column.boardId)
    const role = board ? roleOnBoard(board, req.userId) : null
    if (!board || !role) {
      return res.status(404).json({ error: 'Board not found' })
    }
    if (!canEdit(role)) {
      return res.status(403).json({ error: 'Viewers cannot add tasks' })
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

    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ error: 'task not found' })

    const board = await Board.findById(task.boardId)
    const role = board ? roleOnBoard(board, req.userId) : null
    if (!board || !role) {
      return res.status(404).json({ error: 'Board not found' })
    }
    if (!canEdit(role)) {
      return res.status(403).json({ error: 'Viewers cannot edit tasks' })
    }

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

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    res.status(200).json(serializeTask(updatedTask))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function moveTask(req, res) {
  try {
    const { id } = req.params
    const { columnId, order } = req.body

    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ error: 'task not found' })

    const board = await Board.findById(task.boardId)
    const role = board ? roleOnBoard(board, req.userId) : null
    if (!board || !role) {
      return res.status(404).json({ error: 'Board not found' })
    }
    if (!canEdit(role)) {
      return res.status(403).json({ error: 'Viewers cannot move tasks' })
    }

    const destColumn = await Column.findById(columnId)
    if (!destColumn) return res.status(404).json({ error: 'column not found' })

    const srcColumnId = task.columnId
    const isMovingWithinColumn = srcColumnId.equals(columnId)

    if (isMovingWithinColumn) {
      const tasks = await Task.find({ columnId: srcColumnId }).sort('order')
      const currentIndex = tasks.findIndex((t) => t._id.equals(id))
      tasks.splice(currentIndex, 1)

      const newOrder = Math.max(0, Math.min(order, tasks.length))
      tasks.splice(newOrder, 0, task)

      for (let i = 0; i < tasks.length; i++) {
        tasks[i].order = i
        await tasks[i].save()
      }
    } else {
      const srcTasks = await Task.find({ columnId: srcColumnId }).sort('order')
      const srcIndex = srcTasks.findIndex((t) => t._id.equals(id))
      srcTasks.splice(srcIndex, 1)

      for (let i = 0; i < srcTasks.length; i++) {
        srcTasks[i].order = i
        await srcTasks[i].save()
      }

      const destTasks = await Task.find({ columnId: columnId }).sort('order')
      const newOrder = Math.max(0, Math.min(order, destTasks.length))

      task.columnId = destColumn._id
      task.boardId = destColumn.boardId
      task.order = newOrder

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
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ error: 'task not found' })

    const board = await Board.findById(task.boardId)
    const role = board ? roleOnBoard(board, req.userId) : null
    if (!board || !role) {
      return res.status(404).json({ error: 'Board not found' })
    }
    if (!canEdit(role)) {
      return res.status(403).json({ error: 'Viewers cannot delete tasks' })
    }

    await Task.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}