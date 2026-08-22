import type { ResponseStatus } from '../../api/types'

interface StatusMeta
{
  label: string
  color: string
}

export const STATUS_META: Record<ResponseStatus, StatusMeta> = {
  NO_RESPONSE: { label: 'No response', color: 'gray' },
  INTERVIEW: { label: 'Interview', color: 'blue' },
  ACCEPTED: { label: 'Accepted', color: 'teal' },
  REFUSED: { label: 'Refused', color: 'red' },
}

export const STATUS_OPTIONS = (Object.keys(STATUS_META) as ResponseStatus[]).map((value) => ({
  value,
  label: STATUS_META[value].label,
}))
