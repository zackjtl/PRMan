import { createMiddleware } from 'hono/factory'
import { createClient } from '@supabase/supabase-js'
import type { AppEnv } from '../types.js'

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const supabaseUrl = process.env.SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? ''
  if (!supabaseUrl || !supabaseAnonKey) {
    return c.json({ error: 'Server missing Supabase config' }, 500)
  }

  const token = c.req.header('Authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return c.json({ error: 'Missing bearer token' }, 401)

  const { data, error } = await createClient(supabaseUrl, supabaseAnonKey).auth.getUser(token)
  if (error || !data.user) return c.json({ error: 'Invalid session' }, 401)

  c.set('user', data.user)
  c.set('supabase', createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  }))
  await next()
})
