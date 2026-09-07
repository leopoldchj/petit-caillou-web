export type ResponseStatus = 'REFUSED' | 'NO_RESPONSE' | 'INTERVIEW' | 'ACCEPTED'

export type OfferVisibility = 'PUBLIC' | 'PRIVATE'

export interface Page<T>
{
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface Company
{
  id: string
  name: string
  website: string | null
}

export interface Offer
{
  id: string
  company: Company
  title: string
  location: string | null
  publicationDate: string
  link: string | null
  description: string | null
  verified: boolean
  visibility: OfferVisibility
}

export interface OfferInput
{
  companyId: string
  title: string
  location: string | null
  publicationDate: string
  link: string | null
  description: string | null
}

export interface JobApplication
{
  id: string
  offer: Offer
  applicationDate: string | null
  responseStatus: ResponseStatus
  notes: string | null
}

export interface ApplyInput
{
  offerId: string
  applicationDate: string | null
  responseStatus: ResponseStatus
  notes: string | null
}

export interface ApplicationTrackingInput
{
  applicationDate: string | null
  responseStatus: ResponseStatus
  notes: string | null
}

export interface CompanyInput
{
  name: string
  website: string | null
}
