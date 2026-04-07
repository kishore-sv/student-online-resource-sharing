import Pusher from "pusher-js";

// Ensure Pusher is only initialized on the client side
export const pusherClient = typeof window !== "undefined" 
  ? new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    )
  : null;
