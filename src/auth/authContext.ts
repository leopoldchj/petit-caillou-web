import { createContext, useContext } from 'react'

import type { AuthUser } from './token'

export interface AuthContextValue
{
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue
{
  const value = useContext(AuthContext)

  if (!value)
  {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return value
}
