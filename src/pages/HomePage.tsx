import { Button, Card, Center, Container, Group, Stack, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/authContext'
import { Brand } from '../components/Brand'

export function HomePage()
{
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () =>
  {
    logout()
    void navigate('/login', { replace: true })
  }

  return (
    <Center mih="100dvh" p="md">
      <Container size={480} w="100%">
        <Stack>
          <Brand />
          <Title order={1}>Welcome{user ? `, ${user.alias}` : ''}</Title>
          <Text c="dimmed">You are signed in. Here is the information read from your token.</Text>

          <Card withBorder radius="md" p="lg">
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={500}>Alias</Text>
                <Text>{user?.alias}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Email</Text>
                <Text>{user?.email}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Role</Text>
                <Text>{user?.role}</Text>
              </Group>
            </Stack>
          </Card>

          <Button variant="light" color="red" onClick={onLogout}>
            Log out
          </Button>
        </Stack>
      </Container>
    </Center>
  )
}
