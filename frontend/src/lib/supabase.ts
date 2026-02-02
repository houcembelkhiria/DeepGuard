import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:9800'
// This is the default anon key from self-hosted setup. 
// In production, this should be in .env
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-should-be-generated'

export const supabase = createClient(supabaseUrl, supabaseKey)
