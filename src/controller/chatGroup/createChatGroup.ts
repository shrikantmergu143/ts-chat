import { Response, Request } from "express";
import ChatGroupSchema from "../../modules/ChatGroups";
import GroupMember from "../../modules/GroupMember";
import { IRequestUserDetails } from "../../middleware/auth";
import { getChatMemberPayload } from "../../common/userPayload";


const createChatGroup = async (req:IRequestUserDetails, res: Response): Promise<any> => {
  const { name, group_type, users, mode = "private" } = req.body;  // name, group_type, users (array of user ids)
  const normalizedUsers = users?.filter((item:string)=>item != req?.user?.id)?.map((email:string) => email.toLowerCase().trim()).sort();
  if (new Set(normalizedUsers).size !== normalizedUsers.length) {
      return res.status(400).json({ error: "Users array contains duplicate email addresses." });
  }
  try {
    if(group_type === 'direct'){
      const existsGroup = await ChatGroupSchema.findOne({
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
        created_by: req?.user?.id,
        users: normalizedUsers,
        mode:mode,
        invites: normalizedUsers.map((item:string) => ({
          email: item,
          user_id: item == req?.user?.email? req?.user?.id:null,
          status: item == req?.user?.email ?"accepted" :'pending',
          sent_at: new Date(),
        })),
      });
  
      await chatGroup.save();
      res.status(200).json({ message: 'Chat created successfully', data: getChatMemberPayload(chatGroup) });
    }else{
      if(normalizedUsers?.length >0){
        const usersList = [...normalizedUsers, req?.user?.id]
        const chatGroup = new ChatGroupSchema({
          name: name,
          group_type,
          created_by: req?.user?.id,
          users: usersList,
          mode:mode,
          invites: normalizedUsers.map((item:string) => ({
            user_id:item,
            email:item == req?.user?.id ? req?.user?.email :item,
            status: item == req?.user?.id ?"accepted" :'pending',
            sent_at: new Date(),
          })),
        });
        await chatGroup.save();
        // Add users to the group
        for (const userId of usersList) {
          const groupMember = new GroupMember({
            group_id: chatGroup._id,
            user_id: userId,
          });
          await groupMember.save();
        }
  
        res.status(200).json({ message: 'Chat created successfully', data:chatGroup });
      }else{
        res.status(400).json({ message: 'Please select users' });
      }
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat', err });
  }
}
export default createChatGroup;
