import { ActionFormButton } from '@/components/form/action-form-button'
import { FormMessage, type Message } from '@/components/form-message'
import { TypographyH2 } from '@/components/typography'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getStravaSubscriptions } from '@/lib/strava'
import {
  revokeStravaWebhookAction,
  subscribeStravaWebhookAction,
} from '@/lib/strava/actions'
import { createStravaClient } from '@/lib/strava/client'

import { SignInWithStravaButton } from '../(auth-pages)/_components/sign-in-with-strava-button'

// TODO - move revoke to another page -- add loading state
const Page = async ({ searchParams }: { searchParams?: Message }) => {
  const athlete = await createStravaClient().getAthlete()
  const subscriptions = await getStravaSubscriptions()

  if (!athlete)
    return (
      <div className="flex h-full flex-1 flex-col">
        <Alert className="flex flex-1 flex-col gap-2">
          <AlertTitle>Connect with Strava</AlertTitle>
          <AlertDescription>
            To enable activity tracking, please log in with your Strava account.
          </AlertDescription>
          <SignInWithStravaButton className="mt-2 w-full" />
        </Alert>
      </div>
    )

  return (
    <>
      <div className="flex h-full flex-1 flex-col">
        <TypographyH2>Activity Tracking</TypographyH2>
        {subscriptions.length === 0 && (
          <ActionFormButton
            className="w-full"
            formAction={subscribeStravaWebhookAction}
          >
            Enable Activity Tracking
          </ActionFormButton>
        )}

        {subscriptions.length > 0 && (
          <Alert className="flex flex-1 flex-col gap-2">
            <AlertTitle>Activity Tracking Enabled</AlertTitle>
            <AlertDescription>
              Your activities from Strava are being tracked.
            </AlertDescription>
            <ActionFormButton
              className="w-full"
              formAction={revokeStravaWebhookAction}
              variant="destructive"
            >
              Disable Activity Tracking
            </ActionFormButton>
          </Alert>
        )}
      </div>

      {searchParams ? <FormMessage message={searchParams} /> : null}
    </>
  )
}

export default Page

/* 

Event Data
The Strava Webhook Events API supports webhook events for certain changes to athlete and activity objects. Specifically, webhook events are pushed when an athlete revokes access to an application, or when an activity is created, deleted, or one of the following activity fields are updated:

Title
Type
Privacy, requires an access token with activity:read_all scope
When one of these events occurs in Strava, a POST request is made to the callback url for each subscription to which the event pertains. The body of this POST request contains the object_type and aspect_type of the updated object in addition to an object_id, which is either an activity or athlete ID. If additional information about the object is required, an application must decide how or if it wants to fetch the most up-to-date data. For example, you may decide only to fetch new data for specific users, or after a certain number of activities have been uploaded.

The subscription callback endpoint must acknowledge the POST of each new event with a status code of 200 OK within two seconds. Event pushes are retried (up to a total of three attempts) if a 200 is not returned. If your application needs to do more processing of the received information, it should do so asynchronously.

These are the fields that are included with webhook events:

object_type
string	Always either "activity" or "athlete."
object_id
long integer	For activity events, the activity's ID. For athlete events, the athlete's ID.
aspect_type
string	Always "create," "update," or "delete."
updates
hash	For activity update events, keys can contain "title," "type," and "private," which is always "true" (activity visibility set to Only You) or "false" (activity visibility set to Followers Only or Everyone). For app deauthorization events, there is always an "authorized" : "false" key-value pair.
owner_id
long integer	The athlete's ID.
subscription_id
integer	The push subscription ID that is receiving this event.
event_time
long integer	The time that the event occurred.
Example Request
{
    "aspect_type": "update",
    "event_time": 1516126040,
    "object_id": 1360128428,
    "object_type": "activity",
    "owner_id": 134815,
    "subscription_id": 120475,
    "updates": {
        "title": "Messy"
    }
}
*/
