import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.URL as string;
const SUPABASE_ANON_KEY = process.env.ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);