import Column from '../models/Column.js'
import Task from '../models/Task.js'
import { serializeColumn } from '../serialize.js'

/**
 * OWNER: Column API
 * Routes already wired in routes/columnRoutes.js (all behind `protect`):
 *   GET    /api/columns/board/:boardId    — list columns for a board
 *   POST   /api/columns/board/:boardId    { title }
 *   PATCH  /api/columns/:id               { title }   — rename
 *   DELETE /api/columns/:id               — also delete its tasks
 *
 * Corresponds to the frontend's AddColumnForm and ColumnMenu features
 * (frontend/src/components/AddColumnForm.jsx, ColumnMenu.jsx) — once
 * both sides are done, those components' onAdd/onRename/onDelete
 * callbacks will call these endpoints instead of the local mock state.
 *
 * Worked example for creating a column (rename/delete are one-liners
 * with findByIdAndUpdate / findByIdAndDelete — see boardController.js
 * for that pattern):
 *
 *   export async function createColumn(req, res) {
 *     const { boardId } = req.params
 *     const { title } = req.body
 *     if (!title?.trim()) return res.status(400).json({ error: 'title is required' })
 *
 *     const count = await Column.countDocuments({ boardId })
 *     const column = await Column.create({ boardId, title: title.trim(), order: count })
 *     res.status(201).json(serializeColumn(column))
 *   }
 */

export async function listColumns(req, res) {
 try {
    const { boardId } = req.params
    const columns = await Column.find({ boardId }).sort('order')
    res.json(columns.map(serializeColumn))
  } catch (err) {
    res.status(500).json({ message: "Error listing columns", error: err })
  }
}

export async function createColumn(req, res) {
  try {
    const { boardId } = req.params
    const { title } = req.body

    if (!title?.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }

    const count = await Column.countDocuments({ boardId })
    const column = await Column.create({
      boardId,
      title: title.trim(),
      order: count
    })

    res.status(201).json(serializeColumn(column))
  } catch (err) {
    res.status(500).json({ message: "Error creating column", error: err })
  }
}

export async function renameColumn(req, res) {
   try {
    const { id } = req.params
    const { title } = req.body

    if (!title?.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }

    const column = await Column.findByIdAndUpdate(
      id,
      { title: title.trim() },
      { new: true }
    )

    if (!column) {
      return res.status(404).json({ error: 'Column not found' })
    }

    res.json(serializeColumn(column))
  } catch (err) {
    res.status(500).json({ message: "Error renaming column", error: err })
  }
}

export async function deleteColumn(req, res) {
  try {
    const { id } = req.params

    const column = await Column.findByIdAndDelete(id)
    if (!column) {
      return res.status(404).json({ error: 'Column not found' })
    }

    await Task.deleteMany({ columnId: id })
    res.json({ message: "Column deleted" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting column", error: err })
  }
}