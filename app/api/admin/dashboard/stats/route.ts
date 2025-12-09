import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check authentication (optional - add your auth logic)
    const authHeader = request.headers.get('authorization')
    
    // Get current date for "today" calculations
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Format dates for PostgreSQL
    const todayStr = today.toISOString()
    const tomorrowStr = tomorrow.toISOString()
    const thirtyDaysAgoStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Execute all queries in parallel
    const [
      packagesResult,
      vehiclesResult,
      bookingsTodayResult,
      activeUsersResult
    ] = await Promise.all([
      // Total Packages
      query('SELECT COUNT(*) as count FROM packages'),

      // Total Vehicles
      query('SELECT COUNT(*) as count FROM vehicles'),

      // Bookings Today
      query(
        'SELECT COUNT(*) as count FROM bookings WHERE created_at >= $1 AND created_at < $2',
        [todayStr, tomorrowStr]
      ),

      // Active Users (unique emails who made bookings in last 30 days)
      query(
        'SELECT COUNT(DISTINCT customer_email) as count FROM bookings WHERE created_at >= $1',
        [thirtyDaysAgoStr]
      )
    ])

    // Extract counts from results
    const totalPackages = parseInt(packagesResult.rows[0]?.count || '0')
    const totalVehicles = parseInt(vehiclesResult.rows[0]?.count || '0')
    const bookingsToday = parseInt(bookingsTodayResult.rows[0]?.count || '0')
    const activeUsers = parseInt(activeUsersResult.rows[0]?.count || '0')

    return NextResponse.json({
      success: true,
      data: {
        totalPackages,
        totalVehicles,
        bookingsToday,
        activeUsers
      }
    })

  } catch (error: any) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch dashboard stats'
    }, { status: 500 })
  }
}