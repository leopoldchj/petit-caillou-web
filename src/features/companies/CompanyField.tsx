import { useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks'

import { Alert, Button, Group, Paper, Select, Stack, TextInput } from '@mantine/core'

import { useCompanies, useCompany, useCreateCompany } from '../../api/companies'
import { PlusIcon } from '../../components/icons'

interface CompanyFieldProps
{
  value: string | null
  onChange: (companyId: string | null) => void
  error?: string
}

export function CompanyField({ value, onChange, error }: CompanyFieldProps)
{
  const [search, setSearch] = useState('')
  const [query] = useDebouncedValue(search, 250)
  const companiesQuery = useCompanies(query)
  const selectedQuery = useCompany(value)
  const createCompany = useCreateCompany()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')

  const companies = companiesQuery.data?.items ?? []
  const selected = selectedQuery.data
  const choices = selected && !companies.some((company) => company.id === selected.id)
    ? [selected, ...companies]
    : companies
  const options = choices.map((company) => ({
    value: company.id,
    label: company.website ? `${company.name} · ${company.website}` : company.name,
  }))

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
        searchValue={search}
        onSearchChange={setSearch}
        filter={({ options: available }) => available}
        nothingFoundMessage={companiesQuery.isFetching ? 'Searching…' : 'No company found'}
        error={error ?? companiesQuery.error?.message ?? selectedQuery.error?.message}
        disabled={creating}
      />

      {creating
        ? (
          <Paper withBorder p="sm" radius="sm">
            <Stack gap="xs">
              {createCompany.error !== null && (
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
          <Group>
            <Button
              variant="subtle"
              size="compact-sm"
              leftSection={<PlusIcon size={14} />}
              onClick={() =>
              {
                setCreating(true)
              }}
            >
              Create a new company
            </Button>
          </Group>
        )}
    </Stack>
  )
}
