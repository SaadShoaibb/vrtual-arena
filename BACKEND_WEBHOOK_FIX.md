# Backend Webhook Fix Required

## 🔴 Critical Issue Found

The webhook was calling `confirm-payment` even when payment was **NOT completed**. This caused Booking #16 to be marked as "paid" when you cancelled.

## ✅ Frontend Webhook Fixed

I've already fixed the **frontend webhook** in:
- `virtual-arena-user/src/app/api/webhook/route.js`

**New code (lines 70-74):**
```javascript
// CRITICAL: Only process if payment was actually completed
if (session.payment_status !== 'paid') {
  console.log(`⚠️ Checkout session ${session.id} completed but payment status is '${session.payment_status}', not 'paid'. Skipping payment confirmation.`);
  return;
}
```

This prevents the frontend from calling the backend's `confirm-payment` endpoint unless Stripe confirms the payment is actually 'paid'.

## ⚠️ Backend Verification Needed

You also need to add the **same check in your backend** to be extra safe.

### File to Check: `controllers/webhookController.js`

In the `confirmPayment` or similar function, add this verification:

```javascript
async function confirmPayment(req, res) {
  try {
    const { session_id } = req.body;
    
    // Retrieve the full session from Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // ⭐ ADD THIS CHECK ⭐
    if (session.payment_status !== 'paid') {
      console.log(`⚠️ Session ${session_id} payment_status is '${session.payment_status}', not 'paid'. Refusing to update.`);
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
    
    // Extract metadata
    const { entity_type, entity_id } = session.metadata;
    
    // Now safe to update booking to 'paid'
    if (entity_type === 'booking') {
      await updateBookingStatus(entity_id, 'paid');
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
```

## 🔧 Fix Booking #16

Run this migration to fix bookings that were incorrectly marked as paid:

```bash
cd virtual-arena-backend
node migrations/fix-unpaid-bookings.js
```

This will:
1. Find all bookings marked as 'paid' without payment records
2. Update them back to 'pending'
3. Show you a summary

## 📊 How to Verify

After making the backend change, test again:

1. **Create a new booking**
2. **Go to Stripe checkout**
3. **Click the back button** (cancel payment)
4. **Check admin panel** → Refresh
5. **Expected:** Status should be '⏳ Pending' (NOT '✅ Paid')

## 🎯 Why This Happened

Stripe's `checkout.session.completed` event fires when:
- ✅ Payment is successful (`payment_status: 'paid'`)
- ❌ Session is created but payment cancelled (`payment_status: 'unpaid'`)
- ❌ Session expires (`payment_status: 'unpaid'`)

**Before the fix:** The webhook updated to 'paid' for ALL these cases ❌
**After the fix:** The webhook only updates to 'paid' when `payment_status === 'paid'` ✅

## 📝 Summary of Changes

### Frontend (Already Done)
- ✅ Webhook now checks `session.payment_status === 'paid'`
- ✅ Added logging for debugging

### Backend (YOU NEED TO DO)
- ⚠️ Add same check in `confirm-payment` endpoint
- ⚠️ Run migration to fix incorrectly marked bookings

### Testing
- ⚠️ Test the full flow again after backend fix
- ⚠️ Verify cancelled payments stay 'pending'
