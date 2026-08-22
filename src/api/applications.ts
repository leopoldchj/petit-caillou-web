import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useApiRequest } from './http'
import type { JobApplication, JobApplicationInput } from './types'

export function useApplications(companyId: string | null)
{
  const request = useApiRequest()
  const query = companyId === null ? '' : `?companyId=${encodeURIComponent(companyId)}`

  return useQuery({
    queryKey: ['applications', companyId],
    queryFn: () => request<JobApplication[]>(`/applications${query}`),
  })
}

export function useCreateApplication()
{
  const request = useApiRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: JobApplicationInput) => request<JobApplication>('/applications', { method: 'POST', body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useUpdateApplication()
{
  const request = useApiRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { id: string, input: JobApplicationInput }) =>
      request<JobApplication>(`/applications/${variables.id}`, { method: 'PUT', body: variables.input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useDeleteApplication()
{
  const request = useApiRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => request<undefined>(`/applications/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}
