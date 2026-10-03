import { describe, expect, it } from 'vitest'
import { en } from './en'
import { uk } from './uk'

describe('словари интерфейса', () => {
  it('совпадают по набору ключей — перевод нельзя забыть', () => {
    expect(Object.keys(uk).sort()).toEqual(Object.keys(en).sort())
  })

  it('не содержат пустых строк', () => {
    for (const [key, value] of [...Object.entries(en), ...Object.entries(uk)]) {
      expect(value, key).not.toBe('')
    }
  })

  // Забытый перевод выглядит как обычная строка: словарь полон, а значение
  // скопировано из английского. Кириллица в каждом значении — дешёвая проверка,
  // которая эту копию ловит.
  it('украинские значения не остались английскими', () => {
    for (const [key, value] of Object.entries(uk)) {
      expect(value, key).not.toBe(en[key as keyof typeof en])
      expect(value, key).toMatch(/[Ѐ-ӿ]/)
    }
  })
})
