# Stripe Connected Accounts Implementation Guide

## Overview

This guide provides detailed instructions for implementing Stripe Connected Accounts in your Virtual Arena application. Connected Accounts allow you to facilitate payments between customers and third-party service providers (like tournament organizers, coaches, or product sellers) while taking a platform fee.

## Prerequisites

- Stripe account with Connect enabled
- Virtual Arena backend and frontend applications
- Nginx server for production deployment

## 1. Enable Stripe Connect

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to Connect > Settings
3. Click "Enable Connect"
4. Choose the appropriate Connect account type for your platform:
   - **Standard**: Lightest integration, users create their own Stripe accounts
   - **Express**: Streamlined onboarding with Stripe-hosted pages
   - **Custom**: Full control over the onboarding experience

## 2. Database Setup

Execute the provided SQL schema in `migrations/connected_accounts_schema.sql` to create the necessary tables:

- `ConnectedAccounts`: Stores information about connected Stripe accounts
- `ConnectedAccountPayouts`: Tracks payouts to connected accounts
- `ConnectedAccountBalances`: Tracks available and pending balances
- `ConnectedAccountWebhookEvents`: Logs webhook events for connected accounts

The schema also adds a `connected_account_id` column to your existing `Payments` table.

## 3. Backend Implementation

### 3.1 Environment Variables

Add the following to your `.env` file:

```
# For Express or Custom account types
STRIPE_CONNECT_CLIENT_ID=ca_xxxxxxxxxxxx

# For webhook events from connected accounts
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

### 3.2 Controllers and Routes

1. Use the provided example controller in `controllers/connectedAccountsExample.js` as a reference
2. Uncomment the connected accounts routes in `routes/paymentRoutes.js`

### 3.3 Webhook Handling

The webhook controller has been updated to check for connected account events using the `event.account` property. This allows you to process events from both your platform account and connected accounts using the same webhook endpoint.

```javascript
// Check if this is a connected account event
const connectedAccountId = event.account;
if (connectedAccountId) {
    console.log(`Event from connected account: ${connectedAccountId}`);
    // You may want to store or log this account ID for tracking purposes
}
```

## 4. Frontend Implementation

### 4.1 Connected Account Onboarding

Create a page for sellers/providers to connect their Stripe accounts:

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/ApiUrl';

const ConnectAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleConnect = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/payment/connected-accounts`, {
        email: 'seller@example.com', // Get from user profile
        name: 'Seller Business Name', // Get from user input
      });
      
      // Redirect to Stripe's hosted onboarding
      window.location.href = response.data.onboarding_url;
    } catch (err) {
      setError('Failed to create connected account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Connect Your Stripe Account</h2>
      <p>Connect your Stripe account to receive payments directly.</p>
      {error && <div className="error">{error}</div>}
      <button 
        onClick={handleConnect} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Connect with Stripe'}
      </button>
    </div>
  );
};

export default ConnectAccount;
```

### 4.2 Update Payment Form

Modify your existing payment form to include the connected account ID when applicable:

```jsx
// In PaymentForm component
const handleCheckoutSession = async () => {
  setProcessing(true);
  
  try {
    // Determine if this payment should go to a connected account
    const connectedAccountId = entity.seller_account_id; // Get from the entity being purchased
    
    let response;
    if (connectedAccountId) {
      // Use connected account endpoint
      response = await axios.post(`${API_URL}/payment/connected-accounts/create-checkout-session`, {
        user_id,
        entity_type,
        entity_id,
        amount,
        connected_account_id: connectedAccountId
      });
    } else {
      // Use regular endpoint
      response = await axios.post(`${API_URL}/payment/create-checkout-session`, {
        user_id,
        entity_type,
        entity_id,
        amount
      });
    }
    
    const { sessionId } = response.data;
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      setError(error.message);
    }
  } catch (err) {
    setError('Payment failed. Please try again.');
    console.error(err);
  } finally {
    setProcessing(false);
  }
};
```

## 5. Nginx Configuration

Update your Nginx configuration to handle webhook events from connected accounts. The provided `nginx.conf` file already includes the necessary configuration for the webhook endpoint.

Key points:

- Preserve the raw request body for signature verification
- Increase timeouts for webhook processing
- Disable buffering for the webhook endpoint

## 6. Webhook Configuration in Stripe Dashboard

### 6.1 Platform Account Webhook

1. Go to Developers > Webhooks in your Stripe Dashboard
2. Add an endpoint: `https://yourdomain.com/api/v1/payment/webhook`
3. Select the events to listen for, including:
   - `checkout.session.async_payment_failed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.completed`
   - `checkout.session.expired`
   - Any other events you need for your application

### 6.2 Connect Webhook

1. Go to Connect > Settings > Webhooks in your Stripe Dashboard
2. Add an endpoint: `https://yourdomain.com/api/v1/payment/webhook`
3. Select "Connect" as the filter
4. Select the events to listen for, similar to your platform webhook
5. Copy the signing secret and add it to your `.env` file as `STRIPE_CONNECT_WEBHOOK_SECRET`

## 7. Testing

### 7.1 Create a Test Connected Account

1. Use the Stripe CLI to create a test connected account:

```bash
stripe connect accounts create --type=express
```

2. Use the account ID in your application for testing

### 7.2 Test Payments

1. Create a checkout session with the connected account ID
2. Complete the payment using a test card
3. Verify the webhook events are processed correctly
4. Check that the payment appears in both your platform dashboard and the connected account dashboard

### 7.3 Test Webhook Events

Use the Stripe CLI to trigger test events for connected accounts:

```bash
stripe trigger checkout.session.completed --account=acct_xxxxx
```

## 8. Going Live

1. Update your Stripe API keys to production keys
2. Configure webhooks in your production Stripe Dashboard
3. Test the entire flow in production with a small real payment
4. Monitor webhook events and payment processing

## Additional Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Connect Account Types](https://stripe.com/docs/connect/accounts)
- [Connect Onboarding](https://stripe.com/docs/connect/express-accounts)
- [Connect Webhooks](https://stripe.com/docs/connect/webhooks)