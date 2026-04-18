import { Hono } from 'hono'
import type { AppEnv } from '../types.js'

const resources = new Hono<AppEnv>()

resources.get('/', async (c) => {
  const db = c.get('supabase')
  const projectId = c.req.param('projectId')
  const { data, error } = await db
    .from('resources')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ resources: data ?? [] })
})

resources.post('/', async (c) => {
  const db = c.get('supabase')
  const userId = c.get('user').id
  const projectId = c.req.param('projectId')
  const { title, category, url, note = '' } = await c.req.json()
  if (!title || !category || !url) return c.json({ error: 'title, category, url are required' }, 400)
  const { data, error } = await db
    .from('resources')
    .insert({ user_id: userId, project_id: projectId, title, category, url, note })
    .select()
    .single()
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ resource: data }, 201)
})

resources.patch('/:id', async (c) => {
  const db = c.get('supabase')
  const { title, category, url, note } = await c.req.json()
  const updates: Record<string, unknown> = {}
  if (title !== undefined) updates.title = title
  if (category !== undefined) updates.category = category
  if (url !== undefined) updates.url = url
  if (note !== undefined) updates.note = note
  const { data, error } = await db
    .from('resources')
    .update(updates)
    .eq('id', c.req.param('id'))
    .select()
    .single()
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ resource: data })
})

resources.delete('/:id', async (c) => {
  const db = c.get('supabase')
  const { error } = await db.from('resources').delete().eq('id', c.req.param('id'))
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ ok: true })
})

export default resources
