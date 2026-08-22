import { useState } from 'react'

import { ActionIcon, Alert, Anchor, Box, Button, Center, Group, Select, Skeleton, Stack, Table, Text, Tooltip } from '@mantine/core'

import { useApplications, useDeleteApplication } from '../../api/applications'
import { useCompanies } from '../../api/companies'
import type { JobApplication } from '../../api/types'
import { ExternalLinkIcon, PencilIcon, PlusIcon, TrashIcon } from '../../components/icons'
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
      <Group justify="space-between" mb="lg">
        <Select
          placeholder="All companies"
          data={companyOptions}
          value={companyFilter}
          onChange={setCompanyFilter}
          searchable
          clearable
          w={260}
        />
        <Button onClick={openNew} leftSection={<PlusIcon />}>New application</Button>
      </Group>

      {deleteApplication.error !== null && (
        <Alert color="red" variant="light" mb="md">{deleteApplication.error.message}</Alert>
      )}

      {applicationsQuery.isPending
        ? (
          <Stack gap="xs">
            {[0, 1, 2, 3].map((row) => <Skeleton key={row} height={48} radius="sm" />)}
          </Stack>
        )
        : applicationsQuery.error !== null
          ? (
            <Alert color="red" variant="light">{applicationsQuery.error.message}</Alert>
          )
          : applications.length === 0
            ? (
              <Center py={64}>
                <Stack align="center" gap="xs">
                  <Text fw={600}>No application yet</Text>
                  <Text c="dimmed" size="sm">Track your first job application to get started.</Text>
                  <Button mt="sm" onClick={openNew} leftSection={<PlusIcon />}>New application</Button>
                </Stack>
              </Center>
            )
            : (
              <Table.ScrollContainer minWidth={720}>
                <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Title</Table.Th>
                      <Table.Th>Company</Table.Th>
                      <Table.Th>Location</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Offer</Table.Th>
                      <Table.Th w={96} />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {applications.map((application) => (
                      <Table.Tr key={application.id}>
                        <Table.Td fw={500}>{application.title}</Table.Td>
                        <Table.Td>
                          {application.company.website === null
                            ? <Text>{application.company.name}</Text>
                            : (
                              <Anchor href={application.company.website} target="_blank" rel="noreferrer">
                                {application.company.name}
                              </Anchor>
                            )}
                        </Table.Td>
                        <Table.Td>{application.location ?? <Text c="dimmed">—</Text>}</Table.Td>
                        <Table.Td><StatusBadge status={application.responseStatus} /></Table.Td>
                        <Table.Td>{application.applicationDate ?? <Text c="dimmed">—</Text>}</Table.Td>
                        <Table.Td>
                          {application.link === null
                            ? <Text c="dimmed">—</Text>
                            : (
                              <Anchor href={application.link} target="_blank" rel="noreferrer">
                                <Group gap={4} wrap="nowrap" align="center">Open<ExternalLinkIcon /></Group>
                              </Anchor>
                            )}
                        </Table.Td>
                        <Table.Td>
                          <Group gap={2} justify="flex-end" wrap="nowrap">
                            <Tooltip label="Edit" withArrow>
                              <ActionIcon
                                variant="subtle"
                                color="gray"
                                aria-label="Edit application"
                                onClick={() =>
                                {
                                  openEdit(application)
                                }}
                              >
                                <PencilIcon />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Delete" withArrow>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                aria-label="Delete application"
                                loading={deleteApplication.isPending && deleteApplication.variables === application.id}
                                onClick={() =>
                                {
                                  deleteApplication.mutate(application.id)
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
