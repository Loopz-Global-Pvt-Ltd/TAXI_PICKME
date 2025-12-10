import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET all pricing configurations
export async function GET() {
  const client = await pool.connect()
  
  try {
    const result = await client.query(
      `SELECT * FROM pricing_configs ORDER BY vehicle_category`
    )

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error: any) {
    console.error('Error fetching pricing configs:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// POST create new pricing configuration
export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const body = await request.json()
    const {
      vehicleCategory,
      baseRate,
      minimumFare,
      tier1UptoKm,
      tier1Multiplier,
      tier2UptoKm,
      tier2Multiplier,
      tier3UptoKm,
      tier3Multiplier,
      tier4Multiplier,
    } = body

    const result = await client.query(
      `INSERT INTO pricing_configs (
        vehicle_category, base_rate, minimum_fare,
        tier_1_upto_km, tier_1_multiplier,
        tier_2_upto_km, tier_2_multiplier,
        tier_3_upto_km, tier_3_multiplier,
        tier_4_multiplier
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        vehicleCategory, baseRate, minimumFare,
        tier1UptoKm, tier1Multiplier,
        tier2UptoKm, tier2Multiplier,
        tier3UptoKm, tier3Multiplier,
        tier4Multiplier
      ]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Pricing configuration created successfully'
    })
  } catch (error: any) {
    console.error('Error creating pricing config:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
