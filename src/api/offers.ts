import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { PAGE_SIZE } from '../lib/pagination'
import { useApiRequest } from './http'
import type { Offer, OfferInput, Page } from './types'

export function useOffers(page: number)
{
  const request = useApiRequest()

  return useQuery({
    queryKey: ['offers', page],
    queryFn: () => request<Page<Offer>>(`/offers?page=${String(page)}&size=${String(PAGE_SIZE)}`),
  })
}

export function useCreateOffer()
{
  const request = useApiRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: OfferInput) => request<Offer>('/offers', { method: 'POST', body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  })
}
