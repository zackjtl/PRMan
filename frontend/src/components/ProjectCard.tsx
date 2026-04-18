import { useNavigate } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'
import type { ProjectWithCounts } from '@/types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '剛剛'
  if (m < 60) return `${m} 分鐘前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} 小時前`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} 天前`
  return `${Math.floor(d / 30)} 個月前`
}

export function ProjectCard({ project }: { project: ProjectWithCounts }) {
  const navigate = useNavigate()
  const todoRatio = project.todo_total > 0
    ? `${project.todo_completed}/${project.todo_total}`
    : '—'
  const todoPct = project.todo_total > 0
    ? Math.round((project.todo_completed / project.todo_total) * 100)
    : null

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="rounded-xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-200"
      style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(34,211,238,0.06)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold leading-tight" style={{ color: '#f1f5f9' }}>
          {project.name}
        </h2>
        <StatusBadge status={project.status} />
      </div>

      {project.description && (
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#64748b' }}>
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <Stat icon="⬡" value={project.resource_count} label="資源" />
          <Stat icon="✓" value={todoRatio} label="Todo" />
          {todoPct !== null && (
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${todoPct}%`, background: todoPct === 100 ? '#22d3ee' : '#334155' }}
                />
              </div>
              <span className="text-xs" style={{ color: '#475569' }}>{todoPct}%</span>
            </div>
          )}
        </div>
        <span className="text-xs" style={{ color: '#334155' }}>{timeAgo(project.updated_at)}</span>
      </div>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs" style={{ color: '#334155' }}>{icon}</span>
      <span className="text-xs font-medium" style={{ color: '#64748b' }}>{value}</span>
      <span className="text-xs" style={{ color: '#334155' }}>{label}</span>
    </div>
  )
}
