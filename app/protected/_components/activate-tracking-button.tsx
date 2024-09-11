import { TypographyH2 } from '@/components/typography'
import { Button } from '@/components/ui/button'
import { subscribeStravaWebhookAction } from '@/lib/strava/actions'

export const ActivateTrackingButton = () => {
  return (
    <div className="flex h-full flex-1 flex-col">
      <TypographyH2>Custom Acitity Messages</TypographyH2>
      <form action={subscribeStravaWebhookAction}>
        <Button className="w-full" type="submit">
          Activate Tracking
        </Button>
      </form>
    </div>
  )
}
