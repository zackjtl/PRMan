import { Hono } from 'hono'
import type { AppEnv } from '../types.js'

const todos = new Hono<AppEnv>()

todos.get('/', async (c) => {
  const db = c.get('supabase')
  const projectId = c.req.param('projectId')
  const { data, error } = await db
    .from('todos')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ todos: data ?? [] })
})

todos.post('/', async (c) => {
  const db = c.get('supabase')
  const userId = c.get('user').id
  const projectId = c.req.param('projectId')
  const { text, priority = 'medium', due_date = null } = await c.req.json()
  if (!text) return c.json({ error: 'text is required' }, 400)
  const { data, error } = await db
    .from('todos')
    .insert({ user_id: userId, project_id: projectId, text, priority, due_date })
    .select()
    .single()
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ todo: data }, 201)
})

todos.patch('/:id', async (c) => {
  const db = c.get('supabase')
  const { text, completed, priority, due_date } = await c.req.json()
  const updates: Record<string, unknown> = {}
  if (text !== undefined) updates.text = text
  if (completed !== undefined) updates.completed = completed
  if (priority !== undefined) updates.priority = priority
  if (due_date !== undefined) updates.due_date = due_date
  const { data, error } = await db
    .from('todos')
    .update(updates)
    .eq('id', c.req.param('id'))
    .select()
    .single()
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ todo: data })
})

todos.delete('/:id', async (c) => {
  const db = c.get('supabase')
  const { error } = await db.from('todos').delete().eq('id', c.req.param('id'))
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ ok: true })
})

export default todos
