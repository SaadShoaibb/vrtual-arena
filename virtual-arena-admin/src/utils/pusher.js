// utils/pusher.js
import Pusher from 'pusher-js';

let pusherInstance = null;

const getPusherInstance = () => {
  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
    });
  }
  return pusherInstance;
};

const cleanupPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};

export { getPusherInstance, cleanupPusher };
