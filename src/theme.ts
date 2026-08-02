import { createTheme, virtualColor } from '@mantine/core'

export const theme = createTheme({
  autoContrast: true,
  colors: {
    moss: [
      '#f3f5f0',
      '#e4e9df',
      '#c8d2bf',
      '#a9b99f',
      '#8da482',
      '#758f69',
      '#657e59',
      '#526748',
      '#45553d',
      '#394733',
    ],
    brand: virtualColor({
      name: 'brand',
      dark: 'moss',
      light: 'moss',
    }),
  },
  defaultRadius: 'md',
  fontFamily: "'Manrope', sans-serif",
  fontFamilyMonospace: "'DM Mono', monospace",
  headings: {
    fontFamily: "'Manrope', sans-serif",
    fontWeight: '500',
  },
  primaryColor: 'brand',
  primaryShade: 6,
})
