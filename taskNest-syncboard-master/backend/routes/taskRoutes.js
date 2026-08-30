import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import {
  listTasksForBoard,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} from '../controllers/taskController.js'

const router = Router()

router.use(protect)

router.get('/board/:boardId', listTasksForBoard)
router.post('/column/:columnId', createTask)
router.patch('/:id', updateTask)
router.patch('/:id/move', moveTask)
router.delete('/:id', deleteTask)

export default router
