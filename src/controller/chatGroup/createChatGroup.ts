import express, { Response, Request } from "express";
import { DecodedToken } from "../../common";
import ChatGroupSchema from "../../modules/ChatGroups";
import GroupMember from "../../modules/GroupMember";

export interface IRequestUserDetails extends Request {
    body: {
        name: string;
        group_type: string;
        users: string[];
    };
    user: DecodedToken; // Assuming `DecodedToken` is your custom type
  }
// Create a new group or direct chat
const createChatGroup = async (req:IRequestUserDetails, res: Response): Promise<any> => {
  const { name, group_type, users } = req.body;  // name, group_type, users (array of user ids)

  try {
    // Create the chat group (can be direct or group)
    const chatGroup = new ChatGroupSchema({
      name: group_type === 'direct' ? `${users[0]},${users[1]}` : name,
      group_type,
      created_by: req.user.user_id,
    });

    await chatGroup.save();

    // Add users to the group
    for (const userId of users) {
      const groupMember = new GroupMember({
        group_id: chatGroup._id,
        user_id: userId,
      });
      await groupMember.save();
    }

    res.status(200).json({ message: 'Chat created successfully', chatGroup });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat', err });
  }
}
export default createChatGroup;
