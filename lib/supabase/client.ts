import { createBrowserClient } from '@supabase/ssr'

import { envVars } from '../utils/env-vars'

import { type Database } from './generated-types'

export const createClientSideClient = () =>
  createBrowserClient<Database>(
    envVars.NEXT_PUBLIC_SUPABASE_URL,
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
