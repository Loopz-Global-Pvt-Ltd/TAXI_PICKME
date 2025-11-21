import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'zod'

const vehicleSearchSchema = z.object({
  category: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  passengers: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  sortBy: z.enum(['price-low', 'price-high', 'rating', 'popularity']).optional().default('price-low'),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const validatedParams = vehicleSearchSchema.parse({
      category: searchParams.get('category'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      passengers: searchParams.get('passengers'),
      sortBy: searchParams.get('sortBy'),
    })

    let queryText = `
      SELECT 
        id, name, category, base_price, price_per_km, image,
        seats, luggage, rating, reviews, features, description,
        is_available, fuel_type, transmission,
        created_at, updated_at
      FROM vehicles
      WHERE is_available = true
    `
    const queryParams: any[] = []
    let paramIndex = 1

    // Filter by category
    if (validatedParams.category) {
      queryText += ` AND category = $${paramIndex}`
      queryParams.push(validatedParams.category)
      paramIndex++
    }

    // Filter by base price range
    if (validatedParams.minPrice) {
      queryText += ` AND base_price >= $${paramIndex}`
      queryParams.push(validatedParams.minPrice)
      paramIndex++
    }

    if (validatedParams.maxPrice) {
      queryText += ` AND base_price <= $${paramIndex}`
      queryParams.push(validatedParams.maxPrice)
      paramIndex++
    }

    // Filter by passenger capacity
    if (validatedParams.passengers) {
      queryText += ` AND seats >= $${paramIndex}`
      queryParams.push(validatedParams.passengers)
      paramIndex++
    }

    // Sorting
    switch (validatedParams.sortBy) {
      case 'price-high':
        queryText += ' ORDER BY base_price DESC, price_per_km DESC'
        break
      case 'rating':
        queryText += ' ORDER BY rating DESC, reviews DESC'
        break
      case 'popularity':
        queryText += ' ORDER BY reviews DESC, rating DESC'
        break
      case 'price-low':
      default:
        queryText += ' ORDER BY base_price ASC, price_per_km ASC'
    }

    const result = await query(queryText, queryParams)

    // Transform JSONB features field
    const vehicles = result.rows.map(vehicle => ({
      ...vehicle,
      features: Array.isArray(vehicle.features) ? vehicle.features : JSON.parse(vehicle.features || '[]'),
    }))

    return NextResponse.json({
      success: true,
      data: vehicles,
      count: result.rowCount,
      filters: {
        category: validatedParams.category,
        minPrice: validatedParams.minPrice,
        maxPrice: validatedParams.maxPrice,
        passengers: validatedParams.passengers,
      },
    })
  } catch (error: any) {
    console.error('Error fetching vehicles:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid parameters', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}