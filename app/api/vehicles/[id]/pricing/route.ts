import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET vehicle-specific pricing
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect()
  
  try {
    const { id } = await params
    const vehicleId = parseInt(id)

    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vehicle ID' },
        { status: 400 }
      )
    }

    const result = await client.query(
      `SELECT 
        id, name, category,
        base_rate, minimum_fare,
        tier_1_upto_km, tier_1_multiplier,
        tier_2_upto_km, tier_2_multiplier,
        tier_3_upto_km, tier_3_multiplier,
        tier_4_upto_km, tier_4_multiplier,
        tier_5_upto_km, tier_5_multiplier,
        tier_6_upto_km, tier_6_multiplier,
        tier_7_upto_km, tier_7_multiplier,
        tier_8_upto_km, tier_8_multiplier,
        tier_9_upto_km, tier_9_multiplier,
        tier_10_upto_km, tier_10_multiplier,
        tier_11_upto_km, tier_11_multiplier,
        tier_12_multiplier
      FROM vehicles 
      WHERE id = $1`,
      [vehicleId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error fetching vehicle pricing:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// PUT update vehicle-specific pricing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect()
  
  try {
    const { id } = await params
    const vehicleId = parseInt(id)
    const body = await request.json()

    const {
      baseRate, minimumFare,
      tier1UptoKm, tier1Multiplier,
      tier2UptoKm, tier2Multiplier,
      tier3UptoKm, tier3Multiplier,
      tier4UptoKm, tier4Multiplier,
      tier5UptoKm, tier5Multiplier,
      tier6UptoKm, tier6Multiplier,
      tier7UptoKm, tier7Multiplier,
      tier8UptoKm, tier8Multiplier,
      tier9UptoKm, tier9Multiplier,
      tier10UptoKm, tier10Multiplier,
      tier11UptoKm, tier11Multiplier,
      tier12Multiplier,
    } = body

    const result = await client.query(
      `UPDATE vehicles SET
        base_rate = $1, minimum_fare = $2,
        tier_1_upto_km = $3, tier_1_multiplier = $4,
        tier_2_upto_km = $5, tier_2_multiplier = $6,
        tier_3_upto_km = $7, tier_3_multiplier = $8,
        tier_4_upto_km = $9, tier_4_multiplier = $10,
        tier_5_upto_km = $11, tier_5_multiplier = $12,
        tier_6_upto_km = $13, tier_6_multiplier = $14,
        tier_7_upto_km = $15, tier_7_multiplier = $16,
        tier_8_upto_km = $17, tier_8_multiplier = $18,
        tier_9_upto_km = $19, tier_9_multiplier = $20,
        tier_10_upto_km = $21, tier_10_multiplier = $22,
        tier_11_upto_km = $23, tier_11_multiplier = $24,
        tier_12_multiplier = $25,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $26
      RETURNING *`,
      [
        baseRate, minimumFare,
        tier1UptoKm, tier1Multiplier,
        tier2UptoKm, tier2Multiplier,
        tier3UptoKm, tier3Multiplier,
        tier4UptoKm, tier4Multiplier,
        tier5UptoKm, tier5Multiplier,
        tier6UptoKm, tier6Multiplier,
        tier7UptoKm, tier7Multiplier,
        tier8UptoKm, tier8Multiplier,
        tier9UptoKm, tier9Multiplier,
        tier10UptoKm, tier10Multiplier,
        tier11UptoKm, tier11Multiplier,
        tier12Multiplier,
        vehicleId
      ]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Vehicle pricing updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating vehicle pricing:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
