import { useState, type SyntheticEvent } from 'react'

import { Alert, Anchor, Box, Button, Center, Group, Loader, Modal, Paper, Stack, Table, Text, TextInput, Title } from '@mantine/core'

import { useCompanies, useCreateCompany, useDeleteCompany, useUpdateCompany } from '../../api/companies'
import type { Company } from '../../api/types'

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
      <Paper withBorder p="md" radius="sm">
        <Box component="form" onSubmit={submitCreate}>
          <Stack gap="sm">
            <Title order={4}>Add a company</Title>

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
              <Button type="submit" loading={createCompany.isPending} disabled={name.trim() === ''}>Add</Button>
            </Group>
          </Stack>
        </Box>
      </Paper>

      {deleteCompany.error !== null && (
        <Alert color="red" variant="light">{deleteCompany.error.message}</Alert>
      )}

      {companiesQuery.isPending
        ? (
          <Center py="xl"><Loader /></Center>
        )
        : companiesQuery.error !== null
          ? (
            <Alert color="red" variant="light">{companiesQuery.error.message}</Alert>
          )
          : companies.length === 0
            ? (
              <Center py="xl"><Text c="dimmed">No company yet.</Text></Center>
            )
            : (
              <Table striped highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Website</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {companies.map((company) => (
                    <Table.Tr key={company.id}>
                      <Table.Td>{company.name}</Table.Td>
                      <Table.Td>
                        {company.website === null
                          ? <Text c="dimmed">—</Text>
                          : <Anchor href={company.website} target="_blank" rel="noreferrer">{company.website}</Anchor>}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end" wrap="nowrap">
                          <Button size="xs" variant="subtle" onClick={() =>
                          {
                            setEditing(company)
                          }}
                          >Edit</Button>
                          <Button
                            size="xs"
                            variant="subtle"
                            color="red"
                            onClick={() =>
                            {
                              deleteCompany.mutate(company.id)
                            }}
                          >
                            Delete
                          </Button>
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
        {editing !== null && (
          <EditCompanyForm company={editing} onClose={() =>
          {
            setEditing(null)
          }}
          />
        )}
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
