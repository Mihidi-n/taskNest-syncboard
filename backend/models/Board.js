import mongoose from 'mongoose'

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['viewer', 'editor'], default: 'editor' },
      },
    ],

    shareToken: { type: String, unique: true, sparse: true },
    shareRole: { type: String, enum: ['viewer', 'editor'], default: 'editor' },
  },
  { timestamps: true }
)

export default mongoose.model('Board', boardSchema)