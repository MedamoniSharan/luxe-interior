#!/bin/bash

# Deploy updated Supabase Edge Functions with CORS fixes
echo "🚀 Deploying updated Supabase Edge Functions..."

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

echo "📦 Deploying create-razorpay-order function with CORS fixes..."
supabase functions deploy create-razorpay-order

echo "📦 Deploying verify-payment function with CORS fixes..."
supabase functions deploy verify-payment

echo "✅ Edge Functions deployed successfully!"

echo ""
echo "🔧 CORS Issues Fixed:"
echo "   - Added support for localhost:5173 (Vite dev server)"
echo "   - Added support for localhost:3000 (alternative dev port)"
echo "   - Dynamic CORS headers based on request origin"
echo ""
echo "📋 Next steps:"
echo "1. Test the payment flow again"
echo "2. Check browser console for CORS errors"
echo "3. If you still see issues, check Supabase function logs"
echo ""
echo "🌐 For production, update the allowed origins in the functions:"
echo "   - Replace 'https://yourdomain.com' with your actual domain"
