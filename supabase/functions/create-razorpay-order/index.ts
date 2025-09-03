// We'll import Razorpay dynamically inside the function

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Function to get CORS headers based on origin
const getCorsHeaders = (origin: string) => {
  const allowedOrigins = [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // Alternative dev port
    'http://localhost:4173',  // Vite preview
    'http://localhost:8080',  // Alternative dev port
    'https://yourdomain.com'  // Replace with your production domain
  ];
  
  // For development, allow all localhost origins
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    };
  }
  
  // For production, check against allowed origins
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'http://localhost:5173',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
};

interface RazorpayOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

const validateEnv = () => {
  const keyId = Deno.env.get('RAZORPAY_KEY_ID');
  const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

  console.log('🔍 Environment variables check:');
  console.log('  - RAZORPAY_KEY_ID exists:', !!keyId);
  console.log('  - RAZORPAY_KEY_SECRET exists:', !!keySecret);
  console.log('  - Key ID length:', keyId ? keyId.length : 0);
  console.log('  - Key Secret length:', keySecret ? keySecret.length : 0);
  console.log('  - Key ID value (first 10 chars):', keyId ? keyId.substring(0, 10) + '...' : 'undefined');
  console.log('  - Key ID value (last 10 chars):', keyId ? '...' + keyId.substring(keyId.length - 10) : 'undefined');
  console.log('  - Key ID raw value:', JSON.stringify(keyId));

  if (!keyId || !keySecret) {
    const missingVars = [];
    if (!keyId) missingVars.push('RAZORPAY_KEY_ID');
    if (!keySecret) missingVars.push('RAZORPAY_KEY_SECRET');
    
    throw new Error(`Payment system configuration error: Missing ${missingVars.join(', ')}`);
  }

  // Validate key format - allow underscores in the key part
  console.log('🔑 Validating Razorpay key format:', keyId);
  console.log('🔑 Key type:', typeof keyId);
  console.log('🔑 Key length:', keyId.length);
  console.log('🔑 Key characters:', keyId.split('').map(c => c.charCodeAt(0)));
  
  const regex = /^rzp_(live|test)_[a-zA-Z0-9_]+$/;
  const match = keyId.match(regex);
  console.log('🔑 Regex match result:', match);
  
  if (!match) {
    console.error('❌ Invalid key format:', keyId);
    console.error('❌ Expected format: rzp_(live|test)_[letters/numbers/underscores]');
    console.error('❌ Regex pattern:', regex.source);
    throw new Error('Payment system configuration error: Invalid key format');
  }
  console.log('✅ Key format validation passed');

  return { keyId, keySecret };
};

const createResponse = (data: any, status = 200, origin: string) => {
  const dynamicCorsHeaders = getCorsHeaders(origin);
  
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...dynamicCorsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

Deno.serve(async (req) => {
  console.log('Received request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Get origin from request headers
  const origin = req.headers.get('origin') || 'http://localhost:5173';
  
  // Simple CORS headers that work for development
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        error: `Method ${req.method} not allowed`,
      }), {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Get environment variables
    const credentials = validateEnv();
    console.log('Environment validation passed');

    // Parse request body
    let body: RazorpayOrderRequest;
    try {
      body = await req.json();
      console.log('📥 Raw request body received:', body);
      console.log('📏 Body length:', JSON.stringify(body).length);
      console.log('🔍 Checking required fields:');
      console.log('  - amount:', !!body.amount, body.amount, typeof body.amount);
      console.log('  - currency:', !!body.currency, body.currency, typeof body.currency);
      console.log('  - receipt:', !!body.receipt, body.receipt, typeof body.receipt);
      console.log('  - notes:', !!body.notes, body.notes, typeof body.notes);
      
      console.log('Request body:', {
        ...body,
        amount: body.amount / 100, // Convert paise to rupees for logging
      });
    } catch (parseError) {
        console.error('Failed to parse request body:', parseError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid request body',
          details: 'Failed to parse JSON request body'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }

    // Validate request body
    console.log('🔍 Starting validation...');
    console.log('  - body.amount exists:', !!body.amount, 'value:', body.amount);
    console.log('  - body.currency exists:', !!body.currency, 'value:', body.currency);
    console.log('  - body.receipt exists:', !!body.receipt, 'value:', body.receipt);
    
    if (!body.amount || !body.currency || !body.receipt) {
      const invalidParams = [];
      if (!body.amount) invalidParams.push('amount');
      if (!body.currency) invalidParams.push('currency');
      if (!body.receipt) invalidParams.push('receipt');

      console.error('❌ Missing required parameters:', invalidParams);
      console.error('❌ Full body object:', body);
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required parameters',
        details: `Required parameters not provided: ${invalidParams.join(', ')}`
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
    
    console.log('✅ All required parameters present');

    // Validate amount
    if (body.amount < 100) {
      console.error('Invalid amount:', body.amount);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid amount',
        details: 'Amount must be at least 100 paise (₹1)'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Initialize Razorpay with dynamic import
    console.log('Initializing Razorpay with key_id:', credentials.keyId);
    
    // Dynamically import Razorpay
    let Razorpay;
    try {
      const RazorpayModule = await import('npm:razorpay@2.9.2');
      Razorpay = RazorpayModule.default || RazorpayModule;
      console.log('✅ Razorpay module imported successfully');
    } catch (importError) {
      console.error('❌ Failed to import Razorpay module:', importError);
      throw new Error('Failed to load payment gateway module');
    }
    
    const razorpay = new Razorpay({
      key_id: credentials.keyId,
      key_secret: credentials.keySecret,
    });

    // Create order
    console.log('Creating Razorpay order with params:', {
      ...body,
      amount: body.amount / 100, // Convert paise to rupees for logging
    });

    const order = await razorpay.orders.create({
      amount: body.amount,
      currency: body.currency,
      receipt: body.receipt,
      notes: body.notes || {},
    });

    console.log('Order created successfully:', {
      order_id: order.id,
      amount: order.amount / 100, // Convert paise to rupees for logging
      currency: order.currency
    });

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: credentials.keyId,
      },
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error creating order:', error);

    // Handle specific Razorpay errors
    if (error.error?.description) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Payment processing error',
        details: error.error.description
      }), {
        status: error.statusCode || 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create payment order',
      details: error.message
    }), {
      status: error.statusCode || 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});