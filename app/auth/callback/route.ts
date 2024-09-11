// import { createServerSideClient } from "@/lib/supabase/server"
// import { NextResponse } from "next/server"

// export async function GET(request: Request) {
//   // The `/auth/callback` route is required for the server-side auth flow implemented
//   // by the SSR package. It exchanges an auth code for the user's session.
//   // https://supabase.com/docs/guides/auth/server-side/nextjs
//   const requestUrl = new URL(request.url)
//   console.log(`🚀 ~ GET ~ auth/callback`, { request })
//   const code = requestUrl.searchParams.get("code")
//   const origin = requestUrl.origin
//   const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString()

//   if (code) {
//     console.log("🚀 ~ auth/callback ~ code:", code)
//     const supabase = createServerSideClient()
//     await supabase.auth.exchangeCodeForSession(code)
//   }

//   if (redirectTo) {
//     console.log(`🚀 ~ auth/callback ~ redirecting to redirectTo: ${redirectTo}`)
//     return NextResponse.redirect(`${origin}${redirectTo}`)
//   }

//   console.log("🚀 ~ auth/callback ~ redirecting to:", `${origin}/protected`)
//   // URL to redirect to after sign up process completes
//   return NextResponse.redirect(`${origin}/protected`)
// }

import { createServerSideClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
// The client you created from the Server-Side Auth instructions

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createServerSideClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
