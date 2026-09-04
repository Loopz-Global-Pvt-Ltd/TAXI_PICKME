import { NextResponse } from 'next/server'
import { getExchangeRates, syncExchangeRates } from '@/lib/currency/sync'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Optional: check if rates are older than 24h and trigger background sync if so
    const ageResult = await query<{age_hours: number}>(`
      SELECT EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - last_updated))/3600 AS age_hours 
      FROM exchange_rates 
      WHERE currency_code = 'USD' LIMIT 1
    `)
    
    if (ageResult.rows.length === 0 || ageResult.rows[0].age_hours > 24) {
      // Sync in background without blocking request
      syncExchangeRates().catch(console.error)
    }

    const rates = await getExchangeRates()
    
    return NextResponse.json({
      success: true,
      data: rates
    })
  } catch (error: any) {
    console.error('Error in GET /api/currency/rates', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rates' },
      { status: 500 }
    )
  }
}
