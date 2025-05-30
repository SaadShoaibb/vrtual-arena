// utils/pusher.js
import Pusher from 'pusher-js';

export const getPusherInstance = () => {
  return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    forceTLS: true,
  });
};
