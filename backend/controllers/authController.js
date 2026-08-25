import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { serializeUser } from '../serialize.js'

/**
 * OWNER: Auth
 * Routes already wired in routes/authRoutes.js:
 *   POST /api/auth/register   { name, email, password }
 *   POST /api/auth/login      { email, password }
 * Both should respond with { token, user } on success.
 *
 * What to build:
 *   - register: check the email isn't already taken, hash the
 *     password with bcrypt, create the User, sign a JWT, return it.
 *   - login: find the user by email, compare the password with
 *     bcrypt.compare, sign a JWT if it matches, return it.
 *
 * Worked example for register (login follows the same shape —
 * find instead of create, bcrypt.compare instead of bcrypt.hash):
 *
 *   export async function register(req, res) {
 *     const { name, email, password } = req.body
 *     if (!name || !email || !password) {
 *       return res.status(400).json({ error: 'name, email, and password are required' })
 *     }
 *
 *     const existing = await User.findOne({ email: email.toLowerCase() })
 *     if (existing) return res.status(409).json({ error: 'Email already registered' })
 *
 *     const passwordHash = await bcrypt.hash(password, 10)
 *     const user = await User.create({ name, email: email.toLowerCase(), passwordHash })
 *
 *     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
 *     res.status(201).json({ token, user: serializeUser(user) })
 *   }
 */

export async function register(req, res) {
  // TODO(Owner: Auth) — see worked example above.
  res.status(501).json({ error: 'register not implemented yet — see controllers/authController.js' })
}

export async function login(req, res) {
  // TODO(Owner: Auth) — same shape as register, but find + bcrypt.compare instead of create + hash.
  res.status(501).json({ error: 'login not implemented yet — see controllers/authController.js' })
}
