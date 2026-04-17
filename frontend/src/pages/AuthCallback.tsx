import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    void supabase.auth.getSession().finally(() => {
      navigate('/', { replace: true })
    })
  }, [navigate])

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-zinc-400">
      正在完成登入…
    </div>
  )
}
