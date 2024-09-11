export type StravaError = {
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
