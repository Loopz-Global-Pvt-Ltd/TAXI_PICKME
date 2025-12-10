import { NextRequest, NextResponse } from 'next/server'   
import { query } from '@/lib/db'
import { z } from 'zod'

const vehicleSearchSchema = z.object({
  category: z.string().nullable().optional(),
  minPrice: z.string().nullable().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().nullable().optional().transform(val => val ? parseFloat(val) : undefined),
  passengers: z.string().nullable().optional().transform(val => val ? parseInt(val) : undefined),
  sortBy: z.enum(['price-low', 'price-high', 'rating', 'popularity']).nullable().optional().default('price-low'),
})

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url)
    

    
    const validatedParams = vehicleSearchSchema.parse({
      category: searchParams.get('category'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      passengers: searchParams.get('passengers'),
      sortBy: searchParams.get('sortBy') as 'price-low' | 'price-high' | 'rating' | 'popularity' | null,
    })

  

    let queryText = `
      SELECT 
        id, name, category, price_per_km, image,
        seats, luggage, rating, reviews, features, description,
        is_available, fuel_type, transmission,
        created_at, updated_at
      FROM vehicles
      WHERE is_available = true AND
    `
    const queryParams: any[] = []
    let paramIndex = 1

    // Filter by category
    if (validatedParams.category) {
      queryText += `category = $${paramIndex}`
      queryParams.push(validatedParams.category)
      paramIndex++
    }



    // Filter by passenger capacity
    if (validatedParams.passengers !== undefined) {
      queryText += ` seats >= $${paramIndex}`
      queryParams.push(validatedParams.passengers)
      paramIndex++
    }

    // Sorting
    switch (validatedParams.sortBy) {
      case 'price-high':
        queryText += ' ORDER BY  price_per_km DESC'
        break
      case 'rating':
        queryText += ' ORDER BY rating DESC, reviews DESC'
        break
      case 'popularity':
        queryText += ' ORDER BY reviews DESC, rating DESC'
        break
      case 'price-low':
      default:
        queryText += ' ORDER BY  price_per_km ASC'
    }

    // console.log('🔍 Executing query:', { queryText, queryParams })

    const result = await query(queryText, queryParams)

    console.log(`✅ Fetched ${result.rowCount} vehicles`)


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
    console.error('❌ Error fetching vehicles:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    })
    
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
      { 
        success: false, 
        error: 'Failed to fetch vehicles',
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    )
  }
}