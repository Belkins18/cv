import { describe, expect, it } from 'vitest'
import { cv } from './data/index'
import { project } from './project'

describe('project', () => {
  it('заменяет Localized на строку выбранной локали', () => {
    expect(project(cv, 'en').profile.title).toBe('Frontend Engineer')
    expect(project(cv, 'uk').profile.title).toBe('Фронтенд-інженер')
  })

  it('спускается в массивы и вложенные объекты', () => {
    const uk = project(cv, 'uk')
    const wirex = uk.roles.find((r) => r.id === 'wirex')
    expect(typeof wirex?.bullets[0]).toBe('string')
    expect(wirex?.location).toContain('Ізраїль')
  })

  it('не трогает значения, которые не Localized', () => {
    const en = project(cv, 'en')
    const wirex = en.roles.find((r) => r.id === 'wirex')
    expect(wirex?.company).toBe('WireX Systems')
    expect(wirex?.tech).toContain('react')
    expect(wirex?.period.end).toBeNull()
    expect(wirex?.printBulletLimit).toBe(5)
  })

  it('результат проходит схему спроецированного документа', () => {
    expect(() => project(cv, 'uk')).not.toThrow()
  })
})
