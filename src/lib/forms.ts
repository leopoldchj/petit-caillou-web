export function nullableText(value: string): string | null
{
  return value.trim() === '' ? null : value
}
