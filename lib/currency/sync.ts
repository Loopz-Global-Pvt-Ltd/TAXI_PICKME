import { query } from '../db'

export interface ExchangeRate {
  currency_code: string
  rate: number
  last_updated: Date
}

/**
 * Fetches latest exchange rates from external API and updates database
 */
export async function syncExchangeRates(): Promise<boolean> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    if (!res.ok) throw new Error('API request failed')
    
    const data = await res.json()
    const lkrRate = data.rates.LKR
    const eurRate = data.rates.EUR
    
    if (!lkrRate || !eurRate) throw new Error('Missing currency rates in API response')
    
    // Bulk upsert
    await query(`
      INSERT INTO exchange_rates (currency_code, rate, last_updated)
      VALUES 
        ('USD', 1.0000, CURRENT_TIMESTAMP),
        ('LKR', $1, CURRENT_TIMESTAMP),
        ('EUR', $2, CURRENT_TIMESTAMP)
      ON CONFLICT (currency_code) DO UPDATE 
      SET rate = EXCLUDED.rate, last_updated = EXCLUDED.last_updated
    `, [lkrRate, eurRate])
    
    return true
  } catch (error) {
    console.error('Error syncing exchange rates:', error)
    return false
  }
}

/**
 * Retrieves the currently stored exchange rates from the database
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  try {
    const result = await query<{currency_code: string, rate: number}>('SELECT currency_code, rate FROM exchange_rates')
    const rates: Record<string, number> = {}
    
    result.rows.forEach(row => {
      rates[row.currency_code] = Number(row.rate)
    })
    
    // Fallback if DB is empty
    if (Object.keys(rates).length === 0) {
      rates['USD'] = 1
      rates['LKR'] = 300 // placeholder
      rates['EUR'] = 0.9 // placeholder
    }
    
    return rates
  } catch (error) {
    console.error('Error retrieving exchange rates:', error)
    return { USD: 1, LKR: 300, EUR: 0.9 } // absolute fallback
  }
}
