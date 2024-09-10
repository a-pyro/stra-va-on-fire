import { headers } from "next/headers"

export const getStravaCallbackUrl = () => {
  const origin = headers().get("origin")
  return `${origin}/strava/callback`
}
