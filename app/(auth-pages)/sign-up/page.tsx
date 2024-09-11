import Link from 'next/link'

import { FormMessage, type Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signUpAction } from '../actions'

const SignUpPage = ({ searchParams }: { searchParams: Message }) => {
  if ('message' in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    )
  }

  return (
    <form className="mx-auto flex min-w-64 max-w-64 flex-col">
      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text text-sm text-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-primary underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input required name="email" placeholder="you@example.com" />
        <Label htmlFor="password">Password</Label>
        <Input
          required
          minLength={6}
          name="password"
          placeholder="Your password"
          type="password"
        />
        <SubmitButton formAction={signUpAction} pendingText="Signing up...">
          Sign up
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  )
}

export default SignUpPage
