import { QueryClient } from '@tanstack/react-query'

import { ApiError } from '../api/http'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
      {
        if (error instanceof ApiError && error.status < 500)
        {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
    },
  },
})
