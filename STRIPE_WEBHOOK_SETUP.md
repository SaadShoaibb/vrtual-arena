# Stripe Webhook Setup Guide

## Overview

This guide provides detailed instructions for setting up and testing Stripe webhooks for your Virtual Arena application. Webhooks allow Stripe to notify your application when events occur, such as successful payments, failed payments, or subscription updates.

## Prerequisites

- A Stripe account (test or live)
- Your backend server accessible via HTTPS (for production) or using Stripe CLI (for local development)
- Access to your Nginx configuration (for production setup)

## Webhook Events

You've already set up the following webhook events in your Stripe Dashboard:

- `checkout.session.async_payment_failed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.completed`
- `checkout.session.expired`

These events cover the essential checkout session lifecycle. Your webhook controller has been updated to handle these events.

## Production Setup

### 1. Configure Nginx

The provided `nginx.conf` file includes special configuration for the webhook endpoint. Make sure to:

- Replace `yourdomain.com` with your actual domain
- Ensure SSL certificates are properly set up
- Verify the backend server port (default: 8080)

Key configuration for the webhook endpoint:

```nginx
location /api/v1/payment/webhook {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Important: Preserve request body for Stripe signature verification
    proxy_pass_request_headers on;
    proxy_pass_request_body on;
    
    # Increase timeouts for webhook processing
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # Disable buffering for webhook endpoint
    proxy_buffering off;
    
    # Increase buffer size if needed
    client_body_buffer_size 16k;
    client_max_body_size 16k;
}
```

### 2. Set Up Webhook in Stripe Dashboard

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to Developers > Webhooks
3. Click "Add endpoint"
4. Enter your webhook URL: `https://yourdomain.com/api/v1/payment/webhook`
5. Select the events to listen for:
   - `checkout.session.async_payment_failed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.completed`
   - `checkout.session.expired`
6. Click "Add endpoint"
7. Copy the "Signing secret" (it starts with `whsec_`)
8. Update your `.env` file with the webhook secret:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret
   ```

### 3. Verify Webhook Configuration

After setting up your webhook, you can verify it's working correctly:

1. Make a test payment through your application
2. Check the Stripe Dashboard > Developers > Webhooks > Select your endpoint
3. Look at the "Recent events" section to see if events were delivered successfully
4. Check your server logs for webhook processing messages

## Local Development Setup

For local development, you can use the Stripe CLI to forward webhook events to your local server.

### 1. Install Stripe CLI

- **Windows**: Download from [Stripe CLI Releases](https://github.com/stripe/stripe-cli/releases) or use Chocolatey: `choco install stripe-cli`
- **Mac**: Use Homebrew: `brew install stripe/stripe-cli/stripe`
- **Linux**: Download from [Stripe CLI Releases](https://github.com/stripe/stripe-cli/releases)

### 2. Login to Stripe CLI

```bash
stripe login
```

Follow the prompts to authenticate with your Stripe account.

### 3. Forward Webhook Events

```bash
stripe listen --forward-to http://localhost:8080/api/v1/payment/webhook
```

The CLI will display a webhook signing secret. Update your `.env` file with this secret for local development:

```
STRIPE_WEBHOOK_SECRET=whsec_your_local_signing_secret
```

### 4. Trigger Test Events

You can trigger test webhook events using the Stripe CLI:

```bash
stripe trigger checkout.session.completed
```

Other events you can trigger:

```bash
stripe trigger checkout.session.async_payment_succeeded
stripe trigger checkout.session.async_payment_failed
stripe trigger checkout.session.expired
```

## Troubleshooting

### Common Issues

1. **404 Not Found**
   - Verify your Nginx configuration is correctly routing to your backend
   - Check that your backend server is running
   - Ensure the webhook endpoint path matches exactly in both Stripe Dashboard and your code

2. **Signature Verification Failed**
   - Ensure the webhook secret in your `.env` file matches the one from Stripe
   - Verify that your Nginx configuration preserves the raw request body
   - Check that you're not using body parsers for the webhook endpoint

3. **Events Not Being Processed**
   - Check your server logs for errors
   - Verify that your webhook controller is correctly handling the events
   - Ensure your database queries are working correctly

### Debugging Tips

1. Add additional logging in your webhook controller:

```javascript
console.log('Webhook received:', event.type);
console.log('Event data:', JSON.stringify(event.data.object, null, 2));
```

2. Check Stripe Dashboard for webhook delivery attempts and failures

3. Use Stripe CLI to view detailed webhook event data:

```bash
stripe listen --events checkout.session.completed --print-json
```

## Connected Accounts

If you're using Stripe Connect for connected accounts, you'll need to set up webhooks for connected accounts as well. The webhook controller has been updated to check for the `event.account` property, which indicates the event is from a connected account.

For connected accounts, you can:

1. Use the same webhook endpoint for both platform and connected accounts
2. Filter events in your webhook controller based on the `event.account` property
3. Process connected account events differently if needed

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Connect Webhooks](https://stripe.com/docs/connect/webhooks)