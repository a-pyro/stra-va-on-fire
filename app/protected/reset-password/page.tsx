import { resetPasswordAction } from '@/app/(auth-pages)/actions'
import { FormMessage, type Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ResetPassword = ({ searchParams }: { searchParams: Message }) => {
  return (
    <form className="flex w-full max-w-md flex-col gap-2 p-4 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <Input
        required
        name="password"
        placeholder="New password"
        type="password"
      />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <Input
        required
        name="confirmPassword"
        placeholder="Confirm password"
        type="password"
      />
      <SubmitButton formAction={resetPasswordAction}>
        Reset password
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  )
}

export default ResetPassword
