import { Response } from "express";
import { IRequestUserDetails } from "../../middleware/auth";
import ChatMessages, { IGroupMemberSchema } from "../../modules/ChatMessages";
import mongoose from "mongoose";

const deleteChatMessage = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    const messageId = req.params?.message_id || req.body?.id;
    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ error: "Invalid or missing message ID" });
    }
    try {
        const messageData: IGroupMemberSchema | null = await ChatMessages.findById(messageId);
        if (!messageData || messageData?.sender_id != req?.user?.id) {
            return res.status(404).json({ error: "Message not found", messageData:messageData, user: req?.user });
        }
        await ChatMessages.deleteOne({ _id: messageId });

        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Failed to delete message", err });
    }
};

export default deleteChatMessage;
