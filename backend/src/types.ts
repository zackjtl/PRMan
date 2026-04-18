import type { SupabaseClient, User } from '@supabase/supabase-js'

export type AppEnv = {
  Variables: {
    supabase: SupabaseClient
    user: User
  }
}
