import express from 'express'
import { register, signIn } from '../controllers/auth.controller'

const router = express.Router()

// Register
router.post('/register', register)

// Sign in
router.post('/sign-in', signIn)

export default router