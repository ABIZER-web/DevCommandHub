import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hxvttlfjjzdqzrpsmmkn.supabase.co'
const supabaseKey = 'sb_publishable_OS-O0HnFbOrMVTvdxvaaKQ_TNYlry0x'

export const supabase = createClient(supabaseUrl, supabaseKey)