import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyPassword } from '@/lib/auth/password'
import { generateToken } from '@/lib/auth/jwt'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = loginSchema.parse(body)

    // Get admin user
    const result = await query(
      `SELECT id, username, password_hash, email, full_name 
       FROM admin_users 
       WHERE username = $1 `,
      [username]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const admin = result.rows[0]

    // Verify password
    const isValid = await verifyPassword(password, admin.password_hash)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login
    await query(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [admin.id]
    )

    // Generate JWT token
    const token = generateToken({
      userId: admin.id,
      username: admin.username,
      email: admin.email,
    })

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          fullName: admin.full_name,
        },
        token,
      },
      message: 'Login successful',
    })

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
