import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwfcpffigojngpwvkynh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZmNwZmZpZ29qbmdwd3ZreW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Mzc1NDUsImV4cCI6MjA4MzAxMzU0NX0.E_hnGdgdQbAhw3Z3BdgTHLdaCvUxMU9e3RDZ1LYMplY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);