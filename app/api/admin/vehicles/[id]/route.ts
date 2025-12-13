import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { z } from 'zod'

const updateVehicleSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  category: z.enum(['Mini', 'Standard', 'Luxury', 'Van' , 'SUV', 'Sedan','Tuk Tuk']).optional(),
  pricePerKm: z.number().positive().optional(),
  seats: z.number().int().positive().optional(),
  luggage: z.number().int().min(0).optional(),
  image: z.string().optional(),
  features: z.array(z.string()).optional(),
  description: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
  isAvailable: z.boolean().optional(),
  fuelType: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric']).optional(),
  transmission: z.enum(['Manual', 'Automatic']).optional(),
})

function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const vehicleId = parseInt(id)
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vehicle ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateVehicleSchema.parse(body)

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    const fieldMapping: Record<string, string> = {
      pricePerKm: 'price_per_km',
      isAvailable: 'is_available',
      fuelType: 'fuel_type',
    }

    for (const [key, value] of Object.entries(validatedData)) {
      if (value !== undefined) {
        const dbField = fieldMapping[key] || key
        
        if (key === 'features') {
          updates.push(`${dbField} = $${paramIndex}`)
          values.push(JSON.stringify(value))
        } else {
          updates.push(`${dbField} = $${paramIndex}`)
          values.push(value)
        }
        paramIndex++
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid updates provided' },
        { status: 400 }
      )
    }


    values.push(vehicleId)

    const sqlQuery = `UPDATE vehicles 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING *`
    
    // Print the query and values
    console.log('SQL Query:', sqlQuery)
    console.log('Values:', values)
    console.log('Formatted Query:', sqlQuery.replace(/\$(\d+)/g, (_, i) => {
      const value = values[parseInt(i) - 1]
      return typeof value === 'string' ? `'${value}'` : value
    }))

    const result = await query(
      sqlQuery,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    const updatedVehicle = {
      ...result.rows[0],
      features: typeof result.rows[0].features === 'string' 
        ? JSON.parse(result.rows[0].features) 
        : result.rows[0].features || [],
    }

    return NextResponse.json({
      success: true,
      data: updatedVehicle,
      message: 'Vehicle updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating vehicle:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const vehicleId = parseInt(params.id)
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vehicle ID' },
        { status: 400 }
      )
    }

    const result = await query(
      `UPDATE vehicles 
       SET is_available = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
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
      message: 'Vehicle deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}
