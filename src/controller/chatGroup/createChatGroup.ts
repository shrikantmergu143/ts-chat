import { Response, Request } from "express";
import ChatGroupSchema from "../../modules/ChatGroups";
import GroupMember from "../../modules/GroupMember";
import { IRequestUserDetails } from "../../middleware/auth";
import { getChatMemberPayload } from "../../common/userPayload";


// Create a new group or direct chat
const createChatGroup = async (req:IRequestUserDetails, res: Response): Promise<any> => {
  const { name, group_type, users } = req.body;  // name, group_type, users (array of user ids)
 // Normalize and check for duplicates
  const normalizedUsers = users.map((email:string) => email.toLowerCase().trim()).sort();
  if (new Set(normalizedUsers).size !== normalizedUsers.length) {
      return res.status(400).json({ error: "Users array contains duplicate email addresses." });
  }
  try {
    if(group_type === 'direct'){
      const existsGroup = await  ChatGroupSchema.findOne({
        group_type:"direct",
        users: normalizedUsers,
      })
      if(existsGroup){
        return res.status(400).json({
          error: "A chat group with these users already exists.",
        });
      }
      const chatGroup = new ChatGroupSchema({
        name: `${normalizedUsers[0]},${normalizedUsers[1]}`,
        group_type,
        created_by: req.user.user_id,
        users: normalizedUsers
      });
  
      await chatGroup.save();
      res.status(200).json({ message: 'Chat created successfully', data: getChatMemberPayload(chatGroup) });
    }else{
      const chatGroup = new ChatGroupSchema({
        name: name,
        group_type,
        created_by: req.user.user_id,
        users: normalizedUsers
      });
      // Add users to the group
      for (const userId of users) {
        const groupMember = new GroupMember({
          group_id: chatGroup._id,
          user_id: userId,
        });
        await groupMember.save();
      }

      res.status(200).json({ message: 'Chat created successfully', chatGroup });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat', err });
  }
}
export default createChatGroup;
