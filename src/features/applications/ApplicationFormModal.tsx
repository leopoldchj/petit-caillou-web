import { useState, type SyntheticEvent } from 'react'

import { Alert, Box, Button, Group, Modal, Select, Stack, Textarea, TextInput } from '@mantine/core'

import { useCreateApplication, useUpdateApplication } from '../../api/applications'
import type { JobApplication, JobApplicationInput, ResponseStatus } from '../../api/types'
import { CompanyField } from '../companies/CompanyField'
import { STATUS_OPTIONS } from './status'

interface ApplicationFormModalProps
{
  opened: boolean
  onClose: () => void
  application: JobApplication | null
}

interface FormState
{
  companyId: string | null
  title: string
  link: string
  location: string
  applicationDate: string
  description: string
  responseStatus: ResponseStatus
}

function initialForm(application: JobApplication | null): FormState
{
  if (application === null)
  {
    return {
      companyId: null,
      title: '',
      link: '',
      location: '',
      applicationDate: '',
      description: '',
      responseStatus: 'NO_RESPONSE',
    }
  }

  return {
    companyId: application.company.id,
    title: application.title,
    link: application.link ?? '',
    location: application.location ?? '',
    applicationDate: application.applicationDate ?? '',
    description: application.description ?? '',
    responseStatus: application.responseStatus,
  }
}

function nullableText(value: string): string | null
{
  return value.trim() === '' ? null : value
}

export function ApplicationFormModal({ opened, onClose, application }: ApplicationFormModalProps)
{
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={application === null ? 'New application' : 'Edit application'}
      centered
    >
      {opened && <ApplicationForm application={application} onClose={onClose} />}
    </Modal>
  )
}

function ApplicationForm({ application, onClose }: { application: JobApplication | null, onClose: () => void })
{
  const createApplication = useCreateApplication()
  const updateApplication = useUpdateApplication()
  const [form, setForm] = useState<FormState>(() => initialForm(application))
  const [companyError, setCompanyError] = useState<string | null>(null)

  const pending = createApplication.isPending || updateApplication.isPending
  const error = createApplication.error ?? updateApplication.error

  const submit = (event: SyntheticEvent) =>
  {
    event.preventDefault()

    if (form.companyId === null)
    {
      setCompanyError('Please choose a company')
      return
    }

    const input: JobApplicationInput = {
      companyId: form.companyId,
      title: form.title,
      link: nullableText(form.link),
      description: nullableText(form.description),
      location: nullableText(form.location),
      applicationDate: form.applicationDate === '' ? null : form.applicationDate,
      responseStatus: form.responseStatus,
    }

    if (application === null)
    {
      createApplication.mutate(input, { onSuccess: onClose })
    }
    else
    {
      updateApplication.mutate({ id: application.id, input }, { onSuccess: onClose })
    }
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack>
        {error !== null && (
          <Alert color="red" title="Could not save" variant="light">{error.message}</Alert>
        )}

        <CompanyField
          value={form.companyId}
          onChange={(companyId) =>
          {
            setForm((current) => ({ ...current, companyId }))
            setCompanyError(null)
          }}
          error={companyError ?? undefined}
        />

        <TextInput
          label="Title"
          required
          value={form.title}
          onChange={(event) =>
          {
            setForm((current) => ({ ...current, title: event.currentTarget.value }))
          }}
        />

        <TextInput
          label="Offer link"
          placeholder="https://…"
          value={form.link}
          onChange={(event) =>
          {
            setForm((current) => ({ ...current, link: event.currentTarget.value }))
          }}
        />

        <TextInput
          label="Location"
          placeholder="City, remote, …"
          value={form.location}
          onChange={(event) =>
          {
            setForm((current) => ({ ...current, location: event.currentTarget.value }))
          }}
        />

        <TextInput
          label="Application date"
          type="date"
          value={form.applicationDate}
          onChange={(event) =>
          {
            setForm((current) => ({ ...current, applicationDate: event.currentTarget.value }))
          }}
        />

        <Select
          label="Status"
          data={STATUS_OPTIONS}
          value={form.responseStatus}
          allowDeselect={false}
          onChange={(status) =>
          {
            if (status !== null)
            {
              setForm((current) => ({ ...current, responseStatus: status }))
            }
          }}
        />

        <Textarea
          label="Notes"
          autosize
          minRows={2}
          value={form.description}
          onChange={(event) =>
          {
            setForm((current) => ({ ...current, description: event.currentTarget.value }))
          }}
        />

        <Group justify="flex-end">
          <Button variant="default" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={pending}>{application === null ? 'Create' : 'Save'}</Button>
        </Group>
      </Stack>
    </Box>
  )
}
