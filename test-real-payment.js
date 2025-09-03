import fetch from 'node-fetch';

const SUPABASE_URL = 'https://xdfxkumdypnpzibmhxji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZnhrdW1keXBu' +
  'cHppYm1oeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODgyMjMsImV4cCI6MjA2MTE2NDIyM30.LRlI-8E6deq0_Ge-X-JV0Let8Xv0' +
  'AgN-bALu5olfX-g';

async function testRealPaymentFlow() {
  console.log('🧪 Testing Real Payment Flow with Real Data...\n');

  // Step 1: Create a real order in the database first
  console.log('1️⃣ Creating a real order in database...');
  let realOrderId = null;
  let realUserId = null;
  let realAddressId = null;
  
  try {
    // First, let's check if there are any existing users
    const usersResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    
    if (usersResponse.status === 200) {
      const users = await usersResponse.json();
      if (users.length > 0) {
        realUserId = users[0].id;
        console.log('   ✅ Found existing user:', realUserId);
      }
    }
    
    // Create a real address first
    console.log('   Creating address...');
    const addressData = {
      user_id: realUserId || '00000000-0000-0000-0000-000000000000',
      name: 'Test User',
      mobile: '9876543210',
      email: 'test@example.com',
      state: 'Telangana',
      district: 'Hyderabad',
      address: 'Test Address',
      pincode: '500001',
      is_default: true
    };
    
    const addressResponse = await fetch(`${SUPABASE_URL}/rest/v1/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(addressData),
    });

    if (addressResponse.status === 201) {
      const addressResult = await addressResponse.json();
      realAddressId = addressResult[0].id;
      console.log('   ✅ Address created:', realAddressId);
    } else {
      console.log('   ⚠️ Address creation failed, trying to use existing address...');
      // Try to find existing address
      const existingAddressResponse = await fetch(`${SUPABASE_URL}/rest/v1/addresses?select=id&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
      });
      
      if (existingAddressResponse.status === 200) {
        const existingAddresses = await existingAddressResponse.json();
        if (existingAddresses.length > 0) {
          realAddressId = existingAddresses[0].id;
          console.log('   ✅ Using existing address:', realAddressId);
        }
      }
    }
    
    if (!realAddressId) {
      console.log('   ❌ No address available, cannot create order');
      return;
    }
    
    // Create a real order
    const orderData = {
      user_id: realUserId || '00000000-0000-0000-0000-000000000000',
      address_id: realAddressId,
      total_amount: 100,
      payment_method: 'ONLINE',
      payment_status: 'pending',
      order_status: 'pending'
    };
    
    const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(orderData),
    });

    console.log('   Order creation status:', orderResponse.status);
    if (orderResponse.status === 201) {
      const orderResult = await orderResponse.json();
      realOrderId = orderResult[0].id;
      console.log('   ✅ Real order created:', realOrderId);
    } else {
      const errorResult = await orderResponse.json();
      console.log('   ❌ Failed to create order:', errorResult);
      return;
    }
  } catch (error) {
    console.error('   ❌ Error creating real order:', error.message);
    return;
  }

  // Step 2: Create Razorpay order
  console.log('\n2️⃣ Creating Razorpay order...');
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
        receipt: 'real_receipt_' + Date.now()
      }),
    });

    const orderResult = await orderResponse.json();
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

  // Step 3: Test payment verification with REAL data
  console.log('\n3️⃣ Testing payment verification with REAL data...');
  try {
    const verifyResponse = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        razorpay_payment_id: 'real_payment_' + Date.now(),
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: 'real_signature_' + Date.now(),
        order_id: realOrderId,        // REAL order ID from database
        user_id: realUserId || '00000000-0000-0000-0000-000000000000', // REAL user ID
        amount: 100,
        currency: 'INR',
        payment_method: 'ONLINE'
      }),
    });

    console.log('   Status:', verifyResponse.status);
    const verifyResult = await verifyResponse.json();
    console.log('   Response:', verifyResult);
    
    if (verifyResult.success) {
      console.log('   ✅ Payment verification successful!');
      console.log('   🎉 Transaction history should now be created!');
    } else {
      console.log('   ❌ Payment verification failed:', verifyResult.error);
      console.log('   Details:', verifyResult.details);
    }
  } catch (error) {
    console.error('   ❌ Error in payment verification:', error.message);
  }

  // Step 4: Check if transaction was actually created
  console.log('\n4️⃣ Checking if transaction history was created...');
  try {
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/transaction_history?select=*&limit=5&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });

    if (checkResponse.status === 200) {
      const transactions = await checkResponse.json();
      console.log('   ✅ Found', transactions.length, 'transactions');
      if (transactions.length > 0) {
        console.log('   Latest transaction:', {
          id: transactions[0].id,
          order_id: transactions[0].order_id,
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

  console.log('\n✅ Real payment flow test completed!');
}

testRealPaymentFlow().catch(console.error);
