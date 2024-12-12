import { Response, Request } from "express";
import ChatGroupSchema from "../../modules/ChatGroups";
import { IRequestUserDetails } from "../../middleware/auth";
import { getChatGroupItemPayload, getGroupMembersItem, getUserPayload } from "../../common/userPayload";
import UserModule from "../../modules/UserModule";
import GroupMember from "../../modules/GroupMember";

const getGroupDetails = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    try {
        const group_id = req?.params?.group_id;
        const groupDetails = await ChatGroupSchema.findById(group_id);
        const payload:any = groupDetails;
        if(groupDetails?.group_type == "group"){
            let userData = await UserModule.find({
                '_id': { 
                  $in: groupDetails?.users
                }
            });
            let groupMember = await GroupMember.find({
                'group_id': groupDetails?.id,
            });
            payload.members_details = userData?.map((item)=>getUserPayload(item))
            payload.group_member = groupMember?.map((item)=>getGroupMembersItem(item));
        }
        res.status(200).json({ message: 'Group fetched successfully', data: getChatGroupItemPayload(payload) });
    } catch (err: any) {
        res.status(500).json({ error: "Failed to fetch groups details", details: err.message });
    }
};

export default getGroupDetails;