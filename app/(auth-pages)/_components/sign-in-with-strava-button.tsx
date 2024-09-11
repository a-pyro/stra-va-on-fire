import { Button, ButtonProps } from "@/components/ui/button"
import { signInWithStravaAction } from "../actions"

export const SignInWithStravaButton = (props: ButtonProps) => (
  <form>
    <Button
      type="submit"
      formAction={signInWithStravaAction}
      variant="outline"
      size="sm"
      {...props}
    >
      Connect Strava Account
    </Button>
  </form>
)
