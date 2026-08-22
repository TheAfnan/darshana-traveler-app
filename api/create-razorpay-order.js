// Vercel Serverless Function: Create Razorpay Order
export default async function handler(req, res) {
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

    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_TSfdKWJwijDBTO';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'k3TG12iTzf4lEyGi9z9BYazm';

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
      console.warn('Razorpay server order error:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
