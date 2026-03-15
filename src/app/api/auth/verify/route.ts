import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const result = await verifyAuth(request)
  
  if (!result.valid) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
  
  return NextResponse.json({ valid: true, user: result.user })
}
