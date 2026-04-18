import { useEffect, useState, useMemo } from 'react'
import { projectsApi } from '@/lib/apiClient'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectFormModal } from '@/components/ProjectFormModal'
import type { ProjectWithCounts, ProjectStatus } from '@/types'

const STATUS_FILTERS: { value: ProjectStatus | 'all'; label: string }[] = [
  { value: 'all',      label: '全部' },
  { value: 'active',   label: '開發中' },
  { value: 'idea',     label: '構想中' },
  { value: 'paused',   label: '暫停' },
  { value: 'launched', label: '已上線' },
]

type SortKey = 'updated_at' | 'name'

export function HomePage() {
  const [projects, setProjects] = useState<ProjectWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('updated_at')

  useEffect(() => {
    projectsApi.list()
      .then(({ projects }) => setProjects(projects))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = projects
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') {
      list = list.filter(p => p.status === statusFilter)
    }
    if (sortKey === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }, [projects, search, statusFilter, sortKey])

  function handleCreated(project: ProjectWithCounts) {
    setProjects(prev => [{ ...project, resource_count: 0, todo_total: 0, todo_completed: 0 }, ...prev])
    setShowModal(false)
  }

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Projects</h1>
          <p className="text-sm mt-0.5" style={{ color: '#475569' }}>
            {loading ? '載入中...' : `${projects.length} 個專案`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all"
          style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.25)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,211,238,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(34,211,238,0.12)')}
        >
          + 新增專案
        </button>
      </div>

      {/* Search + filter + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋專案..."
          className="rounded-lg px-3 py-2 text-sm outline-none flex-1"
          style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
              style={{
                background: statusFilter === f.value ? 'rgba(34,211,238,0.12)' : '#0f1117',
                color: statusFilter === f.value ? '#22d3ee' : '#475569',
                border: `1px solid ${statusFilter === f.value ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
          className="rounded-lg px-3 py-1.5 text-xs outline-none cursor-pointer"
          style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.07)', color: '#475569' }}
        >
          <option value="updated_at">最近更新</option>
          <option value="name">名稱排序</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm mb-4" style={{ color: '#f87171' }}>{error}</p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl p-5 h-36 animate-pulse" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-4xl opacity-20">⬡</div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: '#475569' }}>
              {search || statusFilter !== 'all' ? '找不到符合條件的專案' : '尚未建立任何專案'}
            </p>
            {!search && statusFilter === 'all' && (
              <p className="text-xs mt-1" style={{ color: '#334155' }}>
                新增第一個專案來整理你的部署與資源連結
              </p>
            )}
          </div>
          {!search && statusFilter === 'all' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
              style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.25)' }}
            >
              建立專案
            </button>
          )}
        </div>
      )}

      {/* Project grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}

      {showModal && (
        <ProjectFormModal
          onClose={() => setShowModal(false)}
          onSaved={handleCreated}
        />
      )}
    </div>
  )
}
