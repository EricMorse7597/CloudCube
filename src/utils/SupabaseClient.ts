import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { IncomingMessage, ServerResponse } from "http";
import cookie from "cookie"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function createSupabaseServerClient(request: IncomingMessage, response: ServerResponse) {
    return createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        { 
            cookies: {
                get(name) {
                    const parsedCookies = cookie.parse(request.headers.cookie || "");
                    return parsedCookies[name] || null;
                },
                set(name, value, options) {
                    const serialized = cookie.serialize(name, value, { path: "/", ...options });
                    response.setHeader("Set-Cookie", serialized);
                },
                remove(name, options) {
                    const serialized = cookie.serialize(name, "", { path: "/", maxAge: 0, ...options });
                    response.setHeader("Set-Cookie", serialized);
                }
            }
        }
    )
}