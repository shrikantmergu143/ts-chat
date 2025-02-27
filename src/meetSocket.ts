import WebSocket, { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { validateToken, verifyTokenSocket } from './middleware/authSocket';
import { newConnectionHandler } from './socketHandlers/newConnectionHandler';

interface WebSocketMessage {
  url?: string;
  request?: Record<string, any>;
  broadcast?: boolean;
  type?: string;
  data?: Record<string, any>;
}

interface AuthenticatedRequest extends IncomingMessage {
  user?: any; // Define `user` type if possible
}
interface CustomSocket extends WebSocket {
    handshake?: any;
    user?: any;
    id?: any;
}

const connectedSockets: Map<string, CustomSocket> = new Map();

export const registerSocketServer = (server: any) => {
  const socketServer = new WebSocketServer({ server });

  socketServer.on('connection', (socket: CustomSocket | any, req: AuthenticatedRequest) => {

    // Verify client connection access_token
    const authResponse = validateToken(socket, req);
    if (authResponse !== 'NOT_AUTHORIZED') {
      socket.user = req.user;
      socket.id = socket.user.email; // Use email as unique identifier
      connectedSockets.set(socket.id, socket);
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
      console.log(`User disconnected: ${socket.id}`);
      connectedSockets.delete(socket.id);
    });
  });
};

async function handleChatMessage(
  message: WebSocketMessage,
  req: AuthenticatedRequest,
  socketSent: WebSocket
) {
  const { type, request } = message;
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

  switch (type) {
    case 'room:join':
      handleRoomJoin(request, socketSent,);
      break;
    case 'user:call':
      handleUserCall(request, socketSent,);
      break;
    case 'call:accepted':
      handleCallAccepted(request, socketSent,);
      break;
    case 'peer:nego:needed':
      handlePeerNegotiationNeeded(request, socketSent,);
      break;
    case 'peer:nego:done':
      handlePeerNegotiationDone(request, socketSent,);
      break;
    default:
      console.error('Unknown message type:', type);
  }
  if (message?.broadcast) {
    connectedSockets.forEach((socket) => {
      socket.send(JSON.stringify(messages));
    });
  } else {
    socketSent.send(JSON.stringify(messages));
  }
}
// Handle room join
function handleRoomJoin({ email, room }: any, socket: CustomSocket) {
  // Notify all users in the room
  broadcastToRoom(room, {
    type: 'user:joined',
    request: { email, id: socket.id },
  });

  // Send confirmation to user
  socket.send(JSON.stringify({ type: 'room:join', request: { email, room } }));
}

// Handle outgoing call
function handleUserCall({ to, offer }: any, socket: CustomSocket) {
  sendMessageToUser(to, {
    type: 'incoming:call',
    request: { from: socket.id, offer },
  });
}

// Handle call acceptance
function handleCallAccepted({ to, ans }: any, socket: CustomSocket) {
  sendMessageToUser(to, {
    type: 'call:accepted',
    request: { from: socket.id, ans },
  });
}

// Handle negotiation needed
function handlePeerNegotiationNeeded({ to, offer }: any, socket: CustomSocket) {
  if (!offer || !offer.type || !offer.sdp) {
    console.error("Invalid SDP offer:", offer);
    return;
  }

  sendMessageToUser(to, {
    type: 'peer:nego:needed',
    request: { from: socket.id, offer },
  });
}

// Handle final negotiation
function handlePeerNegotiationDone({ to, ans }: any, socket: CustomSocket) {
  if (!ans || !ans.type || !ans.sdp) {
    console.error("Invalid SDP answer:", ans);
    return;
  }

  sendMessageToUser(to, {
    type: 'peer:nego:final',
    request: { from: socket.id, ans },
  });
}

// Helper function to send a message to a specific user
function sendMessageToUser(userId: string, message: WebSocketMessage) {
  const userSocket = connectedSockets.get(userId);
  if (userSocket) {
    userSocket.send(JSON.stringify(message));
  }
}

// Helper function to broadcast to a room
function broadcastToRoom(room: string, message: WebSocketMessage) {
  connectedSockets.forEach((socket) => {
    socket.send(JSON.stringify(message));
  });
}