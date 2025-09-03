#!/bin/bash

# Deploy Supabase Edge Functions
# Make sure you have Supabase CLI installed and are logged in

echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    exit 1
fi

# Deploy Edge Functions
echo "📦 Deploying create-razorpay-order function..."
supabase functions deploy create-razorpay-order

echo "📦 Deploying verify-payment function..."
supabase functions deploy verify-payment

echo "✅ Edge Functions deployed successfully!"

echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in your Supabase dashboard:"
echo "   - RAZORPAY_KEY_ID"
echo "   - RAZORPAY_KEY_SECRET"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "2. Run database migrations:"
echo "   supabase db push"
echo ""
echo "3. Test the integration with a sample payment"
