import { describe, expect, it } from 'vitest'
import { cv } from './data/index'
import { project } from './project'

describe('project', () => {
  it('replaces a Localized object with the string of the chosen locale', () => {
    expect(project(cv, 'en').profile.title).toBe('Frontend Engineer')
    expect(project(cv, 'uk').profile.title).toBe('Фронтенд-інженер')
  })

  it('descends into arrays and nested objects', () => {
    const uk = project(cv, 'uk')
    const wirex = uk.roles.find((r) => r.id === 'wirex')
    expect(typeof wirex?.bullets[0]).toBe('string')
    expect(wirex?.location).toContain('Ізраїль')
  })

  it('leaves values that are not Localized alone', () => {
    const en = project(cv, 'en')
    const wirex = en.roles.find((r) => r.id === 'wirex')
    expect(wirex?.company).toBe('WireX Systems')
    expect(wirex?.tech).toContain('react')
    expect(wirex?.period.end).toBeNull()
    expect(wirex?.printBulletLimit).toBe(5)
  })

  it('produces a result that passes the projected-document schema', () => {
    expect(() => project(cv, 'uk')).not.toThrow()
  })
})
