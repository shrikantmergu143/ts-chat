import mongoose, { Document, Schema } from "mongoose";
interface IGroupMemberSchema extends Document {
  group_id: mongoose.Schema.Types.ObjectId | string;
  user_id: mongoose.Schema.Types.ObjectId | string;
  joined_at: Date;
  updated_at: Date;
}

const GroupMemberSchema = new mongoose.Schema({
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup', required: true, unique: true, default: () => new mongoose.Types.ObjectId().toString() },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  joined_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const GroupMember = mongoose.model<IGroupMemberSchema>('GroupMember', GroupMemberSchema);

export default GroupMember;