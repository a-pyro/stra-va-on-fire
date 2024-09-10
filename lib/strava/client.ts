/**
 * Strava API client
 * - Token Exchange
 * - Refresh Token
 * - Get Session
 */

import { envVars } from "../env-vars"

type AuthResponse = {
  token_type: string
  expires_at: number
  expires_in: number
  refresh_token: string
  access_token: string
  athlete: unknown
}

const STRAVA_CLIENT_ID = envVars.NEXT_PUBLIC_STRAVA_CLIENT_ID
const STRAVA_CLIENT_SECRET = envVars.STRAVA_CLIENT_SECRET
const STRAVA_TOKEN_URL = envVars.NEXT_PUBLIC_STRAVA_TOKEN_URL

export const createStravaClient = () => {
  const exchangeCodeForSession = async (code: string) => {
    const url = new URL(STRAVA_TOKEN_URL)
    url.searchParams.append("client_id", STRAVA_CLIENT_ID)
    url.searchParams.append("client_secret", STRAVA_CLIENT_SECRET)
    url.searchParams.append("code", code)
    url.searchParams.append("grant_type", "authorization_code")

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.json() as Promise<AuthResponse>
  }

  const refreshSession = async (refreshToken: string) => {
    const url = new URL(STRAVA_TOKEN_URL)
    url.searchParams.append("client_id", STRAVA_CLIENT_ID)
    url.searchParams.append("client_secret", STRAVA_CLIENT_SECRET)
    url.searchParams.append("refresh_token", refreshToken)
    url.searchParams.append("grant_type", "refresh_token")

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.json() as Promise<
      Omit<AuthResponse, "athlete" | "token_type">
    >
  }

  return {
    exchangeCodeForSession,
    refreshSession,
  }
}
