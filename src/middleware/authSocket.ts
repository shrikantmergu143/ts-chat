import jwt from 'jsonwebtoken';
import { CustomSocket } from '../common';

const { TOKEN_KEY } = process.env;

const verifyTokenSocket = (socket: CustomSocket, req: any) => {
  const url = req?.url; // e.g., /ws/<JWT_TOKEN>
  const access_token = url?.split?.('/ws/')?.[1]?.replaceAll?.("/", "");  
  try {
    const decoded = jwt.verify(access_token, TOKEN_KEY as string);
    socket.user = decoded;
    return "";
  } catch (err) {
    const socketError = "NOT_AUTHORIZED";
    return socketError;
  }
};
const validateToken = (socket: any, req: any): string | null => {
  const access_token = req?.url?.split("/")[2];
  if (!access_token) {
      console.error("No token found in the URL.");
      return "NOT_AUTHORIZED";
  }

  try {
      const decoded = jwt.verify(access_token, process.env.TOKEN_KEY as string);
      req.user = decoded;
      return null; // Return null if validation is successful
  } catch (err) {
      return "NOT_AUTHORIZED";
  }
};


export { verifyTokenSocket, validateToken };
