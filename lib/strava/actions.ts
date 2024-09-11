'use server'

import { envVars } from '../env-vars'
import { encodedRedirect } from '../utils'

import { type StravaError } from './types'

import { getStravaCallbackUrl, parseStravaError } from '.'

export const subscribeStravaWebhookAction = async () => {
  const formData = new URLSearchParams()
  formData.append('client_id', envVars.NEXT_PUBLIC_STRAVA_CLIENT_ID)
  formData.append('client_secret', envVars.STRAVA_CLIENT_SECRET)
  formData.append('callback_url', getStravaCallbackUrl())
  formData.append('verify_token', envVars.STRAVA_VERIFY_TOKEN)

  const endpoint = `${envVars.NEXT_PUBLIC_STRAVA_API_URL}/push_subscriptions`

  const body = formData.toString()

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok)
    return encodedRedirect(
      'error',
      '/protected',
      parseStravaError((await response.json()) as StravaError),
    )
}
