export type Tokens = Readonly<Record<string, string | number>>

const TOKEN = /\{\{(\w+)\}\}/g

/** Опечатка в токене — ошибка, а не пустая строка в отправленном резюме. */
export const applyTokens = (text: string, tokens: Tokens): string =>
  text.replace(TOKEN, (_match, name: string) => {
    const value = tokens[name]
    if (value === undefined) throw new Error(`неизвестный токен {{${name}}}`)
    return String(value)
  })
