import { io } from 'socket.io-client';

export function makeSocket(userId) {
  return io('/', { auth: { userId } });
}
