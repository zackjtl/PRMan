import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { requireAuth } from './middleware/auth.js'
import projects from './routes/projects.js'
import type { AppEnv } from './types.js'

const app = new Hono<AppEnv>()

app.use('*', cors({
  origin: (origin) => {
    if (origin && /^https?:\/\/localhost(:\d+)?$/.test(origin)) return origin
    const allowed = (process.env.CORS_ORIGIN ?? '')
      .split(',').map((s) => s.trim()).filter(Boolean)
    return allowed.includes(origin) ? origin : null
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

app.get('/health', (c) => c.json({ ok: true }))

app.get('/api/me', requireAuth, (c) => {
  const user = c.get('user')
  return c.json({
    id: user.id,
    email: user.email,
    userMetadata: user.user_metadata,
  })
})

app.use('/api/projects/*', requireAuth)
app.route('/api/projects', projects)

export default app
