import { useParams, useNavigate } from 'react-router-dom'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors cursor-pointer"
        style={{ color: '#475569' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
        onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
      >
        ← 返回
      </button>

      {/* placeholder — will be replaced with real project detail */}
      <div className="text-sm" style={{ color: '#475569' }}>載入專案 {id}...</div>
    </div>
  )
}
