import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { z } from 'zod'

const createVehicleSchema = z.object({
  name: z.string().min(2).max(255),
  category: z.enum(['economy', 'standard', 'luxury', 'van']),
  basePrice: z.number().positive(),
  pricePerKm: z.number().positive(),
  seats: z.number().int().positive(),
  luggage: z.number().int().min(0),
  image: z.string().optional(),
  features: z.array(z.string()).default([]),
  description: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().min(0).default(0),
  isAvailable: z.boolean().default(true),
  fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'electric']).optional(),
  transmission: z.enum(['manual', 'automatic']).optional(),
})

function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isAvailable = searchParams.get('isAvailable')

    let queryText = 'SELECT * FROM vehicles WHERE 1=1'
    const params: any[] = []
    let paramIndex = 1

    if (category) {
      queryText += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (isAvailable !== null) {
      queryText += ` AND is_available = $${paramIndex}`
      params.push(isAvailable === 'true')
      paramIndex++
    }

    queryText += ' ORDER BY category, name'

    const result = await query(queryText, params)

    const vehicles = result.rows.map(vehicle => ({
      ...vehicle,
      features: Array.isArray(vehicle.features) ? vehicle.features : JSON.parse(vehicle.features || '[]'),
    }))

    return NextResponse.json({
      success: true,
      data: vehicles,
      count: result.rowCount,
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createVehicleSchema.parse(body)

    const result = await query(
      `INSERT INTO vehicles (
        name, category, base_price, price_per_km, seats, luggage,
        image, features, description, rating, reviews, is_available,
        fuel_type, transmission
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        validatedData.name,
        validatedData.category,
        validatedData.basePrice,
        validatedData.pricePerKm,
        validatedData.seats,
        validatedData.luggage,
        validatedData.image || null,
        JSON.stringify(validatedData.features),
        validatedData.description || null,
        validatedData.rating,
        validatedData.reviews,
        validatedData.isAvailable,
        validatedData.fuelType || null,
        validatedData.transmission || null,
      ]
    )

    const createdVehicle = {
      ...result.rows[0],
      features: JSON.parse(result.rows[0].features || '[]'),
    }

    return NextResponse.json({
      success: true,
      data: createdVehicle,
      message: 'Vehicle created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating vehicle:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
