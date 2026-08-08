import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { AuthContext, type AuthContextValue } from './authContext'
import { clearStoredToken, readStoredToken, readValidUser, storeToken } from './token'

function initialToken(): string | null
{
  const stored = readStoredToken()

  if (stored && readValidUser(stored))
  {
    return stored
  }

  if (stored)
  {
    clearStoredToken()
  }

  return null
}

export function AuthProvider({ children }: { children: ReactNode })
{
  const [token, setToken] = useState<string | null>(initialToken)

  const login = useCallback((next: string) =>
  {
    storeToken(next)
    setToken(next)
  }, [])

  const logout = useCallback(() =>
  {
    clearStoredToken()
    setToken(null)
  }, [])

  const value = useMemo<AuthContextValue>(() =>
  {
    const user = token ? readValidUser(token) : null

    return {
      user,
      token,
      isAuthenticated: user !== null,
      login,
      logout,
    }
  }, [token, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
