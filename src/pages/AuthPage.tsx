import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Tabs,
  TextInput,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useState, type SyntheticEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { login as loginRequest, register as registerRequest, type LoginInput, type RegisterInput } from '../auth/api'
import { useAuth } from '../auth/authContext'
import { Brand } from '../components/Brand'

interface RedirectState
{
  from?: string
}

export function AuthPage()
{
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState<string | null>('login')
  const [loginForm, setLoginForm] = useState<LoginInput>({ alias: '', password: '' })
  const [registerForm, setRegisterForm] = useState<RegisterInput>({ alias: '', email: '', password: '' })

  const from = (location.state as RedirectState | null)?.from ?? '/'

  const onAuthenticated = (token: string) =>
  {
    login(token)
    void navigate(from, { replace: true })
  }

  const loginMutation = useMutation({ mutationFn: loginRequest, onSuccess: onAuthenticated })
  const registerMutation = useMutation({ mutationFn: registerRequest, onSuccess: onAuthenticated })

  if (isAuthenticated)
  {
    return <Navigate to={from} replace />
  }

  const submitLogin = (event: SyntheticEvent) =>
  {
    event.preventDefault()
    loginMutation.mutate(loginForm)
  }

  const submitRegister = (event: SyntheticEvent) =>
  {
    event.preventDefault()
    registerMutation.mutate(registerForm)
  }

  return (
    <Center mih="100dvh" p="md">
      <Container size={420} w="100%">
        <Group justify="center" mb="lg">
          <Brand />
        </Group>

        <Paper withBorder shadow="sm" radius="md" p="xl">
          <Tabs value={tab} onChange={setTab}>
            <Tabs.List grow mb="md">
              <Tabs.Tab value="login">Log in</Tabs.Tab>
              <Tabs.Tab value="register">Sign up</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="login">
              <Box component="form" onSubmit={submitLogin}>
                <Stack>
                  {loginMutation.error && (
                    <Alert color="red" title="Login failed">
                      {loginMutation.error.message}
                    </Alert>
                  )}

                  <TextInput
                    label="Alias"
                    autoComplete="username"
                    value={loginForm.alias}
                    onChange={(event) =>
                    {
                      setLoginForm({ ...loginForm, alias: event.currentTarget.value })
                    }}
                    required
                  />

                  <PasswordInput
                    label="Password"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(event) =>
                    {
                      setLoginForm({ ...loginForm, password: event.currentTarget.value })
                    }}
                    required
                  />

                  <Button type="submit" fullWidth loading={loginMutation.isPending}>
                    Log in
                  </Button>
                </Stack>
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="register">
              <Box component="form" onSubmit={submitRegister}>
                <Stack>
                  {registerMutation.error && (
                    <Alert color="red" title="Sign-up failed">
                      {registerMutation.error.message}
                    </Alert>
                  )}

                  <TextInput
                    label="Alias"
                    autoComplete="username"
                    value={registerForm.alias}
                    onChange={(event) =>
                    {
                      setRegisterForm({ ...registerForm, alias: event.currentTarget.value })
                    }}
                    required
                  />

                  <TextInput
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={registerForm.email}
                    onChange={(event) =>
                    {
                      setRegisterForm({ ...registerForm, email: event.currentTarget.value })
                    }}
                    required
                  />

                  <PasswordInput
                    label="Password"
                    description="At least 6 characters, including a digit and an uppercase letter."
                    autoComplete="new-password"
                    value={registerForm.password}
                    onChange={(event) =>
                    {
                      setRegisterForm({ ...registerForm, password: event.currentTarget.value })
                    }}
                    required
                  />

                  <Button type="submit" fullWidth loading={registerMutation.isPending}>
                    Create account
                  </Button>
                </Stack>
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Container>
    </Center>
  )
}
