'use server'

import { revalidatePath } from 'next/cache'

import { encodedRedirect } from '../utils'
import { envVars } from '../utils/env-vars'

import { type StravaApiErrorResponse } from './types'

import {
  getStravaCallbackUrl,
  getStravaSubscriptions,
  parseStravaError,
} from '.'

export const subscribeStravaWebhookAction = async () => {
  const formData = new URLSearchParams()
  formData.append('client_id', envVars.STRAVA_CLIENT_ID)
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

  if (!response.ok) {
    encodedRedirect(
      'error',
      '/protected/admin',
      parseStravaError((await response.json()) as StravaApiErrorResponse),
    )
    return { message: `Failed to subscribe to Strava webhooks` }
  }

  revalidatePath('/protected/admin')
  return { message: `Successfully subscribed to Strava webhooks` }
}

export const revokeStravaWebhookAction = async () => {
  const [subsciption] = await getStravaSubscriptions()

  // eslint-disable-next-line no-console -- debug
  console.log({ subsciption })

  if (!subsciption) {
    return { message: `No Strava webhooks to unsubscribe from` }
  }

  const endpoint = `${envVars.NEXT_PUBLIC_STRAVA_API_URL}/push_subscriptions/${subsciption.id.toString()}?client_id=${envVars.STRAVA_CLIENT_ID}&client_secret=${envVars.STRAVA_CLIENT_SECRET}`

  const response = await fetch(endpoint, {
    method: 'DELETE',
  })

  if (!response.ok) {
    encodedRedirect(
      'error',
      '/protected/admin',
      parseStravaError((await response.json()) as StravaApiErrorResponse),
    )
    return { message: `Failed to unsubscribe from Strava webhooks` }
  }

  revalidatePath('/protected/admin')
  return { message: `Successfully unsubscribed from Strava webhooks` }
}

/* 
https://developers.strava.com/docs/webhooks/
*/
