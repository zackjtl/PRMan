export type ProjectStatus = 'active' | 'paused' | 'launched' | 'idea'
export type ResourceCategory = 'frontend' | 'backend' | 'repository' | 'database' | 'auth' | 'domain'
export type TodoPriority = 'low' | 'medium' | 'high'

export interface Project {
  id: string
  user_id: string
  name: string
  description: string
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export interface ProjectWithCounts extends Project {
  resource_count: number
  todo_total: number
  todo_completed: number
}

export interface Resource {
  id: string
  user_id: string
  project_id: string
  title: string
  category: ResourceCategory
  url: string
  note: string
  created_at: string
  updated_at: string
}

export interface Todo {
  id: string
  user_id: string
  project_id: string
  text: string
  completed: boolean
  priority: TodoPriority
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  project_id: string
  content: string
  created_at: string
  updated_at: string
}
