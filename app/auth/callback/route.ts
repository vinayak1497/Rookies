import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback handler.
 * Supabase redirects here after email confirmation / OAuth.
 * Exchanges the auth code for a session, then redirects the user.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // If something went wrong, redirect to sign-in with error
    return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_failed`);
}
