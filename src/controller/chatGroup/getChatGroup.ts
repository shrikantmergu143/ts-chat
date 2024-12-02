import { Response, Request } from "express";
import ChatGroupSchema from "../../modules/ChatGroups";
import GroupMember from "../../modules/GroupMember";
import { IRequestUserDetails } from "../../middleware/auth";
import { getChatGroupItemPayload, getChatMemberPayload } from "../../common/userPayload";


// Create a new group or direct chat
const getChatGroup = async (req: IRequestUserDetails, res: Response): Promise<any> => {
  // try {
  const userEmail = req?.user?.email;
  if (!userEmail) {
    return res.status(400).json({ error: "User email not provided." });
  }
  const pages = req.query.page || req.body.page;
  const Limit = req.query.limit || req.body.limit;
  const page = parseInt(pages) || 1;
  const group_type = req.query.group_type || req.body.group_type;
  const limit = parseInt(Limit) || 4;
  const search = req.query.search || req.body.search;
  const skip = (page - 1) * limit;
  const groupChatList = await ChatGroupSchema.find({
    users: { $in: userEmail },
    // group_type: { $in: group_type },
    // $text: { $search: search },
  }).skip(skip).limit(limit);

  if (!groupChatList || groupChatList.length === 0) {
    return res.status(404).json({ error: "No friend requests found." });
  }
  const totalRecords = await ChatGroupSchema.countDocuments({
    users: { $in: userEmail }
  });
  const getPayloadChatGroup = groupChatList?.map((item) => getChatGroupItemPayload(item))
  res.status(200).json({
    data: {
      data: getPayloadChatGroup,
      pages,
      limit: limit,
      totalRecords: totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
  })
  // } catch (err) {
  //   res.status(500).json({ error: 'Failed to create chat', err });
  // }
}
export default getChatGroup;
