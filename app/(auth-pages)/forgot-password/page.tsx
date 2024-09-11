import Link from 'next/link'

import { FormMessage, type Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { forgotPasswordAction } from '../actions'

const ForgotPasswordPage = ({ searchParams }: { searchParams: Message }) => {
  return (
    <form className="mx-auto flex w-full min-w-64 max-w-64 flex-1 flex-col gap-2 text-foreground [&>input]:mb-6">
      <div>
        <h1 className="text-2xl font-medium">Reset Password</h1>
        <p className="text-sm text-secondary-foreground">
          Already have an account?{' '}
          <Link className="text-primary underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input required name="email" placeholder="you@example.com" />
        <SubmitButton formAction={forgotPasswordAction}>
          Reset Password
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  )
}

export default ForgotPasswordPage
