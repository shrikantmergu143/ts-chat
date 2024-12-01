import mongoose, { Document, Schema } from "mongoose";
interface IGroupMemberSchema extends Document {
    group_id: mongoose.Schema.Types.ObjectId | string;
    user_id: mongoose.Schema.Types.ObjectId | string;
    joined_at: Date;
    updated_at: Date;
    is_admin: boolean;
}

const GroupMemberSchema = new mongoose.Schema({
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup', required: true, unique: true, default: () => new mongoose.Types.ObjectId().toString()  },  // Chat group (group or direct chat)
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true, default: () => new mongoose.Types.ObjectId().toString() },  // User in the chat group
  joined_at: { type: Date, default: Date.now },  // When the user joined the group
  is_admin: { type: Boolean, default: false },  // Whether the user is an admin in the group
});

const GroupMember = mongoose.model<IGroupMemberSchema>('GroupMember', GroupMemberSchema);

export default GroupMember;