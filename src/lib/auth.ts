import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): object | null {
  try {
    return jwt.verify(token, JWT_SECRET) as object
  } catch {
    return null
  }
}

export async function verifyAuth(request: NextRequest): Promise<{ valid: boolean; user?: object }> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false }
  }
  
  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  
  if (!decoded) {
    return { valid: false }
  }
  
  return { valid: true, user: decoded }
}

export async function authenticateAdmin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  if (username !== ADMIN_USERNAME) {
    return { success: false, error: 'Invalid credentials' }
  }
  
  if (!ADMIN_PASSWORD) {
    return { success: false, error: 'Admin password not configured' }
  }
  
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid credentials' }
  }
  
  const token = generateToken({ username, role: 'admin' })
  
  return { success: true, token }
}
