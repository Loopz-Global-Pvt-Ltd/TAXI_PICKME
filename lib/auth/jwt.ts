import jwt from 'jsonwebtoken'


if(!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}
const JWT_SECRET = process.env.JWT_SECRET 
const JWT_EXPIRES_IN = '24h'

export interface JWTPayload {
  userId: number
  username: string
  email: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}
