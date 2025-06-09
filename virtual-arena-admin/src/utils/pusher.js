// utils/pusher.js
import Pusher from 'pusher-js';

let pusherInstance = null;

const getPusherInstance = () => {
  if (!pusherInstance && typeof window !== 'undefined') {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || 'a230b3384874418b8baa';
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2';
    
    try {
      pusherInstance = new Pusher(pusherKey, {
        cluster: pusherCluster,
        forceTLS: true,
      });
    } catch (error) {
      console.error('Error initializing Pusher:', error);
      return null;
    }
  }
  return pusherInstance;
};

const cleanupPusher = () => {
  if (pusherInstance) {
    try {
      pusherInstance.disconnect();
    } catch (error) {
      console.error('Error disconnecting Pusher:', error);
    } finally {
      pusherInstance = null;
    }
  }
};

export { getPusherInstance, cleanupPusher };
