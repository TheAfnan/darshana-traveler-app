// Vercel Serverless Function: Create Razorpay Order
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body || {};

    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // If keys not set on server, return mock order for client-side fallback
      return res.status(200).json({
        id: `order_mock_${Date.now()}`,
        amount: Math.round(Number(amount) || 50000),
        currency,
        receipt,
        status: 'created',
        message: 'Serverless mock order created (set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel for live orders).'
      });
    }

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount)), // in paise
        currency,
        receipt,
        payment_capture: 1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.description || 'Failed to create order with Razorpay'
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
