// POST /chat/notifications/add
import { Request, Response } from "express";
import ChatNotifications from "../../modules/ChatNotifications";
import { IRequestUserDetails } from "../../middleware/auth";

const readNotificationByMessage = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    try {
        const { group_id } = req?.params;
        await ChatNotifications.findOneAndUpdate(
            { user_id: req?.user?.id, group_id },
            { $set: { unread_message_ids: [], updated_at: new Date() } }
        );
        res.status(200).json({ message: "Unread messages cleared" });
    } catch (err) {
        res.status(400).json({ error: "Failed to update notification", err });
    }
};

export default readNotificationByMessage;
