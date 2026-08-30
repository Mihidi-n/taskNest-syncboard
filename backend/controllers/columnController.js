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
  // TODO(Owner: Column API) — Column.find({ boardId: req.params.boardId }).sort('order')
  // (this handler is mounted at GET /api/columns/board/:boardId)
  res.status(501).json({ error: 'listColumns not implemented yet — see controllers/columnController.js' })
}

export async function createColumn(req, res) {
  // TODO(Owner: Column API) — see worked example above.
  res.status(501).json({ error: 'createColumn not implemented yet — see controllers/columnController.js' })
}

export async function renameColumn(req, res) {
  // TODO(Owner: Column API) — Column.findByIdAndUpdate(req.params.id, { title: req.body.title })
  res.status(501).json({ error: 'renameColumn not implemented yet — see controllers/columnController.js' })
}

export async function deleteColumn(req, res) {
  // TODO(Owner: Column API) — delete the column, then Task.deleteMany({ columnId: req.params.id })
  res.status(501).json({ error: 'deleteColumn not implemented yet — see controllers/columnController.js' })
}
