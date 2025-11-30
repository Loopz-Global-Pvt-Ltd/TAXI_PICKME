import { NextRequest, NextResponse } from 'next/server' 
import { query } from '@/lib/db'
import { z } from 'zod'

const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  payment_status: z.enum(['unpaid', 'paid', 'refunded']).optional(),
  payment_method: z.string().max(50).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id

    // Support both numeric ID and booking reference
    const isNumeric = !isNaN(parseInt(bookingId))
    
    const result = await query(
      `SELECT 
        b.*,
        v.name as vehicle_name,
        v.category as vehicle_category,
        v.image as vehicle_image,
        v.seats as vehicle_seats,
        v.luggage as vehicle_luggage,
        v.features as vehicle_features,
        v.base_price as vehicle_base_price,
        v.price_per_km as vehicle_price_per_km
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE ${isNumeric ? 'b.id' : 'b.booking_reference'} = $1`,
      [bookingId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = {
      ...result.rows[0],
      vehicle_features: Array.isArray(result.rows[0].vehicle_features)
        ? result.rows[0].vehicle_features
        : JSON.parse(result.rows[0].vehicle_features || '[]'),
    }

    return NextResponse.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = parseInt(params.id)
    
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateBookingSchema.parse(body)

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(validatedData)) {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid updates provided' },
        { status: 400 }
      )
    }

    values.push(bookingId)

    const result = await query(
      `UPDATE bookings 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Booking updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating booking:', error)
    
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
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = parseInt(params.id)
    
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    // Soft delete by updating status to cancelled
    const result = await query(
      `UPDATE bookings 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [bookingId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Booking cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}