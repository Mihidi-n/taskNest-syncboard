import mongoose from 'mongoose'

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Anyone in this list (plus the owner) can view/edit the board.
    // The "share the board" feature adds users here — see
    // controllers/boardController.js.
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

export default mongoose.model('Board', boardSchema)
