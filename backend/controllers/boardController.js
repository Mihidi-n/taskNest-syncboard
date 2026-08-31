import Board from '../models/Board.js'
import Column from '../models/Column.js'
import Task from '../models/Task.js'
import { serializeBoard } from '../serialize.js'

/**
 * OWNER: Board API
 * Routes already wired in routes/boardRoutes.js (all behind `protect`):
 *   GET    /api/boards          — list boards the logged-in user owns or is a member of
 *   POST   /api/boards          { name }
 *   GET    /api/boards/:id
 *   PATCH  /api/boards/:id      { name }
 *   DELETE /api/boards/:id      — also delete its columns and tasks
 *   POST   /api/boards/:id/share  { email }  — adds that user as a member
 */

export async function listBoards(req, res) {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.userId }, { members: req.userId }],
    })
    res.json(boards.map(serializeBoard))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createBoard(req, res) {
  try {
    const { name } = req.body;
    const ownerId = req.userId;

    // 1. Create the board
    const board = await Board.create({ 
      name, 
      owner: ownerId, 
      members: [ownerId] 
    });

    // 2. Create default columns: To Do / Doing / Done
    const defaultColumns = ['To Do', 'Doing', 'Done'].map(title => ({
      title,
      board: board._id,
      order: 0
    }));
    await Column.insertMany(defaultColumns);

    res.status(201).json(serializeBoard(board));
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function getBoard(req, res) {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [{ owner: req.userId }, { members: req.userId }],
    });
    if (!board) return res.status(404).json({ message: "Board not found" });
    
    res.json(serializeBoard(board));
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function renameBoard(req, res) {
  try {
    const { name } = req.body;

    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, $or: [{ owner: req.userId }, { members: req.userId }] },
      { name },
      { new: true }
    );
    if (!board) return res.status(404).json({ message: "Board not found" });
    
    res.json(serializeBoard(board));
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function deleteBoard(req, res) {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!board) return res.status(404).json({ message: "Board not found or not owner" });

    // also delete columns and tasks
    await Column.deleteMany({ board: req.params.id });
    await Task.deleteMany({ board: req.params.id });
    
    res.json({ message: "Board deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function shareBoard(req, res) {
  try {
    const { email } = req.body;
    
    // NOTE: This assumes you have a User model. For now we'll just add a placeholder
    // In real app: const userToAdd = await User.findOne({ email })
    // Then add userToAdd._id to members

    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { $addToSet: { members: "ADD_USER_ID_HERE" } }, // TODO: replace with real user ID from email
      { new: true }
    );
    if (!board) return res.status(404).json({ message: "Board not found or not owner" });

    res.json(serializeBoard(board));
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}