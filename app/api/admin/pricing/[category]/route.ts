import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET specific pricing configuration
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const client = await pool.connect()
  
  try {
    const { category } = await params

    const result = await client.query(
      'SELECT * FROM pricing_configs WHERE vehicle_category = $1',
      [category]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pricing configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error fetching pricing config:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// PUT update pricing configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const client = await pool.connect()
  
  try {
    const { category } = await params
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
      isActive
    } = body

    const result = await client.query(
      `UPDATE pricing_configs SET
        base_rate = $1,
        minimum_fare = $2,
        tier_1_upto_km = $3,
        tier_1_multiplier = $4,
        tier_2_upto_km = $5,
        tier_2_multiplier = $6,
        tier_3_upto_km = $7,
        tier_3_multiplier = $8,
        tier_4_multiplier = $9,
        is_active = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE vehicle_category = $11
      RETURNING *`,
      [
        baseRate, minimumFare,
        tier1UptoKm, tier1Multiplier,
        tier2UptoKm, tier2Multiplier,
        tier3UptoKm, tier3Multiplier,
        tier4Multiplier, isActive,
        category
      ]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pricing configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Pricing configuration updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating pricing config:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// DELETE pricing configuration
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const client = await pool.connect()
  
  try {
    const { category } = await params

    const result = await client.query(
      'DELETE FROM pricing_configs WHERE vehicle_category = $1 RETURNING *',
      [category]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pricing configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Pricing configuration deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting pricing config:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
