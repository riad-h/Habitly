/**
 * Supabase client configuration
 * 
 * If environment variables are not set, the app runs in demo mode
 * using localStorage instead of Supabase.
 */

let supabaseInstance = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;
  
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (url && key) {
    try {
      // We'll initialize this lazily when actually needed
      return null; // Will be set up in useAuth hook
    } catch (e) {
      console.warn('Supabase client could not be initialized');
    }
  }
  
  return null;
}

export function isSupabaseConfigured() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key);
}
