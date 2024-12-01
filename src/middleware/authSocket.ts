import { Socket } from 'dgram';
import jwt from 'jsonwebtoken';
import { CustomSocket } from '../common';

const { TOKEN_KEY } = process.env;

const verifyTokenSocket = (socket: CustomSocket, next: Function) => {
  const access_token = socket?.handshake?.auth?.access_token;
  
  try {
    // Decode the JWT access_token
    const decoded = jwt.verify(access_token, TOKEN_KEY as string);
    socket.user = decoded; // Attach decoded user info to the socket
    next(); // Continue with the connection
  } catch (err) {
    const socketError = new Error("NOT_AUTHORIZED");
    return next(socketError); // Reject the connection with an error
  }
};

const validateToken = (req: any) => {
  const access_token = req?.url?.split("/")[2];
  try {
    // Decode the JWT access_token
    const decoded = jwt.verify(access_token, TOKEN_KEY as string);
    req.user = decoded; // Attach decoded user info to the request
  } catch (err) {
    const socketError = "NOT_AUTHORIZED";
    return socketError; // Return error if the access_token is invalid
  }
};

export { verifyTokenSocket, validateToken };
