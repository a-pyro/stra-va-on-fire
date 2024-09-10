"use server"

import { envVars } from "@/lib/env-vars"
import { createStravaClient } from "@/lib/strava/client"
import { createServerSideClient } from "@/lib/supabase/server"
import { encodedRedirect } from "@/lib/utils"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()
  const supabase = createServerSideClient()
  const origin = headers().get("origin")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error(error.code + " " + error.message)
    return encodedRedirect("error", "/sign-up", error.message)
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    )
  }
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerSideClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message)
  }

  return redirect("/protected")
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString()
  const supabase = createServerSideClient()
  const origin = headers().get("origin")
  const callbackUrl = formData.get("callbackUrl")?.toString()

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required")
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  })

  if (error) {
    console.error(error.message)
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    )
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  )
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createServerSideClient()

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    )
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    )
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    )
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated")
}

export const signOutAction = async () => {
  const supabase = createServerSideClient()
  const strava = createStravaClient()
  strava.signOut()
  await supabase.auth.signOut()
  return redirect("/sign-in")
}

export const signInWithGoogleAction = async () => {
  const orgin = headers().get("origin")
  const supabase = createServerSideClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${orgin}/auth/callback`,
    },
  })

  console.log("🚀 ~ signInWithGoogleAction ~ error:", error)

  if (data.url) redirect(data.url)
}

/*  http:www.strava.com/oauth/authorize?client_id=[REPLACE_WITH_YOUR_CLIENT_ID]&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read


Requested scopes, as a comma delimited string, e.g. "activity:read_all,activity:write". Applications should request only the scopes required for the application to function normally. The scope activity:read is required for activity webhooks.

read: read public segments, public routes, public profile data, public posts, public events, club feeds, and leaderboards
read_all:read private routes, private segments, and private events for the user
profile:read_all: read all profile information even if the user has set their profile visibility to Followers or Only You
profile:write: update the user's weight and Functional Threshold Power (FTP), and access to star or unstar segments on their behalf
activity:read: read the user's activity data for activities that are visible to Everyone and Followers, excluding privacy zone data
activity:read_all: the same access as activity:read, plus privacy zone data and access to read the user's activities with visibility set to Only You
activity:write: access to create manual activities and uploads, and access to edit any activities that are visible to the app, based on activity read access level
 */

export const signInWithStravaAction = async () => {
  const origin = headers().get("origin")
  const stravaAuthUrl = envVars.NEXT_PUBLIC_STRAVA_AUTH_URL
  const stravaClientId = envVars.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const redirectUri = `${origin}/auth/callback?source=strava`
  const scopes =
    "read,read_all,profile:read_all,profile:write,activity:read,activity:read_all,activity:write"
  const approvalPrompt = "force"
  const response_type = "code"

  redirect(
    `${stravaAuthUrl}?client_id=${stravaClientId}&redirect_uri=${redirectUri}&approval_prompt=${approvalPrompt}&scope=${scopes}&response_type=${response_type}`,
  )
}
