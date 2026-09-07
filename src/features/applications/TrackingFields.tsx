import { Select, Stack, Textarea, TextInput } from '@mantine/core'

import type { ResponseStatus } from '../../api/types'
import { STATUS_OPTIONS } from './status'

export interface TrackingForm
{
  responseStatus: ResponseStatus
  applicationDate: string
  notes: string
}

interface TrackingFieldsProps
{
  value: TrackingForm
  onChange: (patch: Partial<TrackingForm>) => void
}

export function TrackingFields({ value, onChange }: TrackingFieldsProps)
{
  return (
    <Stack>
      <Select
        label="Status"
        data={STATUS_OPTIONS}
        value={value.responseStatus}
        allowDeselect={false}
        onChange={(status) =>
        {
          if (status !== null)
          {
            onChange({ responseStatus: status })
          }
        }}
      />

      <TextInput
        label="Application date"
        type="date"
        value={value.applicationDate}
        onChange={(event) =>
        {
          onChange({ applicationDate: event.currentTarget.value })
        }}
      />

      <Textarea
        label="Notes"
        autosize
        minRows={2}
        value={value.notes}
        onChange={(event) =>
        {
          onChange({ notes: event.currentTarget.value })
        }}
      />
    </Stack>
  )
}
