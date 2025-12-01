import { NextRequest, NextResponse } from 'next/server' 
import { query, transaction } from '@/lib/db'
import { z } from 'zod'

const createBookingSchema = z.object({
  vehicleId: z.number().positive(),
  fullName: z.string().min(2).max(255),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(20),
  pickupLocation: z.string().min(3).max(500),
  dropoffLocation: z.string().min(3).max(500),
  pickupDate: z.string().refine((date) => {
    const pickupDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return pickupDate >= today
  }, {
    message: 'Pickup date must be today or in the future',
  }),
  pickupTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  estimatedDistanceKm: z.number().min(1).max(10000),
  specialRequests: z.string().max(1000).optional(),
})

const bookingSearchSchema = z.object({
  email: z.string().email().optional().nullable(),
  status: z.string().optional().nullable(),
  bookingReference: z.string().optional().nullable(),
  limit: z.string().transform((val) => parseInt(val) || 10).pipe(z.number().min(1).max(100)).optional().default('10'),
  offset: z.string().transform((val) => parseInt(val) || 0).pipe(z.number().min(0)).optional().default('0'),
})

function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TPM-${timestamp}-${random}`
}

async function calculateBookingPrice(
  vehicleId: number,
  estimatedDistanceKm: number
) {
  const vehicleResult = await query(
    'SELECT price_per_km, category, name FROM vehicles WHERE id = $1',
    [vehicleId]
  )

  if (vehicleResult.rows.length === 0) {
    throw new Error('Vehicle not found')
  }

  const vehicle = vehicleResult.rows[0]
  const totalPrice = estimatedDistanceKm * vehicle.price_per_km

  return {
    pricePerKm: vehicle.price_per_km,
    distancePrice: totalPrice,
    totalPrice: totalPrice,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBookingSchema.parse(body)

    const pricing = await calculateBookingPrice(
      validatedData.vehicleId,
      validatedData.estimatedDistanceKm
    )

    const booking = await transaction(async (client) => {
      const bookingReference = generateBookingReference()

      const result = await client.query(
        `INSERT INTO bookings (
          booking_reference, vehicle_id, full_name, email, phone,
          pickup_location, dropoff_location, pickup_date, pickup_time,
          estimated_distance_km, distance_price,
          total_price, special_requests, status, payment_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          bookingReference,
          validatedData.vehicleId,
          validatedData.fullName,
          validatedData.email,
          validatedData.phone,
          validatedData.pickupLocation,
          validatedData.dropoffLocation,
          validatedData.pickupDate,
          validatedData.pickupTime,
          validatedData.estimatedDistanceKm,
          pricing.distancePrice,
          pricing.totalPrice,
          validatedData.specialRequests || null,
          'pending',
          'unpaid',
        ]
      )

      const vehicleResult = await client.query(
        'SELECT name, category, image FROM vehicles WHERE id = $1',
        [validatedData.vehicleId]
      )

      return {
        ...result.rows[0],
        vehicle: vehicleResult.rows[0],
      }
    })

    return NextResponse.json({
      success: true,
      data: booking,
      pricing: {
        pricePerKm: pricing.pricePerKm,
        distanceKm: validatedData.estimatedDistanceKm,
        distancePrice: pricing.distancePrice,
        total: pricing.totalPrice,
      },
      message: 'Booking created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const validatedParams = bookingSearchSchema.parse({
      email: searchParams.get('email'),
      status: searchParams.get('status'),
      bookingReference: searchParams.get('bookingReference'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    })

    let queryText = `
      SELECT 
        b.*,
        v.name as vehicle_name,
        v.category as vehicle_category,
        v.image as vehicle_image,
        v.seats as vehicle_seats,
        v.luggage as vehicle_luggage
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE 1=1
    `
    const queryParams: any[] = []
    let paramIndex = 1

    if (validatedParams.email) {
      queryText += ` AND b.email = $${paramIndex}`
      queryParams.push(validatedParams.email)
      paramIndex++
    }

    if (validatedParams.status) {
      queryText += ` AND b.status = $${paramIndex}`
      queryParams.push(validatedParams.status)
      paramIndex++
    }

    if (validatedParams.bookingReference) {
      queryText += ` AND b.booking_reference = $${paramIndex}`
      queryParams.push(validatedParams.bookingReference)
      paramIndex++
    }

    queryText += ` ORDER BY b.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    queryParams.push(validatedParams.limit, validatedParams.offset)

    const result = await query(queryText, queryParams)

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM bookings b WHERE 1=1`
    const countParams: any[] = []
    let countParamIndex = 1

    if (validatedParams.email) {
      countQuery += ` AND email = $${countParamIndex}`
      countParams.push(validatedParams.email)
      countParamIndex++
    }

    if (validatedParams.status) {
      countQuery += ` AND status = $${countParamIndex}`
      countParams.push(validatedParams.status)
      countParamIndex++
    }

    if (validatedParams.bookingReference) {
      countQuery += ` AND booking_reference = $${countParamIndex}`
      countParams.push(validatedParams.bookingReference)
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
        { 
          success: false, 
          error: 'Invalid parameters', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}