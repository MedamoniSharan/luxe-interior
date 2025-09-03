import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

interface PaymentVerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
}

const validateEnv = () => {
  const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
  if (!keySecret) {
    throw new Error('Payment system configuration error: Missing RAZORPAY_KEY_SECRET');
  }
  return { keySecret };
};

const createResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

// Verify Razorpay signature
const verifySignature = (orderId: string, paymentId: string, signature: string, keySecret: string) => {
  const text = orderId + '|' + paymentId;
  const encoder = new TextEncoder();
  const key = encoder.encode(keySecret);
  const message = encoder.encode(text);
  
  // Use Web Crypto API for HMAC-SHA256
  return crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  ).then(key => {
    return crypto.subtle.sign('HMAC', key, message);
  }).then(signatureBuffer => {
    const signatureArray = new Uint8Array(signatureBuffer);
    const generated_signature = Array.from(signatureArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return generated_signature === signature;
  }).catch(() => false);
};

Deno.serve(async (req) => {
  console.log('📥 Received payment verification request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('🔄 Handling CORS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      console.log(`❌ Invalid method: ${req.method}`);
      return createResponse({
        success: false,
        error: `Method ${req.method} not allowed`,
      }, 405);
    }

    // Get environment variables
    const credentials = validateEnv();
    console.log('✅ Environment validation passed');

    // Parse request body
    let body: PaymentVerificationRequest;
    try {
      const rawBody = await req.text();
      console.log('📥 Raw request body received:', rawBody);
      console.log('📏 Body length:', rawBody.length);
      
      body = JSON.parse(rawBody);
      console.log('📥 Parsed request body:', body);
      console.log('🔍 Checking required fields:');
      console.log('  - razorpay_payment_id:', !!body.razorpay_payment_id, body.razorpay_payment_id);
      console.log('  - razorpay_order_id:', !!body.razorpay_order_id, body.razorpay_order_id);
      console.log('  - razorpay_signature:', !!body.razorpay_signature, body.razorpay_signature);
      console.log('  - order_id:', !!body.order_id, body.order_id);
      console.log('  - user_id:', !!body.user_id, body.user_id);
      console.log('  - amount:', !!body.amount, body.amount);
      console.log('  - currency:', !!body.currency, body.currency);
      console.log('  - payment_method:', !!body.payment_method, body.payment_method);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return createResponse({
        success: false,
        error: 'Invalid request body',
        details: 'Failed to parse JSON request body'
      }, 400);
    }

    // Validate request body
    if (!body.razorpay_payment_id || !body.razorpay_order_id || !body.razorpay_signature || !body.order_id || !body.user_id) {
      const invalidParams = [];
      if (!body.razorpay_payment_id) invalidParams.push('razorpay_payment_id');
      if (!body.razorpay_order_id) invalidParams.push('razorpay_order_id');
      if (!body.razorpay_signature) invalidParams.push('razorpay_signature');
      if (!body.order_id) invalidParams.push('order_id');
      if (!body.user_id) invalidParams.push('user_id');

      console.error('Missing required parameters:', invalidParams);
      return createResponse({
        success: false,
        error: 'Missing required parameters',
        details: `Required parameters not provided: ${invalidParams.join(', ')}`
      }, 400);
    }

    // Verify Razorpay signature
    const isValidSignature = verifySignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature,
      credentials.keySecret
    );

    if (!isValidSignature) {
      console.error('Invalid Razorpay signature');
      return createResponse({
        success: false,
        error: 'Invalid payment signature',
        details: 'Payment verification failed'
      }, 400);
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update order payment status
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'completed',
        order_status: 'confirmed'
      })
      .eq('id', body.order_id);

    if (orderUpdateError) {
      console.error('Error updating order:', orderUpdateError);
      throw new Error('Failed to update order status');
    }

    // Create transaction history record
    const { error: transactionError } = await supabase
      .from('transaction_history')
      .insert({
        order_id: body.order_id,
        user_id: body.user_id,
        transaction_id: body.razorpay_payment_id,
        payment_method: body.payment_method,
        amount: body.amount,
        currency: body.currency,
        status: 'completed',
        gateway_response: {
          razorpay_payment_id: body.razorpay_payment_id,
          razorpay_order_id: body.razorpay_order_id,
          razorpay_signature: body.razorpay_signature,
          verification_timestamp: new Date().toISOString()
        }
      });

    if (transactionError) {
      console.error('Error creating transaction history:', transactionError);
      throw new Error('Failed to create transaction history');
    }

    console.log('Payment verified and transaction history created successfully');

    // Return success response
    return createResponse({
      success: true,
      data: {
        order_id: body.order_id,
        payment_id: body.razorpay_payment_id,
        status: 'completed',
        message: 'Payment verified successfully'
      },
    });

  } catch (error) {
    console.error('Error verifying payment:', error);

    return createResponse({
      success: false,
      error: 'Failed to verify payment',
      details: error.message
    }, 500);
  }
});
