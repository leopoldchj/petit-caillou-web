import { useState, type SyntheticEvent } from 'react'

import { ActionIcon, Alert, Anchor, Box, Button, Center, Group, Modal, Paper, Skeleton, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'

import { useCompanies, useCreateCompany, useDeleteCompany, useUpdateCompany } from '../../api/companies'
import type { Company } from '../../api/types'
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/icons'

export function CompaniesPanel()
{
  const companiesQuery = useCompanies()
  const createCompany = useCreateCompany()
  const deleteCompany = useDeleteCompany()

  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [editing, setEditing] = useState<Company | null>(null)

  const submitCreate = (event: SyntheticEvent) =>
  {
    event.preventDefault()
    createCompany.mutate(
      { name, website: website.trim() === '' ? null : website },
      {
        onSuccess: () =>
        {
          setName('')
          setWebsite('')
        },
      },
    )
  }

  const companies = companiesQuery.data ?? []

  return (
    <Stack>
      <Paper withBorder p="md" radius="md">
        <Box component="form" onSubmit={submitCreate}>
          <Stack gap="sm">
            <Title order={5}>Add a company</Title>

            {createCompany.error !== null && (
              <Alert color="red" variant="light">{createCompany.error.message}</Alert>
            )}

            <Group align="flex-end" gap="sm">
              <TextInput
                label="Name"
                value={name}
                onChange={(event) =>
                {
                  setName(event.currentTarget.value)
                }}
                required
                w={220}
              />
              <TextInput
                label="Website"
                placeholder="https://…"
                value={website}
                onChange={(event) =>
                {
                  setWebsite(event.currentTarget.value)
                }}
                w={260}
              />
              <Button
                type="submit"
                leftSection={<PlusIcon />}
                loading={createCompany.isPending}
                disabled={name.trim() === ''}
              >
                Add
              </Button>
            </Group>
          </Stack>
        </Box>
      </Paper>

      {deleteCompany.error !== null && (
        <Alert color="red" variant="light">{deleteCompany.error.message}</Alert>
      )}

      {companiesQuery.isPending
        ? (
          <Stack gap="xs">
            {[0, 1, 2].map((row) => <Skeleton key={row} height={44} radius="sm" />)}
          </Stack>
        )
        : companiesQuery.error !== null
          ? (
            <Alert color="red" variant="light">{companiesQuery.error.message}</Alert>
          )
          : companies.length === 0
            ? (
              <Center py={48}><Text c="dimmed">No company yet.</Text></Center>
            )
            : (
              <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Website</Table.Th>
                    <Table.Th w={96} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {companies.map((company) => (
                    <Table.Tr key={company.id}>
                      <Table.Td fw={500}>{company.name}</Table.Td>
                      <Table.Td>
                        {company.website === null
                          ? <Text c="dimmed">—</Text>
                          : <Anchor href={company.website} target="_blank" rel="noreferrer">{company.website}</Anchor>}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={2} justify="flex-end" wrap="nowrap">
                          <Tooltip label="Edit" withArrow>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              aria-label="Edit company"
                              onClick={() =>
                              {
                                setEditing(company)
                              }}
                            >
                              <PencilIcon />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete" withArrow>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              aria-label="Delete company"
                              loading={deleteCompany.isPending && deleteCompany.variables === company.id}
                              onClick={() =>
                              {
                                deleteCompany.mutate(company.id)
                              }}
                            >
                              <TrashIcon />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}

      <Modal opened={editing !== null} onClose={() =>
      {
        setEditing(null)
      }} title="Edit company" centered
      >
        {editing !== null && <EditCompanyForm company={editing} onClose={() =>
        {
          setEditing(null)
        }}
        />}
      </Modal>
    </Stack>
  )
}

function EditCompanyForm({ company, onClose }: { company: Company, onClose: () => void })
{
  const updateCompany = useUpdateCompany()
  const [name, setName] = useState(company.name)
  const [website, setWebsite] = useState(company.website ?? '')

  const submit = (event: SyntheticEvent) =>
  {
    event.preventDefault()
    updateCompany.mutate(
      { id: company.id, input: { name, website: website.trim() === '' ? null : website } },
      { onSuccess: onClose },
    )
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack>
        {updateCompany.error !== null && (
          <Alert color="red" variant="light">{updateCompany.error.message}</Alert>
        )}

        <TextInput label="Name" value={name} onChange={(event) =>
        {
          setName(event.currentTarget.value)
        }} required
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

        <Group justify="flex-end">
          <Button variant="default" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={updateCompany.isPending} disabled={name.trim() === ''}>Save</Button>
        </Group>
      </Stack>
    </Box>
  )
}
