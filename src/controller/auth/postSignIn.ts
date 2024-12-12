import { Request, Response } from "express"; // Ensure correct types are imported
import { IRequestSignIn } from "../../common";
import { getUserPayload } from "../../common/userPayload";
import UserModule from "../../modules/UserModule";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const postSignIn = async (req: IRequestSignIn, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // check if user exits
        const user = await UserModule.findOne({ email: email.toLowerCase(), });
        //   console.log("user", user);
        if (user && (await bcrypt.compare(password, user.password))) {
            //create JWT access_token
            const access_token = jwt.sign({
                user_id: user._id,
                _id: user._id,
                id: user._id,
                email: email,
                is_admin: user?.is_admin,
                user_type: user?.user_type,
            },
                process.env.TOKEN_KEY as string, {
                expiresIn: "365d"
            });
            const payload = getUserPayload(user);
            return res.status(200).json({
                data: {
                    ...payload,
                    access_token: access_token,
                }
            });
        }

        return res.status(400).json({ error: "Invalid credentials, Please try again" });

    } catch (err) {
        return res.status(500).json({ error: "Error occurred, Please try again" });
    }
}
export default postSignIn;