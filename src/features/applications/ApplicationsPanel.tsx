import { useState } from 'react'

import { Alert, Anchor, Box, Button, Center, Group, Loader, Select, Table, Text } from '@mantine/core'

import { useApplications, useDeleteApplication } from '../../api/applications'
import { useCompanies } from '../../api/companies'
import type { JobApplication } from '../../api/types'
import { ApplicationFormModal } from './ApplicationFormModal'
import { StatusBadge } from './StatusBadge'

export function ApplicationsPanel()
{
  const [companyFilter, setCompanyFilter] = useState<string | null>(null)
  const [opened, setOpened] = useState(false)
  const [editing, setEditing] = useState<JobApplication | null>(null)

  const companiesQuery = useCompanies()
  const applicationsQuery = useApplications(companyFilter)
  const deleteApplication = useDeleteApplication()

  const companyOptions = (companiesQuery.data ?? []).map((company) => ({ value: company.id, label: company.name }))

  const openNew = () =>
  {
    setEditing(null)
    setOpened(true)
  }

  const openEdit = (application: JobApplication) =>
  {
    setEditing(application)
    setOpened(true)
  }

  const applications = applicationsQuery.data ?? []

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Select
          placeholder="All companies"
          data={companyOptions}
          value={companyFilter}
          onChange={setCompanyFilter}
          searchable
          clearable
          w={260}
        />
        <Button onClick={openNew}>New application</Button>
      </Group>

      {deleteApplication.error !== null && (
        <Alert color="red" variant="light" mb="md">{deleteApplication.error.message}</Alert>
      )}

      {applicationsQuery.isPending
        ? (
          <Center py="xl"><Loader /></Center>
        )
        : applicationsQuery.error !== null
          ? (
            <Alert color="red" variant="light">{applicationsQuery.error.message}</Alert>
          )
          : applications.length === 0
            ? (
              <Center py="xl"><Text c="dimmed">No application yet. Add your first one.</Text></Center>
            )
            : (
              <Table.ScrollContainer minWidth={720}>
                <Table striped highlightOnHover verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Title</Table.Th>
                      <Table.Th>Company</Table.Th>
                      <Table.Th>Location</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Offer</Table.Th>
                      <Table.Th />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {applications.map((application) => (
                      <Table.Tr key={application.id}>
                        <Table.Td>{application.title}</Table.Td>
                        <Table.Td>
                          {application.company.website === null
                            ? <Text>{application.company.name}</Text>
                            : (
                              <Anchor href={application.company.website} target="_blank" rel="noreferrer">
                                {application.company.name}
                              </Anchor>
                            )}
                        </Table.Td>
                        <Table.Td>{application.location ?? '—'}</Table.Td>
                        <Table.Td><StatusBadge status={application.responseStatus} /></Table.Td>
                        <Table.Td>{application.applicationDate ?? '—'}</Table.Td>
                        <Table.Td>
                          {application.link === null
                            ? <Text c="dimmed">—</Text>
                            : <Anchor href={application.link} target="_blank" rel="noreferrer">Offer</Anchor>}
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs" justify="flex-end" wrap="nowrap">
                            <Button size="xs" variant="subtle" onClick={() =>
                            {
                              openEdit(application)
                            }}
                            >Edit</Button>
                            <Button
                              size="xs"
                              variant="subtle"
                              color="red"
                              onClick={() =>
                              {
                                deleteApplication.mutate(application.id)
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
              </Table.ScrollContainer>
            )}

      <ApplicationFormModal opened={opened} onClose={() =>
      {
        setOpened(false)
      }} application={editing}
      />
    </Box>
  )
}
