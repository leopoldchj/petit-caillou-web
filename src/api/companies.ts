import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useApiRequest } from './http'
import type { Company, CompanyInput, Page } from './types'
import { PAGE_SIZE } from '../lib/pagination'

export function useCompanies(query = '', page = 0)
{
  const request = useApiRequest()

  return useQuery({
    queryKey: ['companies', 'search', query, page],
    queryFn: () => request<Page<Company>>(`/companies?query=${encodeURIComponent(query)}&page=${String(page)}&size=${String(PAGE_SIZE)}`),
  })
}

export function useCompany(id: string | null)
{
  const request = useApiRequest()

  return useQuery({
    queryKey: ['companies', 'detail', id],
    queryFn: () => request<Company>(`/companies/${id ?? ''}`),
    enabled: id !== null,
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
      await queryClient.invalidateQueries({ queryKey: ['offers'] })
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
