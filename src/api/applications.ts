import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { PAGE_SIZE } from '../lib/pagination'
import { useApiRequest } from './http'
import type { ApplicationTrackingInput, ApplyInput, JobApplication, Page } from './types'

export function useApplications(page: number)
{
  const request = useApiRequest()

  return useQuery({
    queryKey: ['applications', page],
    queryFn: () => request<Page<JobApplication>>(`/applications?page=${String(page)}&size=${String(PAGE_SIZE)}`),
  })
}

export function useApplyToOffer()
{
  const request = useApiRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ApplyInput) => request<JobApplication>('/applications', { method: 'POST', body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useUpdateApplication()
{
  const request = useApiRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { id: string, input: ApplicationTrackingInput }) =>
      request<JobApplication>(`/applications/${variables.id}`, { method: 'PATCH', body: variables.input }),
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
