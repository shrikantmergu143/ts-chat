import { Response } from "express";
import { IRequestUserDetails } from "../../middleware/auth";
import UserModule from "../../modules/UserModule";
import { getUserPayload } from "../../common/userPayload";


const getUserDetails = async (req: IRequestUserDetails, res: Response): Promise<any> => {
    const response = await getUsersDetails({user_id: req.user?.user_id as string});
    return res.status(response?.status).json(response?.data);
}


const getUsersDetails = async (req: {user_id:string}): Promise<any> => {
    try {
        const userResponse = await UserModule.findById(req?.user_id);
        const payload = getUserPayload(userResponse);
        return ({
            data:{
                data:payload,
            },
            status: 200,
        });
    } catch (err) {
        return ({
            data:{
                error: "Error occurred, Please try again",
                err: err,
            },
            status: 200,
        });
    }
};

export default getUserDetails;
