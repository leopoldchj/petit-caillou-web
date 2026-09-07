import { useState, type SyntheticEvent } from 'react'

import { Alert, Box, Button, Group, Modal, Stack, Text } from '@mantine/core'

import { useUpdateApplication } from '../../api/applications'
import type { ApplicationTrackingInput, JobApplication } from '../../api/types'
import { nullableText } from '../../lib/forms'
import { CompanyLink } from '../companies/CompanyLink'
import { TrackingFields, type TrackingForm } from './TrackingFields'

interface EditApplicationModalProps
{
  opened: boolean
  onClose: () => void
  application: JobApplication | null
}

export function EditApplicationModal({ opened, onClose, application }: EditApplicationModalProps)
{
  return (
    <Modal opened={opened} onClose={onClose} title="Edit application" centered>
      {opened && application !== null && <EditForm application={application} onClose={onClose} />}
    </Modal>
  )
}

function EditForm({ application, onClose }: { application: JobApplication, onClose: () => void })
{
  const updateApplication = useUpdateApplication()
  const [form, setForm] = useState<TrackingForm>(() => ({
    responseStatus: application.responseStatus,
    applicationDate: application.applicationDate ?? '',
    notes: application.notes ?? '',
  }))

  const submit = (event: SyntheticEvent) =>
  {
    event.preventDefault()

    const input: ApplicationTrackingInput = {
      applicationDate: nullableText(form.applicationDate),
      responseStatus: form.responseStatus,
      notes: nullableText(form.notes),
    }

    updateApplication.mutate({ id: application.id, input }, { onSuccess: onClose })
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack>
        {updateApplication.error !== null && (
          <Alert color="red" title="Could not save" variant="light">{updateApplication.error.message}</Alert>
        )}

        <Stack gap={2}>
          <Text fw={600}>{application.offer.title}</Text>
          <CompanyLink company={application.offer.company} />
        </Stack>

        <TrackingFields value={form} onChange={(patch) =>
        {
          setForm((current) => ({ ...current, ...patch }))
        }}
        />

        <Group justify="flex-end">
          <Button variant="default" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={updateApplication.isPending}>Save</Button>
        </Group>
      </Stack>
    </Box>
  )
}
