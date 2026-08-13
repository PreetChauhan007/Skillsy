import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  swapRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [messageSchema],
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
