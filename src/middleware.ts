import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit, type Duration } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const LIMITS: Record<string, { limit: number; window: Duration }> = {
  '/api/submit-application': { limit: 5,   window: '1 h' },
  '/api/hume-token':          { limit: 100, window: '1 h' },
  '/api/candidate-context':   { limit: 30,  window: '1 h' },
  '/api/save-assessment':     { limit: 10,  window: '1 h' },
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

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const limiter = getLimiter(path)

  if (limiter) {
    const ip =
      req.headers.get('x-real-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown'

    const { success } = await limiter.limit(ip)
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
