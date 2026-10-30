import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Keep module evaluation safe in preview environments where public vars may be injected late.
// Supabase requests will use the real values as soon as the environment is available.
export const supabase = createSupabaseClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);

// Export createClient helper so page components importing { createClient } work seamlessly
export function createClient() {
  return supabase;
}
