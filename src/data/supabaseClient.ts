import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Supabase is OPTIONAL. When both env vars are present we use a shared
// backend so the admin dashboard sees every participant's device. When
// absent, the app falls back to on-device localStorage (see store.ts).
export const supabaseEnabled = Boolean(url && key);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url as string, key as string, {
      auth: { persistSession: false },
    })
  : null;
