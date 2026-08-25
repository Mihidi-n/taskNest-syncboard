import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { listColumns, createColumn, renameColumn, deleteColumn } from '../controllers/columnController.js'

const router = Router()

router.use(protect)

router.get('/board/:boardId', listColumns)
router.post('/board/:boardId', createColumn)
router.patch('/:id', renameColumn)
router.delete('/:id', deleteColumn)

export default router
