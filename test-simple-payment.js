import fetch from 'node-fetch';

const SUPABASE_URL = 'https://xdfxkumdypnpzibmhxji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZnhrdW1keXBu' +
  'cHppYm1oeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODgyMjMsImV4cCI6MjA2MTE2NDIyM30.LRlI-8E6deq0_Ge-X-JV0Let8Xv0' +
  'AgN-bALu5olfX-g';

async function testSimplePayment() {
  console.log('🧪 Simple Payment Test - Checking Existing Data...\n');

  // Step 1: Check what data exists
  console.log('1️⃣ Checking existing data...');
  
  try {
    // Check users
    const usersResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    
    if (usersResponse.status === 200) {
      const users = await usersResponse.json();
      console.log('   Users found:', users.length);
      if (users.length > 0) {
        console.log('   Sample user ID:', users[0].id);
      }
    }
    
    // Check addresses
    const addressesResponse = await fetch(`${SUPABASE_URL}/rest/v1/addresses?select=id,user_id&limit=3`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    
    if (addressesResponse.status === 200) {
      const addresses = await addressesResponse.json();
      console.log('   Addresses found:', addresses.length);
      if (addresses.length > 0) {
        console.log('   Sample address ID:', addresses[0].id);
        console.log('   Sample address user_id:', addresses[0].user_id);
      }
    }
    
    // Check orders
    const ordersResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=id,user_id,payment_status&limit=3`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    
    if (ordersResponse.status === 200) {
      const orders = await ordersResponse.json();
      console.log('   Orders found:', orders.length);
      if (orders.length > 0) {
        console.log('   Sample order ID:', orders[0].id);
        console.log('   Sample order user_id:', orders[0].user_id);
        console.log('   Sample order payment_status:', orders[0].payment_status);
      }
    }
    
    // Check transaction history
    const transactionsResponse = await fetch(`${SUPABASE_URL}/rest/v1/transaction_history?select=*&limit=3`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    
    if (transactionsResponse.status === 200) {
      const transactions = await transactionsResponse.json();
      console.log('   Transactions found:', transactions.length);
      if (transactions.length > 0) {
        console.log('   Sample transaction ID:', transactions[0].id);
        console.log('   Sample transaction status:', transactions[0].status);
      }
    }
    
  } catch (error) {
    console.error('   ❌ Error checking data:', error.message);
  }

  // Step 2: Test payment verification with existing data if available
  console.log('\n2️⃣ Testing payment verification...');
  
  try {
    // Create Razorpay order first
    const orderResponse = await fetch(`${SUPABASE_URL}/functions/v1/create-razorpay-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        amount: 100,
        currency: 'INR',
        receipt: 'simple_test_' + Date.now()
      }),
    });

    const orderResult = await orderResponse.json();
    if (orderResult.success) {
      console.log('   ✅ Razorpay order created:', orderResult.data.order_id);
      
      // Now test verification with a dummy order ID
      const verifyResponse = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: 'test_payment_' + Date.now(),
          razorpay_order_id: orderResult.data.order_id,
          razorpay_signature: 'test_signature_' + Date.now(),
          order_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
          user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
          amount: 100,
          currency: 'INR',
          payment_method: 'ONLINE'
        }),
      });

      console.log('   Verification status:', verifyResponse.status);
      const verifyResult = await verifyResponse.json();
      console.log('   Verification response:', verifyResult);
      
      if (verifyResult.success) {
        console.log('   ✅ Payment verification successful!');
      } else {
        console.log('   ❌ Payment verification failed:', verifyResult.error);
        console.log('   Details:', verifyResult.details);
      }
    } else {
      console.log('   ❌ Failed to create Razorpay order');
    }
  } catch (error) {
    console.error('   ❌ Error in payment verification:', error.message);
  }

  console.log('\n✅ Simple payment test completed!');
}

testSimplePayment().catch(console.error);
