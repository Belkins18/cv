import { describe, expect, it } from 'vitest'
import {
  cvSchema,
  isoMonthSchema,
  localizedSchema,
  periodSchema,
  resolvedCvSchema,
  techIdSchema
} from './schema'

describe('localizedSchema', () => {
  it('принимает обе локали', () => {
    expect(
      localizedSchema.parse({ en: 'Frontend Engineer', uk: 'Фронтенд-інженер' })
    ).toBeTruthy()
  })

  it('отвергает пустой украинский перевод — забыть перевод нельзя', () => {
    expect(() =>
      localizedSchema.parse({ en: 'Frontend Engineer', uk: '' })
    ).toThrow()
  })

  it('отвергает отсутствующую локаль', () => {
    expect(() => localizedSchema.parse({ en: 'Frontend Engineer' })).toThrow()
  })
})

describe('isoMonthSchema', () => {
  it.each(['2024-06', '2015-01', '2026-12'])('принимает %s', (value) => {
    expect(isoMonthSchema.parse(value)).toBe(value)
  })

  it.each([
    '2024-13',
    '2024-00',
    '24-06',
    '2024-6',
    '2024/06',
    'настоящее время'
  ])('отвергает %s', (value) => {
    expect(() => isoMonthSchema.parse(value)).toThrow()
  })
})

describe('periodSchema', () => {
  it('принимает открытый период', () => {
    expect(periodSchema.parse({ start: '2024-06', end: null })).toEqual({
      start: '2024-06',
      end: null
    })
  })

  it('отвергает период, который кончается раньше, чем начался', () => {
    expect(() =>
      periodSchema.parse({ start: '2024-06', end: '2023-01' })
    ).toThrow()
  })
})

describe('techIdSchema', () => {
  it('принимает id из реестра', () => {
    expect(techIdSchema.parse('tanstack-query')).toBe('tanstack-query')
  })

  it('отвергает технологию, которой нет в реестре', () => {
    expect(() => techIdSchema.parse('drogon')).toThrow()
  })
})

const minimalCv = {
  profile: {
    name: 'Nikolay Belibov',
    title: { en: 'Frontend Engineer', uk: 'Фронтенд-інженер' },
    summary: { en: 'Summary.', uk: 'Підсумок.' }
  },
  contacts: {
    email: 'belibov.nikolay@gmail.com',
    telegram: '@Belkins18',
    linkedin: 'https://www.linkedin.com/in/nikolay-belibov-781507b3/',
    github: 'https://github.com/Belkins18',
    location: { en: 'Mykolaiv, Ukraine', uk: 'Миколаїв, Україна' }
  },
  roles: [
    {
      id: 'wirex',
      company: 'WireX Systems',
      location: { en: 'Israel / USA, remote', uk: 'Ізраїль / США, віддалено' },
      title: { en: 'Frontend Developer', uk: 'Frontend Developer' },
      period: { start: '2024-06', end: null },
      detail: 'full',
      tech: ['react', 'typescript'],
      bullets: [{ en: 'Did a thing.', uk: 'Зробив щось.' }]
    }
  ],
  projects: [],
  certificates: [],
  education: [],
  languages: []
}

describe('cvSchema', () => {
  it('принимает минимальный валидный документ', () => {
    expect(cvSchema.parse(minimalCv).roles).toHaveLength(1)
  })

  it('отвергает роль с технологией вне реестра', () => {
    const broken = {
      ...minimalCv,
      roles: [{ ...minimalCv.roles[0], tech: ['react', 'drogon'] }]
    }
    expect(() => cvSchema.parse(broken)).toThrow()
  })

  it('resolvedCvSchema принимает тот же документ после подстановки локали', () => {
    const resolved = {
      ...minimalCv,
      profile: {
        name: 'Nikolay Belibov',
        title: 'Frontend Engineer',
        summary: 'Summary.'
      },
      contacts: { ...minimalCv.contacts, location: 'Mykolaiv, Ukraine' },
      roles: [
        {
          ...minimalCv.roles[0],
          location: 'Israel / USA, remote',
          title: 'Frontend Developer',
          bullets: ['Did a thing.']
        }
      ]
    }
    expect(resolvedCvSchema.parse(resolved).roles[0]?.title).toBe(
      'Frontend Developer'
    )
  })
})
