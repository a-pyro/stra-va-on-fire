import { createStravaClient } from "@/lib/strava/client"
import { createServerSideClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const source = requestUrl.searchParams.get("source")
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString()

  if (code) {
    if (source && source === "strava") {
      const strava = createStravaClient()
      await strava.exchangeCodeForSession(code)
    } else {
      const supabase = createServerSideClient()
      await supabase.auth.exchangeCodeForSession(code)
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/protected`)
}
