import { FormMessage, type Message } from '@/components/form-message'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createStravaClient } from '@/lib/strava/client'

import { SignInWithStravaButton } from '../(auth-pages)/_components/sign-in-with-strava-button'

import { ActivateTrackingButton } from './_components/activate-tracking-button'

const Page = async ({ searchParams }: { searchParams: Message }) => {
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
    <>
      <ActivateTrackingButton />
      <FormMessage message={searchParams} />
    </>
  )
}

export default Page
