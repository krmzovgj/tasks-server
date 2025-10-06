import express from 'express'
import { verifyToken } from '../middleware/auth'
import { getUser } from '../controllers/user.controller'

const router = express.Router()

router.get('/:id', verifyToken, getUser)

export default router