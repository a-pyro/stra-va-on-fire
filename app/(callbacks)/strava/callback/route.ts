import { createStravaClient } from "@/lib/strava/client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  console.log("🚀 ~ GET ~ strava callback", { requestUrl })
  const code = requestUrl.searchParams.get("code")
  const hubChallenge = requestUrl.searchParams.get("hub.challenge")
  const hubMode = requestUrl.searchParams.get("hub.mode")
  const hubVerifyToken = requestUrl.searchParams.get("hub.verify_token")

  const origin = requestUrl.origin

  if (code) {
    // coming from sign in with Strava
    const strava = createStravaClient()
    await strava.exchangeCodeForSession(code)
    return NextResponse.redirect(`${origin}/protected`)
  }

  if (hubChallenge && hubMode && hubVerifyToken) {
    console.log("🚀", "Strava callback validation")
    return new Response(JSON.stringify({ "hub.challenge": hubChallenge }), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
