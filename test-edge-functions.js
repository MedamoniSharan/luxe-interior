import fetch from 'node-fetch';

const SUPABASE_URL = 'https://xdfxkumdypnpzibmhxji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZnhrdW1keXBu' +
  'cHppYm1oeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODgyMjMsImV4cCI6MjA2MTE2NDIyM30.LRlI-8E6deq0_Ge-X-JV0Let8Xv0' +
  'AgN-bALu5olfX-g';

async function testEdgeFunctions() {
  console.log('🧪 Testing Edge Functions...\n');

  // Test 1: Test the test-body function
  console.log('1️⃣ Testing test-body function...');
  try {
    const testResponse = await fetch(`${SUPABASE_URL}/functions/v1/test-body`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ test: 'data' }),
    });

    console.log('   Status:', testResponse.status);
    const testResult = await testResponse.json();
    console.log('   Response:', testResult);
  } catch (error) {
    console.error('   ❌ Error:', error.message);
  }

  console.log('\n2️⃣ Testing create-razorpay-order function...');
  try {
    const orderResponse = await fetch(`${SUPABASE_URL}/functions/v1/create-razorpay-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        amount: 100,
        currency: 'INR',
        receipt: 'test_receipt_123'
      }),
    });

    console.log('   Status:', orderResponse.status);
    const orderResult = await orderResponse.json();
    console.log('   Response:', orderResult);
  } catch (error) {
    console.error('   ❌ Error:', error.message);
  }

  console.log('\n3️⃣ Testing verify-payment function...');
  try {
    const verifyResponse = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        razorpay_payment_id: 'test_payment_id',
        razorpay_order_id: 'test_order_id',
        razorpay_signature: 'test_signature',
        order_id: 'test_order_id',
        user_id: 'test_user_id',
        amount: 100,
        currency: 'INR',
        payment_method: 'ONLINE'
      }),
    });

    console.log('   Status:', verifyResponse.status);
    const verifyResult = await verifyResponse.json();
    console.log('   Response:', verifyResult);
  } catch (error) {
    console.error('   ❌ Error:', error.message);
  }

  console.log('\n✅ Edge Function testing completed!');
}

testEdgeFunctions().catch(console.error);
