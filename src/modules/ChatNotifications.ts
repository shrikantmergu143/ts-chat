// models/ChatNotifications.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChatNotification extends Document {
    user_id: mongoose.Types.ObjectId | string;
    group_id: mongoose.Types.ObjectId | string;
    unread_message_ids: (mongoose.Types.ObjectId | string)[];
    updated_at: Date;
}

const ChatNotificationSchema = new Schema<IChatNotification>({
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    group_id: { type: Schema.Types.ObjectId, ref: "ChatGroup", required: true },
    unread_message_ids: [{ type: Schema.Types.ObjectId, ref: "ChatMessages" }],
    updated_at: { type: Date, default: Date.now }
});

const ChatNotifications = mongoose.model<IChatNotification>("ChatNotifications", ChatNotificationSchema);
export default ChatNotifications;
