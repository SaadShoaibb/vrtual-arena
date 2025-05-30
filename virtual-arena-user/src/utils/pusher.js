import Pusher from 'pusher-js';

const pusher = new Pusher('a230b3384874418b8baa', {
  cluster: 'ap2',
  forceTLS: true
});

export default pusher;