import { TypographyH2 } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { envVars } from "@/lib/env-vars"
import { getStravaCallbackUrl } from "@/lib/strava"

export default async function Page() {
  const subscribeStravaWebhookAction = async () => {
    "use server"

    const formData = new URLSearchParams()
    formData.append("client_id", envVars.NEXT_PUBLIC_STRAVA_CLIENT_ID)
    formData.append("client_secret", envVars.STRAVA_CLIENT_SECRET)
    formData.append("callback_url", getStravaCallbackUrl())
    formData.append("verify_token", envVars.STRAVA_VERIFY_TOKEN)

    const endpoint = `${envVars.NEXT_PUBLIC_STRAVA_API_URL}/push_subscriptions`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (response.ok) {
      console.log("Subscription created successfully:", await response.json())
    } else {
      console.error("Failed to create subscription:", await response.json())
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <TypographyH2>Custom Acitity Messages</TypographyH2>
      <form action={subscribeStravaWebhookAction}>
        <Button type="submit" className="w-full">
          Activate Activity Tracking
        </Button>
      </form>
    </div>
  )
}
