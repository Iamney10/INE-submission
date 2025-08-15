import { Server } from 'socket.io';
import { redis, roomKey, userRoom } from './redis.js';

export function initSocket(httpServer, corsOrigin) {
  const io = new Server(httpServer, { cors: { origin: corsOrigin, credentials: true } });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (userId) socket.join(userRoom(userId));

    socket.on('join-auction', (auctionId) => {
      socket.join(roomKey(auctionId));
    });

    socket.on('leave-auction', (auctionId) => {
      socket.leave(roomKey(auctionId));
    });
  });

  // helpers
  const emitAuction = (auctionId, event, payload) =>
    io.to(roomKey(auctionId)).emit(event, payload);
  const emitUser = (userId, event, payload) =>
    io.to(userRoom(userId)).emit(event, payload);

  return { io, emitAuction, emitUser };
}
