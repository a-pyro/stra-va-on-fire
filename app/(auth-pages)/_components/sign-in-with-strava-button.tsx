import { Button, type ButtonProps } from '@/components/ui/button'

import { signInWithStravaAction } from '../actions'

export const SignInWithStravaButton = (props: ButtonProps) => (
  <form>
    <Button
      formAction={signInWithStravaAction}
      size="sm"
      type="submit"
      variant="outline"
      {...props}
    >
      Connect Strava Account
    </Button>
  </form>
)
