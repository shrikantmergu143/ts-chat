import { Response } from "express";
import { IRequestUserDetails } from "../../middleware/auth";
import ChatMessages from "../../modules/ChatMessages";

const getChatMessages = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    try {
        const page = parseInt(req.query.page || req.body.page || "1", 10);
        const limit = parseInt(req.query.limit || req.body.limit || "4", 10);
        const search = req.query.search || req.body.search;
        const updated_at = req.query.updated_at || req.body.updated_at;

        const request = {
            group_id: req?.params?.group_id,
            page: page,
            limit: limit,
            search: search,
            updated_at: updated_at
        }
        let updatedAtQuery = {};

        if (updated_at) {
            const parsedDateTime: any = new Date(updated_at);
            if (isNaN(parsedDateTime) || parsedDateTime == "Invalid Date") {
                return res.status(400).json({ error: 'Invalid date and time format for updated_at' });
            }
            updatedAtQuery = { updated_at: { $lt: parsedDateTime } };
        }
        const messages = await ChatMessages.find({
            group_id: request?.group_id,
            ...updatedAtQuery
        })
        .sort({ updated_at: -1 })
        .limit(request?.limit);

        if (!messages || messages.length === 0) {
            return res.status(400).json({ message: 'No messages found for the given friend_id' });
        }
        const totalMessageCount = await ChatMessages.countDocuments({ group_id: request?.group_id });
        const SortMessage = messages.reverse();
        res.status(200).json({ data: { data: SortMessage, totalCount: totalMessageCount }, message: "Message sent successfully", });
    } catch (err) {
        res.status(500).json({ error: "Failed to get messages", err });
    }
};
export default getChatMessages;