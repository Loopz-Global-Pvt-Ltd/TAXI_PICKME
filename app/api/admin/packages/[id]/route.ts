import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { z } from 'zod'

const updatePackageSchema = z.object({
  packageName: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  category: z.enum(['economy', 'standard', 'luxury', 'van']).optional(),
  basePrice: z.number().positive().optional(),
  pricePerKm: z.number().positive().optional(),
  includedKm: z.number().int().min(0).optional(),
  maxPassengers: z.number().int().positive().optional(),
  durationHours: z.number().int().positive().optional(),
  features: z.array(z.string()).optional(),
  vehicleTypes: z.array(z.union([z.number(), z.string()])).optional(),
  popular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  image: z.string().optional(),
  termsConditions: z.string().optional(),
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
    const packageId = parseInt(id)
    if (isNaN(packageId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid package ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updatePackageSchema.parse(body)

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    const fieldMapping: Record<string, string> = {
      packageName: 'package_name',
      packageCode: 'package_code',
      basePrice: 'base_price',
      pricePerKm: 'price_per_km',
      includedKm: 'included_km',
      maxPassengers: 'max_passengers',
      durationHours: 'duration_hours',
      vehicleTypes: 'vehicle_types',
      isActive: 'is_active',
      termsConditions: 'terms_conditions',
    }

    for (const [key, value] of Object.entries(validatedData)) {
      if (value !== undefined) {
        const dbField = fieldMapping[key] || key
        
        if (key === 'features' || key === 'vehicleTypes') {
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

    values.push(packageId)

    const result = await query(
      `UPDATE taxi_packages 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      )
    }

    // const updatedPackage = {
    //   ...result.rows[0],
    //   features: JSON.parse(result.rows[0].features || '[]'),
    //   vehicleTypes: JSON.parse(result.rows[0].vehicle_types || '[]'),
    // }

    return NextResponse.json({
      success: true,
    //   data: updatedPackage,
      message: 'Package updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating package:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update package' },
      { status: 500 }
    )
  }
}
export async function DELETE(
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
    const packageId = parseInt(id)
   
    if (isNaN(packageId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid package ID' },
        { status: 400 }
      )
    }

    // Soft delete by setting is_active to false
    const result = await query(
      `UPDATE taxi_packages 
       SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [packageId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete package' },
      { status: 500 }
    )
  }
}
