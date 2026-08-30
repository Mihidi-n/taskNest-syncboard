import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { serializeUser } from '../serialize.js'

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export async function register(req, res) {
  const { name, email, password } = req.body

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash })

  const token = signToken(user._id)
  res.status(201).json({ token, user: serializeUser(user) })
}

export async function login(req, res) {
  const { email, password } = req.body

  if (!email?.trim() || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail })
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const matches = await bcrypt.compare(password, user.passwordHash)
  if (!matches) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = signToken(user._id)
  res.status(200).json({ token, user: serializeUser(user) })
}

export async function getCurrentUser(req, res) {
  const user = await User.findById(req.userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.status(200).json(serializeUser(user))
}