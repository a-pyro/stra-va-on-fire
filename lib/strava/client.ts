import { cookies } from "next/headers"
import "server-only"
import { envVars } from "../env-vars"

type StravaAthlete = {
  id: number
  username: string
  resource_state: number
  firstname: string
  lastname: string
  bio: string | null
  city: string
  state: string
  country: string
  sex: "M" | "F"
  premium: boolean
  summit: boolean
  created_at: string
  updated_at: string
  badge_type_id: number
  weight: number | null
  profile_medium: string
  profile: string
  friend: unknown | null
  follower: unknown | null
}

type StravaAuthResponse = {
  token_type: string
  expires_at: number
  expires_in: number
  refresh_token: string
  access_token: string
  athlete: StravaAthlete
}

const {
  NEXT_PUBLIC_STRAVA_CLIENT_ID: STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  NEXT_PUBLIC_STRAVA_TOKEN_URL: STRAVA_TOKEN_URL,
} = envVars

const fetchStravaToken = async <T>(
  params: Record<string, string>,
): Promise<T> => {
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
  const cookieStore = cookies()

  const exchangeCodeForSession = async (
    code: string,
  ): Promise<StravaAuthResponse> => {
    const response = await fetchStravaToken<StravaAuthResponse>({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    })

    Object.entries(response).forEach(([key, value]) => {
      cookieStore.set(`strava_${key}`, JSON.stringify(value))
    })

    return response
  }

  const refreshSession = async (
    refreshToken: string,
  ): Promise<Omit<StravaAuthResponse, "athlete" | "token_type">> => {
    const response = fetchStravaToken<
      Omit<StravaAuthResponse, "athlete" | "token_type">
    >({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    })

    Object.entries(response).forEach(([key, value]) => {
      cookieStore.set(`strava_${key}`, JSON.stringify(value))
    })

    return response
  }

  const getAthlete = () => {
    const athlete = cookieStore.get("strava_athlete")

    if (!athlete) return null

    return {
      athlete: JSON.parse(athlete.value) as StravaAthlete,
    }
  }

  return {
    exchangeCodeForSession,
    refreshSession,
    getAthlete,
  }
}

export { createStravaClient }
