export type StravaApiError = {
  message: string
  errors: {
    resource: string
    field: string
    code: string
  }[]
}

export type StravaWebookSubscriptionStatus = {
  id: number
  resource_state: number
  application_id: number
  callback_url: string
  created_at: string
  updated_at: string
}

export type StravaAthlete = {
  id: number
  username: string
  resource_state: number
  firstname: string
  lastname: string
  bio: string | null
  city: string
  state: string
  country: string
  sex: 'M' | 'F'
  premium: boolean
  summit: boolean
  created_at: string
  updated_at: string
  badge_type_id: number
  weight: number | null
  profile_medium: string
  profile: string
  friend: unknown
  follower: unknown
}

export type StravaAuthResponse = {
  token_type: string
  expires_at: number
  expires_in: number
  refresh_token: string
  access_token: string
  athlete: StravaAthlete
}

export type StravaWebhookEvent = {
  aspect_type: 'create' | 'update' | 'delete'
  event_time: number
  /** long integer	For activity events, the activity's ID. For athlete events, the athlete's ID.  */
  object_id: number
  object_type: 'activity' | 'athlete'
  /** The athlete's ID. */
  owner_id: number
  /** The push subscription ID that is receiving this event. */
  subscription_id: number
  /* hash	For activity update events, keys can contain "title," "type," and "private," which is always "true" (activity visibility set to Only You) or "false" (activity visibility set to Followers Only or Everyone). For app deauthorization events, there is always an "authorized" : "false" key-value pair.*  */
  updates: {
    title?: string
    type?: string
    private?: boolean
  }
}

export const stravaEndpoints = {
  athlete: 'athlete',
} as const

export type StravaEndpoint = keyof typeof stravaEndpoints
