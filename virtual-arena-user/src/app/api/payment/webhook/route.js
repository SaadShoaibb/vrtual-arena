import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This is your Stripe webhook secret for verifying webhook events
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event;

    try {
      // Verify the event came from Stripe
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    console.log(`Webhook received: ${event.type}`);
    
    // Check if this is a connected account event
    const connectedAccountId = event.account;
    if (connectedAccountId) {
      console.log(`Event from connected account: ${connectedAccountId}`);
    }

    // Process different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      case 'checkout.session.async_payment_succeeded':
        await handleAsyncPaymentSucceeded(event.data.object);
        break;
      case 'checkout.session.async_payment_failed':
        await handleAsyncPaymentFailed(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Webhook error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 500 }
    );
  }
}

// Handler functions for different event types
async function handleCheckoutSessionCompleted(session) {
  console.log('Processing checkout.session.completed');
  console.log('Session data:', JSON.stringify(session, null, 2));
  
  // Here you would typically:
  // 1. Update order status in your database
  // 2. Send confirmation email to customer
  // 3. Update inventory or other business logic
  
  // Example of what you might do:
  // const { metadata } = session;
  // if (metadata && metadata.order_id) {
  //   await updateOrderStatus(metadata.order_id, 'paid');
  // }
}

async function handleAsyncPaymentSucceeded(session) {
  console.log('Processing checkout.session.async_payment_succeeded');
  // Handle async payment success (similar to checkout.session.completed)
}

async function handleAsyncPaymentFailed(session) {
  console.log('Processing checkout.session.async_payment_failed');
  // Handle payment failure - update order status, notify customer, etc.
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Processing payment_intent.succeeded');
  console.log('Payment Intent:', JSON.stringify(paymentIntent, null, 2));
  
  // Handle successful payment intent
  // Similar to checkout session but with payment intent data
}