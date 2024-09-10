/**
 * Strava API client
 * - Token Exchange
 * - Refresh Token
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

const {
  NEXT_PUBLIC_STRAVA_CLIENT_ID: STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  NEXT_PUBLIC_STRAVA_TOKEN_URL: STRAVA_TOKEN_URL,
} = envVars

const fetchStravaToken = async (params: Record<string, string>) => {
  const url = new URL(STRAVA_TOKEN_URL)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  return response.json()
}

const createStravaClient = () => {
  const exchangeCodeForSession = async (
    code: string,
  ): Promise<AuthResponse> => {
    return fetchStravaToken({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    })
  }

  const refreshSession = async (
    refreshToken: string,
  ): Promise<Omit<AuthResponse, "athlete" | "token_type">> => {
    return fetchStravaToken({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    })
  }

  return {
    exchangeCodeForSession,
    refreshSession,
  }
}

export { createStravaClient }
