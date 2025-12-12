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
  additional_data?: string
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

/**
 * Generate SHA-256 hash for OnePay API
 * Formula: app_id + currency + amount + hash_salt
 */
export function generateOnePayHash(
  appId: string,
  currency: string,
  amount: number,
  hashSalt: string
): string {
  const amountStr = amount.toFixed(2)
  const concatenated = `${appId}${currency}${amountStr}${hashSalt}`
  
  const hash = crypto
    .createHash('sha256')
    .update(concatenated)
    .digest('hex')
  
  console.log('Hash Generation:', {
    input: concatenated,
    hash: hash
  })
  
  return hash
}

/**
 * Create OnePay checkout link
 */
export async function createOnePayCheckout(
  request: Omit<OnePayCheckoutRequest, 'hash' | 'app_id' | 'currency'>
): Promise<OnePayCheckoutResponse> {
  const appId = process.env.ONEPAY_APP_ID!
  const hashSalt = process.env.ONEPAY_HASH_SALT!
  const appToken = process.env.ONEPAY_APP_TOKEN!
  const currency = process.env.ONEPAY_CURRENCY || 'LKR'
  
  const hash = generateOnePayHash(appId, currency, request.amount, hashSalt)
  
  const payload: OnePayCheckoutRequest = {
    currency,
    app_id: appId,
    hash,
    ...request
  }
  
  console.log('OnePay Checkout Request:', payload)
  
  const response = await fetch('https://api.onepay.lk/v3/checkout/link/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': appToken
    },
    body: JSON.stringify(payload)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    console.error('OnePay API Error:', data)
    throw new Error(data.message || `OnePay API error: ${response.status}`)
  }
  
  return data
}

/**
 * Get OnePay transaction status
 */
export async function getOnePayTransactionStatus(
  transactionId: string
): Promise<OnePayStatusResponse> {
  const appId = process.env.ONEPAY_APP_ID!
  
  const payload: OnePayStatusRequest = {
    app_id: appId,
    onepay_transaction_id: transactionId
  }
  
  const response = await fetch('https://api.onepay.lk/v3/transaction/status/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    console.error('OnePay Status Check Error:', data)
    throw new Error(data.message || `OnePay status check error: ${response.status}`)
  }
  
  return data
}
