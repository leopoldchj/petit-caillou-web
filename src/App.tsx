import { Anchor, Box, Text, Title } from '@mantine/core'

const ArrowIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const PebbleMark = () => (
  <svg aria-hidden="true" className="brand__mark" viewBox="0 0 40 40">
    <path d="M31.8 6.9c5 5.2 4 16.2-1.7 23.1-5 6-13.5 7.3-19.1 2.7C5.4 28 4 18.6 8 11.6 12.7 3.4 26.4 1.4 31.8 6.9Z" />
    <path d="M14.2 15.4c2.4-3.8 8.7-5.7 12.4-2.8" />
  </svg>
)

export function App()
{
  return (
    <Box component="main" className="page-shell">
      <Box component="nav" className="navigation" aria-label="Navigation principale">
        <Anchor className="brand" href="/" aria-label="Petit Caillou, accueil">
          <PebbleMark />
          <Text component="span">Petit Caillou</Text>
        </Anchor>

        <Text component="span" className="navigation__status">
          <Box component="span" className="navigation__dot" aria-hidden="true" />
          Projet en construction
        </Text>
      </Box>

      <Box component="section" className="hero" aria-labelledby="hero-title">
        <Box className="hero__content">
          <Text className="eyebrow">Première pierre</Text>
          <Title id="hero-title" order={1}>
            Une base simple,
            <Box component="br" />
            prête à grandir.
          </Title>
          <Text className="hero__description">
            Le projet web est en place. Nous pouvons maintenant construire les
            premières fonctionnalités sur des fondations claires et solides.
          </Text>
          <Anchor className="hero__action" href="#fondations">
            Voir les fondations
            <ArrowIcon />
          </Anchor>
        </Box>

        <Box className="hero__visual" aria-hidden="true">
          <Box className="orbit orbit--outer" />
          <Box className="orbit orbit--inner" />
          <Box className="pebble">
            <Box component="span" className="pebble__shine" />
          </Box>
          <Text component="span" className="coordinate coordinate--top">
            49.6116° N
          </Text>
          <Text component="span" className="coordinate coordinate--bottom">
            06.1319° E
          </Text>
        </Box>
      </Box>

      <Box
        component="section"
        className="foundations"
        id="fondations"
        aria-labelledby="foundations-title"
      >
        <Text className="foundations__index">01 / Base</Text>
        <Box>
          <Title id="foundations-title" order={2}>Prêt pour la suite</Title>
          <Text>
            React, TypeScript et Vite sont configurés avec une structure minimale,
            un contrôle de qualité et des commandes identiques depuis les deux repos.
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
