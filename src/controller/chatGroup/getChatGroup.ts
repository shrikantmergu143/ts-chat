import { Response, Request } from "express";
import ChatGroupSchema, { IInvite } from "../../modules/ChatGroups";
import { IRequestUserDetails } from "../../middleware/auth";
import { getChatGroupItemPayload } from "../../common/userPayload";
import { getEmailUsers } from "../../common/utils";
import UserModule from "../../modules/UserModule";

const getChatGroup = async (req: IRequestUserDetails, res: Response): Promise<any> => {
  try {
    const groupType = req.query.group_type || req.body.group_type;
    const userEmail = groupType ? groupType === "group" ? [req?.user?.id] : [req?.user?.email] : [req?.user?.id, req?.user?.email];
    if (!userEmail) {
      return res.status(400).json({ error: "User email not provided." });
    }
    const page = parseInt(req.query.page || req.body.page || "1", 10);
    const limit = parseInt(req.query.limit || req.body.limit || "4", 10);
    const search = req.query.search || req.body.search;
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number." });
    }
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: "Invalid limit number." });
    }
    const skip = (page - 1) * limit;
    const filter: any = {
      users: { $in: userEmail },
    };

    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (groupType) {
      filter.group_type = groupType; // Filter for a specific group type
    } else {
      filter.group_type = ["group", "direct"];
    }

    // Fetch chat groups
    const groupChatList = await ChatGroupSchema.find(filter).skip(skip).limit(limit);

    if (!groupChatList || groupChatList.length === 0) {
      return res.status(400).json({ error: "No chat groups found." });
    }

    const totalRecords = await ChatGroupSchema.countDocuments({
      users: { $in: [userEmail] },
      group_type: groupType,
      ...(search && { $text: { $search: search.trim() } }),
    });

    const usersDetails: (string | null)[] = [];
    const payload = groupChatList?.map?.((item) => {
      const payloadItem = getChatGroupItemPayload(item);
      if (payloadItem?.users && payloadItem?.group_type == "direct") {
        const directEmail = getEmailUsers(req?.user, payloadItem?.users);
        payloadItem.invite_users = payloadItem?.invites?.find?.((item:IInvite)=>item?.user_id == directEmail || item?.email == directEmail)
        if (directEmail) {
          usersDetails?.push(directEmail);
          payloadItem.user_ids = directEmail;
          payloadItem.name = directEmail;
        }
      }
      payloadItem.user_status = payloadItem?.invites?.find?.((item:IInvite)=>item?.user_id == req?.user?.id || item?.email == req?.user?.email);
      return {
        ...payloadItem,
      }
    });

    const emailIds = usersDetails?.filter((item)=>item?.includes("@"));
    const usersIds = usersDetails?.filter((item)=>!item?.includes("@"));
    if (emailIds?.length > 0 || usersIds?.length > 0) {
      const userDetails = await UserModule.find({
        $or: [
          { email: { $in: emailIds } },
          { _id: { $in: usersIds } }
        ]
      });
      payload.forEach((item) => {
        if (item.user_ids) {
          const user = userDetails?.find?.((user) =>
            user.email == item.user_ids || user._id.toString() == item.user_ids
          );
          if (user) {
            item.name = `${user?.first_name} ${user?.last_name}`
            item.userDetails = user;
          }
        }
      });
    }

    res.status(200).json({
      data: {
        data: payload,
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    });
  } catch (err: any) {
    console.error(err);  // Log the error for debugging purposes
    res.status(500).json({ error: "Failed to fetch chat groups", details: err.message });
  }
};

export default getChatGroup;
