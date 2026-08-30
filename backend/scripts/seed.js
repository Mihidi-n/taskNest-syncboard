/**
 * OWNER: API docs & testing
 *
 * Populates the database with one test user, one board, three
 * columns, and a couple of tasks — useful for manually testing
 * endpoints (or for the frontend-integration person to have real
 * data to point at) without needing every controller finished first,
 * since this talks to the models directly rather than going through
 * the API.
 *
 * Run with: npm run seed
 *
 * Feel free to extend this — e.g. add more tasks, or print out a
 * ready-to-use JWT for manual testing once auth is built (sign one
 * the same way controllers/authController.js does).
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import Board from '../models/Board.js'
import Column from '../models/Column.js'
import Task from '../models/Task.js'

async function seed() {
  await connectDB(process.env.MONGODB_URI)

  const passwordHash = await bcrypt.hash('password123', 10)
  const user = await User.findOneAndUpdate(
    { email: 'test@collabboard.dev' },
    { name: 'Test User', email: 'test@collabboard.dev', passwordHash },
    { upsert: true, new: true }
  )

  const board = await Board.create({ name: 'Seeded Board', owner: user._id })

  const [todo, doing, done] = await Column.insertMany([
    { boardId: board._id, title: 'To Do', order: 0 },
    { boardId: board._id, title: 'Doing', order: 1 },
    { boardId: board._id, title: 'Done', order: 2 },
  ])

  await Task.insertMany([
    {
      columnId: todo._id,
      boardId: board._id,
      title: 'Wire up the auth routes',
      description: 'Register + login, returning a JWT.',
      labels: ['backend'],
      order: 0,
    },
    {
      columnId: doing._id,
      boardId: board._id,
      title: 'Connect frontend to the API',
      description: '',
      labels: ['frontend'],
      order: 0,
    },
  ])

  console.log('Seeded:')
  console.log(`  user:  test@collabboard.dev / password123 (id: ${user._id})`)
  console.log(`  board: "${board.name}" (id: ${board._id})`)

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
