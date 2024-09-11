import { FormMessage, type Message } from '@/components/form-message'
import { TypographyH2 } from '@/components/typography'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { getStravaSubscriptions } from '@/lib/strava'
import {
  revokeStravaWebhookAction,
  subscribeStravaWebhookAction,
} from '@/lib/strava/actions'
import { createStravaClient } from '@/lib/strava/client'

import { SignInWithStravaButton } from '../(auth-pages)/_components/sign-in-with-strava-button'

const Page = async ({ searchParams }: { searchParams?: Message }) => {
  const athlete = await createStravaClient().getAthlete()
  const subscriptions = await getStravaSubscriptions()

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
    <>
      <div className="flex h-full flex-1 flex-col">
        <TypographyH2>Acitivy tracking</TypographyH2>
        {subscriptions.length === 0 && (
          <form action={subscribeStravaWebhookAction}>
            <Button className="w-full" type="submit">
              Activate
            </Button>
          </form>
        )}

        {subscriptions.length > 0 && (
          <Alert className="flex flex-1 flex-col gap-2">
            <AlertTitle>Activity tracking is active</AlertTitle>
            <AlertDescription>
              You are currently tracking activities from Strava
            </AlertDescription>
            <form action={revokeStravaWebhookAction}>
              <Button className="w-full" type="submit" variant="destructive">
                Revoke access
              </Button>
            </form>
          </Alert>
        )}
      </div>

      {searchParams ? <FormMessage message={searchParams} /> : null}
    </>
  )
}

export default Page
