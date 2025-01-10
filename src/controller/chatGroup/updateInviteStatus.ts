import { Response, Request } from "express";
import { IRequestUserDetails } from "../../middleware/auth";
import ChatGroupSchema, { IChatGroups, IInvite } from "../../modules/ChatGroups";

const updateInviteStatus = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    const { group_id, user_id, status, email } = req.body; // `status` can be 'accepted' or 'rejected'
    try{
        const chatGroupFind:IChatGroups|any = await ChatGroupSchema.findById(group_id);
        if(!chatGroupFind){
            return res.status(400).json({error: "Group not found",});
        }
         // Find the invite for the user and update the status
        const invite = chatGroupFind?.invites?.find?.((invite:IInvite) => (invite?.email === email && email) || (invite.user_id && invite.user_id.toString() === user_id.toString()));
        if (!invite) {
            return res.status(400).json({ error: "User not invited.", chatGroupFind:chatGroupFind });
        }
        if(chatGroupFind?.group_type === "direct"){
            chatGroupFind.users = [chatGroupFind.created_by, user_id];
        }
        if(chatGroupFind?.group_type === "direct" && !invite?.user_id){
            invite.user_id = user_id
        }
        if(chatGroupFind?.group_type === "group_id" && !invite?.email){
            invite.email = email
        }
        invite.status = status;
        invite.responded_at = new Date();
        
        await chatGroupFind.save();
        res.status(200).json({ message: 'Invite status updated successfully', data: chatGroupFind });

    } catch (err) {
        res.status(500).json({ error: 'Failed to update invite status', err });
    }
}

export default updateInviteStatus;