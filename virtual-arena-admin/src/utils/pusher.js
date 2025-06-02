// utils/pusher.js
import Pusher from 'pusher-js';

const getPusherInstance = () => {
  return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    forceTLS: true,
  });
};

export default getPusherInstance; // for: import pusher from '@/utils/pusher'
export { getPusherInstance };     // for: import { getPusherInstance } from '@/utils/pusher'
