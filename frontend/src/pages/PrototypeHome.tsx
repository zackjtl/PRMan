import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type ApiErr = { error?: string }

export function PrototypeHome() {
  const [session, setSession] = useState<Session | null>(null)
  const [busy, setBusy] = useState(false)
  const [meJson, setMeJson] = useState<string | null>(null)
  const [itemsJson, setItemsJson] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const authHeader = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) throw new Error('尚未登入')
    return { Authorization: `Bearer ${token}` }
  }, [])

  const callMe = async () => {
    setBusy(true)
    setErr(null)
    setMeJson(null)
    try {
      const headers = await authHeader()
      const res = await fetch('/api/me', { headers })
      const body = (await res.json()) as Record<string, unknown> & ApiErr
      if (!res.ok) throw new Error(body.error ?? res.statusText)
      setMeJson(JSON.stringify(body, null, 2))
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const callItems = async () => {
    setBusy(true)
    setErr(null)
    setItemsJson(null)
    try {
      const headers = await authHeader()
      const res = await fetch('/api/prototype-items', { headers })
      const body = (await res.json()) as { items?: unknown } & ApiErr
      if (!res.ok) throw new Error(body.error ?? res.statusText)
      setItemsJson(JSON.stringify(body.items ?? body, null, 2))
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const signInGoogle = async () => {
    setErr(null)
    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) setErr(error.message)
  }

  const signOut = async () => {
    setErr(null)
    await supabase.auth.signOut()
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
      <header className="text-left">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-400/90">
          PRMan 最小原型
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
          專案資源 Dashboard（雛形）
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          前後端分離、Supabase Auth（Google）、後端驗證 JWT 並以登入身分查詢{' '}
          <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs text-teal-200">
            prototype_items
          </code>
          。
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-zinc-900/40 p-6 shadow-[0_0_0_1px_rgba(56,189,248,0.06)]">
        {!session ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-zinc-400">
              請先登入以測試後端 API 與資料庫 RLS。
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => void signInGoogle()}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:opacity-50"
            >
              使用 Google 登入（Supabase Auth）
            </button>
            <p className="text-left text-xs leading-relaxed text-zinc-500">
              本機登入成功後應回到 <code className="text-zinc-400">/auth/callback</code>
              。若被帶到 Supabase Studio，請到 Zeabur 的 <strong>auth</strong> 服務把{' '}
              <code className="text-zinc-400">GOTRUE_SITE_URL</code> 設為{' '}
              <code className="text-zinc-400">http://localhost:5173</code>，並在{' '}
              <code className="text-zinc-400">GOTRUE_URI_ALLOW_LIST</code> 加入{' '}
              <code className="text-zinc-400">http://localhost:5173/auth/callback</code>
              （詳見專案根目錄 <code className="text-zinc-400">.env.example</code> 註解）。
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-left">
            <div>
              <p className="text-xs uppercase text-zinc-500">已登入</p>
              <p className="mt-1 font-mono text-sm text-teal-200">
                {session.user.email ?? session.user.id}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void callMe()}
                className="rounded-lg border border-white/15 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 hover:border-teal-500/40 hover:text-teal-100 disabled:opacity-50"
              >
                呼叫 GET /api/me
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void callItems()}
                className="rounded-lg border border-white/15 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 hover:border-teal-500/40 hover:text-teal-100 disabled:opacity-50"
              >
                呼叫 GET /api/prototype-items
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void signOut()}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
              >
                登出
              </button>
            </div>
          </div>
        )}
      </section>

      {err ? (
        <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {err}
        </p>
      ) : null}

      {meJson ? (
        <section className="text-left">
          <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            /api/me 回應
          </h2>
          <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-zinc-300">
            {meJson}
          </pre>
        </section>
      ) : null}

      {itemsJson ? (
        <section className="text-left">
          <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            prototype_items
          </h2>
          <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-zinc-300">
            {itemsJson}
          </pre>
        </section>
      ) : null}
    </div>
  )
}
