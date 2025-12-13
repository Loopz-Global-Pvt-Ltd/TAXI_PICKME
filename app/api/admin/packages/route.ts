import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { z } from 'zod'

const createPackageSchema = z.object({
  packageName: z.string().min(3).max(255),
  packageCode: z.string().min(3).max(50),
  description: z.string().optional(),
  category: z.enum(['mini', 'standard', 'luxury', 'van' ,'tuk tuk']),
  pricePerKm: z.number().positive(),
  maxPassengers: z.number().int().positive(),
  features: z.array(z.string()).default([]),
  vehicleTypes: z.array(z.union([z.number(), z.string()])).default([]),
  popular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  image: z.string().optional(),
  termsConditions: z.string().optional(),
})

// Middleware to verify admin token
function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const category = searchParams.get('category')

    let queryText = 'SELECT * FROM taxi_packages WHERE 1=1'
    const params: any[] = []
    let paramIndex = 1

    if (isActive !== null) {
      queryText += ` AND is_active = $${paramIndex}`
      params.push(isActive === 'true')
      paramIndex++
    }

    if (category) {
      queryText += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    queryText += ' ORDER BY popular DESC, created_at DESC'

    const result = await query(queryText, params)

    const packages = result.rows.map(pkg => ({
      ...pkg,
      features: Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features || '[]'),
      vehicleTypes: Array.isArray(pkg.vehicle_types) ? pkg.vehicle_types : JSON.parse(pkg.vehicle_types || '[]'),
    }))

    return NextResponse.json({
      success: true,
      data: packages,
      count: result.rowCount,
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createPackageSchema.parse(body)

    const result = await query(
      `INSERT INTO taxi_packages (
        package_name, package_code, description, category,
        price_per_km, max_passengers, features, vehicle_types, 
        popular, is_active, image, terms_conditions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        validatedData.packageName,
        validatedData.packageCode,
        validatedData.description || null,
        validatedData.category,
        validatedData.pricePerKm,
        validatedData.maxPassengers,
        JSON.stringify(validatedData.features),
        JSON.stringify(validatedData.vehicleTypes),
        validatedData.popular,
        validatedData.isActive,
        validatedData.image || null,
        validatedData.termsConditions || null,
      ]
    )

    const createdPackage = {
      ...result.rows[0],
      features: JSON.parse(result.rows[0].features || '[]'),
      vehicleTypes: JSON.parse(result.rows[0].vehicle_types || '[]'),
    }

    return NextResponse.json({
      success: true,
      data: createdPackage,
      message: 'Package created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating package:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        { success: false, error: 'Package code already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create package' },
      { status: 500 }
    )
  }
}
