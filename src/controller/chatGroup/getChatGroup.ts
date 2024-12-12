import { Response, Request } from "express";
import ChatGroupSchema from "../../modules/ChatGroups";
import { IRequestUserDetails } from "../../middleware/auth";
import { getChatGroupItemPayload } from "../../common/userPayload";

const getChatGroup = async (req: IRequestUserDetails, res: Response): Promise<any> => {
  try {
    const groupType = req.query.group_type || req.body.group_type;
    const userEmail = groupType === "group"? req?.user?.user_id :req?.user?.email;
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
      users: { $in: [userEmail] },
    };

    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (groupType) {
      filter.group_type = groupType;  // Direct comparison, not using $in
    }

    // Fetch chat groups
    const groupChatList = await ChatGroupSchema.find(filter).skip(skip).limit(limit);

    if (!groupChatList || groupChatList.length === 0) {
      return res.status(400).json({ error: "No chat groups found." });
    }

    const totalRecords = await ChatGroupSchema.countDocuments({
      users: { $in: [userEmail] },
    });

    const payload = groupChatList.map((item) => getChatGroupItemPayload(item));

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
