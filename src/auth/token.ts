export interface AuthUser
{
  alias: string
  email: string
  role: string
}

interface TokenClaims
{
  sub: string
  email: string
  role: string
  exp: number
}

const TOKEN_STORAGE_KEY = 'petit-caillou.token'

function base64UrlDecode(value: string): string
{
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

  return atob(padded)
}

function decodeClaims(token: string): TokenClaims | null
{
  const parts = token.split('.')

  if (parts.length !== 3)
  {
    return null
  }

  try
  {
    const claims = JSON.parse(base64UrlDecode(parts[1])) as Partial<TokenClaims>

    if (
      typeof claims.sub !== 'string'
      || typeof claims.email !== 'string'
      || typeof claims.role !== 'string'
      || typeof claims.exp !== 'number'
    )
    {
      return null
    }

    return { sub: claims.sub, email: claims.email, role: claims.role, exp: claims.exp }
  }
  catch
  {
    return null
  }
}

export function readValidUser(token: string): AuthUser | null
{
  const claims = decodeClaims(token)

  if (!claims || claims.exp <= Date.now() / 1000)
  {
    return null
  }

  return { alias: claims.sub, email: claims.email, role: claims.role }
}

export function readStoredToken(): string | null
{
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function storeToken(token: string): void
{
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearStoredToken(): void
{
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}
