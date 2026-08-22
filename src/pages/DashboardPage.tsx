import { Box, Button, Container, Divider, Group, Tabs, Text } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/authContext'
import { Brand } from '../components/Brand'
import { ApplicationsPanel } from '../features/applications/ApplicationsPanel'
import { CompaniesPanel } from '../features/companies/CompaniesPanel'

export function DashboardPage()
{
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () =>
  {
    logout()
    void navigate('/login', { replace: true })
  }

  return (
    <Box>
      <Box component="header">
        <Container size="lg">
          <Group justify="space-between" h={64}>
            <Brand />
            <Group gap="md">
              {user !== null && <Text size="sm" c="dimmed">{user.username}</Text>}
              <Button variant="subtle" color="red" size="sm" onClick={onLogout}>Log out</Button>
            </Group>
          </Group>
        </Container>
        <Divider />
      </Box>

      <Container size="lg" pt="lg" pb="xl">
        <Tabs defaultValue="applications" keepMounted={false}>
          <Tabs.List mb="lg">
            <Tabs.Tab value="applications">Applications</Tabs.Tab>
            <Tabs.Tab value="companies">Companies</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="applications">
            <ApplicationsPanel />
          </Tabs.Panel>

          <Tabs.Panel value="companies">
            <CompaniesPanel />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  )
}
