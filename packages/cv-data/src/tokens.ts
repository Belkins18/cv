export type Tokens = Readonly<Record<string, string | number>>

const TOKEN = /\{\{(\w+)\}\}/g

/** A typo in a token is an error, not an empty string in a CV already sent out. */
export const applyTokens = (text: string, tokens: Tokens): string =>
  text.replace(TOKEN, (_match, name: string) => {
    const value = tokens[name]
    if (value === undefined) throw new Error(`unknown token {{${name}}}`)
    return String(value)
  })
