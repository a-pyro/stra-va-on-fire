import { cookies } from 'next/headers'

import 'server-only'

import { envVars } from '../utils/env-vars'

import {
  type StravaAthlete,
  type StravaAuthResponse,
  type StravaEndpoint,
  stravaEndpoints,
} from './types'

const cookieOptions = {
  httpOnly: true,
  secure: true,
  path: '/',
}

const fetchStravaToken = async <T>(
  params: Record<string, string>,
): Promise<T> => {
  const url = new URL(`${envVars.NEXT_PUBLIC_STRAVA_AUTH_URL}/token`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  return response.json() as Promise<T>
}

const createStravaClient = () => {
  const cookieStore = cookies()

  const exchangeCodeForSession = async (
    code: string,
  ): Promise<Omit<StravaAuthResponse, 'athlete' | 'token_type'>> => {
    const response = await fetchStravaToken<StravaAuthResponse>({
      client_id: envVars.STRAVA_CLIENT_ID,
      client_secret: envVars.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    })

    const { athlete: _, ...rest } = response

    Object.entries(rest).forEach(([key, value]) => {
      cookieStore.set(`strava_${key}`, value.toString(), {
        ...cookieOptions,
        maxAge: rest.expires_in,
      })
    })

    return rest
  }

  const isSessionExpired = () => {
    const expiresAt = cookieStore.get('strava_expires_at')
    if (!expiresAt) return true
    return Number(expiresAt.value) * 1000 < Date.now()
  }

  const fetchStravaApi = async <T>(
    endpoint: StravaEndpoint,
  ): Promise<T | null> => {
    const token = cookieStore.get('strava_access_token')
    if (!token || isSessionExpired()) return null

    const url = `${envVars.NEXT_PUBLIC_STRAVA_API_URL}/${stravaEndpoints[endpoint]}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    return response.json() as Promise<T>
  }

  const getAthlete = async () => {
    return fetchStravaApi<StravaAthlete>('athlete')
  }

  const signOut = () => {
    cookieStore.delete('strava_access_token')
    cookieStore.delete('strava_expires_at')
    cookieStore.delete('strava_refresh_token')
    cookieStore.delete('strava_token_type')
    cookieStore.delete('strava_expires_in')
  }

  // TODO - implement deauthorization
  return {
    exchangeCodeForSession,
    getAthlete,
    isSessionExpired,
    signOut,
  }
}

export { createStravaClient }
