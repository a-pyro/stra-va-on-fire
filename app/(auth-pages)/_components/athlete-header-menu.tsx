import { UserCircle } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createStravaClient } from '@/lib/strava/client'

import { SignInWithStravaButton } from './sign-in-with-strava-button'

export const AthleteHeaderMenu = async () => {
  const athlete = await createStravaClient().getAthlete()

  if (!athlete) return <SignInWithStravaButton />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarImage alt={athlete.firstname} src={athlete.profile} />
            <AvatarFallback>{athlete.firstname[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {athlete.firstname} {athlete.lastname}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{athlete.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="hover:cursor-pointer">
          <Link href="/protected/profile">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// fallback
export const AthleteHeaderMenuFallback = () => (
  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
)
