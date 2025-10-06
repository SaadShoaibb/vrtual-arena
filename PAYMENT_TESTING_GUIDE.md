# Payment Status Testing Guide

## ✅ What We Fixed

### 1. Frontend Changes
- ✅ Created `/checkout/cancel` page (was causing 404 error)
- ✅ Fixed `BookingForm` to send `payment_status: 'pending'` instead of 'paid'
- ✅ Verified `EnhancedBookingForm` already sends `payment_status: 'pending'` correctly
- ✅ Added Booking ID column to admin panel
- ✅ Added manual refresh button with timestamp
- ✅ Added payment status logging for debugging

### 2. Backend (Already Correct)
- ✅ Success URL: `/checkout/success?session_id={CHECKOUT_SESSION_ID}`
- ✅ Cancel URL: `/checkout/cancel`
- ✅ Bookings created with `payment_status = 'pending'`
- ✅ Webhook updates to 'paid' only after successful payment

## 🧪 How to Test the Payment Flow

### Test 1: Successful Payment
1. **Create a new booking**
   - Go to user frontend
   - Book a session
   - Note the booking time (to identify it later)

2. **Verify initial status**
   - Go to admin panel → Bookings
   - Click "Refresh" button
   - Find your booking (match by time/email)
   - **Expected:** Status should be "⏳ Pending"
   - **Note the Booking ID** (first column)

3. **Complete payment**
   - Go back to the booking
   - Proceed to Stripe checkout
   - Use test card: `4242 4242 4242 4242`
   - Complete the payment
   - **Expected:** Redirected to `/checkout/success`

4. **Verify final status**
   - Go to admin panel → Bookings
   - Click "Refresh" button
   - Find the same Booking ID
   - **Expected:** Status should be "✅ Paid"

### Test 2: Cancelled Payment
1. **Create a new booking**
   - Go to user frontend
   - Book a session
   - Note the time

2. **Verify initial status**
   - Admin panel → Bookings → Refresh
   - **Expected:** Status should be "⏳ Pending"
   - **Note the Booking ID**

3. **Cancel payment**
   - Proceed to Stripe checkout
   - Click the **back arrow** or **browser back button**
   - **Expected:** Redirected to `/checkout/cancel` page (NOT 404!)

4. **Verify status unchanged**
   - Admin panel → Bookings → Refresh
   - Find the same Booking ID
   - **Expected:** Status should STILL be "⏳ Pending" (NOT paid!)

### Test 3: Verify Database Directly
Open your database and run:

```sql
-- Check all bookings and their payment status
SELECT 
    booking_id,
    user_email,
    machine_type,
    payment_status,
    payment_method,
    created_at
FROM Bookings
ORDER BY created_at DESC
LIMIT 10;

-- Check if payment records exist for 'paid' bookings
SELECT 
    b.booking_id,
    b.payment_status,
    p.payment_id,
    p.stripe_session_id,
    p.amount
FROM Bookings b
LEFT JOIN Payments p ON p.entity_id = b.booking_id AND p.entity_type = 'booking'
WHERE b.payment_status = 'paid'
ORDER BY b.created_at DESC;
```

**Expected Results:**
- All new bookings should have `payment_status = 'pending'`
- Only bookings with matching Payments records should be 'paid'

## 🔍 Debugging Steps

### If booking shows "paid" when it shouldn't:

1. **Check console logs in admin panel**
   - Open browser DevTools → Console
   - Click Refresh button
   - Look for: `📊 Booking #XXX: pending` or `paid`
   - This shows the ACTUAL database value

2. **Check the Booking ID**
   - Make sure you're looking at the correct booking
   - Use the Booking ID column to track your test booking

3. **Check browser cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito mode

4. **Check database directly**
   - Run the SQL queries above
   - Verify the payment_status value in the database

5. **Check Stripe Dashboard**
   - Go to Stripe Dashboard → Payments
   - Check if payment actually completed
   - Test mode cards sometimes auto-complete

### Common Issues:

❌ **Issue:** "Cancel page shows 404"
✅ **Fix:** Now fixed! The `/checkout/cancel/page.jsx` has been created

❌ **Issue:** "Booking shows 'paid' immediately"
✅ **Fix:** Frontend now sends 'pending', backend creates with 'pending'

❌ **Issue:** "Looking at wrong booking"
✅ **Fix:** Use Booking ID column to track the specific booking you're testing

❌ **Issue:** "Cached data in admin panel"
✅ **Fix:** Use the Refresh button and check the "Last updated" timestamp

## 📝 Test Card Numbers (Stripe Test Mode)

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires authentication:** 4000 0025 0000 3155

Use any:
- Future expiry date (e.g., 12/34)
- Any 3-digit CVC (e.g., 123)
- Any ZIP code (e.g., 12345)

## 🎯 Expected Behavior Summary

| Action | Payment Status | Redirect |
|--------|----------------|----------|
| Create booking | `pending` | - |
| Start checkout | `pending` | Stripe checkout |
| Click back/cancel | `pending` | `/checkout/cancel` |
| Complete payment | `paid` | `/checkout/success` |
| Webhook fires | `paid` | - |

## ✅ Success Criteria

- ✅ No 404 errors when cancelling payment
- ✅ Payment status is 'pending' when booking is created
- ✅ Payment status stays 'pending' when user cancels
- ✅ Payment status becomes 'paid' only after successful payment
- ✅ Booking ID visible in admin panel
- ✅ Refresh button works and shows current time
- ✅ Console logs show correct payment status from database
