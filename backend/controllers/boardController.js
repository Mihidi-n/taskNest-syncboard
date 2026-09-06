import crypto from 'crypto'
import Board from '../models/Board.js'
import Column from '../models/Column.js'
import Task from '../models/Task.js'
import { serializeBoard } from '../serialize.js'
import { roleOnBoard, canEdit } from '../permissions.js'
import { notifyBoardChanged } from '../socket.js'

export async function listBoards(req, res) {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.userId }, { 'members.user': req.userId }],
    })
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
    res.json(boards.map((b) => serializeBoard(b, req.userId)))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function createBoard(req, res) {
  try {
    const { name } = req.body
    const ownerId = req.userId

    const board = await Board.create({ name, owner: ownerId, members: [] })

    const defaultColumns = ['To Do', 'Doing', 'Done'].map((title, i) => ({
      title,
      boardId: board._id,
      order: i,
    }))
    await Column.insertMany(defaultColumns)

    const populated = await Board.findById(board._id).populate('owner', 'name email')
    res.status(201).json(serializeBoard(populated, ownerId))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getBoard(req, res) {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
    const role = board ? roleOnBoard(board, req.userId) : null
    if (!board || !role) {
      return res.status(404).json({ error: 'Board not found' })
    }
    res.json(serializeBoard(board, req.userId))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function renameBoard(req, res) {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
    const role = board ? roleOnBoard(board, req.userId) : null
    if (!board || !role) {
      return res.status(404).json({ error: 'Board not found' })
    }
    if (!canEdit(role)) {
      return res.status(403).json({ error: 'Viewers cannot rename this board' })
    }

    board.name = req.body.name
    await board.save()

    notifyBoardChanged(board._id.toString())
    res.json(serializeBoard(board, req.userId))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteBoard(req, res) {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.userId })
    if (!board) {
      return res.status(404).json({ error: 'Board not found or you are not the owner' })
    }

    await Column.deleteMany({ boardId: board._id })
    await Task.deleteMany({ boardId: board._id })

    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function shareBoard(req, res) {
  try {
    const { role } = req.body
    if (!['viewer', 'editor'].includes(role)) {
      return res.status(400).json({ error: 'role must be "viewer" or "editor"' })
    }

    const board = await Board.findOne({ _id: req.params.id, owner: req.userId })
    if (!board) {
      return res.status(404).json({ error: 'Board not found or you are not the owner' })
    }

    if (!board.shareToken) {
      board.shareToken = crypto.randomBytes(16).toString('hex')
    }
    board.shareRole = role
    await board.save()

    const frontendOrigin = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',')[0]
    res.json({
      link: `${frontendOrigin}/join/${board.shareToken}`,
      role: board.shareRole,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function joinBoard(req, res) {
  try {
    const { token } = req.params
    const board = await Board.findOne({ shareToken: token })
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
    if (!board) {
      return res.status(404).json({ error: 'This link is invalid or has expired.' })
    }

    const ownerId = board.owner._id.toString()
    const alreadyHasAccess =
      ownerId === req.userId ||
      board.members.some((m) => (m.user._id ? m.user._id.toString() : m.user.toString()) === req.userId)

    if (!alreadyHasAccess) {
      board.members.push({ user: req.userId, role: board.shareRole || 'viewer' })
      await board.save()
      await board.populate('members.user', 'name email')
    }

    notifyBoardChanged(board._id.toString())
    res.json(serializeBoard(board, req.userId))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}