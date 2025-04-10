import { Response, Request } from "express";
import { IRequestUserDetails } from "../../middleware/auth";
import ChatMessages, { IGroupMemberSchema } from "../../modules/ChatMessages";

const deleteChatMessage = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    const request = req.body;
    if(req?.params?.message_id){
        request.id = req?.params?.message_id;
    }
    try {
        const messageData:IGroupMemberSchema|any = await ChatMessages.findById(request?.id);
        if(!messageData?._id || messageData?.sender_id !== req?.user?.id){
            return res.status(400).json({ error: "Message not found", msg: "Message not found" });
        }
        await ChatMessages?.deleteOne?.(request.id);
        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to create chat", err });
    }
};
export default deleteChatMessage;