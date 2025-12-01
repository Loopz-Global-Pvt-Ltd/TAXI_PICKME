import { NextRequest, NextResponse } from 'next/server' 
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Received vehicle ID:', id)
    const vehicleId = parseInt(id)
    console.log('Fetching vehicle with ID:', vehicleId)
    
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vehicle ID' },
        { status: 400 }
      )
    }

    const result = await query(
      `SELECT 
        id, name, category, price_per_km, image,
        seats, luggage, rating, reviews, features, description,
        is_available, fuel_type, transmission, created_at, updated_at
      FROM vehicles
      WHERE id = $1 AND is_available = true`,
      [vehicleId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    const vehicle = {
      ...result.rows[0],
      features: Array.isArray(result.rows[0].features) 
        ? result.rows[0].features 
        : JSON.parse(result.rows[0].features || '[]'),
    }

    return NextResponse.json({
      success: true,
      data: vehicle,
    })
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}