// POST /chat/notifications/add
import { Request, Response } from "express";
import ChatNotifications from "../../modules/ChatNotifications";
import { IRequestUserDetails } from "../../middleware/auth";

const getNotificationByMessage = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    try {
        const user_id = req?.user?.id;

        const notifications = await ChatNotifications.find({ user_id });
        const response = notifications.map(n => ({
            group_id: n?.group_id,
            count: n?.unread_message_ids.length,
        }));
        res.status(200).json({ data: response });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notifications", err });
    }
};

export default getNotificationByMessage;
