import { TypographyH2 } from '@/components/typography'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { envVars } from '@/lib/env-vars'
import { getStravaCallbackUrl } from '@/lib/strava'
import { createStravaClient } from '@/lib/strava/client'

import { SignInWithStravaButton } from '../(auth-pages)/_components/sign-in-with-strava-button'

const subscribeStravaWebhookAction = async () => {
  'use server'

  const formData = new URLSearchParams()
  formData.append('client_id', envVars.NEXT_PUBLIC_STRAVA_CLIENT_ID)
  formData.append('client_secret', envVars.STRAVA_CLIENT_SECRET)
  formData.append('callback_url', getStravaCallbackUrl())
  formData.append('verify_token', envVars.STRAVA_VERIFY_TOKEN)

  const endpoint = `${envVars.NEXT_PUBLIC_STRAVA_API_URL}/push_subscriptions`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })

  if (response.ok) {
    // TODO: handle
  } else {
    // TODO: handle
  }
}

const Page = async () => {
  const athlete = await createStravaClient().getAthlete()

  if (!athlete)
    return (
      <div className="flex h-full flex-1 flex-col">
        <Alert className="flex flex-1 flex-col gap-2">
          <AlertTitle>Login with strava first</AlertTitle>
          <AlertDescription>
            You must login with Strava in order to activate activity tracking.
          </AlertDescription>
          <SignInWithStravaButton className="mt-2 w-full" />
        </Alert>
      </div>
    )

  return (
    <div className="flex h-full flex-1 flex-col">
      <TypographyH2>Custom Acitity Messages</TypographyH2>
      <form action={subscribeStravaWebhookAction}>
        <Button className="w-full" type="submit">
          Activate Activity Tracking
        </Button>
      </form>
    </div>
  )
}

export default Page
