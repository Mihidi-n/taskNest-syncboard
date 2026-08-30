import mongoose from 'mongoose'

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message)
    console.error('Check MONGODB_URI in .env — is the Atlas cluster reachable, and is your IP allow-listed?')
    process.exit(1)
  }
}
