import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

export const isSupabaseConfigured = Boolean(url && key)

// null si faltan las variables de entorno; useSupabase reporta el error
export const supabase = isSupabaseConfigured ? createClient(url, key) : null
