import { headers } from 'next/headers'

import { envVars } from '../utils/env-vars'

import {
  type StravaApiErrorResponse,
  type StravaWebookSubscriptionStatus,
} from './types'

export const getStravaCallbackUrl = () => {
  const origin = headers().get('origin')
  if (!origin) throw new Error('Origin header is missing')

  return `${origin}/strava/callback`
}

export const parseStravaError = ({
  errors,
  message,
}: StravaApiErrorResponse) => {
  return `${message}: ${errors
    .map(
      ({ resource, code, field }) =>
        `Resource: ${resource}, Field: ${field} Code: ${code}`,
    )
    .join(', ')}`
}

export const getStravaSubscriptions = async (): Promise<
  StravaWebookSubscriptionStatus[]
> => {
  const endpoint = `${envVars.NEXT_PUBLIC_STRAVA_API_URL}/push_subscriptions?client_id=${envVars.STRAVA_CLIENT_ID}&client_secret=${envVars.STRAVA_CLIENT_SECRET}`
  const response = await fetch(endpoint)
  return response.json() as Promise<StravaWebookSubscriptionStatus[]>
}


export const isStravaApiErrorResponse = (
  response: unknown,
): response is StravaApiErrorResponse => {
  return typeof response === 'object' && response !== null && 'message' in response
}

