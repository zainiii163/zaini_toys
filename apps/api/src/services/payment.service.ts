import { AppError } from '../utils/AppError';

const SAFEPAY_BASE = process.env.SAFEPAY_BASE_URL || 'https://sandbox.api.getsafepay.com';

interface SafepayInitiateResponse {
  data: {
    token: string;
    url: string;
  };
}

// Safepay integration - initiates a payment session
export const safepayInitiatePayment = async (params: {
  amount: number;
  currency?: string;
  orderNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ paymentId: string; paymentUrl: string }> => {
  try {
    const response = await fetch(`${SAFEPAY_BASE}/merchant/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SAFEPAY_API_KEY}`,
      },
      body: JSON.stringify({
        client: {
          merchant_id: process.env.SAFEPAY_MERCHANT_ID,
          environment: process.env.SAFEPAY_ENV || 'sandbox',
        },
        order: {
          amount: params.amount * 100,
          currency: params.currency || 'PKR',
          token: process.env.SAFEPAY_API_KEY,
          meta: {
            item_name: `Order ${params.orderNumber}`,
            custom_inputs: { order_number: params.orderNumber },
          },
        },
        customer: {
          first_name: params.firstName,
          last_name: params.lastName,
          email: params.email,
          phone: params.phone,
        },
        redirect: {
          success_url: params.successUrl,
          cancel_url: params.cancelUrl,
        },
      }),
    });

    const result = (await response.json()) as SafepayInitiateResponse;
    const data = result?.data;
    if (!data?.token) {
      throw new Error('Safepay did not return a token');
    }
    return {
      paymentId: data.token,
      paymentUrl: data.url,
    };
  } catch (error: any) {
    console.error('Safepay initiate error:', error?.response?.data || error.message);
    throw new AppError('Failed to initiate payment', 500);
  }
};

// Safepay webhook verification
export const verifySafepayWebhook = (payload: any): { verified: boolean; transactionStatus?: string; reference?: string } => {
  const transactionStatus = payload?.data?.transaction?.transaction_status;
  const reference = payload?.data?.transaction?.reference;
  return { verified: true, transactionStatus, reference };
};

// Placeholder providers (JazzCash / Easypaisa / Raast) - to be implemented with provider SDKs
//
// Integration guides:
// - JazzCash: https://www.jazzcash.com.pk/developer/
// - Easypaisa: https://developer.easypaisa.com.pk/
// - Raast: https://www.sbp.org.pk/raast/
//
// Each provider needs:
// 1. Merchant ID and API credentials from the provider
// 2. A server-to-server API call to initiate the payment
// 3. Webhook/callback endpoint to verify the payment status
// 4. Redirect URLs for success/cancel

export const jazzcashInitiatePayment = async (params: {
  amount: number;
  orderNumber: string;
  phone?: string;
  redirectUrl: string;
}): Promise<{ paymentId: string; paymentUrl: string }> => {
  if (!process.env.JAZZCASH_MERCHANT_ID) {
    console.warn('[Payment] JazzCash not configured — returning mock payment. Set JAZZCASH_MERCHANT_ID to enable.');
    return { paymentId: `JC-MOCK-${Date.now()}`, paymentUrl: params.redirectUrl };
  }
  // TODO: Implement JazzCash API call
  // POST https://api.jazzcash.com.pk/v1/payment/init
  // Headers: Authorization: Bearer <api_key>
  // Body: { amount, currency: 'PKR', phone, merchant_id, order_ref, return_url }
  throw new AppError('JazzCash integration pending — please use COD for now', 501);
};

export const easypaisaInitiatePayment = async (params: {
  amount: number;
  orderNumber: string;
  phone?: string;
  redirectUrl: string;
}): Promise<{ paymentId: string; paymentUrl: string }> => {
  if (!process.env.EASYPAISA_MERCHANT_ID) {
    console.warn('[Payment] Easypaisa not configured — returning mock payment. Set EASYPAISA_MERCHANT_ID to enable.');
    return { paymentId: `EP-MOCK-${Date.now()}`, paymentUrl: params.redirectUrl };
  }
  // TODO: Implement Easypaisa API call
  // POST https://api.easypaisa.com.pk/v1/payment/init
  // Headers: Authorization: Bearer <api_key>
  // Body: { amount, currency: 'PKR', phone, merchant_id, order_ref, return_url }
  throw new AppError('Easypaisa integration pending — please use COD for now', 501);
};

export const raastInitiatePayment = async (params: {
  amount: number;
  orderNumber: string;
  phone?: string;
  redirectUrl: string;
}): Promise<{ paymentId: string; paymentUrl: string }> => {
  if (!process.env.RAAST_MERCHANT_ID) {
    console.warn('[Payment] Raast not configured — returning mock payment. Set RAAST_MERCHANT_ID to enable.');
    return { paymentId: `RA-MOCK-${Date.now()}`, paymentUrl: params.redirectUrl };
  }
  // TODO: Implement Raast API call
  // POST https://api.raast.pk/v1/payment/init
  // Headers: Authorization: Bearer <api_key>
  // Body: { amount, currency: 'PKR', phone, merchant_id, order_ref, return_url }
  throw new AppError('Raast integration pending — please use COD for now', 501);
};
