import { useAuth } from '../auth/authContext'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error
{
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown)
  {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface ProblemDetail
{
  detail?: string
  title?: string
}

interface RequestOptions
{
  method?: string
  body?: unknown
}

async function readBody(response: Response): Promise<unknown>
{
  try
  {
    return await response.json()
  }
  catch
  {
    return null
  }
}

export function useApiRequest()
{
  const { token, logout } = useAuth()

  return async function request<T>(path: string, options: RequestOptions = {}): Promise<T>
  {
    const response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token === null ? {} : { Authorization: `Bearer ${token}` }),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })

    if (response.status === 401)
    {
      logout()
      throw new ApiError('Your session has expired. Please sign in again.', 401, null)
    }

    if (!response.ok)
    {
      const parsed = await readBody(response)
      const problem = parsed as ProblemDetail | null
      const message = problem?.detail ?? problem?.title ?? 'Something went wrong.'
      throw new ApiError(message, response.status, parsed)
    }

    if (response.status === 204)
    {
      return undefined as T
    }

    const data: unknown = await response.json()
    return data as T
  }
}

export function existingCompanyId(error: unknown): string | null
{
  if (error instanceof ApiError && error.status === 409 && typeof error.body === 'object' && error.body !== null)
  {
    const value = (error.body as Record<string, unknown>).existingCompanyId
    return typeof value === 'string' ? value : null
  }

  return null
}
