import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://qfqowhetrxritoyjzzcz.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcW93aGV0cnhyaXRveWp6emN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTMzOTEsImV4cCI6MjA3ODQyOTM5MX0.KBrTfwq8vDaPlHE81YgmKkSHXf6GX9JDFQWFRc4WQCU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
