import { Router } from 'express'
import { register, login, getCurrentUser, updateProfile } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getCurrentUser)
router.patch('/me', protect, updateProfile)

export default router