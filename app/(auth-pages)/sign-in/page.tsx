import Link from 'next/link'

import { FormMessage, type Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signInAction } from '../actions'

const LoginPage = ({ searchParams }: { searchParams: Message }) => {
  return (
    <form className="flex min-w-64 flex-1 flex-col">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don&apos;t have an account?{' '}
        <Link className="font-medium text-foreground underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input required name="email" placeholder="you@example.com" />
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          required
          name="password"
          placeholder="Your password"
          type="password"
        />
        <SubmitButton formAction={signInAction} pendingText="Signing In...">
          Sign in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  )
}

export default LoginPage
