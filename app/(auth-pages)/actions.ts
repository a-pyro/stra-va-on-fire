'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getStravaCallbackUrl } from '@/lib/strava'
import { createServerSideClient } from '@/lib/supabase/server'
import { encodedRedirect } from '@/lib/utils'
import { envVars } from '@/lib/utils/env-vars'

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const supabase = createServerSideClient()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- origin is always present
  const origin = headers().get('origin')!

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    encodedRedirect('error', '/sign-up', `${error.code ?? ''} ${error.message}`)
    return
  }
  encodedRedirect(
    'success',
    '/sign-up',
    'Thanks for signing up! Please check your email for a verification link.',
  )
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createServerSideClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    encodedRedirect('error', '/sign-in', error.message)
    return
  }

  return redirect('/protected')
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const supabase = createServerSideClient()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- origin is always present
  const origin = headers().get('origin')!
  const callbackUrl = formData.get('callbackUrl')?.toString()

  if (!email) {
    encodedRedirect('error', '/forgot-password', 'Email is required')
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we check for email above
  const { error } = await supabase.auth.resetPasswordForEmail(email!, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  })

  if (error) {
    encodedRedirect('error', '/forgot-password', 'Could not reset password')
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.',
  )
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createServerSideClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    encodedRedirect(
      'error',
      '/protected/reset-password',
      'Password and confirm password are required',
    )
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      'error',
      '/protected/reset-password',
      'Passwords do not match',
    )
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    encodedRedirect(
      'error',
      '/protected/reset-password',
      'Password update failed',
    )
  }

  encodedRedirect('success', '/protected/reset-password', 'Password updated')
}

export const signOutAction = async () => {
  const supabase = createServerSideClient()
  await supabase.auth.signOut()
  redirect('/sign-in')
}

export const signInWithGoogleAction = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- origin is always present
  const orgin = headers().get('origin')!
  const supabase = createServerSideClient()
  const redirectTo = `${orgin}/auth/callback`
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  })

  if (error)
    encodedRedirect('error', '/sign-in', `${error.code ?? ''} ${error.message}`)

  if (data.url) redirect(data.url)
}

// read: read public segments, public routes, public profile data, public posts, public events, club feeds, and leaderboards
// read_all:read private routes, private segments, and private events for the user
// profile:read_all: read all profile information even if the user has set their profile visibility to Followers or Only You
// profile:write: update the user's weight and Functional Threshold Power (FTP), and access to star or unstar segments on their behalf
// activity:read: read the user's activity data for activities that are visible to Everyone and Followers, excluding privacy zone data
// activity:read_all: the same access as activity:read, plus privacy zone data and access to read the user's activities with visibility set to Only You
// activity:write: access to create manual activities and uploads, and access to edit any activities that are visible to the app, based on activity read access level
const AUTHORIZATION_SCOPES = [
  'read',
  'read_all',
  'profile:read_all',
  'profile:write',
  'activity:read',
  'activity:read_all',
  'activity:write',
] as const

export const signInWithStravaAction = () => {
  const stravaAuthUrl = `${envVars.NEXT_PUBLIC_STRAVA_AUTH_URL}/authorize`
  const stravaClientId = envVars.STRAVA_CLIENT_ID
  const redirectUri = getStravaCallbackUrl()
  const scopes = AUTHORIZATION_SCOPES.join(',')
  const approvalPrompt = 'force'
  const responseType = 'code'

  redirect(
    `${stravaAuthUrl}?client_id=${stravaClientId}&redirect_uri=${redirectUri}&approval_prompt=${approvalPrompt}&scope=${scopes}&response_type=${responseType}`,
  )
}
