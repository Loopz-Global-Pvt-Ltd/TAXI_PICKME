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
        id,
        name,
        category,
        base_rate,
        minimum_fare,
        tier_1_upto_km,
        tier_1_multiplier,
        tier_2_upto_km,
        tier_2_multiplier,
        tier_3_upto_km,
        tier_3_multiplier,
        tier_4_multiplier,
        use_category_pricing
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
      baseRate,
      minimumFare,
      tier1UptoKm,
      tier1Multiplier,
      tier2UptoKm,
      tier2Multiplier,
      tier3UptoKm,
      tier3Multiplier,
      tier4Multiplier,
      useCategoryPricing
    } = body

    const result = await client.query(
      `UPDATE vehicles SET
        base_rate = $1,
        minimum_fare = $2,
        tier_1_upto_km = $3,
        tier_1_multiplier = $4,
        tier_2_upto_km = $5,
        tier_2_multiplier = $6,
        tier_3_upto_km = $7,
        tier_3_multiplier = $8,
        tier_4_multiplier = $9,
        use_category_pricing = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *`,
      [
        baseRate, minimumFare,
        tier1UptoKm, tier1Multiplier,
        tier2UptoKm, tier2Multiplier,
        tier3UptoKm, tier3Multiplier,
        tier4Multiplier, useCategoryPricing,
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
