import { createClient } from "@supabase/supabase-js";

const SUPABASE_DATABASE_URL = import.meta.env.VITE_SUPABASE_DATABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_DATABASE_URL, SUPABASE_ANON_KEY);