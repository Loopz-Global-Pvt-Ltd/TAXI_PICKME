import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const distanceCalculationSchema = z.object({
  pickupLat: z.number().min(-90).max(90),
  pickupLng: z.number().min(-180).max(180),
  dropoffLat: z.number().min(-90).max(90),
  dropoffLng: z.number().min(-180).max(180),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = distanceCalculationSchema.parse(body)

    // This is a backend validation endpoint
    // The actual distance calculation happens on the frontend using Google Maps API
    // This endpoint can be used for server-side verification or logging

    return NextResponse.json({
      success: true,
      message: 'Distance calculation request validated',
      data: validatedData,
    })
  } catch (error: any) {
    console.error('Error in distance calculation:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid coordinates', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to process distance calculation' },
      { status: 500 }
    )
  }
}