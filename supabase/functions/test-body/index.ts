Deno.serve(async (req) => {
  console.log('🧪 Test function called');
  console.log('📥 Method:', req.method);
  console.log('📥 URL:', req.url);
  console.log('📥 Headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  try {
    // Try to read the request body
    const rawBody = await req.text();
    console.log('📥 Raw body received:', rawBody);
    console.log('📏 Body length:', rawBody.length);
    
    // Try to parse as JSON
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
      console.log('✅ JSON parsed successfully:', parsedBody);
    } catch (parseError) {
      console.log('❌ JSON parse failed:', parseError);
      parsedBody = null;
    }

    return new Response(JSON.stringify({
      success: true,
      method: req.method,
      bodyReceived: !!rawBody,
      bodyLength: rawBody.length,
      bodyContent: rawBody,
      parsedBody: parsedBody,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  } catch (error) {
    console.error('❌ Error in test function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }
});
