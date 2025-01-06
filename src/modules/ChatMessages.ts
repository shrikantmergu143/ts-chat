import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the ChatMessages schema
interface IGroupMemberSchema extends Document {
    chat_id: mongoose.Schema.Types.ObjectId | string;
    group_id: mongoose.Schema.Types.ObjectId | string;
    sender_id: mongoose.Schema.Types.ObjectId | string;
    message: string;
    reply_id: mongoose.Schema.Types.ObjectId | string;
    message_type: "image" | "video" | "file" | "text";
    media_url?: string;
    is_deleted?: mongoose.Schema.Types.ObjectId[];
    deliveryBy: Array<{ user_id: mongoose.Schema.Types.ObjectId | string; readAt: Date }>;
    readBy: Array<{ user_id: mongoose.Schema.Types.ObjectId | string; readAt: Date }>;
    created_at: Date;
    updated_at: Date;
}

// Define the ChatMessages schema
const ChatMessagesSchema = new mongoose.Schema({
    chat_id: { type: mongoose.Schema.Types.ObjectId, ref: "_id", required: true, default: () => new mongoose.Types.ObjectId().toString() },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "ChatGroup", required: true, },
    message: { type: String, },
    reply_id: { type: mongoose.Schema.Types.ObjectId, ref: "ChatMessages" },
    message_type: { type: String, enum: ["image", "video", "file", "text"] },
    media_url: { type: String },
    is_deleted: { type: [mongoose.Schema.Types.ObjectId], ref: "user" },
    readBy: [
        {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            readAt: { type: Date, default: Date.now },
        },
    ],
    deliveryBy: [
        {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            readAt: { type: Date, default: Date.now },
        },
    ],
    created_at: { type: Date, default: Date.now, },
    updated_at: { type: Date, default: Date.now, },
});

// Define the model
const ChatMessages = mongoose.model<IGroupMemberSchema>("ChatMessages", ChatMessagesSchema);

export default ChatMessages;
