import WebSocket, { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { validateToken, verifyTokenSocket } from './middleware/authSocket';
import { newConnectionHandler } from './socketHandlers/newConnectionHandler';

interface WebSocketMessage {
  url?: string;
  request?: Record<string, any>;
  broadcast?: boolean;
}

interface AuthenticatedRequest extends IncomingMessage {
  user?: any; // Define `user` type if possible
}
interface CustomSocket extends WebSocket {
    handshake?: any;
    user?: any;
}

const connectedSockets: CustomSocket[] = [];

export const registerSocketServer = (server: any) => {
  const socketServer = new WebSocketServer({ server });

  socketServer.on('connection', (socket: CustomSocket | any, req: AuthenticatedRequest) => {

    // Verify client connection access_token
    const authResponse = validateToken(socket, req);
    if (authResponse !== 'NOT_AUTHORIZED') {
      connectedSockets.push(socket);
      newConnectionHandler(req.user);
      socket.send(JSON.stringify({ userDetails: req.user, messages: 'WebSocket connected successfully' }));
    } else {
      socket.send(JSON.stringify({ messages: 'UnAuthorized' }));
      socket.close();
    }
    socket.on('message', async (data: WebSocket.Data) => {
      try {
        const parsedMessage: WebSocketMessage = JSON.parse(data.toString());
        await handleChatMessage(parsedMessage, req, socket);
      } catch (error) {
        console.error('Failed to handle message:', error);
      }
    });
    socket.on('close', () => {
      const index = connectedSockets.indexOf(socket);
      if (index !== -1) {
        connectedSockets.splice(index, 1);
      }
    });
  });
};

async function handleChatMessage(
  message: WebSocketMessage,
  req: AuthenticatedRequest,
  socketSent: WebSocket
) {
  const messages: Record<string, any> = {
    ...message,
  };

  if (req?.user) {
    messages.request = messages.request || {};
    messages.request.user = req.user;
  }

  if (messages.request?.user) {
    delete messages.request.user;
  }
  if (message?.broadcast) {
    connectedSockets.forEach((socket) => {
      socket.send(JSON.stringify(messages));
    });
  } else {
    socketSent.send(JSON.stringify(messages));
  }
}