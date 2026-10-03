import { describe, expect, it } from 'vitest'
import { CvDataError, loadCv, loadCvFrom } from './load'

describe('loadCv', () => {
  it('грузит английский чанк и валидирует его', async () => {
    const data = await loadCv('en')
    expect(data.profile.title).toBe('Frontend Engineer')
    expect(data.roles.length).toBeGreaterThan(0)
  })

  it('грузит украинский чанк', async () => {
    expect((await loadCv('uk')).profile.title).toBe('Фронтенд-інженер')
  })

  it('на битых данных бросает CvDataError, а не падает в рендере', async () => {
    const broken = () => Promise.resolve({ default: { profile: { name: 42 } } })
    await expect(loadCvFrom('en', broken)).rejects.toBeInstanceOf(CvDataError)
  })

  it('на сетевой ошибке бросает CvDataError и сохраняет причину', async () => {
    const offline = () =>
      Promise.reject(new Error('Failed to fetch dynamically imported module'))
    const error = await loadCvFrom('uk', offline).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(CvDataError)
    expect((error as CvDataError).locale).toBe('uk')
    expect((error as CvDataError).cause).toBeInstanceOf(Error)
  })
})
