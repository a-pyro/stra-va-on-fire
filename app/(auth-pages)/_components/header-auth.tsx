import { Button } from "@/components/ui/button"

import { createStravaClient } from "@/lib/strava/client"
import { createServerSideClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  signInWithGoogleAction,
  signInWithStravaAction,
  signOutAction,
} from "../actions"

export default async function AuthButton() {
  const {
    data: { user },
  } = await createServerSideClient().auth.getUser()

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form>
        <div className="flex gap-2">
          <AtheleteHeaderMenu />
          <Button type="submit" formAction={signOutAction} variant={"outline"}>
            Sign out
          </Button>
        </div>
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

const AtheleteHeaderMenu = async () => {
  const athlete = await createStravaClient().getAthlete()

  if (!athlete)
    return (
      <Button
        type="submit"
        formAction={signInWithStravaAction}
        variant={"outline"}
      >
        Connect Strava Account
      </Button>
    )

  return (
    <div>
      <img src={athlete.profile} alt={athlete.firstname} />
      <p>{athlete.username}</p>
    </div>
  )
}
