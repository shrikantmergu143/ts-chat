import { Response } from "express";
import { IRequestSignUp } from "../../common";
import UserModule from "../../modules/UserModule";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const postSignUp = async (req: IRequestSignUp, res: Response): Promise<any> => {
    try {
        const { username, email, password, first_name, last_name } = req.body;

        const userExists = await UserModule.exists({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ error: "Email already exists!" });
        }

        const encryptPassword = await bcrypt.hash(password, 10);
        const user = await UserModule.create({
            username,
            email: email.toLowerCase(),
            password: encryptPassword,
            last_name,
            first_name,
        });

        const access_token = jwt.sign(
            {
                user_id: user._id,
                email: email,
                is_admin: user?.is_admin,
                user_type: user?.user_type,
            },
            process.env.TOKEN_KEY as string,
            {
                expiresIn: "365d",
            }
        );

        return res.status(200).json({
            data: {
                email: user.email,
                access_token: access_token,
                username: user.username,
            },
        });
    } catch (err) {
        return res.status(500).json({
            error: "Error occurred, Please try again",
            err: err,
        });
    }
};

export default postSignUp;
