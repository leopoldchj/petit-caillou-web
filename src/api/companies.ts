import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useApiRequest } from './http'
import type { Company, CompanyInput } from './types'

export function useCompanies()
{
  const request = useApiRequest()

  return useQuery({
    queryKey: ['companies'],
    queryFn: () => request<Company[]>('/companies'),
  })
}

export function useCreateCompany()
{
  const request = useApiRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CompanyInput) => request<Company>('/companies', { method: 'POST', body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export function useUpdateCompany()
{
  const request = useApiRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { id: string, input: CompanyInput }) =>
      request<Company>(`/companies/${variables.id}`, { method: 'PUT', body: variables.input }),
    onSuccess: async () =>
    {
      await queryClient.invalidateQueries({ queryKey: ['companies'] })
      await queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useDeleteCompany()
{
  const request = useApiRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => request<undefined>(`/companies/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })
}
