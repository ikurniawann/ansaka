import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[ANSAKA] Supabase env vars not set. Copy .env.example to .env and fill in your values.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const SURVEY_VERSION = import.meta.env.VITE_SURVEY_VERSION || 'oam12-v1';
export const MIN_RESPONDENTS = Number(import.meta.env.VITE_MIN_RESPONDENTS || 10);
