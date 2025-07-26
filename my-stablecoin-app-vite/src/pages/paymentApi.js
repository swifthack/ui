// paymentApi.js
// Utility for sending payment via API

export async function sendPaymentApi(payload) {
  try {
    const response = await fetch('/api/transaction', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Payment failed');
    }
    return await response.json();
  } catch (err) {
    throw err;
  }
}
