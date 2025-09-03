# Razorpay Integration Setup Guide

## Overview
This project has been integrated with Razorpay payment gateway for secure online payments. The integration includes:

1. **Payment Processing**: Online payments through Razorpay
2. **Transaction History**: Complete payment tracking and history
3. **Order Management**: Integrated order creation and management
4. **Security**: Payment signature verification

## Environment Variables Required

### Frontend (.env)
```bash
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=your_supabase_url
```

### Supabase Edge Functions
The following environment variables need to be set in your Supabase project:

```bash
RAZORPAY_KEY_ID=rzp_live_3bBLgWk2hRa2NS
RAZORPAY_KEY_SECRET=kWuJ8gm74StDFwojLd3CeSjr
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Setup Instructions

### 1. Supabase Environment Variables
1. Go to your Supabase project dashboard
2. Navigate to Settings > Edge Functions
3. Add the environment variables listed above

### 2. Deploy Edge Functions
The following Edge Functions are included:
- `create-razorpay-order`: Creates Razorpay orders
- `verify-payment`: Verifies payments and stores transaction history

### 3. Database Migrations
Run the following migration to create the transaction history table:
```sql
-- File: supabase/migrations/20250817183000_transaction_history.sql
```

## Features

### Payment Flow
1. User adds items to cart
2. User proceeds to checkout
3. User selects payment method (Online/COD)
4. For online payments:
   - Razorpay order is created
   - Payment modal opens
   - User completes payment
   - Payment is verified
   - Transaction history is stored
   - Order is created in database

### Transaction History
- Complete payment tracking
- Order details with items
- Payment gateway responses
- Status tracking (pending, completed, failed)
- Searchable and filterable

### Security Features
- Payment signature verification
- Secure environment variable handling
- Row-level security policies
- User authentication required

## Testing

### Test Mode
For testing, use Razorpay test keys:
```bash
RAZORPAY_KEY_ID=rzp_test_your_test_key
RAZORPAY_KEY_SECRET=your_test_secret
```

### Test Cards
Use Razorpay's test card numbers for testing payments.

## Monitoring

### Logs
- Edge Function logs are available in Supabase dashboard
- Payment verification logs include transaction details
- Error logging for debugging

### Analytics
- Transaction success/failure rates
- Payment method distribution
- Order completion tracking

## Support

For issues or questions:
1. Check Edge Function logs in Supabase
2. Verify environment variables are set correctly
3. Ensure database migrations have been applied
4. Check Razorpay dashboard for payment status

## Security Notes

- Never expose Razorpay keys in client-side code
- Always verify payment signatures
- Use HTTPS in production
- Implement proper error handling
- Monitor for suspicious activities
