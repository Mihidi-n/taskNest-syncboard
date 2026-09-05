import Column from '../models/Column.js'
import Task from '../models/Task.js'
import Board from '../models/Board.js'
import { serializeColumn } from '../serialize.js'
import { roleOnBoard, canEdit } from '../permissions.js'

export async function listColumns(req, res) {
  try {
    const { boardId } = req.params
    const board = await Board.findById(boardId)
    if (!board || !roleOnBoard(board, req.userId)) {
      return res.status(404).json({ error: 'Board not found' })
    }

    const columns = await Column.find({ boardId }).sort('order')
    res.json(columns.map(serializeColumn))
  } catch (err) {
    res.status(500).json({ message: 'Error listing columns', error: err.message })
  }
}

export async function createColumn(req, res) {
  try {
    const { boardId } = req.params
    const { title } = req.body

    if (!title?.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }

    const board = await Board.findById(boardId)
    const role = board ? roleOnBoard(board, req.userId) : null
    if (!board || !role) {
      return res.status(404).json({ error: 'Board not found' })
    }
    if (!canEdit(role)) {
      return res.status(403).json({ error: 'Viewers cannot add lists' })
    }

    const count = await Column.countDocuments({ boardId })
    const column = await Column.create({
      boardId,
      title: title.trim(),
      order: count,
    })

    res.status(201).json(serializeColumn(column))
  } catch (err) {
    res.status(500).json({ message: 'Error creating column', error: err.message })
  }
}

export async function renameColumn(req, res) {
  try {
    const { id } = req.params
    const { title } = req.body

    if (!title?.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }

    const column = await Column.findById(id)
    if (!column) return res.status(404).json({ error: 'Column not found' })

    const board = await Board.findById(column.boardId)
    const role = board ? roleOnBoard(board, req.userId) : null
    if (!board || !role) {
      return res.status(404).json({ error: 'Board not found' })
    }
    if (!canEdit(role)) {
      return res.status(403).json({ error: 'Viewers cannot rename lists' })
    }

    column.title = title.trim()
    await column.save()

    res.json(serializeColumn(column))
  } catch (err) {
    res.status(500).json({ message: 'Error renaming column', error: err.message })
  }
}

export async function deleteColumn(req, res) {
  try {
    const { id } = req.params

    const column = await Column.findById(id)
    if (!column) return res.status(404).json({ error: 'Column not found' })

    const board = await Board.findById(column.boardId)
    const role = board ? roleOnBoard(board, req.userId) : null
    if (!board || !role) {
      return res.status(404).json({ error: 'Board not found' })
    }
    if (!canEdit(role)) {
      return res.status(403).json({ error: 'Viewers cannot delete lists' })
    }

    await Column.findByIdAndDelete(id)
    await Task.deleteMany({ columnId: id })

    res.json({ message: 'Column deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting column', error: err.message })
  }
}