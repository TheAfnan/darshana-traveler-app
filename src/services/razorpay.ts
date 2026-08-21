import type { RazorpayOrder } from '../types/payments.ts';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001').replace(/\/+$/, '');

/**
 * Create a Razorpay order on the backend. Returns null if backend is unreachable.
 */
export async function createRazorpayOrder(amount: number, currency = 'INR'): Promise<RazorpayOrder | null> {
  const endpoint = `${BACKEND_URL}/api/payments/razorpay/order`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Order creation failed: ${message || response.status}`);
    }

    const payload = await response.json();
    // Support both { order: {...} } and direct order response shapes
    return (payload?.order as RazorpayOrder) || (payload as RazorpayOrder);
  } catch (error) {
    console.warn('Razorpay order creation skipped (using client-only checkout):', error);
    return null;
  }
}
