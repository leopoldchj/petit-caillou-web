import { useState, type SyntheticEvent } from 'react'

import { Alert, Box, Button, Group, Modal, Stack, Text } from '@mantine/core'

import { useApplyToOffer } from '../../api/applications'
import type { ApplyInput, Offer } from '../../api/types'
import { nullableText } from '../../lib/forms'
import { TrackingFields, type TrackingForm } from '../applications/TrackingFields'
import { CompanyLink } from '../companies/CompanyLink'

interface ApplyModalProps
{
  opened: boolean
  onClose: () => void
  offer: Offer | null
}

export function ApplyModal({ opened, onClose, offer }: ApplyModalProps)
{
  return (
    <Modal opened={opened} onClose={onClose} title="Apply to offer" centered>
      {opened && offer !== null && <ApplyForm offer={offer} onClose={onClose} />}
    </Modal>
  )
}

function ApplyForm({ offer, onClose }: { offer: Offer, onClose: () => void })
{
  const apply = useApplyToOffer()
  const [form, setForm] = useState<TrackingForm>(() => ({
    responseStatus: 'NO_RESPONSE',
    applicationDate: '',
    notes: '',
  }))

  const submit = (event: SyntheticEvent) =>
  {
    event.preventDefault()

    const input: ApplyInput = {
      offerId: offer.id,
      applicationDate: nullableText(form.applicationDate),
      responseStatus: form.responseStatus,
      notes: nullableText(form.notes),
    }

    apply.mutate(input, { onSuccess: onClose })
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack>
        {apply.error !== null && (
          <Alert color="red" title="Could not apply" variant="light">{apply.error.message}</Alert>
        )}

        <Stack gap={2}>
          <Text fw={600}>{offer.title}</Text>
          <CompanyLink company={offer.company} />
        </Stack>

        <TrackingFields value={form} onChange={(patch) =>
        {
          setForm((current) => ({ ...current, ...patch }))
        }}
        />

        <Group justify="flex-end">
          <Button variant="default" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={apply.isPending}>Apply</Button>
        </Group>
      </Stack>
    </Box>
  )
}
