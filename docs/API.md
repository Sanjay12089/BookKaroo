# BookKaroo — API Contracts (Patch v2)

> Patch v2: Payments endpoints now provider-agnostic; mock-capture endpoint added; PayPal/Razorpay-specific webhooks deferred to Phase 1.5.

## Changed: Payments

### POST /payments/order
*Auth required, idempotent via `Idempotency-Key` header*
**Body:** `{ showId, seats[], couponCode? }`
**Returns:**
```json
{
  "orderId": "ord_abc123",
  "provider": "mock",
  "providerOrderId": "MOCK-1234567890",
  "amount": 606.94,
  "currency": "INR",
  "breakdown": {
    "ticketAmount": 900.00,
    "convenienceFee": 118.00,
    "convenienceFeeGst": 21.24,
    "offerProcessingFee": 15.00,
    "offerProcessingFeeGst": 2.70,
    "discount": 450.00,
    "cgst": 11.97,
    "sgst": 11.97,
    "igst": 0.00,
    "amountPaid": 606.94
  },
  "checkoutUrl": null,
  "providerKey": null
}
```

For Phase 1.5: `checkoutUrl` and `providerKey` populated for Razorpay/PayPal SDK init.

### POST /payments/mock-capture (Phase 1 only)
*Auth required.* **Dev/staging only — returns 404 in Production.**
**Body:** `{ providerOrderId, simulateFailure?: false }`
**Returns:**
- `200 { booking, invoice_url, qr_url }` on success
- `402 { error: "Payment declined" }` if `simulateFailure=true`

### POST /payments/verify (Phase 1.5)
*Replaces mock-capture once real provider wired.*
**Body:** `{ providerOrderId, providerPaymentId, signature }`

### POST /payments/webhook (Phase 1.5)
Razorpay or PayPal calls this. Verify signature → mark capture → finalize booking.

## Other Endpoints
*(unchanged — see v1)*
