import { Socket } from 'dgram';
import { Request } from 'express';
interface IRequestBody {
    [key: string]: string | undefined; // Index signature for ParsedQs compatibility
    access_token?: string;
}
interface DecodedToken {
    userId: string; // Replace this with the actual fields from your JWT
    user_id: string; // Replace this with the actual fields from your JWT
    user: any;
    [key: string]: any; // Optional, to allow additional properties
    iat: number; // Issued at timestamp
    exp: number; // Expiry timestamp  
}
interface IRequest extends Request {
    user: DecodedToken; // `user` could be null if not authenticated
    body: IRequestBody;
    query: IRequestBody;
    header: any;
}
interface IWebSocketRequest  {
    user: {
        user_id: string;
        user?: any;
        handshake?: any;
    };
    handshake?: any;
    user_id: string;
    userId: string; // Replace this with the actual fields from your JWT
}

interface CustomSocket extends Socket {
    user?: any;
    handshake?: any;
    user_id: string;
}
interface INewConnectionReq {
    user_id:string
}
interface IRequestSignInBody{
    email: string;
    password: string;
}
interface IRequestSignUpBody{
    email: string;
    password: string;
    username: string;
    last_name: string;
    first_name: string;
}

type IRequestSignUp = Request<{}, {}, IRequestSignUpBody>;
type IRequestSignIn = Request<{}, {}, IRequestSignInBody>;

export type {  IRequestSignUp, IRequestSignInBody, IRequestSignUpBody, IRequestSignIn, IRequest, IWebSocketRequest, DecodedToken, IRequestBody, CustomSocket, INewConnectionReq }