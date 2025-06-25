import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuthData } from '@/utils/auth';

// Initialize Stripe with the secret key (not the public one)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { user_id, entity_id, entity_type, amount, connected_account_id } = await request.json();
    
    // Validate the request
    if (!amount || !user_id || !entity_id || !entity_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Set up checkout session options
    const sessionOptions = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${entity_type.charAt(0).toUpperCase() + entity_type.slice(1)} Payment`,
              description: `Payment for ${entity_type} #${entity_id}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/checkout?canceled=true`,
      metadata: {
        user_id,
        entity_id,
        entity_type,
      },
    };

    // Add application fee and transfer data if connected account is provided
    if (connected_account_id) {
      // Calculate fee (10% of the amount)
      const feeAmount = Math.round(amountInCents * 0.1);
      
      sessionOptions.payment_intent_data = {
        application_fee_amount: feeAmount,
        transfer_data: {
          destination: connected_account_id,
        },
      };
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionOptions);

    // Save the checkout session to your database if needed
    // This would typically be done by calling your backend API

    return NextResponse.json({
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}