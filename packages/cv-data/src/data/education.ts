import type { Cv } from '../schema'

export const certificates: Cv['certificates'] = [
  {
    id: 'sulicom-harness',
    name: 'Workshop — Harness Engineering',
    issuer: 'SULICOM AI Academy',
    date: '2026-09',
    credentialId: 'WS-H8QWKJ6RY7',
    url: 'https://certificates.sulicom.tech/c/95703143b432942ae1c1f3c72df2cce4',
    summary: {
      en: '8h46m: an agent loop in TypeScript without frameworks, system prompts, hooks, progressive disclosure, prompt-injection defence, and a teardown of six harnesses.',
      uk: '8 год 46 хв: агентний цикл на TypeScript без фреймворків, системні промпти, hooks, progressive disclosure, захист від prompt injection і розбір шести харнесів.'
    }
  },
  {
    id: 'sulicom-workflows',
    name: 'Workshop — Agentic Engineering Workflows',
    issuer: 'SULICOM AI Academy',
    date: '2026-09',
    credentialId: 'WS-H9H3Q73NRE',
    url: 'https://certificates.sulicom.tech/c/560068a97a94d28e3681ba1c34a788e7',
    summary: {
      en: '8h54m: context management, the Ralph loop, the full cycle from specification to verification, TDD.',
      uk: '8 год 54 хв: контекст-менеджмент, Ralph loop, повний цикл від специфікації до верифікації, TDD.'
    }
  }
]

// The degrees are transcribed from LinkedIn, which the design doc (§2.1)
// declares the source of truth for them.
export const education: Cv['education'] = [
  {
    id: 'chnu',
    institution: {
      en: 'Petro Mohyla Black Sea National University',
      uk: 'Чорноморський національний університет імені Петра Могили'
    },
    degree: { en: "Bachelor's degree", uk: 'Бакалавр' },
    from: '2011',
    to: '2015'
  },
  {
    id: 'knuba',
    institution: {
      en: 'Kyiv National University of Construction and Architecture',
      uk: 'Київський національний університет будівництва і архітектури'
    },
    degree: {
      en: 'Specialist, engineering design',
      uk: 'Спеціаліст, технології інженерного проєктування'
    },
    from: '2010',
    to: '2011'
  },
  {
    id: 'knuba-college',
    institution: {
      en: 'Mykolaiv Professional College of KNUBA',
      uk: 'Миколаївський фаховий коледж КНУБА'
    },
    degree: { en: 'Bachelor', uk: 'Бакалавр' },
    from: '2005',
    to: '2010'
  }
]

export const languages: Cv['languages'] = [
  {
    id: 'uk',
    name: { en: 'Ukrainian', uk: 'Українська' },
    level: { en: 'Native', uk: 'Рідна' }
  },
  {
    id: 'ru',
    name: { en: 'Russian', uk: 'Російська' },
    level: { en: 'Native', uk: 'Рідна' }
  },
  {
    id: 'en',
    name: { en: 'English', uk: 'Англійська' },
    level: { en: 'Working technical', uk: 'Робоча технічна' }
  }
]
