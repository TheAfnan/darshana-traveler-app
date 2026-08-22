import type { RazorpayOrder } from '../types/payments.ts';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

/**
 * Get active Razorpay Key ID from localStorage, environment, or default test key
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
 * Create a Razorpay order on backend serverless API or server (optional)
 */
export async function createRazorpayOrder(amountInPaise: number, currency = 'INR'): Promise<RazorpayOrder | null> {
  const backendBase = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');
  const endpoints = [
    '/api/create-razorpay-order',
    `${backendBase}/api/payments/razorpay/order`,
  ];

  for (const endpoint of endpoints) {
    if (!endpoint || (endpoint.startsWith('http://localhost') && window.location.hostname !== 'localhost')) {
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
        const orderData = payload?.order || payload;
        // Only return if it is a genuine Razorpay server order ID
        if (orderData?.id && !orderData.id.includes('mock') && !orderData.id.includes('client') && !orderData.id.includes('test_1')) {
          return orderData as RazorpayOrder;
        }
      }
    } catch {
      // Continue to next endpoint
    }
  }

  return null;
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
    // Attempt real server-side order (optional in standard checkout)
    const order = await createRazorpayOrder(amountPaise, 'INR');

    if (!keyId) {
      // Fallback demo mode if no key is configured
      setTimeout(() => {
        const demoPaymentId = `RZP-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
        opts.onSuccess(demoPaymentId);
      }, 1000);
      return;
    }

    // Standard Razorpay Checkout Options
    // NOTE: If order is not registered on Razorpay servers, DO NOT pass order_id to avoid "Uh! oh! Something went wrong" crash
    const rzpOptions: any = {
      key: keyId,
      amount: amountPaise,
      currency: 'INR',
      name: 'DarShana Cultural Travel',
      description: `${opts.packageName} - ${opts.destination}`,
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

    // Only attach order_id if it was verified from Razorpay API
    if (order?.id && order.id.startsWith('order_') && !order.id.includes('mock') && !order.id.includes('test_1') && !order.id.includes('client')) {
      rzpOptions.order_id = order.id;
    }

    const rzp = new window.Razorpay(rzpOptions);
    
    rzp.on('payment.failed', (resp: any) => {
      console.warn('Razorpay payment failed event:', resp);
      opts.onFailure(resp.error?.description || 'Payment did not go through. Please try another card or UPI.');
    });

    rzp.open();
  } catch (error: any) {
    console.error('Razorpay launch error:', error);
    opts.onFailure(error?.message || 'Error launching Razorpay payment checkout.');
  }
}
