import { useState } from 'react'

import { Alert, Anchor, Badge, Box, Button, Center, Group, Pagination, Skeleton, Stack, Table, Text } from '@mantine/core'

import { useOffers } from '../../api/offers'
import type { Offer } from '../../api/types'
import { ExternalLinkIcon, PlusIcon } from '../../components/icons'
import { CompanyLink } from '../companies/CompanyLink'
import { ApplyModal } from './ApplyModal'
import { OfferFormModal } from './OfferFormModal'

export function OffersPanel()
{
  const [page, setPage] = useState(0)
  const [formOpened, setFormOpened] = useState(false)
  const [applying, setApplying] = useState<Offer | null>(null)

  const offersQuery = useOffers(page)
  const offers = offersQuery.data?.items ?? []
  const totalPages = offersQuery.data?.totalPages ?? 0

  return (
    <Box>
      <Group justify="flex-end" mb="lg">
        <Button
          onClick={() =>
          {
            setFormOpened(true)
          }}
          leftSection={<PlusIcon />}
        >
          New offer
        </Button>
      </Group>

      {offersQuery.isPending
        ? (
          <Stack gap="xs">
            {[0, 1, 2, 3].map((row) => <Skeleton key={row} height={48} radius="sm" />)}
          </Stack>
        )
        : offersQuery.error !== null
          ? (
            <Alert color="red" variant="light">{offersQuery.error.message}</Alert>
          )
          : offers.length === 0
            ? (
              <Center py={64}>
                <Stack align="center" gap="xs">
                  <Text fw={600}>No offer yet</Text>
                  <Text c="dimmed" size="sm">Create an offer, then apply to it to start tracking.</Text>
                  <Button
                    mt="sm"
                    onClick={() =>
                    {
                      setFormOpened(true)
                    }}
                    leftSection={<PlusIcon />}
                  >
                    New offer
                  </Button>
                </Stack>
              </Center>
            )
            : (
              <Stack>
                <Table.ScrollContainer minWidth={720}>
                  <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Company</Table.Th>
                        <Table.Th>Location</Table.Th>
                        <Table.Th>Published</Table.Th>
                        <Table.Th>Visibility</Table.Th>
                        <Table.Th>Link</Table.Th>
                        <Table.Th w={96} />
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {offers.map((offer) => (
                        <Table.Tr key={offer.id}>
                          <Table.Td fw={500}>{offer.title}</Table.Td>
                          <Table.Td><CompanyLink company={offer.company} /></Table.Td>
                          <Table.Td>{offer.location ?? <Text c="dimmed">—</Text>}</Table.Td>
                          <Table.Td>{offer.publicationDate}</Table.Td>
                          <Table.Td>
                            <Badge variant="light" color={offer.visibility === 'PUBLIC' ? 'teal' : 'gray'}>
                              {offer.visibility === 'PUBLIC' ? 'Public' : 'Private'}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            {offer.link === null
                              ? <Text c="dimmed">—</Text>
                              : (
                                <Anchor href={offer.link} target="_blank" rel="noreferrer">
                                  <Group gap={4} wrap="nowrap" align="center">Open<ExternalLinkIcon /></Group>
                                </Anchor>
                              )}
                          </Table.Td>
                          <Table.Td>
                            <Group justify="flex-end" wrap="nowrap">
                              <Button
                                variant="light"
                                size="compact-sm"
                                onClick={() =>
                                {
                                  setApplying(offer)
                                }}
                              >
                                Apply
                              </Button>
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

      <OfferFormModal opened={formOpened} onClose={() =>
      {
        setFormOpened(false)
      }}
      />

      <ApplyModal opened={applying !== null} offer={applying} onClose={() =>
      {
        setApplying(null)
      }}
      />
    </Box>
  )
}
