import fetch from 'node-fetch';

const SUPABASE_URL = 'https://xdfxkumdypnpzibmhxji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZnhrdW1keXBu' +
  'cHppYm1oeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODgyMjMsImV4cCI6MjA2MTE2NDIyM30.LRlI-8E6deq0_Ge-X-JV0Let8Xv0' +
  'AgN-bALu5olfX-g';

async function testTransactionCreation() {
  console.log('🧪 Testing Transaction Creation...\n');

  // Test creating a transaction record directly
  console.log('1️⃣ Testing direct transaction creation...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transaction_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        order_id: 'test-order-123',
        user_id: 'test-user-123',
        transaction_id: 'test-transaction-123',
        payment_method: 'ONLINE',
        amount: 100,
        currency: 'INR',
        status: 'completed',
        gateway_response: {
          test: true,
          timestamp: new Date().toISOString()
        }
      }),
    });

    console.log('   Status:', response.status);
    const result = await response.json();
    console.log('   Response:', result);
  } catch (error) {
    console.error('   ❌ Error:', error.message);
  }

  console.log('\n✅ Transaction creation test completed!');
}

testTransactionCreation().catch(console.error);
