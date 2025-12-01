import crypto from 'crypto'

export interface OnePayCheckoutRequest {
  currency: string
  app_id: string
  hash: string
  amount: number
  reference: string
  customer_first_name: string
  customer_last_name: string
  customer_phone_number: string
  customer_email: string
  transaction_redirect_url: string
  additionalData?: string
}

export interface OnePayCheckoutResponse {
  status: number
  message: string
  data: {
    ipg_transaction_id: string
    amount: {
      gross_amount: number
      discount: number
      handling_fee: number
      net_amount: number
      currency: string
    }
    gateway: {
      redirect_url: string
    }
  }
}

export interface OnePayStatusRequest {
  app_id: string
  onepay_transaction_id: string
}

export interface OnePayStatusResponse {
  status: number
  message: string
  data: {
    ipg_transaction_id: string
    currency: string
    amount: number
    transaction_request_datetime: string
    status: boolean
    paid_on: string | null
  }
}

export interface OnePayCallbackData {
  transaction_id: string
  status: number
  status_message: string
  additional_data: string
}

/**
 * Generate SHA-256 hash for OnePay payment request
 * Formula: app_id + currency + amount + HASH_SALT
 */
export function generateOnePayHash(
  appId: string,
  currency: string,
  amount: number,
  hashSalt: string
): string {
  const concatenated = `${appId}${currency}${Number(amount).toFixed(2)}${hashSalt}`
  return crypto.createHash('sha256').update(concatenated).digest('hex')
}

/**
 * Create checkout link via OnePay API
 */
export async function createOnePayCheckout(
  amount: number,
  reference: string,
  customerData: {
    firstName: string
    lastName: string
    phone: string
    email: string
  },
  redirectUrl: string,
  additionalData?: string
): Promise<OnePayCheckoutResponse> {
  const appId = process.env.ONEPAY_APP_ID!
  const currency = process.env.ONEPAY_CURRENCY!
  const hashSalt = process.env.ONEPAY_HASH_SALT!
  const appToken = process.env.ONEPAY_APP_TOKEN!
  const apiUrl = process.env.ONEPAY_API_URL!

  const hash = generateOnePayHash(appId, currency, amount, hashSalt)

  const requestBody: OnePayCheckoutRequest = {
    currency,
    app_id: appId,
    hash,
    amount: parseFloat(Number(amount).toFixed(2)),
    reference,
    customer_first_name: customerData.firstName,
    customer_last_name: customerData.lastName,
    customer_phone_number: customerData.phone,
    customer_email: customerData.email,
    transaction_redirect_url: redirectUrl,
    additionalData: additionalData || '',
  }

  const response = await fetch(`${apiUrl}/checkout/link/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': appToken,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create checkout link')
  }

  return response.json()
}

/**
 * Check payment status via OnePay API
 */
export async function checkOnePayStatus(
  transactionId: string
): Promise<OnePayStatusResponse> {
  const appId = process.env.ONEPAY_APP_ID!
  const appToken = process.env.ONEPAY_APP_TOKEN!
  const apiUrl = process.env.ONEPAY_API_URL!

  const requestBody: OnePayStatusRequest = {
    app_id: appId,
    onepay_transaction_id: transactionId,
  }

  const response = await fetch(`${apiUrl}/transaction/status/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': appToken,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to check payment status')
  }

  return response.json()
}

/**
 * Validate OnePay callback data
 */
export function validateOnePayCallback(callbackData: OnePayCallbackData): boolean {
  return (
    !!callbackData.transaction_id &&
    typeof callbackData.status === 'number' &&
    callbackData.status_message !== undefined
  )
}
