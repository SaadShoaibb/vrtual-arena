# Webhook Fix for Cancelled Bookings

## Issue
When a payment is cancelled, the `payment_status` is updated to 'cancelled' but `session_status` remains as 'pending' or 'started'. This causes the time slot conflict check to still consider the booking as active, blocking new bookings for the same time slot.

## Solution
Update the `updateBookingStatus` function in `webhookController.js` to also set `session_status` to 'cancelled' when `payment_status` is set to 'cancelled'.

## Manual Fix Required

In file: `virtual-arena-backend/controllers/webhookController.js`

Find the function `updateBookingStatus` (around line 450) and replace it with:

```javascript
async function updateBookingStatus(bookingId, paymentStatus) {
  try {
    console.log(`Attempting to update booking ${bookingId} payment_status to ${paymentStatus}`);

    // If payment is cancelled, also set session_status to cancelled
    const sessionStatus = paymentStatus === 'cancelled' ? 'cancelled' : null;
    
    const updateQuery = sessionStatus 
      ? `UPDATE Bookings SET payment_status = ?, session_status = ? WHERE booking_id = ?`
      : `UPDATE Bookings SET payment_status = ? WHERE booking_id = ?`;
    
    const params = sessionStatus 
      ? [paymentStatus, sessionStatus, bookingId]
      : [paymentStatus, bookingId];

    const [result] = await db.query(updateQuery, params);
    console.log(`Booking ${bookingId} payment_status updated to ${paymentStatus}${sessionStatus ? `, session_status to ${sessionStatus}` : ''}. Affected rows: ${result.affectedRows}`);

    if (result.affectedRows === 0) {
      console.warn(`No booking found with ID ${bookingId}`);
    }
  } catch (error) {
    console.error(`Error updating booking payment status: ${error.message}`);
    throw error;
  }
}
```

This ensures that when a payment is cancelled (via webhook), both `payment_status` AND `session_status` are set to 'cancelled', allowing the time slot to be available for new bookings.
