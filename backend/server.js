import 'dotenv/config'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])

import 'express-async-errors'
import express from 'express'
import cors from 'cors'

import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import boardRoutes from './routes/boardRoutes.js'
import columnRoutes from './routes/columnRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',')
console.log('MongoDB host:', MONGODB_URI?.split('@')[1])

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set — copy .env.example to .env and fill it in.')
  process.exit(1)
}

const app = express()
app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/columns', columnRoutes)
app.use('/api/tasks', taskRoutes)

// Catch-all for unmatched routes.
app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` })
})

// Basic error handler so a thrown/rejected controller doesn't crash the process.
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' })
})

async function start() {
  await connectDB(MONGODB_URI)
  app.listen(PORT, () => {
    console.log(`CollabBoard API listening on http://localhost:${PORT}`)
  })
}

start()
