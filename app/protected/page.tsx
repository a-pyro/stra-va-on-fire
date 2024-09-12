import { FormMessage, type Message } from '@/components/form-message'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createStravaClient } from '@/lib/strava/client'

import { SignInWithStravaButton } from '../(auth-pages)/_components/sign-in-with-strava-button'

// TODO - move revoke to another page -- add loading state
const Page = async ({ searchParams }: { searchParams?: Message }) => {
  const athlete = await createStravaClient().getAthlete()

  if (!athlete)
    return (
      <div className="flex h-full flex-1 flex-col gap-4">
        <Alert className="flex flex-1 flex-col gap-2">
          <AlertTitle>Connect with Strava</AlertTitle>
          <AlertDescription>
            To enable activity tracking, please log in with your Strava account.
          </AlertDescription>
          <SignInWithStravaButton className="mt-2 w-full" />
        </Alert>
        <FormMessage message={searchParams} />
      </div>
    )
  return <FormMessage message={searchParams} />
}

export default Page
