import mongoose from 'mongoose';

const adminActionSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, required: true }, // e.g., 'ban_user', 'reject_skill', 'send_message'
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetSkill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  description: { type: String },
}, { timestamps: true });

const AdminAction = mongoose.model('AdminAction', adminActionSchema);
export default AdminAction;
