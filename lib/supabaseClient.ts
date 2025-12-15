import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase env variables missing! Using placeholders to prevent crash.');
}

// Use placeholders if missing to allow app to load
const url = supabaseUrl || 'https://sllizhhnpyovcurzzwld.supabase.co';
const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbGl6aGhucHlvdmN1cnp6d2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2Nzk5NTksImV4cCI6MjA4MTI1NTk1OX0.Fs_C5hs8Qo5VZIikRkwho-goEBus2SksNsTfnsGQv_Y';

export const supabase = createClient<Database>(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper to check configuration
export const isSupabaseConfigured = () => {
  console.log('--- SUPABASE DEBUG ---');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY (Length):', supabaseAnonKey?.length);
  console.log('VITE_SUPABASE_ANON_KEY (Start):', supabaseAnonKey?.substring(0, 5) + '...');
  console.log('--- END DEBUG ---');
  return supabaseUrl && supabaseAnonKey;
};
