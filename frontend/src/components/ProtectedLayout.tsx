import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export function ProtectedLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b0f14' }}>
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#22d3ee', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen" style={{ background: '#0b0f14' }}>
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 h-14"
        style={{ background: 'rgba(11,15,20,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.25)' }}
          >
            P
          </div>
          <span className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>PRMan</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: '#475569' }}>{user.email}</span>
          <button
            onClick={signOut}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
          >
            登出
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
