import { Anchor, Text } from '@mantine/core'

import type { Company } from '../../api/types'

export function CompanyLink({ company }: { company: Company })
{
  if (company.website === null)
  {
    return <Text>{company.name}</Text>
  }

  return (
    <Anchor href={company.website} target="_blank" rel="noreferrer">
      {company.name}
    </Anchor>
  )
}
