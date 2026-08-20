import { useState } from 'react'

import { Alert, Anchor, Button, Group, Paper, Select, Stack, TextInput } from '@mantine/core'

import { useCompanies, useCreateCompany } from '../../api/companies'
import { existingCompanyId } from '../../api/http'

interface CompanyFieldProps
{
  value: string | null
  onChange: (companyId: string | null) => void
  error?: string
}

export function CompanyField({ value, onChange, error }: CompanyFieldProps)
{
  const companiesQuery = useCompanies()
  const createCompany = useCreateCompany()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')

  const options = (companiesQuery.data ?? []).map((company) => ({ value: company.id, label: company.name }))

  const reset = () =>
  {
    setCreating(false)
    setName('')
    setWebsite('')
  }

  const submitNewCompany = () =>
  {
    createCompany.mutate(
      { name, website: website.trim() === '' ? null : website },
      {
        onSuccess: (company) =>
        {
          onChange(company.id)
          reset()
        },
        onError: (mutationError) =>
        {
          const existing = existingCompanyId(mutationError)
          if (existing !== null)
          {
            onChange(existing)
            reset()
          }
        },
      },
    )
  }

  return (
    <Stack gap="xs">
      <Select
        label="Company"
        placeholder="Select a company"
        data={options}
        value={value}
        onChange={onChange}
        searchable
        nothingFoundMessage="No company found"
        error={error}
        disabled={creating}
      />

      {creating
        ? (
          <Paper withBorder p="sm" radius="sm">
            <Stack gap="xs">
              {createCompany.error !== null && existingCompanyId(createCompany.error) === null && (
                <Alert color="red" variant="light">{createCompany.error.message}</Alert>
              )}

              <TextInput
                label="New company name"
                value={name}
                onChange={(event) =>
                {
                  setName(event.currentTarget.value)
                }}
                required
              />

              <TextInput
                label="Website"
                placeholder="https://…"
                value={website}
                onChange={(event) =>
                {
                  setWebsite(event.currentTarget.value)
                }}
              />

              <Group justify="flex-end" gap="xs">
                <Button variant="default" size="xs" type="button" onClick={reset}>Cancel</Button>
                <Button
                  size="xs"
                  type="button"
                  onClick={submitNewCompany}
                  loading={createCompany.isPending}
                  disabled={name.trim() === ''}
                >
                  Add company
                </Button>
              </Group>
            </Stack>
          </Paper>
        )
        : (
          <Anchor component="button" type="button" size="sm" onClick={() =>
          {
            setCreating(true)
          }}
          >
            + Create a new company
          </Anchor>
        )}
    </Stack>
  )
}
