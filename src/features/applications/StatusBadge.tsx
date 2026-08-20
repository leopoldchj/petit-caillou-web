import { Badge } from '@mantine/core'

import type { ResponseStatus } from '../../api/types'
import { STATUS_META } from './status'

export function StatusBadge({ status }: { status: ResponseStatus })
{
  const meta = STATUS_META[status]

  return <Badge color={meta.color} variant="light">{meta.label}</Badge>
}
