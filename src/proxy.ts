import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit, type Duration } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// submit-application: rate-limit by IP (pre-auth)
// authenticated routes: rate-limit by session cookie (appId) — prevents IP-rotation bypass
const LIMITS: Record<string, { limit: number; window: Duration; bySession?: boolean }> = {
  '/api/submit-application': { limit: 5,  window: '1 h' },
  '/api/hume-token':         { limit: 3,  window: '1 h', bySession: true },
  '/api/candidate-context':  { limit: 5,  window: '1 h', bySession: true },
  '/api/save-assessment':    { limit: 3,  window: '1 h', bySession: true },
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

if (process.env.NODE_ENV === 'production' && !redis) {
  console.error('FATAL: Upstash env vars missing — rate limiting disabled in production')
}

const limiters = new Map<string, Ratelimit>()

function getLimiter(path: string): Ratelimit | null {
  if (!redis) return null
  const cfg = LIMITS[path]
  if (!cfg) return null
  if (!limiters.has(path)) {
    limiters.set(
      path,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(cfg.limit, cfg.window),
        prefix: `rl:ntcm:${path}`,
      })
    )
  }
  return limiters.get(path)!
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const cfg = LIMITS[path]
  const limiter = getLimiter(path)

  if (limiter && cfg) {
    let identifier: string

    if (cfg.bySession) {
      // Authenticated routes: limit by session cookie to prevent IP-rotation bypass
      const session = req.cookies.get('appSession')?.value
      if (!session) {
        // No session — will be caught by the route's own auth guard; pass through
        return NextResponse.next()
      }
      identifier = `sess:${session}`
    } else {
      // Pre-auth routes: limit by IP
      // Trust x-forwarded-for set by Vercel's CDN; do not read x-real-ip (spoofable)
      const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        'unknown'
      identifier = `ip:${ip}`
    }

    const { success } = await limiter.limit(identifier)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/submit-application',
    '/api/hume-token',
    '/api/candidate-context',
    '/api/save-assessment',
  ],
}
