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
 *   POST   /api/boards/:id/share  { email }  — adds that user as a member (see notes below)
 *
 * Every controller here can read `req.userId` — that's the logged-in
 * user's id, set by the `protect` middleware once the Auth person has
 * built it. Until then it'll be `undefined`; that's expected while
 * you're both building at the same time, just don't be surprised if
 * user-scoped queries return nothing until Auth's part is done too.
 *
 * Worked example for listing boards (the rest follow familiar
 * Mongoose CRUD patterns — see controllers/columnController.js once
 * that's built for another example, or Board.findById /
 * Board.findByIdAndUpdate / Board.findByIdAndDelete):
 *
 *   export async function listBoards(req, res) {
 *     const boards = await Board.find({
 *       $or: [{ owner: req.userId }, { members: req.userId }],
 *     })
 *     res.json(boards.map(serializeBoard))
 *   }
 *
 * Notes on "share the board":
 *   The frontend's ShareBoardModal currently just shows a link — for
 *   a real implementation, decide with that feature's frontend owner
 *   whether sharing means "add this email as a member" (what the
 *   route above assumes) or "anyone with the link can view" (simpler,
 *   but means no real access control). Either is a reasonable answer
 *   for a class project — just document whichever you pick.
 */

export async function listBoards(req, res) {
  // TODO(Owner: Board API) — see worked example above.
  res.status(501).json({ error: 'listBoards not implemented yet — see controllers/boardController.js' })
}

export async function createBoard(req, res) {
  // TODO(Owner: Board API) — create a Board with owner: req.userId, default columns (see
  // frontend/src/hooks/useBoards.js createBoard for the column titles it expects: To Do / Doing / Done).
  res.status(501).json({ error: 'createBoard not implemented yet — see controllers/boardController.js' })
}

export async function getBoard(req, res) {
  // TODO(Owner: Board API) — Board.findById(req.params.id)
  res.status(501).json({ error: 'getBoard not implemented yet — see controllers/boardController.js' })
}

export async function renameBoard(req, res) {
  // TODO(Owner: Board API) — Board.findByIdAndUpdate(req.params.id, { name: req.body.name })
  res.status(501).json({ error: 'renameBoard not implemented yet — see controllers/boardController.js' })
}

export async function deleteBoard(req, res) {
  // TODO(Owner: Board API) — delete the board, then Column.deleteMany and Task.deleteMany for it.
  res.status(501).json({ error: 'deleteBoard not implemented yet — see controllers/boardController.js' })
}

export async function shareBoard(req, res) {
  // TODO(Owner: Board API) — see "Notes on share the board" above.
  res.status(501).json({ error: 'shareBoard not implemented yet — see controllers/boardController.js' })
}
