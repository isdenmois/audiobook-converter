const REG_EX = /{{\s?(.*?)\s?}}/g

export const interpolate = (text: string, context: Record<string, string>): string => {
  return text.replace(REG_EX, (_, key) => context[key]) ?? ''
}
