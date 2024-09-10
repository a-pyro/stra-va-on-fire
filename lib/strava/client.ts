import { signInWithStravaAction } from "@/app/(auth-pages)/actions"
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

type StravaSessionRefreshResponse = Omit<
  StravaAuthResponse,
  "athlete" | "token_type"
>

const {
  NEXT_PUBLIC_STRAVA_CLIENT_ID: STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  NEXT_PUBLIC_STRAVA_TOKEN_URL: STRAVA_TOKEN_URL,
  NEXT_PUBLIC_STRAVA_API_URL: STRAVA_API_URL,
} = envVars

const cookieOptions = {
  httpOnly: true,
  secure: true,
  path: "/",
}

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
  ): Promise<Omit<StravaAuthResponse, "athlete" | "token_type">> => {
    const { athlete: _, ...rest } = await fetchStravaToken<StravaAuthResponse>({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    })

    Object.entries(rest).forEach(([key, value]) => {
      cookieStore.set(`strava_${key}`, JSON.stringify(value), {
        ...cookieOptions,
        maxAge: rest.expires_in,
      })
    })

    return rest
  }

  const isSessionExpired = () => {
    const expiresAt = cookieStore.get("strava_expires_at")
    if (!expiresAt) return true
    return +expiresAt.value * 1000 < Date.now()
  }

  const refreshSession = async () => {
    const refreshToken = cookieStore.get("strava_refresh_token")
    // first time sign in or session has been cleared
    if (!refreshToken) return signInWithStravaAction()

    const isExpired = isSessionExpired()

    if (!isExpired) {
      console.log("Session is not expired, no need to refresh")
      return {
        access_token: JSON.parse(
          cookieStore.get("strava_access_token")?.value as string,
        ),
        expires_at: JSON.parse(
          cookieStore.get("strava_expires_at")?.value as string,
        ),
        expires_in: JSON.parse(
          cookieStore.get("strava_expires_in")?.value as string,
        ),
        refresh_token: JSON.parse(
          cookieStore.get("strava_refresh_token")?.value as string,
        ),
      }
    }

    console.log("Session is expired, refreshing")
    const response = await fetchStravaToken<StravaSessionRefreshResponse>({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken.value,
      grant_type: "refresh_token",
    })

    Object.entries(response).forEach(([key, value]) => {
      cookieStore.set(`strava_${key}`, JSON.stringify(value), {
        ...cookieOptions,
        maxAge: response.expires_in,
      })
    })

    return response
  }

  const getAthlete = async () => {
    const token = cookieStore.get("strava_access_token")
    if (!token || isSessionExpired()) return null
    return await fetch(`${STRAVA_API_URL}/athlete`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token.value)}`,
      },
    }).then(async (res) => (await res.json()) as StravaAthlete)
  }

  const signOut = () => {
    cookieStore.delete("strava_access_token")
    cookieStore.delete("strava_expires_at")
    cookieStore.delete("strava_refresh_token")
    cookieStore.delete("strava_token_type")
    cookieStore.delete("strava_expires_in")
  }

  const getSession = () => {
    const token = cookieStore.get("strava_access_token")

    if (!token) return signInWithStravaAction()

    return {
      access_token: token.value,
    }
  }

  return {
    exchangeCodeForSession,
    refreshSession,
    getAthlete,
    isSessionExpired,
    getSession,
    signOut,
  }
}

export { createStravaClient }
