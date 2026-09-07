import { useState, type SyntheticEvent } from 'react'

import { Alert, Box, Button, Group, Modal, Stack, Textarea, TextInput } from '@mantine/core'

import { useCreateOffer } from '../../api/offers'
import type { OfferInput } from '../../api/types'
import { nullableText } from '../../lib/forms'
import { CompanyField } from '../companies/CompanyField'

interface OfferFormModalProps
{
  opened: boolean
  onClose: () => void
}

interface FormState
{
  companyId: string | null
  title: string
  location: string
  publicationDate: string
  link: string
  description: string
}

const EMPTY: FormState = {
  companyId: null,
  title: '',
  location: '',
  publicationDate: '',
  link: '',
  description: '',
}

export function OfferFormModal({ opened, onClose }: OfferFormModalProps)
{
  return (
    <Modal opened={opened} onClose={onClose} title="New offer" centered>
      {opened && <OfferForm onClose={onClose} />}
    </Modal>
  )
}

function OfferForm({ onClose }: { onClose: () => void })
{
  const createOffer = useCreateOffer()
  const [form, setForm] = useState<FormState>(() => ({ ...EMPTY }))
  const [companyError, setCompanyError] = useState<string | null>(null)

  const setField = (field: 'title' | 'location' | 'publicationDate' | 'link' | 'description') =>
    (event: { currentTarget: { value: string } }) =>
    {
      const value = event.currentTarget.value
      setForm((current) => ({ ...current, [field]: value }))
    }

  const submit = (event: SyntheticEvent) =>
  {
    event.preventDefault()

    if (form.companyId === null)
    {
      setCompanyError('Please choose a company')
      return
    }

    const input: OfferInput = {
      companyId: form.companyId,
      title: form.title,
      location: nullableText(form.location),
      publicationDate: form.publicationDate,
      link: nullableText(form.link),
      description: nullableText(form.description),
    }

    createOffer.mutate(input, { onSuccess: onClose })
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack>
        {createOffer.error !== null && (
          <Alert color="red" title="Could not save" variant="light">{createOffer.error.message}</Alert>
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

        <TextInput label="Title" required value={form.title} onChange={setField('title')} />

        <TextInput label="Publication date" type="date" required value={form.publicationDate} onChange={setField('publicationDate')} />

        <TextInput label="Location" placeholder="City, remote, …" value={form.location} onChange={setField('location')} />

        <TextInput label="Offer link" placeholder="https://…" value={form.link} onChange={setField('link')} />

        <Textarea label="Description" autosize minRows={2} value={form.description} onChange={setField('description')} />

        <Group justify="flex-end">
          <Button variant="default" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={createOffer.isPending}>Create</Button>
        </Group>
      </Stack>
    </Box>
  )
}
