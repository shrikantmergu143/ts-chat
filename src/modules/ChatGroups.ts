import mongoose, { Document, Schema } from "mongoose";
// Define the Invite schema that tracks the invite status for each user
export interface IInvite {
    user_id: mongoose.Schema.Types.ObjectId | String;  // Use user_id instead of email
    email: String;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    sent_at: Date;
    responded_at?: Date; // Time when the user responded
}

// Unread message count for each user in a chat group
export interface IUnreadCount {
    user_id: mongoose.Schema.Types.ObjectId | String;  // User in the chat group
    count: number;  // Number of unread messages for this user
}

export interface IChatGroups extends Document {
    name: string;
    group_type: string;
    users: string[];
    profile_url: string;
    group_id: string;
    created_by: mongoose.Schema.Types.ObjectId | string;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
    mode: string;
    unread_counts: IUnreadCount[];
    invites?: IInvite[]; // New field for invites
}
const UnreadCountSchema = new Schema<IUnreadCount>({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    count: { type: Number, required: true, default: 0 },  // Default to 0 unread messages
});
const InviteSchema = new Schema<IInvite>({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referencing User model
    email: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected', 'expired'], 
        required: true, 
        default: 'pending' 
    },
    sent_at: { type: Date, required: true, default: Date.now },
    responded_at: { type: Date },
});
const ChatGroups = new Schema<IChatGroups>({
    name: { type: String, required: true},
    group_type: { type: String, enum: ['group', 'direct'], required: true },
    mode: { type: String, enum: ['private', 'public'], required: true },
    is_active: { type: Boolean, default: true },
    users: {
        type: [String],
        required: true,
        validate: {
            validator: function (users: string[]) {
                // Normalize emails and check for duplicates
                if (this.group_type === 'group') {
                    // Ensure exactly 2 users for direct chat
                    return users.length > 0;
                }
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
    group_id: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString(), // Auto-generate if not provided
    },
    unread_counts: [UnreadCountSchema],
    invites: [InviteSchema], // Added field for invites


});
// ChatGroups.index({ group_type: 1 }, { unique: true });
ChatGroups.index({ name: 'text', profile_url: 'text' });  // You can add more fields to this list as needed


// Create the model using the interface
const ChatGroupSchema = mongoose.model<IChatGroups>("ChatGroup", ChatGroups);

export default ChatGroupSchema;