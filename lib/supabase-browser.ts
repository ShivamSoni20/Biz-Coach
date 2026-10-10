"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseBrowser: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (_supabaseBrowser) return _supabaseBrowser;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  _supabaseBrowser = createClient(supabaseUrl, anonKey);
  return _supabaseBrowser;
}

export const supabaseBrowser = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseBrowser() as any)[prop];
  },
});
