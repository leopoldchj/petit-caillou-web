const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export interface LoginInput
{
  username: string
  password: string
}

export interface RegisterInput
{
  username: string
  email: string
  password: string
}

export class ApiError extends Error
{
  readonly status: number

  constructor(message: string, status: number)
  {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface AuthResponse
{
  accessToken: string
  tokenType: string
}

interface ProblemDetail
{
  detail?: string
  title?: string
}

async function readErrorMessage(response: Response): Promise<string>
{
  try
  {
    const problem = (await response.json()) as ProblemDetail

    return problem.detail ?? problem.title ?? 'Something went wrong.'
  }
  catch
  {
    return 'Something went wrong.'
  }
}

async function postForToken(path: string, payload: LoginInput | RegisterInput): Promise<string>
{
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok)
  {
    throw new ApiError(await readErrorMessage(response), response.status)
  }

  const body = (await response.json()) as AuthResponse

  return body.accessToken
}

export function login(input: LoginInput): Promise<string>
{
  return postForToken('/auth/login', input)
}

export function register(input: RegisterInput): Promise<string>
{
  return postForToken('/auth/register', input)
}
