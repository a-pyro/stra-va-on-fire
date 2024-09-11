import Link from 'next/link'

import { ActionFormButton } from '@/components/form/action-form-button'
import { Button } from '@/components/ui/button'
import { createServerSideClient } from '@/lib/supabase/server'

import { signInWithGoogleAction, signOutAction } from '../actions'

import { AthleteHeaderMenu } from './athlete-header-menu'

export const HeaderAuth = async () => {
  const {
    data: { user },
  } = await createServerSideClient().auth.getUser()

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">Hey, {user.email}!</span>
      <AthleteHeaderMenu />
      <ActionFormButton
        className="w-full"
        formAction={signOutAction}
        size="sm"
        variant="outline"
      >
        Sign out
      </ActionFormButton>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Sign up</Link>
      </Button>
      <ActionFormButton
        formAction={signInWithGoogleAction}
        size="sm"
        variant="default"
      >
        Sign in with Google
      </ActionFormButton>
    </div>
  )
}
