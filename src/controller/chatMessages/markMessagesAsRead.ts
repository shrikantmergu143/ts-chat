import { Response } from "express";
import { IRequestUserDetails } from "../../middleware/auth";
import ChatMessages from "../../modules/ChatMessages";
import mongoose from "mongoose";

const markMessagesAsRead = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    const { message_ids } = req.body;
    const userId = req?.user?.id;

    if (!Array.isArray(message_ids) || message_ids.length === 0) {
        return res.status(400).json({ error: "message_ids array is required" });
    }

    try {
        const objectIds = message_ids.map((id: string) => new mongoose.Types.ObjectId(id));

        // Fetch messages that match criteria
        const messages = await ChatMessages.find({
            _id: { $in: objectIds },
            sender_id: { $ne: userId }
        });

        const now = new Date();

        const operations = messages
            .filter((msg) => !msg.messages_status?.[userId]) // Only if status doesn't exist
            .map((msg) => ({
                updateOne: {
                    filter: { _id: msg._id },
                    update: {
                        $set: {
                            [`messages_status.${userId}`]: {
                                read_at: now,
                                delivery_at: now
                            }
                        }
                    }
                }
            }));

        if (operations.length > 0) {
            await ChatMessages.bulkWrite(operations);
        }

        return res.status(200).json({
            message: "Messages updated in bulk",
            updated_count: operations.length,
            skipped_count: message_ids.length - operations.length
        });
    } catch (err) {
        return res.status(500).json({ error: "Failed to update messages in bulk", details: err });
    }
};

export default markMessagesAsRead;
