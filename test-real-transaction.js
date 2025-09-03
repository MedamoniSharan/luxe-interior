import fetch from 'node-fetch';

const SUPABASE_URL = 'https://xdfxkumdypnpzibmhxji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZnhrdW1keXBu' +
  'cHppYm1oeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODgyMjMsImV4cCI6MjA2MTE2NDIyM30.LRlI-8E6deq0_Ge-X-JV0Let8Xv0' +
  'AgN-bALu5olfX-g';

async function testRealTransaction() {
  console.log('🧪 Testing Real Transaction Creation...\n');

  // Use the real order ID we found in the previous test
  const realOrderId = 'e3b74788-4d92-4d91-b815-35791811ccfb';
  const realUserId = '068ec69f-125a-44fc-95bd-91c70bab26fa';

  console.log('1️⃣ Testing transaction creation with real data...');
  console.log('   Order ID:', realOrderId);
  console.log('   User ID:', realUserId);
  
  try {
    const transactionResponse = await fetch(`${SUPABASE_URL}/rest/v1/transaction_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        order_id: realOrderId,
        user_id: realUserId,
        transaction_id: 'test_transaction_' + Date.now(),
        payment_method: 'ONLINE',
        amount: 100,
        currency: 'INR',
        status: 'completed',
        gateway_response: {
          razorpay_payment_id: 'test_payment_' + Date.now(),
          razorpay_order_id: 'order_test_' + Date.now(),
          test: true,
          timestamp: new Date().toISOString()
        }
      }),
    });

    console.log('   Status:', transactionResponse.status);
    const transactionResult = await transactionResponse.json();
    console.log('   Response:', transactionResult);
    
    if (transactionResponse.status === 201) {
      console.log('   ✅ Transaction history created successfully!');
      console.log('   Transaction ID:', transactionResult[0].id);
    } else {
      console.log('   ❌ Failed to create transaction history');
      console.log('   Error details:', transactionResult);
    }
  } catch (error) {
    console.error('   ❌ Error creating transaction history:', error.message);
  }

  // Check if transaction was created
  console.log('\n2️⃣ Verifying transaction was created...');
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

  console.log('\n✅ Real transaction test completed!');
}

testRealTransaction().catch(console.error);
