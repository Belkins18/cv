import { describe, expect, it } from 'vitest'
import { CvDataError, loadCv, loadCvFrom } from './load'

describe('loadCv', () => {
  it('loads the English chunk and validates it', async () => {
    const data = await loadCv('en')
    expect(data.profile.title).toBe('Frontend Engineer')
    expect(data.roles.length).toBeGreaterThan(0)
  })

  it('loads the Ukrainian chunk', async () => {
    expect((await loadCv('uk')).profile.title).toBe('Фронтенд-інженер')
  })

  it('throws CvDataError on broken data instead of blowing up mid-render', async () => {
    const broken = () => Promise.resolve({ default: { profile: { name: 42 } } })
    await expect(loadCvFrom('en', broken)).rejects.toBeInstanceOf(CvDataError)
  })

  it('throws CvDataError on a network failure and keeps the cause', async () => {
    const offline = () =>
      Promise.reject(new Error('Failed to fetch dynamically imported module'))
    const error = await loadCvFrom('uk', offline).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(CvDataError)
    expect((error as CvDataError).locale).toBe('uk')
    expect((error as CvDataError).cause).toBeInstanceOf(Error)
  })
})
