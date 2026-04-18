import { supabase } from './supabase'
import { apiUrl } from './api'
import type {
  Project,
  ProjectWithCounts,
  ProjectStatus,
  Resource,
  ResourceCategory,
  Todo,
  TodoPriority,
  Note,
} from '../types'

async function getToken(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Not authenticated')
  return token
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken()
  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  list: () =>
    apiFetch<{ projects: ProjectWithCounts[] }>('/api/projects'),

  create: (body: { name: string; description?: string; status?: ProjectStatus }) =>
    apiFetch<{ project: Project }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  get: (id: string) =>
    apiFetch<{ project: Project }>(`/api/projects/${id}`),

  update: (id: string, body: { name?: string; description?: string; status?: ProjectStatus }) =>
    apiFetch<{ project: Project }>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    apiFetch<{ ok: boolean }>(`/api/projects/${id}`, { method: 'DELETE' }),
}

// ─── Resources ────────────────────────────────────────────────────────────────

export const resourcesApi = {
  list: (projectId: string) =>
    apiFetch<{ resources: Resource[] }>(`/api/projects/${projectId}/resources`),

  create: (projectId: string, body: { title: string; category: ResourceCategory; url: string; note?: string }) =>
    apiFetch<{ resource: Resource }>(`/api/projects/${projectId}/resources`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (projectId: string, id: string, body: { title?: string; category?: ResourceCategory; url?: string; note?: string }) =>
    apiFetch<{ resource: Resource }>(`/api/projects/${projectId}/resources/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (projectId: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/api/projects/${projectId}/resources/${id}`, { method: 'DELETE' }),
}

// ─── Todos ────────────────────────────────────────────────────────────────────

export const todosApi = {
  list: (projectId: string) =>
    apiFetch<{ todos: Todo[] }>(`/api/projects/${projectId}/todos`),

  create: (projectId: string, body: { text: string; priority?: TodoPriority; due_date?: string | null }) =>
    apiFetch<{ todo: Todo }>(`/api/projects/${projectId}/todos`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (projectId: string, id: string, body: { text?: string; completed?: boolean; priority?: TodoPriority; due_date?: string | null }) =>
    apiFetch<{ todo: Todo }>(`/api/projects/${projectId}/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (projectId: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/api/projects/${projectId}/todos/${id}`, { method: 'DELETE' }),
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export const notesApi = {
  list: (projectId: string) =>
    apiFetch<{ notes: Note[] }>(`/api/projects/${projectId}/notes`),

  create: (projectId: string, body: { content: string }) =>
    apiFetch<{ note: Note }>(`/api/projects/${projectId}/notes`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  delete: (projectId: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/api/projects/${projectId}/notes/${id}`, { method: 'DELETE' }),
}
