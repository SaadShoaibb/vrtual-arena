import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51R1sVDPhzbqEOoSjq3Oyx0YSzQmwzsUaW2wsa3WLzv6ECsNv10SL0ymASJIES5yAi4k6lexmPFd1B3yPeaTxqHY500mRSfYdQq', {
      apiVersion: '2023-10-16',
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Return the session data
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve checkout session' },
      { status: 500 }
    );
  }
}