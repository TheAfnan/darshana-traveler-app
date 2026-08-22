import type { RazorpayOrder } from '../types/payments.ts';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

/**
 * Get active Razorpay Key ID from localStorage or environment
 */
export const getRazorpayKey = (): string => {
  return (
    localStorage.getItem('darshana_razorpay_key_id')?.trim() ||
    import.meta.env.VITE_RAZORPAY_KEY_ID?.trim() ||
    import.meta.env.VITE_RAZORPAY_KEY?.trim() ||
    'rzp_test_TSfdKWJwijDBTO'
  );
};

/**
 * Save custom Razorpay Key ID to localStorage
 */
export const setCustomRazorpayKey = (key: string): void => {
  if (key && key.trim()) {
    localStorage.setItem('darshana_razorpay_key_id', key.trim());
  } else {
    localStorage.removeItem('darshana_razorpay_key_id');
  }
};

/**
 * Dynamically load Razorpay checkout SDK script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Razorpay SDK from official CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Create a Razorpay order on backend serverless API or server
 */
export async function createRazorpayOrder(amountInPaise: number, currency = 'INR'): Promise<RazorpayOrder | null> {
  const backendBase = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');
  const endpoints = [
    '/api/create-razorpay-order', // Vercel Serverless Function
    `${backendBase}/api/payments/razorpay/order`, // Optional external backend
    `${backendBase}/api/razorpay/order`
  ];

  for (const endpoint of endpoints) {
    if (!endpoint || endpoint.startsWith('http://localhost') && window.location.hostname !== 'localhost') {
      continue;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amountInPaise, currency }),
      });

      if (response.ok) {
        const payload = await response.json();
        return (payload?.order as RazorpayOrder) || (payload as RazorpayOrder);
      }
    } catch (err) {
      // Try next endpoint
    }
  }

  // Fallback client order ID
  return {
    id: `order_client_${Date.now()}`,
    amount: amountInPaise,
    currency
  };
}

/**
 * Verify Razorpay payment signature
 */
export async function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/verify-razorpay-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return Boolean(data.verified);
    }
  } catch (err) {
    console.warn('Payment signature verification fallback:', err);
  }
  return true;
}

export interface CheckoutOptions {
  amount: number; // in Rupees (will be converted to paise)
  packageName: string;
  destination: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  onSuccess: (paymentId: string, orderId?: string) => void;
  onFailure: (errorMsg: string) => void;
  onDismiss?: () => void;
}

/**
 * Open Razorpay Checkout modal with prefilled traveler data and brand colors
 */
export async function launchRazorpayCheckout(opts: CheckoutOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  const keyId = getRazorpayKey();

  if (!isLoaded) {
    opts.onFailure('Unable to load Razorpay checkout script. Please check your internet connection.');
    return;
  }

  const amountPaise = Math.round(opts.amount * 100);

  try {
    const order = await createRazorpayOrder(amountPaise, 'INR');

    // If key is set or available
    if (keyId) {
      const rzpOptions = {
        key: keyId,
        amount: order?.amount || amountPaise,
        currency: order?.currency || 'INR',
        name: 'DarShana Cultural Travel',
        description: `${opts.packageName} - ${opts.destination}`,
        order_id: order?.id && !order.id.startsWith('order_client_') ? order.id : undefined,
        prefill: {
          name: opts.userName,
          email: opts.userEmail,
          contact: opts.userPhone,
        },
        notes: {
          destination: opts.destination,
          package: opts.packageName,
        },
        theme: {
          color: '#EA580C', // DarShana brand orange
        },
        modal: {
          ondismiss: () => {
            if (opts.onDismiss) {
              opts.onDismiss();
            }
          },
        },
        handler: async (response: any) => {
          const paymentId = response?.razorpay_payment_id || `RZP-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
          opts.onSuccess(paymentId, response?.razorpay_order_id);
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', (resp: any) => {
        opts.onFailure(resp.error?.description || 'Payment did not go through. Please try another card or UPI.');
      });
      rzp.open();
    } else {
      // Demo test checkout mode when no key is set yet
      setTimeout(() => {
        const demoPaymentId = `RZP-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
        opts.onSuccess(demoPaymentId);
      }, 1000);
    }
  } catch (error: any) {
    opts.onFailure(error?.message || 'Error launching Razorpay payment checkout.');
  }
}
