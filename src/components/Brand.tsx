import { Box, Text } from '@mantine/core'

import { PebbleMark } from './PebbleMark'

export function Brand()
{
  return (
    <Box className="brand">
      <PebbleMark />
      <Text component="span">Petit Caillou</Text>
    </Box>
  )
}
