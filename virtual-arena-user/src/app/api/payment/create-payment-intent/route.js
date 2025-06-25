import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuthData } from '@/utils/auth';

// Initialize Stripe with the secret key (not the public one)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount, userId, entity_id, entity_type, connected_account_id } = await request.json();
    
    // Validate the request
    if (!amount || !userId || !entity_id || !entity_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Set up payment intent options
    const paymentIntentOptions = {
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        user_id: userId,
        entity_id,
        entity_type,
      }
    };

    // Add application fee and transfer data if connected account is provided
    if (connected_account_id) {
      // Calculate fee (10% of the amount)
      const feeAmount = Math.round(amountInCents * 0.1);
      
      paymentIntentOptions.application_fee_amount = feeAmount;
      paymentIntentOptions.transfer_data = {
        destination: connected_account_id,
      };
    }

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);

    // Save the payment intent to your database if needed
    // This would typically be done by calling your backend API

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}