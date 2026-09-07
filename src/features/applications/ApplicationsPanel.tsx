import { useState } from 'react'

import { ActionIcon, Alert, Anchor, Box, Center, Group, Pagination, Skeleton, Stack, Table, Text, Tooltip } from '@mantine/core'

import { useApplications, useDeleteApplication } from '../../api/applications'
import type { JobApplication } from '../../api/types'
import { ExternalLinkIcon, PencilIcon, TrashIcon } from '../../components/icons'
import { CompanyLink } from '../companies/CompanyLink'
import { EditApplicationModal } from './EditApplicationModal'
import { StatusBadge } from './StatusBadge'

export function ApplicationsPanel()
{
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<JobApplication | null>(null)

  const applicationsQuery = useApplications(page)
  const deleteApplication = useDeleteApplication()

  const applications = applicationsQuery.data?.items ?? []
  const totalPages = applicationsQuery.data?.totalPages ?? 0

  return (
    <Box>
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
                  <Text c="dimmed" size="sm">Browse the Offers tab and apply to start tracking.</Text>
                </Stack>
              </Center>
            )
            : (
              <Stack>
                <Table.ScrollContainer minWidth={720}>
                  <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Offer</Table.Th>
                        <Table.Th>Company</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Applied</Table.Th>
                        <Table.Th>Notes</Table.Th>
                        <Table.Th>Link</Table.Th>
                        <Table.Th w={96} />
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {applications.map((application) => (
                        <Table.Tr key={application.id}>
                          <Table.Td fw={500}>{application.offer.title}</Table.Td>
                          <Table.Td><CompanyLink company={application.offer.company} /></Table.Td>
                          <Table.Td><StatusBadge status={application.responseStatus} /></Table.Td>
                          <Table.Td>{application.applicationDate ?? <Text c="dimmed">—</Text>}</Table.Td>
                          <Table.Td>{application.notes ?? <Text c="dimmed">—</Text>}</Table.Td>
                          <Table.Td>
                            {application.offer.link === null
                              ? <Text c="dimmed">—</Text>
                              : (
                                <Anchor href={application.offer.link} target="_blank" rel="noreferrer">
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
                                    setEditing(application)
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

                {totalPages > 1 && (
                  <Group justify="center">
                    <Pagination total={totalPages} value={page + 1} onChange={(value) =>
                    {
                      setPage(value - 1)
                    }}
                    />
                  </Group>
                )}
              </Stack>
            )}

      <EditApplicationModal opened={editing !== null} application={editing} onClose={() =>
      {
        setEditing(null)
      }}
      />
    </Box>
  )
}
