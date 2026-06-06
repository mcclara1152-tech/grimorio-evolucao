import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sfzzwjguluexrrpwhsll.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmenp3amd1bHVleHJycHdoc2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyOTQ2MjAsImV4cCI6MjA5NTg3MDYyMH0.lGK4CG5NzFnBMpQd9S1Uodzjnl1L7kxoAxd5c2dZ8oY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
