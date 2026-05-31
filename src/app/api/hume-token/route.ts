import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  const apiKey = process.env.HUME_API_KEY
  const secretKey = process.env.HUME_SECRET_KEY

  if (!apiKey || !secretKey) {
    return NextResponse.json({ error: 'Hume credentials not configured' }, { status: 500 })
  }

  try {
    const res = await fetch('https://api.hume.ai/oauth2-cc/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: secretKey,
      }),
    })

    if (!res.ok) {
      console.error('Hume token request failed:', res.status)
      return NextResponse.json({ error: 'Failed to get access token' }, { status: res.status })
    }

    const data = await res.json()
    const response = NextResponse.json({ accessToken: data.access_token })
    // Never cache a bearer token
    response.headers.set('Cache-Control', 'no-store')
    response.headers.set('Pragma', 'no-cache')
    return response
  } catch (err) {
    console.error('Hume token error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
