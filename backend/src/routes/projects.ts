import { Hono } from 'hono'
import type { AppEnv } from '../types.js'
import resources from './resources.js'
import todos from './todos.js'
import notes from './notes.js'

const projects = new Hono<AppEnv>()

projects.get('/', async (c) => {
  const db = c.get('supabase')

  const [projectsRes, resourcesRes, todosRes] = await Promise.all([
    db.from('projects').select('*').order('updated_at', { ascending: false }),
    db.from('resources').select('project_id'),
    db.from('todos').select('project_id, completed'),
  ])

  if (projectsRes.error) return c.json({ error: projectsRes.error.message }, 400)

  const resourceCounts = new Map<string, number>()
  for (const r of resourcesRes.data ?? []) {
    resourceCounts.set(r.project_id, (resourceCounts.get(r.project_id) ?? 0) + 1)
  }

  const todoCounts = new Map<string, { total: number; completed: number }>()
  for (const t of todosRes.data ?? []) {
    const curr = todoCounts.get(t.project_id) ?? { total: 0, completed: 0 }
    curr.total++
    if (t.completed) curr.completed++
    todoCounts.set(t.project_id, curr)
  }

  const result = (projectsRes.data ?? []).map((p) => ({
    ...p,
    resource_count: resourceCounts.get(p.id) ?? 0,
    todo_total: todoCounts.get(p.id)?.total ?? 0,
    todo_completed: todoCounts.get(p.id)?.completed ?? 0,
  }))

  return c.json({ projects: result })
})

projects.post('/', async (c) => {
  const db = c.get('supabase')
  const userId = c.get('user').id
  const { name, description = '', status = 'active' } = await c.req.json()
  if (!name) return c.json({ error: 'name is required' }, 400)
  const { data, error } = await db
    .from('projects')
    .insert({ user_id: userId, name, description, status })
    .select()
    .single()
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ project: data }, 201)
})

projects.get('/:id', async (c) => {
  const db = c.get('supabase')
  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('id', c.req.param('id'))
    .single()
  if (error) return c.json({ error: 'Project not found' }, 404)
  return c.json({ project: data })
})

projects.patch('/:id', async (c) => {
  const db = c.get('supabase')
  const { name, description, status } = await c.req.json()
  const updates: Record<string, unknown> = {}
  if (name !== undefined) updates.name = name
  if (description !== undefined) updates.description = description
  if (status !== undefined) updates.status = status
  const { data, error } = await db
    .from('projects')
    .update(updates)
    .eq('id', c.req.param('id'))
    .select()
    .single()
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ project: data })
})

projects.delete('/:id', async (c) => {
  const db = c.get('supabase')
  const { error } = await db.from('projects').delete().eq('id', c.req.param('id'))
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ ok: true })
})

projects.route('/:projectId/resources', resources)
projects.route('/:projectId/todos', todos)
projects.route('/:projectId/notes', notes)

export default projects
