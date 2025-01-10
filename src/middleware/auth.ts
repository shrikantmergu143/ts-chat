import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '../common';
import dotenv from "dotenv";
dotenv.config();

const { TOKEN_KEY } = process.env;
interface IRequestPayload{
  email?: string;
  password?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  access_token?: string;
  user_id?:string;
  iat?:number;
  exp?:number;
  [key: string]: any;
  name: string;
  group_type: string | "direct" | "group";
  users: string[];
  page?: number | string;
  limit?: number;
  message?:string;
  media_url?:string;
  group_id?:string;
  message_type?:string;
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
}
export interface IRequestUserDetails extends Request {
  body: IRequestPayload | any;
  query: IRequestPayload | any;
  user?: DecodedToken | any;
}

const verifyToken = (req: IRequestUserDetails, res: Response, next: NextFunction): any => {
  let access_token = req.body.access_token as string || req.query.access_token as string || req.header('authorization');
  
  if (!access_token) {
    return res.status(403).json({ error: 'An access_token is required for authentication' });
  }

  try {
    access_token = access_token.replace(/^Bearer\s+/, ''); // Remove "Bearer " prefix if it exists
    if (!TOKEN_KEY) {
      return res.status(500).json({ error: 'No TOKEN_KEY provided in the environment variables', TOKEN_KEY:TOKEN_KEY });
    }

    const decoded = jwt.verify(access_token, TOKEN_KEY) as DecodedToken;
    req.user = decoded;
  } catch (err) {
    return res.status(500).json({ error: 'Invalid access_token', err });
  }

  return next();
};

export default verifyToken;
