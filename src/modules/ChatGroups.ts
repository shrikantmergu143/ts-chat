import mongoose, { Document, Schema } from "mongoose";
interface IChatGroups extends Document {
    name: string;
    group_type: string;
    users: string[];
    profile_url: string;
    group_id: string;
    created_by: mongoose.Schema.Types.ObjectId | string;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
}
const ChatGroups = new Schema<IChatGroups>({
    name: { type: String, required: true},
    group_type: { type: String, enum: ['group', 'direct'], required: true },
    // users: { type: [String], required: true },
    users: {
        type: [String],
        required: true,
        validate: {
            validator: function (users: string[]) {
                // Normalize emails and check for duplicates
                const normalized = users.map(email => email.toLowerCase().trim());
                return new Set(normalized).size === normalized.length;
            },
            message: "Users array contains duplicate email addresses."
        },
        set: (users: string[]) => 
            users.map(email => email.toLowerCase().trim()).sort(), 
    },
    profile_url: { type: String, default: "" }, // Cover image URL
    created_by: { type: String, ref: 'user', required: true },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now },
    is_active: { type: Boolean, default: true },
    group_id: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString(), // Auto-generate if not provided
    },

});
ChatGroups.index({ group_type: 1, users: 1 }, { unique: true });

// Create the model using the interface
const ChatGroupSchema = mongoose.model<IChatGroups>("ChatGroup", ChatGroups);

export default ChatGroupSchema;