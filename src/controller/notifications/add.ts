// POST /chat/notifications/add
import { Request, Response } from "express";
import ChatMessages from "../../modules/ChatMessages";
import ChatGroupSchema from "../../modules/ChatGroups";
import ChatNotifications from "../../modules/ChatNotifications";
import { IRequestUserDetails } from "../../middleware/auth";

const addNotificationByMessage = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    const { message_id } = req.body;
    if (!message_id) {
        return res.status(400).json({ error: "Message ID is required" });
    }
    try {
        const message = await ChatMessages.findById(message_id);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        const group = await ChatGroupSchema.findById(message.group_id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        for (const userId of group.users) {
            if (userId?.toString() !== message.sender_id?.toString()) {
                const existingNotification = await ChatNotifications.findOne({
                    user_id: userId,
                    group_id: group._id
                });

                if (existingNotification) {
                    const exists = existingNotification.unread_message_ids.some(
                        (id) => id.toString() === message_id.toString()
                    );
                    if (!exists) {
                        existingNotification.unread_message_ids.push(message_id);
                        existingNotification.updated_at = new Date();
                        await existingNotification.save();
                    }
                } else {
                    await ChatNotifications.create({
                        user_id: userId,
                        group_id: group._id,
                        unread_message_ids: [message_id],
                        updated_at: new Date()
                    });
                }
            }
        }
        res.status(200).json({ message: "Notification updated for users" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};

export default addNotificationByMessage;
