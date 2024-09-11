import {
  type Database,
  type Tables,
  type TablesInsert,
  type TablesUpdate,
} from './generated-types'

export const ENTITIES = {
  profiles: 'profiles',
} as const

// Override the type for a specific column in a view:
export type Entity = keyof Database['public']['Tables']

export type Profile = Tables<'profiles'> & { email: string }
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>
