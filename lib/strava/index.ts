import { headers } from 'next/headers'

import { type StravaError } from './types'

export const getStravaCallbackUrl = () => {
  const origin = headers().get('origin')
  return `${origin}/strava/callback`
}

export const parseStravaError = ({ errors, message }: StravaError) => {
  return `${message}: ${errors
    .map(
      ({ resource, code, field }) =>
        `Resource: ${resource}, Field: ${field} Code: ${code}`,
    )
    .join(', ')}`
}
