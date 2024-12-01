import WebSocket, { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { validateToken } from './middleware/authSocket';
import { newConnectionHandler } from './socketHandlers/newConnectionHandler';

interface WebSocketMessage {
  url?: string;
  request?: Record<string, any>;
  broadcast?: boolean;
}

interface AuthenticatedRequest extends IncomingMessage {
  user?: any; // Define `user` type if possible
}

const connectedSockets: WebSocket[] = [];

export const registerSocketServer = (server: any) => {
  const socketServer = new WebSocketServer({ server });

  socketServer.on('connection', (socket: WebSocket, req: AuthenticatedRequest) => {
    connectedSockets.push(socket);

    // Verify client connection access_token
    const authResponse = validateToken(req);

    if (authResponse !== 'NOT_AUTHORIZED') {
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

  // try {
  //   switch (message?.url) {
  //     case 'get_user_details':
  //       if (message?.request?.user_id) {
  //         const response = await getUserDetails(message.request.user_id);
  //         messages.response = response;
  //       }
  //       break;

  //     case 'send_friend_request':
  //       if (message?.request?.email_to) {
  //         const response = await usersControllers.controllers.setFriendRequest(
  //           message.request,
  //           req
  //         );
  //         messages.response = response;
  //       }
  //       break;

  //     case 'add_channels':
  //       if (message?.request?.channel_name) {
  //         const payload = { body: message.request, user: req.user };
  //         const response = await ChannelController.controllers.AddChannelsController(payload, req);
  //         messages.response = response;
  //       }
  //       break;

  //     case 'get_channels':
  //       const getChannelsPayload = { ...message.request, user: req.user };
  //       const channelsResponse = await ChannelController.controllers.GetChannelsController(
  //         getChannelsPayload,
  //         req
  //       );
  //       messages.response = channelsResponse;
  //       break;

  //     case 'update_friend_request':
  //       const updatePayload = { ...message.request, user: req.user };
  //       const updateResponse = await usersControllers.controllers.setStoreFriendRequest(
  //         updatePayload,
  //         req
  //       );
  //       messages.response = updateResponse;
  //       break;

  //     case 'get_friend_request':
  //       const friendRequestPayload = { ...message.request, user: req.user };
  //       const friendRequestResponse = await usersControllers.controllers.getFriendRequestList(
  //         friendRequestPayload,
  //         req
  //       );
  //       messages.response = friendRequestResponse;
  //       break;

  //     case 'get_friend_accepted':
  //       const acceptedPayload = { ...message.request, user: req.user };
  //       const acceptedResponse = await usersControllers.controllers.getFriendListAccepted(
  //         acceptedPayload,
  //         req
  //       );
  //       messages.response = acceptedResponse;
  //       break;

  //     default:
  //       console.log('Unknown request type');
  //   }
  // } catch (error) {
  //   console.error('Error processing message:', error);
  // }

  // Clean up user details before sending the response
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