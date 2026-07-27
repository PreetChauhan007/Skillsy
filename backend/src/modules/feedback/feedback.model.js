import mongoose from 'mongoose';


const feedbackSchema = new mongoose.Schema({
  swapRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
}, { timestamps: true });

// Virtual for id field to match frontend expectations
feedbackSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Ensure virtuals are serialized
feedbackSchema.set('toJSON', { virtuals: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
