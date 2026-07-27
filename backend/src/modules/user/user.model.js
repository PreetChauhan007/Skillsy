import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  location: String,
  profilePhoto: String,
  skillsOffered: [{ type: String }], // Changed from ObjectId to String array
  skillsWanted: [{ type: String }], // Changed from ObjectId to String array
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  }, // Changed from array to single string
  isPublic: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalSwaps: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });


// Method to compare entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Virtual for joinedDate
userSchema.virtual('joinedDate').get(function () {
  return this.createdAt.toISOString().split('T')[0];
});

// Ensure virtuals are serialized
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;