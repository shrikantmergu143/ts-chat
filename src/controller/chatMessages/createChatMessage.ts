import { Response, Request } from "express";
import { IRequestUserDetails } from "../../middleware/auth";
import ChatGroupSchema from "../../modules/ChatGroups";
import ChatMessages from "../../modules/ChatMessages";

const createChatMessage = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    const request = req.body;
    if(req?.params?.message_id){
        request.id = req?.params?.message_id;
    }
    try {
        const payload: any = {
            group_id: request?.group_id || "",
            sender_id: req?.user?.id,
            message: request?.message || "",
            message_type: request?.message_type || "text",
            media_url: request?.media_url || "",
            readBy: [{ user_id: req?.user?.id, readAt: Date.now() }],
            deliveryBy: [{ user_id: req?.user?.id, readAt: Date.now() }],
        };
        if (request?.reply_id) {
            payload.reply_id = request.reply_id; // Only include reply_id if provided
        }
        if(request?.id){
            const messageData:any = await ChatMessages.findById(request?.id);
            if(!messageData?._id || messageData?.sender_id !== req?.user?.id){
                return res.status(400).json({ error: "Message not found", msg: "Message not found" });
            }
            await ChatMessages.findByIdAndUpdate(request.id, payload, { new: true });
            const updatedMessage = await ChatMessages.findById(request.id);
            return res.status(200).json({ message: "Message updated successfully", data: updatedMessage });
        }else{
            const groupDetails = await ChatGroupSchema.findById(payload.group_id);
            if (!groupDetails) {
                return res.status(400).json({ error: "Chat Group not found", msg: "Chat Group not found" });
            }
            const messages = new ChatMessages(payload);
            await messages.save();
            res.status(200).json({ message: "Message sent successfully", data: messages });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to create chat", err });
    }
};
export default createChatMessage;