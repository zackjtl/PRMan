import { supabase } from '@/lib/supabase'

async function signIn() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b0f14' }}>
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6"
        style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}
          >
            P
          </div>
          <h1 className="text-xl font-semibold" style={{ color: '#f1f5f9' }}>PRMan</h1>
          <p className="text-sm text-center" style={{ color: '#64748b' }}>
            專案資源中心
          </p>
        </div>

        <button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all cursor-pointer"
          style={{
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
        >
          <GoogleIcon />
          使用 Google 帳號登入
        </button>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
