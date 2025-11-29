import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'zod'

const pricingRequestSchema = z.object({
  numberOfDays: z.number().int().min(1).max(90),
  estimatedDistanceKm: z.number().min(0).max(10000).optional().default(0),
})

interface PricingCalculation {
  basePrice: number
  distancePrice: number
  subtotal: number
  discount: number
  discountPercentage: number
  totalPrice: number
  priceBreakdown: {
    dailyRate: number
    numberOfDays: number
    estimatedDistance: number
    pricePerKm: number
    discountPercentage: number
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicleId = parseInt(params.id)
    
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vehicle ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = pricingRequestSchema.parse(body)

    // Get vehicle pricing details
    const vehicleResult = await query(
      `SELECT 
        id, name, base_price, price_per_km, category 
      FROM vehicles 
      WHERE id = $1 AND is_available = true`,
      [vehicleId]
    )

    if (vehicleResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    const vehicle = vehicleResult.rows[0]

    // Calculate base pricing
    const basePrice = vehicle.base_price * validatedData.numberOfDays
    const distancePrice = validatedData.estimatedDistanceKm * vehicle.price_per_km
    const subtotal = basePrice + distancePrice

    // Get applicable discount based on number of days
    const discountResult = await query(
      `SELECT discount_percentage 
       FROM pricing_rules 
       WHERE vehicle_category = $1 
         AND $2 >= COALESCE(min_days, 0) 
         AND $2 <= COALESCE(max_days, 999999)
       ORDER BY discount_percentage DESC
       LIMIT 1`,
      [vehicle.category, validatedData.numberOfDays]
    )

    const discountPercentage = discountResult.rows[0]?.discount_percentage || 0
    const discount = (subtotal * discountPercentage) / 100
    const totalPrice = subtotal - discount

    const pricing: PricingCalculation = {
      basePrice,
      distancePrice,
      subtotal,
      discount,
      discountPercentage,
      totalPrice,
      priceBreakdown: {
        dailyRate: vehicle.base_price,
        numberOfDays: validatedData.numberOfDays,
        estimatedDistance: validatedData.estimatedDistanceKm,
        pricePerKm: vehicle.price_per_km,
        discountPercentage,
      },
    }

    return NextResponse.json({
      success: true,
      data: pricing,
      vehicle: {
        id: vehicle.id,
        name: vehicle.name,
        category: vehicle.category,
      },
    })
  } catch (error: any) {
    console.error('Error calculating pricing:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid pricing parameters', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to calculate pricing' },
      { status: 500 }
    )
  }
}