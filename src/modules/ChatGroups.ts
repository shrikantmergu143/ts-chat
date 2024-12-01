import mongoose, { Document, Schema } from "mongoose";
interface IChatGroups extends Document {
    name: string;
    group_type: string;
    profile_url: string;
    created_by: mongoose.Schema.Types.ObjectId | string;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
}
const ChatGroups = new Schema<IChatGroups>({
    name: { type: String, required: true},
    group_type: { type: String, enum: ['group', 'direct'], required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now },
    is_active: { type: Boolean, default: true },
    profile_url: { type: String, default: "" }, // Cover image URL

});
// Create the model using the interface
const ChatGroupSchema = mongoose.model<IChatGroups>("ChatGroup", ChatGroups);

export default ChatGroupSchema;