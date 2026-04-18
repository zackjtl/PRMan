import type { ProjectStatus } from '@/types'

const config: Record<ProjectStatus, { label: string; color: string; bg: string; border: string }> = {
  active:   { label: '開發中', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',   border: 'rgba(34,211,238,0.25)' },
  paused:   { label: '暫停',   color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  launched: { label: '已上線', color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)' },
  idea:     { label: '構想中', color: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.25)' },
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const c = config[status]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
    >
      {c.label}
    </span>
  )
}
