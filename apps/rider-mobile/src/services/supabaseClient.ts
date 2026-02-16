import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ykjkdyesejssidyqwqpc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlramtkeWVzZWpzc2lkeXF3cXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODUyNzcsImV4cCI6MjA4Mzk2MTI3N30.W5xyrkspeSSuDsqGOBA8VhckJak9IzyqfJnu0-kN20s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
