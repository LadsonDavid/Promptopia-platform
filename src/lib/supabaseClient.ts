import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://utxwgxpyfyhnqublszha.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eHdneHB5ZnlobnF1YmxzemhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMDQ4MzAsImV4cCI6MjA4Mzc4MDgzMH0.w3qmoO9LTI6g2A2Xxxo0xHelM355J6xnqhe0b8-vJZw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
