# 🚀 Deploy Edge Functions with CORS Fixes

## 📋 **What We Fixed**

1. **CORS Configuration** - Updated to handle localhost origins properly
2. **Response Headers** - Simplified CORS headers for better compatibility
3. **Error Handling** - Improved error responses with proper CORS headers

## 🔧 **Manual Deployment Steps**

### **Step 1: Go to Supabase Dashboard**
1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project

### **Step 2: Deploy create-razorpay-order Function**
1. Go to **Edge Functions** (left sidebar)
2. Find `create-razorpay-order` function
3. Click **"Edit"**
4. Replace the entire code with the updated version from `supabase/functions/create-razorpay-order/index.ts`
5. Click **"Deploy"**

### **Step 3: Deploy verify-payment Function**
1. Go to **Edge Functions** (left sidebar)
2. Find `verify-payment` function
3. Click **"Edit"**
4. Replace the entire code with the updated version from `supabase/functions/verify-payment/index.ts`
5. Click **"Deploy"**

### **Step 4: Verify Environment Variables**
1. Go to **Settings** → **Edge Functions**
2. Ensure these variables are set:
   ```
   RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_TEST_KEY_SECRET
   ```

## 🧪 **Test the Fix**

1. **Restart your dev server** (if needed)
2. **Go to Cart Page** (`/cart`)
3. **Add/Select an address**
4. **Click "Proceed to Payment"**
5. **Click "Pay & Place Order"**
6. **Check Console** - Should see successful API calls
7. **Razorpay UI should appear** without CORS errors

## 🔍 **Expected Console Logs**

```
🔍 Starting online payment process...
🔑 Razorpay Key ID: (from Edge Function)
💰 Cart Total: 1.02
📍 Selected Address: {...}
🌐 Razorpay available: true
📦 Edge Function order created: {...}
🎯 Razorpay options: {...}
🚀 Opening Razorpay modal...
✅ Razorpay.open() called
```

## 🚫 **If CORS Still Persists**

1. **Check Function Logs** in Supabase Dashboard
2. **Verify Function Status** - Should show "Active"
3. **Check Environment Variables** - Ensure they're set correctly
4. **Test with Simple Function** - Create a basic test function first

## 📞 **Need Help?**

If you still see CORS issues after deployment:
1. Check Supabase function logs
2. Verify the function is actually deployed
3. Test with a simple "Hello World" function first
