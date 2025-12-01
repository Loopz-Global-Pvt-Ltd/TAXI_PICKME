import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { z } from 'zod'

const bookingSearchSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).nullable().optional(),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded']).nullable().optional(),
  fromDate: z.string().nullable().optional(),
  toDate: z.string().nullable().optional(),
  limit: z.string().nullable().optional().transform(val => val ? parseInt(val) : 50),
  offset: z.string().nullable().optional().transform(val => val ? parseInt(val) : 0),
})

function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    const validatedParams = bookingSearchSchema.parse({
      status: searchParams.get('status') || null,
      paymentStatus: searchParams.get('paymentStatus') || null,
      fromDate: searchParams.get('fromDate') || null,
      toDate: searchParams.get('toDate') || null,
      limit: searchParams.get('limit') || null,
      offset: searchParams.get('offset') || null,
    })

    let queryText = `
      SELECT 
        b.*,
        v.name as vehicle_name,
        v.category as vehicle_category,
        v.image as vehicle_image
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE 1=1
    `
    const queryParams: any[] = []
    let paramIndex = 1

    if (validatedParams.status) {
      queryText += ` AND b.status = $${paramIndex}`
      queryParams.push(validatedParams.status)
      paramIndex++
    }

    if (validatedParams.paymentStatus) {
      queryText += ` AND b.payment_status = $${paramIndex}`
      queryParams.push(validatedParams.paymentStatus)
      paramIndex++
    }

    if (validatedParams.fromDate) {
      queryText += ` AND b.pickup_date >= $${paramIndex}`
      queryParams.push(validatedParams.fromDate)
      paramIndex++
    }

    if (validatedParams.toDate) {
      queryText += ` AND b.pickup_date <= $${paramIndex}`
      queryParams.push(validatedParams.toDate)
      paramIndex++
    }

    queryText += ` ORDER BY b.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    queryParams.push(validatedParams.limit, validatedParams.offset)

    const result = await query(queryText, queryParams)

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM bookings b WHERE 1=1`
    const countParams: any[] = []
    let countParamIndex = 1

    if (validatedParams.status) {
      countQuery += ` AND status = $${countParamIndex}`
      countParams.push(validatedParams.status)
      countParamIndex++
    }

    if (validatedParams.paymentStatus) {
      countQuery += ` AND payment_status = $${countParamIndex}`
      countParams.push(validatedParams.paymentStatus)
      countParamIndex++
    }

    if (validatedParams.fromDate) {
      countQuery += ` AND pickup_date >= $${countParamIndex}`
      countParams.push(validatedParams.fromDate)
      countParamIndex++
    }

    if (validatedParams.toDate) {
      countQuery += ` AND pickup_date <= $${countParamIndex}`
      countParams.push(validatedParams.toDate)
    }

    const countResult = await query(countQuery, countParams)

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rowCount,
      total: parseInt(countResult.rows[0].count),
      pagination: {
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        hasMore: (validatedParams.offset + validatedParams.limit) < parseInt(countResult.rows[0].count),
      },
    })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}