import { ActionFormButton } from '@/components/form/action-form-button'
import { FormMessage, type Message } from '@/components/form-message'
import { TypographyH2 } from '@/components/typography'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getStravaSubscriptions } from '@/lib/strava'
import {
  revokeStravaWebhookAction,
  subscribeStravaWebhookAction,
} from '@/lib/strava/actions'

// TODO: hide this page and check for admin role
const AdminPage = async ({ searchParams }: { searchParams?: Message }) => {
  const subscriptions = await getStravaSubscriptions()

  return (
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
      <FormMessage message={searchParams} />
    </div>
  )
}
export default AdminPage
