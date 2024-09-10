import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { envVars } from "../env-vars"
import { createStravaClient } from "../strava/client"

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  const requestUrl = new URL(request.url)

  const hubChallenge = requestUrl.searchParams.get("hub.challenge")
  console.log("🚀 ~ updateSession ~ hubChallenge:", hubChallenge)

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    envVars.NEXT_PUBLIC_SUPABASE_URL!,
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )
  const strava = createStravaClient()

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser()

  await strava.refreshSession()

  // protected routes
  if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  if (request.nextUrl.pathname === "/" && !user.error) {
    return NextResponse.redirect(new URL("/protected", request.url))
  }

  return response
}
