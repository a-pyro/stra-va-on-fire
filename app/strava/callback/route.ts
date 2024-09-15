import { NextResponse } from 'next/server'

import { stravaClient } from '@/lib/strava/client'
import { type StravaWebhookEvent } from '@/lib/strava/types'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const hubChallenge = requestUrl.searchParams.get('hub.challenge')
  const hubMode = requestUrl.searchParams.get('hub.mode')
  const hubVerifyToken = requestUrl.searchParams.get('hub.verify_token')

  const origin = requestUrl.origin

  if (code) {
    // coming from sign in with Strava
    await stravaClient.exchangeCodeForSession(code)
    return NextResponse.redirect(`${origin}/protected`)
  }

  if (hubChallenge && hubMode && hubVerifyToken) {
    return new Response(JSON.stringify({ 'hub.challenge': hubChallenge }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

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

export async function POST(request: Request) {
  const event = (await request.json()) as StravaWebhookEvent
  // eslint-disable-next-line no-console -- debug
  console.log({ event })
  // return 200 to acknowledge the event
  return NextResponse.json({ message: 'Event acknowledged' }, { status: 200 })
}
