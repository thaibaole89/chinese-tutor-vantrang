/**
 * Supabase client placeholder.
 *
 * The MVP runs entirely on localStorage. When you're ready to wire Supabase:
 *   1. npm install @supabase/supabase-js
 *   2. Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 *   3. Replace the body of getSupabase() with createClient(...) from @supabase/supabase-js
 *   4. Migrate storage.ts reads/writes table-by-table
 *
 * The schema lives at supabase/schema.sql.
 */

export function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabase(): null {
  return null;
}
