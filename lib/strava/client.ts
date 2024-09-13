import { cookies } from 'next/headers'

import 'server-only'

import { envVars } from '../utils/env-vars'

import {
  type StravaApiErrorResponse,
  type StravaAthlete,
  type StravaAuthResponse,
  type StravaEndpoint,
  type StravaRefreshTokenResponse,
  stravaEndpoints,
} from './types'

import { parseStravaError } from '.'

const cookieOptions = {
  httpOnly: true,
  secure: true,
  path: '/',
}

const fetchStravaToken = async <T>(
  params: Record<string, string>,
): Promise<T | { error: string }> => {
  const url = new URL(`${envVars.NEXT_PUBLIC_STRAVA_AUTH_URL}/token`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    return {
      error: parseStravaError(
        (await response.json()) as StravaApiErrorResponse,
      ),
    }
  }

  return response.json() as Promise<T>
}

const exchangeCodeForSession = async (
  code: string,
): Promise<
  Omit<StravaAuthResponse, 'athlete' | 'token_type'> | { error: string }
> => {
  const cookieStore = cookies()

  const response = await fetchStravaToken<StravaAuthResponse>({
    client_id: envVars.STRAVA_CLIENT_ID,
    client_secret: envVars.STRAVA_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
  })

  if ('error' in response) {
    return { error: response.error }
  }

  const { athlete: _, ...rest } = response

  Object.entries(rest).forEach(([key, value]) => {
    cookieStore.set(`strava_${key}`, value.toString(), {
      ...cookieOptions,
      maxAge: rest.expires_in,
    })
  })

  return rest
}

const refreshToken = async (stravaRefreshToken: string) => {
  const response = await fetchStravaToken<StravaRefreshTokenResponse>({
    client_id: envVars.STRAVA_CLIENT_ID,
    client_secret: envVars.STRAVA_CLIENT_SECRET,
    refresh_token: stravaRefreshToken,
    grant_type: 'refresh_token',
  })

  if ('error' in response) {
    // Handle the error case
    return null
  }

  // Update the cookies with the new token information
  const cookieStore = cookies()
  Object.entries(response).forEach(([key, value]) => {
    cookieStore.set(`strava_${key}`, value.toString(), {
      ...cookieOptions,
      maxAge: response.expires_in,
    })
  })

  return response.access_token
}

const isSessionExpired = () => {
  const cookieStore = cookies()
  const expiresAt = cookieStore.get('strava_expires_at')
  if (!expiresAt) return true
  return Number(expiresAt.value) * 1000 < Date.now()
}

const checkSession = async () => {
  const cookieStore = cookies()
  const stravaRefreshToken = cookieStore.get('strava_refresh_token')

  if (isSessionExpired() && stravaRefreshToken) {
    const accessToken = await refreshToken(stravaRefreshToken.value)
    if (accessToken) {
      return accessToken
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- token exists
  return cookieStore.get('strava_access_token')!.value
}

const fetchStravaApi = async <T>(
  endpoint: StravaEndpoint,
): Promise<T | StravaApiErrorResponse> => {
  const token = await checkSession()
  const url = `${envVars.NEXT_PUBLIC_STRAVA_API_URL}/${stravaEndpoints[endpoint]}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json() as Promise<T | StravaApiErrorResponse>
}

const getAthlete = async () => {
  return fetchStravaApi<StravaAthlete>('athlete')
}

const stravaClient = {
  exchangeCodeForSession,
  getAthlete,
  isSessionExpired,
  refreshToken,
}

export { stravaClient }
