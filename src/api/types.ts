export type ResponseStatus = 'REFUSED' | 'NO_RESPONSE' | 'INTERVIEW' | 'ACCEPTED'

export interface Company
{
  id: string
  name: string
  website: string | null
}

export interface JobApplication
{
  id: string
  company: Company
  link: string | null
  title: string
  description: string | null
  location: string | null
  applicationDate: string | null
  responseStatus: ResponseStatus
}

export interface JobApplicationInput
{
  companyId: string
  title: string
  link: string | null
  description: string | null
  location: string | null
  applicationDate: string | null
  responseStatus: ResponseStatus
}

export interface CompanyInput
{
  name: string
  website: string | null
}
