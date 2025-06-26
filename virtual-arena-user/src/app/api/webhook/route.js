import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

/**
 * This API route handles Stripe webhook events
 * It verifies the webhook signature and processes different event types
 * Particularly important for handling checkout.session.completed events
 */
export async function POST(request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('Missing signature or webhook secret');
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia',
    });
    
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      // Add more event handlers as needed
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout.session.completed event
 * This is triggered when a customer completes the checkout process
 */
async function handleCheckoutSessionCompleted(session) {
  try {
    console.log('Processing checkout.session.completed:', session.id);
    
    // Extract metadata from the session
    const { user_id, entity_id, entity_type } = session.metadata || {};
    
    if (!user_id || !entity_id || !entity_type) {
      console.error('Missing required metadata in checkout session:', session.id);
      return;
    }

    // Call the backend API to confirm the payment
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: session.id
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to confirm payment: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Payment confirmed:', data);
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
    throw error;
  }
}