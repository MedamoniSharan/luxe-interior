# 🐛 Debugging Edge Function Request Body Issue

## 🔍 **Problem**
The `verify-payment` Edge Function is receiving requests but not getting the request body data. All required parameters are showing as missing.

## 🧪 **Debug Steps**

### **Step 1: Check Edge Function Status**
1. Go to **Supabase Dashboard** → **Edge Functions**
2. Verify `verify-payment` shows **"Active"** status
3. Check if there are any deployment errors

### **Step 2: Check Function Logs**
1. In **Edge Functions**, click on `verify-payment`
2. Go to **"Logs"** tab
3. Look for the detailed logs we added:
   ```
   📥 Received payment verification request: {...}
   📥 Raw request body received: ...
   📏 Body length: ...
   📥 Parsed request body: ...
   ```

### **Step 3: Test with Simple Request**
The code now sends a test request first. Check if this works:
```
🧪 Testing simple request...
🧪 Test response status: 200
🧪 Test response: {...}
```

### **Step 4: Check Browser Network Tab**
1. Open **Chrome DevTools** → **Network**
2. Look for the `verify-payment` request
3. Check:
   - **Request Method**: Should be `POST`
   - **Request Headers**: Should include `Content-Type: application/json`
   - **Request Payload**: Should show the JSON data
   - **Response**: Should show the function response

### **Step 5: Common Issues**

#### **Issue 1: Function Not Deployed**
- **Symptom**: 404 error or function not found
- **Solution**: Redeploy the Edge Function

#### **Issue 2: CORS Blocking Request Body**
- **Symptom**: Request shows as failed in Network tab
- **Solution**: Check CORS headers in Edge Function

#### **Issue 3: Environment Variables Missing**
- **Symptom**: Function deployed but not working
- **Solution**: Check `RAZORPAY_KEY_SECRET` in Edge Function settings

#### **Issue 4: Request Body Not Being Sent**
- **Symptom**: Function receives request but no body
- **Solution**: Check if `req.text()` is working

## 🔧 **Quick Fixes to Try**

### **Fix 1: Redeploy Edge Function**
1. Copy the updated code from `supabase/functions/verify-payment/index.ts`
2. Replace the function code in Supabase Dashboard
3. Click **"Deploy"**

### **Fix 2: Check Environment Variables**
1. Go to **Settings** → **Edge Functions**
2. Verify `RAZORPAY_KEY_SECRET` is set
3. If missing, add it and redeploy

### **Fix 3: Test with Minimal Function**
Create a simple test function to verify basic functionality:
```typescript
Deno.serve(async (req) => {
  const body = await req.text();
  return new Response(JSON.stringify({
    received: body,
    length: body.length,
    method: req.method
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

## 📋 **Expected Behavior**

### **Working Function Should Show:**
```
📥 Received payment verification request: {...}
📥 Raw request body received: {"razorpay_payment_id":"...",...}
📏 Body length: 234
📥 Parsed request body: {...}
🔍 Checking required fields:
  - razorpay_payment_id: true order_...
  - razorpay_order_id: true order_...
  - razorpay_signature: true abc123...
  - order_id: true 123e4567-...
  - user_id: true 123e4567-...
  - amount: true 102
  - currency: true INR
  - payment_method: true ONLINE
```

### **If Still Missing Parameters:**
The issue is likely:
1. **Function not properly deployed**
2. **CORS blocking the request**
3. **Environment variables missing**
4. **Request body not being sent from frontend**

## 🚨 **Next Steps**
1. **Check the logs** in Supabase Dashboard
2. **Test the simple request** in browser console
3. **Verify function deployment** status
4. **Check environment variables**

Let me know what you see in the logs and test response!
