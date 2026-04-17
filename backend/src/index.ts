import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { serve } from '@hono/node-server'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// 先載入 repo 根目錄 .env（選用），再以 backend/.env 覆寫（建議機密放後者）
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'

const app = new Hono()

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? ''
const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  '*',
  cors({
    origin: corsOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }),
)

app.get('/health', (c) => c.json({ ok: true }))

app.get('/api/me', async (c) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return c.json({ error: 'Server missing SUPABASE_URL / SUPABASE_ANON_KEY' }, 500)
  }
  const auth = c.req.header('Authorization')
  const token = auth?.replace(/^Bearer\s+/i, '')
  if (!token) {
    return c.json({ error: 'Missing bearer token' }, 401)
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    return c.json({ error: error?.message ?? 'Invalid session' }, 401)
  }
  return c.json({
    id: data.user.id,
    email: data.user.email,
    appMetadata: data.user.app_metadata,
    userMetadata: data.user.user_metadata,
  })
})

/** 使用呼叫者 Access Token 查詢 prototype_items（驗證 DB + RLS） */
app.get('/api/prototype-items', async (c) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return c.json({ error: 'Server missing SUPABASE_URL / SUPABASE_ANON_KEY' }, 500)
  }
  const auth = c.req.header('Authorization')
  const token = auth?.replace(/^Bearer\s+/i, '')
  if (!token) {
    return c.json({ error: 'Missing bearer token' }, 401)
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const { data, error } = await supabase
    .from('prototype_items')
    .select('id,label,created_at')
    .order('created_at', { ascending: false })
  if (error) {
    return c.json({ error: error.message }, 400)
  }
  return c.json({ items: data ?? [] })
})

const port = Number(process.env.PORT ?? 8787)
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`)
})
