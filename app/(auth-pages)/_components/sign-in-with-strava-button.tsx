import { ActionFormButton } from '@/components/form/action-form-button'
import { type ButtonProps } from '@/components/ui/button'

import { signInWithStravaAction } from '../actions'

export const SignInWithStravaButton = (props: ButtonProps) => (
  <ActionFormButton
    formAction={signInWithStravaAction}
    size="sm"
    type="submit"
    variant="outline"
    {...props}
  >
    Connect Strava Account
  </ActionFormButton>
)
