import { Hono } from 'hono'
import type { AppEnv } from '../types.js'

const notes = new Hono<AppEnv>()

notes.get('/', async (c) => {
  const db = c.get('supabase')
  const projectId = c.req.param('projectId')
  const { data, error } = await db
    .from('notes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ notes: data ?? [] })
})

notes.post('/', async (c) => {
  const db = c.get('supabase')
  const userId = c.get('user').id
  const projectId = c.req.param('projectId')
  const { content } = await c.req.json()
  if (!content) return c.json({ error: 'content is required' }, 400)
  const { data, error } = await db
    .from('notes')
    .insert({ user_id: userId, project_id: projectId, content })
    .select()
    .single()
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ note: data }, 201)
})

notes.delete('/:id', async (c) => {
  const db = c.get('supabase')
  const { error } = await db.from('notes').delete().eq('id', c.req.param('id'))
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ ok: true })
})

export default notes
