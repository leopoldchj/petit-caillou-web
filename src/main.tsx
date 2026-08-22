import '@mantine/core/styles/baseline.css'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/global.css'
import '@mantine/core/styles/UnstyledButton.css'
import '@mantine/core/styles/Anchor.css'
import '@mantine/core/styles/Text.css'
import '@mantine/core/styles/Title.css'
import '@mantine/core/styles/Paper.css'
import '@mantine/core/styles/Card.css'
import '@mantine/core/styles/Button.css'
import '@mantine/core/styles/Input.css'
import '@mantine/core/styles/PasswordInput.css'
import '@mantine/core/styles/ActionIcon.css'
import '@mantine/core/styles/Tabs.css'
import '@mantine/core/styles/Alert.css'
import '@mantine/core/styles/Loader.css'
import '@mantine/core/styles/Container.css'
import '@mantine/core/styles/Center.css'
import '@mantine/core/styles/Stack.css'
import '@mantine/core/styles/Group.css'
import '@mantine/core/styles/Table.css'
import '@mantine/core/styles/Badge.css'
import '@mantine/core/styles/Combobox.css'
import '@mantine/core/styles/Popover.css'
import '@mantine/core/styles/ScrollArea.css'
import '@mantine/core/styles/Overlay.css'
import '@mantine/core/styles/ModalBase.css'
import '@mantine/core/styles/Modal.css'
import '@mantine/core/styles/CloseButton.css'
import '@mantine/core/styles/Tooltip.css'
import '@mantine/core/styles/Skeleton.css'
import '@mantine/core/styles/Divider.css'
import '@mantine/core/styles/Code.css'

import { MantineProvider } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import { AuthProvider } from './auth/AuthProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { queryClient } from './lib/queryClient'
import './styles.css'
import { theme } from './theme'

const rootElement = document.getElementById('root')

if (!rootElement)
{
  throw new Error("L'élément racine de l'application est introuvable.")
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="light" theme={theme}>
        <ErrorBoundary>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
