import { Button } from "@/components/ui/button"

import { createServerSideClient } from "@/lib/supabase/server"
import Link from "next/link"
import { signInWithGoogleAction, signOutAction } from "../actions"

export default async function AuthButton() {
  const {
    data: { user },
  } = await createServerSideClient().auth.getUser()

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>

      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>

      <form action={signInWithGoogleAction}>
        <Button type="submit" size="sm" variant={"default"}>
          Sign in with Google
        </Button>
      </form>
    </div>
  )
}
