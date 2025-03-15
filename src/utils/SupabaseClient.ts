import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { IncomingMessage, ServerResponse } from "http";
import cookie from "cookie"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);