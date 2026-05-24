"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser client — reads/writes the session cookie so auth survives reloads.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
