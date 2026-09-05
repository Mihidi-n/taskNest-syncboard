import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import {
  listBoards,
  createBoard,
  getBoard,
  renameBoard,
  deleteBoard,
  shareBoard,
  joinBoard,
} from '../controllers/boardController.js'

const router = Router()

router.use(protect)

router.get('/', listBoards)
router.post('/', createBoard)
router.post('/join/:token', joinBoard)
router.get('/:id', getBoard)
router.patch('/:id', renameBoard)
router.delete('/:id', deleteBoard)
router.post('/:id/share', shareBoard)

export default router