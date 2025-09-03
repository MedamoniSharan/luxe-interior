import fetch from 'node-fetch';

const SUPABASE_URL = 'https://xdfxkumdypnpzibmhxji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZnhrdW1keXBu' +
  'cHppYm1oeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODgyMjMsImV4cCI6MjA2MTE2NDIyM30.LRlI-8E6deq0_Ge-X-JV0Let8Xv0' +
  'AgN-bALu5olfX-g';

async function testCompletePaymentFlow() {
  console.log('🧪 Testing Complete Payment Flow for Transaction History...\n');

  // Step 1: Create a Razorpay order
  console.log('1️⃣ Creating Razorpay order...');
  let razorpayOrderId = null;
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
        receipt: 'test_receipt_' + Date.now()
      }),
    });

    console.log('   Status:', orderResponse.status);
    const orderResult = await orderResponse.json();
    console.log('   Response:', orderResult);
    
    if (orderResult.success) {
      razorpayOrderId = orderResult.data.order_id;
      console.log('   ✅ Razorpay order created:', razorpayOrderId);
    } else {
      console.log('   ❌ Failed to create Razorpay order');
      return;
    }
  } catch (error) {
    console.error('   ❌ Error creating Razorpay order:', error.message);
    return;
  }

  // Step 2: Simulate order creation in database (this would normally happen in your app)
  console.log('\n2️⃣ Simulating order creation in database...');
  let dbOrderId = null;
  try {
    // First, let's check if we can access the orders table
    const ordersResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    
    console.log('   Orders table access status:', ordersResponse.status);
    if (ordersResponse.status === 200) {
      console.log('   ✅ Orders table is accessible');
    } else {
      console.log('   ❌ Cannot access orders table');
    }
  } catch (error) {
    console.error('   ❌ Error accessing orders table:', error.message);
  }

  // Step 3: Test payment verification with the real Razorpay order ID
  console.log('\n3️⃣ Testing payment verification...');
  try {
    const verifyResponse = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        razorpay_payment_id: 'test_payment_' + Date.now(),
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: 'test_signature_' + Date.now(),
        order_id: 'test-order-' + Date.now(), // This should be a real UUID from your database
        user_id: 'test-user-' + Date.now(),   // This should be a real UUID from your database
        amount: 100,
        currency: 'INR',
        payment_method: 'ONLINE'
      }),
    });

    console.log('   Status:', verifyResponse.status);
    const verifyResult = await verifyResponse.json();
    console.log('   Response:', verifyResult);
    
    if (verifyResult.success) {
      console.log('   ✅ Payment verification successful');
    } else {
      console.log('   ❌ Payment verification failed:', verifyResult.error);
      console.log('   Details:', verifyResult.details);
    }
  } catch (error) {
    console.error('   ❌ Error in payment verification:', error.message);
  }

  // Step 4: Test direct transaction history creation
  console.log('\n4️⃣ Testing direct transaction history creation...');
  try {
    const transactionResponse = await fetch(`${SUPABASE_URL}/rest/v1/transaction_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        order_id: 'test-order-' + Date.now(),
        user_id: 'test-user-' + Date.now(),
        transaction_id: 'test-transaction-' + Date.now(),
        payment_method: 'ONLINE',
        amount: 100,
        currency: 'INR',
        status: 'completed',
        gateway_response: {
          razorpay_payment_id: 'test_payment_' + Date.now(),
          razorpay_order_id: razorpayOrderId,
          test: true,
          timestamp: new Date().toISOString()
        }
      }),
    });

    console.log('   Status:', transactionResponse.status);
    const transactionResult = await transactionResponse.json();
    console.log('   Response:', transactionResult);
    
    if (transactionResponse.status === 201) {
      console.log('   ✅ Transaction history created successfully');
    } else {
      console.log('   ❌ Failed to create transaction history');
    }
  } catch (error) {
    console.error('   ❌ Error creating transaction history:', error.message);
  }

  // Step 5: Check if transaction was actually created
  console.log('\n5️⃣ Verifying transaction history...');
  try {
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/transaction_history?select=*&limit=5&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });

    console.log('   Status:', checkResponse.status);
    if (checkResponse.status === 200) {
      const transactions = await checkResponse.json();
      console.log('   ✅ Found', transactions.length, 'transactions');
      if (transactions.length > 0) {
        console.log('   Latest transaction:', {
          id: transactions[0].id,
          status: transactions[0].status,
          amount: transactions[0].amount,
          created_at: transactions[0].created_at
        });
      }
    } else {
      console.log('   ❌ Cannot access transaction history');
    }
  } catch (error) {
    console.error('   ❌ Error checking transaction history:', error.message);
  }

  console.log('\n✅ Complete payment flow test completed!');
  console.log('\n📊 Summary:');
  console.log('   - Razorpay order creation:', razorpayOrderId ? '✅ SUCCESS' : '❌ FAILED');
  console.log('   - Payment verification:', 'See step 3 results above');
  console.log('   - Transaction history creation:', 'See step 4 results above');
}

testCompletePaymentFlow().catch(console.error);
