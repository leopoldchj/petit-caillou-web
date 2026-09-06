import { Component, type ReactNode } from 'react'

import { Alert, Code, Container, Stack, Title } from '@mantine/core'

interface ErrorBoundaryProps
{
  children: ReactNode
}

interface ErrorBoundaryState
{
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState>
{
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState
  {
    return { error }
  }

  render(): ReactNode
  {
    const { error } = this.state

    if (error !== null)
    {
      return (
        <Container size="sm" py="xl">
          <Stack>
            <Title order={3}>The interface crashed</Title>
            <Alert color="red" title={error.name}>{error.message}</Alert>
            <Code block>{error.stack}</Code>
          </Stack>
        </Container>
      )
    }

    return this.props.children
  }
}
