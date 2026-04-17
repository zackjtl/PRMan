import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!url || !anon) {
  throw new Error(
    '[PRMan] 缺少 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY。請寫在 frontend/.env，存檔後重新執行 npm run dev。',
  )
}

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})
