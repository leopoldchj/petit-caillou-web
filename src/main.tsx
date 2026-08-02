import '@mantine/core/styles/baseline.css'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/global.css'
import '@mantine/core/styles/Anchor.css'
import '@mantine/core/styles/Text.css'
import '@mantine/core/styles/Title.css'

import { MantineProvider } from '@mantine/core'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import './styles.css'
import { theme } from './theme'

const rootElement = document.getElementById('root')

if (!rootElement)
{
  throw new Error("L'élément racine de l'application est introuvable.")
}

createRoot(rootElement).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)
